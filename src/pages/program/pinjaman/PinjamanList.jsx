import React, { useState, useEffect, useMemo } from "react";
import { Card, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import dashboardService from "../../../utils/api/UDashboard";
import jualBeliService from "../../../utils/api/UJualBeli";
import JualBeliSetoranModal from "../../../components/modals/JualBeliSetoranModal";
import ProgramApprovalModal from "../../../components/modals/ProgramApprovalModal";
import TransactionDetailModal from "../../../components/modals/TransactionDetailModal";
import ImportPinjamanModal from "./components/ImportPinjamanModal";
import PinjamanListHeader from "./components/PinjamanListHeader";
import PinjamanTable from "./components/PinjamanTable";
import PinjamanApprovalTable from "./components/PinjamanApprovalTable";
import { jwtEncode } from "../../../utils/helpers";
import exportToExcel from "../../../utils/helpers/exportToExcel";

const PinjamanList = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [filters, setFilters] = useState({
    anggota: "",
    jenis_pinjaman: "",
    jumlah_pinjaman: "",
    tenor: "",
    cicilan: "",
    piutang: "",
    status_cicilan: "",
    status_approval: "",
  });
  const [transactions, setTransactions] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modals state
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedApprovalTx, setSelectedApprovalTx] = useState(null);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDetailTx, setSelectedDetailTx] = useState(null);

  const [showSetoranModal, setShowSetoranModal] = useState(false);
  const [selectedSetoranTx, setSelectedSetoranTx] = useState(null);

  const [showImportModal, setShowImportModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [historyRes, dashRes] = await Promise.all([
        jualBeliService.getFinancingHistory({ type: "pinjaman", all: true }),
        dashboardService.getAdminDashboardData(),
      ]);

      if (historyRes.data?.status) {
        setTransactions(
          historyRes.data.data.transactions || historyRes.data.data || []
        );
      }

      if (dashRes.data?.success) {
        const programPending = (
          dashRes.data.data.pendingCategorized?.program || []
        ).filter((item) => !(item.item || "").toLowerCase().includes("arisan"));
        setPendingApprovals(programPending);
      }
    } catch (err) {
      console.error("Gagal mengambil data pinjaman:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const totalRequired =
        Number(item.amount_requested || 0) +
        Number(item.margin_amount || 0) -
        Number(item.down_payment || 0);
      const remainingDebt = Math.max(
        0,
        totalRequired - Number(item.paid_amount || 0)
      );
      const isPaidOff =
        Number(item.paid_amount || 0) >= totalRequired && totalRequired > 0
          ? "Lunas"
          : "Belum Lunas";

      const amountReqStr = String(item.amount_requested || "");
      const tenorStr = String(
        item.cooperation_months || item.tenure || item.tenor_months || "-"
      );
      const cicilanStr = String(
        item.monthly_installment || item.installment_amount || ""
      );
      const piutangStr = String(remainingDebt || "");

      const memberMatch =
        (item.member_name || "")
          .toLowerCase()
          .includes(filters.anggota.toLowerCase()) ||
        (item.financing_id || "")
          .toLowerCase()
          .includes(filters.anggota.toLowerCase());

      const jenisMatch = (item.category || item.purpose || "Pinjaman Lunak")
        .toLowerCase()
        .includes(filters.jenis_pinjaman.toLowerCase());

      const jumlahMatch = amountReqStr.includes(filters.jumlah_pinjaman);
      const tenorMatch = tenorStr
        .toLowerCase()
        .includes(filters.tenor.toLowerCase());
      const cicilanMatch = cicilanStr.includes(filters.cicilan);
      const piutangMatch = piutangStr.includes(filters.piutang);
      const statusCicilanMatch = isPaidOff
        .toLowerCase()
        .includes(filters.status_cicilan.toLowerCase());
      const statusApprovalMatch = (item.status || "")
        .toLowerCase()
        .includes(filters.status_approval.toLowerCase());

      return (
        memberMatch &&
        jenisMatch &&
        jumlahMatch &&
        tenorMatch &&
        cicilanMatch &&
        piutangMatch &&
        statusCicilanMatch &&
        statusApprovalMatch
      );
    });
  }, [transactions, filters]);

  const handleViewInvoice = (tx) => {
    setSelectedDetailTx({
      id: tx.id || tx.financing_id,
      member: tx.member_name || "Anggota",
      member_id: tx.member_id || "-",
      date: tx.created_at || new Date().toISOString(),
      amount: tx.amount_requested,
      product_name: tx.category || tx.purpose || "Pinjaman Lunak",
      type: "Pinjaman Lunak",
      status: tx.status,
    });
    setShowDetailModal(true);
  };

  const handleViewTransaksi = (tx) => {
    setSelectedSetoranTx(tx);
    setShowSetoranModal(true);
  };

  const handleProcessApproval = (item) => {
    setSelectedApprovalTx(item);
    setShowApprovalModal(true);
  };

  return (
    <div className="simpanan-dashboard py-4 px-3 px-md-4">
      {/* Breadcrumb Header */}
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Pinjaman Lunak</Breadcrumb.Item>
          <Breadcrumb.Item active>List</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Pinjaman Lunak Dashboard</h4>
          <p className="text-muted small mb-0">
            Kelola dan pantau transaksi pinjaman lunak anggota.
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden animate-fade-in h-100">
        <Card.Body className="p-0">
          <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
            <div className="global-tabs-wrapper mb-3 px-4 pt-3">
              <Nav variant="pills" className="global-tabs border-0 flex-nowrap">
                <Nav.Item>
                  <Nav.Link eventKey="list" className="fw-medium">
                    Daftar Pinjaman
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="approval" className="fw-medium">
                    Approval ({pendingApprovals.length})
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <Tab.Content>
              {/* Tab 1: Daftar Pinjaman */}
              <Tab.Pane eventKey="list">
                <PinjamanListHeader
                  onOpenImport={() => setShowImportModal(true)}
                  onExport={handleExportPinjaman}
                  hasData={transactions && transactions.length > 0}
                />
                <PinjamanTable
                  loading={loading}
                  filteredTransactions={transactions}
                  filters={filters}
                  setFilters={setFilters}
                  formatCurrency={formatCurrency}
                  onViewInvoice={handleViewInvoice}
                  onViewTransaksi={handleViewTransaksi}
                />
              </Tab.Pane>

              {/* Tab 2: Approval */}
              <Tab.Pane eventKey="approval">
                <PinjamanApprovalTable
                  loading={loading}
                  pendingApprovals={pendingApprovals}
                  onProcessApproval={handleProcessApproval}
                />
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>

      {/* Program Approval Modal */}
      <ProgramApprovalModal
        show={showApprovalModal}
        onHide={() => {
          setShowApprovalModal(false);
          fetchData();
        }}
        transaction={
          selectedApprovalTx
            ? {
                id: selectedApprovalTx.id,
                member: selectedApprovalTx.name,
                member_name: selectedApprovalTx.name,
                member_id: selectedApprovalTx.member_id,
                date: selectedApprovalTx.date,
                amount_requested:
                  selectedApprovalTx.principal_amount ||
                  selectedApprovalTx.amount_requested,
                principal_amount:
                  selectedApprovalTx.amount ||
                  selectedApprovalTx.principal_amount,
                item: selectedApprovalTx.item,
                item_name: selectedApprovalTx.item,
                down_payment: selectedApprovalTx.down_payment,
                tenure:
                  selectedApprovalTx.tenure || selectedApprovalTx.term_count,
                monthly_installment: selectedApprovalTx.monthly_installment,
                disbursement_method:
                  selectedApprovalTx.disbursement_method ||
                  selectedApprovalTx.metode_pencairan,
                metode_pencairan:
                  selectedApprovalTx.metode_pencairan ||
                  selectedApprovalTx.disbursement_method,
                bank_name:
                  selectedApprovalTx.bank_name || selectedApprovalTx.bank_tujuan,
                bank_tujuan:
                  selectedApprovalTx.bank_tujuan || selectedApprovalTx.bank_name,
                bank_account_no:
                  selectedApprovalTx.bank_account_no ||
                  selectedApprovalTx.no_rekening,
                no_rekening:
                  selectedApprovalTx.no_rekening ||
                  selectedApprovalTx.bank_account_no,
                lokasi_pencairan: selectedApprovalTx.lokasi_pencairan,
                flow: selectedApprovalTx.flow,
                currentStep: selectedApprovalTx.currentStep,
                final_status: selectedApprovalTx.final_status,
                approvals: selectedApprovalTx.approvals,
                approvalChain: selectedApprovalTx.approvalChain,
              }
            : null
        }
        formatRp={formatCurrency}
      />

      {/* Transaction Detail Modal */}
      <TransactionDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        transaction={selectedDetailTx}
        formatRupiah={formatCurrency}
      />

      {/* Jual Beli / Pinjaman Setoran Modal */}
      <JualBeliSetoranModal
        show={showSetoranModal}
        onHide={() => setShowSetoranModal(false)}
        transaction={selectedSetoranTx}
        formatRp={formatCurrency}
      />

      {/* Import Pinjaman Modal */}
      <ImportPinjamanModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onSuccess={() => fetchData()}
      />
    </div>
  );
};

export default PinjamanList;
