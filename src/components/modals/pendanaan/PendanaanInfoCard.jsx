import React from "react";
import { ListGroup } from "react-bootstrap";
import { ClockCounterClockwise } from "phosphor-react";
import ProtectedDocViewer from "./ProtectedDocViewer";

const PendanaanInfoCard = ({
  transaction,
  formatCurrency,
  getEvidenceUrl,
}) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <ClockCounterClockwise size={18} className="text-muted" />
        Informasi Pendanaan
      </h6>
      <ListGroup
        variant="flush"
        className="border rounded-4 overflow-hidden bg-white shadow-sm"
        style={{ borderColor: "#f1f5f9" }}
      >
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">Nama Usaha</span>
          <span className="fw-semibold text-dark text-end">
            {transaction.business_name ||
              transaction.business_profile?.business_name ||
              "-"}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">Nama Pemilik Usaha</span>
          <span className="fw-semibold text-dark text-end">
            {transaction.member ||
              transaction.owner_name ||
              transaction.member_name ||
              transaction.name ||
              "-"}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Sektor Bisnis Utama
          </span>
          <span className="fw-semibold text-dark text-end">
            {transaction.business_sector ||
              transaction.business_profile?.business_sector ||
              "-"}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-start border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Alamat Lengkap Tempat Usaha
          </span>
          <span
            className="fw-semibold text-dark text-end"
            style={{ maxWidth: "60%" }}
          >
            {transaction.business_address ||
              transaction.business_profile?.business_address ||
              "-"}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Estimasi Omset Tahunan Saat Ini
          </span>
          <span className="fw-semibold text-dark text-end">
            Rp{" "}
            {(
              transaction.estimated_yearly_turnover ||
              (transaction.business_profile?.monthly_revenue || 0) * 12 ||
              0
            ).toLocaleString("id-ID")}
          </span>
        </ListGroup.Item>

        {/* Rencana Pendanaan Section */}
        <ListGroup.Item
          className="px-4 py-3 border-bottom border-light bg-light"
          style={{ backgroundColor: "rgba(248,249,250,0.5)" }}
        >
          <span className="text-muted small fw-bold">Rencana Pendanaan</span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Tujuan Penggunaan Dana
          </span>
          <span
            className="fw-bold text-dark small text-end text-wrap"
            style={{ maxWidth: "60%" }}
          >
            {transaction.purpose || transaction.funding_purpose || "-"}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Target Dana yang Dibutuhkan
          </span>
          <span className="fw-bold text-primary small text-end">
            {formatCurrency(
              transaction.amount_requested || transaction.target_amount || 0
            )}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Periode Pengembalian Modal
          </span>
          <span className="fw-bold text-dark small text-end">
            {transaction.tenure || transaction.return_period || "-"} Bulan
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span
            className="text-muted small fw-medium text-wrap"
            style={{ maxWidth: "50%" }}
          >
            Estimasi Omset Selama Periode Pendanaan (Bulanan)
          </span>
          <span className="fw-semibold text-dark text-end">
            Rp{" "}
            {(
              transaction.estimated_monthly_turnover ||
              transaction.business_profile?.monthly_revenue ||
              0
            ).toLocaleString("id-ID")}
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium">
            Tawaran Bagi Hasil Investor (%)
          </span>
          <span className="fw-semibold text-dark text-end">
            {transaction.investor_profit_share ||
              transaction.profit_share ||
              0}
            %
          </span>
        </ListGroup.Item>

        {/* Dokumen Section */}
        <ListGroup.Item
          className="px-4 py-3 border-bottom border-light bg-light"
          style={{ backgroundColor: "rgba(248,249,250,0.5)" }}
        >
          <span className="text-muted small fw-bold">
            Dokumen Legalitas & Pendukung
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex flex-column border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium mb-2">
            Bukti Kepemilikan Usaha
          </span>
          {transaction.file_evidence ? (
            <div
              className="border rounded overflow-hidden"
              style={{ height: "300px" }}
            >
              <ProtectedDocViewer
                url={getEvidenceUrl(transaction, "evidence")}
                title="Bukti Kepemilikan"
              />
            </div>
          ) : (
            <span className="text-muted small">-</span>
          )}
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex flex-column border-bottom border-light bg-transparent">
          <span className="text-muted small fw-medium mb-2">
            Bukti Kerjasama / Kontrak (Opsional)
          </span>
          {transaction.contract_proof ? (
            <div
              className="border rounded overflow-hidden"
              style={{ height: "300px" }}
            >
              <ProtectedDocViewer
                url={getEvidenceUrl(transaction, "contract_proof")}
                title="Bukti Kerjasama"
              />
            </div>
          ) : (
            <span className="text-muted small">-</span>
          )}
        </ListGroup.Item>
        <ListGroup.Item className="px-4 py-3 d-flex flex-column bg-transparent border-0">
          <span className="text-muted small fw-medium mb-2">
            Dokumen Pendukung Tambahan
          </span>
          {transaction.additional_documents ? (
            <div
              className="border rounded overflow-hidden"
              style={{ height: "300px" }}
            >
              <ProtectedDocViewer
                url={getEvidenceUrl(transaction, "additional_documents")}
                title="Dokumen Pendukung"
              />
            </div>
          ) : (
            <span className="text-muted small">-</span>
          )}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};

export default PendanaanInfoCard;
