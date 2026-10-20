import React from "react";
import { Table, Spinner } from "react-bootstrap";

export const ModalTab = ({ loading, modalData, formatRupiah }) => (
  <div className="p-3 p-md-4">
    <div className="table-responsive border rounded-3">
      <Table
        striped
        hover
        bordered
        className="align-middle mb-0 text-nowrap custom-table-admin compact-table"
      >
        <thead className="table-light text-center sticky-top">
          <tr>
            <th rowSpan="2" className="align-middle">
              No
            </th>
            <th rowSpan="2" className="align-middle text-start">
              Bulan
            </th>
            <th rowSpan="2" className="align-middle text-start">
              No Transaksi
            </th>
            <th rowSpan="2" className="align-middle text-start">
              PIC
            </th>
            <th rowSpan="2" className="align-middle text-start">
              Keperluan
            </th>
            <th colSpan="3">Jumlah</th>
          </tr>
          <tr>
            <th className="text-end">Debet</th>
            <th className="text-end">Kredit</th>
            <th className="text-end">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="8" className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <div className="mt-2 text-muted">Memuat data...</div>
              </td>
            </tr>
          ) : !modalData || modalData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center text-muted py-4">
                Belum ada data laporan modal
              </td>
            </tr>
          ) : (
            modalData.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="text-center">{idx + 1}</td>
                <td>
                  {item.tanggal
                    ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })
                    : "-"}
                </td>
                <td>{item.no_transaksi}</td>
                <td>{item.pic}</td>
                <td className="text-wrap" style={{ minWidth: "200px" }}>
                  {item.keperluan}
                </td>
                <td className="text-end text-success">
                  {item.jenis === "DEBET" ? formatRupiah(item.jumlah) : "-"}
                </td>
                <td className="text-end text-danger">
                  {item.jenis === "KREDIT" ? formatRupiah(item.jumlah) : "-"}
                </td>
                <td className="text-end fw-bold text-primary">
                  {formatRupiah(item.saldo)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  </div>
);

export default ModalTab;
