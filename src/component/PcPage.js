import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import "../styles/Catalog.css";
import "../styles/PcPage.css";
import UpdatePc from "./UpdatePc";

const PcPage = () => {
  const { id } = useParams();
  const [laptop, setLaptop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [hasReservation, setHasReservation] = useState(false);
  const [reservationError, setReservationError] = useState("");
  const [deleteError, setDeleteError] = useState("");
   const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { user, API_BASE_URL } = useUser();
  const laptopId = laptop?.id;
  const userId = user.role === "STUDENT" && user?.id;
  const schoolId = user?.school?.id;

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchLaptop = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_BASE_URL}/api/laptops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Erreur lors du chargement des données");
        }

        const data = await response.json();
        setLaptop(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLaptop();
  }, [id]);

  useEffect(() => {
    const checkReservation = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reservations/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );

        if (response.ok) {
          const reservations = await response.json();
          setHasReservation(reservations.length > 0);
        }
      } catch (error) {
        setError("Erreur lors de la vérification des réservations");
      }
    };

    checkReservation();
  }, [user]);

  const handleReserve = async () => {
    setReservationError("");

    if (!startDate || !endDate) {
      setReservationError("Veuillez sélectionner les dates de début et de fin.");
      return;
    }

    if (hasReservation) {
      setReservationError("Vous avez déjà une réservation active.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/reservations/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: new URLSearchParams({ laptopId, userId, schoolId, startDate, endDate }).toString(),
      });

      setSuccess("Réservation réussie !");

      if (response.ok) {
        setTimeout(() => {
          navigate("/catalog");
        }, 1000);
      } else {
        setReservationError("Erreur lors de la réservation.");
      }
    } catch {
      setReservationError("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  const handleDelete = async () => {
    setDeleteError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/laptops/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression du laptop");
      }
      setSuccess("Suppression réussie !");
      setTimeout(() => {
        navigate("/catalog");
      }, 1000);
     
    } catch (error) {
      setDeleteError("Impossible de supprimer ce PC.");
    }
  };

  if (loading) return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "100px" }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "100px" }}>Erreur : {error}</p>;
  if (!laptop) return <p style={{ textAlign: "center", fontSize: "18px", marginTop: "100px" }}>Aucun PC trouvé.</p>;

  return (
    <div className="container-content-catalog">
      <div className="container-pc">
        {isEditing ? (
          <UpdatePc onCancel={() => setIsEditing(false)} laptop={laptop} />
        ) : (
          <>
            <div className="content-pc">
              <div>
                <div className="image-card-pc"></div>
              </div>
              <div className="card-pc">
                <div className="content-card-pc">
                  <p className="item-card">Nom: {capitalizeFirstLetter(laptop.brand)}</p>
                  <p className="item-card">Modèle: {capitalizeFirstLetter(laptop.model)}</p>
                  <p className="item-card">Processeur: {laptop.processor}</p>
                  <p className="item-card">RAM: {laptop.ram}Go</p>
                  <p className="item-card">Stockage: {laptop.storage}</p>
                  <p className="item-card">Système d'exploitation: {laptop.operatingSystem}</p>
                  <p className="item-card">Processeur graphique: {laptop.gpu}</p>
                  <p className="item-card">Écran: {laptop.screen}"</p>
                  {user.role === "SCHOOL" && (
                    <>
                      <p className="item-card">Disponible: {laptop.available ? "oui" : "non"}</p>
                      <p className="item-card">Occupé: {laptop.occupied ? "oui" : "non"}</p>
                    </>
                  )}
                  {success && <p className="success-message">{success}</p>}
                </div>
              </div>
              <div className="pc-button-content">
                {user.role === "SCHOOL" ? (
                  <>
                    <button className="pc-button" onClick={() => setIsEditing(true)}>
                      Modifier
                    </button>
                    <button className="pc-button-cancel" onClick={handleDelete}>
                      Supprimer
                    </button>
                    {deleteError && <p className="error-message">{deleteError}</p>}
                  </>
                ) : hasReservation ? (
                  <p style={{ color: "red", fontSize: 12, fontFamily: "Roboto" }}>
                    Vous avez déjà une réservation en cours. <br />
                    Veuillez annuler celle en cours si vous <br />
                    voulez réserver cet ordinateur!
                  </p>
                ) : (
                  <>
                    <input
                      type="date"
                      className="input-reservation-date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      className="input-reservation-date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                    />
                    <button className="pc-button" onClick={handleReserve}>
                      Réserver
                    </button>
                    {reservationError && <p className="error-message">{reservationError}</p>}
                  </>
                )}
                <Link to="/catalog">
                  <button className="pc-button-back">Retour</button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PcPage;
