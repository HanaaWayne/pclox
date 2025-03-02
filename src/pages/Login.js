import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useUser } from "../contexts/UserContext";

const Login = () => {
  const { login, API_BASE_URL } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  console.log("URL API Backend :", API_BASE_URL);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Email requis.");
      return;
    }
    if (!password) {
      setError("Mot de passe requis.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;

        if (token) {
          login(token); // On passe seulement le token
          console.log("Token stocké dans localStorage :", localStorage.getItem("token")); // 🔍 Vérification
          navigate("/menu"); // Redirection après connexion
        } else {
          setError("Aucun token reçu. Veuillez réessayer.");
        }
      } else {
        setError("Email ou mot de passe incorrect.");
      }
    } catch (error) {
      console.error("Erreur de connexion", error);
      setError("Erreur serveur, veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="container-content-login">
      <div className="container-login">
        <div className="content-login">
          <p className="content-title-login">Se connecter</p>
          <form onSubmit={handleSubmit} className="form-register">
            <input
              type="email"
              placeholder="Email"
              className="input-login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              className="input-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>}
            <p className="password">Mot de passe oublié ?</p>
            <button type="submit" className="button-login">
              Se connecter
            </button>
          </form>
          <p className="question">
            Vous n'avez pas encore de compte ?{" "}
            <span className="question-bis">Créez un compte</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
