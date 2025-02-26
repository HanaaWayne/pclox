import React, { useState } from "react";
import "../styles/Catalog.css";
import "../styles/UpdateInfo.css";

const UpdateLaptopInfo = ({ onCancel, laptop }) => {
  const [brand, setBrand] = useState(laptop.brand);
  const [model, setModel] = useState(laptop.model);
  const [processor, setProcessor] = useState(laptop.processor);
  const [ram, setRam] = useState(laptop.ram.toString());
  const [storage, setStorage] = useState(laptop.storage);
  const [operatingSystem, setOperatingSystem] = useState(laptop.operatingSystem);
  const [gpu, setGpu] = useState(laptop.gpu);
  const [screen, setScreen] = useState(laptop.screen.toString());
  const [available, setAvailable] = useState(laptop.available);
  const [occupied, setOccupied] = useState(laptop.occupied);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Validation des champs requis
  const validateFields = () => {
    let errors = {};
    if (!brand) errors.brand = "La marque est requise.";
    if (!model) errors.model = "Le modèle est requis.";
    if (!processor) errors.processor = "Le processeur est requis.";
    if (!ram) errors.ram = "La RAM est requise.";
    if (!storage) errors.storage = "Le stockage est requis.";
    if (!operatingSystem) errors.operatingSystem = "Le système d'exploitation est requis.";
    if (!gpu) errors.gpu = "La carte graphique est requise.";
    if (!screen) errors.screen = "La taille de l'écran est requise.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gestion de la RAM : chiffres uniquement, limité à 2 caractères
  const handleRamChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setRam(value);
  };

  // Gestion de la taille d'écran : limité à 4 caractères
  const handleScreenChange = (e) => {
    const value = e.target.value.slice(0, 4);
    setScreen(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateFields()) return;

    const updatedLaptop = {
      brand,
      model,
      processor,
      ram: parseInt(ram, 10),
      storage,
      operatingSystem,
      gpu,
      screen,
      available,
      occupied,
    };

    try {
      const response = await fetch(`http://localhost:8082/api/laptops/${laptop.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedLaptop),
      });

      if (response.ok) {
        onCancel(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Erreur lors de la mise à jour.");
      }
    } catch (error) {
      setError("Erreur de connexion, veuillez réessayer.");
    }
  };

  return (
    <form className="container-pc-edit" onSubmit={handleSubmit}>
      <div className="content-pc">
        <div className="card-info-edit">
          <div className="content-card-info-edit">
            <p className="title-info">Modifier les informations du PC</p>

            <label className="label">Marque:</label>
            <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} className="input-edit" />
            {fieldErrors.brand && <p className="error-message">{fieldErrors.brand}</p>}

            <label className="label">Modèle:</label>
            <input type="text" value={model} onChange={(e) => setModel(e.target.value)} className="input-edit" />
            {fieldErrors.model && <p className="error-message">{fieldErrors.model}</p>}

            <label className="label">Processeur:</label>
            <input type="text" value={processor} onChange={(e) => setProcessor(e.target.value)} className="input-edit" />
            {fieldErrors.processor && <p className="error-message">{fieldErrors.processor}</p>}

            <label className="label">RAM (Go):</label>
            <input type="text" value={ram} onChange={handleRamChange} className="input-edit" />
            {fieldErrors.ram && <p className="error-message">{fieldErrors.ram}</p>}

            <label className="label">Stockage:</label>
            <input type="text" value={storage} onChange={(e) => setStorage(e.target.value)} className="input-edit" />
            {fieldErrors.storage && <p className="error-message">{fieldErrors.storage}</p>}

            <label className="label">Système d'exploitation:</label>
            <input type="text" value={operatingSystem} onChange={(e) => setOperatingSystem(e.target.value)} className="input-edit" />
            {fieldErrors.operatingSystem && <p className="error-message">{fieldErrors.operatingSystem}</p>}

            <label className="label">Carte graphique:</label>
            <input type="text" value={gpu} onChange={(e) => setGpu(e.target.value)} className="input-edit" />
            {fieldErrors.gpu && <p className="error-message">{fieldErrors.gpu}</p>}

            <label className="label">Taille écran (pouces):</label>
            <input type="text" value={screen} onChange={handleScreenChange} className="input-edit" />
            {fieldErrors.screen && <p className="error-message">{fieldErrors.screen}</p>}

            <div className="label-checkbox-pc">
              <label className="label">Disponible:</label>
              <input type="checkbox" checked={available} onChange={(e) => setAvailable(e.target.checked)} className="checkbox-pc" />
            </div>

            <div className="label-checkbox-pc">
              <label className="label">Occupé:</label>
              <input type="checkbox" checked={occupied} onChange={(e) => setOccupied(e.target.checked)} className="checkbox-pc" />
            </div>

            {error && <p className="error-message">{error}</p>}

            <div className="content-edit-button">
              <button type="submit" className="edit-button">Modifier</button>
              <button type="button" className="edit-button-cancel" onClick={onCancel}>Annuler</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UpdateLaptopInfo;
