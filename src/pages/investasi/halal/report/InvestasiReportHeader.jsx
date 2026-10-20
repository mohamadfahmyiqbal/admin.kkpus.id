import React from "react";

const InvestasiReportHeader = ({ onExportExcel, exportDisabled }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
      <div>
        <h4 className="fw-bold text-dark mb-1">Report Investasi Halal</h4>
        <p className="text-muted small mb-0">
          Laporan pendaftaran investasi, portofolio, dan jurnal transaksi sukuk anggota.
        </p>
      </div>
      <div>
        <button
          className="btn btn-success d-flex align-items-center gap-2"
          onClick={onExportExcel}
          disabled={exportDisabled}
        >
          <i className="bi bi-file-earmark-excel" /> Export Excel
        </button>
      </div>
    </div>
  );
};

export default InvestasiReportHeader;
