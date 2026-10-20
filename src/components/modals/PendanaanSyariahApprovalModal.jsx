import React, { useState, useEffect } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { Handshake, X, Check } from "phosphor-react";
import api from "../../utils/api/common";
import approvalService from "../../utils/api/UApproval";

import PendanaanNominalHeader from "./pendanaan/PendanaanNominalHeader";
import PendanaanInfoCard from "./pendanaan/PendanaanInfoCard";
import PendanaanApprovalFlow from "./pendanaan/PendanaanApprovalFlow";
import PendanaanActionForm from "./pendanaan/PendanaanActionForm";

const PendanaanSyariahApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRp,
  viewOnly = false,
}) => {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [transferProof, setTransferProof] = useState(null);

  useEffect(() => {
    if (!show) {
      setNotes("");
      setTransferProof(null);
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
  const isApproved = [
    "APPROVED",
    "DISETUJUI",
    "PAID",
    "COMPLETED",
    "ACTIVE",
    "LUNAS",
  ].includes(currentStatus);
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
      const userRoleAssignments = Array.isArray(userData.roleAssignments)
        ? userData.roleAssignments.map((ra) =>
            (ra.role?.role_name || ra.role_name || "").toLowerCase()
          )
        : [];
      const fullName =
        typeof userData.full_name === "string"
          ? userData.full_name.toLowerCase()
          : "";

      const allRoles = [userRole, ...userRoles, ...userRoleAssignments, fullName].filter(Boolean);

      return allRoles.some((r) => r.includes(target) || target.includes(r));
    })();

  if (!transaction) return null;

  const getEvidenceUrl = (item, type) => {
    const id = item?.id || item?.financing_id;
    if (!id) return "#";
    let url = `${api.defaults.baseURL}/financing/evidence/${id}/download`;
    if (type) {
      url += `?type=${type}`;
    }
    return url;
  };

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

  const fileToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleApprove = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyetujui Pendanaan Syariah",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = { action: "approve", notes: notes || "Disetujui" };

      if (
        currentRole?.toLowerCase() === "bendahara" &&
        transaction?.metode_pencairan !== "Tunai"
      ) {
        if (!transferProof) {
          Swal.close();
          Swal.fire("Peringatan", "Bukti transfer wajib diunggah", "warning");
          setLoading(false);
          return;
        }
        payload.transfer_proof = await fileToBase64(transferProof);
      }

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire(
          "Berhasil!",
          "Pendanaan Syariah Berhasil Disetujui!",
          "success"
        ).then(() => {
          onHide();
          window.location.reload();
        });
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
        text: "Sedang menolak Pendanaan Syariah",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        { action: "reject", notes: notes || "Ditolak" }
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pendanaan Syariah Ditolak!", "success").then(
          () => {
            onHide();
            window.location.reload();
          }
        );
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

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
      contentClassName="border-0 rounded-4 shadow-xl"
    >
      <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-3">
          <div className="bg-primary bg-opacity-10 p-2 rounded-3 d-flex">
            <Handshake size={24} className="text-primary" weight="fill" />
          </div>
          Persetujuan Pendanaan Syariah
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 px-4 pb-4">
        {/* Nominal Card */}
        <PendanaanNominalHeader
          amount={transaction.amount_requested}
          formatCurrency={formatCurrency}
        />

        {/* Info Pendanaan & Dokumen Usaha */}
        <PendanaanInfoCard
          transaction={transaction}
          formatCurrency={formatCurrency}
          getEvidenceUrl={getEvidenceUrl}
        />

        {/* Approval Flow */}
        <PendanaanApprovalFlow
          transaction={transaction}
          isApproved={isApproved}
          isRejected={isRejected}
        />

        {/* Form Aksi Approval */}
        {canApprove && (
          <PendanaanActionForm
            currentRole={currentRole}
            transaction={transaction}
            setTransferProof={setTransferProof}
            notes={notes}
            setNotes={setNotes}
          />
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 px-4 pb-4 pt-1">
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
                  <Spinner size="sm" />
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
                  <Spinner size="sm" />
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
    </Modal>
  );
};

export default PendanaanSyariahApprovalModal;
