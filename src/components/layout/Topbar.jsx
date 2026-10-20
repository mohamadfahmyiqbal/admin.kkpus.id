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
      <div className="topbar-stars" />
      <div className="header-masjid-bg" />
      <nav
        className="navbar top-navbar navbar-expand-md navbar-dark px-3 h-100"
        role="navigation"
        aria-label="Main navigation"
        style={{ position: "relative", zIndex: 5 }}
      >
        <div className="navbar-header d-flex align-items-center gap-3">
          {!isDesktop && (
            <SidebarToggleButton
              sidebarShown={isSidebarShown}
              onClick={handleToggleSidebar}
            />
          )}
          <button
            type="button"
            className="navbar-brand d-flex align-items-center btn btn-link p-0 border-0 text-decoration-none"
            onClick={() => handleNav("dashboard")}
            title="Kembali ke Dashboard"
          >
            <img
              src="/assets/icons/PUSlogo.png"
              alt="Logo PUS"
              style={{ height: "36px" }}
              loading="eager"
            />
            <div className="d-none d-sm-flex flex-column ms-2 text-start header-logo-wrap">
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
                className="btn btn-link p-0 border-0 text-white position-relative shadow-none"
                onClick={() => handleNav("notificationPage")}
                title="Notifikasi"
              >
                <FaBell size={18} />
              </button>
            </li>

            <li className="d-none d-sm-block">
              <div className="header-divider" />
            </li>

            <li className="nav-item d-flex align-items-center gap-2 text-white">
              <div
                className="rounded-circle bg-white bg-opacity-20 d-flex align-items-center justify-content-center text-white"
                style={{ width: "32px", height: "32px" }}
              >
                <FaUserCircle size={20} />
              </div>
              <div className="d-none d-md-flex flex-column text-start">
                <span className="small fw-bold text-white leading-none">
                  {user?.full_name || "Admin"}
                </span>
                <span className="text-white-50 extra-small">
                  {user?.roles ? user.roles.join(", ") : "Administrator"}
                </span>
              </div>
            </li>

            <li>
              <button
                className="btn btn-outline-light btn-sm rounded-pill px-3 d-flex align-items-center gap-1"
                onClick={logout}
                title="Keluar"
              >
                <FaSignOutAlt size={12} />
                <span className="d-none d-sm-inline">Keluar</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
});

export default Topbar;
