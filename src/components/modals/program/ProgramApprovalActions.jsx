import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner, Row, Col } from "react-bootstrap";
import { X, CheckCircle } from "phosphor-react";

export const ProgramApprovalForm = ({
  note,
  setNote,
  requiresProof,
  onFileChange,
}) => (
  <div className="animate-fade-in border-top pt-4 mt-2">
    <div className="mb-3">
      <label className="small fw-bold text-muted mb-1 d-block">
        Catatan (Opsional)
      </label>
      <textarea
        rows={2}
        placeholder="Tambahkan catatan persetujuan..."
        className="form-control rounded-3 border-light shadow-none small"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>

    {requiresProof && (
      <div className="mb-3">
        <label className="small fw-bold text-danger mb-1 d-block">
          Bukti Transfer (Wajib)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg,application/pdf"
          onChange={onFileChange}
          className="form-control rounded-3 border-light shadow-none small"
        />
        <small className="text-muted d-block mt-1">
          Format: JPG, PNG, atau PDF. Maksimal 5MB.
        </small>
      </div>
    )}
  </div>
);

export const ProgramApprovalFooter = ({
  isMyStep,
  loading,
  onApprove,
  onReject,
  onHide,
}) => (
  <Modal.Footer className="border-0 pt-2 pb-4 px-4 gap-2">
    <Row className="w-100 m-0">
      {isMyStep ? (
        <>
          <Col md={6} className="ps-0 pe-2 mb-2 mb-md-0">
            <Button
              variant="outline-danger"
              className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center"
              onClick={onReject}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <X className="me-2" /> Tolak
                </>
              )}
            </Button>
          </Col>
          <Col md={6} className="pe-0 ps-2">
            <Button
              variant="success"
              className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center border-0 shadow-sm"
              onClick={onApprove}
              disabled={loading}
              style={{ backgroundColor: "#10b981" }}
            >
              {loading ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <CheckCircle className="me-2" /> Terima & Lanjutkan
                </>
              )}
            </Button>
          </Col>
        </>
      ) : (
        <Col md={12} className="px-0">
          <Button
            variant="light"
            className="w-100 fw-bold py-2 rounded-3 border text-muted transition-all"
            onClick={onHide}
          >
            Tutup
          </Button>
        </Col>
      )}
    </Row>
  </Modal.Footer>
);
