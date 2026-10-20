// PATH: src/components/modals/jualbeli/hooks/useJualBeliApproval.js
import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import approvalService from "../../../../utils/api/UApproval";
import { parseNumber, formatCurrency, checkCanApprove } from "../utils/jualBeliHelpers";

export const useJualBeliApproval = ({
  transaction,
  show,
  onHide,
  formatRp,
  viewOnly = false,
}) => {
  const [notes, setNotes] = useState("");
  const [operationalCost, setOperationalCost] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setNotes("");
      setDiscount("");
      setOperationalCost("");
    }
  }, [show]);

  const userData = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      return {};
    }
  }, []);

  const verifierRole = useMemo(() => {
    return (
      transaction?.currentStep?.verifierRole?.role_name ||
      transaction?.currentStep?.step_name?.split(" ")[1] ||
      "Ketua"
    );
  }, [transaction]);

  const status = useMemo(() => {
    return (
      transaction?.status?.toUpperCase() ||
      transaction?.final_status?.toUpperCase() ||
      ""
    );
  }, [transaction]);

  const isApproved = useMemo(() => {
    return [
      "APPROVED",
      "DISETUJUI",
      "PAID",
      "COMPLETED",
      "ACTIVE",
      "LUNAS",
    ].includes(status);
  }, [status]);

  const isRejected = useMemo(() => {
    return status === "REJECTED" || status === "DITOLAK";
  }, [status]);

  const isPelunasan = useMemo(() => {
    return !!(
      transaction?.category?.toLowerCase().includes("pelunasan") ||
      transaction?.item_name?.toLowerCase().includes("pelunasan") ||
      transaction?.item?.toLowerCase().includes("pelunasan") ||
      transaction?.product?.toLowerCase().includes("pelunasan")
    );
  }, [transaction]);

  const downPayment = useMemo(() => {
    return parseNumber(transaction?.down_payment);
  }, [transaction]);

  const isBendaharaStep = useMemo(() => {
    return verifierRole?.toLowerCase() === "bendahara";
  }, [verifierRole]);

  const hasDownPayment = downPayment > 0;

  const dpProofUrl = useMemo(() => {
    return (
      transaction?.dp_proof_url ||
      transaction?.dp_payment?.proof_of_transfer ||
      transaction?.proof_of_transfer ||
      transaction?.transfer_proof_path ||
      null
    );
  }, [transaction]);

  const hasUploadedDP = useMemo(() => {
    return (
      !hasDownPayment ||
      !!dpProofUrl ||
      Boolean(transaction?.has_uploaded_dp) ||
      Boolean(transaction?.has_paid_dp)
    );
  }, [hasDownPayment, dpProofUrl, transaction]);

  const canApprove = useMemo(() => {
    return checkCanApprove({
      viewOnly,
      isApproved,
      isRejected,
      isBendaharaStep,
      hasDownPayment,
      hasUploadedDP,
      verifierRole,
      userData,
    });
  }, [
    viewOnly,
    isApproved,
    isRejected,
    isBendaharaStep,
    hasDownPayment,
    hasUploadedDP,
    verifierRole,
    userData,
  ]);

  const totalDisplay = useMemo(() => {
    if (!transaction) return 0;
    const totalTagihan = parseNumber(transaction.total_tagihan);
    const principalAmount =
      parseNumber(transaction.principal_amount) ||
      parseNumber(transaction.amount_requested) ||
      parseNumber(transaction.item_price);
    const marginAmount = parseNumber(transaction.margin_amount);
    const operationalCostNum = parseNumber(transaction.operational_cost);
    return totalTagihan || principalAmount + operationalCostNum + marginAmount;
  }, [transaction]);

  const formattedCurrency = useCallback(
    (val) => formatCurrency(val, formatRp),
    [formatRp]
  );

  const handleApprove = async () => {
    setLoading(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang menyetujui pengajuan Jual Beli",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        action: "approve",
        notes: notes || "Disetujui",
        ...(isBendaharaStep && {
          operational_cost: Number(operationalCost) || 0,
          discount: Number(discount) || 0,
        }),
      };

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        payload
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire(
          "Berhasil!",
          "Pengajuan Jual Beli Berhasil Disetujui!",
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
        text: "Sedang menolak pengajuan Jual Beli",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const res = await approvalService.processFinancingApproval(
        transaction.id || transaction.financing_id,
        { action: "reject", notes: notes || "Ditolak" }
      );

      if (res.data?.success || res.status === 200) {
        Swal.fire("Berhasil!", "Pengajuan Jual Beli Ditolak!", "success").then(
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

  return {
    notes,
    setNotes,
    operationalCost,
    setOperationalCost,
    discount,
    setDiscount,
    loading,
    verifierRole,
    isApproved,
    isRejected,
    isPelunasan,
    downPayment,
    isBendaharaStep,
    hasDownPayment,
    dpProofUrl,
    hasUploadedDP,
    canApprove,
    totalDisplay,
    formatCurrency: formattedCurrency,
    handleApprove,
    handleReject,
  };
};
