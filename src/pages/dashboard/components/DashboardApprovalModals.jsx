// PATH: src/pages/dashboard/components/DashboardApprovalModals.jsx
import React, { Suspense, lazy } from "react";
import { Spinner } from "react-bootstrap";
import savingsService from "../../../utils/api/USavings";
import tabunganService from "../../../utils/api/UTabungan";

const RegistrationReviewModal = lazy(() => import("../../anggota/RegistrationReviewModal"));
const TerminationReviewModal = lazy(() => import("../../anggota/TerminationReviewModal"));
const WithdrawalApprovalModal = lazy(() => import("../../../components/modals/WithdrawalApprovalModal"));
const JualBeliApprovalModal = lazy(() => import("../../../components/modals/JualBeliApprovalModal"));
const ProgramApprovalModal = lazy(() => import("../../../components/modals/ProgramApprovalModal"));
const TabunganApprovalModal = lazy(() => import("../../../components/modals/TabunganApprovalModal"));
const InvestasiHalalApprovalModal = lazy(() => import("../../../components/modals/InvestasiHalalApprovalModal"));
const PendanaanSyariahApprovalModal = lazy(() => import("../../../components/modals/PendanaanSyariahApprovalModal"));
const ManualPaymentApprovalModal = lazy(() => import("../../../components/modals/ManualPaymentApprovalModal"));

const DashboardApprovalModals = ({ modalState, fetchData }) => {
  const {
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
    handleProcessRegistration,
    handleRejectRegistration,
  } = modalState;

  return (
    <Suspense
      fallback={
        <div className="text-center p-3">
          <Spinner animation="border" variant="primary" />
        </div>
      }
    >
      {/* 1. Modal Review Pendaftaran Anggota */}
      <RegistrationReviewModal
        show={showRegModal}
        onHide={() => setShowRegModal(false)}
        data={selectedReg}
        onApprove={(id, stepId, notes) =>
          handleProcessRegistration(id, stepId, notes, "REGISTRATION")
        }
        onReject={(id, stepId, notes) =>
          handleRejectRegistration(id, stepId, notes, "REGISTRATION")
        }
        processing={processingReg}
      />

      {/* 2. Modal Review Berhenti Keanggotaan */}
      <TerminationReviewModal
        show={showTermModal}
        onHide={() => setShowTermModal(false)}
        data={selectedTerm}
        onApprove={(id, stepId, notes, proof) =>
          handleProcessRegistration(id, stepId, notes, "TERMINATION", proof)
        }
        onReject={(id, stepId, notes) =>
          handleRejectRegistration(id, stepId, notes, "TERMINATION")
        }
        processing={processingReg}
      />

      {/* 3. Modal Approval Pencairan Simpanan & Tabungan */}
      <WithdrawalApprovalModal
        show={showWithdrawalModal}
        onHide={() => {
          setShowWithdrawalModal(false);
          fetchData();
        }}
        transaction={
          selectedWithdrawal
            ? {
                id: selectedWithdrawal.id,
                member: selectedWithdrawal.name,
                member_id: selectedWithdrawal.member_id,
                date: selectedWithdrawal.date,
                amount: selectedWithdrawal.amount,
                product_name: selectedWithdrawal.item,
                flow: selectedWithdrawal.flow,
                currentStep: selectedWithdrawal.currentStep,
                final_status: selectedWithdrawal.final_status,
                approvals: selectedWithdrawal.approvals,
              }
            : null
        }
        formatRupiah={(v) => v}
        isTreasurer={false}
        approvalApi={
          selectedWithdrawal?.item === "Pencairan Tabungan"
            ? tabunganService.approveWithdrawal
            : savingsService.approveWithdrawal
        }
        disbursementApi={
          selectedWithdrawal?.item === "Pencairan Tabungan"
            ? tabunganService.disburseWithdrawal
            : savingsService.disburseWithdrawal
        }
      />

      {/* 4. Modal Approval Jual Beli */}
      <JualBeliApprovalModal
        show={showJualBeliModal}
        onHide={() => {
          setShowJualBeliModal(false);
          fetchData();
        }}
        transaction={
          selectedJualBeli
            ? {
                ...selectedJualBeli,
                id: selectedJualBeli.id,
                member: selectedJualBeli.name,
                member_id: selectedJualBeli.member_id || selectedJualBeli.id,
                date: selectedJualBeli.date,
                amount_requested: selectedJualBeli.principal_amount,
                principal_amount: selectedJualBeli.amount,
                item: selectedJualBeli.item,
                down_payment: selectedJualBeli.down_payment,
                tenure: selectedJualBeli.tenure,
                monthly_installment: selectedJualBeli.monthly_installment,
                flow: selectedJualBeli.flow,
                currentStep: selectedJualBeli.currentStep,
                final_status: selectedJualBeli.final_status,
                approvals: selectedJualBeli.approvals,
                approvalChain: selectedJualBeli.approvalChain,
                has_uploaded_dp: selectedJualBeli.has_uploaded_dp,
                dp_proof_url: selectedJualBeli.dp_proof_url,
                dp_payment: selectedJualBeli.dp_payment,
                has_paid_dp: selectedJualBeli.has_paid_dp,
              }
            : null
        }
      />

      {/* 5. Modal Approval Program / Pinjaman */}
      <ProgramApprovalModal
        show={showProgramModal}
        onHide={() => {
          setShowProgramModal(false);
          fetchData();
        }}
        transaction={
          selectedProgram
            ? {
                id: selectedProgram.id,
                member: selectedProgram.name,
                member_id: selectedProgram.member_id,
                date: selectedProgram.date,
                amount_requested: selectedProgram.principal_amount,
                principal_amount: selectedProgram.amount,
                item: selectedProgram.item,
                down_payment: selectedProgram.down_payment,
                tenure: selectedProgram.tenure,
                monthly_installment: selectedProgram.monthly_installment,
                disbursement_method: selectedProgram.disbursement_method,
                bank_name: selectedProgram.bank_name,
                bank_account_no: selectedProgram.bank_account_no,
                flow: selectedProgram.flow,
                currentStep: selectedProgram.currentStep,
                final_status: selectedProgram.final_status,
                approvals: selectedProgram.approvals,
                approvalChain: selectedProgram.approvalChain,
              }
            : null
        }
      />

      {/* 6. Modal Approval Pengajuan Tabungan */}
      <TabunganApprovalModal
        show={showTabunganModal}
        onHide={() => {
          setShowTabunganModal(false);
          fetchData();
        }}
        transaction={selectedTabungan}
      />

      {/* 7. Modal Approval Investasi Halal (Sukuk) */}
      <InvestasiHalalApprovalModal
        show={showInvestasiModal}
        onHide={() => {
          setShowInvestasiModal(false);
          fetchData();
        }}
        transaction={
          selectedInvestasi
            ? {
                ...selectedInvestasi,
                id: selectedInvestasi.id,
                member: selectedInvestasi.name,
                member_id: selectedInvestasi.member_id,
                date: selectedInvestasi.date,
                amount: selectedInvestasi.amount,
                item: selectedInvestasi.item,
                flow: selectedInvestasi.flow,
                currentStep: selectedInvestasi.currentStep,
                final_status: selectedInvestasi.final_status,
              }
            : null
        }
      />

      {/* 8. Modal Approval Pendanaan Syariah */}
      <PendanaanSyariahApprovalModal
        show={showPendanaanModal}
        onHide={() => {
          setShowPendanaanModal(false);
          fetchData();
        }}
        transaction={
          selectedPendanaan
            ? {
                ...selectedPendanaan,
                id: selectedPendanaan.id,
                member: selectedPendanaan.name,
                member_id: selectedPendanaan.member_id,
                date: selectedPendanaan.date,
                amount_requested:
                  selectedPendanaan.amount_requested || selectedPendanaan.amount,
                item: selectedPendanaan.item_name || selectedPendanaan.item,
                tenure:
                  selectedPendanaan.tenure || selectedPendanaan.cooperation_months,
                flow: selectedPendanaan.flow,
                currentStep: selectedPendanaan.currentStep,
                final_status: selectedPendanaan.final_status,
              }
            : null
        }
      />

      {/* 9. Modal Verifikasi Pembayaran Manual (Setoran) */}
      <ManualPaymentApprovalModal
        show={showManualModal}
        onHide={() => {
          setShowManualModal(false);
          setSelectedManualPayment(null);
        }}
        transaction={selectedManualPayment}
        onSuccess={() => fetchData()}
      />
    </Suspense>
  );
};

export default DashboardApprovalModals;
