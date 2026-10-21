import React, { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import { UserMinus } from "phosphor-react";
import Swal from "sweetalert2";
import { jwtDecodePage } from "../../utils/helpers";
import TerminationMemberInfoSection from "./components/TerminationMemberInfoSection";
import TerminationReasonSection from "./components/TerminationReasonSection";
import TerminationFinancialSummarySection from "./components/TerminationFinancialSummarySection";
import TerminationApprovalWorkflowSection from "./components/TerminationApprovalWorkflowSection";

function TerminationReviewModal({
  show,
  onHide,
  data,
  onApprove,
  onReject,
  processing,
}) {
  const [note, setNote] = useState("");
  const [transferProof, setTransferProof] = useState(null);

  useEffect(() => {
    if (show) {
      setNote("");
      setTransferProof(null);
    }
  }, [show]);

  const currentUser = (() => {
    try {
      const stored = localStorage.getItem("userData");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed) return parsed;
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

  const {
    termination_id,
    reason,
    supporting_document_path,
    currentStep,
    member,
  } = data || {};

  const financialSummary = member?.financial_summary || {};

  const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const targetRole = currentStep?.verifierRole?.role_name || currentStep?.step_name || "";
  const finalStatus = data?.final_status?.toUpperCase() || data?.status?.toUpperCase() || "";
  const isApproved = finalStatus === "APPROVED" || finalStatus === "DISETUJUI";
  const isRejected = finalStatus === "REJECTED" || finalStatus === "DITOLAK";

  const canApprove = (() => {
    if (isApproved || isRejected) return false;
    if (!targetRole) return true;
    if (!currentUser) return true;

    const target = targetRole.toLowerCase();
    const userRole = typeof currentUser.role === "string" ? currentUser.role.toLowerCase() : "";
    const userRoles = Array.isArray(currentUser.roles)
      ? currentUser.roles.map((r) => (typeof r === "string" ? r.toLowerCase() : (r.role_name || "").toLowerCase()))
      : [];
    const userRoleAssignments = Array.isArray(currentUser.roleAssignments)
      ? currentUser.roleAssignments.map((r) => (r.role?.role_name || r.role_name || "").toLowerCase())
      : [];
    const userFullName = typeof currentUser.full_name === "string" ? currentUser.full_name.toLowerCase() : "";

    const allRoles = [userRole, ...userRoles, ...userRoleAssignments, userFullName].filter(Boolean);

    return allRoles.some((r) => r.includes(target) || target.includes(r));
  })();

  const isBendaharaStep = targetRole?.toLowerCase().includes("bendahara") && canApprove;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire("Error", "Ukuran file maksimal 5MB", "error");
        e.target.value = "";
        setTransferProof(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransferProof(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setTransferProof(null);
    }
  };

  const handleApproveClick = () => {
    if (isBendaharaStep && !transferProof) {
      Swal.fire("Perhatian", "Bukti transfer wajib diupload oleh Bendahara!", "warning");
      return;
    }
    onApprove(termination_id, currentStep?.step_id, note, transferProof);
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton className="border-0 bg-light pb-0 pt-4 px-4">
        <Modal.Title className="fw-bold fs-5 d-flex align-items-center text-dark">
          <div
            className="icon-box bg-soft-danger text-danger me-3 d-flex align-items-center justify-content-center"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              backgroundColor: "#fee2e2",
            }}
          >
            <UserMinus size={18} />
          </div>
          <div>
            <div>Review Berhenti Keanggotaan</div>
            <div className="text-muted fw-normal">ID: {termination_id?.substring(0, 8)}...</div>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-light p-4">
        <Row>
          {/* Kolom Kiri: Informasi Anggota & Alasan Berhenti */}
          <Col lg={7}>
            <TerminationMemberInfoSection data={data} />
            <TerminationReasonSection
              reason={reason}
              supportingDocumentPath={supporting_document_path}
              getMediaUrl={getMediaUrl}
            />
          </Col>

          {/* Kolom Kanan: Ringkasan Hak & Kewajiban Finansial & Timeline Approval */}
          <Col lg={5}>
            <TerminationFinancialSummarySection
              financialSummary={financialSummary}
              formatRp={formatRp}
            />
            <TerminationApprovalWorkflowSection
              data={data}
              currentStep={currentStep}
              note={note}
              setNote={setNote}
              isBendaharaStep={isBendaharaStep}
              handleFileChange={handleFileChange}
              canApprove={canApprove}
              isApproved={isApproved}
              isRejected={isRejected}
              onApproveClick={handleApproveClick}
              onReject={onReject}
              onHide={onHide}
              processing={processing}
              terminationId={termination_id}
            />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
}

export default TerminationReviewModal;
