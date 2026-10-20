import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { FileText, User, Calendar, Bank, Money, Clock } from "phosphor-react";

export const WithdrawalInfoCard = ({
  transaction,
  isApprovedFinal,
  isRejectedFinal,
}) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <FileText size={18} className="text-muted" />
        Informasi Pengajuan Lengkap
      </h6>
      <ListGroup variant="flush" className="border rounded-4 overflow-hidden shadow-sm">
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <User size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Nama Anggota</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {transaction.member || transaction.member_name || "-"}
            </p>
            <span className="extra-small text-muted">
              ID: {transaction.member_id?.substring(0, 8) || transaction.member_no || "-"}
            </span>
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <Calendar size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Tanggal Pengajuan</span>
          </div>
          <span className="fw-bold text-dark small">
            {transaction.date || transaction.created_at || "-"}
          </span>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <Bank size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Rekening Tujuan</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small text-uppercase">
              {transaction.bank_name || transaction.destination_bank || "BCA"} •{" "}
              {transaction.account_number || transaction.destination_account_no || "1234567890"}
            </p>
            <span className="extra-small text-muted">
              A/N {transaction.account_name || transaction.destination_account_name || transaction.member || "Anggota"}
            </span>
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <Money size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Kategori Simpanan</span>
          </div>
          <Badge bg="info" className="bg-opacity-10 text-info fw-bold border-0 px-3 py-2 rounded-pill small">
            {transaction.product_name || transaction.item || "Simpanan Sukarela"}
          </Badge>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-white border-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <Clock size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Status Permohonan</span>
          </div>
          <Badge
            bg={
              isApprovedFinal
                ? "success"
                : isRejectedFinal
                ? "danger"
                : "warning"
            }
            className="px-3 py-2 rounded-pill small fw-bold"
          >
            {transaction.final_status || transaction.status || "Menunggu Persetujuan"}
          </Badge>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default WithdrawalInfoCard;
