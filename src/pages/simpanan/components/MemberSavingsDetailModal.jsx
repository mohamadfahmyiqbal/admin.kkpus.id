import React, { useState, useMemo } from "react";
import { Modal, Button, Table, Form, Pagination } from "react-bootstrap";
import {
  X,
  Receipt,
  CheckCircle,
  Clock,
  WarningCircle,
  ArrowsDownUp,
  CaretUp,
  CaretDown,
} from "phosphor-react";

export const MemberSavingsDetailModal = ({
  show,
  onHide,
  member,
  savingsType = "POKOK",
  formatRupiah,
  onViewInvoice,
}) => {
  // Column-specific search filters in thead
  const [columnFilters, setColumnFilters] = useState({
    date: "",
    description: "",
    amount: "",
    status: "",
  });

  const [sortConfig, setSortConfig] = useState({
    key: "date",
    direction: "desc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const transactions = member?.transactions || [];

  const handleFilterChange = (col, val) => {
    setColumnFilters((prev) => ({ ...prev, [col]: val }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setColumnFilters({
      date: "",
      description: "",
      amount: "",
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
  };

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowsDownUp size={11} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={11} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={11} className="text-primary ms-1" weight="bold" />
    );
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return String(dateStr);
    return (
      d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
      " WIB"
    );
  };

  const renderStatusBadge = (tx) => {
    const raw = (tx.raw_status || tx.status || "").toUpperCase();
    const isCompleted =
      tx.is_paid ||
      raw === "COMPLETED" ||
      raw === "APPROVED" ||
      raw === "PAID" ||
      raw === "SELESAI";
    const isPending =
      raw === "PENDING_VERIFICATION" ||
      raw === "PENDING" ||
      (tx.status || "").toLowerCase().includes("verifikasi");

    if (isCompleted) {
      return (
        <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          <CheckCircle size={12} className="me-1" weight="bold" />
          Selesai
        </span>
      );
    }

    if (isPending) {
      return (
        <span className="badge bg-warning bg-opacity-10 text-warning-emphasis border border-warning border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
          <Clock size={12} className="me-1" weight="bold" />
          Menunggu Verifikasi
        </span>
      );
    }

    return (
      <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2.5 py-1 rounded-pill fw-semibold extra-small">
        <WarningCircle size={12} className="me-1" weight="bold" />
        Belum Terbayar
      </span>
    );
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let list = [...transactions];

    if (columnFilters.date) {
      const q = columnFilters.date.trim().toLowerCase();
      list = list.filter((tx) => formatDate(tx.date).toLowerCase().includes(q));
    }

    if (columnFilters.description) {
      const q = columnFilters.description.trim().toLowerCase();
      list = list.filter((tx) => {
        const desc = (tx.description || tx.product_name || "").toLowerCase();
        const type = (tx.type || "").toLowerCase();
        return desc.includes(q) || type.includes(q);
      });
    }

    if (columnFilters.amount) {
      const q = columnFilters.amount.trim();
      const cleanDigits = q.replace(/[^0-9]/g, "");
      list = list.filter((tx) => {
        const amtStr = String(tx.amount || "");
        const formattedAmt = formatRupiah ? formatRupiah(tx.amount || 0).toLowerCase() : "";
        return (
          amtStr.includes(cleanDigits) ||
          amtStr.includes(q) ||
          formattedAmt.includes(q.toLowerCase())
        );
      });
    }

    if (columnFilters.status) {
      const q = columnFilters.status.trim().toLowerCase();
      list = list.filter((tx) => {
        const raw = (tx.raw_status || tx.status || "").toLowerCase();
        if (q === "selesai") {
          return (
            tx.is_paid ||
            raw === "completed" ||
            raw === "approved" ||
            raw === "paid" ||
            raw === "selesai"
          );
        }
        if (q.includes("verifikasi") || q === "pending") {
          return raw.includes("verification") || raw.includes("pending") || raw.includes("verifikasi");
        }
        if (q.includes("belum") || q.includes("unpaid")) {
          return (
            !tx.is_paid &&
            raw !== "completed" &&
            raw !== "approved" &&
            raw !== "paid" &&
            raw !== "selesai"
          );
        }
        return raw.includes(q);
      });
    }

    if (sortConfig.key) {
      list.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        if (sortConfig.key === "date") {
          valA = new Date(a.date || 0).getTime();
          valB = new Date(b.date || 0).getTime();
        } else if (sortConfig.key === "amount") {
          valA = parseFloat(a.amount) || 0;
          valB = parseFloat(b.amount) || 0;
        } else if (sortConfig.key === "description") {
          valA = (a.description || a.product_name || "").toLowerCase();
          valB = (b.description || b.product_name || "").toLowerCase();
        } else if (sortConfig.key === "status") {
          valA = (a.status || a.raw_status || "").toLowerCase();
          valB = (b.status || b.raw_status || "").toLowerCase();
        }

        if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
        if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [transactions, columnFilters, sortConfig]);

  const totalRecords = filteredAndSortedTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / pageSize));
  const activePage = Math.min(currentPage, totalPages);

  const paginatedTransactions = useMemo(() => {
    const start = (activePage - 1) * pageSize;
    return filteredAndSortedTransactions.slice(start, start + pageSize);
  }, [filteredAndSortedTransactions, activePage, pageSize]);

  const getPaginationRange = (curr, total) => {
    if (total <= 5) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }
    const delta = 1;
    const range = [];
    for (let i = Math.max(2, curr - delta); i <= Math.min(total - 1, curr + delta); i++) {
      range.push(i);
    }
    if (curr - delta > 2) range.unshift("...");
    range.unshift(1);
    if (curr + delta < total - 1) range.push("...");
    range.push(total);
    return range;
  };

  if (!member) return null;

  const typeLabel = savingsType === "POKOK" ? "Simpanan Pokok" : "Simpanan Wajib";
  const hasActiveFilter = Object.values(columnFilters).some((v) => Boolean(v));

  return (
    <Modal show={show} onHide={onHide} size="xl" centered backdrop="static">
      <Modal.Header className="border-bottom px-4 py-3 bg-light">
        <div>
          <Modal.Title className="h6 fw-bold text-dark mb-0">
            Daftar Transaksi {typeLabel}
          </Modal.Title>
          <div className="text-muted small mt-1">
            Anggota: <span className="fw-semibold text-dark">{member.full_name}</span> (No. {member.member_no || "-"})
          </div>
        </div>
        <button
          onClick={onHide}
          className="btn-close ms-auto"
          aria-label="Close"
        />
      </Modal.Header>

      <Modal.Body className="p-4">
        {/* Tabel Rincian dengan filter kolom di thead */}
        <div className="table-responsive border rounded-3" style={{ overflowX: "auto" }}>
          <Table hover className="align-middle mb-0 custom-table text-nowrap" style={{ fontSize: "13px", minWidth: "750px" }}>
            <thead className="bg-light text-uppercase text-secondary" style={{ fontSize: "11px", letterSpacing: "0.5px" }}>
              <tr>
                <th className="py-2.5 px-3 text-center" style={{ width: "50px" }}>No</th>
                <th
                  className="py-2.5 px-3 cursor-pointer user-select-none"
                  style={{ width: "175px" }}
                  role="button"
                  tabIndex={0}
                  aria-sort={sortConfig.key === "date" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                  onClick={() => handleSort("date")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort("date");
                    }
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span>Tanggal</span>
                    {renderSortIcon("date")}
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer user-select-none"
                  role="button"
                  tabIndex={0}
                  aria-sort={sortConfig.key === "description" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                  onClick={() => handleSort("description")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort("description");
                    }
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span>Keterangan</span>
                    {renderSortIcon("description")}
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer user-select-none text-end"
                  style={{ width: "160px" }}
                  role="button"
                  tabIndex={0}
                  aria-sort={sortConfig.key === "amount" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                  onClick={() => handleSort("amount")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort("amount");
                    }
                  }}
                >
                  <div className="d-flex align-items-center justify-content-end">
                    <span>Nominal</span>
                    {renderSortIcon("amount")}
                  </div>
                </th>
                <th
                  className="py-2.5 px-3 cursor-pointer user-select-none text-center"
                  style={{ width: "170px" }}
                  role="button"
                  tabIndex={0}
                  aria-sort={sortConfig.key === "status" ? (sortConfig.direction === "asc" ? "ascending" : "descending") : "none"}
                  onClick={() => handleSort("status")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSort("status");
                    }
                  }}
                >
                  <div className="d-flex align-items-center justify-content-center">
                    <span>Status</span>
                    {renderSortIcon("status")}
                  </div>
                </th>
                <th className="py-2.5 px-3 text-center" style={{ width: "110px" }}>
                  Aksi
                </th>
              </tr>

              {/* In-Header Search Filters per Column */}
              <tr className="bg-white border-bottom">
                <th className="p-2 text-center">
                  {hasActiveFilter && (
                    <Button
                      variant="link"
                      className="p-0 text-danger"
                      onClick={handleResetFilters}
                      title="Reset Semua Filter"
                    >
                      <X size={14} weight="bold" />
                    </Button>
                  )}
                </th>
                <th className="p-2">
                  <Form.Control
                    type="text"
                    placeholder="Cari tanggal..."
                    size="sm"
                    value={columnFilters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="bg-light border-0 shadow-none text-dark"
                    style={{ fontSize: "11px", height: "28px" }}
                  />
                </th>
                <th className="p-2">
                  <Form.Control
                    type="text"
                    placeholder="Cari keterangan..."
                    size="sm"
                    value={columnFilters.description}
                    onChange={(e) => handleFilterChange("description", e.target.value)}
                    className="bg-light border-0 shadow-none text-dark"
                    style={{ fontSize: "11px", height: "28px" }}
                  />
                </th>
                <th className="p-2">
                  <Form.Control
                    type="text"
                    placeholder="Cari nominal..."
                    size="sm"
                    value={columnFilters.amount}
                    onChange={(e) => handleFilterChange("amount", e.target.value)}
                    className="bg-light border-0 shadow-none text-dark text-end"
                    style={{ fontSize: "11px", height: "28px" }}
                  />
                </th>
                <th className="p-2">
                  <Form.Select
                    size="sm"
                    value={columnFilters.status}
                    onChange={(e) => handleFilterChange("status", e.target.value)}
                    className="bg-light border-0 shadow-none text-dark"
                    style={{ fontSize: "11px", height: "28px" }}
                  >
                    <option value="">Semua Status</option>
                    <option value="selesai">Selesai</option>
                    <option value="verifikasi">Menunggu Verifikasi</option>
                    <option value="belum">Belum Terbayar</option>
                  </Form.Select>
                </th>
                <th className="p-2 text-center">
                  {hasActiveFilter && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="extra-small px-2 py-0 border-0 text-muted"
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    Tidak ada rincian transaksi yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx, idx) => {
                  const globalIdx = (activePage - 1) * pageSize + idx + 1;
                  return (
                    <tr key={tx.id || globalIdx}>
                      <td className="py-2.5 px-3 text-center text-muted fw-medium">{globalIdx}</td>
                      <td className="py-2.5 px-3 text-secondary extra-small fw-medium">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="fw-semibold text-dark">{tx.description || tx.product_name}</div>
                        {tx.type && (
                          <div className="text-muted extra-small">Tipe: {tx.type}</div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-end fw-bold text-dark">
                        {formatRupiah(tx.amount || 0)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {renderStatusBadge(tx)}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="d-inline-flex align-items-center gap-1 px-2.5 py-1 rounded-pill extra-small fw-semibold shadow-none"
                          onClick={() => onViewInvoice && onViewInvoice(tx, member)}
                          title="Tampilkan Invoice / Bukti Transaksi"
                        >
                          <Receipt size={14} weight="bold" />
                          <span>Invoice</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </div>

        {/* Kontrol Pagination & Info Bar */}
        {totalRecords > 0 && (
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mt-3 px-1">
            <div className="d-flex align-items-center gap-2 text-muted extra-small">
              <span>Tampilkan:</span>
              <Form.Select
                size="sm"
                className="bg-light border shadow-none extra-small text-dark"
                style={{ width: "70px", height: "30px" }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </Form.Select>
              <span>
                Menampilkan {(activePage - 1) * pageSize + 1}-
                {Math.min(activePage * pageSize, totalRecords)} dari {totalRecords} transaksi
              </span>
            </div>

            {totalPages > 1 && (
              <Pagination size="sm" className="mb-0 gap-1 extra-small">
                <Pagination.Prev
                  disabled={activePage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="border-0 shadow-none"
                />
                {getPaginationRange(activePage, totalPages).map((p, idx) =>
                  p === "..." ? (
                    <Pagination.Ellipsis key={`el-${idx}`} disabled />
                  ) : (
                    <Pagination.Item
                      key={p}
                      active={p === activePage}
                      onClick={() => setCurrentPage(p)}
                      className="border-0 shadow-none"
                    >
                      {p}
                    </Pagination.Item>
                  )
                )}
                <Pagination.Next
                  disabled={activePage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  className="border-0 shadow-none"
                />
              </Pagination>
            )}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-top px-4 py-3 bg-light">
        <Button variant="secondary" size="sm" onClick={onHide} className="px-3">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MemberSavingsDetailModal;
