import React from "react";
import { Link } from "react-router-dom";

function Navbar({ user, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Eltwin Orders
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Panel
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/form" className="nav-link">
                Formularz
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Zamówienia
              </Link>
            </li>

            <li className="nav-item">
              <Link to="/" className="nav-link">
                Zatwierdzenia
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Dostawcy
              </Link>
            </li>
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a href="/" className="nav-link" onClick={logout}>
                  Wyloguj się
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
