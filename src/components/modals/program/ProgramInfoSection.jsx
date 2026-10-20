import React from "react";
import { User, Handshake, CurrencyCircleDollar, CalendarBlank } from "phosphor-react";

const ProgramInfoSection = ({ transaction, formatCurrency }) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <User size={18} className="text-muted" />
        Informasi Pengajuan
      </h6>
      <div className="list-group list-group-flush border rounded-4 overflow-hidden shadow-sm">
        <div className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <User size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Nama Anggota</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {transaction.member_name || transaction.name}
            </p>
            <span className="extra-small text-muted">
              ID: {transaction.member_id?.substring(0, 8) || transaction.id?.substring(0, 8)}
            </span>
          </div>
        </div>

        <div className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <Handshake size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Tujuan Program</span>
          </div>
          <div className="text-end">
            <span className="fw-bold text-dark small">
              {transaction.item_name || transaction.item || transaction.purpose || "Pinjaman Lunak"}
            </span>
          </div>
        </div>

        <div className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center bg-white">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <CurrencyCircleDollar size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Pencairan</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {transaction.disbursement_method || transaction.metode_pencairan || "-"}
            </p>
            <span className="extra-small text-success fw-bold">
              {transaction.disbursement_method === "Non Tunai" ||
              transaction.metode_pencairan === "Non Tunai"
                ? `${transaction.bank_name || transaction.bank_tujuan || ""} ${
                    transaction.bank_account_no || transaction.no_rekening
                      ? `(${transaction.bank_account_no || transaction.no_rekening})`
                      : ""
                  }`
                : transaction.lokasi_pencairan || transaction.bank_name || ""}
            </span>
          </div>
        </div>

        <div className="list-group-item px-4 py-3 d-flex justify-content-between align-items-center bg-white border-0">
          <div className="d-flex align-items-center gap-3">
            <div className="bg-light p-2 rounded-3 text-muted">
              <CalendarBlank size={18} weight="bold" />
            </div>
            <span className="text-muted small fw-medium">Tenor</span>
          </div>
          <div className="text-end">
            <span className="badge bg-info bg-opacity-10 text-info fw-bold border-0 px-3 py-2 rounded-pill small">
              {transaction.tenure || transaction.term_count || transaction.tenor_months || "-"} Bulan
            </span>
            <span className="extra-small text-muted d-block mt-1">
              {formatCurrency(transaction.monthly_installment || transaction.installment_amount)}/bln
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramInfoSection;
