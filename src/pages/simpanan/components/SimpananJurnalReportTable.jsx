import React, { useState, useMemo } from "react";
import { Table, Spinner } from "react-bootstrap";
import { formatRupiah } from "./reportConstants";

const SimpananJurnalReportTable = ({ loading, summary }) => {
  const [searchAkun, setSearchAkun] = useState("");
  const [searchDeskripsi, setSearchDeskripsi] = useState("");
  const [searchDebet, setSearchDebet] = useState("");
  const [searchKredit, setSearchKredit] = useState("");

  const rows = useMemo(() => [
    { akun: "110-01", deskripsi: "Kas/Bank Simpanan", isSub: false, debet: summary.total_all, kredit: null },
    { akun: "310-01", deskripsi: "Simpanan Pokok", isSub: true, debet: null, kredit: summary.total_pokok },
    { akun: "310-02", deskripsi: "Simpanan Wajib", isSub: true, debet: null, kredit: summary.total_wajib },
    { akun: "210-01", deskripsi: "Simpanan Sukarela", isSub: true, debet: null, kredit: summary.total_sukarela },
  ], [summary]);

  const filteredRows = useMemo(() => {
    return rows.filter((r) => {
      const matchAkun = !searchAkun.trim() || r.akun.toLowerCase().includes(searchAkun.toLowerCase());
      const matchDeskripsi = !searchDeskripsi.trim() || r.deskripsi.toLowerCase().includes(searchDeskripsi.toLowerCase());
      const debetStr = r.debet != null ? formatRupiah(r.debet).toLowerCase() : "";
      const matchDebet = !searchDebet.trim() || debetStr.includes(searchDebet.toLowerCase()) || String(r.debet || "").includes(searchDebet);
      const kreditStr = r.kredit != null ? formatRupiah(r.kredit).toLowerCase() : "";
      const matchKredit = !searchKredit.trim() || kreditStr.includes(searchKredit.toLowerCase()) || String(r.kredit || "").includes(searchKredit);
      return matchAkun && matchDeskripsi && matchDebet && matchKredit;
    });
  }, [rows, searchAkun, searchDeskripsi, searchDebet, searchKredit]);

  return (
    <div className="table-responsive border rounded-3">
      <Table className="table table-striped table-hover table-bordered align-middle mb-0 text-nowrap compact-table">
        <thead>
          <tr>
            <th className="text-start" style={{ width: "120px" }}>Akun</th>
            <th className="text-start">Deskripsi</th>
            <th className="num-cell" style={{ width: "200px" }}>Debet</th>
            <th className="num-cell" style={{ width: "200px" }}>Kredit</th>
          </tr>
          <tr>
            <th className="p-1" style={{ fontWeight: "normal" }}>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Cari Akun"
                value={searchAkun}
                onChange={(e) => setSearchAkun(e.target.value)}
              />
            </th>
            <th className="p-1" style={{ fontWeight: "normal" }}>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Cari Deskripsi"
                value={searchDeskripsi}
                onChange={(e) => setSearchDeskripsi(e.target.value)}
              />
            </th>
            <th className="p-1" style={{ fontWeight: "normal" }}>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Cari Debet"
                value={searchDebet}
                onChange={(e) => setSearchDebet(e.target.value)}
              />
            </th>
            <th className="p-1" style={{ fontWeight: "normal" }}>
              <input
                type="text"
                className="compact-search-input"
                placeholder="Cari Kredit"
                value={searchKredit}
                onChange={(e) => setSearchKredit(e.target.value)}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <Spinner animation="border" size="sm" />{" "}
                <span className="text-muted ms-2">Memuat data...</span>
              </td>
            </tr>
          ) : filteredRows.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Tidak ada data jurnal yang sesuai dengan pencarian
              </td>
            </tr>
          ) : (
            <>
              {filteredRows.map((row) => (
                <tr key={row.akun}>
                  <td>{row.akun}</td>
                  <td className={row.isSub ? "ps-4" : ""}>{row.deskripsi}</td>
                  <td className="num-cell">{row.debet != null ? formatRupiah(row.debet) : "-"}</td>
                  <td className="num-cell">{row.kredit != null ? formatRupiah(row.kredit) : "-"}</td>
                </tr>
              ))}
              <tr className="fw-bold thead-sticky">
                <td colSpan="2" className="text-center">
                  Total
                </td>
                <td className="num-cell">{formatRupiah(summary.total_all)}</td>
                <td className="num-cell">{formatRupiah(summary.total_all)}</td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SimpananJurnalReportTable;
