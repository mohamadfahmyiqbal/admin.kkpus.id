import React, { useState, useEffect, useMemo } from "react";
import { Modal, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import jualBeliService from "../../../../utils/api/UJualBeli";
import ProgramApprovalModal from "../../../../components/modals/ProgramApprovalModal";
import TransactionDetailModal from "../../../../components/modals/TransactionDetailModal";
import ManualPaymentApprovalModal from "../../../../components/modals/ManualPaymentApprovalModal";

import ArisanParticipantsTable from "../participants/ArisanParticipantsTable";
import ArisanInstallmentsModal from "../participants/ArisanInstallmentsModal";

const ArisanParticipantsModal = ({ batchId, onBack }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedApprovalTx, setSelectedApprovalTx] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const [showInstallmentModal, setShowInstallmentModal] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [loadingInstallments, setLoadingInstallments] = useState(false);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedVerificationTx, setSelectedVerificationTx] = useState(null);

  const [filter, setFilter] = useState({
    arisan: "",
    anggota: "",
    anggota2: "",
    saldo: "",
    piutang: "",
    target: "",
    status: "",
  });

  const handleFilterChange = (field, val) => {
    setFilter((prev) => ({ ...prev, [field]: val }));
  };

  const fetchParticipants = async () => {
    setLoading(true);
    try {
      const res = await jualBeliService.getFinancingHistory({
        all: true,
        type: "arisan",
        batch_id: batchId,
      });
      if (res.data?.status || res.data?.success) {
        setParticipants(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching participants:", err);
      Swal.fire("Error", "Gagal mengambil data peserta", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batchId) {
      fetchParticipants();
    }
  }, [batchId]);

  const handleOpenInstallments = async (item) => {
    setSelectedParticipant(item);
    setShowInstallmentModal(true);
    setLoadingInstallments(true);
    try {
      const res = await jualBeliService.getFinancingDetail(
        item.id || item.financing_id
      );
      if (res.data?.status || res.data?.success) {
        setInstallments(res.data.data?.installments || []);
      } else {
        setInstallments([]);
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Gagal mengambil data setoran", "error");
      setInstallments([]);
    } finally {
      setLoadingInstallments(false);
    }
  };

  const handleOpenInvoice = (inst) => {
    setSelectedInvoice({
      id:
        inst.id ||
        inst.bill_item_id ||
        `INV-${Date.now().toString().substring(5)}`,
      date:
        inst.payment_date ||
        inst.created_at ||
        inst.updated_at ||
        new Date().toISOString(),
      member: selectedParticipant?.member_name,
      member_id: selectedParticipant?.member_id || "-",
      type: "Setoran Arisan",
      product_name:
        inst.description || `Pembayaran Term ${inst.installment_number}`,
      amount: inst.amount,
      status: inst.status,
    });
    setShowInvoiceModal(true);
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const filtered = useMemo(() => {
    return participants.filter((item) => {
      const pArisan = (item.purpose || item.category || "-").toLowerCase();
      const pMember = (item.member_name || "-").toLowerCase();
      const pMember2 = (item.nama_peserta_2 || "-").toLowerCase();
      const pSaldo = String(
        item.paid_installment_amount || item.paid_amount || 0
      ).toLowerCase();
      const pPiutang = String(item.unpaid_amount || 0).toLowerCase();
      const pTarget = String(
        item.amount_requested || item.item_price || 0
      ).toLowerCase();
      const pStatus = (item.status || "").toLowerCase();

      return (
        pArisan.includes(filter.arisan.toLowerCase()) &&
        pMember.includes(filter.anggota.toLowerCase()) &&
        pMember2.includes(filter.anggota2.toLowerCase()) &&
        pSaldo.includes(filter.saldo.toLowerCase()) &&
        pPiutang.includes(filter.piutang.toLowerCase()) &&
        pTarget.includes(filter.target.toLowerCase()) &&
        pStatus.includes(filter.status.toLowerCase())
      );
    });
  }, [participants, filter]);

  const handleOpenApproval = (item) => {
    setSelectedApprovalTx({
      id: item.id || item.financing_id,
      name: item.member_name,
      member_id: item.member_id,
      date: item.created_at || item.createdAt,
      principal_amount: item.amount_requested,
      amount: item.total_tagihan || item.amount_requested,
      item: item.purpose || item.category,
      down_payment: item.down_payment,
      tenure: item.cooperation_months,
      monthly_installment: item.monthly_installment,
      disbursement_method: item.metode_pencairan,
      bank_name: item.bank_tujuan,
      bank_account_no: item.no_rekening,
      flow: item.currentStep?.step_name,
      currentStep: item.currentStep,
      final_status: item.status,
    });
    setShowApprovalModal(true);
  };

  return (
    <Modal
      show={Boolean(batchId)}
      onHide={onBack}
      size="xl"
      centered
      enforceFocus={false}
    >
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-3">
        <Modal.Title className="fw-bold text-primary">
          Daftar Peserta Arisan
          <div className="text-muted small fw-normal mt-1">
            Kelola persetujuan, pendaftaran dan nomor urut peserta.
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        <Card className="border-0 shadow-sm rounded-4">
          <Card.Body className="p-0">
            <ArisanParticipantsTable
              loading={loading}
              filtered={filtered}
              filter={filter}
              onFilterChange={handleFilterChange}
              formatCurrency={formatCurrency}
              onOpenApproval={handleOpenApproval}
              onOpenInstallments={handleOpenInstallments}
            />
          </Card.Body>
        </Card>

        {/* Modal Approval */}
        <ProgramApprovalModal
          show={showApprovalModal}
          onHide={() => {
            setShowApprovalModal(false);
            fetchParticipants();
          }}
          transaction={selectedApprovalTx}
          formatRp={formatCurrency}
        />

        {/* Modal Daftar Setoran Peserta */}
        <ArisanInstallmentsModal
          show={showInstallmentModal}
          onHide={() => setShowInstallmentModal(false)}
          loading={loadingInstallments}
          participant={selectedParticipant}
          installments={installments}
          formatCurrency={formatCurrency}
          onOpenInvoice={handleOpenInvoice}
          onVerify={(inst) => {
            setSelectedVerificationTx({
              id: inst.transaction_id,
              transaction_id: inst.transaction_id,
              amount: formatCurrency(inst.amount),
              proof_of_transfer: inst.proof_of_transfer,
              sender_name: inst.sender_name,
              sender_bank: inst.sender_bank,
              member: selectedParticipant?.member_name,
              member_id: selectedParticipant?.member_id,
              created_at: inst.payment_date,
            });
          }}
        />

        {/* Modal Invoice */}
        <TransactionDetailModal
          show={showInvoiceModal}
          onHide={() => setShowInvoiceModal(false)}
          transaction={selectedInvoice}
          formatRupiah={formatCurrency}
        />

        {/* Modal Verifikasi Pembayaran Manual (Bendahara) */}
        <ManualPaymentApprovalModal
          show={Boolean(selectedVerificationTx)}
          onHide={() => setSelectedVerificationTx(null)}
          transaction={selectedVerificationTx}
          onSuccess={() => {
            setSelectedVerificationTx(null);
            if (selectedParticipant) {
              handleOpenInstallments(selectedParticipant);
            }
            fetchParticipants();
          }}
        />
      </Modal.Body>
    </Modal>
  );
};

export default ArisanParticipantsModal;
