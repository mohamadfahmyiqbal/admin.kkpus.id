import { FaBars, FaTimes } from "react-icons/fa";

export default function SidebarToggleButton({ sidebarShown, onClick }) {
  return (
    <button
      className="
        nav-link
        nav-toggler 
        d-block 
        d-md-none 
        text-white 
        waves-effect waves-dark btn btn-link p-0"
      type="button"
      onClick={onClick}
      aria-label="Toggle sidebar"
    >
      {sidebarShown ? <FaTimes /> : <FaBars />}
    </button>
  );
}
