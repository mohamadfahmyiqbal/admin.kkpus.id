import React from "react";
import { Table } from "react-bootstrap";

export const NeracaTab = ({ jurnal, formatRupiah }) => {
  const kasTotal = jurnal?.saldo_akhir?.kas?.total || 0;
  const piutangTotal = jurnal?.saldo_akhir?.piutang?.total || 0;
  const hibahTotal = jurnal?.saldo_akhir?.hibah?.total || 0;
  const bebanTotal = jurnal?.saldo_akhir?.beban?.total || 0;
  const hutangTotal = jurnal?.saldo_akhir?.hutang?.total || 0;
  const aktivaTetapTotal = jurnal?.saldo_akhir?.aktiva_tetap?.total || 0;

  const totalAktivaLancar = kasTotal + piutangTotal;
  const totalAktiva = totalAktivaLancar + aktivaTetapTotal;
  const totalPasiva = hutangTotal + hibahTotal - bebanTotal;

  return (
    <div className="p-3 p-md-4">
      <div className="row g-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
            <div className="table-responsive">
              <Table bordered className="mb-0 compact-table">
                <thead className="table-light align-middle">
                  <tr>
                    <th>Keterangan</th>
                    <th className="text-end">Tahun Berjalan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="table-light">
                    <td colSpan="2" className="fw-bold text-primary">
                      AKTIVA
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="fw-medium text-dark bg-light">
                      Aktiva Lancar
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-5">Kas Pinjaman Lunak</td>
                    <td className="text-end fw-medium">{formatRupiah(kasTotal)}</td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-5">
                      Piutang Pinjaman Lunak Anggota
                    </td>
                    <td className="text-end fw-medium">{formatRupiah(piutangTotal)}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-end">Total Aktiva Lancar</td>
                    <td className="text-end fw-bold">
                      {formatRupiah(totalAktivaLancar)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-dark bg-light border-top">
                      Total Aktiva Tetap
                    </td>
                    <td className="text-end fw-bold bg-light border-top">
                      {formatRupiah(aktivaTetapTotal)}
                    </td>
                  </tr>
                  <tr className="table-light">
                    <td className="fw-bold">Total Aktiva</td>
                    <td className="text-end fw-bold text-primary">
                      {formatRupiah(totalAktiva)}
                    </td>
                  </tr>

                  <tr className="table-light">
                    <td colSpan="2" className="fw-bold text-primary border-top">
                      PASIVA
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="fw-medium text-dark bg-light border-top">
                      Hutang
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-5">Hutang Kas</td>
                    <td className="text-end fw-medium">{formatRupiah(hutangTotal)}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-end">Total Hutang</td>
                    <td className="text-end fw-bold">{formatRupiah(hutangTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="fw-medium text-dark bg-light border-top">
                      Modal
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-5">Modal Pinjaman Lunak</td>
                    <td className="text-end fw-medium">{formatRupiah(hibahTotal)}</td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-end">Total Modal</td>
                    <td className="text-end fw-bold">{formatRupiah(hibahTotal)}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="fw-medium text-dark bg-light border-top">
                      Beban
                    </td>
                  </tr>
                  <tr>
                    <td className="text-muted ps-5">
                      Beban Pinjaman Tak Tertagih
                    </td>
                    <td className="text-end fw-medium">
                      -{formatRupiah(bebanTotal)}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-medium text-end">Total Beban</td>
                    <td className="text-end fw-bold">
                      -{formatRupiah(bebanTotal)}
                    </td>
                  </tr>
                  <tr className="table-light">
                    <td className="fw-bold">Total Pasiva</td>
                    <td className="text-end fw-bold text-primary">
                      {formatRupiah(totalPasiva)}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeracaTab;
