import React from "react";
import { Form } from "react-bootstrap";

const PendanaanActionForm = ({
  currentRole,
  transaction,
  setTransferProof,
  notes,
  setNotes,
}) => {
  return (
    <div className="animate-fade-in border-top pt-4 mt-2">
      {currentRole?.toLowerCase() === "bendahara" &&
        transaction?.metode_pencairan !== "Tunai" && (
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
              Bukti Transfer <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="file"
              accept="image/jpeg,image/png,application/pdf"
              onChange={(e) => setTransferProof(e.target.files[0])}
              className="rounded-3 border-light shadow-none bg-light focus-bg-white transition-all text-sm"
            />
            <Form.Text className="text-muted">
              Format: JPG, PNG, PDF (Maks 5MB)
            </Form.Text>
          </Form.Group>
        )}
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
};

export default PendanaanActionForm;
