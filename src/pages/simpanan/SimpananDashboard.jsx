import React from "react";
import { Card, Breadcrumb, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowClockwise, FileXls, UploadSimple } from "phosphor-react";
import { formatRupiah, jwtEncode } from "../../utils/helpers";
import { useSimpananDashboard } from "./useSimpananDashboard";
import SimpananSummaryCards from "./components/SimpananSummaryCards";
import SimpananTabsHeader from "./components/SimpananTabsHeader";
import MemberSavingsTable from "./components/MemberSavingsTable";
import TransactionTable from "../../components/ui/TransactionTable";
import MemberSavingsDetailModal from "./components/MemberSavingsDetailModal";

const TransactionDetailModal = React.lazy(() =>
  import("../../components/modals/TransactionDetailModal")
);
const WithdrawalApprovalModal = React.lazy(() =>
  import("../../components/modals/WithdrawalApprovalModal")
);
const ManualPaymentApprovalModal = React.lazy(() =>
  import("../../components/modals/ManualPaymentApprovalModal")
);
const GenericImportModal = React.lazy(() =>
  import("../../components/modals/GenericImportModal")
);

const SimpananDashboard = () => {
  const navigate = useNavigate();
  const {
    activeType,
    activeSukarelaCategory,
    summary,
    transactions,
    members,
    pagination,
    membersPagination,
    page,
    limit,
    memberPage,
    memberLimit,
    columnFilters,
    searchTerm,
    debouncedSearch,
    statusFilter,
    sortConfig,
    memberColumnFilters,
    debouncedMemberColumnFilters,
    memberSortConfig,
    selectedTx,
    showDetailModal,
    showApprovalModal,
    showManualApprovalModal,
    showImportModal,
    selectedMember,
    showMemberModal,
    loading,
    membersLoading,
    exporting,
    tabsWrapperRef,
    debouncedFilters,
    processedTransactions,
    isFiltered,
    fetchSummary,
    fetchTransactions,
    fetchMemberAggregates,
    setActiveSukarelaCategory,
    setPage,
    setMemberPage,
    setLimit,
    setMemberLimit,
    setSelectedMember,
    setSelectedTx,
    handleTypeSelect,
    handleSort,
    handleMemberColumnFilterChange,
    handleResetMemberColumnFilters,
    handleSearchChange,
    handleResetFilters,
    handleExportMembers,
    handleExportTransactions,
    handleViewDetail,
    handleApprove,
    setShowDetailModal,
    setShowApprovalModal,
    setShowManualApprovalModal,
    setShowImportModal,
    setShowMemberModal,
  } = useSimpananDashboard();

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
              if (activeType === "POKOK" || activeType === "WAJIB") {
                fetchMemberAggregates();
              } else {
                fetchTransactions();
              }
            }}
            disabled={loading || membersLoading}
            title="Refresh Data Simpanan"
          >
            <ArrowClockwise size={16} weight="bold" className={loading || membersLoading ? "spin" : ""} />
            <span>{loading || membersLoading ? "Memuat..." : "Refresh"}</span>
          </Button>

          <Button
            variant="outline-success"
            size="sm"
            className="shadow-sm d-flex align-items-center gap-1.5 fw-medium px-3 bg-white"
            onClick={activeType === "POKOK" || activeType === "WAJIB" ? handleExportMembers : handleExportTransactions}
            disabled={exporting || loading || membersLoading}
            title="Export Data Simpanan ke Excel"
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
      <SimpananSummaryCards summary={summary} />

      {/* Main Table Card */}
      <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
        {/* Navigation Tabs Header */}
        <SimpananTabsHeader
          activeType={activeType}
          onTypeSelect={handleTypeSelect}
          activeSukarelaCategory={activeSukarelaCategory}
          onSukarelaCategoryChange={(cat) => {
            setActiveSukarelaCategory(cat);
            setPage(1);
          }}
          totalRecords={
            activeType === "POKOK" || activeType === "WAJIB"
              ? membersPagination?.total_records || members.length
              : pagination?.total_records || transactions.length
          }
        />

        {/* Table Body */}
        <Card.Body className="p-0">
          {activeType === "POKOK" || activeType === "WAJIB" ? (
            <MemberSavingsTable
              members={members}
              loading={membersLoading}
              formatRupiah={formatRupiah}
              pagination={membersPagination}
              onPageChange={(p) => setMemberPage(p)}
              pageSize={memberLimit}
              onPageSizeChange={(newSize) => {
                setMemberLimit(newSize);
                setMemberPage(1);
              }}
              onViewDetail={(member) => {
                setSelectedMember(member);
                setShowMemberModal(true);
              }}
              sortConfig={memberSortConfig}
              onSort={handleSort}
              columnFilters={memberColumnFilters}
              onColumnFilterChange={handleMemberColumnFilterChange}
              onResetFilters={handleResetMemberColumnFilters}
            />
          ) : (
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
              showSearchRow={true}
              searchFilters={columnFilters}
              onSearchChange={handleSearchChange}
              onResetFilter={handleResetFilters}
            />
          )}
        </Card.Body>
      </Card>

      {/* Detail Modal Simpanan Anggota */}
      {showMemberModal && (
        <MemberSavingsDetailModal
          show={showMemberModal}
          onHide={() => setShowMemberModal(false)}
          member={selectedMember}
          savingsType={activeType}
          formatRupiah={formatRupiah}
          onViewInvoice={(tx, mem) => {
            setSelectedTx({
              ...tx,
              member: mem.full_name,
              member_no: mem.member_no,
              amount: tx.amount,
              created_at: tx.date,
              status: tx.status,
            });
            setShowDetailModal(true);
          }}
        />
      )}

      {/* Lazy Loaded Modals with React.Suspense */}
      <React.Suspense fallback={null}>
        {showDetailModal && (
          <TransactionDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            transaction={selectedTx}
            formatRupiah={formatRupiah}
          />
        )}

        {showApprovalModal && (
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
        )}

        {showManualApprovalModal && (
          <ManualPaymentApprovalModal
            show={showManualApprovalModal}
            onHide={() => setShowManualApprovalModal(false)}
            transaction={selectedTx}
            onSuccess={() => {
              fetchSummary();
              fetchTransactions();
            }}
          />
        )}

        {showImportModal && (
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
        )}
      </React.Suspense>
    </div>
  );
};

export default SimpananDashboard;
