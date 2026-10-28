import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Handshake, TrendUp, Bank, Clock } from "phosphor-react";

const JualBeliSummaryCards = ({ summary, formatRp }) => {
  return (
    <Row className="g-3 mb-4">
      {/* 1. Total Pembiayaan */}
      <Col md={3} sm={6}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card bg-white position-relative overflow-hidden transition-all">
          <Card.Body className="p-3 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Total Pembiayaan
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-primary bg-opacity-10 text-primary"
                style={{ width: "36px", height: "36px" }}
              >
                <Handshake size={20} weight="fill" />
              </div>
            </div>
            <div>
              <h4 className="fw-bold text-dark mb-1 font-outfit" style={{ letterSpacing: "-0.5px" }}>
                {formatRp(summary.pembiayaanAktif)}
              </h4>
              <span className="text-muted small" style={{ fontSize: "11px" }}>
                Akumulasi pembiayaan aktif & lunas
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* 2. Laba Berjalan */}
      <Col md={3} sm={6}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card bg-white position-relative overflow-hidden transition-all">
          <Card.Body className="p-3 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Laba Berjalan
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-success bg-opacity-10 text-success"
                style={{ width: "36px", height: "36px" }}
              >
                <TrendUp size={20} weight="bold" />
              </div>
            </div>
            <div>
              <h4 className="fw-bold text-success mb-1 font-outfit" style={{ letterSpacing: "-0.5px" }}>
                {formatRp(summary.labaBerjalan)}
              </h4>
              <span className="text-muted small" style={{ fontSize: "11px" }}>
                Total keuntungan margin
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* 3. Total DP */}
      <Col md={3} sm={6}>
        <Card className="border-0 shadow-sm rounded-4 h-100 summary-card bg-white position-relative overflow-hidden transition-all">
          <Card.Body className="p-3 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className="text-muted fw-bold text-uppercase" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Total DP Diterima
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-info bg-opacity-10 text-info"
                style={{ width: "36px", height: "36px" }}
              >
                <Bank size={20} weight="fill" />
              </div>
            </div>
            <div>
              <h4 className="fw-bold text-info mb-1 font-outfit" style={{ letterSpacing: "-0.5px" }}>
                {formatRp(summary.dpDiterima)}
              </h4>
              <span className="text-muted small" style={{ fontSize: "11px" }}>
                Uang muka masuk terverifikasi
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>

      {/* 4. Menunggu Persetujuan */}
      <Col md={3} sm={6}>
        <Card className={`border-0 shadow-sm rounded-4 h-100 summary-card position-relative overflow-hidden transition-all ${
          summary.pendingCount > 0 ? "bg-warning bg-opacity-10 border border-warning border-opacity-25" : "bg-white"
        }`}>
          <Card.Body className="p-3 d-flex flex-column justify-content-between">
            <div className="d-flex align-items-center justify-content-between mb-2">
              <span className={`fw-bold text-uppercase ${summary.pendingCount > 0 ? "text-warning" : "text-muted"}`} style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
                Menunggu Persetujuan
              </span>
              <div 
                className="d-flex align-items-center justify-content-center rounded-3 bg-warning bg-opacity-20 text-warning"
                style={{ width: "36px", height: "36px" }}
              >
                <Clock size={20} weight="bold" />
              </div>
            </div>
            <div>
              <h4 className="fw-bold text-warning mb-1 font-outfit" style={{ letterSpacing: "-0.5px" }}>
                {summary.pendingCount}{" "}
                <span className="fs-6 fw-normal text-muted">Pengajuan</span>
              </h4>
              <span className="text-muted small" style={{ fontSize: "11px" }}>
                {summary.pendingCount > 0 ? "Perlu ditinjau segera" : "Semua pengajuan telah diproses"}
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default JualBeliSummaryCards;
