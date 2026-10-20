import React, { useState, useEffect, useMemo } from "react";
import { Spinner } from "react-bootstrap";
import investasiService from "../../../utils/api/UInvestasi";
import PendanaanSyariahApprovalModal from "../../../components/modals/PendanaanSyariahApprovalModal";
import JualBeliSetoranModal from "../../../components/modals/JualBeliSetoranModal";
import ImportPendanaanModal from "./components/ImportPendanaanModal";
import PendanaanHeader from "./components/PendanaanHeader";
import PendanaanSummaryCards from "./components/PendanaanSummaryCards";
import PendanaanTabs from "./components/PendanaanTabs";

const PendanaanSyariahListPage = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showApproval, setShowApproval] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showSetoran, setShowSetoran] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await investasiService.getPendanaanHistory({
        type: "pendanaan",
        all: true,
      });
      if (res.data?.status) {
        setTransactions(res.data.data.transactions || res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch transactions", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const summary = useMemo(() => {
    let pembiayaanAktif = 0;
    let labaBerjalan = 0;
    let dpDiterima = 0;
    let pendingCount = 0;

    transactions.forEach((item) => {
      if (item.status === "PENDING") {
        pendingCount++;
      }
      if (item.status === "APPROVED" || item.status === "ACTIVE") {
        const total =
          Number(item.item_price || item.amount_requested || 0) +
          Number(item.operational_cost || 0);
        pembiayaanAktif += total - Number(item.down_payment || 0);
        labaBerjalan += Number(item.margin_amount || 0);
        dpDiterima += Number(item.down_payment || 0);
      }
    });

    return { pembiayaanAktif, labaBerjalan, dpDiterima, pendingCount };
  }, [transactions]);

  const modalTransaction = selectedTx
    ? {
        ...selectedTx,
        amount_requested: selectedTx.amount_requested || selectedTx.item_price,
        tenure: selectedTx.cooperation_months,
      }
    : null;

  return (
    <div className="simpanan-dashboard py-4 px-3 px-md-4">
      <PendanaanHeader
        onImport={() => setShowImport(true)}
        onRefresh={fetchTransactions}
        loading={loading}
      />

      {loading ? (
        <div className="loading-container d-flex flex-column justify-content-center align-items-center h-100 py-5">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p className="text-muted fw-medium">
            Memuat data pendanaan syariah...
          </p>
        </div>
      ) : (
        <div className="animate-fade-in">
          <PendanaanSummaryCards
            summary={summary}
            formatCurrency={formatCurrency}
          />

          <PendanaanTabs
            transactions={transactions}
            pendingCount={summary.pendingCount}
            formatCurrency={formatCurrency}
            onDetail={(item) => {
              setSelectedTx(item);
              setShowDetail(true);
            }}
            onSetoran={(item) => {
              setSelectedTx(item);
              setShowSetoran(true);
            }}
            onApproval={(item) => {
              setSelectedTx(item);
              setShowApproval(true);
            }}
          />
        </div>
      )}

      {showApproval && (
        <PendanaanSyariahApprovalModal
          show={showApproval}
          onHide={() => {
            setShowApproval(false);
            setSelectedTx(null);
            fetchTransactions();
          }}
          transaction={modalTransaction}
          formatRp={formatCurrency}
        />
      )}

      {showDetail && (
        <PendanaanSyariahApprovalModal
          show={showDetail}
          onHide={() => {
            setShowDetail(false);
            setSelectedTx(null);
          }}
          transaction={modalTransaction}
          formatRp={formatCurrency}
          viewOnly={true}
        />
      )}

      {showSetoran && (
        <JualBeliSetoranModal
          show={showSetoran}
          onHide={() => {
            setShowSetoran(false);
            setSelectedTx(null);
          }}
          transaction={modalTransaction}
          formatRp={formatCurrency}
        />
      )}

      <ImportPendanaanModal
        show={showImport}
        onHide={() => setShowImport(false)}
        onSuccess={() => fetchTransactions()}
      />
    </div>
  );
};

export default PendanaanSyariahListPage;
