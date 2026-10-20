import React from "react";
import { Table, Spinner } from "react-bootstrap";
import { formatRupiah } from "./reportConstants";

const SimpananJurnalReportTable = ({ loading, summary }) => {
  return (
    <div className="table-responsive border rounded-3">
      <Table className="table table-striped table-hover table-bordered align-middle mb-0 text-nowrap compact-table">
        <thead>
          <tr>
            <th className="text-start">Akun</th>
            <th className="text-start">Deskripsi</th>
            <th className="num-cell">Debet</th>
            <th className="num-cell">Kredit</th>
          </tr>
          <tr>
            {["", "Cari Deskripsi", "Cari Debet", "Cari Kredit"].map(
              (placeholder, idx) => (
                <th key={idx} className="p-1" style={{ fontWeight: "normal" }}>
                  {idx > 0 && (
                    <input
                      type="text"
                      className="compact-search-input"
                      placeholder={placeholder}
                    />
                  )}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center">
                <Spinner animation="border" size="sm" />{" "}
                <span className="text-muted">Memuat data...</span>
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td>110-01</td>
                <td>Kas/Bank Simpanan</td>
                <td className="num-cell">{formatRupiah(summary.total_all)}</td>
                <td className="num-cell">-</td>
              </tr>
              <tr>
                <td>310-01</td>
                <td className="ps-4">Simpanan Pokok</td>
                <td className="num-cell">-</td>
                <td className="num-cell">{formatRupiah(summary.total_pokok)}</td>
              </tr>
              <tr>
                <td>310-02</td>
                <td className="ps-4">Simpanan Wajib</td>
                <td className="num-cell">-</td>
                <td className="num-cell">{formatRupiah(summary.total_wajib)}</td>
              </tr>
              <tr>
                <td>210-01</td>
                <td className="ps-4">Simpanan Sukarela</td>
                <td className="num-cell">-</td>
                <td className="num-cell">
                  {formatRupiah(summary.total_sukarela)}
                </td>
              </tr>
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
