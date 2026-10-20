import React from "react";
import { Form } from "react-bootstrap";
import { Info } from "phosphor-react";

const JualBeliActionForm = ({
  verifierRole,
  isPelunasan,
  operationalCost,
  setOperationalCost,
  discount,
  setDiscount,
  notes,
  setNotes,
}) => {
  const isTreasurer = verifierRole?.toLowerCase() === "bendahara";

  return (
    <div className="animate-fade-in border-top pt-4 mt-2">
      {isTreasurer && (
        <>
          {!isPelunasan && (
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted mb-2">
                Input Biaya Operasional
              </Form.Label>
              <div className="input-group input-group-merge rounded-3 overflow-hidden border border-light focus-ring-primary transition-all">
                <span className="input-group-text bg-light border-0 text-muted fw-bold">
                  Rp
                </span>
                <Form.Control
                  type="text"
                  placeholder="0 (Gunakan '-' untuk pengurang)"
                  className="border-0 shadow-none bg-white py-2"
                  value={
                    operationalCost
                      ? new Intl.NumberFormat("id-ID").format(operationalCost)
                      : operationalCost === "-"
                      ? "-"
                      : ""
                  }
                  onChange={(e) =>
                    setOperationalCost(
                      e.target.value
                        .replace(/[^\d-]/g, "")
                        .replace(/(?!^)-/g, "")
                    )
                  }
                />
              </div>
            </Form.Group>
          )}

          {isPelunasan && (
            <Form.Group className="mb-4">
              <Form.Label className="small fw-bold text-muted mb-2">
                Input Diskon Pelunasan
              </Form.Label>
              <div className="input-group input-group-merge rounded-3 overflow-hidden border border-light focus-ring-primary transition-all">
                <span className="input-group-text bg-light border-0 text-muted fw-bold">
                  Rp
                </span>
                <Form.Control
                  type="text"
                  placeholder="0"
                  className="border-0 shadow-none bg-white py-2"
                  value={
                    discount
                      ? new Intl.NumberFormat("id-ID").format(discount)
                      : ""
                  }
                  onChange={(e) =>
                    setDiscount(e.target.value.replace(/[^\d]/g, ""))
                  }
                />
              </div>
              <Form.Text className="text-muted mt-2 d-flex align-items-center gap-1">
                <Info size={14} /> Diskon ini akan mengurangi total pembayaran pelunasan.
              </Form.Text>
            </Form.Group>
          )}
        </>
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

export default JualBeliActionForm;
