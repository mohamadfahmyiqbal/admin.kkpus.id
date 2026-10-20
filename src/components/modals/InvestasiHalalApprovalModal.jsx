import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import Swal from "sweetalert2";
import { ShieldCheck } from "phosphor-react";
import approvalService from "../../utils/api/UApproval";
import InvestasiNominalHeader from "./investasi/InvestasiNominalHeader";
import InvestasiDetailsSection from "./investasi/InvestasiDetailsSection";
import InvestasiApprovalFlow from "./investasi/InvestasiApprovalFlow";
import {
  InvestasiApprovalNotes,
  InvestasiApprovalActions,
} from "./investasi/InvestasiApprovalActions";

const InvestasiHalalApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRp,
  viewOnly = false,
}) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setNotes("");
    }
  }, [show]);

  let userData = null;
  try {
    const rawUser = localStorage.getItem("userData");
    if (rawUser) userData = JSON.parse(rawUser);
  } catch (err) {
    console.error("Failed to parse user data:", err);
  }

  const currentRole =
    transaction?.currentStep?.verifierRole?.role_name ||
    transaction?.currentStep?.step_name?.split(" ")[1] ||
    "Ketua";

  const currentStatus =
    transaction?.status?.toUpperCase() ||
    transaction?.final_status?.toUpperCase() ||
    "";
  const isApproved = currentStatus === "APPROVED" || currentStatus === "DISETUJUI";
  const isRejected = currentStatus === "REJECTED" || currentStatus === "DITOLAK";

  const canApprove =
    !viewOnly &&
    (() => {
      if (isApproved || isRejected) return false;
      if (!currentRole) return true;
      if (!userData) return true;

      const target = currentRole.toLowerCase();
      const userRole =
        typeof userData.role === "string" ? userData.role.toLowerCase() : "";
      const userRoles = Array.isArray(userData.roles)
        ? userData.roles.map((r) => (typeof r === "string" ? r.toLowerCase() : (r.role_name || "").toLowerCase()))
        : [];
      const roleAssignments = Array.isArray(userData.roleAssignments)
        ? userData.roleAssignments.map((ra) =>
            (ra.role?.role_name || ra.role_name || "").toLowerCase()
          )
        : [];
      const fullName =
        typeof userData.full_name === "string"
          ? userData.full_name.toLowerCase()
          : "";

      const allRoles = [userRole, ...userRoles, ...roleAssignments, fullName].filter(Boolean);

      return allRoles.some((r) => r.includes(target) || target.includes(r));
    })();

  if (!transaction) return null;

  const formatCurrency = (val) => {
    if (val == null) return "Rp 0";
    const num = Number(val);
    if (isNaN(num)) return val;
    if (formatRp) {
      try {
        return formatRp(num);
      } catch (e) {}
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleApprove = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyetujui investasi sukuk",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = { action: "approve", notes: notes || "Disetujui" };
      const res = await approvalService.processSukukApproval(
        transaction.id || transaction.order_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Investasi Sukuk Berhasil Disetujui!", "success").then(
          () => {
            onHide();
            window.location.reload();
          }
        );
      } else {
        Swal.fire(
          "Gagal",
          res.data?.message || "Gagal memproses persetujuan.",
          "error"
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan sistem",
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
        text: "Sedang menolak investasi sukuk",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = { action: "reject", notes: notes || "Ditolak" };
      const res = await approvalService.processSukukApproval(
        transaction.id || transaction.order_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Investasi Sukuk Ditolak!", "success").then(() => {
          onHide();
          window.location.reload();
        });
      } else {
        Swal.fire(
          "Gagal",
          res.data?.message || "Gagal memproses penolakan.",
          "error"
        );
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan sistem",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const steps =
    transaction?.flow?.steps?.length > 0
      ? [...transaction.flow.steps].sort((a, b) => a.step_order - b.step_order)
      : [
          { role: { role_name: "Pengawas" }, step_order: 1 },
          { role: { role_name: "Ketua" }, step_order: 2 },
          { role: { role_name: "Bendahara" }, step_order: 3 },
        ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      contentClassName="border-0 rounded-4 shadow-xl"
    >
      <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-3">
          <div className="bg-success bg-opacity-10 p-2 rounded-3 d-flex">
            <ShieldCheck size={24} className="text-success" weight="fill" />
          </div>
          Persetujuan Investasi
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 px-4 pb-4">
        <InvestasiNominalHeader
          amount={transaction.amount}
          formatCurrency={formatCurrency}
        />

        <InvestasiDetailsSection
          transaction={transaction}
          formatCurrency={formatCurrency}
        />

        <InvestasiApprovalFlow
          transaction={transaction}
          steps={steps}
          isApproved={isApproved}
          isRejected={isRejected}
        />

        {canApprove && (
          <InvestasiApprovalNotes notes={notes} setNotes={setNotes} />
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 pt-1">
        <InvestasiApprovalActions
          canApprove={canApprove}
          loading={loading}
          onApprove={handleApprove}
          onReject={handleReject}
          onHide={onHide}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default InvestasiHalalApprovalModal;
