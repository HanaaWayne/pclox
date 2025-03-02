import React, { useState } from "react";
import "../styles/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const RegisterSchool = () => {
  const { login, API_BASE_URL } = useUser();
  const [schoolName, setSchoolName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [street, setStreet] = useState("");
  const [adresseComplement, setAdresseComplement] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const navigate = useNavigate();

  // Formatage du numéro de téléphone
  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    value = value.replace(/(\d{2})/g, "$1 ").trim();
    setPhoneNumber(value);
  };

  // Formatage du code postal
  const handlePostalCodeChange = (e) => {
    setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5));
  };

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,184}\.[a-zA-Z]{2,}$/;

  // Validation des champs
  const validateFields = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!schoolName.trim()) errors.schoolName = "Le nom de l'établissement est requis.";
    if (!phoneNumber.trim()) {
      errors.phoneNumber = "Le numéro de téléphone est requis.";
    } else if (phoneNumber.replace(/\s/g, "").length !== 10) {
      errors.phoneNumber = "Le numéro de téléphone doit contenir 10 chiffres.";
    }
    if (!street.trim()) errors.street = "L'adresse est requise.";
    if (!postalCode.trim()) {
      errors.postalCode = "Le code postal est requis.";
    } else if (postalCode.length !== 5) {
      errors.postalCode = "Le code postal doit contenir 5 chiffres.";
    }
    if (!city.trim()) errors.city = "La ville est requise.";
    if (!email) {
      errors.email = "L'email est requis.";
    } else if (!emailRegex.test(email)) {
      errors.email = "L'email n'est pas valide.";
    }
    if (!password) {
      errors.password = "Le mot de passe est requis.";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Le mot de passe doit contenir entre 8 et 20 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateFields()) return;

    const userData = {
      schoolName,
      phoneNumber,
      street,
      adresseComplement,
      postalCode,
      city,
      email,
      password,
      role: "SCHOOL",
    };

    try {
      await axios.post(`${API_BASE_URL}/api/school/signup`, userData, {
        withCredentials: true,
      });

      setSuccess("Inscription réussie !");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && typeof err.response.data === "string") {
        const message = err.response.data.toLowerCase();

        if (message.includes("numéro de téléphone") || message.includes("phone")) {
          setError("Ce numéro de téléphone est déjà utilisé.");
        } else if (message.includes("email")) {
          setError("Cet email est déjà utilisé.");
        } else {
          setError("Erreur lors de l'inscription. Veuillez réessayer.");
        }
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }

      setSuccess("");
    }
  };

  return (
    <div className="content-register-school">
      <p className="content-title-register">Créer un compte pour un établissement</p>
      <form className="form-register" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nom de l'établissement"
          className="input"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
        />
        {fieldErrors.schoolName && <p className="error-message">{fieldErrors.schoolName}</p>}

        <input
          type="text"
          placeholder="Numéro de téléphone"
          className="phone-input"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
        {fieldErrors.phoneNumber && <p className="error-message">{fieldErrors.phoneNumber}</p>}

        <input
          type="text"
          placeholder="Numéro & rue"
          className="input"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        {fieldErrors.street && <p className="error-message">{fieldErrors.street}</p>}

        <input
          type="text"
          placeholder="Complément adresse"
          className="input"
          value={adresseComplement}
          onChange={(e) => setAdresseComplement(e.target.value)}
        />

        <div className="input-group">
          <input
            type="text"
            placeholder="Code postal"
            className="code-postal"
            value={postalCode}
            onChange={handlePostalCodeChange}
          />
          {fieldErrors.postalCode && <p className="error-message">{fieldErrors.postalCode}</p>}

          <input
            type="text"
            placeholder="Ville"
            className="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
          {fieldErrors.city && <p className="error-message">{fieldErrors.city}</p>}
        </div>

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}

        <input
          type="password"
          placeholder="Mot de passe"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}

        <button type="submit" className="button-register">S'inscrire</button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default RegisterSchool;
