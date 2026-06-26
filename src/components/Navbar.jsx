import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Navbar() {
  const favorites = useSelector((state) => state.favorites);

  return (
    <header>
      <nav className="navbar navbar-expand-md be-navbar sticky-top" role="navigation" aria-label="Main navigation">
        <div className="container">
          {/* Brand */}
          <Link to="/" className="navbar-brand" aria-label="Book Explorer home">
            <span aria-hidden="true" className="me-2">📚</span>
            Book <span className="gradient-text">Explorer</span>
          </Link>

          {/* Hamburger */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#be-nav"
            aria-controls="be-nav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Links */}
          <div className="collapse navbar-collapse" id="be-nav">
            <div className="d-flex flex-column flex-md-row align-items-md-center gap-2 ms-auto">
              <ul className="navbar-nav gap-1">
                <li className="nav-item">
                  <NavLink
                    to="/"
                    end
                    className={({ isActive }) => `nav-link px-3 py-2${isActive ? ' active' : ''}`}
                    aria-label="Search books"
                  >
                    🔍 Search
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) => `nav-link px-3 py-2${isActive ? ' active' : ''}`}
                    aria-label={`Favorites${favorites.length > 0 ? `, ${favorites.length} saved` : ''}`}
                  >
                    ❤️ Favorites
                    {favorites.length > 0 && (
                      <span className="nav-fav-badge ms-1" aria-hidden="true">
                        {favorites.length}
                      </span>
                    )}
                  </NavLink>
                </li>
              </ul>

            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
