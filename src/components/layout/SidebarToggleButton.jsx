import React, { memo } from "react";
import { List, X } from "phosphor-react";

export const SidebarToggleButton = memo(({ sidebarShown, onClick }) => {
  return (
    <button
      className={`sidebar-toggle-btn mobile-sidebar-toggle btn btn-link p-0 text-white ${
        sidebarShown ? "is-open" : ""
      }`}
      type="button"
      onClick={onClick}
      aria-label="Toggle sidebar"
      style={{
        width: "36px",
        height: "36px",
        minWidth: "36px",
        minHeight: "36px",
        padding: "0 !important",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {sidebarShown ? <X size={22} weight="bold" /> : <List size={22} weight="bold" />}
    </button>
  );
});

export default SidebarToggleButton;
