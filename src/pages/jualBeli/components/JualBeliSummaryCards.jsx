import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const JualBeliSummaryCards = ({ summary, formatRp }) => {
  return (
    <Row className="g-3 mb-4">
      <Col md={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card">
          <Card.Body>
            <h6 className="text-muted mb-2 jb-summary-title">
              TOTAL PEMBIAYAAN
            </h6>
            <h3 className="fw-bold text-primary mb-0">
              {formatRp(summary.pembiayaanAktif)}
            </h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card">
          <Card.Body>
            <h6 className="text-muted mb-2 jb-summary-title">
              LABA BERJALAN
            </h6>
            <h3 className="fw-bold text-success mb-0">
              {formatRp(summary.labaBerjalan)}
            </h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card">
          <Card.Body>
            <h6 className="text-muted mb-2 jb-summary-title">TOTAL DP</h6>
            <h3 className="fw-bold text-info mb-0">
              {formatRp(summary.dpDiterima)}
            </h3>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card bg-warning bg-opacity-10">
          <Card.Body>
            <h6 className="text-warning mb-2 jb-summary-title">
              MENUNGGU PERSETUJUAN
            </h6>
            <h3 className="fw-bold text-warning mb-0">
              {summary.pendingCount}
            </h3>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default JualBeliSummaryCards;
