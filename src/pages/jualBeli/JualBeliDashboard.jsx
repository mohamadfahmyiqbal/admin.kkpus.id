import React, { useState, useEffect, useMemo } from "react";
import { Card, Tab, Nav, Spinner, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlass } from "phosphor-react";
import * as XLSX from "xlsx";
import jualBeliService from "../../utils/api/UJualBeli";
import JualBeliApprovalModal from "../../components/modals/JualBeliApprovalModal";
import JualBeliSetoranModal from "../../components/modals/JualBeliSetoranModal";
import { jwtEncode } from "../../utils/helpers";
import Swal from "sweetalert2";

import JualBeliHeader from "./components/JualBeliHeader";
import JualBeliSummaryCards from "./components/JualBeliSummaryCards";
import JualBeliTable from "./components/JualBeliTable";
import ImportExcelModal from "./components/ImportExcelModal";

const JualBeliDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [showApproval, setShowApproval] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showSetoran, setShowSetoran] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await jualBeliService.getFinancingHistory({
        type: "jualbeli",
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

  const formatRp = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const handleExport = () => {
    try {
      const exportData = transactions.map((item, idx) => {
        const total =
          Number(item.item_price || item.amount_requested || 0) +
          Number(item.operational_cost || 0) +
          Number(item.margin_amount || 0);
        return {
          No: idx + 1,
          Anggota:
            item.nama_nasabah || item.member_name || item.user_id || "-",
          Type: item.category || "-",
          "Nama Barang": item.item_name || "-",
          "Total Jual Beli": total,
          DP: Number(item.down_payment || 0),
          "Tenor (Bulan)": item.cooperation_months,
          "Cicilan/Bulan": Number(item.monthly_installment || 0),
          Status: item.status,
        };
      });
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Data Jual Beli");
      XLSX.writeFile(wb, "Laporan_Jual_Beli.xlsx");
    } catch (err) {
      console.error("Failed to export data", err);
    }
  };

  const summary = useMemo(() => {
    let pembiayaanAktif = 0;
    let labaBerjalan = 0;
    let dpDiterima = 0;
    let pendingCount = 0;

    transactions.forEach((tx) => {
      if (tx.status === "PENDING") pendingCount++;
      if (
        tx.status === "APPROVED" ||
        tx.status === "ACTIVE" ||
        tx.status === "COMPLETED" ||
        tx.status === "PAID" ||
        tx.status === "LUNAS"
      ) {
        const totalReq =
          Number(tx.item_price || tx.amount_requested || 0) +
          Number(tx.operational_cost || 0);
        pembiayaanAktif += totalReq - Number(tx.down_payment || 0);
        labaBerjalan += Number(tx.margin_amount || 0);
        dpDiterima += Number(tx.down_payment || 0);
      }
    });

    return { pembiayaanAktif, labaBerjalan, dpDiterima, pendingCount };
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    if (!searchTerm) return transactions;
    const term = searchTerm.toLowerCase();
    return transactions.filter(
      (tx) =>
        (tx.nama_nasabah || tx.member_name || tx.user_id || "")
          .toString()
          .toLowerCase()
          .includes(term) ||
        (tx.item_name || "").toLowerCase().includes(term)
    );
  }, [transactions, searchTerm]);

  const handleViewDetail = (tx) => {
    setSelectedTx(tx);
    setShowDetail(true);
  };

  const handleViewSetoran = (tx) => {
    setSelectedTx(tx);
    setShowSetoran(true);
  };

  const handleApprove = (tx) => {
    setSelectedTx(tx);
    setShowApproval(true);
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (pageIds) => {
    setSelectedIds((prev) => {
      const allSelected = pageIds.every((id) => prev.includes(id));
      if (allSelected) {
        return prev.filter((id) => !pageIds.includes(id));
      } else {
        return [...new Set([...prev, ...pageIds])];
      }
    });
  };

  const handleDeleteSingle = async (tx) => {
    const id = tx.id || tx.financing_id;
    const name = tx.item_name || tx.purpose || "transaksi ini";
    const confirm = await Swal.fire({
      title: "Hapus Transaksi?",
      text: `Apakah Anda yakin ingin menghapus data ${name}? Semua riwayat cicilan terkait juga akan terhapus.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await jualBeliService.deleteJualBeli(id);
        if (res.data?.success) {
          Swal.fire("Berhasil", "Data transaksi berhasil dihapus.", "success");
          setSelectedIds((prev) => prev.filter((item) => item !== id));
          fetchTransactions();
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal menghapus transaksi", "error");
      }
    }
  };

  const handleDeleteBatch = async () => {
    if (selectedIds.length === 0) return;

    const confirm = await Swal.fire({
      title: "Hapus Data Terpilih?",
      text: `Apakah Anda yakin ingin menghapus ${selectedIds.length} data transaksi yang dipilih? Data yang sudah dihapus tidak dapat dikembalikan.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Ya, Hapus ${selectedIds.length} Data!`,
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await jualBeliService.deleteBatchJualBeli(selectedIds);
        if (res.data?.success) {
          Swal.fire("Berhasil", res.data.message || "Data transaksi berhasil dihapus.", "success");
          setSelectedIds([]);
          fetchTransactions();
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal menghapus data transaksi", "error");
      }
    }
  };

  return (
    <div className="simpanan-dashboard py-4 px-3 px-md-4">
      {/* Breadcrumb */}
      <div className="mb-2 animate-fade-in">
        <Breadcrumb className="mb-0" style={{ fontSize: "12px" }}>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "dashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() =>
              navigate(`/${jwtEncode({ page: "jualBeliDashboard" })}`)
            }
            style={{ cursor: "pointer" }}
          >
            Jual Beli
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Dashboard</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Header Dashboard & Tombol Aksi */}
      <JualBeliHeader
        loading={loading}
        onRefresh={fetchTransactions}
        onExport={handleExport}
        onOpenImport={() => setShowImport(true)}
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteBatch}
      />

      {loading ? (
        <div className="bg-white rounded p-4 shadow-sm border border-light mt-3 text-center py-5">
          <Spinner animation="border" variant="primary" />
          <div className="mt-2 text-muted">Memuat data...</div>
        </div>
      ) : (
        <div className="animate-fade-in">
          {/* Ringkasan Kartu Statistik */}
          <JualBeliSummaryCards summary={summary} formatRp={formatRp} />

          {/* Daftar Tab Transaksi & Approval */}
          <Card
            className="border-0 shadow-sm rounded-4"
            style={{ overflow: "hidden", minWidth: 0 }}
          >
            <Card.Body className="p-0">
              <Tab.Container defaultActiveKey="transaksi">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center px-4 pt-3 mb-3 border-bottom pb-2">
                  <Nav
                    variant="pills"
                    className="global-tabs border-0 flex-nowrap mb-3 mb-md-0"
                  >
                    <Nav.Item>
                      <Nav.Link eventKey="transaksi">Daftar Transaksi</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="approval">
                        Approval Pengajuan
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                  <div
                    className="search-box position-relative"
                    style={{ maxWidth: "300px", width: "100%" }}
                  >
                    <MagnifyingGlass
                      size={18}
                      className="position-absolute top-50 translate-middle-y text-muted"
                      style={{ left: "12px" }}
                    />
                    <input
                      type="text"
                      className="form-control ps-5 py-2 rounded-pill bg-light border-0"
                      placeholder="Cari anggota atau barang..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <Tab.Content>
                  <Tab.Pane eventKey="transaksi">
                    <JualBeliTable
                      list={filteredTransactions.filter(
                        (t) => t.status !== "PENDING"
                      )}
                      isApprovalTab={false}
                      formatRp={formatRp}
                      onViewDetail={handleViewDetail}
                      onViewSetoran={handleViewSetoran}
                      onApprove={handleApprove}
                      onDelete={handleDeleteSingle}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onToggleSelectAll={handleToggleSelectAll}
                    />
                  </Tab.Pane>
                  <Tab.Pane eventKey="approval">
                    <JualBeliTable
                      list={filteredTransactions.filter(
                        (t) => t.status === "PENDING"
                      )}
                      isApprovalTab={true}
                      formatRp={formatRp}
                      onViewDetail={handleViewDetail}
                      onViewSetoran={handleViewSetoran}
                      onApprove={handleApprove}
                      onDelete={handleDeleteSingle}
                      selectedIds={selectedIds}
                      onToggleSelect={handleToggleSelect}
                      onToggleSelectAll={handleToggleSelectAll}
                    />
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Modals */}
      <JualBeliApprovalModal
        show={showApproval}
        onHide={() => {
          setShowApproval(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        formatRp={formatRp}
      />
      <JualBeliApprovalModal
        show={showDetail}
        onHide={() => {
          setShowDetail(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        formatRp={formatRp}
        viewOnly={true}
      />
      <JualBeliSetoranModal
        show={showSetoran}
        onHide={() => {
          setShowSetoran(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
        formatRp={formatRp}
      />
      <ImportExcelModal
        show={showImport}
        onHide={() => setShowImport(false)}
        onSuccess={() => fetchTransactions()}
      />
    </div>
  );
};

export default JualBeliDashboard;
