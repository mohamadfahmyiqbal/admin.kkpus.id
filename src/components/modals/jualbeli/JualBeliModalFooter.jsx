// PATH: src/components/modals/jualbeli/JualBeliModalFooter.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Check, X } from "phosphor-react";

const JualBeliModalFooter = ({
  isBendaharaStep,
  hasDownPayment,
  hasUploadedDP,
  viewOnly,
  isApproved,
  isRejected,
  canApprove,
  loading,
  handleReject,
  handleApprove,
  onHide,
}) => {
  const showDPAwaitingWarning =
    isBendaharaStep &&
    hasDownPayment &&
    !hasUploadedDP &&
    !viewOnly &&
    !isApproved &&
    !isRejected;

  return (
    <Modal.Footer className="border-0 px-4 pb-4 pt-1">
      {showDPAwaitingWarning && (
        <div className="alert alert-warning py-2 px-3 small mb-3 w-100 rounded-3 text-center border-0 shadow-sm">
          ⚠️ Anggota belum melakukan konfirmasi & upload bukti pembayaran Uang Tanda Keseriusan (DP). Tombol persetujuan Bendahara akan aktif setelah bukti transfer diunggah.
        </div>
      )}
      <div className="w-100 d-flex flex-column flex-md-row gap-2">
        {canApprove ? (
          <>
            <Button
              variant="outline-danger"
              className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center"
              onClick={handleReject}
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
              ) : (
                <>
                  <X className="me-2" /> Tolak
                </>
              )}
            </Button>
            <Button
              variant="success"
              className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center border-0 shadow-sm text-white"
              onClick={handleApprove}
              disabled={loading}
              style={{ backgroundColor: "#10b981" }}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" />
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
    </Modal.Footer>
  );
};

export default React.memo(JualBeliModalFooter);
