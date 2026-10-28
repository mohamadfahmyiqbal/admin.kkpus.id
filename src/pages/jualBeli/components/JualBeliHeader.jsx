import React from "react";
import { Button } from "react-bootstrap";
import { ArrowClockwise, FileArrowDown, UploadSimple, Trash } from "phosphor-react";

const JualBeliHeader = ({
  loading,
  onRefresh,
  onExport,
  onOpenImport,
  selectedCount = 0,
  onDeleteSelected,
}) => {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
      <div>
        <h4 className="fw-bold text-dark mb-1">Dashboard Jual Beli</h4>
        <p className="text-muted small mb-0">
          Pantau dan kelola seluruh transaksi jual beli anggota koperasi.
        </p>
      </div>
      <div className="d-flex flex-wrap gap-2 align-items-center">
        {selectedCount > 0 && (
          <Button
            variant="danger"
            className="shadow-sm d-flex align-items-center gap-2 fw-medium animate-fade-in"
            onClick={onDeleteSelected}
          >
            <Trash size={18} weight="bold" />
            Hapus Terpilih ({selectedCount})
          </Button>
        )}
        <Button
          variant="white"
          className="border shadow-sm d-flex align-items-center gap-2 fw-medium text-muted bg-white"
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
