import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const PendanaanSummaryCards = ({ summary, formatCurrency }) => (
  <Row className="g-3 mb-4">
    <Col md={4}>
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body>
          <h6
            className="text-muted mb-2 fw-bold"
            style={{ letterSpacing: "1px" }}
          >
            TOTAL PEMBIAYAAN AKTIF
          </h6>
          <h3 className="fw-bold text-primary mb-0">
            {formatCurrency(summary.pembiayaanAktif)}
          </h3>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="border-0 shadow-sm rounded-4 h-100">
        <Card.Body>
          <h6
            className="text-muted mb-2 fw-bold"
            style={{ letterSpacing: "1px" }}
          >
            BAGI HASIL / MARGIN
          </h6>
          <h3 className="fw-bold text-success mb-0">
            {formatCurrency(summary.labaBerjalan)}
          </h3>
        </Card.Body>
      </Card>
    </Col>
    <Col md={4}>
      <Card className="border-0 shadow-sm rounded-4 h-100 bg-warning bg-opacity-10">
        <Card.Body>
          <h6
            className="text-warning mb-2 fw-bold"
            style={{ letterSpacing: "1px" }}
          >
            MENUNGGU PERSETUJUAN
          </h6>
          <h3 className="fw-bold text-warning mb-0">
            {summary.pendingCount} Pengajuan
          </h3>
        </Card.Body>
      </Card>
    </Col>
  </Row>
);

export default PendanaanSummaryCards;
