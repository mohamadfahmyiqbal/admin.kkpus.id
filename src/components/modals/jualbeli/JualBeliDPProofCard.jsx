// PATH: src/components/modals/jualbeli/JualBeliDPProofCard.jsx
import React, { useState } from "react";
import { Card, Badge, Modal, Row, Col } from "react-bootstrap";
import { FileImage, ShieldCheck, WarningCircle, Eye } from "phosphor-react";

const JualBeliDPProofCard = ({
  downPayment,
  hasUploadedDP,
  dpProofUrl,
  dpPayment,
  formatCurrency,
  isBendaharaStep,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);

  if (!downPayment || downPayment <= 0) return null;

  const getMediaUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("http") || cleanPath.startsWith("data:")) return cleanPath;
    const base = (
      import.meta.env.VITE_API_ORIGIN ||
      (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445")
    ).replace(/\/$/, "");
    return `${base}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  };

  const fullProofUrl = dpProofUrl ? getMediaUrl(dpProofUrl) : null;

  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <ShieldCheck size={18} className="text-primary" weight="fill" />
        Uang Tanda Keseriusan (DP)
      </h6>

      <Card className="border-0 shadow-sm rounded-4 p-3 bg-white" style={{ border: "1px solid #f1f5f9" }}>
        <div className="d-flex justify-content-between align-items-center mb-2 pb-2 border-bottom border-light">
          <span className="text-muted small fw-medium">Nominal Tanda Keseriusan</span>
          <span className="fw-bold text-primary fs-6">{formatCurrency(downPayment)}</span>
        </div>

        {hasUploadedDP && fullProofUrl ? (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Status Bukti Transfer:</span>
              <Badge bg="success" className="px-3 py-1 rounded-pill fw-semibold bg-opacity-10 text-success border border-success border-opacity-25">
                Bukti Transfer Terlampir
              </Badge>
            </div>

            {dpPayment && (
              <Row className="small text-muted mb-2 g-1 bg-light p-2 rounded-3">
                {dpPayment.sender_bank && (
                  <Col xs={6}>
                    <span className="d-block text-secondary" style={{ fontSize: "11px" }}>Bank Pengirim:</span>
                    <span className="fw-semibold text-dark">{dpPayment.sender_bank}</span>
                  </Col>
                )}
                {dpPayment.sender_name && (
                  <Col xs={6}>
                    <span className="d-block text-secondary" style={{ fontSize: "11px" }}>Atas Nama:</span>
                    <span className="fw-semibold text-dark">{dpPayment.sender_name}</span>
                  </Col>
                )}
              </Row>
            )}

            <div
              className="position-relative border rounded-3 overflow-hidden d-flex justify-content-center align-items-center bg-light mt-2"
              style={{ maxHeight: "160px", cursor: "pointer" }}
              onClick={() => setShowImageModal(true)}
              title="Klik untuk memperbesar gambar"
            >
              <img
                src={fullProofUrl}
                alt="Bukti Transfer DP"
                className="img-fluid"
                style={{ maxHeight: "160px", objectFit: "contain" }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x250?text=Bukti+Transfer";
                }}
              />
              <div
                className="position-absolute bottom-0 start-0 end-0 text-center py-1 text-white bg-dark bg-opacity-50 small d-flex align-items-center justify-content-center gap-1"
                style={{ fontSize: "12px" }}
              >
                <Eye size={14} /> Klik untuk perbesar
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning py-2 px-3 small mb-0 rounded-3 text-center d-flex align-items-center gap-2">
            <WarningCircle size={20} className="text-warning flex-shrink-0" weight="fill" />
            <div className="text-start">
              <strong>Belum Ada Bukti Pembayaran:</strong> Anggota belum mengunggah bukti transfer Uang Tanda Keseriusan.
              {isBendaharaStep && (
                <div className="extra-small text-muted mt-1">
                  Tombol persetujuan Bendahara akan aktif setelah bukti transfer diunggah oleh anggota.
                </div>
              )}
            </div>
          </div>
        )}
      </Card>

      {/* Modal Preview Full Image */}
      {fullProofUrl && (
        <Modal show={showImageModal} onHide={() => setShowImageModal(false)} centered size="lg">
          <Modal.Header closeButton className="border-0">
            <Modal.Title className="fs-6 fw-bold">Bukti Transfer Uang Tanda Keseriusan</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-2 text-center bg-dark">
            <img
              src={fullProofUrl}
              alt="Bukti Transfer Penuh"
              className="img-fluid rounded"
              style={{ maxHeight: "80vh" }}
            />
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
};

export default JualBeliDPProofCard;
