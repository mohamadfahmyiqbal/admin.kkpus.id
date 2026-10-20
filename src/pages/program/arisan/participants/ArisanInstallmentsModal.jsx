import React from "react";
import { Modal, Table, Button, Badge, Spinner, Card } from "react-bootstrap";
import { Receipt } from "phosphor-react";

const ArisanInstallmentsModal = ({
  show,
  onHide,
  loading,
  participant,
  installments = [],
  formatCurrency,
  onOpenInvoice,
  onVerify,
}) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-3">
        <Modal.Title className="fw-bold text-success">
          Daftar Setoran
          <div className="text-muted small fw-normal mt-1">
            {participant?.member_name}
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-4 bg-light">
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-0">
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : installments.length === 0 ? (
              <div className="text-center py-5 text-muted">
                Belum ada data setoran.
              </div>
            ) : (
              <div className="table-responsive">
                <Table
                  hover
                  responsive
                  borderless
                  className="align-middle mb-0 custom-table-admin"
                  style={{ whiteSpace: "nowrap" }}
                >
                  <thead className="table-light">
                    <tr>
                      <th
                        className="px-4 py-3 font-medium text-muted small text-center"
                        style={{
                          position: "sticky",
                          left: 0,
                          zIndex: 2,
                          backgroundColor: "#f8f9fa",
                          borderRight: "1px solid #e2e8f0",
                          width: "80px",
                        }}
                      >
                        Aksi
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small text-center">
                        Periode
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small text-center">
                        Tanggal
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small">
                        Nama Anggota
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small">
                        Nama Setoran
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small text-end">
                        Jumlah
                      </th>
                      <th className="px-4 py-3 font-medium text-muted small text-center">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {installments.map((inst, i) => {
                      const isPaid = inst.status === "PAID" || inst.status === "COMPLETED";
                      const isPendingVerification = inst.status === "PENDING_VERIFICATION";

                      return (
                          <tr
                            key={inst.id || i}
                            className="border-bottom"
                            style={{ borderColor: "#f8fafc" }}
                          >
                            <td
                              className="px-3 py-3 text-center"
                              style={{
                                position: "sticky",
                                left: 0,
                                zIndex: 1,
                                backgroundColor: "#fff",
                                borderRight: "1px solid #e2e8f0",
                              }}
                            >
                              <div className="d-flex justify-content-center gap-1">
                                {isPendingVerification && (
                                  <Button
                                    variant="warning"
                                    size="sm"
                                    className="btn-icon rounded-circle border shadow-sm p-1"
                                    title="Verifikasi Pembayaran"
                                    onClick={() => onVerify && onVerify(inst)}
                                  >
                                    <Receipt size={18} />
                                  </Button>
                                )}
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon text-primary rounded-circle border shadow-sm p-1"
                                  title="Lihat Invoice"
                                  onClick={() => onOpenInvoice(inst)}
                                >
                                  <Receipt size={18} />
                                </Button>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center fw-bold text-dark">
                              {inst.installment_number}
                            </td>
                            <td className="px-4 py-3 text-center text-muted small">
                              {inst.payment_date
                                ? new Date(inst.payment_date).toLocaleDateString(
                                    "id-ID"
                                  )
                                : "-"}
                            </td>
                            <td className="px-4 py-3 text-dark">
                              {participant?.member_name || "-"}
                            </td>
                            <td className="px-4 py-3 text-muted">
                              {inst.description || "-"}
                            </td>
                            <td className="px-4 py-3 text-end fw-bold text-success">
                              {formatCurrency(inst.amount)}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <Badge
                                bg={isPaid ? "success" : isPendingVerification ? "info" : "warning"}
                                className="px-3 py-2 rounded-pill fw-normal letter-spacing-1 small"
                              >
                                {isPaid
                                  ? "Lunas"
                                  : isPendingVerification
                                  ? "Menunggu Verifikasi"
                                  : "Belum Lunas"}
                              </Badge>
                            </td>
                          </tr>
                        );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>
    </Modal>
  );
};

export default ArisanInstallmentsModal;
