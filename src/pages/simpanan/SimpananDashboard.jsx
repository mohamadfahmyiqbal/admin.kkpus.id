import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Card, Button, Form, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Wallet, Money, ArrowDownLeft, ArrowUpRight, ArrowClockwise } from "phosphor-react";
import savingsService from "../../utils/api/USavings";
import TransactionTable from "../../components/ui/TransactionTable";
import TransactionDetailModal from "../../components/modals/TransactionDetailModal";
import WithdrawalApprovalModal from "../../components/modals/WithdrawalApprovalModal";
import ManualPaymentApprovalModal from "../../components/modals/ManualPaymentApprovalModal";
import { formatRupiah, jwtEncode } from "../../utils/helpers";

const SummaryCard = ({ summary = {} }) => {
  const cards = [
    { title: "Total Semua Simpanan", value: summary.total_semua, icon: Wallet, color: "primary" },
    { title: "Total Simpanan Pokok", value: summary.total_pokok, icon: Money, color: "success" },
    { title: "Total Simpanan Wajib", value: summary.total_wajib, icon: ArrowDownLeft, color: "warning" },
    { title: "Total Simpanan Sukarela", value: summary.total_sukarela, icon: ArrowUpRight, color: "info" },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((c, idx) => (
        <Col md={3} sm={6} key={idx}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-3 d-flex align-items-center">
              <div className={`bg-${c.color} bg-opacity-10 p-3 rounded-4 me-3 flex-shrink-0`}>
                <c.icon size={24} className={`text-${c.color}`} weight="fill" />
              </div>
              <div className="overflow-hidden">
                <p className="text-muted fw-semibold mb-0 text-truncate small text-uppercase">
                  {c.title}
                </p>
                <h5 className="fw-bold text-dark mb-0 text-truncate mt-1">
                  {formatRupiah(c.value || 0)}
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

const SimpananDashboard = () => {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("POKOK");
  const [activeSukarelaCategory, setActiveSukarelaCategory] = useState("SETORAN");
  const [summary, setSummary] = useState({
    total_semua: 0,
    total_pokok: 0,
    total_wajib: 0,
    total_sukarela: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ member: "", date: "", type: "" });

  const [selectedTx, setSelectedTx] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showManualApprovalModal, setShowManualApprovalModal] = useState(false);

  const fetchSummary = async () => {
    try {
      const res = await savingsService.getAdminSavingsSummary();
      if (res.data?.status) {
        const data = res.data.data;
        if (data.bills && Array.isArray(data.bills)) {
          const pokok = data.bills.find((b) => b.item && b.item.toLowerCase().includes("pokok"));
          const wajib = data.bills.find((b) => b.item && b.item.toLowerCase().includes("wajib"));
          if (pokok) data.total_pokok = parseFloat(pokok.amount) || 0;
          if (wajib) data.total_wajib = parseFloat(wajib.amount) || 0;
        }
        setSummary(data);
      }
    } catch (err) {
      console.error("Gagal mengambil summary simpanan:", err);
    }
  };

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        type: activeType,
        tx_category: activeType === "SUKARELA" ? activeSukarelaCategory : "SETORAN",
        page,
        search: filters.member,
      };
      const res = await savingsService.getAdminSavingsTransactions(params);
      if (res.data?.status) {
        setTransactions(res.data.data.transactions || []);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Gagal mengambil transaksi simpanan:", err);
    } finally {
      setLoading(false);
    }
  }, [activeType, activeSukarelaCategory, page, filters]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTypeSelect = (k) => {
    setActiveType(k);
    setPage(1);
    if (k !== "SUKARELA") setActiveSukarelaCategory("SETORAN");
  };

  const handleSearchFilterChange = (field, val) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
    setPage(1);
  };

  const handleViewDetail = (tx) => {
    setSelectedTx(tx);
    if (tx.type === "Pencairan" || tx.type === "Pencairan Tabungan" || activeSukarelaCategory === "PENCAIRAN") {
      setShowApprovalModal(true);
    } else {
      setShowDetailModal(true);
    }
  };

  const handleApprove = (tx) => {
    setSelectedTx(tx);
    if (tx.is_manual_payment || tx.raw_status === "PENDING_VERIFICATION" || tx.status === "PENDING_VERIFICATION") {
      setShowManualApprovalModal(true);
    } else {
      setShowApprovalModal(true);
    }
  };

  return (
    <div className="pb-5">
      <div className="mb-2">
        <Breadcrumb className="mb-0" style={{ fontSize: "12px" }}>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "dashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "simpananDashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Simpanan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Dashboard Simpanan</h4>
          <p className="text-muted small mb-0">
            Pantau dan kelola seluruh transaksi simpanan anggota koperasi.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="d-flex align-items-center gap-2"
            onClick={() => {
              fetchSummary();
              fetchTransactions();
            }}
          >
            <ArrowClockwise size={18} /> Refresh
          </Button>
        </div>
      </div>

      <SummaryCard summary={summary} />

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="table-filter-bar px-4 py-3 border-bottom bg-white">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div className="d-flex align-items-center gap-2" style={{ maxWidth: "320px", width: "100%" }}>
              <Form.Control
                type="text"
                placeholder="Cari anggota..."
                className="rounded-3 shadow-none"
                value={filters.member}
                onChange={(e) => handleSearchFilterChange("member", e.target.value)}
              />
            </div>
          </div>
        </div>

        <Card.Body className="p-0">
          <div className="px-4 pt-3 mb-0">
            <Tab.Container activeKey={activeType} onSelect={handleTypeSelect}>
              <Nav variant="pills" className="global-tabs border-0 mb-3">
                <Nav.Item>
                  <Nav.Link eventKey="POKOK">Simpanan Pokok</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="WAJIB">Simpanan Wajib</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="SUKARELA">Simpanan Sukarela</Nav.Link>
                </Nav.Item>
              </Nav>

              {activeType === "SUKARELA" && (
                <div className="px-2 pb-3">
                  <div className="nav nav-pills sub-tabs gap-2">
                    <button
                      type="button"
                      className={`nav-link ${activeSukarelaCategory === "SETORAN" ? "active" : ""}`}
                      onClick={() => {
                        setActiveSukarelaCategory("SETORAN");
                        setPage(1);
                      }}
                    >
                      Setoran
                    </button>
                    <button
                      type="button"
                      className={`nav-link ${activeSukarelaCategory === "PENCAIRAN" ? "active" : ""}`}
                      onClick={() => {
                        setActiveSukarelaCategory("PENCAIRAN");
                        setPage(1);
                      }}
                    >
                      Pencairan
                    </button>
                  </div>
                </div>
              )}

              <TransactionTable
                transactions={transactions}
                loading={loading}
                formatRupiah={formatRupiah}
                pagination={pagination}
                onPageChange={(p) => setPage(p)}
                onSearchChange={handleSearchFilterChange}
                searchFilters={filters}
                onApprove={handleApprove}
                onView={handleViewDetail}
              />
            </Tab.Container>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Detail Invoice Asli */}
      <TransactionDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        transaction={selectedTx}
        formatRupiah={formatRupiah}
      />

      {/* Modal Approval Pencairan Asli */}
      <WithdrawalApprovalModal
        show={showApprovalModal}
        onHide={() => setShowApprovalModal(false)}
        transaction={selectedTx}
        formatRupiah={formatRupiah}
        onSuccess={() => {
          fetchSummary();
          fetchTransactions();
        }}
      />

      {/* Modal Approval Pembayaran Manual (Setoran) */}
      <ManualPaymentApprovalModal
        show={showManualApprovalModal}
        onHide={() => setShowManualApprovalModal(false)}
        transaction={selectedTx}
        onSuccess={() => {
          fetchSummary();
          fetchTransactions();
        }}
      />
    </div>
  );
};

export default SimpananDashboard;
