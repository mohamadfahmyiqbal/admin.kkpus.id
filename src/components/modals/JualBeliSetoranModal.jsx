import React, { useState, useEffect, useMemo, memo } from "react";
import { Modal, Button } from "react-bootstrap";
import { Coins } from "phosphor-react";
import jualBeliService from "../../utils/api/UJualBeli";
import ManualPaymentApprovalModal from "./ManualPaymentApprovalModal";
import SetoranInstallmentsTable from "./jualbeli/SetoranInstallmentsTable";
import SetoranInvoiceModal, { formatDate } from "./jualbeli/SetoranInvoiceModal";

const initialFilterState = {
  periode: "",
  tanggal: "",
  nama: "",
  jumlah: "",
  status: "",
};

const JualBeliSetoranModal = memo(
  ({ show, onHide, transaction, formatRp, onVerificationSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [installments, setInstallments] = useState([]);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [selectedVerificationTx, setSelectedVerificationTx] = useState(null);
    const [filters, setFilters] = useState(initialFilterState);

    const fetchDetail = async () => {
      if (!transaction) return;
      setLoading(true);
      try {
        const res = await jualBeliService.getFinancingDetail(
          transaction.id || transaction.financing_id
        );
        if (res.data?.status || res.status === 200) {
          const data = res.data?.data || res.data;
          setInstallments(
            (Array.isArray(data.installments) ? data.installments : []).filter(
              (item) =>
                item.status === "PAID" ||
                item.status === "COMPLETED" ||
                item.status === "PENDING_VERIFICATION"
            )
          );
        }
      } catch (err) {
        console.error("Failed to fetch installments", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (show && transaction) {
        fetchDetail();
        setFilters(initialFilterState);
      } else {
        setInstallments([]);
      }
    }, [show, transaction]);

    const handleFilterChange = (e, field) => {
      setFilters((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const filteredInstallments = useMemo(() => {
      return installments.filter((item) => {
        const p = `Bulan ${item.installment_number || ""}`.toLowerCase();
        const t = formatDate(item.payment_date).toLowerCase();
        const n = (
          item.description || `Setoran ${item.installment_number}`
        ).toLowerCase();
        const j = String(item.amount).toLowerCase();
        const s = (item.status || "PENDING").toLowerCase();

        return (
          p.includes(filters.periode.toLowerCase()) &&
          t.includes(filters.tanggal.toLowerCase()) &&
          n.includes(filters.nama.toLowerCase()) &&
          j.includes(filters.jumlah.toLowerCase()) &&
          s.includes(filters.status.toLowerCase())
        );
      });
    }, [installments, filters]);

    if (!transaction) return null;

    return (
      <>
        <style>{`
          .modal-90w { max-width: 90% !important; }
        `}</style>
        <Modal
          show={show}
          onHide={onHide}
          centered
          dialogClassName="modal-90w"
          className="border-0 shadow-lg"
        >
          <Modal.Header closeButton className="border-0 pb-0">
            <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-2">
              <Coins size={28} className="text-success" weight="fill" />
              Tabel Setoran
            </Modal.Title>
          </Modal.Header>

          <Modal.Body className="pt-4 px-4 pb-4">
            <div className="mb-3">
              <h6 className="fw-bold text-dark mb-1">
                {transaction.nama_nasabah ||
                  transaction.member_name ||
                  transaction.user_id ||
                  "Anggota"}
              </h6>
              <p className="text-muted small mb-0">
                {transaction.item_name || transaction.item || "-"} •{" "}
                {transaction.category || "-"}
              </p>
            </div>

            <SetoranInstallmentsTable
              installments={filteredInstallments}
              filters={filters}
              onFilterChange={handleFilterChange}
              loading={loading}
              formatRp={formatRp}
              transaction={transaction}
              onViewInvoice={(item) => setSelectedInvoice(item)}
              onVerify={(verificationTx) =>
                setSelectedVerificationTx(verificationTx)
              }
            />
          </Modal.Body>

          <Modal.Footer className="border-0 pt-0 pb-4 px-4">
            <Button
              variant="light"
              className="w-100 fw-bold py-2 rounded-3 border text-muted"
              onClick={onHide}
            >
              Tutup
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Modal Invoice Detail */}
        <SetoranInvoiceModal
          show={Boolean(selectedInvoice)}
          onHide={() => setSelectedInvoice(null)}
          invoice={selectedInvoice}
          transaction={transaction}
          formatRp={formatRp}
        />

        {/* Modal Verifikasi Pembayaran Manual (Bendahara) */}
        <ManualPaymentApprovalModal
          show={Boolean(selectedVerificationTx)}
          onHide={() => setSelectedVerificationTx(null)}
          transaction={selectedVerificationTx}
          onSuccess={() => {
            setSelectedVerificationTx(null);
            fetchDetail();
            if (onVerificationSuccess) onVerificationSuccess();
          }}
        />
      </>
    );
  }
);

export default JualBeliSetoranModal;
