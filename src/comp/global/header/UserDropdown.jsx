import { NavDropdown } from "react-bootstrap";
import { FaUserCircle } from "react-icons/fa";

export default function UserDropdown({ user, logout }) {
  return (
    <NavDropdown
      as="li"
      title={
        <span
          className="nav-link text-white waves-effect waves-dark p-0"
          role="button"
        >
          <FaUserCircle className="profile-pic" size={20} />
        </span>
      }
      id="dropdown-user"
      align="end"
      className="nav-item "
    >
      <div className="mailbox" style={{ minWidth: 300 }}>
        <div className="dw-user-box px-3 py-2 ">
          <div className="d-flex align-items-center">
            <img
              src="/assets/images/users/1.jpg"
              alt="user"
              width={40}
              height={40}
              className="rounded-circle me-2"
            />
            <div>
              <h6 className="mb-0">{user?.nama}</h6>
              <p className="text-muted mb-1" style={{ fontSize: 12 }}>
                {user?.email}
              </p>
              <a href="/profile" className="btn btn-rounded btn-danger btn-sm">
                View Profile
              </a>
            </div>
          </div>
        </div>
      </div>
      <NavDropdown.Divider />
      <NavDropdown.Item href="#!">
        <i className="ti-user me-2"></i> My Profile
      </NavDropdown.Item>
      <NavDropdown.Item href="#!">
        <i className="ti-wallet me-2"></i> My Balance
      </NavDropdown.Item>
      <NavDropdown.Divider />
      <NavDropdown.Item onClick={logout}>
        <i className="fa fa-power-off me-2"></i> Logout
      </NavDropdown.Item>
    </NavDropdown>
  );
}
