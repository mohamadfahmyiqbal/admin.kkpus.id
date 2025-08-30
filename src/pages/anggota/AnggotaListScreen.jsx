import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import Header from "../../comp/global/header/Header";
import Sidebar from "../../comp/global/Sidebar";
import Footer from "../../comp/global/Footer";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import TAnggota from "../../comp/anggota/TAnggota";

export default function AnggotaListScreen() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Gunakan useCallback agar referensi fungsi tetap stabil
  const handleUserChange = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  // Global handleClick untuk navigasi
  const handleClick = useCallback(
    (path) => {
      navigate(path);
    },
    [navigate]
  );

  return (
    <div id="main-wrapper">
      <Header onUserChange={handleUserChange} />
      <Sidebar user={user} />
      <div className="page-wrapper">
        <Container fluid>
          <Row className="page-titles mb-0">
            <Col md="12" className="align-self-center">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                <h3 className="text-themecolor mb-0 mt-0">Anggota</h3>
                <Breadcrumb className="mb-0">
                  <Breadcrumb.Item onClick={() => handleClick("/dashboard")}>
                    Dashboard
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active>Akun</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <TAnggota user={user} />
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
