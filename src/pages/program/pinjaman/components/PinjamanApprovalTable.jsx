import React, { useState, useMemo } from "react";
import { Table, Button, Form, Spinner, Pagination } from "react-bootstrap";
import { X, ArrowsDownUp, CaretUp, CaretDown, CheckCircle } from "phosphor-react";

const PinjamanApprovalTable = ({
  loading,
  pendingApprovals = [],
  onProcessApproval,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [colFilters, setColFilters] = useState({
    rincian: "",
    nominal: "",
    waktu: "",
  });

  const handleFilterChange = (field, value) => {
    setColFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setColFilters({
      rincian: "",
      nominal: "",
      waktu: "",
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
      return <ArrowsDownUp size={12} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={12} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={12} className="text-primary ms-1" weight="bold" />
    );
  };

  const hasAnyFilter = Object.values(colFilters).some((v) => Boolean(v));

  // 1. Filter
  const filteredList = useMemo(() => {
    return pendingApprovals.filter((item) => {
      const rincianStr = `${item.name || ""} ${item.item || ""}`.toLowerCase();
      if (
        colFilters.rincian &&
        !rincianStr.includes(colFilters.rincian.toLowerCase().trim())
      ) {
        return false;
      }

      if (colFilters.nominal) {
        const clean = colFilters.nominal.replace(/\D/g, "");
        const rawAmount = String(item.amount || item.amount_requested || "");
        if (!rawAmount.includes(clean)) return false;
      }

      if (colFilters.waktu) {
        const dateStr = item.date
          ? new Date(item.date).toLocaleDateString("id-ID")
          : "";
        if (!dateStr.toLowerCase().includes(colFilters.waktu.toLowerCase().trim())) {
          return false;
        }
      }

      return true;
    });
  }, [pendingApprovals, colFilters]);

  // 2. Sort
  const sortedList = useMemo(() => {
    if (!sortConfig.key) return filteredList;
    return [...filteredList].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "rincian") {
        aVal = a.name || "";
        bVal = b.name || "";
      } else if (sortConfig.key === "nominal") {
        const cleanA = String(a.amount || "").replace(/\D/g, "");
        const cleanB = String(b.amount || "").replace(/\D/g, "");
        aVal = Number(cleanA) || 0;
        bVal = Number(cleanB) || 0;
      } else if (sortConfig.key === "waktu") {
        aVal = new Date(a.date || 0).getTime();
        bVal = new Date(b.date || 0).getTime();
      }

      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredList, sortConfig]);

  // 3. Pagination
  const totalItems = sortedList.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedList = sortedList.slice(startIndex, startIndex + pageSize);

  return (
    <div>
      <div className="table-responsive border rounded-3">
        <Table hover className="table compact-table table-striped table-bordered align-middle mb-0 text-nowrap custom-table-admin">
          <thead className="table-light sticky-top" style={{ zIndex: 2 }}>
            <tr>
              <th
                role="button"
                className="px-3 py-3 font-medium user-select-none"
                onClick={() => handleSort("rincian")}
              >
                Rincian {renderSortIcon("rincian")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium user-select-none"
                style={{ width: "220px" }}
                onClick={() => handleSort("nominal")}
              >
                Nominal {renderSortIcon("nominal")}
              </th>
              <th
                role="button"
                className="px-3 py-3 font-medium user-select-none"
                style={{ width: "160px" }}
                onClick={() => handleSort("waktu")}
              >
                Waktu {renderSortIcon("waktu")}
              </th>
              <th className="px-3 py-3 text-center font-medium" style={{ width: "120px" }}>
                Aksi
              </th>
            </tr>

            {/* Filter row */}
            <tr className="bg-light bg-opacity-75">
              <th className="py-2 px-2">
                <div className="d-flex align-items-center gap-1">
                  <Form.Control
                    size="sm"
                    placeholder="Cari anggota / item..."
                    value={colFilters.rincian}
                    onChange={(e) =>
                      handleFilterChange("rincian", e.target.value)
                    }
                    className="rounded-2 shadow-none border-secondary border-opacity-25"
                    style={{ fontSize: "11px" }}
                  />
                  {hasAnyFilter && (
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="p-0 px-1 border-0"
                      onClick={handleResetFilters}
                      title="Reset Semua Filter"
                    >
                      <X size={14} weight="bold" />
                    </Button>
                  )}
                </div>
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari nominal..."
                  value={colFilters.nominal}
                  onChange={(e) =>
                    handleFilterChange("nominal", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px" }}
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari tanggal..."
                  value={colFilters.waktu}
                  onChange={(e) =>
                    handleFilterChange("waktu", e.target.value)
                  }
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ fontSize: "11px" }}
                />
              </th>
              <th className="py-2 px-2 text-center" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <div className="mt-1 text-muted small">
                    Memuat antrian approval...
                  </div>
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-muted">
                  {hasAnyFilter
                    ? "Tidak ada antrian yang cocok dengan filter pencarian"
                    : "Tidak ada antrian persetujuan"}
                </td>
              </tr>
            ) : (
              paginatedList.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="px-3 py-2">
                    <div
                      className="fw-bold text-dark mb-1 text-truncate"
                      style={{ maxWidth: "260px" }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="text-muted text-truncate small"
                      style={{ maxWidth: "260px" }}
                    >
                      {item.item}
                    </div>
                  </td>
                  <td className="px-3 py-2 fw-semibold text-primary">
                    {item.amount || "-"}
                  </td>
                  <td className="px-3 py-2 text-muted">
                    {item.date
                      ? new Date(item.date).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <Button
                      variant="primary"
                      size="sm"
                      className="rounded-pill px-3 py-1 shadow-xs d-inline-flex align-items-center gap-1"
                      style={{ fontWeight: 600, fontSize: "12px" }}
                      onClick={() => onProcessApproval(item)}
                    >
                      <CheckCircle size={14} weight="bold" />
                      Proses
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2 px-1">
          <div className="text-muted small">
            Menampilkan{" "}
            <strong>
              {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)}
            </strong>{" "}
            dari <strong>{totalItems}</strong> antrian
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

export default PinjamanApprovalTable;
