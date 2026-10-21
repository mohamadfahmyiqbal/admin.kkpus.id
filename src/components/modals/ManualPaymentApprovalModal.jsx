import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Row, Col, Badge } from "react-bootstrap";
import {
  CheckCircle,
  XCircle,
  FileImage,
  FilePdf,
  Eye,
  ArrowSquareOut,
  DownloadSimple,
  User,
  CalendarBlank,
  Wallet,
} from "phosphor-react";
import Swal from "sweetalert2";
import billingService from "../../utils/api/UBilling";
import api from "../../utils/api/common";

const ManualPaymentApprovalModal = ({ show, onHide, transaction, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [showFullProof, setShowFullProof] = useState(false);
  const [blobUrl, setBlobUrl] = useState(null);
  const [fileLoading, setFileLoading] = useState(false);
  const [fileError, setFileError] = useState(false);

  // Mendukung berbagai penamaan properti bukti transfer dari berbagai controller/model
  const rawProofCandidate =
    transaction?.proof_of_transfer ||
    transaction?.transfer_proof ||
    transaction?.proof_url ||
    transaction?.transfer_proof_path ||
    transaction?.proof ||
    transaction?.file ||
    transaction?.payment_proof ||
    transaction?.receipt_url ||
    (transaction?.payment && (transaction.payment.proof_of_transfer || transaction.payment.proof_url || transaction.payment.transfer_proof)) ||
    (transaction?.dp_payment && (transaction.dp_payment.proof_of_transfer || transaction.dp_payment.proof_url));

  // Fungsi untuk mengekstrak path string jika data berwujud array atau JSON string
  const resolveProofPath = (val) => {
    if (!val) return null;
    if (typeof val === "string") {
      const trimmed = val.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed) && parsed.length > 0) return resolveProofPath(parsed[0]);
        } catch (e) {}
      }
      if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
        try {
          const parsed = JSON.parse(trimmed);
          return (
            parsed.url ||
            parsed.path ||
            parsed.proof_of_transfer ||
            parsed.file ||
            parsed.filename ||
            null
          );
        } catch (e) {}
      }
      return trimmed;
    }
    if (Array.isArray(val) && val.length > 0) {
      return resolveProofPath(val[0]);
    }
    if (typeof val === "object") {
      return val.url || val.path || val.proof_of_transfer || val.file || val.filename || null;
    }
    return String(val);
  };

  const rawProof = resolveProofPath(rawProofCandidate);

  const getFullUrl = (path) => {
    if (!path || typeof path !== "string") return null;
    const cleanPath = path.replace(/\\/g, "/").trim();
    if (
      cleanPath.startsWith("http://") ||
      cleanPath.startsWith("https://") ||
      cleanPath.startsWith("data:") ||
      cleanPath.startsWith("blob:")
    ) {
      return cleanPath;
    }
    const normalized = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;
    const base = (
      import.meta.env.VITE_API_ORIGIN ||
      (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445")
    ).replace(/\/$/, "");
    return `${base}${normalized}`;
  };

  const proofUrl = getFullUrl(rawProof);

  // Deteksi apakah dokumen bukti berformat PDF
  const isPdf = Boolean(
    rawProof &&
      (cleanPathWithoutQuery(String(rawProof)).toLowerCase().endsWith(".pdf") ||
        String(rawProof).toLowerCase().includes(".pdf?") ||
        String(rawProof).toLowerCase().startsWith("data:application/pdf") ||
        transaction.mimetype === "application/pdf" ||
        transaction.proof_mime === "application/pdf" ||
        transaction.file_type === "application/pdf" ||
        transaction.content_type === "application/pdf")
  );

  function cleanPathWithoutQuery(str) {
    return str.split("?")[0].split("#")[0];
  }

  // Ambil file via axios blob agar terhindar dari error CSP "frame-ancestors 'self'" pada iframe
  useEffect(() => {
    let activeBlob = null;
    if (show && proofUrl) {
      setFileLoading(true);
      setFileError(false);

      if (proofUrl.startsWith("data:") || proofUrl.startsWith("blob:")) {
        setBlobUrl(proofUrl);
        setFileLoading(false);
        return;
      }

      api
        .get(proofUrl, { responseType: "blob" })
        .then((res) => {
          activeBlob = URL.createObjectURL(res.data);
          setBlobUrl(activeBlob);
        })
        .catch((err) => {
          console.error("Gagal mengambil berkas bukti via blob:", err);
          setBlobUrl(proofUrl);
        })
        .finally(() => {
          setFileLoading(false);
        });
    } else {
      setBlobUrl(null);
      setFileLoading(false);
      setFileError(false);
    }

    return () => {
      if (activeBlob) URL.revokeObjectURL(activeBlob);
    };
  }, [show, proofUrl]);

  const handleAction = async (action) => {
    const isApprove = action === "APPROVE";
    const confirm = await Swal.fire({
      title: isApprove ? "Setujui Pembayaran?" : "Tolak Pembayaran?",
      text: isApprove
        ? `Apakah Anda yakin ingin memverifikasi setoran sebesar ${transaction.amount}? Saldo dan pembukuan kas akan langsung diperbarui.`
        : "Pastikan Anda memberikan alasan penolakan pada catatan admin.",
      icon: isApprove ? "question" : "warning",
      showCancelButton: true,
      confirmButtonText: isApprove ? "Ya, Setujui" : "Ya, Tolak",
      cancelButtonText: "Batal",
      confirmButtonColor: isApprove ? "#10b981" : "#ef4444",
    });

    if (!confirm.isConfirmed) return;

    setLoading(true);
    try {
      const res = await billingService.verifyManualPayment({
        transaction_id: transaction.id || transaction.transaction_id,
        action,
        admin_note: adminNote || (isApprove ? "Diverifikasi oleh Bendahara" : "Bukti transfer tidak valid"),
      });

      if (res.data?.status || res.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: `Pembayaran berhasil ${isApprove ? "disetujui" : "ditolak"}.`,
        });
        if (onSuccess) onSuccess();
        onHide();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal memproses verifikasi.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setLoading(false);
    }
  };

  const activeDisplayUrl = blobUrl || proofUrl;

  if (!transaction) return null;

  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg" className="border-0 shadow-lg">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold fs-5 text-dark d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-3 d-flex">
              <CheckCircle size={22} weight="fill" />
            </div>
            Verifikasi Setoran Pembayaran Manual
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Row className="g-4">
            {/* Sisi Kiri: Bukti Transfer (Image / PDF) */}
            <Col md={5} className="text-center">
              <div className="fw-semibold text-muted small mb-2 text-start d-flex justify-content-between align-items-center">
                <span>Bukti Transfer Anggota:</span>
                {isPdf && (
                  <Badge bg="danger" className="text-uppercase px-2 py-1">
                    Dokumen PDF
                  </Badge>
                )}
              </div>
              {proofUrl ? (
                fileLoading ? (
                  <div
                    className="border rounded-4 p-3 bg-light d-flex flex-column align-items-center justify-content-center shadow-sm"
                    style={{ minHeight: "280px" }}
                  >
                    <Spinner animation="border" variant="primary" size="sm" className="mb-2" />
                    <span className="small text-muted">Memuat dokumen bukti...</span>
                  </div>
                ) : isPdf ? (
                  /* Tampilan jika dokumen PDF */
                  <div
                    className="border rounded-4 p-3 bg-light d-flex flex-column align-items-center justify-content-between position-relative shadow-sm"
                    style={{ minHeight: "280px" }}
                  >
                    <div
                      className="w-100 rounded-3 overflow-hidden border bg-white position-relative"
                      style={{ height: "200px", cursor: "pointer" }}
                      onClick={() => setShowFullProof(true)}
                      title="Klik untuk perbesar / lihat PDF penuh"
                    >
                      {blobUrl ? (
                        <iframe
                          src={blobUrl}
                          title="Preview Bukti PDF"
                          className="w-100 h-100 border-0"
                          style={{ pointerEvents: "none" }}
                        />
                      ) : (
                        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light text-danger">
                          <FilePdf size={48} weight="fill" />
                          <span className="small mt-2 fw-semibold">Dokumen PDF</span>
                        </div>
                      )}
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-dark bg-opacity-25 text-white"
                        style={{ backdropFilter: "blur(1px)" }}
                      >
                        <Eye size={28} weight="bold" />
                        <span className="small fw-semibold mt-1">Klik untuk Lihat PDF</span>
                      </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between w-100 mt-2 px-1">
                      <div className="d-flex align-items-center gap-1 text-danger small fw-semibold">
                        <FilePdf size={18} weight="fill" /> Dokumen PDF
                      </div>
                      <div className="d-flex gap-1">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="py-1 px-2 rounded-2 extra-small d-flex align-items-center gap-1"
                          onClick={() => setShowFullProof(true)}
                        >
                          <Eye size={14} /> Lihat
                        </Button>
                        <a
                          href={activeDisplayUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-secondary btn-sm py-1 px-2 rounded-2 extra-small d-flex align-items-center gap-1"
                        >
                          <ArrowSquareOut size={14} /> Buka Tab
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Tampilan jika dokumen Gambar (JPG, PNG, WEBP, dll) */
                  <div
                    className="border rounded-4 p-2 bg-light d-flex flex-column align-items-center justify-content-center overflow-hidden position-relative shadow-sm"
                    style={{ minHeight: "280px" }}
                  >
                    <div
                      className="w-100 d-flex flex-column align-items-center justify-content-center"
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowFullProof(true)}
                      title="Klik untuk perbesar gambar"
                    >
                      {imageError ? (
                        <div className="py-4 text-center text-muted">
                          <FileImage size={40} className="text-secondary opacity-50 mb-2" />
                          <p className="extra-small mb-1 text-danger">Gambar tidak dapat dimuat langsung.</p>
                          <a
                            href={activeDisplayUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary py-1 px-2 mt-1 extra-small"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ArrowSquareOut size={13} className="me-1" /> Coba Buka Link Gambar
                          </a>
                        </div>
                      ) : (
                        <img
                          src={activeDisplayUrl}
                          alt="Bukti Transfer"
                          className="img-fluid rounded-3 shadow-sm"
                          style={{ maxHeight: "230px", objectFit: "contain" }}
                          onError={() => setImageError(true)}
                        />
                      )}
                    </div>
                    <div className="d-flex align-items-center justify-content-between w-100 mt-2 px-2">
                      <div
                        className="text-primary small fw-medium d-flex align-items-center gap-1"
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowFullProof(true)}
                      >
                        <FileImage size={16} /> Klik untuk perbesar
                      </div>
                      <a
                        href={activeDisplayUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-secondary btn-sm py-1 px-2 rounded-2 extra-small d-flex align-items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ArrowSquareOut size={14} /> Tab Baru
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <div className="border rounded-4 p-4 bg-light text-muted small text-center" style={{ minHeight: "260px" }}>
                  <div className="d-flex flex-column align-items-center justify-content-center h-100 py-5">
                    <FileImage size={40} className="text-secondary opacity-50 mb-2" />
                    <span>Bukti transfer tidak tersedia</span>
                  </div>
                </div>
              )}
            </Col>

            {/* Sisi Kanan: Detail Transaksi */}
            <Col md={7}>
              <div className="bg-light p-3 rounded-4 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Status</span>
                  <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">
                    Menunggu Verifikasi Bendahara
                  </Badge>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Kategori / Item</span>
                  <span className="fw-bold text-dark small text-end">{transaction.item || transaction.tx_category}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small">Total Setoran</span>
                  <span className="fw-bold text-success fs-5">{transaction.amount}</span>
                </div>
              </div>

              <div className="border rounded-4 p-3 bg-white mb-3 shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <User size={16} className="text-primary" />
                  <span className="text-muted small">Nama Anggota:</span>
                  <span className="fw-semibold text-dark small ms-auto">{transaction.name}</span>
                </div>
                {transaction.sender_bank && (
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <Wallet size={16} className="text-primary" />
                    <span className="text-muted small">Bank Pengirim:</span>
                    <span className="fw-semibold text-dark small ms-auto">
                      {transaction.sender_bank} ({transaction.sender_account_no || "-"})
                    </span>
                  </div>
                )}
                <div className="d-flex align-items-center gap-2">
                  <CalendarBlank size={16} className="text-primary" />
                  <span className="text-muted small">Waktu Unggah:</span>
                  <span className="fw-semibold text-dark small ms-auto">
                    {transaction.date ? new Date(transaction.date).toLocaleString("id-ID") : "-"}
                  </span>
                </div>
              </div>

              <Form.Group className="mb-2">
                <Form.Label className="small fw-bold text-muted">Catatan Bendahara (Opsional)</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  placeholder="Tambahkan catatan atau alasan jika ditolak..."
                  className="rounded-3 border-light shadow-none bg-light small"
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer className="border-0 pt-0 px-4 pb-4">
          <div className="w-100 d-flex gap-2">
            <Button
              variant="outline-danger"
              className="flex-fill fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-1"
              onClick={() => handleAction("REJECT")}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : <><XCircle size={18} /> Tolak</>}
            </Button>
            <Button
              variant="success"
              className="flex-fill fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-1 border-0 text-white"
              style={{ backgroundColor: "#10b981" }}
              onClick={() => handleAction("APPROVE")}
              disabled={loading}
            >
              {loading ? <Spinner size="sm" /> : <><CheckCircle size={18} /> Setujui & Bukukan</>}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Modal Preview Gambar / PDF Penuh */}
      {showFullProof && proofUrl && (
        <Modal
          show={showFullProof}
          onHide={() => setShowFullProof(false)}
          centered
          size={isPdf ? "xl" : "lg"}
        >
          <Modal.Header closeButton className="py-2 border-bottom">
            <div className="d-flex align-items-center justify-content-between w-100 pe-3">
              <Modal.Title className="fs-6 fw-bold d-flex align-items-center gap-2 mb-0">
                {isPdf ? (
                  <>
                    <FilePdf size={22} className="text-danger" weight="fill" />
                    Bukti Transfer (Dokumen PDF)
                  </>
                ) : (
                  <>
                    <FileImage size={22} className="text-primary" weight="fill" />
                    Bukti Transfer Asli (Gambar)
                  </>
                )}
              </Modal.Title>
              <div className="d-flex align-items-center gap-2">
                <a
                  href={activeDisplayUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-primary py-1 px-2 d-flex align-items-center gap-1"
                >
                  <ArrowSquareOut size={16} /> Buka di Tab Baru
                </a>
                <a
                  href={activeDisplayUrl}
                  download={`bukti-transfer-${transaction.id || "transaksi"}.${isPdf ? "pdf" : "jpg"}`}
                  className="btn btn-sm btn-outline-secondary py-1 px-2 d-flex align-items-center gap-1"
                >
                  <DownloadSimple size={16} /> Unduh
                </a>
              </div>
            </div>
          </Modal.Header>
          <Modal.Body className="p-0 text-center bg-dark d-flex align-items-center justify-content-center position-relative" style={{ minHeight: isPdf ? "75vh" : "60vh" }}>
            {isPdf ? (
              <iframe
                src={activeDisplayUrl}
                title="Bukti Transfer PDF Penuh"
                className="w-100 border-0"
                style={{ height: "80vh" }}
              />
            ) : (
              <div className="p-2 w-100 d-flex justify-content-center align-items-center">
                <img
                  src={activeDisplayUrl}
                  alt="Bukti Transfer Penuh"
                  className="img-fluid rounded"
                  style={{ maxHeight: "80vh", objectFit: "contain" }}
                  onError={() => setImageError(true)}
                />
              </div>
            )}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default ManualPaymentApprovalModal;
