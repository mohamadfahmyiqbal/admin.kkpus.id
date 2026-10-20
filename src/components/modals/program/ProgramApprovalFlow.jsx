import React from "react";
import { ShieldCheck } from "phosphor-react";
import ApprovalPlaceholder from "../../ui/ApprovalPlaceholder";

const ProgramApprovalFlow = ({
  stepsList = [],
  transaction,
  isApprovedFinal,
  isRejectedFinal,
}) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <ShieldCheck size={18} className="text-muted" />
        Tindakan Persetujuan
      </h6>
      <div className="border rounded-4 p-4 bg-white shadow-sm">
        <div className="text-center mb-4">
          <h6
            className="fw-bold small text-uppercase text-secondary tracking-wider mb-1"
            style={{ letterSpacing: "2px" }}
          >
            Alur Persetujuan
          </h6>
          <div
            className="mx-auto"
            style={{ width: "30px", height: "2px", background: "#cbd5e1" }}
          />
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
            {stepsList.map((step, idx) => {
              const roleName =
                step.verifierRole?.role_name ||
                step.role?.role_name ||
                `Langkah ${step.step_order}`;
              const isApproved =
                isApprovedFinal ||
                (transaction?.currentStep?.step_order > step.step_order &&
                  !isRejectedFinal);
              let isRejected = false;
              if (isRejectedFinal) {
                if (
                  transaction?.currentStep?.step_order === step.step_order ||
                  idx === 0
                ) {
                  isRejected = true;
                }
              }

              const foundApproval = transaction?.approvals?.find((app) => {
                const appRole = (app.approver_role || "").toLowerCase();
                const stRole = (
                  app.step?.verifierRole?.role_name || ""
                ).toLowerCase();
                const curRole = (roleName || "").toLowerCase();
                return appRole === curRole || stRole === curRole;
              });

              const chainApproval = transaction?.approvalChain?.find(
                (chain) =>
                  (chain.role || "").toLowerCase() === (roleName || "").toLowerCase()
              );

              const noteText = foundApproval?.note || chainApproval?.note;

              return (
                <ApprovalPlaceholder
                  key={step.id || step.step_id || idx}
                  role={roleName}
                  isApproved={isApproved}
                  isRejected={isRejected}
                  note={noteText}
                />
              );
            })}
          </div>
        </div>

        <div className="text-center mt-3 pt-3 border-top">
          <span className="text-muted small fw-medium d-block">
            Tahap Saat Ini:{" "}
            <span className="fw-bold text-primary">
              {transaction?.currentStep?.step_name || "Menunggu Persetujuan"}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgramApprovalFlow;
