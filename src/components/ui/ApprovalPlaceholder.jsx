import React from "react";
import Swal from "sweetalert2";
import { CheckCircle, XCircle, UserCircle, ShieldCheck } from "phosphor-react";

export const ApprovalPlaceholder = ({
  role = "Pengawas",
  isApproved = false,
  isRejected = false,
  isReadyToPay = false,
  note = "",
  approverName = "",
}) => {
  const Icon =
    role.toLowerCase().includes("pengawas") ? ShieldCheck : UserCircle;

  let statusText = "Pending";
  let statusBadgeClass = "bg-secondary";
  let iconType = "info";

  if (isRejected) {
    statusText = "Ditolak";
    statusBadgeClass = "bg-danger";
    iconType = "error";
  } else if (isReadyToPay) {
    statusText = "Siap Bayar";
    statusBadgeClass = "bg-primary";
    iconType = "success";
  } else if (isApproved) {
    statusText = "Selesai";
    statusBadgeClass = "bg-success";
    iconType = "success";
  }

  const handleClick = () => {
    Swal.fire({
      title: `Detail Persetujuan - ${role}`,
      html: `
        <div class="text-center" style="font-size: 14px;">
          <p class="mb-2"><strong>Status:</strong> <span class="badge ${statusBadgeClass}">${statusText}</span></p>
          ${approverName ? `<p class="mb-2"><strong>Oleh:</strong> ${approverName}</p>` : ""}
          ${
            note
              ? `<div class="mt-3 p-3 bg-light rounded text-start"><strong class="d-block mb-1">Catatan:</strong> <span class="fst-italic">"${note}"</span></div>`
              : `<p class="text-muted mt-2">Tidak ada catatan.</p>`
          }
        </div>
      `,
      icon: iconType,
      confirmButtonText: "Tutup",
      confirmButtonColor: "#0d9488",
    });
  };

  const getBackgroundColor = () => {
    if (isRejected) return "#ffebee";
    if (isReadyToPay) return "#e3f2fd";
    if (isApproved) return "#e8f5e9";
    return "#f8f9fa";
  };

  const getBorderColor = () => {
    if (isRejected) return "2px solid #f44336";
    if (isReadyToPay) return "2px solid #2196f3";
    if (isApproved) return "2px solid #28a745";
    return "2px dashed #dee2e6";
  };

  const getColor = () => {
    if (isRejected) return "#f44336";
    if (isReadyToPay) return "#2196f3";
    if (isApproved) return "#28a745";
    return "#adb5bd";
  };

  return (
    <div className="text-center" onClick={handleClick} style={{ cursor: "pointer" }}>
      <div
        className="mx-auto rounded-circle d-flex align-items-center justify-content-center position-relative"
        style={{
          width: "65px",
          height: "65px",
          backgroundColor: getBackgroundColor(),
          border: getBorderColor(),
          color: getColor(),
          transition: "all 0.3s ease",
        }}
      >
        <Icon size={28} />
        {(isApproved || isReadyToPay || isRejected) && (
          <div
            className="position-absolute bg-white rounded-circle"
            style={{ bottom: "-2px", right: "-2px", lineHeight: 0 }}
          >
            {isRejected ? (
              <XCircle size={20} className="text-danger" weight="fill" />
            ) : (
              <CheckCircle
                size={20}
                className={isReadyToPay ? "text-primary" : "text-success"}
                weight="fill"
              />
            )}
          </div>
        )}
      </div>

      <small
        className="mt-2 d-block fw-bold text-uppercase"
        style={{
          color: isRejected
            ? "#f44336"
            : isReadyToPay
            ? "#2196f3"
            : isApproved
            ? "#28a745"
            : "#6c757d",
          letterSpacing: "0.5px",
        }}
      >
        {role}
        <span className="d-block">{statusText.toUpperCase()}</span>
      </small>

      {note && (
        <div
          className="mt-1 px-2 py-1 bg-light rounded text-muted text-wrap text-break"
          style={{ maxWidth: "100px", margin: "0 auto", fontStyle: "italic", fontSize: "11px" }}
        >
          {note}
        </div>
      )}
    </div>
  );
};

export default ApprovalPlaceholder;
