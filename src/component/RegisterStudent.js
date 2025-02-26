import React, { useState, useEffect } from "react";
import "../styles/Register.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterStudent = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [school, setSchool] = useState("");
  const [selectedOption, setSelectedOption] = useState(
    "Sélectionner un établissement"
  );
  const [schools, setSchools] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    value = value.slice(0, 10);
    value = value.replace(/(\d{2})/g, "$1 ").trim();
    setPhoneNumber(value);
  };

  const handleOptionClick = (school) => {
    setSelectedOption(school.schoolName);
    setSchool(school.id);
    setIsActive(false);
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8082/api/school/all",
          { withCredentials: true }
        );
        setSchools(response.data);
      } catch (error) {
        // Gestion de l'erreur sans affichage dans la console
      }
    };
    fetchSchools();
  }, []);

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,20}$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]{1,64}@[a-zA-Z0-9.-]{1,184}\.[a-zA-Z]{2,}$/;
  
  const validateFields = () => {
    let errors = {};
    if (!firstName) errors.firstName = "Le prénom est requis.";
    if (!lastName) errors.lastName = "Le nom est requis.";
    if (!phoneNumber) {
      errors.phoneNumber = "Le numéro de téléphone est requis.";
    } else if (phoneNumber.replace(/\s/g, "").length !== 10) {
      errors.phoneNumber = "Le numéro de téléphone doit contenir 10 chiffres.";
    }
    if (!email) {
      errors.email = "L'email est requis.";
    } else if (!emailRegex.test(email)) {
      errors.email = "L'email n'est pas valide.";
    }
    if (!password) {
      errors.password = "Le mot de passe est requis.";
    } else if (!passwordRegex.test(password)) {
      errors.password =
        "Le mot de passe doit contenir entre 8 et 20 caractères, avec au moins une majuscule, une minuscule, un chiffre et un caractère spécial @#$%^&+=!.";
    }
    if (!school) errors.school = "Veuillez sélectionner un établissement.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateFields()) return;

    const userData = {
      firstName,
      lastName,
      phoneNumber,
      email,
      password,
      school: { id: school },
      role: "STUDENT",
    };

    try {
      await axios.post("http://localhost:8082/api/user/signup", userData, {
        withCredentials: true,
      });

      setSuccess("Inscription réussie !");
      setError("");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      if (err.response && typeof err.response.data === "string") {
        const message = err.response.data.toLowerCase(); // Convertir en minuscules pour éviter la casse

        if (
          message.includes("numéro de téléphone") ||
          message.includes("phone")
        ) {
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
    <div className="content-register-student">
      <p className="content-title-register">Créer un compte pour un élève</p>
      <form onSubmit={handleSubmit} className="form-register">
        <input
          type="text"
          placeholder="Prénom"
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        {fieldErrors.firstName && (
          <p className="error-message">{fieldErrors.firstName}</p>
        )}

        <input
          type="text"
          placeholder="Nom"
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        {fieldErrors.lastName && (
          <p className="error-message">{fieldErrors.lastName}</p>
        )}

        <input
          type="text"
          placeholder="Numéro de téléphone"
          className="phone-input"
          value={phoneNumber}
          onChange={handlePhoneChange}
        />
        {fieldErrors.phoneNumber && (
          <p className="error-message">{fieldErrors.phoneNumber}</p>
        )}

        <div className="custom-select" onClick={() => setIsActive(!isActive)}>
          <span className="selected-option">{selectedOption}</span>
          {isActive && (
            <div className="options">
              {schools.map((school) => (
                <div
                  key={school.id}
                  className="option"
                  onClick={() => handleOptionClick(school)}
                >
                  {school.schoolName}
                </div>
              ))}
            </div>
          )}
        </div>
        {fieldErrors.school && (
          <p className="error-message">{fieldErrors.school}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {fieldErrors.email && (
          <p className="error-message">{fieldErrors.email}</p>
        )}

        <input
          type="password"
          placeholder="Mot de passe"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {fieldErrors.password && (
          <p className="error-message">{fieldErrors.password}</p>
        )}

        <button type="submit" className="button-register">
          S'inscrire
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
    </div>
  );
};

export default RegisterStudent;
