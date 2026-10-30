import React from "react";
import { Button } from "react-bootstrap";
import { FunnelSimple, UploadSimple, ArrowClockwise, FileXls } from "phosphor-react";

const PendanaanHeader = ({ onImport, onExport, onRefresh, loading, hasData }) => (
  <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
    <div>
      <h4 className="fw-bold text-dark mb-1">List Pendanaan Syariah</h4>
      <p className="text-muted small mb-0">
        Pantau dan kelola seluruh pengajuan Pendanaan Syariah anggota.
      </p>
    </div>
    <div className="d-flex gap-2">
      <Button
        variant="outline-secondary"
        size="sm"
        className="d-flex align-items-center gap-2"
      >
        <FunnelSimple size={14} /> Filter
      </Button>
      {onExport && (
        <Button
          variant="outline-success"
          size="sm"
          className="d-flex align-items-center gap-2"
          onClick={onExport}
          disabled={!hasData}
        >
          <FileXls size={16} className="text-success" /> Export Excel
        </Button>
      )}
      <Button
        variant="success"
        size="sm"
        className="d-flex align-items-center gap-2 text-white"
        onClick={onImport}
      >
        <UploadSimple size={14} /> Import Excel
      </Button>
      <Button
        variant="white"
        className="border shadow-sm d-flex align-items-center gap-2 fw-medium text-muted"
        onClick={onRefresh}
        disabled={loading}
      >
        <ArrowClockwise
          size={18}
          className={loading ? "animate-spin" : ""}
        />
        {loading ? "Refreshing..." : "Refresh"}
      </Button>
    </div>
  </div>
);

export default PendanaanHeader;
