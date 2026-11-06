import React, { useState, useMemo } from "react";
import { Modal, Button, Table, Badge, Card, Row, Col, Form } from "react-bootstrap";
import {
  X,
  Receipt,
  CheckCircle,
  Clock,
  WarningCircle,
  MagnifyingGlass,
  Wallet,
} from "phosphor-react";

export const MemberSavingsDetailModal = ({
  show,
  onHide,
  member,
  savingsType = "POKOK",
  formatRupiah,
  onViewInvoice,
}) => {
  const [search, setSearch] = useState("");

  const transactions = member?.transactions || [];

  const filteredTransactions = useMemo(() => {
    if (!search.trim()) return transactions;
    const q = search.trim().toLowerCase();
    return transactions.filter(
      (tx) =>
        (tx.description || "").toLowerCase().includes(q) ||
        (tx.status || "").toLowerCase().includes(q) ||
        String(tx.amount || "").includes(q)
    );
  }, [transactions, search]);

  if (!member) return null;

  const typeLabel = savingsType === "POKOK" ? "Simpanan Pokok" : "Simpanan Wajib";

  const renderStatusBadge = (tx) => {
    const raw = (tx.raw_status || tx.status || "").toUpperCase();
    const isCompleted =
      tx.is_paid ||
      raw === "COMPLETED" ||
      raw === "APPROVED" ||
      raw === "PAID" ||
      raw === "SELESAI";
    const isPending =
      raw === "PENDING_VERIFICATION" ||
      raw === "PENDING" ||
      (tx.status || "").toLowerCase().includes("verifikasi");

    if (isCompleted) {
      return (
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          <CheckCircle size={12} className="me-1" weight="bold" />
          Selesai
        </span>
      );
    }

    if (isPending) {
      return (
        <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          <Clock size={12} className="me-1" weight="bold" />
          Menunggu Verifikasi
        </span>
      );
    }

    return (
      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
        <WarningCircle size={12} className="me-1" weight="bold" />
        Belum Terbayar
      </span>
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return (
      d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
      " WIB"
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered backdrop="static">
      <Modal.Header className="border-bottom px-4 py-3 bg-light">
        <div>
          <Modal.Title className="h6 fw-bold text-dark mb-0">
            Daftar Transaksi {typeLabel}
          </Modal.Title>
          <div className="text-muted small mt-1">
            Anggota: <span className="fw-semibold text-dark">{member.full_name}</span> (No. {member.member_no || "-"})
          </div>
        </div>
        <button
          onClick={onHide}
          className="btn-close ms-auto"
          aria-label="Close"
        />
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Ringkasan Saldo Anggota */}
        <Row className="g-3 mb-4">
          <Col md={4} sm={12}>
            <Card className="border-0 shadow-sm rounded-3 bg-primary bg-opacity-10">
              <Card.Body className="p-3">
                <div className="text-muted extra-small text-uppercase fw-bold">
                  Total Transaksi
                </div>
                <div className="h5 fw-bold text-primary mb-0 mt-1">
                  {formatRupiah(member.total_amount || 0)}
                </div>
                <div className="extra-small text-muted mt-1">
                  {member.total_count || 0} Transaksi Terdaftar
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm rounded-3 bg-success bg-opacity-10">
              <Card.Body className="p-3">
                <div className="text-muted extra-small text-uppercase fw-bold">
                  Total Terbayar
                </div>
                <div className="h5 fw-bold text-success mb-0 mt-1">
                  {formatRupiah(member.paid_amount || 0)}
                </div>
                <div className="extra-small text-muted mt-1">
                  {member.paid_count || 0} Transaksi Lunas
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4} sm={6}>
            <Card className="border-0 shadow-sm rounded-3 bg-danger bg-opacity-10">
              <Card.Body className="p-3">
                <div className="text-muted extra-small text-uppercase fw-bold">
                  Belum Terbayar
                </div>
                <div className="h5 fw-bold text-danger mb-0 mt-1">
                  {formatRupiah(member.unpaid_amount || 0)}
                </div>
                <div className="extra-small text-muted mt-1">
                  {member.unpaid_count || 0} Transaksi Tertunggak
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Toolbar Pencarian */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="fw-bold text-dark mb-0">Rincian Transaksi Detail</h6>
          <div style={{ width: "260px" }}>
            <Form.Control
              type="text"
              size="sm"
              placeholder="Cari transaksi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-light border-0 shadow-none"
              style={{ fontSize: "12px" }}
            />
          </div>
        </div>

        {/* Tabel Rincian */}
        <div className="table-responsive border rounded-3 overflow-hidden">
          <Table hover className="align-middle mb-0" style={{ fontSize: "13px" }}>
            <thead className="bg-light text-uppercase text-secondary" style={{ fontSize: "11px" }}>
              <tr>
                <th className="py-2.5 px-3 text-center" style={{ width: "50px" }}>No</th>
                <th className="py-2.5 px-3" style={{ width: "170px" }}>Tanggal</th>
                <th className="py-2.5 px-3">Keterangan</th>
                <th className="py-2.5 px-3 text-end" style={{ width: "150px" }}>Nominal</th>
                <th className="py-2.5 px-3 text-center" style={{ width: "140px" }}>Status</th>
                {onViewInvoice && (
                  <th className="py-2.5 px-3 text-center" style={{ width: "80px" }}>Aksi</th>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={onViewInvoice ? "6" : "5"} className="text-center py-4 text-muted">
                    Tidak ada rincian transaksi yang sesuai.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx, idx) => (
                  <tr key={tx.id || idx}>
                    <td className="py-2.5 px-3 text-center text-muted fw-medium">{idx + 1}</td>
                    <td className="py-2.5 px-3 text-secondary extra-small fw-medium">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="fw-semibold text-dark">{tx.description || tx.product_name}</div>
                      {tx.type && (
                        <div className="text-muted extra-small">Tipe: {tx.type}</div>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-end fw-bold text-dark">
                      {formatRupiah(tx.amount || 0)}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      {renderStatusBadge(tx)}
                    </td>
                    {onViewInvoice && (
                      <td className="py-2.5 px-3 text-center">
                        <Button
                          variant="white"
                          size="sm"
                          className="border p-1 text-primary shadow-none"
                          onClick={() => onViewInvoice(tx, member)}
                          title="Lihat Invoice Transaksi"
                        >
                          <Receipt size={16} />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer className="border-top px-4 py-3 bg-light">
        <Button variant="secondary" size="sm" onClick={onHide} className="px-3">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberSavingsDetailModal;
