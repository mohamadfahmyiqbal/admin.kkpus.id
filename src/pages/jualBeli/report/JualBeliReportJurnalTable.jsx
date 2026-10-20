import React from "react";
import { Table, Spinner } from "react-bootstrap";

const JualBeliReportJurnalTable = ({ jurnal, loading, hasData, formatRupiah }) => {
  return (
    <div className="table-responsive border rounded-3">
      <Table className="table compact-table table-striped table-hover table-bordered align-middle mb-0 text-nowrap custom-table-admin">
        <thead className="table-light text-center sticky-top">
          <tr>
            <th className="text-start">Akun</th>
            <th className="text-start">Deskripsi</th>
            <th className="text-end">Debet</th>
            <th className="text-end">Kredit</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <Spinner animation="border" size="sm" /> Memuat data...
              </td>
            </tr>
          ) : !hasData ? (
            <tr>
              <td colSpan="4" className="text-center text-muted py-4">
                Belum ada data laporan
              </td>
            </tr>
          ) : (
            <>
              <tr>
                <td>110-01</td>
                <td>Kas</td>
                <td className="text-end">{formatRupiah(jurnal.kas)}</td>
                <td className="text-end">-</td>
              </tr>
              <tr>
                <td>112-01</td>
                <td>Piutang Usaha</td>
                <td className="text-end">
                  {formatRupiah(jurnal.piutangJualBeli)}
                </td>
                <td className="text-end">-</td>
              </tr>
              <tr>
                <td>112-02</td>
                <td className="ps-4">HPP (Harga Pokok Penjualan)</td>
                <td className="text-end">-</td>
                <td className="text-end">
                  {formatRupiah(jurnal.piutangPokok)}
                </td>
              </tr>
              <tr className="fw-bold table-light">
                <td colSpan="2" className="text-center">
                  Total
                </td>
                <td className="text-end">
                  {formatRupiah(jurnal.totalDebit)}
                </td>
                <td className="text-end">
                  {formatRupiah(jurnal.totalKredit)}
                </td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default JualBeliReportJurnalTable;
