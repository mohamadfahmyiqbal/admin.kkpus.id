import React from "react";
import { Button } from "react-bootstrap";
import { ArrowClockwise, FileArrowDown, UploadSimple } from "phosphor-react";

const JualBeliHeader = ({
  loading,
  onRefresh,
  onExport,
  onOpenImport,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
      <div>
        <h4 className="fw-bold text-dark mb-1">Dashboard Jual Beli</h4>
        <p className="text-muted small mb-0">
          Pantau dan kelola seluruh transaksi jual beli anggota koperasi.
        </p>
      </div>
      <div className="d-flex gap-2">
        <Button
          variant="white"
          className="border shadow-sm d-flex align-items-center gap-2 fw-medium text-muted"
          onClick={onRefresh}
          disabled={loading}
        >
          <ArrowClockwise size={18} className={loading ? "animate-spin" : ""} />
          {loading ? "Refreshing..." : "Refresh"}
        </Button>
        <Button
          variant="primary"
          className="shadow-sm d-flex align-items-center gap-2 fw-medium"
          onClick={onExport}
        >
          <FileArrowDown size={18} />
          Export Laporan
        </Button>
        <Button
          variant="success"
          className="shadow-sm d-flex align-items-center gap-2 fw-medium"
          onClick={onOpenImport}
        >
          <UploadSimple size={18} />
          Import Excel
        </Button>
      </div>
    </div>
  );
};

export default JualBeliHeader;
