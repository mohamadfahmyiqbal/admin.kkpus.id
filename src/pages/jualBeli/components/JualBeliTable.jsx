import React, { useState, useMemo } from "react";
import { Table, Badge, Form, Pagination, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Eye, Coins, CheckCircle, X, ArrowsDownUp, CaretUp, CaretDown, ArrowsClockwise, Trash } from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";

const JualBeliTable = ({
  list = [],
  isApprovalTab = false,
  formatRp,
  onViewDetail,
  onViewSetoran,
  onApprove,
  onDelete,
  selectedIds = [],
  onToggleSelect,
  onToggleSelectAll,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [colFilters, setColFilters] = useState({
    anggota: "",
    type: "",
    namaBarang: "",
    totalJualBeli: "",
    dp: "",
    tenor: "",
    sisaTenor: "",
    cicilan: "",
    piutang: "",
    diskon: "",
    sisaCicilan: "",
    status: "",
  });

  const handleFilterChange = (field, value) => {
    setColFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setColFilters({
      anggota: "",
      type: "",
      namaBarang: "",
      totalJualBeli: "",
      dp: "",
      tenor: "",
      sisaTenor: "",
      cicilan: "",
      piutang: "",
      diskon: "",
      sisaCicilan: "",
      status: "",
    });
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowsDownUp size={13} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={13} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={13} className="text-primary ms-1" weight="bold" />
    );
  };

  const hasAnyFilter = Object.values(colFilters).some((v) => Boolean(v));

  // 1. Filter data per kolom
  const filteredList = useMemo(() => {
    return list.filter((tx) => {
      const isCompleted =
        tx.status === "LUNAS" ||
        tx.status === "COMPLETED" ||
        tx.status === "PAID";
      const totalReq =
        Number(tx.item_price || tx.amount_requested || 0) +
        Number(tx.operational_cost || 0);
      const margin = Number(tx.margin_amount || 0);
      const dp = Number(tx.down_payment || 0);
      const totalJualBeli = totalReq + margin;
      const piutang = totalJualBeli - dp;
      const paidAmount = Number(tx.paid_amount || 0);
      const installment = Number(tx.monthly_installment || 1);
      let discount = Number(tx.discount || 0);
      let sisaCicilan = totalJualBeli - paidAmount - discount;

      if (isCompleted && sisaCicilan > 0) {
        discount += sisaCicilan;
        sisaCicilan = 0;
      }

      const sisaTenor =
        tx.sisa_tenor === undefined
          ? Math.max(
              0,
              tx.cooperation_months -
                Math.floor(Math.max(0, paidAmount - dp) / installment)
            )
          : tx.sisa_tenor;

      const anggotaStr = (
        tx.nama_nasabah ||
        tx.member_name ||
        tx.user_id ||
        ""
      ).toLowerCase();
      const typeStr = (tx.category || "").toLowerCase();
      const barangStr = (tx.item_name || tx.purpose || "").toLowerCase();
      const statusStr = (tx.status || "").toLowerCase();

      // Check text filters
      if (
        colFilters.anggota &&
        !anggotaStr.includes(colFilters.anggota.toLowerCase().trim())
      ) {
        return false;
      }
      if (
        colFilters.type &&
        !typeStr.includes(colFilters.type.toLowerCase().trim())
      ) {
        return false;
      }
      if (
        colFilters.namaBarang &&
        !barangStr.includes(colFilters.namaBarang.toLowerCase().trim())
      ) {
        return false;
      }
      if (
        colFilters.status &&
        !statusStr.includes(colFilters.status.toLowerCase().trim())
      ) {
        return false;
      }

      // Check numeric/string values for remaining columns
      if (
        colFilters.totalJualBeli &&
        !String(totalJualBeli).includes(colFilters.totalJualBeli.replace(/\D/g, ""))
      ) {
        return false;
      }
      if (
        colFilters.dp &&
        !String(dp).includes(colFilters.dp.replace(/\D/g, ""))
      ) {
        return false;
      }
      if (
        colFilters.tenor &&
        !String(tx.cooperation_months || "").includes(colFilters.tenor.trim())
      ) {
        return false;
      }
      if (
        colFilters.sisaTenor &&
        !String(sisaTenor).includes(colFilters.sisaTenor.trim())
      ) {
        return false;
      }
      if (
        colFilters.cicilan &&
        !String(installment).includes(colFilters.cicilan.replace(/\D/g, ""))
      ) {
        return false;
      }
      if (
        colFilters.piutang &&
        !String(piutang).includes(colFilters.piutang.replace(/\D/g, ""))
      ) {
        return false;
      }
      if (
        colFilters.diskon &&
        !String(discount).includes(colFilters.diskon.replace(/\D/g, ""))
      ) {
        return false;
      }
      if (
        colFilters.sisaCicilan &&
        !String(sisaCicilan).includes(colFilters.sisaCicilan.replace(/\D/g, ""))
      ) {
        return false;
      }

      return true;
    });
  }, [list, colFilters]);

  // 2. Sort data
  const sortedList = useMemo(() => {
    if (!sortConfig.key) return filteredList;
    return [...filteredList].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "anggota") {
        aVal = a.nama_nasabah || a.member_name || "";
        bVal = b.nama_nasabah || b.member_name || "";
      } else if (sortConfig.key === "namaBarang") {
        aVal = a.item_name || a.purpose || "";
        bVal = b.item_name || b.purpose || "";
      } else if (sortConfig.key === "totalJualBeli") {
        aVal =
          Number(a.item_price || a.amount_requested || 0) +
          Number(a.margin_amount || 0);
        bVal =
          Number(b.item_price || b.amount_requested || 0) +
          Number(b.margin_amount || 0);
      } else if (sortConfig.key === "dp") {
        aVal = Number(a.down_payment || 0);
        bVal = Number(b.down_payment || 0);
      } else if (sortConfig.key === "cicilan") {
        aVal = Number(a.monthly_installment || 0);
        bVal = Number(b.monthly_installment || 0);
      }

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredList, sortConfig]);

  // 3. Paginate data
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = sortedList.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div
        className="table-responsive mt-3 jb-table-wrapper border rounded-3"
        style={{ width: "100%", overflowX: "auto" }}
      >
        <Table
          className="custom-table-admin align-middle mb-0 text-nowrap"
          borderless
          style={{ whiteSpace: "nowrap", minWidth: "1480px" }}
        >
          <thead className="table-light">
            {/* Baris 1: Header Nama Kolom & Sort */}
            <tr>
              <th className="px-3 py-3 text-center" style={{ width: "45px" }}>
                <Form.Check
                  type="checkbox"
                  checked={paginatedList.length > 0 && paginatedList.every((tx) => selectedIds.includes(tx.id || tx.financing_id))}
                  onChange={() => onToggleSelectAll && onToggleSelectAll(paginatedList.map((tx) => tx.id || tx.financing_id))}
                  title="Pilih Semua di Halaman Ini"
                />
              </th>
              <th className="px-3 py-3 text-muted fw-bold text-center" style={{ width: "150px" }}>
                Action
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold user-select-none"
                onClick={() => handleSort("anggota")}
              >
                Anggota {renderSortIcon("anggota")}
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold user-select-none"
                onClick={() => handleSort("category")}
              >
                Type {renderSortIcon("category")}
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold user-select-none"
                onClick={() => handleSort("namaBarang")}
              >
                Nama Barang {renderSortIcon("namaBarang")}
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold text-end user-select-none"
                onClick={() => handleSort("totalJualBeli")}
              >
                Total Jual Beli {renderSortIcon("totalJualBeli")}
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold text-end user-select-none"
                onClick={() => handleSort("dp")}
              >
                DP {renderSortIcon("dp")}
              </th>
              <th
                role="button"
                className="py-3 text-muted fw-bold text-center user-select-none"
                onClick={() => handleSort("cooperation_months")}
              >
                Tenor {renderSortIcon("cooperation_months")}
              </th>
              <th className="py-3 text-muted fw-bold text-center">Sisa Tenor</th>
              <th
                role="button"
                className="py-3 text-muted fw-bold text-end user-select-none"
                onClick={() => handleSort("cicilan")}
              >
                Cicilan {renderSortIcon("cicilan")}
              </th>
              <th className="py-3 text-muted fw-bold text-end">Piutang</th>
              <th className="py-3 text-muted fw-bold text-end">Diskon Pelunasan</th>
              <th className="py-3 text-muted fw-bold text-end">Sisa Cicilan</th>
              <th
                role="button"
                className="px-4 py-3 text-muted fw-bold text-center user-select-none"
                onClick={() => handleSort("status")}
              >
                Status Cicilan {renderSortIcon("status")}
              </th>
            </tr>

            {/* Baris 2: Input Pencarian di SEMUA kolom kecuali Action */}
            <tr className="bg-light bg-opacity-75">
              <th className="py-2 px-2 text-center"></th>
              <th className="py-2 px-2 text-center">
                {hasAnyFilter ? (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-1 px-2 border-0 d-inline-flex align-items-center gap-1 rounded-pill"
                    onClick={handleResetFilters}
                    title="Reset Semua Pencarian Kolom"
                  >
                    <X size={15} weight="bold" />
                    <span style={{ fontSize: "11px" }}>Reset</span>
                  </Button>
                ) : (
                  <span className="text-muted small opacity-50" style={{ fontSize: "11px" }}>Filter:</span>
                )}
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari anggota..."
                  value={colFilters.anggota}
                  onChange={(e) => handleFilterChange("anggota", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ minWidth: "140px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari type..."
                  value={colFilters.type}
                  onChange={(e) => handleFilterChange("type", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ minWidth: "110px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari barang..."
                  value={colFilters.namaBarang}
                  onChange={(e) => handleFilterChange("namaBarang", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ minWidth: "140px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Total..."
                  value={colFilters.totalJualBeli}
                  onChange={(e) => handleFilterChange("totalJualBeli", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "110px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="DP..."
                  value={colFilters.dp}
                  onChange={(e) => handleFilterChange("dp", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "90px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Tenor..."
                  value={colFilters.tenor}
                  onChange={(e) => handleFilterChange("tenor", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-center"
                  style={{ minWidth: "75px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Sisa..."
                  value={colFilters.sisaTenor}
                  onChange={(e) => handleFilterChange("sisaTenor", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-center"
                  style={{ minWidth: "75px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cicilan..."
                  value={colFilters.cicilan}
                  onChange={(e) => handleFilterChange("cicilan", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "100px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Piutang..."
                  value={colFilters.piutang}
                  onChange={(e) => handleFilterChange("piutang", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "100px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Diskon..."
                  value={colFilters.diskon}
                  onChange={(e) => handleFilterChange("diskon", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "90px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Sisa..."
                  value={colFilters.sisaCicilan}
                  onChange={(e) => handleFilterChange("sisaCicilan", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                  style={{ minWidth: "100px", fontSize: "12px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Select
                  size="sm"
                  value={colFilters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ minWidth: "115px", fontSize: "12px" }}
                >
                  <option value="">Semua Status</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="PAID">PAID</option>
                  <option value="LUNAS">LUNAS</option>
                  <option value="PENDING">PENDING</option>
                </Form.Select>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length === 0 ? (
              <tr>
                <td colSpan="14" className="p-0 border-0">
                  <EmptyState
                    title="Tidak ada transaksi"
                    message="Belum ada data transaksi yang cocok dengan kriteria pencarian."
                  />
                </td>
              </tr>
            ) : (
              paginatedList.map((tx) => {
                const isCompleted =
                  tx.status === "LUNAS" ||
                  tx.status === "COMPLETED" ||
                  tx.status === "PAID";
                const totalReq =
                  Number(tx.item_price || tx.amount_requested || 0) +
                  Number(tx.operational_cost || 0);
                const margin = Number(tx.margin_amount || 0);
                const dp = Number(tx.down_payment || 0);
                const totalJualBeli = totalReq + margin;
                const piutang = totalJualBeli - dp;
                const paidAmount = Number(tx.paid_amount || 0);
                const installment = Number(tx.monthly_installment || 1);
                let discount = Number(tx.discount || 0);
                let sisaCicilan = totalJualBeli - paidAmount - discount;

                if (isCompleted && sisaCicilan > 0) {
                  discount += sisaCicilan;
                  sisaCicilan = 0;
                }

                const sisaTenor =
                  tx.sisa_tenor === undefined
                    ? Math.max(
                        0,
                        tx.cooperation_months -
                          Math.floor(
                            Math.max(0, paidAmount - dp) / installment
                          )
                      )
                    : tx.sisa_tenor;

                const isTxApproved =
                  tx.status === "APPROVED" ||
                  tx.status === "PAID" ||
                  tx.status === "COMPLETED" ||
                  tx.status === "LUNAS" ||
                  tx.status === "ACTIVE";

                return (
                  <tr key={tx.id || tx.financing_id} className={`hover-shadow-sm transition-all ${selectedIds.includes(tx.id || tx.financing_id) ? "table-active bg-primary bg-opacity-10" : ""}`}>
                    <td className="px-3 text-center py-3">
                      <Form.Check
                        type="checkbox"
                        checked={selectedIds.includes(tx.id || tx.financing_id)}
                        onChange={() => onToggleSelect && onToggleSelect(tx.id || tx.financing_id)}
                      />
                    </td>
                    {/* Action Buttons */}
                    <td className="px-3 text-center py-3">
                      <div className="d-flex justify-content-center align-items-center gap-1">
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id={`tt-detail-${tx.id || tx.financing_id}`}>Lihat Detail</Tooltip>}
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="btn-action-table text-primary bg-primary bg-opacity-10 hover-bg-primary border-0"
                            onClick={() => onViewDetail(tx)}
                          >
                            <Eye size={16} weight="bold" />
                          </Button>
                        </OverlayTrigger>

                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip id={`tt-setoran-${tx.id || tx.financing_id}`}>Kartu Setoran</Tooltip>}
                        >
                          <Button
                            variant="light"
                            size="sm"
                            className="btn-action-table text-success bg-success bg-opacity-10 hover-bg-success border-0"
                            onClick={() => onViewSetoran(tx)}
                          >
                            <Coins size={16} weight="bold" />
                          </Button>
                        </OverlayTrigger>

                        {isApprovalTab && tx.status === "PENDING" && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tt-approve-${tx.id || tx.financing_id}`}>Approval</Tooltip>}
                          >
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-action-table text-warning bg-warning bg-opacity-15 hover-bg-warning border-0"
                              onClick={() => onApprove(tx)}
                            >
                              <CheckCircle size={16} weight="bold" />
                            </Button>
                          </OverlayTrigger>
                        )}

                        {onDelete && (
                          <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tt-del-${tx.id || tx.financing_id}`}>Hapus Transaksi</Tooltip>}
                          >
                            <Button
                              variant="light"
                              size="sm"
                              className="btn-action-table text-danger bg-danger bg-opacity-10 hover-bg-danger border-0"
                              onClick={() => onDelete(tx)}
                            >
                              <Trash size={16} weight="bold" />
                            </Button>
                          </OverlayTrigger>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark jb-text-main">
                          {tx.nama_nasabah ||
                            tx.member_name ||
                            tx.user_id ||
                            "-"}
                        </span>
                        {tx.member_no && (
                          <span className="text-muted" style={{ fontSize: "11px" }}>
                            No: {tx.member_no}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="badge bg-light text-secondary border px-2 py-1 rounded-pill fw-medium">
                        {tx.category || "-"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="fw-semibold text-dark jb-text-main">
                        {tx.item_name || tx.purpose || "-"}
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className="fw-bold text-dark jb-text-main">
                        {formatRp(totalJualBeli)}
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className="fw-semibold text-muted jb-text-main">
                        {formatRp(dp)}
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className="badge bg-light text-dark border px-2 py-1 rounded-pill">
                        {tx.cooperation_months} Bln
                      </span>
                    </td>
                    <td className="text-center py-3">
                      <span className={`badge px-2 py-1 rounded-pill ${sisaTenor === 0 ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25" : "bg-light text-dark border"}`}>
                        {sisaTenor} Bln
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className="fw-semibold text-dark jb-text-main">
                        {formatRp(installment)}
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className="fw-bold text-dark jb-text-main">
                        {formatRp(piutang)}
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className={`fw-semibold ${discount > 0 ? "text-success" : "text-muted"} jb-text-main`}>
                        {formatRp(discount)}
                      </span>
                    </td>
                    <td className="text-end py-3">
                      <span className={`fw-bold ${sisaCicilan === 0 ? "text-success" : "text-danger"} jb-text-main`}>
                        {formatRp(sisaCicilan)}
                      </span>
                    </td>
                    <td className="px-4 text-center py-3">
                      <Badge
                        bg={
                          isTxApproved
                            ? "success"
                            : tx.status === "PENDING"
                            ? "warning"
                            : "secondary"
                        }
                        className={`px-3 py-2 jb-badge-text bg-opacity-10 text-${
                          isTxApproved
                            ? "success"
                            : tx.status === "PENDING"
                            ? "warning"
                            : "secondary"
                        } border border-${
                          isTxApproved
                            ? "success"
                            : tx.status === "PENDING"
                            ? "warning"
                            : "secondary"
                        } border-opacity-25 rounded-pill`}
                      >
                        {tx.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2 px-2">
          <div className="text-muted small">
            Menampilkan{" "}
            <strong>
              {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)}
            </strong>{" "}
            dari <strong>{totalItems}</strong> data
          </div>
          <div className="d-flex align-items-center gap-2">
            <Form.Select
              size="sm"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              style={{ width: "115px" }}
              className="rounded-3 shadow-none border-secondary border-opacity-25"
            >
              <option value={10}>10 baris</option>
              <option value={25}>25 baris</option>
              <option value={50}>50 baris</option>
              <option value={100}>100 baris</option>
            </Form.Select>
            <Pagination className="mb-0">
              <Pagination.First
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              />
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={pageNum}
                      active={pageNum === currentPage}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Pagination.Item>
                  );
                } else if (
                  pageNum === currentPage - 2 ||
                  pageNum === currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={pageNum} disabled />;
                }
                return null;
              })}
              <Pagination.Next
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          </div>
        </div>
      )}
    </div>
  );
};

export default JualBeliTable;
