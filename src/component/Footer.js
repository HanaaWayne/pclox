import React from "react";
import "../styles/Footer.css"; // Assurez-vous que le chemin vers ton fichier CSS est correct
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className="footer-container">
      <div className="footer-content">
        <div className="flex-footer">
          <div className="content-1">
            <Link to="/">
              <button className="logo-container">
                <h1 className="footer-logo">
                  <span className="logo-pc">PC</span>
                  <span className="logo-lox">LOX</span>
                </h1>
              </button>
            </Link>
          </div>

          <div className="content-2bis">
            <p className="text-contact">
              Vous avez une question écrivez-nous ?
            </p>
            <button className="contact">Nous contacter</button>
          </div>
        </div>

        <div className="flex-footer">
          <div className="content-3">
            <p className="social-network">Suivre nos actualités </p>
            <div className="social-network-icons">
              <FaFacebook className="facebook" size={30} color="white" />
              <FaInstagram
                className="instagram"
                size={30}
                color="white"
                style={{ margin: "0px 20px" }}
              />
              <FaXTwitter className="twitter" size={30} color="white" />
            </div>
          </div>

          <div className="content-4">
            <p className="conditions">
              Conditions générales <br /> Politique de confidentialité
            </p>
          </div>
        </div>
      </div>

      <div className="footer-content-2">
        {/* Texte Copyright en dessous des blocs */}
        <div className="footer-copyright">
          <p>© PcLox 2025, Inc. Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
