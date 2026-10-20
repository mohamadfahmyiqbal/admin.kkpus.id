// PATH: src/pages/dashboard/hooks/useDashboardModals.jsx
import { useState, useCallback } from "react";
import Swal from "sweetalert2";
import approvalService from "../../../utils/api/UApproval";

export const useDashboardModals = (fetchData) => {
  // 1. Registration Review
  const [showRegModal, setShowRegModal] = useState(false);
  const [selectedReg, setSelectedReg] = useState(null);

  // 2. Termination Review
  const [showTermModal, setShowTermModal] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [processingReg, setProcessingReg] = useState(false);

  // 3. Simpanan / Withdrawal
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // 4. Jual Beli
  const [showJualBeliModal, setShowJualBeliModal] = useState(false);
  const [selectedJualBeli, setSelectedJualBeli] = useState(null);

  // 5. Program / Pinjaman
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  // 6. Tabungan
  const [showTabunganModal, setShowTabunganModal] = useState(false);
  const [selectedTabungan, setSelectedTabungan] = useState(null);

  // 7. Investasi Halal
  const [showInvestasiModal, setShowInvestasiModal] = useState(false);
  const [selectedInvestasi, setSelectedInvestasi] = useState(null);

  // 8. Pendanaan Syariah
  const [showPendanaanModal, setShowPendanaanModal] = useState(false);
  const [selectedPendanaan, setSelectedPendanaan] = useState(null);

  // 9. Manual Payment
  const [showManualModal, setShowManualModal] = useState(false);
  const [selectedManualPayment, setSelectedManualPayment] = useState(null);

  // Click Handlers
  const handleReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    if (item.type === "TERMINATION") {
      setSelectedTerm(item);
      setShowTermModal(true);
    } else {
      setSelectedReg(item);
      setShowRegModal(true);
    }
  }, []);

  const handleWithdrawalReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    setSelectedWithdrawal(item);
    setShowWithdrawalModal(true);
  }, []);

  const handleJualBeliReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    setSelectedJualBeli(item);
    setShowJualBeliModal(true);
  }, []);

  const handleProgramReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    setSelectedProgram(item);
    setShowProgramModal(true);
  }, []);

  const handleTabunganReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    if (item.item === "Pencairan Tabungan") {
      setSelectedWithdrawal(item);
      setShowWithdrawalModal(true);
    } else {
      setSelectedTabungan(item);
      setShowTabunganModal(true);
    }
  }, []);

  const handleInvestasiReviewClick = useCallback((item) => {
    if (item.is_manual_payment) {
      setSelectedManualPayment(item);
      setShowManualModal(true);
      return;
    }
    if (item.is_pendanaan) {
      setSelectedPendanaan(item);
      setShowPendanaanModal(true);
    } else {
      setSelectedInvestasi(item);
      setShowInvestasiModal(true);
    }
  }, []);

  // Process Registration / Termination
  const handleProcessRegistration = useCallback(async (id, stepId, notes, type = "REGISTRATION", proof = null) => {
    setProcessingReg(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang memproses persetujuan...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        action: "approve",
        step_id: stepId,
        notes: notes || "Disetujui",
      };
      if (proof) payload.transfer_proof = proof;

      if (type === "TERMINATION") {
        await approvalService.processTerminationApproval(id, payload);
      } else {
        await approvalService.processRegistrationApproval(id, payload);
      }

      Swal.fire("Berhasil", "Pendaftaran berhasil disetujui", "success");
      setShowRegModal(false);
      setShowTermModal(false);
      fetchData?.();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Terjadi kesalahan saat memproses", "error");
    } finally {
      setProcessingReg(false);
    }
  }, [fetchData]);

  const handleRejectRegistration = useCallback(async (id, stepId, notes, type = "REGISTRATION") => {
    setProcessingReg(true);
    try {
      Swal.fire({
        title: "Memproses...",
        text: "Sedang memproses penolakan...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      const payload = {
        action: "reject",
        step_id: stepId,
        notes: notes || "Ditolak",
      };

      if (type === "TERMINATION") {
        await approvalService.processTerminationApproval(id, payload);
      } else {
        await approvalService.processRegistrationApproval(id, payload);
      }

      Swal.fire("Berhasil", "Pendaftaran berhasil ditolak", "success");
      setShowRegModal(false);
      setShowTermModal(false);
      fetchData?.();
    } catch (err) {
      Swal.fire("Error", err?.response?.data?.message || "Terjadi kesalahan saat memproses", "error");
    } finally {
      setProcessingReg(false);
    }
  }, [fetchData]);

  return {
    // States
    showRegModal,
    setShowRegModal,
    selectedReg,
    showTermModal,
    setShowTermModal,
    selectedTerm,
    processingReg,
    showWithdrawalModal,
    setShowWithdrawalModal,
    selectedWithdrawal,
    showJualBeliModal,
    setShowJualBeliModal,
    selectedJualBeli,
    showProgramModal,
    setShowProgramModal,
    selectedProgram,
    showTabunganModal,
    setShowTabunganModal,
    selectedTabungan,
    showInvestasiModal,
    setShowInvestasiModal,
    selectedInvestasi,
    showPendanaanModal,
    setShowPendanaanModal,
    selectedPendanaan,
    showManualModal,
    setShowManualModal,
    selectedManualPayment,
    setSelectedManualPayment,

    // Handlers
    handleReviewClick,
    handleWithdrawalReviewClick,
    handleJualBeliReviewClick,
    handleProgramReviewClick,
    handleTabunganReviewClick,
    handleInvestasiReviewClick,
    handleProcessRegistration,
    handleRejectRegistration,
  };
};

export default useDashboardModals;
