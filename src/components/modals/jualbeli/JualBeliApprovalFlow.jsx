import React from "react";
import { Check } from "phosphor-react";
import ApprovalPlaceholder from "../../ui/ApprovalPlaceholder";

const JualBeliApprovalFlow = ({ transaction, isApproved, isRejected }) => {
  const steps =
    transaction?.flow?.steps?.length > 0
      ? [...transaction.flow.steps].sort((a, b) => a.step_order - b.step_order)
      : [
          { role: { role_name: "Pengawas" }, step_order: 1 },
          { role: { role_name: "Ketua" }, step_order: 2 },
          { role: { role_name: "Bendahara" }, step_order: 3 },
        ];

  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <Check size={18} className="text-muted" />
        Tindakan Persetujuan
      </h6>
      <div className="border border-light rounded-4 p-4 bg-white shadow-sm">
        <div className="text-center mb-4">
          <h6
            className="fw-bold text-uppercase text-secondary mb-2"
            style={{ letterSpacing: "1.5px" }}
          >
            Alur Persetujuan
          </h6>
          <div
            className="mx-auto rounded-pill"
            style={{ width: "40px", height: "3px", background: "#cbd5e1" }}
          />
        </div>
        <div className="position-relative mb-3 mt-2 px-md-3">
          <div
            className="position-absolute d-none d-md-block"
            style={{
              top: "28px",
              left: "10%",
              right: "10%",
              height: "2px",
              background: "#f1f5f9",
              zIndex: 0,
            }}
          />
          <div
            className="d-flex justify-content-between align-items-start position-relative"
            style={{ zIndex: 1, width: "100%" }}
          >
            {steps.map((step, idx) => {
              const roleName =
                step.verifierRole?.role_name ||
                step.role?.role_name ||
                `Langkah ${step.step_order}`;
              const isStepApproved =
                isApproved ||
                (transaction?.currentStep?.step_order > step.step_order &&
                  !isRejected);
              let isStepRejected = false;
              if (isRejected) {
                if (
                  transaction?.currentStep?.step_order === step.step_order ||
                  idx === 0
                ) {
                  isStepRejected = true;
                }
              }

              const note =
                transaction?.approvals?.find(
                  (a) =>
                    (
                      a.approver_role || a.step?.verifierRole?.role_name
                    )?.toLowerCase() === roleName?.toLowerCase()
                )?.note ||
                transaction?.approvalChain?.find(
                  (c) => c.role?.toLowerCase() === roleName?.toLowerCase()
                )?.note;

              return (
                <ApprovalPlaceholder
                  key={step.id || step.step_id || idx}
                  role={roleName}
                  isApproved={isStepApproved}
                  isRejected={isStepRejected}
                  note={note}
                />
              );
            })}
          </div>
        </div>
        <div className="text-center mt-3 pt-3 border-top">
          <span className="text-muted small fw-medium d-block">
            Tahap Saat Ini:{" "}
            <span
              className={`fw-bold ${
                isApproved
                  ? "text-success"
                  : isRejected
                  ? "text-danger"
                  : "text-primary"
              }`}
            >
              {isApproved
                ? "Selesai (Disetujui / Lunas)"
                : isRejected
                ? "Ditolak"
                : transaction?.currentStep?.step_name || "Menunggu Persetujuan"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default JualBeliApprovalFlow;
