import React, { useRef } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { Printer, DownloadSimple } from "phosphor-react";

export const TransactionDetailModal = ({
  show,
  onHide,
  transaction,
  formatRupiah,
}) => {
  const printRef = useRef(null);

  if (!transaction) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isCompleted = [
    "Selesai",
    "COMPLETED",
    "APPROVED",
    "READY_TO_PAY",
    "PENDING_EXTERNAL",
    "DISBURSED",
  ].includes(transaction.status);

  // Fungsi Cetak Khusus Area Struk / Invoice Modal Saja
  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=800");
    if (!printWindow) {
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice-${transaction.id || "transaksi"}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>
            body {
              background-color: #fff;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .invoice-container {
              max-width: 500px;
              margin: 0 auto;
              border: 1px solid #e2e8f0;
              padding: 28px;
              border-radius: 12px;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            @media print {
              body { padding: 0; }
              .invoice-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContents}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Fungsi Download PDF Invoice
  const handleDownloadPdf = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;

    const printWindow = window.open("", "_blank", "width=800,height=800");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice-${transaction.id || "transaksi"}</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
          <style>
            body {
              background-color: #fff;
              padding: 24px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            }
            .invoice-container {
              max-width: 550px;
              margin: 0 auto;
              border: 1px solid #cbd5e1;
              padding: 32px;
              border-radius: 12px;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            @media print {
              body { padding: 0; }
              .invoice-container { border: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            ${printContents}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
      <Modal.Body className="p-0 position-relative">
        <button
          onClick={onHide}
          className="btn-close position-absolute top-0 end-0 m-3"
          style={{ zIndex: 10 }}
          aria-label="Close"
        />
        <div
          className="invoice-container p-4 p-md-5 bg-white rounded-3 shadow-sm"
          ref={printRef}
        >
          <div className="text-center mb-4">
            <h4 className="fw-bold text-dark mb-1">INVOICE TRANSAKSI</h4>
            <p className="text-muted small mb-0">Koperasi PUS</p>
          </div>

          <div className="d-flex justify-content-center mb-4">
            <Badge
              bg={isCompleted ? "success" : "warning"}
              className="bg-opacity-10 px-3 py-2 rounded-2 text-uppercase fw-bold border border-1"
              style={{
                color: isCompleted ? "#10b981" : "#f59e0b",
                borderColor: isCompleted
                  ? "rgba(16, 185, 129, 0.3)"
                  : "rgba(245, 158, 11, 0.3)",
                letterSpacing: "1px",
              }}
            >
              {isCompleted ? "LUNAS" : "PENDING"}
            </Badge>
          </div>

          <hr className="border-secondary opacity-25" />

          <div className="mb-4 mt-4">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">No. Invoice</span>
              <span className="fw-semibold text-dark small">
                {transaction.id?.toUpperCase() || transaction.transaction_id?.toUpperCase() || "-"}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Waktu</span>
              <span className="fw-semibold text-dark small">
                {formatDate(transaction.date || transaction.created_at)}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Anggota</span>
              <span className="fw-semibold text-dark small">
                {transaction.member || transaction.full_name || "-"}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">ID Anggota</span>
              <span className="fw-semibold text-dark small">
                {transaction.member_id?.substring(0, 8) || "-"}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Kasir / Teller</span>
              <span className="fw-semibold text-dark small">Sistem / Admin</span>
            </div>
          </div>

          <hr
            className="border-secondary opacity-25 border-dashed"
            style={{ borderStyle: "dashed" }}
          />

          <div className="mt-4 mb-4">
            <h6 className="fw-bold text-muted small text-uppercase mb-3">
              Rincian Transaksi
            </h6>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <p className="fw-bold text-dark mb-0">
                  {transaction.product_name || transaction.type || "Simpanan"}
                </p>
                <small className="text-muted">Kategori: {transaction.type}</small>
              </div>
              <div className="text-end">
                <span className="fw-bold text-dark">
                  {formatRupiah(transaction.amount || 0)}
                </span>
              </div>
            </div>
          </div>

          <hr
            className="border-secondary opacity-25 border-dashed"
            style={{ borderStyle: "dashed" }}
          />

          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="text-muted small">Subtotal</span>
              <span className="fw-semibold text-dark small">
                {formatRupiah(transaction.amount || 0)}
              </span>
            </div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">Biaya Admin</span>
              <span className="fw-semibold text-dark small">Rp 0</span>
            </div>
            <div className="d-flex justify-content-between align-items-center bg-light p-3 rounded-3 mt-3">
              <span className="fw-bold text-dark">Total Pembayaran</span>
              <span className="fw-bold text-primary fs-5">
                {formatRupiah(transaction.amount || 0)}
              </span>
            </div>
          </div>

          <div className="text-center mt-5">
            <p className="text-muted small">
              Terima kasih telah bertransaksi.
              <br />
              Simpan struk ini sebagai bukti transaksi yang sah.
            </p>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-0 bg-light d-flex justify-content-between rounded-bottom">
        <Button variant="outline-secondary" onClick={onHide} className="fw-medium px-4">
          Tutup
        </Button>
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            onClick={handleDownloadPdf}
            className="fw-medium px-3 d-flex align-items-center gap-2"
            title="Download / Simpan sebagai PDF"
          >
            <DownloadSimple size={18} />
            <span>PDF</span>
          </Button>
          <Button
            variant="primary"
            onClick={handlePrint}
            className="fw-medium px-4 d-flex align-items-center gap-2"
          >
            <Printer size={18} /> Cetak Invoice
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default TransactionDetailModal;
