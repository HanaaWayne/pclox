import React, { useState } from "react";
import { useUser } from "../contexts/UserContext"; // Utilise le hook personnalisé
import "../styles/Catalog.css";
import UpdateInfoSchool from "./UpdateInfoSchool";

const UserInfo = () => {
  const { user, updateUser } = useUser();

  // Vérification du role d'utilisateur
  const isStudent = user?.role === "STUDENT"; // Élève
  const isSchool = user?.role === "SCHOOL"; // Établissement
  const [isEditing, setIsEditing] = useState(false); // État pour savoir si on est en mode édition
  const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  // Gestion des informations en fonction du type d'utilisateur
  let email = "";
  let phoneNumber = "";
  let firstName = "";
  let lastName = "";
  let schoolName = "";
  let addressComplement = "";
  let street = "";
  let codePostal = "";
  let city = "";

  if (isStudent) {
    email = user?.email || "Email inconnu";
    phoneNumber = user?.phoneNumber || "Téléphone inconnu";
    firstName = user?.firstName || "Prénom inconnu";
    lastName = user?.lastName || "Nom inconnu";
    schoolName = user?.school?.schoolName || "Etablissement inconnu";
    street = user?.school?.street || "Rue inconnue";
    addressComplement =
      user?.school?.addressComplement || "Complément d'adresse inconnu";
    codePostal = user?.school?.postalCode || "Code postal inconnu";
    city = user?.school?.city || "Ville inconnue";
  } else if (isSchool) {
    email = user?.email || "Email inconnu";
    phoneNumber = user?.phoneNumber || "Téléphone inconnu";
    schoolName = user?.schoolName || "Etablissement inconnu";
    street = user?.street || "Rue inconnue";
    addressComplement =
      user?.addressComplement || "Complément d'adresse inconnu";
    codePostal = user?.postalCode || "Code postal inconnu";
    city = user?.city || "Ville inconnue";
  }

  return (
    <>
      <div className="container-reservation">
        {isEditing ? (
          <UpdateInfoSchool onCancel={() => setIsEditing(false)}  email={email}
          phoneNumber={phoneNumber}
          firstName={firstName}
          lastName={lastName}
          schoolName={schoolName}
          addressComplement={addressComplement}
          street={street}
          codePostal={codePostal}
          city={city}
          user={user}
          updateUser={updateUser}
          />
        ) : (
          <>
            {isStudent ? (
              <p className="user">
                {capitalizeFirstLetter(firstName)} {capitalizeFirstLetter(lastName)}
              </p>
            ) : (
              <p className="user"> {capitalizeFirstLetter(schoolName)}</p>
            )}
            <div className="content-flex">
              {/* 🔹 Carte des coordonnées */}
              <div className="card-info">
                <div className="content-card-info">
                  <p className="title-info">Coordonnées</p>
                  <p className="item-card">Adresse email: {email}</p>
                  <p className="item-card">Mot de passe: ***********</p>
                  <p className="item-card">N° téléphone: {phoneNumber}</p>
                </div>
              </div>

              {/* 🔹 Carte de l'établissement */}
              <div className="card-info">
                <div className="content-card-info">
                  <p className="title-info">Etablissement</p>
                  <p className="item-card">Nom: {capitalizeFirstLetter(schoolName)}</p>
                  <p className="item-card">
                    Adresse: {street}
                    {addressComplement ? "" : ` ${addressComplement}`
                    }
                    , {codePostal} {capitalizeFirstLetter(city)}
                  </p>
                </div>
              </div>
            </div>

            {/* 🔹 Boutons d'édition */}
            { !isStudent && (
            <div className="content-edit">
              <p className="edit" onClick={() => setIsEditing(true)}>
                Modifier
              </p>
            </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default UserInfo;
