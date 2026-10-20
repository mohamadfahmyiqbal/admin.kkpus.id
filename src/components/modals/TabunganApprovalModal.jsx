import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Badge, ListGroup } from "react-bootstrap";
import { User, Coins, Calendar, Check, X, WarningCircle } from "phosphor-react";
import Swal from "sweetalert2";
import approvalService from "../../utils/api/UApproval";
import ApprovalPlaceholder from "../ui/ApprovalPlaceholder";
import { jwtDecodePage } from "../../utils/helpers";

const TabunganApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRp,
  viewOnly = false,
}) => {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setNote("");
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

  const currentRoleName =
    transaction?.currentStep?.verifierRole?.role_name ||
    transaction?.currentStep?.step_name ||
    "";

  const finalStatus =
    transaction?.status?.toUpperCase() ||
    transaction?.final_status?.toUpperCase() ||
    "";

  const isApproved =
    finalStatus === "APPROVED" || finalStatus === "DISETUJUI";
  const isRejected =
    finalStatus === "REJECTED" || finalStatus === "DITOLAK";

  const canApprove =
    !viewOnly &&
    (() => {
      if (isApproved || isRejected) return false;
      if (!currentRoleName) return true;
      if (!currentUser) return true;

      const target = currentRoleName.toLowerCase();
      const userRole =
        typeof currentUser.role === "string" ? currentUser.role.toLowerCase() : "";
      const userRoles = Array.isArray(currentUser.roles)
        ? currentUser.roles.map((r) => (typeof r === "string" ? r.toLowerCase() : (r.role_name || "").toLowerCase()))
        : [];
      const userRoleAssignments = Array.isArray(currentUser.roleAssignments)
        ? currentUser.roleAssignments.map((r) => (r.role?.role_name || r.role_name || "").toLowerCase())
        : [];
      const userFullName =
        typeof currentUser.full_name === "string"
          ? currentUser.full_name.toLowerCase()
          : "";

      const allRoles = [userRole, ...userRoles, ...userRoleAssignments, userFullName].filter(Boolean);

      return allRoles.some((r) => r.includes(target) || target.includes(r));
    })();

  if (!transaction) return null;

  const formatAmount = (val) => {
    if (val == null) return "Rp 0";
    const num = Number(val);
    if (isNaN(num)) return val;
    if (formatRp) {
      try {
        return formatRp(num);
      } catch {}
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
        text: "Sedang menyetujui pengajuan Tabungan",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        action: "approve",
        notes: note || "Disetujui",
      };

      const res = await approvalService.processTabunganApproval(
        transaction.id || transaction.saving_target_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pengajuan Tabungan Berhasil Disetujui!", "success").then(() => {
          onHide();
          window.location.reload();
        });
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal memproses persetujuan.", "error");
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
        text: "Sedang menolak pengajuan Tabungan",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await approvalService.processTabunganApproval(
        transaction.id || transaction.saving_target_id,
        { action: "reject", notes: note || "Ditolak" }
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pengajuan Tabungan Ditolak!", "success").then(() => {
          onHide();
          window.location.reload();
        });
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal memproses penolakan.", "error");
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
      size="md"
      contentClassName="border-0 rounded-4 shadow-xl"
    >
      <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-3">
          <div className="bg-warning bg-opacity-10 p-2 rounded-3 d-flex">
            <Coins size={24} className="text-warning" weight="fill" />
          </div>
          Persetujuan Tabungan
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 px-4 pb-4">
        <div
          className="bg-gradient bg-warning bg-opacity-10 p-4 rounded-4 mb-4 position-relative overflow-hidden"
          style={{ border: "1px solid rgba(255, 193, 7, 0.15)" }}
        >
          <div className="position-relative z-1 text-center">
            <p
              className="text-warning small mb-1 text-uppercase fw-bold"
              style={{ letterSpacing: "1px", opacity: 0.8 }}
            >
              Target Tabungan
            </p>
            <h2 className="fw-bolder text-warning mb-0" style={{ letterSpacing: "-0.5px" }}>
              {formatAmount(transaction.target_amount || transaction.amount_requested)}
            </h2>
          </div>
          <Coins
            size={100}
            className="position-absolute text-warning"
            style={{
              right: -15,
              bottom: -15,
              opacity: 0.05,
              transform: "rotate(-10deg)",
            }}
            weight="fill"
          />
        </div>

        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <WarningCircle size={18} className="text-muted" />
            Informasi Pengajuan
          </h6>
          <ListGroup
            variant="flush"
            className="border rounded-4 overflow-hidden bg-white shadow-sm"
            style={{ borderColor: "#f1f5f9" }}
          >
            <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <User size={18} weight="fill" />
                </div>
                <span className="text-muted small fw-medium">Nama Anggota</span>
              </div>
              <div className="text-end">
                <p className="mb-0 fw-bold text-dark small">
                  {transaction.member_name || transaction.member || transaction.name}
                </p>
                <span className="text-muted">
                  ID: {transaction.member_id?.substring(0, 8) || transaction.id?.substring(0, 8)}
                </span>
              </div>
            </ListGroup.Item>

            <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <Coins size={18} weight="fill" />
                </div>
                <span className="text-muted small fw-medium">Kategori Tabungan</span>
              </div>
              <div className="text-end">
                <span className="fw-bold text-dark small d-block">
                  {transaction.category || transaction.item || transaction.item_name || "Tidak ada"}
                </span>
              </div>
            </ListGroup.Item>

            <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-transparent border-0">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
                  style={{ width: "36px", height: "36px" }}
                >
                  <Calendar size={18} weight="fill" />
                </div>
                <span className="text-muted small fw-medium">Durasi Target</span>
              </div>
              <div className="text-end">
                <Badge bg="info" className="bg-opacity-10 text-info fw-bold border-0 px-3 py-2 rounded-pill small">
                  {transaction.term_months || transaction.tenure || "-"} Bulan
                </Badge>
                <span className="text-muted d-block mt-1">
                  Min. {formatAmount(transaction.min_monthly_deposit || transaction.monthly_installment || 0)}/bln
                </span>
              </div>
            </ListGroup.Item>
          </ListGroup>
        </div>

        <div className="mb-4">
          <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
            <Coins size={18} className="text-muted" />
            Tindakan Persetujuan
          </h6>
          <div className="border border-light rounded-4 p-4 bg-white shadow-sm">
            <div className="text-center mb-4">
              <h6 className="fw-bold text-uppercase text-secondary mb-2" style={{ letterSpacing: "1.5px" }}>
                Alur Persetujuan
              </h6>
              <div className="mx-auto rounded-pill" style={{ width: "40px", height: "3px", background: "#cbd5e1" }} />
            </div>

            <div className="position-relative mb-3 mt-2 px-md-3">
              <div
                className="position-absolute d-none d-md-block"
                style={{ top: "28px", left: "10%", right: "10%", height: "2px", background: "#f1f5f9", zIndex: 0 }}
              />
              <div className="d-flex justify-content-between align-items-start position-relative" style={{ zIndex: 1, width: "100%" }}>
                {(transaction?.flow?.steps?.length > 0
                  ? [...transaction.flow.steps].sort((a, b) => a.step_order - b.step_order)
                  : [
                      { role: { role_name: "Pengawas" }, step_order: 1 },
                      { role: { role_name: "Ketua" }, step_order: 2 },
                      { role: { role_name: "Bendahara" }, step_order: 3 },
                    ]
                ).map((s, idx) => {
                  const roleName = s.verifierRole?.role_name || s.role?.role_name || `Langkah ${s.step_order}`;
                  const isStepApproved = isApproved || (transaction?.currentStep?.step_order > s.step_order && !isRejected);
                  let isStepRejected = false;
                  if (isRejected) {
                    if (transaction?.currentStep?.step_order === s.step_order || idx === 0) {
                      isStepRejected = true;
                    } else if (transaction?.currentStep?.step_order < s.step_order) {
                      isStepRejected = false;
                    }
                  }

                  const noteText =
                    transaction?.approvals?.find(
                      (a) => (a.approver_role || a.step?.verifierRole?.role_name)?.toLowerCase() === roleName?.toLowerCase()
                    )?.note ||
                    transaction?.approvalChain?.find((a) => a.role?.toLowerCase() === roleName?.toLowerCase())?.note;

                  return (
                    <ApprovalPlaceholder
                      key={s.id || s.step_id || idx}
                      role={roleName}
                      isApproved={isStepApproved}
                      isRejected={isStepRejected}
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

        {canApprove && (
          <div className="animate-fade-in border-top pt-4 mt-2">
            <Form.Group>
              <Form.Label className="small fw-bold text-muted mb-2 d-flex align-items-center gap-1">
                Catatan (Opsional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Tambahkan catatan persetujuan di sini..."
                className="rounded-3 border-light shadow-none bg-light focus-bg-white transition-all p-3 text-sm"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ resize: "none" }}
              />
            </Form.Group>
          </div>
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
                {loading ? <Spinner size="sm" /> : <><X className="me-2" /> Tolak</>}
              </Button>
              <Button
                variant="success"
                className="flex-grow-1 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center border-0 shadow-sm text-white"
                onClick={handleApprove}
                disabled={loading}
                style={{ backgroundColor: "#10b981" }}
              >
                {loading ? <Spinner size="sm" /> : <><Check className="me-2" /> Terima & Lanjutkan</>}
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

export default TabunganApprovalModal;