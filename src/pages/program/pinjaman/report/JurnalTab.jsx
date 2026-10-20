import React from "react";
import { Table } from "react-bootstrap";

export const JurnalTab = ({ jurnal, formatRupiah }) => (
  <div className="p-3 p-md-4">
    <div className="row g-4">
      {/* 1. Kas Pinjaman Lunak */}
      <div className="col-12">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header bg-white">
            <h6 className="mb-0 fw-bold text-primary">1. Kas Pinjaman Lunak</h6>
          </div>
          <div className="card-body p-0">
            <Table bordered striped className="mb-0 text-nowrap compact-table">
              <thead className="table-light text-center align-middle">
                <tr>
                  <th rowSpan="2">No</th>
                  <th rowSpan="2">Keterangan</th>
                  <th colSpan="3" className="border-bottom-0">
                    Tahun Berjalan
                  </th>
                </tr>
                <tr>
                  <th>Debet</th>
                  <th>Kredit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Saldo Awal</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.saldo_awal?.kas?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.saldo_awal?.kas?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.saldo_awal?.kas?.total || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Hibah SHU CSR</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.mutasi?.hibah?.total || 0)}
                  </td>
                  <td className="text-end text-danger">{formatRupiah(0)}</td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.mutasi?.hibah?.total || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">3</td>
                  <td>Pengembalian Pinjaman Lunak dari Anggota</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.mutasi?.piutang?.kredit || 0)}
                  </td>
                  <td className="text-end text-danger">{formatRupiah(0)}</td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.mutasi?.piutang?.kredit || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">4</td>
                  <td>Penyaluran Pinjaman Lunak</td>
                  <td className="text-end text-success">{formatRupiah(0)}</td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.mutasi?.piutang?.debet || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    -{formatRupiah(jurnal?.mutasi?.piutang?.debet || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">5</td>
                  <td>Kerugian Pinjaman Lunak</td>
                  <td className="text-end text-success">{formatRupiah(0)}</td>
                  <td className="text-end text-danger">{formatRupiah(0)}</td>
                  <td className="text-end fw-bold text-primary">{formatRupiah(0)}</td>
                </tr>
              </tbody>
              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan="4" className="text-end">
                    Saldo Akhir
                  </td>
                  <td className="text-end text-primary">
                    {formatRupiah(jurnal?.saldo_akhir?.kas?.total || 0)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      {/* 2. Piutang Pinjaman Anggota */}
      <div className="col-12">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header bg-white">
            <h6 className="mb-0 fw-bold text-primary">2. Piutang Pinjaman Anggota</h6>
          </div>
          <div className="card-body p-0">
            <Table bordered striped className="mb-0 text-nowrap compact-table">
              <thead className="table-light text-center align-middle">
                <tr>
                  <th rowSpan="2">No</th>
                  <th rowSpan="2">Keterangan</th>
                  <th colSpan="3" className="border-bottom-0">
                    Tahun Berjalan
                  </th>
                </tr>
                <tr>
                  <th>Debet</th>
                  <th>Kredit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Saldo Awal</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.saldo_awal?.piutang?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.saldo_awal?.piutang?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.saldo_awal?.piutang?.total || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Penyaluran Pinjaman Lunak</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.mutasi?.piutang?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">{formatRupiah(0)}</td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.mutasi?.piutang?.debet || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">3</td>
                  <td>Pengembalian Pinjaman Lunak dari Anggota</td>
                  <td className="text-end text-success">{formatRupiah(0)}</td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.mutasi?.piutang?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    -{formatRupiah(jurnal?.mutasi?.piutang?.kredit || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">4</td>
                  <td>Kerugian Pinjaman Lunak</td>
                  <td className="text-end text-success">{formatRupiah(0)}</td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.mutasi?.beban?.total || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    -{formatRupiah(jurnal?.mutasi?.beban?.total || 0)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan="4" className="text-end">
                    Saldo Akhir
                  </td>
                  <td className="text-end text-primary">
                    {formatRupiah(jurnal?.saldo_akhir?.piutang?.total || 0)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      {/* 3. Hibah dari SHU (CSR Modal) */}
      <div className="col-12">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header bg-white">
            <h6 className="mb-0 fw-bold text-primary">3. Hibah dari SHU (CSR Modal)</h6>
          </div>
          <div className="card-body p-0">
            <Table bordered striped className="mb-0 text-nowrap compact-table">
              <thead className="table-light text-center align-middle">
                <tr>
                  <th rowSpan="2">No</th>
                  <th rowSpan="2">Keterangan</th>
                  <th colSpan="3" className="border-bottom-0">
                    Tahun Berjalan
                  </th>
                </tr>
                <tr>
                  <th>Debet</th>
                  <th>Kredit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Saldo Awal</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.saldo_awal?.hibah?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.saldo_awal?.hibah?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.saldo_awal?.hibah?.total || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Hibah SHU CSR</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.mutasi?.hibah?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.mutasi?.hibah?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.mutasi?.hibah?.total || 0)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan="4" className="text-end">
                    Saldo Akhir
                  </td>
                  <td className="text-end text-primary">
                    {formatRupiah(jurnal?.saldo_akhir?.hibah?.total || 0)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>

      {/* 4. Beban Hutang Pinjaman Tak Tertagih */}
      <div className="col-12">
        <div className="card shadow-sm border-0 h-100">
          <div className="card-header bg-white">
            <h6 className="mb-0 fw-bold text-primary">
              4. Beban Hutang Pinjaman Tak Tertagih
            </h6>
          </div>
          <div className="card-body p-0">
            <Table bordered striped className="mb-0 text-nowrap compact-table">
              <thead className="table-light text-center align-middle">
                <tr>
                  <th rowSpan="2">No</th>
                  <th rowSpan="2">Keterangan</th>
                  <th colSpan="3" className="border-bottom-0">
                    Tahun Berjalan
                  </th>
                </tr>
                <tr>
                  <th>Debet</th>
                  <th>Kredit</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>Saldo Awal</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.saldo_awal?.beban?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.saldo_awal?.beban?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.saldo_awal?.beban?.total || 0)}
                  </td>
                </tr>
                <tr>
                  <td className="text-center">2</td>
                  <td>Kerugian Pinjaman Lunak</td>
                  <td className="text-end text-success">
                    {formatRupiah(jurnal?.mutasi?.beban?.debet || 0)}
                  </td>
                  <td className="text-end text-danger">
                    {formatRupiah(jurnal?.mutasi?.beban?.kredit || 0)}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(jurnal?.mutasi?.beban?.total || 0)}
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-light fw-bold">
                <tr>
                  <td colSpan="4" className="text-end">
                    Saldo Akhir
                  </td>
                  <td className="text-end text-primary">
                    {formatRupiah(jurnal?.saldo_akhir?.beban?.total || 0)}
                  </td>
                </tr>
              </tfoot>
            </Table>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default JurnalTab;
