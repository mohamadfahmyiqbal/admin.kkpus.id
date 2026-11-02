import React from "react";
import { Button } from "react-bootstrap";
import { FileXls } from "phosphor-react";

const JualBeliReportHeader = ({ onExport, loading, hasData }) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
      <div>
        <h4 className="fw-bold text-dark mb-1">Report Jual Beli</h4>
        <p className="text-muted small mb-0">
          Laporan neraca dan jurnal transaksi jual beli anggota.
        </p>
      </div>
      <div>
        <Button
          variant="success"
          className="d-flex align-items-center gap-2"
          onClick={onExport}
          disabled={loading || !hasData}
        >
          <FileXls size={18} weight="bold" className="me-1" /> Export Excel
        </Button>
      </div>
    </div>
  );
};

export default JualBeliReportHeader;
