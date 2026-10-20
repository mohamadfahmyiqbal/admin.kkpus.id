import React, { memo } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

export const SidebarToggleButton = memo(({ sidebarShown, onClick }) => {
  return (
    <button
      className={`sidebar-toggle-btn mobile-sidebar-toggle btn btn-link p-0 text-white ${
        sidebarShown ? "is-open" : ""
      }`}
      type="button"
      onClick={onClick}
      aria-label="Toggle sidebar"
    >
      {sidebarShown ? <FaTimes size={20} /> : <FaBars size={20} />}
    </button>
  );
});

export default SidebarToggleButton;
