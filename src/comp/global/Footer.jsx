import { CardSubtitle, Col, Row } from "react-bootstrap";
import { useState, useLayoutEffect } from "react";

export default function Footer() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useLayoutEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 768);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <footer
      className="footer bg-topbar text-white"
      style={{
        minHeight: 0,
        height: "38px",
        paddingTop: 0,
        paddingBottom: 0,
        fontSize: isMobile ? "0.95em" : "1em",
      }}
    >
      <Row
        as="div"
        className="d-flex justify-content-between align-items-center m-0"
        style={{
          height: "100%",
          paddingTop: 0,
          paddingBottom: 0,
        }}
      >
        <Col xs={6} className="text-start">
          <CardSubtitle className="mb-0">
            {isMobile ? "PUS @2025" : "Paguyuban Usaha Sukses ©2025"}
          </CardSubtitle>
        </Col>
        <Col xs={6} className="text-end">
          <h6 className="mb-0" style={{ fontSize: "1em" }}>
            {isMobile ? (
              <b>Manova</b>
            ) : (
              <>
                Powered By <b>Manova</b>
              </>
            )}
          </h6>
        </Col>
      </Row>
    </footer>
  );
}
