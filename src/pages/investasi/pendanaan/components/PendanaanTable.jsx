import React from "react";
import { Table, Badge } from "react-bootstrap";
import { Eye, Table as TableIcon, CheckCircle, SmileyMeh } from "phosphor-react";

const PendanaanTable = ({
  items = [],
  isApproval = false,
  formatCurrency,
  onDetail,
  onSetoran,
  onApproval,
}) => {
  return (
    <div className="table-responsive mt-3 jb-table-wrapper border">
      <Table
        className="custom-table-admin align-middle mb-0"
        borderless
        hover
      >
        <thead>
          <tr className="bg-light">
            <th className="px-4 py-3 text-muted fw-bold text-center">Action</th>
            <th className="py-3 text-muted fw-bold">Anggota</th>
            <th className="py-3 text-muted fw-bold">Nama Usaha (Item)</th>
            <th className="py-3 text-muted fw-bold text-end">
              Total Pembiayaan
            </th>
            <th className="py-3 text-muted fw-bold text-end">
              Bagi Hasil / Margin
            </th>
            <th className="py-3 text-muted fw-bold text-center">Tenor</th>
            <th className="py-3 text-muted fw-bold text-end">Cicilan/Bln</th>
            <th className="py-3 text-muted fw-bold text-end">Piutang</th>
            <th className="py-3 text-muted fw-bold text-end">Sisa Cicilan</th>
            <th className="px-4 py-3 text-muted fw-bold text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan="10" className="text-center py-5 text-muted">
                <div className="d-flex flex-column align-items-center">
                  <span className="mb-3 p-3 bg-light rounded-circle text-muted">
                    <SmileyMeh size={32} />
                  </span>
                  <h6 className="fw-semibold">Tidak ada transaksi</h6>
                  <small>Belum ada data transaksi Pendanaan Syariah.</small>
                </div>
              </td>
            </tr>
          ) : (
            items.map((item) => (
              <tr
                key={item.id || item.financing_id}
                className="border-bottom"
              >
                <td className="px-4 text-center py-3">
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
                      title="Lihat Detail"
                      onClick={() => onDetail(item)}
                    >
                      <Eye size={16} weight="bold" />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-success rounded-circle p-2 d-flex align-items-center justify-content-center"
                      title="Tabel Setoran"
                      onClick={() => onSetoran(item)}
                    >
                      <TableIcon size={16} weight="bold" />
                    </button>
                    {isApproval && item.status === "PENDING" && (
                      <button
                        className="btn btn-sm btn-outline-warning rounded-circle p-2 d-flex align-items-center justify-content-center"
                        title="Proses Approval"
                        onClick={() => onApproval(item)}
                      >
                        <CheckCircle size={16} weight="bold" />
                      </button>
                    )}
                  </div>
                </td>
                <td className="py-3">
                  <span className="fw-bold text-dark">
                    {item.nama_nasabah ||
                      item.member_name ||
                      item.user_id ||
                      "-"}
                  </span>
                </td>
                <td className="py-3">
                  <span className="fw-bold text-dark">
                    {item.item_name || "-"}
                  </span>
                </td>
                <td className="text-end py-3">
                  <span className="fw-bold text-dark">
                    {formatCurrency(
                      Number(item.item_price || item.amount_requested || 0) +
                        Number(item.operational_cost || 0)
                    )}
                  </span>
                </td>
                <td className="text-end py-3">
                  <span className="fw-bold text-success">
                    {formatCurrency(item.margin_amount || 0)}
                  </span>
                </td>
                <td className="text-center py-3">
                  <span className="fw-bold text-dark">
                    {item.cooperation_months} Bln
                  </span>
                </td>
                <td className="text-end py-3">
                  <span className="fw-bold text-dark">
                    {formatCurrency(item.monthly_installment || 0)}
                  </span>
                </td>
                <td className="text-end py-3">
                  <span className="fw-bold text-dark">
                    {formatCurrency(
                      Number(item.item_price || item.amount_requested || 0) +
                        Number(item.operational_cost || 0) -
                        Number(item.down_payment || 0) +
                        Number(item.margin_amount || 0)
                    )}
                  </span>
                </td>
                <td className="text-end py-3">
                  <span className="fw-bold text-dark">
                    {formatCurrency(
                      Number(item.item_price || item.amount_requested || 0) +
                        Number(item.operational_cost || 0) +
                        Number(item.margin_amount || 0) -
                        Number(item.paid_amount || 0)
                    )}
                  </span>
                </td>
                <td className="px-4 text-center py-3">
                  <Badge
                    bg={
                      item.status === "APPROVED"
                        ? "success"
                        : item.status === "PENDING"
                        ? "warning"
                        : "secondary"
                    }
                    className={`px-3 py-2 bg-opacity-10 text-${
                      item.status === "APPROVED"
                        ? "success"
                        : item.status === "PENDING"
                        ? "warning"
                        : "secondary"
                    } border border-${
                      item.status === "APPROVED"
                        ? "success"
                        : item.status === "PENDING"
                        ? "warning"
                        : "secondary"
                    } border-opacity-25 rounded-pill`}
                  >
                    {item.status}
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default PendanaanTable;
