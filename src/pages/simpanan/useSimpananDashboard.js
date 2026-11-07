import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import savingsService from "../../utils/api/USavings";
import { exportToExcel } from "../../utils/helpers/exportToExcel";
import { formatRupiah, jwtEncode } from "../../utils/helpers";

export function useSimpananDashboard() {
  const navigate = useNavigate();

  // --- Tab State ---
  const [activeType, setActiveType] = useState("POKOK");
  const [activeSukarelaCategory, setActiveSukarelaCategory] = useState("SETORAN");

  // --- Data State ---
  const [summary, setSummary] = useState({
    total_semua: 0,
    total_pokok: 0,
    total_wajib: 0,
    total_sukarela: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [membersPagination, setMembersPagination] = useState(null);

  // --- Pagination Controls ---
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [memberPage, setMemberPage] = useState(1);
  const [memberLimit, setMemberLimit] = useState(10);

  // --- Filter State ---
  const [columnFilters, setColumnFilters] = useState({
    date: "",
    member: "",
    type: "",
    amount: "",
    status: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "date", direction: "desc" });
  const [debouncedFilters, setDebouncedFilters] = useState({
    date: "",
    amount: "",
  });

  const [memberColumnFilters, setMemberColumnFilters] = useState({
    member_no: "",
    full_name: "",
    total_amount: "",
    paid_amount: "",
    unpaid_amount: "",
  });
  const [debouncedMemberColumnFilters, setDebouncedMemberColumnFilters] = useState({
    member_no: "",
    full_name: "",
    total_amount: "",
    paid_amount: "",
    unpaid_amount: "",
  });
  const [memberSortConfig, setMemberSortConfig] = useState({ key: "full_name", direction: "asc" });

  // --- Modal State ---
  const [selectedTx, setSelectedTx] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showManualApprovalModal, setShowManualApprovalModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // --- Loading State ---
  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  // --- Refs ---
  const tabsWrapperRef = useRef(null);

  // --- Debounce for transaction search ---
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmedMember = searchTerm.trim();
      if (trimmedMember.length === 0 || trimmedMember.length >= 2) {
        setDebouncedSearch(trimmedMember);
      }
      setDebouncedFilters({
        date: (columnFilters.date || "").trim(),
        amount: (columnFilters.amount || "").trim(),
      });
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, columnFilters.date, columnFilters.amount]);

  // --- Debounce for member column filters ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedMemberColumnFilters({
        member_no: (memberColumnFilters.member_no || "").trim(),
        full_name: (memberColumnFilters.full_name || "").trim(),
        total_amount: (memberColumnFilters.total_amount || "").trim(),
        paid_amount: (memberColumnFilters.paid_amount || "").trim(),
        unpaid_amount: (memberColumnFilters.unpaid_amount || "").trim(),
      });
      setMemberPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [memberColumnFilters]);

  // --- Fetch Summary ---
  const fetchSummary = useCallback(async () => {
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
      toast.error("Gagal mengambil ringkasan saldo simpanan");
    }
  }, []);

  // --- Fetch Transactions ---
  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        type: activeType,
        tx_category: activeType === "SUKARELA" ? activeSukarelaCategory : "SETORAN",
        page,
        limit,
        search: debouncedSearch,
        status: statusFilter || undefined,
        date: debouncedFilters.date || undefined,
        amount: debouncedFilters.amount || undefined,
      };
      const res = await savingsService.getAdminSavingsTransactions(params);
      if (res.data?.status) {
        setTransactions(res.data.data.transactions || []);
        setPagination(res.data.data.pagination);
      }
    } catch (err) {
      console.error("Gagal mengambil transaksi simpanan:", err);
      toast.error("Gagal mengambil daftar transaksi simpanan");
    } finally {
      setLoading(false);
    }
  }, [activeType, activeSukarelaCategory, page, limit, debouncedSearch, statusFilter, debouncedFilters]);

  // --- Fetch Member Aggregates ---
  const fetchMemberAggregates = useCallback(async () => {
    if (activeType !== "POKOK" && activeType !== "WAJIB") return;
    setMembersLoading(true);
    try {
      const generalSearch =
        debouncedMemberColumnFilters.full_name ||
        debouncedMemberColumnFilters.member_no ||
        "";
      const params = {
        type: activeType,
        page: memberPage,
        limit: memberLimit,
        search: generalSearch,
        sortBy: memberSortConfig.key,
        sortDir: memberSortConfig.direction,
      };
      const res = await savingsService.getAdminSavingsMemberAggregates(params);
      if (res.data?.status) {
        const data = res.data.data;
        let memberRows = data.members || [];

        // Apply in-memory column filters
        if (debouncedMemberColumnFilters.member_no) {
          const q = debouncedMemberColumnFilters.member_no.toLowerCase();
          memberRows = memberRows.filter((m) => (m.member_no || "").toLowerCase().includes(q));
        }
        if (debouncedMemberColumnFilters.full_name) {
          const q = debouncedMemberColumnFilters.full_name.toLowerCase();
          memberRows = memberRows.filter((m) => (m.full_name || "").toLowerCase().includes(q));
        }
        if (debouncedMemberColumnFilters.total_amount) {
          const cleanQ = debouncedMemberColumnFilters.total_amount.replace(/[^0-9]/g, "");
          if (cleanQ) {
            memberRows = memberRows.filter((m) => String(m.total_amount || "").includes(cleanQ));
          }
        }
        if (debouncedMemberColumnFilters.paid_amount) {
          const cleanQ = debouncedMemberColumnFilters.paid_amount.replace(/[^0-9]/g, "");
          if (cleanQ) {
            memberRows = memberRows.filter((m) => String(m.paid_amount || "").includes(cleanQ));
          }
        }
        if (debouncedMemberColumnFilters.unpaid_amount) {
          const cleanQ = debouncedMemberColumnFilters.unpaid_amount.replace(/[^0-9]/g, "");
          if (cleanQ) {
            memberRows = memberRows.filter((m) => String(m.unpaid_amount || "").includes(cleanQ));
          }
        }

        setMembers(memberRows);
        setMembersPagination(data.pagination || null);
      }
    } catch (err) {
      console.error("Gagal mengambil agregat simpanan anggota:", err);
      toast.error("Gagal mengambil data simpanan anggota");
    } finally {
      setMembersLoading(false);
    }
  }, [activeType, memberPage, memberLimit, debouncedMemberColumnFilters, memberSortConfig]);

  // --- Effects: Initial fetch & active-type switching ---
  useEffect(() => {
    fetchSummary();
  }, []);

  useEffect(() => {
    if (activeType === "POKOK" || activeType === "WAJIB") {
      fetchMemberAggregates();
    } else {
      fetchTransactions();
    }
  }, [activeType, fetchMemberAggregates, fetchTransactions]);

  // --- Handle Type Select ---
  const handleTypeSelect = useCallback((k) => {
    setActiveType(k);
    setPage(1);
    setMemberPage(1);
    // Reset filters
    setColumnFilters({
      date: "",
      member: "",
      type: "",
      amount: "",
      status: "",
    });
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setMemberColumnFilters({
      member_no: "",
      full_name: "",
      total_amount: "",
      paid_amount: "",
      unpaid_amount: "",
    });
    setDebouncedMemberColumnFilters({
      member_no: "",
      full_name: "",
      total_amount: "",
      paid_amount: "",
      unpaid_amount: "",
    });
    if (k !== "SUKARELA") setActiveSukarelaCategory("SETORAN");
  }, []);

  // --- Handle Sort ---
  const handleSort = useCallback((key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
    setMemberSortConfig((prev) => {
      if (prev.key === key) {
        return {
          key,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { key, direction: "asc" };
    });
  }, []);

  // --- Search Change ---
  const handleSearchChange = useCallback((field, value) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "member") {
      setSearchTerm(value);
    }
    setPage(1);
  }, []);

  // --- Reset Filters ---
  const handleResetFilters = useCallback(() => {
    setColumnFilters({
      date: "",
      member: "",
      type: "",
      amount: "",
      status: "",
    });
    setSearchTerm("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPage(1);
  }, []);

  // --- Reset Member Filters ---
  const handleResetMemberColumnFilters = useCallback(() => {
    setMemberColumnFilters({
      member_no: "",
      full_name: "",
      total_amount: "",
      paid_amount: "",
      unpaid_amount: "",
    });
    setMemberPage(1);
  }, []);

  // --- Member Column Filter Change ---
  const handleMemberColumnFilterChange = useCallback((field, val) => {
    setMemberColumnFilters((prev) => ({ ...prev, [field]: val }));
    setMemberPage(1);
  }, []);

  // --- Export Members ---
  const handleExportMembers = useCallback(async () => {
    if (activeType !== "POKOK" && activeType !== "WAJIB") return;
    setExporting(true);
    try {
      const membersToExport = activeType === "POKOK" ? [...members] : [...members];
      const formattedData = membersToExport.map((m, idx) => ({
        No: idx + 1,
        "No. Anggota": m.member_no || "-",
        "Nama Anggota": m.full_name || "-",
        "Total Transaksi": m.total_count ?? 0,
        "Total Nominal": parseFloat(m.total_amount) || 0,
        "Total Terbayar": parseFloat(m.paid_amount) || 0,
        "Transaksi Terbayar": m.paid_count ?? 0,
        "Total Belum Terbayar": parseFloat(m.unpaid_amount) || 0,
        "Transaksi Belum Terbayar": m.unpaid_count ?? 0,
      }));

      const today = new Date().toISOString().split("T")[0];
      exportToExcel(formattedData, `Anggota_Simpanan_${activeType}_${today}`);
    } catch (err) {
      console.error("Gagal export anggota simpanan:", err);
      toast.error("Terjadi kesalahan saat mengekspor anggota simpanan.");
    } finally {
      setExporting(false);
    }
  }, [activeType, members, exportToExcel]);

  // --- Export Transactions ---
  const handleExportTransactions = useCallback(async () => {
    if (activeType === "POKOK" || activeType === "WAJIB") return;
    setExporting(true);
    try {
      const params = {
        type: activeType,
        tx_category: activeType === "SUKARELA" ? activeSukarelaCategory : "SETORAN",
        page: 1,
        limit: 10000,
        search: debouncedSearch || "",
        status: statusFilter || undefined,
        date: debouncedFilters.date || undefined,
        amount: debouncedFilters.amount || undefined,
      };

      const res = await savingsService.getAdminSavingsTransactions(params);
      const dataToProcess = res.data?.data?.transactions || [];

      if (!dataToProcess || dataToProcess.length === 0) {
        toast.info("Tidak ada data transaksi simpanan untuk diexport.");
        return;
      }

      const formattedData = dataToProcess.map((tx, idx) => {
        const dateObj = tx.date || tx.created_at ? new Date(tx.date || tx.created_at) : null;
        const dateStr = dateObj
          ? dateObj
              .toLocaleDateString("id-ID", {
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
      toast.error("Terjadi kesalahan saat mengekspor data simpanan.");
    } finally {
      setExporting(false);
    }
  }, [
    activeType,
    activeSukarelaCategory,
    debouncedSearch,
    statusFilter,
    debouncedFilters,
    exportToExcel,
  ]);

  // --- View Detail ---
  const handleViewDetail = useCallback((tx) => {
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
  }, [activeSukarelaCategory]);

  // --- Approve ---
  const handleApprove = useCallback((tx) => {
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
  }, []);

  // --- Derived / Computed State ---
  const processedTransactions = useMemo(() => {
    let list = [...transactions];

    if (columnFilters.type) {
      const q = columnFilters.type.toLowerCase();
      list = list.filter((t) => {
        const p = (t.product_name || t.type || "").toLowerCase();
        return p.includes(q);
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
  }, [transactions, columnFilters.type, sortConfig]);

  const isFiltered = Boolean(searchTerm || statusFilter);

  // --- Return all state and handlers ---
  return {
    // --- State ---
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

    // --- Derived State ---
    processedTransactions,
    isFiltered,

    // --- Handlers ---
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

    // --- Callbacks for children ---
    setShowDetailModal,
    setShowApprovalModal,
    setShowManualApprovalModal,
    setShowImportModal,
    setShowMemberModal,
  };
}