import React from "react";
import { Table, Spinner } from "react-bootstrap";

export const ArisanJurnalTab = ({ loading, jurnal = {}, formatRupiah }) => {
  const debitTotal =
    (jurnal.totalSetoran || 0) +
    (jurnal.totalPenarikan || 0) +
    (jurnal.totalProgram || 0);
  const kreditTotal = debitTotal;

  return (
    <div className="p-3 p-md-4">
      <div className="table-responsive border-0 shadow-sm rounded-4">
        <Table
          hover
          borderless
          className="align-middle mb-0 custom-table-admin compact-table"
        >
          <thead className="table-light sticky-top" style={{ zIndex: 2 }}>
            <tr>
              <th
                className="align-middle font-medium text-muted small text-start border-bottom border-end"
                style={{ width: "100px" }}
              >
                Akun
              </th>
              <th className="align-middle font-medium text-muted small text-start border-bottom border-end">
                Deskripsi
              </th>
              <th className="align-middle font-medium text-muted small text-end border-bottom">
                Debit
              </th>
              <th className="align-middle font-medium text-muted small text-end border-bottom">
                Kredit
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted fw-medium small">
                    Memuat data jurnal...
                  </div>
                </td>
              </tr>
            ) : Object.keys(jurnal).length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center bg-light py-5">
                  <div className="d-flex flex-column align-items-center justify-content-center">
                    <h6 className="fw-bold text-dark mb-1">Belum ada data jurnal</h6>
                    <p className="small text-muted mb-0">
                      Data jurnal arisan akan muncul di sini
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="fw-medium text-dark border-end" style={{ backgroundColor: "#fff" }}>
                    Setoran Cicilan Arisan
                  </td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalSetoran || 0)}
                  </td>
                  <td className="text-end text-muted">-</td>
                </tr>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="ps-5 fw-medium text-muted border-end" style={{ backgroundColor: "#fff" }}>
                    Kas
                  </td>
                  <td className="text-end text-muted">-</td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalSetoran || 0)}
                  </td>
                </tr>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="fw-medium text-dark border-end" style={{ backgroundColor: "#fff" }}>
                    Program Arisan
                  </td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalPenarikan || 0)}
                  </td>
                  <td className="text-end text-muted">-</td>
                </tr>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="ps-5 fw-medium text-muted border-end" style={{ backgroundColor: "#fff" }}>
                    Penarikan Dana Arisan
                  </td>
                  <td className="text-end text-muted">-</td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalPenarikan || 0)}
                  </td>
                </tr>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="fw-medium text-dark border-end" style={{ backgroundColor: "#fff" }}>
                    Program Arisan
                  </td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalProgram || 0)}
                  </td>
                  <td className="text-end text-muted">-</td>
                </tr>
                <tr className="align-middle border-bottom" style={{ borderColor: "#f8fafc" }}>
                  <td className="text-muted border-end text-center" style={{ backgroundColor: "#fff" }}>
                    -
                  </td>
                  <td className="ps-5 fw-medium text-muted border-end" style={{ backgroundColor: "#fff" }}>
                    Kas
                  </td>
                  <td className="text-end text-muted">-</td>
                  <td className="text-end fw-bold text-dark">
                    {formatRupiah(jurnal.totalProgram || 0)}
                  </td>
                </tr>
              </>
            )}
          </tbody>
          {Object.keys(jurnal).length > 0 && (
            <tfoot className="fw-bold" style={{ backgroundColor: "#f1f5f9" }}>
              <tr>
                <td colSpan="2" className="text-end text-uppercase small text-muted letter-spacing-1 border-end">
                  Total Keseluruhan
                </td>
                <td className="text-end text-dark fs-6">{formatRupiah(debitTotal)}</td>
                <td className="text-end text-dark fs-6">{formatRupiah(kreditTotal)}</td>
              </tr>
            </tfoot>
          )}
        </Table>
      </div>
    </div>
  );
};

export default ArisanJurnalTab;
