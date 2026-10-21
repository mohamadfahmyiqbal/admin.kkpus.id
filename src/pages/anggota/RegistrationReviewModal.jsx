import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { User } from "phosphor-react";
import { jwtDecodePage } from "../../utils/helpers";
import MemberIdentitySection from "./components/MemberIdentitySection";
import MemberPaymentProofSection from "./components/MemberPaymentProofSection";
import MemberDetailsSection from "./components/MemberDetailsSection";
import MemberApprovalWorkflowSection from "./components/MemberApprovalWorkflowSection";

function RegistrationReviewModal({
  show,
  onHide,
  data,
  onApprove,
  onReject,
  processing,
}) {
  const [note, setNote] = useState("");

  useEffect(() => {
    if (show) setNote("");
  }, [show]);

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && (parsed.role || parsed.roleAssignments || parsed.full_name)) {
          return parsed;
        }
      }
    } catch (e) {}
    try {
      const token = localStorage.getItem("token");
      if (token) return jwtDecodePage(token)?.userData || jwtDecodePage(token) || null;
    } catch (e) {}
    return null;
  })();

  if (!data) return null;

  const getMediaUrl = (path) => {
    if (!path) return "";
    const cleanPath = path.replace(/\\/g, "/");
    if (cleanPath.startsWith("http") || cleanPath.startsWith("data:")) return cleanPath;
    const base = (
      import.meta.env.VITE_API_ORIGIN ||
      (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445")
    ).replace(/\/$/, "");
    return `${base}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
  };

  const { registration_id, full_name, currentStep } = data || {};
  const targetRole = currentStep?.verifierRole?.role_name || "";
  const finalStatus = data?.final_status?.toUpperCase() || "";
  const isApproved = finalStatus === "APPROVED" || finalStatus === "DISETUJUI";
  const isRejected = finalStatus === "REJECTED" || finalStatus === "DITOLAK";

  // Cek konfirmasi transaksi pembayaran simpanan pokok & wajib
  const transactionsList = Array.isArray(data.member?.transactions)
    ? data.member.transactions
    : Array.isArray(data.transactions)
    ? data.transactions
    : [];

  const pendingPayment =
    transactionsList.find(
      (t) =>
        (t.status === "PENDING_VERIFICATION" || t.status === "PENDING" || t.proof_of_transfer || t.proof_url || t.transfer_proof) &&
        (t.tx_category === "MEMBER_REGISTRATION" || !t.tx_category)
    ) ||
    transactionsList.find((t) => t.status === "PENDING_VERIFICATION" || t.status === "PENDING") ||
    transactionsList.find((t) => t.proof_of_transfer || t.proof_url || t.transfer_proof) ||
    transactionsList[0] ||
    data.payment ||
    (data.proof_of_transfer || data.proof_url || data.transfer_proof ? data : null) ||
    null;

  const hasUploadedPayment = !!(
    pendingPayment &&
    (pendingPayment.proof_of_transfer || pendingPayment.proof_url || pendingPayment.transfer_proof)
  );

  const isBendaharaStep = targetRole.toLowerCase().includes("bendahara");

  const canApprove = (() => {
    if (isApproved || isRejected) return false;
    if (!targetRole) return true;
    if (!currentUser) return true;

    const target = targetRole.toLowerCase();
    const userRole = typeof currentUser.role === "string" ? currentUser.role.toLowerCase() : "";
    const userRoleAssignments = Array.isArray(currentUser.roleAssignments)
      ? currentUser.roleAssignments.map((r) => (r.role?.role_name || r.role_name || "").toLowerCase())
      : [];
    const userRoles = Array.isArray(currentUser.roles)
      ? currentUser.roles.map((r) => (typeof r === "string" ? r : r.role_name || "").toLowerCase())
      : [];
    const userFullName = typeof currentUser.full_name === "string" ? currentUser.full_name.toLowerCase() : "";

    const hasMatchingRole =
      userRole.includes(target) ||
      target.includes(userRole) ||
      userRoleAssignments.some((r) => r.includes(target) || target.includes(r)) ||
      userRoles.some((r) => r.includes(target) || target.includes(r)) ||
      userFullName.includes(target);

    if (!hasMatchingRole) return false;

    // Jika giliran Bendahara, anggota WAJIB sudah konfirmasi & upload bukti pembayaran
    if (isBendaharaStep && !hasUploadedPayment) {
      return false;
    }

    return true;
  })();

  return (
    <Modal show={show} onHide={onHide} size="lg" centered scrollable>
      <Modal.Header closeButton className="border-0 bg-light pb-0 pt-4 px-4">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center text-dark">
          <div
            className="icon-box bg-soft-primary text-primary me-3 d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "#e0e7ff",
            }}
          >
            <User size={18} />
          </div>
          <div>
            <div>Review Pendaftaran Anggota</div>
            <div className="text-muted fw-normal">ID: {registration_id}</div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light p-4">
        {/* 1. Identitas & Berkas KTP/Swafoto */}
        <MemberIdentitySection data={data} getMediaUrl={getMediaUrl} />

        {/* 2. Informasi Pembayaran & Bukti Transfer */}
        <MemberPaymentProofSection
          pendingPayment={pendingPayment}
          fullName={full_name}
          getMediaUrl={getMediaUrl}
        />

        {/* 3 - 5. Informasi Akun, Pekerjaan & Bank */}
        <MemberDetailsSection data={data} />

        {/* 6. Timeline Approval & Aksi Persetujuan */}
        <MemberApprovalWorkflowSection
          data={data}
          currentStep={currentStep}
          note={note}
          setNote={setNote}
          isBendaharaStep={isBendaharaStep}
          hasUploadedPayment={hasUploadedPayment}
          canApprove={canApprove}
          isApproved={isApproved}
          isRejected={isRejected}
          onApprove={onApprove}
          onReject={onReject}
          onHide={onHide}
          processing={processing}
        />
      </Modal.Body>
    </Modal>
  );
}

export default RegistrationReviewModal;
