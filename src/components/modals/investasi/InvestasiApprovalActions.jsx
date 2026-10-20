import React from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { X, Check } from "phosphor-react";

export const InvestasiApprovalNotes = ({ notes, setNotes }) => (
  <div className="animate-fade-in border-top pt-4 mt-2">
    <Form.Group>
      <Form.Label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
        Catatan (Opsional)
      </Form.Label>
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Tambahkan catatan persetujuan di sini..."
        className="rounded-3 border-light shadow-none bg-light focus-bg-white transition-all p-3 text-sm"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        style={{ resize: "none" }}
      />
    </Form.Group>
  </div>
);

export const InvestasiApprovalActions = ({
  canApprove,
  loading,
  onApprove,
  onReject,
  onHide,
}) => (
  <div className="w-100 d-flex flex-column flex-md-row gap-2">
    {canApprove ? (
      <>
        <Button
          variant="outline-danger"
          className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center"
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
        <Button
          variant="success"
          className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center border-0 shadow-sm text-white"
          onClick={onApprove}
          disabled={loading}
          style={{ backgroundColor: "#10b981" }}
        >
          {loading ? (
            <Spinner size="sm" />
          ) : (
            <>
              <Check className="me-2" /> Terima & Lanjutkan
            </>
          )}
        </Button>
      </>
    ) : (
      <Button
        variant="light"
        className="w-100 fw-bold py-2 rounded-3 border text-muted transition-all bg-white"
        onClick={onHide}
      >
        Tutup
      </Button>
    )}
  </div>
);
