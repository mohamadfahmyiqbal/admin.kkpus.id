import React, { memo, useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaChartPie,
  FaUsers,
  FaWallet,
  FaShoppingCart,
  FaHandHoldingUsd,
  FaPiggyBank,
  FaChartLine,
  FaGraduationCap,
  FaFileAlt,
  FaCogs,
  FaUserShield,
} from "react-icons/fa";
import { jwtEncode } from "../../utils/helpers";

const MenuItem = memo(({ item, currentPage, openKeys, onDropdownToggle, onNavigate }) => {
  const hasChildren = Boolean(item.children && item.children.length);
  const key = item.key;
  const isOpen = Boolean(openKeys[key]);

  const isActive = useMemo(() => {
    if (item.href === currentPage) return true;
    if (hasChildren) {
      return item.children.some((c) => c.href === currentPage || (c.children && c.children.some(cc => cc.href === currentPage)));
    }
    return false;
  }, [item, currentPage, hasChildren]);

  if (hasChildren) {
    const activeClass = isActive || isOpen ? "active" : "";
    return (
      <li className={activeClass} role="none">
        <button
          className={`sidebar-link-btn has-arrow ${activeClass}`}
          aria-expanded={isOpen}
          onClick={(e) => onDropdownToggle(key, e)}
          type="button"
        >
          {item.icon && <item.icon className="sidebar-icon" size={16} />}
          <span className="sidebar-text">{item.label}</span>
        </button>
        <ul className={`sidebar-submenu list-unstyled ${isOpen ? "show" : ""}`}>
          {item.children.map((child, idx) => (
            <MenuItem
              key={child.key || `${key}-${idx}`}
              item={child}
              currentPage={currentPage}
              openKeys={openKeys}
              onDropdownToggle={onDropdownToggle}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </li>
    );
  }

  return (
    <li className={isActive ? "active" : ""} role="none">
      <button
        className={`sidebar-link-btn ${isActive ? "active" : ""}`}
        onClick={() => onNavigate(item.href)}
        type="button"
      >
        {item.icon && <item.icon className="sidebar-icon" size={16} />}
        <span className="sidebar-text">{item.label}</span>
      </button>
    </li>
  );
});

export const SidebarNav = ({ user, currentPage, onClose, isDesktop, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [openKeys, setOpenKeys] = useState({});
  const asideRef = useRef(null);

  // Otomatis tutup semua dropdown saat halaman aktif berubah
  useEffect(() => {
    setOpenKeys({});
  }, [currentPage]);

  // Tutup dropdown saat user mengklik di luar area navigasi (khusus desktop)
  useEffect(() => {
    if (!isDesktop) return;
    const handleClickOutside = (e) => {
      if (asideRef.current && !asideRef.current.contains(e.target)) {
        setOpenKeys({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop]);

  const menuItems = useMemo(
    () => [
      { label: "Dashboard", href: "dashboard", icon: FaChartPie, key: "dashboard" },
      { label: "Anggota", href: "membersPage", icon: FaUsers, key: "members_menu" },
      {
        label: "Simpanan",
        icon: FaWallet,
        key: "simpanan_menu",
        children: [
          { label: "Dashboard", href: "simpananDashboard", icon: FaChartPie },
          { label: "Report", href: "simpananReportPage", icon: FaFileAlt },
        ],
      },
      {
        label: "Jual Beli",
        icon: FaShoppingCart,
        key: "jual_beli",
        children: [
          { label: "Dashboard", href: "jualBeliDashboard", icon: FaChartPie },
          { label: "Report", href: "jualBeliReportPage", icon: FaFileAlt },
        ],
      },
      {
        label: "Program",
        icon: FaHandHoldingUsd,
        key: "program",
        children: [
          {
            label: "Pinjaman Lunak",
            icon: FaHandHoldingUsd,
            key: "pinjaman_lunak",
            children: [
              { label: "List", href: "pinjamanList" },
              { label: "Report", href: "pinjamanReport" },
              { label: "Input Modal", href: "pinjamanInputModal" },
            ],
          },
          {
            label: "Arisan",
            icon: FaUsers,
            key: "arisan",
            children: [
              { label: "Arisan Batch", href: "arisanBatchPage" },
              { label: "Report", href: "arisanReport" },
            ],
          },
        ],
      },
      {
        label: "Tabungan",
        icon: FaPiggyBank,
        key: "tabungan",
        children: [
          { label: "List", href: "tabunganList" },
          { label: "Report", href: "tabunganReport" },
        ],
      },
      {
        label: "Investasi",
        icon: FaChartLine,
        key: "investasi",
        children: [
          {
            label: "Investasi Halal",
            key: "investasi-halal",
            children: [
              { label: "List", href: "investasiHalalList" },
              { label: "Report", href: "investasiHalalReport" },
            ],
          },
          {
            label: "Pendanaan Syariah",
            key: "pendanaan-syariah",
            children: [
              { label: "List", href: "pendanaanSyariahList" },
              { label: "Report", href: "pendanaanSyariahReport" },
            ],
          },
        ],
      },
      {
        label: "Edukasi",
        icon: FaGraduationCap,
        key: "edu",
        children: [{ label: "Kelola Training", href: "trainingPage" }],
      },
      { label: "Laporan", href: "reportsPage", icon: FaFileAlt, key: "reports" },
      {
        label: "Konfigurasi",
        icon: FaCogs,
        key: "konfigurasi",
        children: [
          { label: "Akad", href: "akadConfigPage" },
          { label: "Nominal Simpanan", href: "simpananConfigPage" },
          { label: "Biaya Admin", href: "paymentFeeConfigPage" },
        ],
      },
      { label: "Pengaturan", href: "settingsPage", icon: FaCogs, key: "settings" },
    ],
    []
  );

  const handleDropdownToggle = (key, e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpenKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNavigate = (page) => {
    if (!page) return;
    setOpenKeys({});
    navigate(`/${jwtEncode({ page })}`);
    if (!isDesktop) onClose();
  };

  return (
    <aside
      ref={asideRef}
      className={`app-sidebar ${
        isDesktop ? "sidebar-horizontal" : `sidebar-vertical ${isSidebarOpen ? "open" : ""}`
      }`}
      aria-label="Main menu"
    >
      <div className="scroll-sidebar h-100 d-flex flex-column">
        {!isDesktop && (
          <div className="sidebar-brand-box-custom p-4">
            <div className="d-flex align-items-center gap-3 sidebar-brand-logo-wrap">
              <img
                src="/assets/icons/PUSlogo.png"
                alt="Logo"
                className="sidebar-brand-logo"
              />
              <div className="d-flex flex-column sidebar-brand-text">
                <span className="fw-bold text-white fs-15">BACKOFFICE</span>
                <span className="sidebar-brand-subtitle">PUS System</span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-link p-0 text-white-50 sidebar-close-btn"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <span className="sidebar-close-icon">×</span>
            </button>
          </div>
        )}

        <nav className="sidebar-nav flex-grow-1 sidebar-nav-container">
          <ul id="sidebarnav" role="menu" className="list-unstyled">
            {menuItems.map((item, idx) => (
              <MenuItem
                key={item.key || idx}
                item={item}
                currentPage={currentPage}
                openKeys={openKeys}
                onDropdownToggle={handleDropdownToggle}
                onNavigate={handleNavigate}
              />
            ))}
          </ul>
        </nav>

        {!isDesktop && user && (
          <div className="mt-auto p-4 border-top bg-light">
            <div className="d-flex align-items-center gap-3">
              <div className="rounded-circle bg-white border d-flex align-items-center justify-content-center shadow-sm sidebar-user-avatar">
                <FaUserShield size={24} className="text-muted" />
              </div>
              <div className="d-flex flex-column min-w-0">
                <span className="fw-bold text-dark text-truncate sidebar-user-name">
                  {user.full_name || "Admin"}
                </span>
                <span className="text-muted text-truncate sidebar-user-role">
                  {user.roles ? user.roles.join(", ") : "Administrator"}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default SidebarNav;
