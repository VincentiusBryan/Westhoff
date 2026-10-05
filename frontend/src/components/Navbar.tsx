import { useState } from "react";
import "../css/Navbar.css";

interface NavbarProps {
  showBack?: boolean;
}

function Navbar({ showBack = false }: NavbarProps) {
  const currentPath = window.location.pathname;

  const [showDropdown, setShowDropdown] =
    useState<boolean>(false);

  let pageTitle = "Dashboard Dapur";
  let userName = "Dapur";
  let userRole = "Kitchen Staff";
  let userAvatar = "D";

  if (currentPath === "/dashboard-dapur/tambah-stok") {
    pageTitle = "Produksi";
    userName = "Dapur";
    userRole = "Kitchen Staff";
    userAvatar = "D";
  }

  if (currentPath === "/dashboard-toko") {
    pageTitle = "Dashboard Toko";
    userName = "Toko";
    userRole = "Store Staff";
    userAvatar = "T";
  }

  if (currentPath === "/dashboard-toko/request-barang") {
    pageTitle = "Request Barang";
    userName = "Toko";
    userRole = "Store Staff";
    userAvatar = "T";
  }

  if (currentPath === "/dashboard-toko/kasir") {
    pageTitle = "Kasir";
    userName = "Toko";
    userRole = "Store Staff";
    userAvatar = "T";
  }

  if (currentPath === "/dashboard-owner") {
    pageTitle = "Dashboard Owner";
    userName = "Owner";
    userRole = "Owner";
    userAvatar = "O";
  }

  const handleBack = () => {
    if (currentPath === "/dashboard-dapur/tambah-stok") {
      window.location.href = "/dashboard-dapur";
      return;
    }

    if (currentPath === "/dashboard-toko/request-barang") {
      window.location.href = "/dashboard-toko";
      return;
    }

    if (currentPath === "/dashboard-toko/kasir") {
      window.location.href = "/dashboard-toko";
      return;
    }

    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/dashboard-dapur";
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {showBack && (
          <button
            type="button"
            className="navbar-back-button"
            onClick={handleBack}
            aria-label="Kembali"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line
                x1="19"
                y1="12"
                x2="5"
                y2="12"
              ></line>

              <polyline
                points="12 19 5 12 12 5"
              ></polyline>
            </svg>
          </button>
        )}

        <div className="brand">
          <div className="brand-logo">
            W
          </div>

          <div className="brand-text">
            <span className="brand-name">
              Westhoff
            </span>

            <span className="brand-subtitle">
              Bakery Management
            </span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <span className="navbar-page">
          {pageTitle}
        </span>
      </div>

      <div className="navbar-right">
        <div className="notification">
          <span className="notification-icon">
            🔔
          </span>

          <span className="notification-dot"></span>
        </div>

        <div className="profile-wrapper">
          <button
            type="button"
            className="user-profile"
            onClick={() =>
              setShowDropdown(
                !showDropdown
              )
            }
            aria-expanded={showDropdown}
          >
            <div className="user-avatar">
              {userAvatar}
            </div>

            <div className="user-info">
              <span className="user-name">
                {userName}
              </span>

              <span className="user-role">
                {userRole}
              </span>
            </div>

            <span
              className={`dropdown-icon ${
                showDropdown
                  ? "dropdown-open"
                  : ""
              }`}
            >
              ⌄
            </span>
          </button>

          {showDropdown && (
            <div className="profile-dropdown">
              <button
                type="button"
                className="logout-button"
                onClick={handleLogout}
              >
                <span className="logout-icon">
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>

                    <polyline points="16 17 21 12 16 7"></polyline>

                    <line
                      x1="21"
                      y1="12"
                      x2="9"
                      y2="12"
                    ></line>
                  </svg>
                </span>

                <span>
                  Logout
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;