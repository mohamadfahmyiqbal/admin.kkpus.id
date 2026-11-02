/**
 * Shared filtering utility for pinjaman data.
 * Used by both PinjamanList and PinjamanTable to ensure consistent filtering logic.
 */

/**
 * Format a number as Indonesian Rupiah currency string
 */
export const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

/**
 * Check if a numeric filter matches a value.
 * Mendukung format Indonesia: "1.000.000", "1,5", dan angka biasa.
 * Filter yang tidak mengandung digit dianggap kosong.
 */
export const checkNumeric = (filterVal, numVal) => {
  if (filterVal === null || filterVal === undefined) return true;

  const raw = String(filterVal).trim().toLowerCase();
  if (!raw) return true;

  const clean = raw.replace(/[^\d.,-]/g, "");
  const digits = raw.replace(/\D/g, "");
  if (!digits) return true;

  let normalized = clean;
  if (clean.includes(",")) {
    // "1.000.000,50" -> "1000000.50"
    normalized = clean.replace(/\./g, "").replace(",", ".");
  } else if (/^-?\d{1,3}(\.\d{3})+$/.test(clean)) {
    // "1.000.000" -> "1000000"
    normalized = clean.replace(/\./g, "");
  }

  const numericFilter = Number(normalized);
  const numericValue = Number(numVal);
  const formatted = formatCurrency(numVal).toLowerCase();

  return (
    (Number.isFinite(numericFilter) &&
      Number.isFinite(numericValue) &&
      numericFilter === numericValue) ||
    String(numVal ?? "").includes(digits) ||
    formatted.includes(raw)
  );
};

/**
 * Calculate remaining debt/piutang from a transaction item
 * @param {object} item - Transaction item with amount_requested, margin_amount, down_payment, paid_amount
 * @returns {number} - Remaining debt amount
 */
export const calculateRemainingDebt = (item) => {
  const totalRequired =
    Number(item.amount_requested || 0) +
    Number(item.margin_amount || 0) -
    Number(item.down_payment || 0);
  return Math.max(0, totalRequired - Number(item.paid_amount || 0));
};

/**
 * Determine cicilan status (Lunas/Belum Lunas) for a transaction item
 * @param {object} item - Transaction item
 * @returns {string} - "Lunas" or "Belum Lunas"
 */
export const getCicilanStatus = (item) => {
  const totalRequired =
    Number(item.amount_requested || 0) +
    Number(item.margin_amount || 0) -
    Number(item.down_payment || 0);
  return Number(item.paid_amount || 0) >= totalRequired && totalRequired > 0
    ? "Lunas"
    : "Belum Lunas";
};

/**
 * Main filter function for pinjaman transactions.
 * Contains the complete filtering logic that was previously duplicated
 * in PinjamanList.jsx and PinjamanTable.jsx.
 *
 * @param {Array} transactions - List of transaction items
 * @param {object} filters - Filter state object
 * @param {Function} formatCurrency - Currency formatting function
 * @returns {Array} - Filtered transactions
 */
export const filterPinjamanTransactions = (
  transactions,
  filters,
  formatCurrency
) => {
  if (!transactions || transactions.length === 0) return [];

  return transactions.filter((item) => {
    const totalRequired =
      Number(item.amount_requested || 0) +
      Number(item.margin_amount || 0) -
      Number(item.down_payment || 0);
    const remainingDebt = Math.max(0, totalRequired - Number(item.paid_amount || 0));
    const isPaidOff = Number(item.paid_amount || 0) >= totalRequired && totalRequired > 0 ? "Lunas" : "Belum Lunas";

    const memberName = (item.member_name || "").toLowerCase();
    const financingId = (item.financing_id || "").toLowerCase();
    const memberQuery = (filters.anggota || "").toLowerCase().trim();

    // Filter by member/anggota
    if (
      memberQuery &&
      !memberName.includes(memberQuery) &&
      !financingId.includes(memberQuery)
    ) {
      return false;
    }

    // Filter by jenis pinjaman
    const jenis = (item.category || item.purpose || "Pinjaman Lunak").toLowerCase();
    if (
      filters.jenis_pinjaman &&
      !jenis.includes(filters.jenis_pinjaman.toLowerCase().trim())
    ) {
      return false;
    }

    // Filter by jumlah pinjaman (numeric)
    if (!checkNumeric(filters.jumlah_pinjaman, item.amount_requested)) {
      return false;
    }

    // Filter by tenor
    const tenorVal = String(
      item.cooperation_months || item.tenure || item.tenor_months || "-"
    );
    if (
      filters.tenor &&
      !tenorVal.toLowerCase().includes(filters.tenor.toLowerCase().trim())
    ) {
      return false;
    }

    // Filter by cicilan (monthly installment)
    const cicilanVal =
      item.monthly_installment || item.installment_amount || 0;
    if (!checkNumeric(filters.cicilan, cicilanVal)) {
      return false;
    }

    // Filter by piutang (remaining debt)
    if (!checkNumeric(filters.piutang, remainingDebt)) {
      return false;
    }

    // Filter by status cicilan
    if (
      filters.status_cicilan &&
      isPaidOff.toLowerCase() !== filters.status_cicilan.toLowerCase()
    ) {
      return false;
    }

    // Filter by status approval
    if (
      filters.status_approval &&
      (item.status || "").toUpperCase() !== filters.status_approval.toUpperCase()
    ) {
      return false;
    }

    return true;
  });
};

export default {
  filterPinjamanTransactions,
  formatCurrency,
  checkNumeric,
  calculateRemainingDebt,
  getCicilanStatus,
};