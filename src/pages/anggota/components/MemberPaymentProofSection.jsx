import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const MemberPaymentProofSection = ({ pendingPayment, fullName, getMediaUrl }) => {
  if (!pendingPayment) {
    return (
      <>
        <h6 className="fw-bold mb-3 text-dark mt-4">2. Informasi Transaksi & Pembayaran</h6>
        <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
          <p className="text-muted small mb-0">
            Belum ada konfirmasi & upload bukti pembayaran simpanan pokok/wajib dari anggota.
          </p>
        </Card>
      </>
    );
  }

  const proofUrl =
    pendingPayment.proof_of_transfer ||
    pendingPayment.proof_url ||
    pendingPayment.transfer_proof;

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark mt-4">2. Bukti Pembayaran Simpanan Pokok & Wajib</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Kategori Pembayaran
          </Col>
          <Col xs={8} md={8} className="fw-bold text-primary text-start">
            {pendingPayment.tx_category
              ? pendingPayment.tx_category.replace(/_/g, " ")
              : "Simpanan Pokok & Wajib (Pendaftaran)"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Nominal Transfer
          </Col>
          <Col xs={8} md={8} className="fw-bold text-dark text-start">
            Rp {Number(pendingPayment.amount || 0).toLocaleString("id-ID")}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Rekening / Bank Pengirim
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {pendingPayment.sender_bank || pendingPayment.payment_method || "-"}{" "}
            {pendingPayment.sender_account_no ? `(${pendingPayment.sender_account_no})` : ""} a.n{" "}
            {pendingPayment.sender_name || fullName || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Status Pembayaran
          </Col>
          <Col xs={8} md={8} className="text-start">
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill fw-bold">
              {pendingPayment.status || "PENDING_VERIFICATION"}
            </span>
          </Col>
        </Row>

        <div className="mt-3 text-center">
          <p className="small fw-bold text-muted mb-2">Bukti Struk Transfer:</p>
          {proofUrl ? (
            <a href={getMediaUrl(proofUrl)} target="_blank" rel="noopener noreferrer">
              <img
                src={getMediaUrl(proofUrl)}
                className="img-fluid rounded border shadow-sm"
                alt="Bukti Transfer"
                style={{
                  maxHeight: "260px",
                  objectFit: "contain",
                  width: "100%",
                  backgroundColor: "#fff",
                  cursor: "pointer",
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x300?text=Gambar+Tidak+Ditemukan";
                }}
              />
            </a>
          ) : (
            <div className="alert alert-warning py-2 px-3 small mb-0 rounded-3 text-center">
              ⚠️ Anggota belum mengunggah struk/screenshot bukti transfer.
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default MemberPaymentProofSection;
