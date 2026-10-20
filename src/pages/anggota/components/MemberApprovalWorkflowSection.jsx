import React from "react";
import { Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { Check, X } from "phosphor-react";
import ApprovalPlaceholder from "../../../components/ui/ApprovalPlaceholder";

const MemberApprovalWorkflowSection = ({
  data,
  currentStep,
  note,
  setNote,
  isBendaharaStep,
  hasUploadedPayment,
  canApprove,
  isApproved,
  isRejected,
  onApprove,
  onReject,
  onHide,
  processing,
}) => {
  const parseBool = (v) => {
    if (v === 1 || v === true) return true;
    if (v === 0 || v === false) return false;
    return undefined;
  };

  const getApprovedStatus = (roleName) => {
    if (!roleName) return undefined;
    if (roleName.toLowerCase().includes("pengawas")) return data?.is_approved_pengawas;
    if (roleName.toLowerCase().includes("ketua")) return data?.is_approved_ketua;
    if (roleName.toLowerCase().includes("bendahara")) return data?.is_approved_bendahara;
  };

  let rawSteps =
    data?.flow?.steps?.length > 0
      ? [...data.flow.steps].sort((a, b) => a.step_order - b.step_order)
      : [];

  if (rawSteps.length === 0) {
    rawSteps = [
      { verifierRole: { role_name: "Pengawas" }, step_order: 1 },
      { verifierRole: { role_name: "Ketua" }, step_order: 2 },
      { verifierRole: { role_name: "Bendahara" }, step_order: 3 },
    ];
  } else if (
    !rawSteps.some((s) =>
      (s.verifierRole?.role_name || s.role?.role_name || "").toLowerCase().includes("bendahara")
    )
  ) {
    rawSteps.push({
      verifierRole: { role_name: "Bendahara" },
      step_order: rawSteps.length + 1,
      step_name: "Verifikasi Setoran Bendahara",
    });
  }
  const steps = rawSteps;
  let hasRejected = false;

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark mt-4">6. Tindakan Persetujuan (Step Approval)</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-2" style={{ borderColor: "#f1f5f9" }}>
        <div className="text-center mb-4">
          <h6
            className="fw-bold small text-uppercase text-secondary tracking-wider mb-1"
            style={{ letterSpacing: "2px" }}
          >
            Alur Persetujuan
          </h6>
          <div className="mx-auto" style={{ width: "30px", height: "2px", background: "#cbd5e1" }} />
        </div>

        <div className="position-relative mb-5 mt-2">
          <div
            className="position-absolute d-none d-md-block"
            style={{
              top: "32px",
              left: "15%",
              right: "15%",
              height: "2px",
              background: "linear-gradient(90deg, #e2e8f0 0%, #e2e8f0 100%)",
              zIndex: 0,
            }}
          />
          <div
            className="d-flex justify-content-between align-items-start position-relative"
            style={{ zIndex: 1, width: "100%" }}
          >
            {steps.map((step, idx) => {
              const roleName = step.verifierRole?.role_name || `Langkah ${step.step_order}`;
              const status = parseBool(getApprovedStatus(roleName));
              const isStepApproved =
                isApproved || status === true || (currentStep?.step_order > step.step_order && !isRejected);

              let isStepRejected = false;
              if (isRejected) {
                if (status === false) {
                  isStepRejected = true;
                } else if (status === undefined) {
                  if (idx === 0) {
                    isStepRejected = true;
                  } else {
                    const prevRole = steps[idx - 1].verifierRole?.role_name;
                    if (
                      (parseBool(getApprovedStatus(prevRole)) === true ||
                        currentStep?.step_order > steps[idx - 1].step_order) &&
                      !hasRejected
                    ) {
                      isStepRejected = true;
                      hasRejected = true;
                    }
                  }
                }
              }

              const approvalNote = data?.approvals?.find(
                (a) => a.approval_step_id === (step.approval_step_id || step.id)
              )?.note;

              return (
                <ApprovalPlaceholder
                  key={step.id || step.step_id || idx}
                  role={roleName}
                  isApproved={isStepApproved}
                  isRejected={isStepRejected}
                  note={approvalNote}
                />
              );
            })}
          </div>
        </div>

        <div className="mt-3">
          <Form.Group>
            <Form.Label className="small fw-bold text-dark">Catatan / Pesan</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Tambahkan catatan untuk anggota, pengawas, ketua, atau bendahara..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Form.Group>
        </div>

        <div className="mt-4 border-top pt-4">
          <span className="text-muted small fw-medium d-block mb-3 text-center">
            Tahap Verifikasi Saat Ini:{" "}
            <span className="fw-bold text-primary">
              {currentStep?.step_name || "Menunggu Persetujuan"}
            </span>
            {isBendaharaStep && !hasUploadedPayment && (
              <div className="alert alert-warning py-2 px-3 small mt-2 mb-0 rounded-3 text-center">
                ⚠️ Anggota belum melakukan konfirmasi & upload bukti pembayaran simpanan pokok/wajib. Tombol persetujuan Bendahara akan aktif setelah bukti transfer diunggah.
              </div>
            )}
          </span>
          <Row className="w-100 m-0">
            {canApprove ? (
              <>
                <Col md={6} className="ps-0 pe-2 mb-2 mb-md-0">
                  <Button
                    variant="outline-danger"
                    className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center"
                    onClick={() => onReject(data?.registration_id, currentStep?.step_id, note)}
                    disabled={processing}
                  >
                    {processing ? <Spinner size="sm" /> : <><X className="me-2" /> Tolak</>}
                  </Button>
                </Col>
                <Col md={6} className="pe-0 ps-2">
                  <Button
                    variant="success"
                    className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center border-0 shadow-sm"
                    onClick={() => onApprove(data?.registration_id, currentStep?.step_id, note)}
                    disabled={processing}
                    style={{ backgroundColor: "#10b981" }}
                  >
                    {processing ? <Spinner size="sm" /> : <><Check className="me-2" /> Terima & Lanjutkan</>}
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
        </div>
      </Card>
    </>
  );
};

export default MemberApprovalWorkflowSection;
