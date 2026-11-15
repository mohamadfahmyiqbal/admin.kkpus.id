import React, { useState, useMemo } from "react";
import { Table, Spinner, Form, Pagination, Button } from "react-bootstrap";
import { X, ArrowsDownUp, CaretUp, CaretDown } from "phosphor-react";

const JualBeliReportListTable = ({
  listData = [],
  listTotals,
  loading,
  formatRupiah,
  currentYear,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [colFilters, setColFilters] = useState({
    nama: "",
    // Tahun Ini
    iniTotal: "",
    iniPokok: "",
    iniDp: "",
    iniMargin: "",
    iniCicilan: "",
    // Tahun Lalu
    laluTotal: "",
    laluPokok: "",
    laluDp: "",
    laluMargin: "",
    laluCicilan: "",
    // 2 Tahun Lalu
    lalu2Total: "",
    lalu2Pokok: "",
    lalu2Dp: "",
    lalu2Margin: "",
    lalu2Cicilan: "",
  });

  const handleFilterChange = (field, value) => {
    setColFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setColFilters({
      nama: "",
      iniTotal: "",
      iniPokok: "",
      iniDp: "",
      iniMargin: "",
      iniCicilan: "",
      laluTotal: "",
      laluPokok: "",
      laluDp: "",
      laluMargin: "",
      laluCicilan: "",
      lalu2Total: "",
      lalu2Pokok: "",
      lalu2Dp: "",
      lalu2Margin: "",
      lalu2Cicilan: "",
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
    return listData.filter((item) => {
      const namaStr = (item.nama || "").toLowerCase();
      if (colFilters.nama && !namaStr.includes(colFilters.nama.toLowerCase().trim())) {
        return false;
      }

      // Helper check numeric filter
      const checkNumeric = (filterVal, numVal) => {
        if (!filterVal) return true;
        const clean = filterVal.replace(/\D/g, "");
        return String(numVal || 0).includes(clean);
      };

      if (!checkNumeric(colFilters.iniTotal, item.tahun_ini?.total)) return false;
      if (!checkNumeric(colFilters.iniPokok, item.tahun_ini?.pokok)) return false;
      if (!checkNumeric(colFilters.iniDp, item.tahun_ini?.dp)) return false;
      if (!checkNumeric(colFilters.iniMargin, item.tahun_ini?.margin)) return false;
      if (!checkNumeric(colFilters.iniCicilan, item.tahun_ini?.cicilan)) return false;

      if (!checkNumeric(colFilters.laluTotal, item.tahun_lalu?.total)) return false;
      if (!checkNumeric(colFilters.laluPokok, item.tahun_lalu?.pokok)) return false;
      if (!checkNumeric(colFilters.laluDp, item.tahun_lalu?.dp)) return false;
      if (!checkNumeric(colFilters.laluMargin, item.tahun_lalu?.margin)) return false;
      if (!checkNumeric(colFilters.laluCicilan, item.tahun_lalu?.cicilan)) return false;

      if (!checkNumeric(colFilters.lalu2Total, item.tahun_lalu2?.total)) return false;
      if (!checkNumeric(colFilters.lalu2Pokok, item.tahun_lalu2?.pokok)) return false;
      if (!checkNumeric(colFilters.lalu2Dp, item.tahun_lalu2?.dp)) return false;
      if (!checkNumeric(colFilters.lalu2Margin, item.tahun_lalu2?.margin)) return false;
      if (!checkNumeric(colFilters.lalu2Cicilan, item.tahun_lalu2?.cicilan)) return false;

      return true;
    });
  }, [listData, colFilters]);

  // 2. Sort
  const sortedList = useMemo(() => {
    if (!sortConfig.key) return filteredList;
    return [...filteredList].sort((a, b) => {
      let aVal = a[sortConfig.key];
      let bVal = b[sortConfig.key];

      if (sortConfig.key === "nama") {
        aVal = a.nama || "";
        bVal = b.nama || "";
      } else if (sortConfig.key.startsWith("tahun_ini_")) {
        const sub = sortConfig.key.replace("tahun_ini_", "");
        aVal = Number(a.tahun_ini?.[sub] || 0);
        bVal = Number(b.tahun_ini?.[sub] || 0);
      } else if (sortConfig.key.startsWith("tahun_lalu_")) {
        const sub = sortConfig.key.replace("tahun_lalu_", "");
        aVal = Number(a.tahun_lalu?.[sub] || 0);
        bVal = Number(b.tahun_lalu?.[sub] || 0);
      } else if (sortConfig.key.startsWith("tahun_lalu2_")) {
        const sub = sortConfig.key.replace("tahun_lalu2_", "");
        aVal = Number(a.tahun_lalu2?.[sub] || 0);
        bVal = Number(b.tahun_lalu2?.[sub] || 0);
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
        <Table
          className="table compact-table table-striped table-hover table-bordered align-middle mb-0 text-nowrap custom-table-admin"
          style={{ minWidth: "1700px" }}
        >
          <thead
            className="table-light text-center sticky-top"
            style={{ zIndex: 2 }}
          >
            {/* Baris 1: Header Grup Tahun */}
            <tr>
              <th
                rowSpan="2"
                className="align-middle position-sticky start-0 bg-light"
                style={{
                  zIndex: 3,
                  borderRight: "1px solid #dee2e6",
                  width: "50px",
                }}
              >
                No
              </th>
              <th
                rowSpan="2"
                role="button"
                className="align-middle text-start position-sticky bg-light user-select-none"
                style={{
                  left: "50px",
                  zIndex: 3,
                  borderRight: "2px solid #dee2e6",
                  minWidth: "160px",
                }}
                onClick={() => handleSort("nama")}
              >
                Nama {renderSortIcon("nama")}
              </th>
              <th colSpan="5" style={{ borderRight: "2px solid #dee2e6" }}>
                Pembiayaan Tahun Ini ({currentYear})
              </th>
              <th colSpan="5" style={{ borderRight: "2px solid #dee2e6" }}>
                Pembiayaan {currentYear - 1}
              </th>
              <th colSpan="5">Pembiayaan {currentYear - 2}</th>
            </tr>

            {/* Baris 2: Sub-Kolom Komponen Pembiayaan */}
            <tr>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_ini_total")}>
                Total {renderSortIcon("tahun_ini_total")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_ini_pokok")}>
                Pokok {renderSortIcon("tahun_ini_pokok")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_ini_dp")}>
                DP {renderSortIcon("tahun_ini_dp")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_ini_margin")}>
                Margin {renderSortIcon("tahun_ini_margin")}
              </th>
              <th role="button" className="text-end user-select-none" style={{ borderRight: "2px solid #dee2e6" }} onClick={() => handleSort("tahun_ini_cicilan")}>
                Cicilan {renderSortIcon("tahun_ini_cicilan")}
              </th>

              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu_total")}>
                Total {renderSortIcon("tahun_lalu_total")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu_pokok")}>
                Pokok {renderSortIcon("tahun_lalu_pokok")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu_dp")}>
                DP {renderSortIcon("tahun_lalu_dp")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu_margin")}>
                Margin {renderSortIcon("tahun_lalu_margin")}
              </th>
              <th role="button" className="text-end user-select-none" style={{ borderRight: "2px solid #dee2e6" }} onClick={() => handleSort("tahun_lalu_cicilan")}>
                Cicilan {renderSortIcon("tahun_lalu_cicilan")}
              </th>

              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu2_total")}>
                Total {renderSortIcon("tahun_lalu2_total")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu2_pokok")}>
                Pokok {renderSortIcon("tahun_lalu2_pokok")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu2_dp")}>
                DP {renderSortIcon("tahun_lalu2_dp")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu2_margin")}>
                Margin {renderSortIcon("tahun_lalu2_margin")}
              </th>
              <th role="button" className="text-end user-select-none" onClick={() => handleSort("tahun_lalu2_cicilan")}>
                Cicilan {renderSortIcon("tahun_lalu2_cicilan")}
              </th>
            </tr>

            {/* Baris 3: Input Pencarian di SEMUA Kolom */}
            <tr className="bg-light bg-opacity-75">
              <th className="py-2 px-1 text-center position-sticky start-0 bg-light" style={{ zIndex: 3, borderRight: "1px solid #dee2e6" }}>
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
              </th>
              <th className="py-2 px-2 position-sticky bg-light" style={{ left: "50px", zIndex: 3, borderRight: "2px solid #dee2e6" }}>
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari nama..."
                  value={colFilters.nama}
                  onChange={(e) => handleFilterChange("nama", e.target.value)}
                  className="rounded-2 shadow-none border-secondary border-opacity-25"
                  style={{ minWidth: "140px", fontSize: "11px" }}
                />
              </th>
              {/* Tahun Ini */}
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Total..." value={colFilters.iniTotal} onChange={(e) => handleFilterChange("iniTotal", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Pokok..." value={colFilters.iniPokok} onChange={(e) => handleFilterChange("iniPokok", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="DP..." value={colFilters.iniDp} onChange={(e) => handleFilterChange("iniDp", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Margin..." value={colFilters.iniMargin} onChange={(e) => handleFilterChange("iniMargin", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1" style={{ borderRight: "2px solid #dee2e6" }}>
                <Form.Control size="sm" type="text" placeholder="Cicilan..." value={colFilters.iniCicilan} onChange={(e) => handleFilterChange("iniCicilan", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              {/* Tahun Lalu */}
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Total..." value={colFilters.laluTotal} onChange={(e) => handleFilterChange("laluTotal", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Pokok..." value={colFilters.laluPokok} onChange={(e) => handleFilterChange("laluPokok", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="DP..." value={colFilters.laluDp} onChange={(e) => handleFilterChange("laluDp", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Margin..." value={colFilters.laluMargin} onChange={(e) => handleFilterChange("laluMargin", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1" style={{ borderRight: "2px solid #dee2e6" }}>
                <Form.Control size="sm" type="text" placeholder="Cicilan..." value={colFilters.laluCicilan} onChange={(e) => handleFilterChange("laluCicilan", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              {/* 2 Tahun Lalu */}
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Total..." value={colFilters.lalu2Total} onChange={(e) => handleFilterChange("lalu2Total", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Pokok..." value={colFilters.lalu2Pokok} onChange={(e) => handleFilterChange("lalu2Pokok", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="DP..." value={colFilters.lalu2Dp} onChange={(e) => handleFilterChange("lalu2Dp", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Margin..." value={colFilters.lalu2Margin} onChange={(e) => handleFilterChange("lalu2Margin", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
              <th className="py-2 px-1">
                <Form.Control size="sm" type="text" placeholder="Cicilan..." value={colFilters.lalu2Cicilan} onChange={(e) => handleFilterChange("lalu2Cicilan", e.target.value)} className="rounded-2 shadow-none text-end" style={{ minWidth: "85px", fontSize: "11px" }} />
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="17" className="text-center py-4">
                  <Spinner animation="border" variant="primary" size="sm" />
                  <div className="mt-2 text-muted">Memuat data laporan...</div>
                </td>
              </tr>
            ) : paginatedList.length === 0 ? (
              <tr>
                <td colSpan="17" className="text-center text-muted py-4">
                  Belum ada data laporan yang cocok dengan pencarian
                </td>
              </tr>
            ) : (
              paginatedList.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td
                    className="text-center position-sticky start-0 bg-white"
                    style={{ borderRight: "1px solid #dee2e6" }}
                  >
                    {startIndex + idx + 1}
                  </td>
                  <td
                    className="fw-medium position-sticky bg-white"
                    style={{
                      left: "50px",
                      borderRight: "2px solid #dee2e6",
                    }}
                  >
                    {item.nama}
                  </td>
                  <td className="text-end text-primary fw-medium bg-light">
                    {formatRupiah(item.tahun_ini?.total)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_ini?.pokok)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_ini?.dp)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_ini?.margin)}
                  </td>
                  <td
                    className="text-end"
                    style={{ borderRight: "2px solid #dee2e6" }}
                  >
                    {formatRupiah(item.tahun_ini?.cicilan)}
                  </td>
                  <td className="text-end text-primary fw-medium bg-light">
                    {formatRupiah(item.tahun_lalu?.total)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu?.pokok)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu?.dp)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu?.margin)}
                  </td>
                  <td
                    className="text-end"
                    style={{ borderRight: "2px solid #dee2e6" }}
                  >
                    {formatRupiah(item.tahun_lalu?.cicilan)}
                  </td>
                  <td className="text-end text-primary fw-medium bg-light">
                    {formatRupiah(item.tahun_lalu2?.total)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu2?.pokok)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu2?.dp)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu2?.margin)}
                  </td>
                  <td className="text-end">
                    {formatRupiah(item.tahun_lalu2?.cicilan)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {listData.length > 0 && listTotals && (
            <tfoot
              className="table-light fw-bold position-sticky bottom-0"
              style={{ zIndex: 2 }}
            >
              <tr>
                <td
                  colSpan="2"
                  className="text-center position-sticky start-0 bg-light"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  Total Keseluruhan
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals.tahun_ini.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_ini.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_ini.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_ini.margin)}
                </td>
                <td
                  className="text-end"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  {formatRupiah(listTotals.tahun_ini.cicilan)}
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals.tahun_lalu.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu.margin)}
                </td>
                <td
                  className="text-end"
                  style={{ borderRight: "2px solid #dee2e6" }}
                >
                  {formatRupiah(listTotals.tahun_lalu.cicilan)}
                </td>
                <td className="text-end text-primary">
                  {formatRupiah(listTotals.tahun_lalu2.total)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu2.pokok)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu2.dp)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu2.margin)}
                </td>
                <td className="text-end">
                  {formatRupiah(listTotals.tahun_lalu2.cicilan)}
                </td>
              </tr>
            </tfoot>
          )}
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
            dari <strong>{totalItems}</strong> data anggota
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

export default JualBeliReportListTable;
