import React, { useState, useEffect, useCallback } from "react";
import { Card, Button, Form } from "react-bootstrap";
import { MagnifyingGlass, ArrowClockwise } from "phosphor-react";
import tabunganService from "../../../utils/api/UTabungan";
import TransactionTable from "../../../components/ui/TransactionTable";
import WithdrawalApprovalModal from "../../../components/modals/WithdrawalApprovalModal";
import TransactionDetailModal from "../../../components/modals/TransactionDetailModal";

const TabunganTransactionsTab = () => {
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      return {};
    }
  })();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [searchFilters, setSearchFilters] = useState({ member: "" });

  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await tabunganService.getAdminTabunganTransactions({
        page,
        search: searchFilters.member,
      });
      if (res.data?.status) {
        setTransactions(res.data.data.transactions || []);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Gagal mengambil transaksi tabungan:", err);
    } finally {
      setLoading(false);
    }
  }, [page, searchFilters]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchChange = (field, val) => {
    setSearchFilters((prev) => ({ ...prev, [field]: val }));
    setPage(1);
  };

  const handleApprove = (tx) => {
    setSelectedTx(tx);
    setShowApprovalModal(true);
  };

  const handleView = (tx) => {
    setSelectedTx(tx);
    setShowDetailModal(true);
  };

  const formatRupiah = (val) =>
    val === "-"
      ? "-"
      : new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(val || 0);

  const isTreasurer = (userData?.role || "")
    .toLowerCase()
    .includes("bendahara");

  return (
    <Card className="border-0 shadow-sm rounded-4 overflow-hidden mt-3">
      <div className="table-filter-bar px-4 py-3">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
          <div className="search-input-group d-flex align-items-center bg-light px-3 py-2 rounded-3" style={{ minWidth: "260px" }}>
            <MagnifyingGlass className="search-icon text-muted me-2" size={18} />
            <Form.Control
              type="text"
              placeholder="Cari anggota..."
              className="rounded-3 shadow-none border-0 bg-transparent p-0"
              value={searchFilters.member}
              onChange={(e) => handleSearchChange("member", e.target.value)}
            />
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              className="rounded-3 border-0 bg-light d-flex align-items-center gap-2 text-muted fw-medium small"
              onClick={fetchTransactions}
            >
              <ArrowClockwise size={18} /> Refresh
            </Button>
          </div>
        </div>
      </div>

      <Card.Body className="p-0">
        <div className="global-tabs-wrapper px-4 pt-3 mb-0">
          <h5 className="mb-3 text-dark fw-bold">
            Persetujuan & Riwayat Pencairan
          </h5>
          <TransactionTable
            transactions={transactions}
            loading={loading}
            formatRupiah={formatRupiah}
            pagination={pagination}
            onPageChange={setPage}
            onSearchChange={handleSearchChange}
            searchFilters={searchFilters}
            onApprove={handleApprove}
            onView={handleView}
          />
        </div>
      </Card.Body>

      <WithdrawalApprovalModal
        show={showApprovalModal}
        onHide={() => setShowApprovalModal(false)}
        transaction={selectedTx}
        formatRupiah={formatRupiah}
        onSuccess={fetchTransactions}
        isTreasurer={isTreasurer}
        approvalApi={tabunganService.approveWithdrawal}
        disbursementApi={tabunganService.disburseWithdrawal}
      />

      <TransactionDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        transaction={selectedTx}
        formatRupiah={formatRupiah}
      />
    </Card>
  );
};

export default TabunganTransactionsTab;
