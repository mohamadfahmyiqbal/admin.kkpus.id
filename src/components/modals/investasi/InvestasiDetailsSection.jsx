import React from "react";
import { ListGroup } from "react-bootstrap";
import { User, ClockCounterClockwise, Receipt } from "phosphor-react";

const InvestasiDetailsSection = ({ transaction, formatCurrency }) => {
  return (
    <>
      {/* Member Info */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <User size={18} className="text-muted" weight="fill" />
          Informasi Anggota
        </h6>
        <ListGroup
          variant="flush"
          className="border rounded-4 overflow-hidden bg-white shadow-sm"
          style={{ borderColor: "#f1f5f9" }}
        >
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Nama Lengkap</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.name || transaction.member_name}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">ID Anggota</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.member_id || transaction.id}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Tipe Anggota</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.member_type || "Anggota Reguler"}
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Transaction Detail */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <ClockCounterClockwise size={18} className="text-muted" weight="fill" />
          Rincian Transaksi
        </h6>
        <ListGroup
          variant="flush"
          className="border rounded-4 overflow-hidden bg-white shadow-sm"
          style={{ borderColor: "#f1f5f9" }}
        >
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Kategori</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.item || "Investasi Sukuk"}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Tanggal Pengajuan</span>
            <span className="fw-bold text-dark small text-end">
              {new Date(transaction.date || transaction.created_at).toLocaleString(
                "id-ID",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Nominal Investasi</span>
            <span className="fw-bold text-success small text-end">
              {formatCurrency(transaction.amount)}
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>

      {/* Sukuk Detail */}
      <div className="mb-4">
        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
          <Receipt size={18} className="text-muted" weight="fill" />
          Detail Sukuk
        </h6>
        <ListGroup
          variant="flush"
          className="border rounded-4 overflow-hidden bg-white shadow-sm"
          style={{ borderColor: "#f1f5f9" }}
        >
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Nama Sukuk</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.sukuk_name || "-"}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Penerbit</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.sukuk_publisher || "Pemerintah RI / Koperasi"}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Jenis</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.sukuk_type || "Sukuk Ritel"}
            </span>
          </ListGroup.Item>
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
            <span className="text-muted small fw-medium">Imbal Hasil</span>
            <span className="fw-bold text-dark small text-end">
              {transaction.sukuk_yield || 0}%
            </span>
          </ListGroup.Item>
        </ListGroup>
      </div>
    </>
  );
};

export default InvestasiDetailsSection;
