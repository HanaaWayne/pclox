import React, { useState } from "react";
import "../styles/Catalog.css";
import ReservationTracking from "../component/ReservationTracking";
import ReservationTrackingSchool from "../component/ReservationTrackingSchool";
import UserInfo from "../component/UserInfo";
import { useUser } from "../contexts/UserContext"; // Importation du contexte utilisateur

const Catalog = () => {
  const [activeMenu, setActiveMenu] = useState("info");

  const { user } = useUser(); // Récupération de l'utilisateur connecté
  const userRole = user?.role; // Type d'utilisateur (école ou étudiant)

  return (
    <div className="container-content-catalog">
      <div className="container-catalog">
        <div className="menu">
          <p
            className={`menu-name ${activeMenu === "info" ? "active" : ""}`}
            onClick={() => setActiveMenu("info")}
          >
            Mes informations
          </p>
          <p
            className={`menu-name ${
              activeMenu === "reservation" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("reservation")}
          >
            Suivi réservations
          </p>
        </div>

        {activeMenu === "reservation" && (
          userRole === "SCHOOL" ? <ReservationTrackingSchool /> : <ReservationTracking />
        )}
        
        {activeMenu === "info" && <UserInfo />}
      </div>
    </div>
  );
};

export default Catalog;
