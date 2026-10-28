import React, { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SidebarToggleButton from "./SidebarToggleButton";
import { jwtEncode } from "../../utils/helpers";
import { FaUserCircle, FaBell, FaSignOutAlt } from "react-icons/fa";

export const Topbar = memo(({ user, logout, handleToggleSidebar, isSidebarShown, isDesktop }) => {
  const navigate = useNavigate();

  const handleNav = useCallback(
    (page) => {
      navigate(`/${jwtEncode({ page })}`);
    },
    [navigate]
  );

  return (
    <header className="topbar fixed-header" role="banner">
      <div className="topbar-stars" aria-hidden="true" />
      <div className="header-masjid-bg" aria-hidden="true" />
      <nav
        className="navbar top-navbar navbar-expand-md navbar-dark px-2 px-sm-3 px-md-4 h-100"
        role="navigation"
        aria-label="Main navigation"
        style={{ position: "relative", zIndex: 5 }}
      >
        <div className="navbar-header d-flex align-items-center gap-2 gap-sm-3">
          {!isDesktop && (
            <SidebarToggleButton
              sidebarShown={isSidebarShown}
              onClick={handleToggleSidebar}
            />
          )}
          <button
            type="button"
            className="navbar-brand d-flex align-items-center btn btn-link p-0 border-0 text-decoration-none shadow-none header-brand-btn"
            onClick={() => handleNav("dashboard")}
            title="Kembali ke Dashboard"
          >
            <div className="header-logo-container d-flex align-items-center justify-content-center">
              <img
                src="/assets/icons/PUSlogo.png"
                alt="Logo PUS"
                className="header-brand-img"
                loading="eager"
              />
            </div>
            <div className="d-flex flex-column ms-2 text-start header-logo-wrap">
              <span className="header-title">BACKOFFICE</span>
              <span className="header-subtitle">PUS System</span>
            </div>
          </button>
        </div>

        <div
          className="d-flex justify-content-end align-items-center gap-2 gap-sm-3 ms-auto"
          style={{ zIndex: 10 }}
        >
          <ul className="d-flex align-items-center flex-row list-unstyled mb-0 gap-2 gap-sm-3">
            <li className="nav-item">
              <button
                className="btn btn-topbar-action btn-link p-2 text-white position-relative shadow-none rounded-circle d-flex align-items-center justify-content-center"
                onClick={() => handleNav("notificationPage")}
                title="Notifikasi"
                aria-label="Buka Notifikasi"
              >
                <FaBell size={18} />
                <span className="topbar-bell-badge position-absolute p-1 bg-danger border border-light rounded-circle" />
              </button>
            </li>

            <li>
              <div className="header-divider" />
            </li>

            <li className="nav-item d-flex align-items-center gap-2 text-white">
              <div
                className="topbar-avatar rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                style={{ width: "36px", height: "36px" }}
              >
                <FaUserCircle size={22} />
              </div>
              <div className="d-none d-md-flex flex-column text-start" style={{ maxWidth: "160px" }}>
                <span className="small fw-bold text-white text-truncate leading-none">
                  {user?.full_name || "Admin"}
                </span>
                <span className="text-white-50 extra-small text-truncate mt-1">
                  {user?.roles ? (Array.isArray(user.roles) ? user.roles.join(", ") : user.roles) : "Administrator"}
                </span>
              </div>
            </li>

            <li>
              <button
                className="btn btn-outline-light btn-topbar-logout rounded-pill d-flex align-items-center gap-1 shadow-sm"
                onClick={logout}
                title="Keluar"
                aria-label="Keluar dari akun"
              >
                <FaSignOutAlt size={13} />
                <span className="d-none d-sm-inline fw-semibold">Keluar</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
});

export default Topbar;
