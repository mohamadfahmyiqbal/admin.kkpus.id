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
            size="sm"
            className="shadow-sm d-flex align-items-center gap-1 gap-sm-2 fw-medium px-2 px-sm-3 animate-fade-in"
            onClick={onDeleteSelected}
          >
            <Trash size={16} weight="bold" />
            <span>Hapus ({selectedCount})</span>
          </Button>
        )}
        <Button
          variant="white"
          size="sm"
          className="border shadow-sm d-flex align-items-center gap-1 gap-sm-2 fw-medium text-muted bg-white px-2 px-sm-3"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh Data"
        >
          <ArrowClockwise size={16} weight="bold" className={loading ? "animate-spin" : ""} />
          <span className="d-none d-sm-inline">{loading ? "Refreshing..." : "Refresh"}</span>
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="shadow-sm d-flex align-items-center gap-1 gap-sm-2 fw-medium px-2 px-sm-3"
          onClick={onExport}
          title="Export Laporan Excel"
        >
          <FileArrowDown size={16} weight="bold" />
          <span>Export<span className="d-none d-sm-inline"> Laporan</span></span>
        </Button>
        <Button
          variant="success"
          size="sm"
          className="shadow-sm d-flex align-items-center gap-1 gap-sm-2 fw-medium px-2 px-sm-3"
          onClick={onOpenImport}
          title="Import Data Excel"
        >
          <UploadSimple size={16} weight="bold" />
          <span>Import<span className="d-none d-sm-inline"> Excel</span></span>
        </Button>
      </div>
    </div>
  );
};

export default JualBeliHeader;
