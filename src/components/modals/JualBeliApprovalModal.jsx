// PATH: src/components/modals/JualBeliApprovalModal.jsx
import React from "react";
import { Modal } from "react-bootstrap";
import JualBeliModalHeader from "./jualbeli/JualBeliModalHeader";
import JualBeliNominalHeader from "./jualbeli/JualBeliNominalHeader";
import JualBeliInfoCard from "./jualbeli/JualBeliInfoCard";
import JualBeliDPProofCard from "./jualbeli/JualBeliDPProofCard";
import JualBeliApprovalFlow from "./jualbeli/JualBeliApprovalFlow";
import JualBeliActionForm from "./jualbeli/JualBeliActionForm";
import JualBeliModalFooter from "./jualbeli/JualBeliModalFooter";
import { useJualBeliApproval } from "./jualbeli/hooks/useJualBeliApproval";

const JualBeliApprovalModal = ({
  show,
  onHide,
  transaction,
  formatRp,
  viewOnly = false,
}) => {
  const approval = useJualBeliApproval({
    transaction,
    show,
    onHide,
    formatRp,
    viewOnly,
  });

  if (!transaction) return null;

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="md"
      contentClassName="border-0 rounded-4 shadow-xl"
    >
      <JualBeliModalHeader />

      <Modal.Body className="pt-3 px-4 pb-4">
        {/* Nominal Card */}
        <JualBeliNominalHeader
          totalDisplay={approval.totalDisplay}
          formatCurrency={approval.formatCurrency}
        />

        {/* Informasi Pengajuan */}
        <JualBeliInfoCard
          transaction={transaction}
          formatCurrency={approval.formatCurrency}
          isPelunasan={approval.isPelunasan}
        />

        {/* Bukti Pembayaran DP (Uang Tanda Keseriusan) */}
        {approval.hasDownPayment && (
          <JualBeliDPProofCard
            downPayment={approval.downPayment}
            hasUploadedDP={approval.hasUploadedDP}
            dpProofUrl={approval.dpProofUrl}
            dpPayment={transaction.dp_payment}
            formatCurrency={approval.formatCurrency}
            isBendaharaStep={approval.isBendaharaStep}
          />
        )}

        {/* Alur Persetujuan */}
        <JualBeliApprovalFlow
          transaction={transaction}
          isApproved={approval.isApproved}
          isRejected={approval.isRejected}
        />

        {/* Form Tindakan Bendahara & Catatan */}
        {approval.canApprove && (
          <JualBeliActionForm
            verifierRole={approval.verifierRole}
            isPelunasan={approval.isPelunasan}
            operationalCost={approval.operationalCost}
            setOperationalCost={approval.setOperationalCost}
            discount={approval.discount}
            setDiscount={approval.setDiscount}
            notes={approval.notes}
            setNotes={approval.setNotes}
          />
        )}
      </Modal.Body>

      <JualBeliModalFooter
        isBendaharaStep={approval.isBendaharaStep}
        hasDownPayment={approval.hasDownPayment}
        hasUploadedDP={approval.hasUploadedDP}
        viewOnly={viewOnly}
        isApproved={approval.isApproved}
        isRejected={approval.isRejected}
        canApprove={approval.canApprove}
        loading={approval.loading}
        handleReject={approval.handleReject}
        handleApprove={approval.handleApprove}
        onHide={onHide}
      />
    </Modal>
  );
};

export default React.memo(JualBeliApprovalModal);
