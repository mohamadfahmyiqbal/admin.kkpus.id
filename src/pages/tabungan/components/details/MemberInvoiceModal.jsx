import React from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { Receipt } from "phosphor-react";

export const MemberInvoiceModal = ({
  show,
  onHide,
  invoice,
  member,
  formatRupiah,
}) => (
  <Modal show={show} onHide={onHide} size="md" centered>
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="fw-bold d-flex align-items-center gap-2">
        <Receipt size={24} className="text-primary" weight="fill" />
        Invoice Tabungan
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="pt-3">
      {invoice && (
        <div className="d-flex flex-column gap-3">
          <div className="p-4 bg-light rounded-3 text-center">
            <div className="text-muted small mb-1">Total Tagihan</div>
            <div className="fw-bold fs-2 text-primary mb-2">
              {formatRupiah(invoice.amount)}
            </div>
            <Badge
              bg={
                invoice.status === "PAID"
                  ? "success"
                  : invoice.status === "UNPAID"
                  ? "warning"
                  : "secondary"
              }
              className="rounded-pill px-3 py-2 fs-6"
            >
              {invoice.status}
            </Badge>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <span className="text-muted small">ID Transaksi</span>
                  <span className="fw-medium text-dark">
                    {invoice.bill_id || "-"}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <span className="text-muted small">Nama Anggota</span>
                  <span className="fw-medium text-dark">{member?.nama}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <span className="text-muted small">Nama Setoran</span>
                  <span className="fw-medium text-dark">
                    {invoice.item_name || "Setoran Tabungan"}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <span className="text-muted small">Periode</span>
                  <span className="fw-medium text-dark">
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString("id-ID", {
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                  <span className="text-muted small">Jatuh Tempo</span>
                  <span className="fw-medium text-dark">
                    {invoice.due_date
                      ? new Date(invoice.due_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Modal.Body>
    <Modal.Footer className="border-0 pt-0 mt-3">
      <Button variant="light" className="w-100" onClick={onHide}>
        Tutup
      </Button>
    </Modal.Footer>
  </Modal>
);

export default MemberInvoiceModal;
