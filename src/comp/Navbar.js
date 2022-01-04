import React from "react";
import { NavLink } from "react-router-dom";

function Navbar({ user, logout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
      <div className="container-fluid">
        <NavLink to="/" className="navbar-brand">
          Eltwin Orders
        </NavLink>
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
              <NavLink activeClassName="active" to="/" className="nav-link">
                Panel
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="active" to="/form" className="nav-link">
                Formularz
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                activeClassName="active"
                to="/orders"
                className="nav-link"
              >
                Zamówienia
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink activeClassName="active" to="/" className="nav-link">
                Zatwierdzenia
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink activeClassName="active" to="/" className="nav-link">
                Dostawcy
              </NavLink>
            </li>
          </ul>
          <div className="d-flex">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a
                  href="/"
                  className="nav-link"
                  onClick={logout}
                  alt="Wyloguj się"
                >
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
