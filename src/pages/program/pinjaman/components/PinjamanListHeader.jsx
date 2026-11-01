import React from "react";
import { Button } from "react-bootstrap";
import { FileArrowDown, FileXls, ArrowClockwise } from "phosphor-react";
import { FaHandHoldingUsd } from "react-icons/fa";

const PinjamanListHeader = ({
  onRefresh,
  loading,
  onOpenImport,
  onExport,
  hasData,
}) => {
  return (
    <div className="p-3 border-bottom d-flex flex-wrap justify-content-between align-items-center gap-2 bg-light bg-opacity-50">
      <h6 className="mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
        <FaHandHoldingUsd size={18} className="text-primary" />
        Daftar Pinjaman Lunak
      </h6>
      <div className="d-flex flex-wrap gap-2">
        {onRefresh && (
          <Button
            variant="light"
            size="sm"
            className="border shadow-xs d-flex align-items-center gap-1 bg-white text-secondary"
            onClick={onRefresh}
            disabled={loading}
            title="Segarkan Data Pinjaman"
          >
            <ArrowClockwise
              size={15}
              weight="bold"
              className={loading ? "animate-spin" : ""}
            />
            <span className="d-none d-sm-inline">
              {loading ? "Memuat..." : "Refresh"}
            </span>
          </Button>
        )}
        <Button
          variant="outline-success"
          size="sm"
          className="d-flex align-items-center gap-1 bg-white shadow-xs"
          onClick={onExport}
          disabled={!hasData}
          title="Export Data Pinjaman ke Excel"
        >
          <FileXls size={15} weight="bold" className="text-success" />
          <span>Export Excel</span>
        </Button>
        <Button
          variant="success"
          size="sm"
          className="d-flex align-items-center gap-1 text-white shadow-xs"
          onClick={onOpenImport}
          title="Import Data Pinjaman dari Excel"
        >
          <FileArrowDown size={15} weight="bold" />
          <span>Import Excel</span>
        </Button>
      </div>
    </div>
  );
};

export default PinjamanListHeader;
