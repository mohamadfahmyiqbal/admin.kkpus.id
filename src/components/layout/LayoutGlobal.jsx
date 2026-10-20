import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Topbar from "./Topbar";
import SidebarNav from "./SidebarNav";
import { jwtEncode } from "../../utils/helpers";

const DESKTOP_WIDTH = 768;

const LayoutGlobal = ({ children, pageName }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      return {};
    }
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_WIDTH);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsSidebarOpen((prev) => !prev);
  }, []);

  const handleCloseSidebar = useCallback(() => {
    setIsSidebarOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    navigate(`/${jwtEncode({ page: "authLogin" })}`);
  }, [navigate]);

  return (
    <div
      id="main-wrapper"
      className={`dashboard-layout-shell fix-header card-no-border layout-font-family ${
        isDesktop || isSidebarOpen ? "show-sidebar fix-sidebar" : ""
      }`}
    >
      <Topbar
        user={userData}
        logout={handleLogout}
        handleToggleSidebar={handleToggleSidebar}
        isSidebarShown={isSidebarOpen}
        isDesktop={isDesktop}
      />

      <SidebarNav
        user={userData}
        currentPage={pageName}
        onClose={handleCloseSidebar}
        isDesktop={isDesktop}
        isSidebarOpen={isSidebarOpen}
      />

      {!isDesktop && isSidebarOpen && (
        <div
          className="dashboard-sidebar-backdrop show"
          onClick={handleCloseSidebar}
          role="button"
          tabIndex={0}
        />
      )}

      <div
        className="page-wrapper dashboard-page-wrapper d-flex flex-column"
        style={{
          paddingTop: isDesktop ? "112px" : "64px",
          marginLeft: "0px",
          transition: "padding-top 0.3s ease, margin-left 0.3s ease",
          minHeight: "100vh",
        }}
      >
        <main
          className="container-fluid flex-grow-1 fade-in px-3 px-md-4 py-3"
          role="main"
        >
          {children}
        </main>

        <footer className="footer dashboard-footer text-center p-2 bg-white border-top">
          <div className="d-flex justify-content-between container-fluid">
            <small>Paguyuban Usaha Sukses @{new Date().getFullYear()}</small>
            <small className="text-muted">Powered By Manova</small>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LayoutGlobal;
