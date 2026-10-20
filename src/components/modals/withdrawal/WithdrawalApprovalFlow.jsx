import React from "react";
import { ShieldCheck } from "phosphor-react";
import ApprovalPlaceholder from "../../ui/ApprovalPlaceholder";

export const WithdrawalApprovalFlow = ({
  rawSteps = [],
  transaction = {},
  isApprovedFinal = false,
  isRejectedFinal = false,
  currentRoleName = "",
}) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <ShieldCheck size={18} className="text-muted" />
        Alur & Langkah Persetujuan (Approval Flow)
      </h6>
      <div className="border rounded-4 p-4 bg-white shadow-sm">
        <div className="text-center mb-4">
          <h6
            className="fw-bold small text-uppercase text-secondary tracking-wider mb-1"
            style={{ letterSpacing: "2px" }}
          >
            Tahapan Verifikasi
          </h6>
          <div className="mx-auto" style={{ width: "30px", height: "2px", background: "#cbd5e1" }} />
        </div>

        <div className="position-relative mb-3 mt-2">
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
            {rawSteps.map((step, idx) => {
              const roleName =
                step.verifierRole?.role_name ||
                step.role?.role_name ||
                `Langkah ${step.step_order || idx + 1}`;

              const currentStepOrder =
                transaction.currentStep?.step_order ||
                transaction.current_step_order ||
                1;
              const stepOrder = step.step_order || idx + 1;

              const isApproved =
                isApprovedFinal || (currentStepOrder > stepOrder && !isRejectedFinal);

              let isRejected = false;
              if (isRejectedFinal && currentStepOrder === stepOrder) {
                isRejected = true;
              }

              const matchingApproval =
                transaction.approvals?.find((a) => {
                  if (
                    a.approval_step_id &&
                    step.approval_step_id &&
                    a.approval_step_id === step.approval_step_id
                  ) {
                    return true;
                  }
                  if (
                    a.step?.step_order &&
                    step.step_order &&
                    a.step.step_order === step.step_order
                  ) {
                    return true;
                  }
                  const approverRole = a.approver_role || a.role_name || a.role;
                  return (
                    approverRole &&
                    roleName &&
                    approverRole.toLowerCase() === roleName.toLowerCase()
                  );
                }) ||
                transaction.approvalChain?.find(
                  (c) => c.role?.toLowerCase() === roleName.toLowerCase()
                );

              return (
                <ApprovalPlaceholder
                  key={step.id || step.step_id || idx}
                  role={roleName}
                  isApproved={isApproved}
                  isRejected={isRejected}
                  note={matchingApproval?.note || matchingApproval?.notes}
                  approverName={matchingApproval?.approver_name || matchingApproval?.verifier_name}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center mt-3 pt-3 border-top">
          <span className="text-muted small fw-medium d-block">
            Tahap Saat Ini:{" "}
            <span className="fw-bold text-primary">
              {transaction.currentStep?.step_name ||
                currentRoleName ||
                (isApprovedFinal ? "Semua Persetujuan Selesai" : "Menunggu Verifikasi")}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default WithdrawalApprovalFlow;
