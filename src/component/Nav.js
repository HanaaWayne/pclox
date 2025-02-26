import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Nav.css';
import { useUser } from '../contexts/UserContext';  // Assure-toi que tu as correctement configuré ce contexte

const Nav = () => {
  const { user, logout } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  // Fermer le menu lorsqu'on change de page
  useEffect(() => {
    const handleRouteChange = () => setMenuOpen(false);
    window.addEventListener('popstate', handleRouteChange);
    return () => window.removeEventListener('popstate', handleRouteChange);
  }, []);

  // Fonction pour fermer le menu lorsqu'un bouton est cliqué
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="navbar">
      <div className="nav">
        <div className="contain-navbar">
          <Link to="/">
            <button className="logo-container">
              <h1 className="logo">
                <span className="logo-pc-nav">PC</span>
                <span className="logo-lox">LOX</span>
              </h1>
            </button>
          </Link>

          {/* Bouton Menu Burger */}
          <button className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>

          {/* Menu qui s'affiche en fonction de l'état */}
          <div className={`menu-links ${menuOpen ? 'open' : ''}`}>
            {!user ? (
              <>
                <Link to="/register" onClick={closeMenu}>
                  <button className="register">Inscription</button>
                </Link>
                <Link to="/login" onClick={closeMenu}>
                  <button className="login">Connexion</button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" onClick={closeMenu}>
                  <button className="catalog">Accueil</button>
                </Link>
                <Link to="/catalog" onClick={closeMenu}>
                  <button className="catalog">Catalogue</button>
                </Link>
                <Link to="/menu" onClick={closeMenu}>
                  <button className="account">Mon compte</button>
                </Link>
                <Link to="/" onClick={() => { logout(); closeMenu(); }}>
                  <button className="logout">
                    Déconnexion
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
