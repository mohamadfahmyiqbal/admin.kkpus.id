import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { Receipt } from "phosphor-react";

export const formatDate = (d, withTime = false) => {
  if (!d) return "-";
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      ...(withTime && { hour: "2-digit", minute: "2-digit" }),
    });
  } catch {
    return String(d);
  }
};

const SetoranInvoiceModal = ({
  show,
  onHide,
  invoice,
  transaction,
  formatRp,
}) => {
  if (!invoice) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      className="border-0 shadow-lg"
    >
      <Modal.Header closeButton className="border-bottom pb-3">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
          <Receipt size={28} className="text-primary" weight="fill" />
          Invoice Setoran
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4">
        <div className="invoice-content">
          <div className="text-center mb-4">
            <h5 className="fw-bold mb-1">Bukti Pembayaran</h5>
            <p className="text-muted small mb-0">
              No. Ref: INV-{invoice.id || invoice.installment_number}
            </p>
          </div>

          <div className="bg-light p-3 rounded-3 mb-4 border">
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Tanggal</span>
              <span className="fw-bold small">
                {formatDate(invoice.payment_date, true)}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Anggota</span>
              <span className="fw-bold small">
                {transaction?.nama_nasabah ||
                  transaction?.member_name ||
                  transaction?.user_id ||
                  "-"}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Produk</span>
              <span className="fw-bold small">
                {transaction?.item_name || transaction?.item || "-"}
              </span>
            </div>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted small">Setoran</span>
              <span className="fw-bold small">
                {invoice.description ||
                  `Bulan ke-${invoice.installment_number}`}
              </span>
            </div>
            <div className="d-flex justify-content-between pt-2 mt-2 border-top">
              <span className="text-muted fw-bold">Total Bayar</span>
              <span className="text-primary fw-bold fs-5">
                {formatRp ? formatRp(invoice.amount) : invoice.amount}
              </span>
            </div>
          </div>

          <div className="text-center">
            <Badge
              bg="success"
              className="px-4 py-2 rounded-pill bg-opacity-10 text-success border border-success border-opacity-25 fs-6"
            >
              LUNAS
            </Badge>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 pb-4 px-4 d-flex gap-2">
        <Button
          variant="outline-primary"
          className="flex-grow-1 fw-bold py-2 rounded-3"
          onClick={() => window.print()}
        >
          Cetak
        </Button>
        <Button
          variant="light"
          className="flex-grow-1 fw-bold py-2 rounded-3 border text-muted"
          onClick={onHide}
        >
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SetoranInvoiceModal;
