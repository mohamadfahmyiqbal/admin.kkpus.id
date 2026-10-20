import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { CheckCircle } from "phosphor-react";
import Swal from "sweetalert2";
import approvalService from "../../utils/api/UApproval";
import ProgramNominalCard from "./program/ProgramNominalCard";
import ProgramInfoSection from "./program/ProgramInfoSection";
import ProgramApprovalFlow from "./program/ProgramApprovalFlow";
import {
  ProgramApprovalForm,
  ProgramApprovalFooter,
} from "./program/ProgramApprovalActions";

const defaultSteps = [
  { role: { role_name: "Pengawas" }, step_order: 1 },
  { role: { role_name: "Ketua" }, step_order: 2 },
  { role: { role_name: "Bendahara" }, step_order: 3 },
];

const ProgramApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRp,
}) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferProof, setTransferProof] = useState(null);

  useEffect(() => {
    if (!show) {
      setNote("");
      setTransferProof(null);
    }
  }, [show]);

  if (!transaction) return null;

  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      return {};
    }
  })();
  const currentStepRole =
    transaction?.currentStep?.verifierRole?.role_name ||
    transaction?.currentStep?.step_name?.split(" ")[1] ||
    "Ketua";

  const status = (transaction?.status || transaction?.final_status || "").toUpperCase();
  const isApprovedFinal = status === "APPROVED" || status === "DISETUJUI";
  const isRejectedFinal = status === "REJECTED" || status === "DITOLAK";

  const isMyStep = (() => {
    if (isApprovedFinal || isRejectedFinal) return false;
    if (!currentStepRole) return true;
    if (!userData) return false;

    const userRole = typeof userData.role === "string" ? userData.role.toLowerCase() : "";
    const roleAssignments = Array.isArray(userData.roleAssignments)
      ? userData.roleAssignments.map((ra) => ra.role?.role_name?.toLowerCase())
      : [];
    const fullName = typeof userData.full_name === "string" ? userData.full_name.toLowerCase() : "";

    const targetRole = currentStepRole.toLowerCase();
    return (
      userRole.includes(targetRole) ||
      roleAssignments.includes(targetRole) ||
      fullName.includes(targetRole)
    );
  })();

  const itemString = (
    transaction?.item ||
    transaction?.item_name ||
    transaction?.category ||
    transaction?.product_name ||
    ""
  ).toLowerCase();

  const isPinjamanLunak = Boolean(itemString.match(/lunak|darurat/));
  const isBendahara = currentStepRole.toLowerCase().includes("bendahara");
  const requiresProof = isPinjamanLunak && isBendahara && isMyStep;

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

  const handleApprove = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyetujui pengajuan Program",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (requiresProof && !transferProof) {
        Swal.fire("Perhatian", "Bukti transfer wajib diupload untuk pencairan Pinjaman Lunak!", "warning");
        setLoading(false);
        return;
      }

      const payload = {
        action: "approve",
        notes: note || "Disetujui",
      };

      if (requiresProof && transferProof) {
        payload.transfer_proof = transferProof;
      }

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pengajuan Program Berhasil Disetujui!", "success").then(() => {
          onHide();
        });
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal memproses persetujuan.", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || err.response?.data?.message || err.message || "Terjadi kesalahan sistem",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menolak pengajuan Program",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        {
          action: "reject",
          notes: note || "Ditolak",
        }
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pengajuan Program Ditolak!", "success").then(() => {
          onHide();
        });
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal memproses penolakan.", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || err.response?.data?.message || err.message || "Terjadi kesalahan sistem",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val) => {
    if (formatRp) return formatRp(val);
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(val || 0));
  };

  const stepsList =
    transaction?.flow?.steps?.length > 0
      ? [...transaction.flow.steps].sort((a, b) => a.step_order - b.step_order)
      : defaultSteps;

  return (
    <Modal show={show} onHide={onHide} centered size="md" className="border-0 shadow-lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
          <CheckCircle size={28} className="text-primary" weight="fill" />
          Detail & Approval Program
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-4 px-4">
        <ProgramNominalCard
          amount={transaction.amount_requested || transaction.principal_amount}
          formatCurrency={formatCurrency}
        />

        <ProgramInfoSection
          transaction={transaction}
          formatCurrency={formatCurrency}
        />

        <ProgramApprovalFlow
          stepsList={stepsList}
          transaction={transaction}
          isApprovedFinal={isApprovedFinal}
          isRejectedFinal={isRejectedFinal}
        />

        {isMyStep && (
          <ProgramApprovalForm
            note={note}
            setNote={setNote}
            requiresProof={requiresProof}
            onFileChange={handleFileChange}
          />
        )}
      </Modal.Body>

      <ProgramApprovalFooter
        isMyStep={isMyStep}
        loading={loading}
        onApprove={handleApprove}
        onReject={handleReject}
        onHide={onHide}
      />
    </Modal>
  );
};

export default ProgramApprovalModal;
