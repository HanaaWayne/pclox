import React, { useState, useEffect } from "react";
import { useUser } from "../contexts/UserContext"; // Importation du contexte utilisateur
import "../styles/Catalog.css";
import "../styles/PcPage.css";
import AddLaptop from "../component/AddLaptop";
import { useNavigate } from "react-router-dom";

const CatalogContent = () => {
  const [laptops, setLaptops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdd, setIsAdd] = useState(false);
  const navigate = useNavigate();

  const { user, API_BASE_URL } = useUser();
  const schoolId = user.role === "SCHOOL" ? user.id : user?.school?.id;

  useEffect(() => {
    fetchLaptops();
  }, [schoolId]);

  const fetchLaptops = async () => {
    const token = localStorage.getItem("token"); // Récupère le token d'authentification
    if (!token) {
      setError("Veuillez vous connecter pour voir les ordinateurs.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/school/${schoolId}/laptops`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Ajoute le token dans les en-têtes
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors du chargement des données");
      }

      const data = await response.json();

      // Filtrage des laptops : exclure ceux qui sont réservés (occupied) ou non disponibles (available === false)
      const filteredLaptops = user.role === "SCHOOL" ? data : data.filter((laptop) => !laptop.occupied && laptop.available);
      setLaptops(filteredLaptops);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLaptopAdded = () => {
    fetchLaptops();
    setIsAdd(false);
  };

  if (loading) return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "100px" }}>Chargement...</p>;
  if (error) return <p style={{  textAlign: "center", fontSize: "18px", marginTop: "100px"  }}>Erreur : {error}</p>;
 
  return (
    <div className="content-laptops">
      <div className="content-pc-list">
        {isAdd ? (
          <AddLaptop onCancel={() => setIsAdd(false)} handleLaptopAdded={handleLaptopAdded} />
        ) : (
          <>
            <div className="content-item">
              {user.role === "SCHOOL" && (
                <button className="button-add" onClick={() => setIsAdd(true)}>
                  Ajouter
                </button>
              )}
              <legend className="title-item">Ecran</legend>
              <div className="items">
                <input type="checkbox" id="size13_1" className="input-item" />
                <label htmlFor="size13_1" className="details-item">10 à 12"</label>
              </div>
              <div className="items">
                <input type="checkbox" id="size14_1" className="input-item" />
                <label htmlFor="size14_1" className="details-item">13 à 14"</label>
              </div>
              <div className="items">
                <input type="checkbox" id="size15_1" className="input-item" />
                <label htmlFor="size15_1" className="details-item">15 à 17"</label>
              </div>

              <legend className="title-item">Processeur</legend>
              <div className="items">
                <input type="checkbox" id="processor_intel" className="input-item" />
                <label htmlFor="processor_intel" className="details-item">Intel</label>
              </div>
              <div className="items">
                <input type="checkbox" id="processor_amd" className="input-item" />
                <label htmlFor="processor_amd" className="details-item">AMD</label>
              </div>
              <div className="items">
                <input type="checkbox" id="processor_apple_m" className="input-item" />
                <label htmlFor="processor_apple_m" className="details-item">Apple M</label>
              </div>

              <legend className="title-item">RAM</legend>
              <div className="items">
                <input type="checkbox" id="ram_4" className="input-item" />
                <label htmlFor="ram_4" className="details-item">4 Go</label>
              </div>
              <div className="items">
                <input type="checkbox" id="ram_8" className="input-item" />
                <label htmlFor="ram_8" className="details-item">8 Go</label>
              </div>
              <div className="items">
                <input type="checkbox" id="ram_16" className="input-item" />
                <label htmlFor="ram_16" className="details-item">16 Go</label>
              </div>
              <div className="items">
                <input type="checkbox" id="ram_32" className="input-item" />
                <label htmlFor="ram_32" className="details-item">32 Go</label>
              </div>
              <div className="items">
                <input type="checkbox" id="ram_64" className="input-item" />
                <label htmlFor="ram_64" className="details-item">64 Go</label>
              </div>
            </div>

            <div className="content-card">
              {laptops.length === 0 ? (
                <p style={{ textAlign: "center", fontSize: "14px", marginTop: "20px", width: "100%" }}>
                  Il n'y a aucun ordinateur enregistré.
                </p>
              ) : (
                laptops.map((laptop) => (
                  <div
                    className={`card ${laptop.occupied ? "occupied" : ""}`} // Ajout de la classe 'occupied' si le PC est occupé
                    key={laptop.id}
                    onClick={() => navigate(`/pc/${laptop.id}`)}
                  >
                    <div className="image-card"></div>
                    <div className="content-card-item">
                      <p className="title-card">{laptop.brand.charAt(0).toUpperCase() + laptop.brand.slice(1)}</p>
                      <p className="item-card">Écran: {laptop.screen}"</p>
                      <p className="item-card">Processeur: {laptop.processor}</p>
                      <p className="item-card">RAM: {laptop.ram}Go</p>
                      <p className="item-card">GPU: {laptop.gpu}</p>
                      {laptop.occupied && <p className="item-card">Occupé</p>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogContent;
