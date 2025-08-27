import { useCallback, useState } from "react";
import Header from "../../comp/global/header/Header";
import { Breadcrumb, Col, Container, Image, Row } from "react-bootstrap";
import Sidebar from "../../comp/global/Sidebar";
import CompApproval from "../../comp/dashboard/CompApproval";
import CompNotif from "../../comp/dashboard/CompNotif";
import CompInfo from "../../comp/dashboard/CompInfo";
import Footer from "../../comp/global/Footer";

export default function DashboardScreen() {
  const [user, setUser] = useState(null);

  // Optimized: useCallback to prevent unnecessary re-renders
  const handleUserChange = useCallback((newUser) => {
    setUser(newUser);
  }, []);

  return (
    <div id="main-wrapper">
      <Header onUserChange={handleUserChange} />
      <Sidebar user={user} />
      <div className="page-wrapper">
        <Container fluid>
          <Row className="page-titles mb-0">
            <Col md="12" className="align-self-center">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-2">
                <h3 className="text-themecolor mb-0 mt-0">Dashboard</h3>
                <Breadcrumb className="mb-0">
                  <Breadcrumb.Item href="#">Home</Breadcrumb.Item>
                  <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </Col>
          </Row>
          <Row className="g-3 mb-3">
            <Col lg="6" md="12">
              <CompApproval user={user} />
            </Col>
            <Col lg="6" md="12">
              <CompNotif />
            </Col>
          </Row>
          <Row className="g-3">
            <CompInfo />
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
