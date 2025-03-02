import React, { useState } from "react";
import { useUser } from "../contexts/UserContext";
import "../styles/AddLaptop.css";
import "../styles/PcPage.css";

const AddLaptop = ({ onCancel, handleLaptopAdded }) => {
  const { user, API_BASE_URL  } = useUser();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [processor, setProcessor] = useState("");
  const [ram, setRam] = useState("");
  const [storage, setStorage] = useState("");
  const [operatingSystem, setOperatingSystem] = useState("");
  const [gpu, setGpu] = useState("");
  const [screen, setScreen] = useState("");

  const schoolId = user?.id;

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

  const handleRamChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    setRam(value);
  };

  const handleScreenChange = (e) => {
    const value = e.target.value.slice(0, 4);
    setScreen(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validateFields()) return;

    const laptop = {
      brand,
      model,
      processor,
      ram: parseInt(ram, 10),
      storage,
      operatingSystem,
      gpu,
      screen,
      schoolId,
    };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/laptops/create/${schoolId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(laptop),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Ajout réussi !");
        setTimeout(() => {
              handleLaptopAdded();
        }, 1000);
    
      } else {
        setError(data.message || "Erreur lors de l'ajout du laptop.");
      }
    } catch (error) {
      setError("Erreur serveur, veuillez réessayer plus tard.");
    }
  };

  return (
    <div className="container-content-form">
      <div className="container-form">
        <div className="content-form-laptop">
          <form onSubmit={handleSubmit} className="form-register-laptop">
            <input type="text" name="brand" placeholder="Marque" className="input-add" value={brand} onChange={(e) => setBrand(e.target.value)} />
            {fieldErrors.brand && <p className="error-message">{fieldErrors.brand}</p>}

            <input type="text" name="model" placeholder="Modèle" className="input-add" value={model} onChange={(e) => setModel(e.target.value)} />
            {fieldErrors.model && <p className="error-message">{fieldErrors.model}</p>}

            <input type="text" name="processor" placeholder="Processeur" className="input-add" value={processor} onChange={(e) => setProcessor(e.target.value)} />
            {fieldErrors.processor && <p className="error-message">{fieldErrors.processor}</p>}

            <input type="text" name="ram" placeholder="RAM (Go)" className="input-add" value={ram} onChange={handleRamChange} />
            {fieldErrors.ram && <p className="error-message">{fieldErrors.ram}</p>}

            <input type="text" name="storage" placeholder="Stockage" className="input-add" value={storage} onChange={(e) => setStorage(e.target.value)} />
            {fieldErrors.storage && <p className="error-message">{fieldErrors.storage}</p>}

            <input type="text" name="operatingSystem" placeholder="Système d'exploitation" className="input-add" value={operatingSystem} onChange={(e) => setOperatingSystem(e.target.value)} />
            {fieldErrors.operatingSystem && <p className="error-message">{fieldErrors.operatingSystem}</p>}

            <input type="text" name="gpu" placeholder="Carte graphique" className="input-add" value={gpu} onChange={(e) => setGpu(e.target.value)} />
            {fieldErrors.gpu && <p className="error-message">{fieldErrors.gpu}</p>}

            <input type="text" name="screen" placeholder="Taille écran (pouces)" className="input-add" value={screen} onChange={handleScreenChange} />
            {fieldErrors.screen && <p className="error-message">{fieldErrors.screen}</p>}

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}

            <div className="content-add-button">
              <button type="submit" className="add-button">Ajouter</button>
              <button type="button" className="add-button-cancel" onClick={() => onCancel(false)}>Annuler</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddLaptop;
