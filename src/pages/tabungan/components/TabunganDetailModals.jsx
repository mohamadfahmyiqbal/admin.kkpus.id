import React, { useState, useEffect, useMemo } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { Receipt } from "phosphor-react";
import tabunganService from "../../../utils/api/UTabungan";
import ManualPaymentApprovalModal from "../../../components/modals/ManualPaymentApprovalModal";
import { MemberBillsTable, MemberBillsPagination } from "./details/MemberBillsTable";
import MemberInvoiceModal from "./details/MemberInvoiceModal";

export { default as MemberInfoModal } from "./details/MemberInfoModal";

const initialSearchState = {
  periode: "",
  tanggal: "",
  namaAnggota: "",
  namaSetoran: "",
  jumlah: "",
  status: "",
};

export const MemberTransactionsModal = ({
  show,
  onHide,
  member,
  formatRupiah,
}) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(initialSearchState);
  const [page, setPage] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedVerificationTx, setSelectedVerificationTx] = useState(null);

  const fetchBills = async () => {
    if (!member) return;
    setLoading(true);
    try {
      const res = await tabunganService.getAdminTabunganBills(
        member.member_saving_target_id
      );
      setBills(res.data?.data || []);
    } catch (err) {
      console.error("Gagal mengambil transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show && member) {
      fetchBills();
      setSearch(initialSearchState);
      setPage(1);
    }
  }, [show, member]);

  const handleFilterChange = (field, val) => {
    setSearch((prev) => ({ ...prev, [field]: val }));
    setPage(1);
  };

  const filteredBills = useMemo(() => {
    return bills.filter((b) => {
      const peri = b.due_date
        ? new Date(b.due_date).toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })
        : "-";
      const tgl = b.due_date
        ? new Date(b.due_date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "-";
      const mName = member?.nama || "";
      const sName = b.item_name || "Setoran Tabungan";
      const jml = b.amount?.toString() || "";
      const st = b.status || "";

      return (
        peri.toLowerCase().includes(search.periode.toLowerCase()) &&
        tgl.toLowerCase().includes(search.tanggal.toLowerCase()) &&
        mName.toLowerCase().includes(search.namaAnggota.toLowerCase()) &&
        sName.toLowerCase().includes(search.namaSetoran.toLowerCase()) &&
        jml.toLowerCase().includes(search.jumlah.toLowerCase()) &&
        st.toLowerCase().includes(search.status.toLowerCase())
      );
    });
  }, [bills, member, search]);

  const totalPages = Math.ceil(filteredBills.length / 5);
  const pagedBills = useMemo(() => {
    return filteredBills.slice((page - 1) * 5, page * 5);
  }, [filteredBills, page]);

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <Receipt size={24} className="text-primary" weight="fill" />
            Riwayat Transaksi - {member?.nama}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          {loading ? (
            <div className="d-flex justify-content-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              <MemberBillsTable
                bills={pagedBills}
                search={search}
                onFilterChange={handleFilterChange}
                member={member}
                formatRupiah={formatRupiah}
                onViewInvoice={(invoice) => {
                  setSelectedInvoice(invoice);
                  setShowInvoice(true);
                }}
                onVerifyPayment={(tx) => setSelectedVerificationTx(tx)}
              />

              <MemberBillsPagination
                page={page}
                totalPages={totalPages}
                totalItems={filteredBills.length}
                onPageChange={setPage}
              />
            </>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="light" onClick={onHide}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      <MemberInvoiceModal
        show={showInvoice}
        onHide={() => setShowInvoice(false)}
        invoice={selectedInvoice}
        member={member}
        formatRupiah={formatRupiah}
      />

      <ManualPaymentApprovalModal
        show={Boolean(selectedVerificationTx)}
        onHide={() => setSelectedVerificationTx(null)}
        transaction={selectedVerificationTx}
        onSuccess={() => {
          setSelectedVerificationTx(null);
          fetchBills();
        }}
      />
    </>
  );
};
