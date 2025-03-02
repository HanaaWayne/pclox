import React, { useEffect, useState } from "react";
import "../styles/Catalog.css";
import { useUser } from "../contexts/UserContext"; // Importation du contexte utilisateur
import { useNavigate } from "react-router-dom";
import { GrValidate } from "react-icons/gr";


const ReservationTracking = () => {
  // État pour stocker la réservation
  const [reservation, setReservation] = useState(null);
  const navigate = useNavigate();
  const { user, API_BASE_URL } = useUser(); // Récupération de l'utilisateur connecté
  const userId = user.role === "STUDENT" && user?.id; // Récupérer l'ID de l'utilisateur

  // URL de l'API (assurez-vous que l'URL de votre backend est correcte)
const API_URL =  `${API_BASE_URL}/api/reservations/user`; // Assurez-vous que cette URL est correcte
const CANCEL_URL = `${API_BASE_URL}/api/reservations/cancel`; // URL pour annuler la réservation


  // Récupérer la réservation de l'utilisateur au montage du composant
  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
        const response = await fetch(`${API_URL}/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
          },
        });
        if (response.ok) {
          const data = await response.json();
          setReservation(data[0]); // Accéder au premier élément du tableau
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la réservation:", error);
      }
    };

    fetchReservation();
  }, [userId]); // Recharger la réservation si l'ID de l'utilisateur change

  const handleCancelReservation = async (reservationId) => {
    if (!reservation.id) return;

    try {
      const token = localStorage.getItem("token"); // Récupérer le token depuis le localStorage
      const response = await fetch(`${CANCEL_URL}/${reservation.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // Ajouter le token dans les en-têtes
        },
      });

      if (response.ok) {
        setReservation(null); // Mise à jour de l'état pour supprimer l'affichage
        navigate("/catalog");
      }
    } catch (error) {
      console.error("Erreur lors de l'annulation de la réservation:", error);
    }
  };

  // Si aucune réservation n'est trouvée, afficher un message
  if (!reservation) {
    return <p style={{ color: "black", fontSize: 13 }}>Vous n'avez pas encore de réservations.</p>;
  }

  // Fonction pour formater les dates correctement
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) ? date.toLocaleDateString() : "Date invalide";
  };

  return (
    <div className="container-reservation">
      <div className="content-reservation">
        <div className="card-reservation">
          <div className="content-card-reservation">
            {/* Affichage des informations de la réservation */}
            <p className="title-card">{reservation.laptop?.brand}</p>
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

            {/* Affichage du bouton Annuler uniquement si la réservation n'est pas approuvée pour l'élève */}
            {!reservation.approved && (
              <button className="reservation-button-cancel" onClick={() => handleCancelReservation(reservation.id)}>
                Annuler
              </button>
            )}
          </div>

          <div className="content-card-reservation-1">
            <p className="item-card">
              Pour valider votre réservation, veuillez vous rendre dans votre établissement et confirmer la réservation.
              Tant que vous n'avez pas validé votre réservation, vous pouvez l'annuler à tout moment. Si vous n'avez plus
              besoin de louer cet ordinateur avant la date de fin prévue, une fois la réservation validée, vous devrez
              vous rendre à votre établissement et demander l'annulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationTracking;
