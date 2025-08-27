import { useEffect, useState, useCallback, useRef } from "react";
import { Container, Image } from "react-bootstrap";
import { toast } from "react-toastify";
import SidebarToggleButton from "./SidebarToggleButton";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";
import UAnggota from "../../../utils/UAnggota";
import KeranjangDropdown from "./KeranjangDropdown";
import { jwtEncode } from "../../../routes/helpers";
import { useNavigate } from "react-router-dom";

export default function Header({ onSidebarToggle, onUserChange }) {
  const [sidebarShown, setSidebarShown] = useState(false);
  const [user, setUser] = useState(null);
  const isMounted = useRef(false);
  const navigate = useNavigate();
  // Toggle sidebar, optimasi agar tidak tergantung pada sidebarShown
  const handleSidebarToggle = useCallback(() => {
    setSidebarShown((prev) => {
      const newState = !prev;
      document.body.classList.toggle("show-sidebar", newState);
      if (typeof onSidebarToggle === "function") {
        onSidebarToggle(newState);
      }
      return newState;
    });
  }, [onSidebarToggle]);

  // Logout handler, optimasi: redirect lebih cepat jika gagal
  const logout = useCallback(async () => {
    try {
      await UAnggota.logout();
      toast.success("Terimakasih");
      setTimeout(() => {
        window.location.href = "/login";
      }, 800);
    } catch (err) {
      toast.error("Gagal logout: " + (err?.message || "Terjadi kesalahan"));
      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    }
  }, []);

  // Ambil user login dari token (cukup sekali di awal saja)
  useEffect(() => {
    isMounted.current = true;
    let ignore = false;
    const getAccount = async () => {
      try {
        const res = await UAnggota.findAnggotaByToken();
        if (!ignore && isMounted.current) {
          setUser(res.data);
          if (typeof onUserChange === "function") {
            onUserChange(res.data);
          }
        }
      } catch (err) {
        toast.error(
          "Gagal mengambil data user: " + (err?.message || "Terjadi kesalahan")
        );
        console.log(err);

        // setTimeout(() => {
        //   window.location.href = "/login";
        // }, 1500);
      }
    };
    getAccount();
    return () => {
      isMounted.current = false;
      ignore = true;
    };
  }, [onUserChange]);

  // Bersihkan class show-sidebar jika unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove("show-sidebar");
    };
  }, []);

  const handleClick = async () => {
    const token = jwtEncode({ page: "dashboard" });
    navigate(`/page/${token}`);
  };

  return (
    <header className="topbar">
      <Container fluid>
        <nav className="navbar top-navbar navbar-expand-md navbar-light">
          <div className="navbar-header">
            <a className="navbar-brand me-3">
              <b>
                <Image
                  src="/assets/icons/PUSlogo.png"
                  alt="Logo PUS"
                  height={40}
                  onClick={handleClick}
                />
              </b>
            </a>
          </div>
          <div className="navbar-collapse d-flex justify-content-between">
            <ul className="navbar-nav mr-auto mt-md-0">
              <li className="nav-item">
                <SidebarToggleButton
                  sidebarShown={sidebarShown}
                  onClick={handleSidebarToggle}
                />
              </li>
            </ul>
            <ul className="navbar-nav my-lg-0">
              {user && (
                <>
                  <NotificationDropdown user={user} />
                  <KeranjangDropdown user={user} />
                  <UserDropdown user={user} logout={logout} />
                </>
              )}
            </ul>
          </div>
        </nav>
      </Container>
    </header>
  );
}
