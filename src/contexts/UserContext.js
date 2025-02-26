import { createContext, useState, useEffect, useContext } from "react";

// Créer un contexte pour l'utilisateur
const UserContext = createContext(null);

// Fournisseur du contexte
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ajout de l'état d'erreur

  // Flag pour éviter le rendu avant que les données soient chargées
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Fonction pour récupérer les infos de l'utilisateur avec le token
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8082/api/user/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData); // Ne pas stocker dans le localStorage
        setError(null); // Réinitialisation de l'erreur si la requête réussit
      } else {
        setUser(null);
        setError("Erreur : utilisateur non valide");
      }
    } catch (error) {
      setUser(null);
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
      setIsInitialLoad(false); // Signale la fin du chargement initial
    }
  };

  // Charge les données de l'utilisateur au démarrage
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Si le token est valide, on appelle l'API pour récupérer l'utilisateur
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
      setIsInitialLoad(false); // Signale la fin du chargement initial sans données utilisateur
    }
  }, []);

  // Fonction de connexion qui met à jour l'utilisateur
  const login = (token) => {
    localStorage.setItem("token", token);
    fetchUserData(); // Récupère les infos de l'utilisateur après connexion
  };

  // Fonction de déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token"); // Supprime uniquement le token du localStorage
  };

  // Mise à jour de l'utilisateur dans le contexte
  const updateUser = (updatedUserData) => {
    setUser(updatedUserData);
  };

  // Attendre que le chargement initial soit terminé avant de rendre l'application
  if (isInitialLoad) {
    return null; // On n'affiche rien avant d'avoir fini de charger les données
  }

  return (
    <UserContext.Provider value={{ user, login, logout, loading, error, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personnalisé pour récupérer l'utilisateur et les actions
export const useUser = () => {
  return useContext(UserContext);
};