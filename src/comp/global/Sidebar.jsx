import React, { useState, useCallback } from "react";

// Data menu untuk menghindari duplikasi dan memudahkan penambahan menu baru
const menuData = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Akun",
    key: "akun",
    children: [
      {
        label: "Anggota",
        href: "/anggotaList",
      },
      {
        label: "Report",
        key: "akun-report",
        children: [
          {
            label: "Anggota",
            href: "#",
          },
        ],
      },
    ],
  },
  {
    label: "Article",
    href: "/article",
  },
  {
    label: "Hibah",
    key: "hibah",
    children: [
      {
        label: "List",
        href: "/anggotaList",
      },
      {
        label: "Report",
        key: "hibah-report",
        children: [
          {
            label: "Hibah",
            href: "#",
          },
        ],
      },
    ],
  },
  {
    label: "Program",
    key: "program",
    children: [
      {
        label: "Pinjaman Lunak",
        key: "program-pinjaman",
        children: [
          { label: "List", href: "/pinjamanList" },
          { label: "Transaksi", href: "/pinjamanTrans" },
          { label: "Report", href: "/pinjamanReport" },
        ],
      },
      {
        label: "Arisan",
        key: "program-arisan",
        children: [
          { label: "List", href: "#" },
          { label: "Report", href: "#" },
        ],
      },
    ],
  },
  {
    label: "Tabungan",
    key: "tabungan",
    children: [
      { label: "List", href: "#" },
      { label: "Report", href: "#" },
    ],
  },
  {
    label: "Investasi Halal",
    key: "investasi",
    children: [
      { label: "List", href: "#" },
      { label: "Report", href: "#" },
    ],
  },
  {
    label: "Pendanaan Syariah",
    key: "pendanaan",
    children: [
      { label: "List", href: "#" },
      { label: "Report", href: "#" },
    ],
  },
  {
    label: "Operational",
    key: "operational",
    children: [
      { label: "List", href: "#" },
      { label: "Report", href: "#" },
    ],
  },
];

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState({});

  // Toggle dropdown
  const handleDropdown = useCallback((key, e) => {
    e.preventDefault();
    setOpenDropdown((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  // Cek apakah dropdown terbuka
  const isOpen = useCallback((key) => !!openDropdown[key], [openDropdown]);

  // Render menu secara rekursif
  const renderMenu = (items, parentKey = "") =>
    items.map((item, idx) => {
      if (item.children) {
        const key = item.key || `${parentKey}-${idx}`;
        return (
          <li key={key}>
            <a
              className="has-arrow"
              aria-expanded={isOpen(key)}
              href="#"
              onClick={(e) => handleDropdown(key, e)}
              tabIndex={0}
              role="button"
            >
              <span className="hide-menu">{item.label}</span>
            </a>
            <ul
              aria-expanded={isOpen(key)}
              className={`collapse${isOpen(key) ? " show" : ""}`}
            >
              {renderMenu(item.children, key)}
            </ul>
          </li>
        );
      }
      // Generate a unique key for leaf items
      const leafKey = `${parentKey}-${item.label}-${idx}`;
      return (
        <li key={leafKey}>
          <a href={item.href} aria-expanded="false">
            <span className="hide-menu">{item.label}</span>
          </a>
        </li>
      );
    });

  return (
    <aside className="left-sidebar">
      <div className="scroll-sidebar">
        <nav className="sidebar-nav">
          <ul id="sidebarnav">
            <li className="nav-small-cap">PERSONAL</li>
            {renderMenu(menuData)}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
