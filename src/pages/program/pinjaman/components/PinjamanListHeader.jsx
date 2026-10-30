import React from "react";
import { Button } from "react-bootstrap";
import { Funnel, FileArrowDown, FileXls } from "phosphor-react";
import { FaHandHoldingUsd } from "react-icons/fa";

const PinjamanListHeader = ({ onOpenImport, onExport, hasData }) => {
  return (
    <div className="p-3 border-bottom d-flex justify-content-between align-items-center bg-light bg-opacity-50">
      <h6 className="mb-0 fw-semibold text-dark d-flex align-items-center gap-2">
        <FaHandHoldingUsd size={18} className="text-primary" />
        Daftar Pinjaman Lunak
      </h6>
      <div className="d-flex gap-2">
        <Button
          variant="outline-success"
          size="sm"
          className="d-flex align-items-center gap-1 bg-white"
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
          className="d-flex align-items-center gap-2 text-white"
          onClick={onOpenImport}
        >
          <FileArrowDown size={14} /> Import Excel
        </Button>
      </div>
    </div>
  );
};

export default PinjamanListHeader;
