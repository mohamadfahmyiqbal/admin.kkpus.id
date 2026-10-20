import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import { CheckCircle, XCircle, Money } from "phosphor-react";
import Swal from "sweetalert2";
import approvalService from "../../utils/api/UApproval";
import { jwtDecodePage } from "../../utils/helpers";
import WithdrawalInfoCard from "./withdrawal/WithdrawalInfoCard";
import WithdrawalApprovalFlow from "./withdrawal/WithdrawalApprovalFlow";
import WithdrawalTransferUpload from "./withdrawal/WithdrawalTransferUpload";

export const WithdrawalApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRupiah,
  isTreasurer,
  approvalApi,
  onSuccess,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [note, setNote] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!show) {
      setFile(null);
      setPreview(null);
      setNote("");
    }
  }, [show]);

  if (!transaction) return null;

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
    transaction.currentStep?.verifierRole?.role_name ||
    transaction.currentStep?.step_name ||
    transaction.current_step_role ||
    "";
  const finalStatus = (transaction.final_status || transaction.status || "").toUpperCase();

  const isApprovedFinal = [
    "APPROVED",
    "DISETUJUI",
    "READY_TO_PAY",
    "PENDING_EXTERNAL",
    "DISBURSED",
    "SELESAI",
    "COMPLETED",
  ].includes(finalStatus);

  const isRejectedFinal = ["REJECTED", "DITOLAK"].includes(finalStatus);

  const canApprove = (() => {
    if (isApprovedFinal || isRejectedFinal) return false;
    if (!currentRoleName) return true;
    if (!currentUser) return true;

    const target = currentRoleName.toLowerCase();
    const userRole = typeof currentUser.role === "string" ? currentUser.role.toLowerCase() : "";
    const userRoles = Array.isArray(currentUser.roles)
      ? currentUser.roles.map((r) => (typeof r === "string" ? r.toLowerCase() : (r.role_name || "").toLowerCase()))
      : [];
    const userRoleAssignments = Array.isArray(currentUser.roleAssignments)
      ? currentUser.roleAssignments.map((r) => (r.role?.role_name || r.role_name || "").toLowerCase())
      : [];
    const userFullName =
      typeof currentUser.full_name === "string" ? currentUser.full_name.toLowerCase() : "";

    const allRoles = [userRole, ...userRoles, ...userRoleAssignments, userFullName].filter(Boolean);

    return allRoles.some((r) => r.includes(target) || target.includes(r));
  })();

  const isCurrentStepTreasurer =
    currentRoleName.toLowerCase().includes("bendahara") || isTreasurer;

  const formatAmount = () => {
    if (!transaction || transaction.amount == null) return "Rp 0";
    const amt = transaction.amount;
    if (typeof amt === "string" && amt.toLowerCase().includes("rp")) return amt;
    const num = parseFloat(amt);
    return isNaN(num) ? amt : formatRupiah ? formatRupiah(num) : `Rp ${num.toLocaleString("id-ID")}`;
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      if (f.size > 2 * 1024 * 1024) {
        Swal.fire("Peringatan", "Ukuran file bukti transfer maksimal 2MB!", "warning");
        return;
      }
      setFile(f);
      if (f.type.startsWith("image/")) {
        setPreview(URL.createObjectURL(f));
      } else if (f.type === "application/pdf") {
        setPreview("pdf");
      } else {
        Swal.fire("Peringatan", "Hanya format JPG, PNG, atau PDF yang didukung!", "warning");
        setFile(null);
      }
    }
  };

  const fileToBase64 = (fileObj) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileObj);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
    });

  const handleAction = async (actionType) => {
    if (actionType === "approve" && isCurrentStepTreasurer && !file && !transaction.transfer_proof) {
      Swal.fire("Peringatan", "Bendahara wajib mengunggah bukti transfer sebelum menyetujui!", "warning");
      return;
    }

    setProcessing(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: `Sedang memproses ${actionType === "approve" ? "persetujuan" : "penolakan"} pencairan`,
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      let transferProofBase64 = null;
      if (file) {
        transferProofBase64 = await fileToBase64(file);
      }

      const payload = {
        action: actionType,
        notes: note || (actionType === "approve" ? "Disetujui" : "Ditolak"),
      };
      if (transferProofBase64) {
        payload.transfer_proof = transferProofBase64;
      }

      const res = approvalApi
        ? await approvalApi(transaction.id, payload)
        : await approvalService.processWithdrawalApproval(transaction.id, payload);

      if (res.data?.success || res.status === 200) {
        Swal.fire(
          "Berhasil!",
          `Pencairan berhasil di${actionType === "approve" ? "setujui" : "tolak"}!`,
          "success"
        ).then(() => {
          onHide();
          if (onSuccess) onSuccess();
        });
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal memproses permohonan.", "error");
      }
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.message || err.response?.data?.error || err.message || "Terjadi kesalahan sistem",
        "error"
      );
    } finally {
      setProcessing(false);
    }
  };

  const rawSteps =
    transaction.flow?.steps?.length > 0
      ? [...transaction.flow.steps].sort((a, b) => a.step_order - b.step_order)
      : [
          { role: { role_name: "Pengawas" }, step_order: 1 },
          { role: { role_name: "Ketua" }, step_order: 2 },
          { role: { role_name: "Bendahara" }, step_order: 3 },
        ];

  return (
    <Modal show={show} onHide={onHide} centered size="lg" className="border-0 shadow-lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
          <CheckCircle size={28} className="text-primary" weight="fill" />
          Detail & Approval Pencairan
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 px-4">
        {/* Nominal Card */}
        <div className="bg-primary bg-opacity-10 p-4 rounded-4 mb-4 border border-primary border-opacity-10 position-relative overflow-hidden">
          <div className="position-relative z-1 text-center">
            <p className="text-primary small mb-1 text-uppercase fw-bold" style={{ letterSpacing: "1px" }}>
              Nominal Pencairan
            </p>
            <h2 className="fw-bold text-primary mb-0">{formatAmount()}</h2>
          </div>
          <Money
            size={90}
            className="position-absolute text-primary opacity-5"
            style={{ right: -15, bottom: -15 }}
            weight="fill"
          />
        </div>

        {/* Informasi Pengajuan Lengkap */}
        <WithdrawalInfoCard
          transaction={transaction}
          isApprovedFinal={isApprovedFinal}
          isRejectedFinal={isRejectedFinal}
        />

        {/* Alur & Step Approval */}
        <WithdrawalApprovalFlow
          rawSteps={rawSteps}
          transaction={transaction}
          isApprovedFinal={isApprovedFinal}
          isRejectedFinal={isRejectedFinal}
          currentRoleName={currentRoleName}
        />

        {/* Upload Bukti Transfer jika giliran Bendahara */}
        {isCurrentStepTreasurer && canApprove && (
          <WithdrawalTransferUpload
            file={file}
            preview={preview}
            onFileChange={handleFileChange}
          />
        )}

        {/* Input Catatan jika ada hak approve */}
        {canApprove && (
          <div className="border-top pt-3">
            <Form.Group>
              <Form.Label className="small fw-bold text-muted">
                Catatan Persetujuan / Penolakan (Opsional)
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Tambahkan catatan persetujuan atau alasan..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="rounded-3 border-light shadow-none small"
              />
            </Form.Group>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-0 pt-2 pb-4 px-4 gap-2">
        <Row className="w-100 m-0">
          {canApprove ? (
            <>
              <Col md={6} className="ps-0 pe-2 mb-2 mb-md-0">
                <Button
                  variant="outline-danger"
                  className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2"
                  onClick={() => handleAction("reject")}
                  disabled={processing}
                >
                  {processing ? <Spinner size="sm" /> : <><XCircle size={18} /> Tolak</>}
                </Button>
              </Col>
              <Col md={6} className="pe-0 ps-2">
                <Button
                  variant="success"
                  className="w-100 fw-bold py-2 rounded-3 d-flex align-items-center justify-content-center gap-2 border-0 shadow-sm"
                  onClick={() => handleAction("approve")}
                  disabled={processing}
                  style={{ backgroundColor: "#10b981" }}
                >
                  {processing ? (
                    <Spinner size="sm" />
                  ) : (
                    <>
                      <CheckCircle size={18} weight="bold" />
                      {isCurrentStepTreasurer ? "Kirim & Setujui" : "Terima & Lanjutkan"}
                    </>
                  )}
                </Button>
              </Col>
            </>
          ) : (
            <Col md={12} className="px-0">
              <Button
                variant="light"
                className="w-100 fw-bold py-2 rounded-3 border text-muted"
                onClick={onHide}
              >
                Tutup
              </Button>
            </Col>
          )}
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

export default WithdrawalApprovalModal;
