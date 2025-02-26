import React, { useEffect, useState } from "react";
import "../styles/Catalog.css";
import { useUser } from "../contexts/UserContext"; // Importation du contexte utilisateur
import { useNavigate } from "react-router-dom";
import { GrValidate } from "react-icons/gr";

// URL de l'API (assurez-vous que l'URL de votre backend est correcte)
const CANCEL_URL = "http://localhost:8082/api/reservations/cancel"; // URL pour annuler la réservation
const API_URL_SCHOOL = "http://localhost:8082/api/reservations/school"; // Récupérer les réservations de l'établissement
const VALIDATE_URL = "http://localhost:8082/api/reservations/validate"; // URL pour valider la réservation

const ReservationTrackingSchool = () => {
  const [reservations, setReservations] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser(); // Récupération de l'utilisateur connecté
  const schoolId = user.role === "SCHOOL" ? user?.id : null; // Vérifier si l'utilisateur est une école

  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
        const response = await fetch(`${API_URL_SCHOOL}/${schoolId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setReservations(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des réservations:", error);
      }
    };

    fetchReservations();
  }, [schoolId]); // Recharger si l'ID de l'établissement change

  if (reservations.length === 0) {
    return <p style={{ color: "black", fontSize: 13 }}>Aucune réservation pour votre établissement.</p>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : "Date invalide";
  };

  const handleCancelReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
      const response = await fetch(`${CANCEL_URL}/${reservationId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setReservations((prev) => prev.filter((r) => r.id !== reservationId));
        navigate("/catalog");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
    }
  };

  const handleValidateReservation = async (reservationId) => {
    try {
      const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
      const response = await fetch(`${VALIDATE_URL}/${reservationId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setReservations((prev) =>
          prev.map((reservation) =>
            reservation.id === reservationId ? { ...reservation, approved: true } : reservation
          )
        );
      }
    } catch (error) {
      console.error("Erreur lors de la validation de la réservation:", error);
    }
  };

  if (!reservations) {
    return <p style={{ color: "black", fontSize: 13, marginTop: "100px" }}>Chargement des données.</p>;
  }

  return (
    <div className="container-reservation">
      <div className="content-reservation">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="card-reservation">
            <div className="content-card-reservation">
              <p className="title-card">{capitalizeFirstLetter(reservation.laptop?.brand)}</p>
              <p className="item-card">Du {formatDate(reservation.startDate)}</p>
              <p className="item-card">Au {formatDate(reservation.endDate)}</p>
              <p className="item-card">
                {reservation.approved ? (
                  <span className="validate-icons">
                    <GrValidate /> Validée
                  </span>
                ) : (
                  "En attente de validation"
                )}
              </p>
              {!reservation.approved && (
                <button
                  className="reservation-button-validate"
                  onClick={() => handleValidateReservation(reservation.id)}
                >
                  Valider
                </button>
              )}
              <button
                className="reservation-button-cancel"
                onClick={() => handleCancelReservation(reservation.id)}
              >
                Annuler
              </button>
            </div>

            <div className="content-card-reservation-1">
              <p className="item-card">
                Nom: {capitalizeFirstLetter(reservation.user.lastName)} <br />
                Prénom: {capitalizeFirstLetter(reservation.user.firstName)} <br />
                Email: {reservation.user.email} <br />
                Téléphone: {reservation.user.phoneNumber}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReservationTrackingSchool;
