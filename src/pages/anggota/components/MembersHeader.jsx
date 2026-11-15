import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { UploadSimple, DownloadSimple, Trash } from "phosphor-react";

const MembersHeader = ({
  onImport,
  onExport,
  disableExport,
  selectedCount = 0,
  onDeleteBatch,
}) => {
  return (
    <Row className="mb-4 align-items-center">
      <Col md={6}>
        <h3 className="fw-bold mb-1">Daftar Anggota Koperasi</h3>
        <p className="text-muted mb-0">
          Kelola data akun seluruh anggota terdaftar di Paguyuban Usaha Sukses.
        </p>
      </Col>
      <Col md={6} className="text-md-end mt-3 mt-md-0 d-flex flex-wrap gap-2 justify-content-md-end align-items-center">
        {selectedCount > 0 && (
          <Button
            variant="danger"
            className="d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm animate__animated animate__fadeIn"
            onClick={onDeleteBatch}
          >
            <Trash size={18} weight="bold" />
            Hapus ({selectedCount}) Anggota
          </Button>
        )}
        <Button
          variant="outline-primary"
          className="d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm"
          onClick={onImport}
        >
          <UploadSimple size={18} weight="bold" />
          Import Excel
        </Button>
        <Button
          variant="success"
          className="d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm text-white"
          onClick={onExport}
          disabled={disableExport}
        >
          <DownloadSimple size={18} weight="bold" />
          Export Excel
        </Button>
      </Col>
    </Row>
  );
};

export default React.memo(MembersHeader);
