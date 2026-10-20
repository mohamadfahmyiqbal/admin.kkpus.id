import React from "react";
import { Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtEncode } from "../../../utils/helpers";

const TabunganReportHeader = ({ onExportExcel, exportDisabled }) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode("tabunganList")}`)}
          >
            Tabungan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Report Tabungan</h4>
          <p className="text-muted small mb-0">
            Laporan pendaftaran, saldo, dan jurnal transaksi tabungan anggota.
          </p>
        </div>
        <div>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={onExportExcel}
            disabled={exportDisabled}
          >
            <i className="bi bi-file-earmark-excel me-2" /> Export Excel
          </button>
        </div>
      </div>
    </>
  );
};

export default TabunganReportHeader;
