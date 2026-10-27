import React, { useState, useMemo } from "react";
import { Table, Spinner, Form, Button } from "react-bootstrap";
import { X, ArrowsDownUp, CaretUp, CaretDown } from "phosphor-react";

const JualBeliReportJurnalTable = ({
  jurnal = {},
  loading,
  hasData,
  formatRupiah,
}) => {
  const [colFilters, setColFilters] = useState({
    akun: "",
    deskripsi: "",
    debet: "",
    kredit: "",
  });

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  const rawRows = useMemo(() => {
    return [
      {
        id: 1,
        akun: "110-01",
        deskripsi: "Kas",
        isIndent: false,
        debet: jurnal.kas || 0,
        kredit: 0,
      },
      {
        id: 2,
        akun: "112-01",
        deskripsi: "Piutang Usaha",
        isIndent: false,
        debet: jurnal.piutangJualBeli || 0,
        kredit: 0,
      },
      {
        id: 3,
        akun: "112-02",
        deskripsi: "HPP (Harga Pokok Penjualan)",
        isIndent: true,
        debet: 0,
        kredit: jurnal.piutangPokok || 0,
      },
    ];
  }, [jurnal]);

  const handleFilterChange = (field, value) => {
    setColFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetFilters = () => {
    setColFilters({
      akun: "",
      deskripsi: "",
      debet: "",
      kredit: "",
    });
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

  // Filter
  const filteredRows = useMemo(() => {
    return rawRows.filter((row) => {
      if (
        colFilters.akun &&
        !row.akun.toLowerCase().includes(colFilters.akun.toLowerCase().trim())
      ) {
        return false;
      }
      if (
        colFilters.deskripsi &&
        !row.deskripsi
          .toLowerCase()
          .includes(colFilters.deskripsi.toLowerCase().trim())
      ) {
        return false;
      }
      if (colFilters.debet) {
        const clean = colFilters.debet.replace(/\D/g, "");
        const formatted = formatRupiah(row.debet).toLowerCase();
        if (
          !String(row.debet).includes(clean) &&
          !formatted.includes(colFilters.debet.toLowerCase())
        ) {
          return false;
        }
      }
      if (colFilters.kredit) {
        const clean = colFilters.kredit.replace(/\D/g, "");
        const formatted = formatRupiah(row.kredit).toLowerCase();
        if (
          !String(row.kredit).includes(clean) &&
          !formatted.includes(colFilters.kredit.toLowerCase())
        ) {
          return false;
        }
      }
      return true;
    });
  }, [rawRows, colFilters, formatRupiah]);

  // Sort
  const sortedRows = useMemo(() => {
    if (!sortConfig.key) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      if (typeof aVal === "string") {
        return sortConfig.direction === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
    });
  }, [filteredRows, sortConfig]);

  return (
    <div className="table-responsive border rounded-3">
      <Table className="table compact-table table-striped table-hover table-bordered align-middle mb-0 text-nowrap custom-table-admin">
        <thead className="table-light text-center sticky-top" style={{ zIndex: 2 }}>
          <tr>
            <th
              role="button"
              className="text-start user-select-none"
              style={{ width: "160px" }}
              onClick={() => handleSort("akun")}
            >
              Akun {renderSortIcon("akun")}
            </th>
            <th
              role="button"
              className="text-start user-select-none"
              onClick={() => handleSort("deskripsi")}
            >
              Deskripsi {renderSortIcon("deskripsi")}
            </th>
            <th
              role="button"
              className="text-end user-select-none"
              style={{ width: "200px" }}
              onClick={() => handleSort("debet")}
            >
              Debet {renderSortIcon("debet")}
            </th>
            <th
              role="button"
              className="text-end user-select-none"
              style={{ width: "200px" }}
              onClick={() => handleSort("kredit")}
            >
              Kredit {renderSortIcon("kredit")}
            </th>
          </tr>

          {/* Baris Input Filter */}
          <tr className="bg-light bg-opacity-75">
            <th className="py-2 px-2">
              <div className="d-flex align-items-center gap-1">
                <Form.Control
                  size="sm"
                  type="text"
                  placeholder="Cari akun..."
                  value={colFilters.akun}
                  onChange={(e) => handleFilterChange("akun", e.target.value)}
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
                type="text"
                placeholder="Cari deskripsi..."
                value={colFilters.deskripsi}
                onChange={(e) =>
                  handleFilterChange("deskripsi", e.target.value)
                }
                className="rounded-2 shadow-none border-secondary border-opacity-25"
                style={{ fontSize: "11px" }}
              />
            </th>
            <th className="py-2 px-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari debet..."
                value={colFilters.debet}
                onChange={(e) => handleFilterChange("debet", e.target.value)}
                className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                style={{ fontSize: "11px" }}
              />
            </th>
            <th className="py-2 px-2">
              <Form.Control
                size="sm"
                type="text"
                placeholder="Cari kredit..."
                value={colFilters.kredit}
                onChange={(e) => handleFilterChange("kredit", e.target.value)}
                className="rounded-2 shadow-none border-secondary border-opacity-25 text-end"
                style={{ fontSize: "11px" }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <Spinner animation="border" size="sm" variant="primary" />{" "}
                <span className="text-muted ms-2">Memuat data jurnal...</span>
              </td>
            </tr>
          ) : !hasData ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Belum ada data laporan
              </td>
            </tr>
          ) : sortedRows.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Tidak ada baris jurnal yang sesuai dengan pencarian
              </td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr key={row.id}>
                <td className="fw-medium">{row.akun}</td>
                <td className={row.isIndent ? "ps-4" : ""}>{row.deskripsi}</td>
                <td className="text-end">
                  {row.debet > 0 ? formatRupiah(row.debet) : "-"}
                </td>
                <td className="text-end">
                  {row.kredit > 0 ? formatRupiah(row.kredit) : "-"}
                </td>
              </tr>
            ))
          )}
        </tbody>
        {hasData && (
          <tfoot className="fw-bold table-light position-sticky bottom-0">
            <tr>
              <td colSpan="2" className="text-center">
                Total
              </td>
              <td className="text-end text-primary">
                {formatRupiah(jurnal.totalDebit)}
              </td>
              <td className="text-end text-primary">
                {formatRupiah(jurnal.totalKredit)}
              </td>
            </tr>
          </tfoot>
        )}
      </Table>
    </div>
  );
};

export default JualBeliReportJurnalTable;
