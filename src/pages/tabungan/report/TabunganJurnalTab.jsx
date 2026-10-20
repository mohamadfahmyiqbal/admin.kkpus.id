import React from "react";
import { Table, Spinner } from "react-bootstrap";

const TabunganJurnalTab = ({ summaryData = {}, loading, formatRupiah }) => (
  <div className="p-2 p-md-3">
    <div className="table-responsive border rounded-3">
      <Table striped hover bordered className="align-middle mb-0 text-nowrap compact-table">
        <thead className="table-light">
          <tr>
            <th className="text-start">Deskripsi</th>
            <th className="text-end" style={{ width: "200px" }}>
              Debet
            </th>
            <th className="text-end" style={{ width: "200px" }}>
              Kredit
            </th>
            <th className="text-center" style={{ width: "150px" }}>
              Akun
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                <Spinner animation="border" size="sm" />{" "}
                <span className="text-muted">Memuat data...</span>
              </td>
            </tr>
          ) : (
            <>
              <tr className="bg-light">
                <td colSpan="4" className="fw-bold text-primary">
                  a. Pembayaran cicilan tabungan
                </td>
              </tr>
              <tr>
                <td className="ps-4 fw-medium">Kas/Bank Tabungan</td>
                <td className="text-end fw-semibold">
                  {formatRupiah(summaryData.total_saldo || 0)}
                </td>
                <td className="text-end">-</td>
                <td className="text-center">110-02</td>
              </tr>
              {summaryData.categories &&
                Object.keys(summaryData.categories).map((cat) => (
                  <tr key={`a-${cat}`}>
                    <td className="ps-5 text-muted">Tabungan {cat} (Kewajiban)</td>
                    <td className="text-end">-</td>
                    <td className="text-end fw-semibold">
                      {formatRupiah(summaryData.categories[cat])}
                    </td>
                    <td className="text-center">320-01</td>
                  </tr>
                ))}

              <tr className="bg-light">
                <td colSpan="4" className="fw-bold text-primary">
                  b. Jatuh tempo pencairan/penutupan tabungan
                </td>
              </tr>
              {summaryData.categories &&
                Object.keys(summaryData.categories).map((cat) => (
                  <tr key={`b-${cat}`}>
                    <td className="ps-4 fw-medium">Tabungan {cat} (Kewajiban)</td>
                    <td className="text-end fw-semibold">{formatRupiah(0)}</td>
                    <td className="text-end">-</td>
                    <td className="text-center">320-01</td>
                  </tr>
                ))}
              <tr>
                <td className="ps-5 text-muted">Kas/Bank Tabungan</td>
                <td className="text-end">-</td>
                <td className="text-end fw-semibold">{formatRupiah(0)}</td>
                <td className="text-center">110-02</td>
              </tr>

              <tr className="fw-bold bg-secondary text-white">
                <td className="text-center">Total Saldo (Balance)</td>
                <td className="text-end">{formatRupiah(summaryData.total_saldo || 0)}</td>
                <td className="text-end">{formatRupiah(summaryData.total_saldo || 0)}</td>
                <td className="text-center">-</td>
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  </div>
);

export default TabunganJurnalTab;
