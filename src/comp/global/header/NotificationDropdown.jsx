import { NavDropdown } from "react-bootstrap";
import { FaBell, FaLink } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtEncode } from "../../../routes/helpers";
import UNotif from "../../../utils/UNotif";
import { useEffect, useState } from "react";

export default function NotificationDropdown({ user }) {
  const navigate = useNavigate();
  const [notif, setNotif] = useState([]);
  // Handler untuk navigasi ke halaman notifikasi
  const handleClick = (e) => {
    e.preventDefault();
    const token = jwtEncode({ page: "notifikasi" });
    navigate(`/page/${token}`);
  };

  const getNotif = async () => {
    try {
      const res = await UNotif.getNotificationByNik({ nik: user.nik });
      setNotif(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNotif();
  }, []);
  return (
    <NavDropdown
      as="li"
      title={
        <span
          className="nav-link text-white waves-effect waves-dark p-0"
          role="button"
        >
          <FaBell />
          <div className="notify">
            <span className="heartbit"></span>
            <span className="point"></span>
          </div>
        </span>
      }
      id="dropdown-messages"
      align="end"
      className="nav-item"
    >
      <div className="mailbox animated bounceInDown" style={{ minWidth: 300 }}>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          <li>
            <div className="drop-title">Notifikasi</div>
          </li>
          <li>
            <div
              className="slimScrollDiv"
              style={{
                position: "relative",
                overflow: "hidden",
                width: "auto",
                height: "250px",
              }}
            >
              <div
                className="message-center"
                style={{
                  overflow: "hidden",
                  width: "auto",
                  height: "250px",
                }}
              >
                {notif?.map((ntf) => {
                  return (
                    <a href="#!">
                      <div className="btn btn-danger btn-circle">
                        <FaLink />
                      </div>
                      <div className="mail-contnet">
                        <h6>{ntf.user_id}</h6>
                        <h6>{ntf.title}</h6>
                        <span className="mail-desc">{ntf.body}</span>
                        <span className="time">{ntf.created_at}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </li>
          <li>
            <a
              className="nav-link text-center"
              href="#!"
              onClick={handleClick}
              role="button"
              tabIndex={0}
            >
              <strong>Lihat semua notifikasi</strong>
              <i className="fa fa-angle-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </NavDropdown>
  );
}
