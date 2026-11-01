import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Row, Col, Card, Button, Form, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Money,
  ArrowDownLeft,
  ArrowUpRight,
  ArrowClockwise,
  UploadSimple,
  FileXls,
  MagnifyingGlass,
  X,
} from "phosphor-react";
import savingsService from "../../utils/api/USavings";
import { exportToExcel } from "../../utils/helpers/exportToExcel";
import TransactionTable from "../../components/ui/TransactionTable";
import TransactionDetailModal from "../../components/modals/TransactionDetailModal";
import WithdrawalApprovalModal from "../../components/modals/WithdrawalApprovalModal";
import ManualPaymentApprovalModal from "../../components/modals/ManualPaymentApprovalModal";
import GenericImportModal from "../../components/modals/GenericImportModal";
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
  const [limit, setLimit] = useState(10);

  // Filter & Search states with debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });

  const [selectedTx, setSelectedTx] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showManualApprovalModal, setShowManualApprovalModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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
        limit,
        search: debouncedSearch,
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
  }, [activeType, activeSukarelaCategory, page, limit, debouncedSearch]);

  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleTypeSelect = (k) => {
    setActiveType(k);
    setPage(1);
    setSearchTerm("");
    setStatusFilter("");
    if (k !== "SUKARELA") setActiveSukarelaCategory("SETORAN");
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  };

  // Client-side filtering & sorting on the current page's transactions
  const processedTransactions = useMemo(() => {
    let list = [...transactions];

    if (statusFilter) {
      const sf = statusFilter.toLowerCase();
      list = list.filter((t) => {
        const s = (t.status || "").toLowerCase();
        const raw = (t.raw_status || "").toLowerCase();
        if (sf === "selesai") {
          return s === "selesai" || raw === "completed" || raw === "paid" || raw === "approved";
        }
        if (sf === "menunggu verifikasi") {
          return (
            s.includes("verifikasi") ||
            raw === "pending_verification" ||
            Boolean(t.is_manual_payment)
          );
        }
        if (sf === "pending") {
          return s === "pending" || s.includes("menunggu");
        }
        if (sf === "ditolak") {
          return s.includes("tolak") || raw === "rejected" || raw === "failed";
        }
        return s.includes(sf) || raw.includes(sf);
      });
    }

    if (sortConfig.key) {
      list.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "date") {
          valA = new Date(a.date || a.created_at || 0).getTime();
          valB = new Date(b.date || b.created_at || 0).getTime();
        } else if (sortConfig.key === "amount") {
          valA = parseFloat(a.amount) || 0;
          valB = parseFloat(b.amount) || 0;
        } else if (sortConfig.key === "member") {
          valA = (a.member || a.full_name || "").toLowerCase();
          valB = (b.member || b.full_name || "").toLowerCase();
        } else if (sortConfig.key === "status") {
          valA = (a.status || "").toLowerCase();
          valB = (b.status || "").toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [transactions, statusFilter, sortConfig]);

  const handleExportTransactions = async () => {
    setExporting(true);
    try {
      const params = {
        type: activeType,
        tx_category: activeType === "SUKARELA" ? activeSukarelaCategory : "SETORAN",
        page: 1,
        limit: 10000,
        search: debouncedSearch || "",
      };

      const res = await savingsService.getAdminSavingsTransactions(params);
      const dataToProcess =
        res.data?.data?.transactions && res.data.data.transactions.length > 0
          ? res.data.data.transactions
          : transactions;

      if (!dataToProcess || dataToProcess.length === 0) {
        alert("Tidak ada data transaksi simpanan untuk diexport.");
        return;
      }

      const formattedData = dataToProcess.map((tx, idx) => {
        const dateObj = tx.date || tx.created_at ? new Date(tx.date || tx.created_at) : null;
        const dateStr = dateObj
          ? dateObj.toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }) +
            " " +
            dateObj.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
            " WIB"
          : "-";

        const isCompleted =
          tx.status === "Selesai" ||
          tx.status === "COMPLETED" ||
          tx.status === "APPROVED" ||
          tx.raw_status === "COMPLETED";

        return {
          No: idx + 1,
          "Waktu Transaksi": dateStr,
          "No. Anggota": tx.member_no || tx.member_id || "-",
          "Nama Anggota": tx.member || tx.full_name || "-",
          "Jenis Simpanan": tx.product_name || activeType,
          "Tipe Transaksi":
            tx.type || (activeSukarelaCategory === "PENCAIRAN" ? "Pencairan" : "Setoran"),
          Nominal: parseFloat(tx.amount) || 0,
          Status: isCompleted ? "Selesai" : tx.status || "Pending",
        };
      });

      const typeLabel =
        activeType === "SUKARELA" ? `Sukarela_${activeSukarelaCategory}` : activeType;
      const today = new Date().toISOString().split("T")[0];
      exportToExcel(formattedData, `Transaksi_Simpanan_${typeLabel}_${today}`);
    } catch (err) {
      console.error("Gagal export transaksi simpanan:", err);
      alert("Terjadi kesalahan saat mengekspor data simpanan.");
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetail = (tx) => {
    setSelectedTx(tx);
    if (
      tx.type === "Pencairan" ||
      tx.type === "Pencairan Tabungan" ||
      activeSukarelaCategory === "PENCAIRAN"
    ) {
      setShowApprovalModal(true);
    } else {
      setShowDetailModal(true);
    }
  };

  const handleApprove = (tx) => {
    setSelectedTx(tx);
    if (
      tx.is_manual_payment ||
      tx.raw_status === "PENDING_VERIFICATION" ||
      tx.status === "PENDING_VERIFICATION"
    ) {
      setShowManualApprovalModal(true);
    } else {
      setShowApprovalModal(true);
    }
  };

  const isFiltered = Boolean(searchTerm || statusFilter);

  return (
    <div className="pb-5">
      {/* Breadcrumb */}
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

      {/* Header Actions */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Dashboard Simpanan</h4>
          <p className="text-muted small mb-0">
            Pantau dan kelola seluruh transaksi simpanan anggota koperasi secara terstruktur.
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Button
            variant="white"
            size="sm"
            className="border shadow-sm d-flex align-items-center gap-1.5 fw-medium text-muted bg-white px-3"
            onClick={() => {
              fetchSummary();
              fetchTransactions();
            }}
            disabled={loading}
            title="Refresh Data Transaksi"
          >
            <ArrowClockwise size={16} weight="bold" className={loading ? "spin" : ""} />
            <span>{loading ? "Memuat..." : "Refresh"}</span>
          </Button>

          <Button
            variant="outline-success"
            size="sm"
            className="shadow-sm d-flex align-items-center gap-1.5 fw-medium px-3 bg-white"
            onClick={handleExportTransactions}
            disabled={exporting || loading}
            title="Export Data Transaksi Simpanan ke Excel"
          >
            <FileXls size={16} weight="bold" className="text-success" />
            <span>{exporting ? "Mengekspor..." : "Export Excel"}</span>
          </Button>

          <Button
            variant="success"
            size="sm"
            className="shadow-sm d-flex align-items-center gap-1.5 fw-medium text-white px-3"
            onClick={() => setShowImportModal(true)}
            title="Import Data Simpanan Excel"
          >
            <UploadSimple size={16} weight="bold" />
            <span>Import Excel</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCard summary={summary} />

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Navigation Tabs (Pokok, Wajib, Sukarela) */}
        <div className="px-4 pt-3 pb-2 border-bottom bg-white">
          <Tab.Container activeKey={activeType} onSelect={handleTypeSelect}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
              <div className="global-tabs-wrapper mb-0">
                <Nav variant="pills" className="global-tabs border-0 flex-nowrap">
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
              </div>

              {/* Sub-tabs for Sukarela (Setoran vs Pencairan) */}
              {activeType === "SUKARELA" && (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted extra-small fw-bold text-uppercase">Kategori:</span>
                  <div className="d-flex align-items-center gap-1 p-1 bg-light rounded-pill border">
                    <button
                      type="button"
                      className={`btn btn-sm py-1 px-3 rounded-pill border-0 shadow-none d-flex align-items-center gap-1 extra-small fw-bold ${
                        activeSukarelaCategory === "SETORAN"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted"
                      }`}
                      onClick={() => {
                        setActiveSukarelaCategory("SETORAN");
                        setPage(1);
                      }}
                    >
                      <ArrowDownLeft size={13} className="text-success" weight="bold" />
                      Setoran
                    </button>
                    <button
                      type="button"
                      className={`btn btn-sm py-1 px-3 rounded-pill border-0 shadow-none d-flex align-items-center gap-1 extra-small fw-bold ${
                        activeSukarelaCategory === "PENCAIRAN"
                          ? "bg-white text-primary shadow-sm"
                          : "text-muted"
                      }`}
                      onClick={() => {
                        setActiveSukarelaCategory("PENCAIRAN");
                        setPage(1);
                      }}
                    >
                      <ArrowUpRight size={13} className="text-danger" weight="bold" />
                      Pencairan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Tab.Container>
        </div>

        {/* Filter Toolbar */}
        <div className="table-filter-bar px-4 py-3 bg-white border-bottom">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div className="d-flex flex-wrap align-items-center gap-2 flex-grow-1 w-100 w-md-auto">
              {/* Search with MagnifyingGlass and clear button */}
              <div className="position-relative flex-grow-1" style={{ maxWidth: "340px", minWidth: "220px" }}>
                <MagnifyingGlass
                  size={16}
                  className="position-absolute text-muted"
                  style={{ top: "10px", left: "12px" }}
                />
                <Form.Control
                  type="text"
                  placeholder="Cari nama atau no. anggota..."
                  className="rounded-3 shadow-none ps-5 pe-4 py-1.5"
                  style={{ fontSize: "0.85rem" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    className="btn btn-link p-0 position-absolute text-muted text-decoration-none"
                    style={{ top: "8px", right: "10px" }}
                    onClick={() => setSearchTerm("")}
                    title="Hapus pencarian"
                  >
                    <X size={15} weight="bold" />
                  </button>
                )}
              </div>

              {/* Status Filter */}
              <div style={{ minWidth: "165px" }}>
                <Form.Select
                  size="sm"
                  className="rounded-3 shadow-none py-1.5"
                  style={{ fontSize: "0.85rem" }}
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                >
                  <option value="">Semua Status</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                  <option value="Pending">Pending</option>
                  <option value="Ditolak">Ditolak</option>
                </Form.Select>
              </div>

              {/* Reset filter button */}
              {isFiltered && (
                <Button
                  variant="link"
                  size="sm"
                  className="text-danger text-decoration-none d-flex align-items-center gap-1 p-0 ms-1"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("");
                    setPage(1);
                  }}
                  title="Reset Semua Filter"
                >
                  <X size={14} weight="bold" />
                  <span className="extra-small fw-semibold">Reset</span>
                </Button>
              )}
            </div>

            {/* Total Records Counter */}
            <div className="d-flex align-items-center gap-2 text-muted small ms-auto">
              <span className="badge bg-light text-dark border px-3 py-1.5 rounded-pill fw-semibold">
                Total: {pagination?.total_records || transactions.length} Transaksi
              </span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <Card.Body className="p-0">
          <TransactionTable
            transactions={processedTransactions}
            loading={loading}
            formatRupiah={formatRupiah}
            pagination={pagination}
            onPageChange={(p) => setPage(p)}
            onApprove={handleApprove}
            onView={handleViewDetail}
            sortConfig={sortConfig}
            onSort={handleSort}
            pageSize={limit}
            onPageSizeChange={(newSize) => {
              setLimit(newSize);
              setPage(1);
            }}
            onResetFilter={() => {
              setSearchTerm("");
              setStatusFilter("");
              setPage(1);
            }}
          />
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

      {/* Modal Import Data Simpanan */}
      <GenericImportModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onSuccess={() => {
          fetchSummary();
          fetchTransactions();
        }}
        title="Import Data Transaksi Simpanan Anggota"
        templateEndpoint="/savings/template-import"
        importEndpoint="/savings/import"
        templateFileName="Template_Import_Simpanan.xlsx"
        instructionNotes={[
          "Gunakan template resmi yang telah diunduh dari tombol 'Unduh Template' di atas.",
          "Pastikan kolom 'No. Anggota' sesuai dengan nomor anggota yang terdaftar di sistem.",
          "Pilihan Jenis Simpanan: POKOK, WAJIB, atau SUKARELA.",
          "Nominal diisi nominal transaksi tanpa titik/koma (misal: 100000). Baris dengan nominal kosong atau 0 akan otomatis dilewati.",
          "Format Tanggal Transaksi: YYYY-MM-DD (contoh: 2026-10-29).",
        ]}
      />
    </div>
  );
};

export default SimpananDashboard;
