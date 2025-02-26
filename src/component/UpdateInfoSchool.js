import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/Catalog.css";
import "../styles/UpdateInfo.css";

const UpdateInfoSchool = ({ onCancel, email, phoneNumber, schoolName, addressComplement, street, codePostal, city }) => {
  const { user, updateUser } = useUser();
  const [newEmail, setNewEmail] = useState(email);
  const [newPhoneNumber, setNewPhoneNumber] = useState(phoneNumber);
  const [newSchoolName, setNewSchoolName] = useState(schoolName);
  const [newStreet, setNewStreet] = useState(street);
  const [newAddressComplement, setNewAddressComplement] = useState(addressComplement);
  const [newCodePostal, setNewCodePostal] = useState(codePostal);
  const [newCity, setNewCity] = useState(city);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const schoolId = user.role === "SCHOOL" && user?.id;
  const token = localStorage.getItem("token");

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    value = value.replace(/(\d{2})/g, "$1 ").trim();
    setNewPhoneNumber(value);
  };

  const handlePostalCodeChange = (e) => {
    setNewCodePostal(e.target.value.replace(/\D/g, "").slice(0, 5));
  };

  const validateFields = () => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!newSchoolName.trim()) errors.schoolName = "Le nom de l'établissement est requis.";
    if (!newPhoneNumber.trim()) {
      errors.phoneNumber = "Le numéro de téléphone est requis.";
    } else if (newPhoneNumber.replace(/\s/g, "").length !== 10) {
      errors.phoneNumber = "Le numéro de téléphone doit contenir 10 chiffres.";
    }
    if (!newStreet.trim()) errors.street = "L'adresse est requise.";
    if (!newCodePostal.trim()) {
      errors.postalCode = "Le code postal est requis.";
    } else if (newCodePostal.length !== 5) {
      errors.postalCode = "Le code postal doit contenir 5 chiffres.";
    }
    if (!newCity.trim()) errors.city = "La ville est requise.";
    if (!newEmail.trim()) {
      errors.email = "L'email est requis.";
    } else if (!emailRegex.test(newEmail)) {
      errors.email = "L'email n'est pas valide.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) return;

    const updatedSchool = {
      email: newEmail,
      phoneNumber: newPhoneNumber,
      schoolName: newSchoolName,
      street: newStreet,
      addressComplement: newAddressComplement,
      postalCode: newCodePostal,
      city: newCity,
    };

    try {
      const response = await fetch(`http://localhost:8082/api/school/${schoolId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSchool),
      });

      if (response.ok) {
        updateUser({ ...user, school: { ...user.school, ...updatedSchool } });
        onCancel(false);
      } else {
        const message = await response.text();
        if (message.toLowerCase().includes("email")) {
          setError("Cet email est déjà utilisé.");
        } else if (message.toLowerCase().includes("numéro de téléphone")) {
          setError("Ce numéro de téléphone est déjà utilisé.");
        } else {
          setError("Erreur lors de la mise à jour. Veuillez réessayer.");
        }
      }
    } catch (error) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  return (
    <div>
      <form className="content-info-edit" onSubmit={handleSubmit}>
        <div className="content-flex">
          <div className="card-info-edit">
            <div className="content-card-info-edit">
              <p className="title-info">Coordonnées</p>

              <label className="label">N° téléphone:</label>
              <input type="tel" value={newPhoneNumber} onChange={handlePhoneChange} className="input-edit" />
              {fieldErrors.phoneNumber && <p className="error-message">{fieldErrors.phoneNumber}</p>}

              <p className="title-info">Établissement</p>
              <label className="label">Nom:</label>
              <input type="text" value={newSchoolName} onChange={(e) => setNewSchoolName(e.target.value)} className="input-edit" />
              {fieldErrors.schoolName && <p className="error-message">{fieldErrors.schoolName}</p>}

              <label className="label">Numéro & Rue:</label>
              <input type="text" value={newStreet} onChange={(e) => setNewStreet(e.target.value)} className="input-edit" />
              {fieldErrors.street && <p className="error-message">{fieldErrors.street}</p>}

              <label className="label">Complément d'adresse:</label>
              <input type="text" value={newAddressComplement} onChange={(e) => setNewAddressComplement(e.target.value)} className="input-edit" />

              <label className="label">Code postal:</label>
              <input type="text" value={newCodePostal} onChange={handlePostalCodeChange} className="input-edit" />
              {fieldErrors.postalCode && <p className="error-message">{fieldErrors.postalCode}</p>}

              <label className="label">Ville:</label>
              <input type="text" value={newCity} onChange={(e) => setNewCity(e.target.value)} className="input-edit" />
              {fieldErrors.city && <p className="error-message">{fieldErrors.city}</p>}

              <div className="content-edit-button">
                <button type="submit" className="edit-button">Modifier</button>
                <button type="button" className="edit-button-cancel" onClick={onCancel}>Annuler</button>
              </div>
              {error && <p className="error-message">{error}</p>}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateInfoSchool;
