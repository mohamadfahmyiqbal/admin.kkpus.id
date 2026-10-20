import React from "react";
import { Table, Badge } from "react-bootstrap";
import { Eye, Coins, CheckCircle } from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";

const JualBeliTable = ({
  list = [],
  isApprovalTab = false,
  formatRp,
  onViewDetail,
  onViewSetoran,
  onApprove,
}) => {
  return (
    <div
      className="table-responsive mt-3 jb-table-wrapper border"
      style={{ width: "100%", overflowX: "auto" }}
    >
      <Table
        className="custom-table-admin align-middle mb-0 text-nowrap"
        borderless
        style={{ whiteSpace: "nowrap", minWidth: "1200px" }}
      >
        <thead>
          <tr>
            <th className="px-4 py-3 text-muted fw-bold text-center">Action</th>
            <th className="py-3 text-muted fw-bold">Anggota</th>
            <th className="py-3 text-muted fw-bold">Type</th>
            <th className="py-3 text-muted fw-bold">Nama Barang</th>
            <th className="py-3 text-muted fw-bold text-end">Total Jual Beli</th>
            <th className="py-3 text-muted fw-bold text-end">DP</th>
            <th className="py-3 text-muted fw-bold text-center">Tenor</th>
            <th className="py-3 text-muted fw-bold text-center">Sisa Tenor</th>
            <th className="py-3 text-muted fw-bold text-end">Cicilan</th>
            <th className="py-3 text-muted fw-bold text-end">Piutang</th>
            <th className="py-3 text-muted fw-bold text-end">Diskon Pelunasan</th>
            <th className="py-3 text-muted fw-bold text-end">Sisa Cicilan</th>
            <th className="px-4 py-3 text-muted fw-bold text-center">
              Status Cicilan
            </th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="13" className="p-0 border-0">
                <EmptyState
                  title="Tidak ada transaksi"
                  message="Belum ada data transaksi untuk ditampilkan."
                />
              </td>
            </tr>
          ) : (
            list.map((tx) => {
              const isCompleted =
                tx.status === "LUNAS" ||
                tx.status === "COMPLETED" ||
                tx.status === "PAID";
              const totalReq =
                Number(tx.item_price || tx.amount_requested || 0) +
                Number(tx.operational_cost || 0);
              const margin = Number(tx.margin_amount || 0);
              const dp = Number(tx.down_payment || 0);
              const totalJualBeli = totalReq + margin;
              const piutang = totalJualBeli - dp;
              const paidAmount = Number(tx.paid_amount || 0);
              const installment = Number(tx.monthly_installment || 1);
              let discount = Number(tx.discount || 0);
              let sisaCicilan = totalJualBeli - paidAmount - discount;

              if (isCompleted && sisaCicilan > 0) {
                discount += sisaCicilan;
                sisaCicilan = 0;
              }

              const sisaTenor =
                tx.sisa_tenor === undefined
                  ? Math.max(
                      0,
                      tx.cooperation_months -
                        Math.floor(Math.max(0, paidAmount - dp) / installment)
                    )
                  : tx.sisa_tenor;

              const isTxApproved =
                tx.status === "APPROVED" ||
                tx.status === "PAID" ||
                tx.status === "COMPLETED" ||
                tx.status === "LUNAS" ||
                tx.status === "ACTIVE";

              return (
                <tr key={tx.id || tx.financing_id}>
                  <td className="px-4 text-center py-3">
                    <div className="d-flex justify-content-center gap-2">
                      <button
                        className="btn-action-light text-primary"
                        title="Lihat Detail"
                        onClick={() => onViewDetail(tx)}
                      >
                        <Eye size={18} weight="bold" />
                      </button>
                      <button
                        className="btn-action-light text-success"
                        title="Tabel Setoran"
                        onClick={() => onViewSetoran(tx)}
                      >
                        <Coins size={18} weight="bold" />
                      </button>
                      {isApprovalTab && tx.status === "PENDING" && (
                        <button
                          className="btn-action-light text-warning"
                          title="Proses Approval"
                          onClick={() => onApprove(tx)}
                        >
                          <CheckCircle size={18} weight="bold" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {tx.nama_nasabah ||
                        tx.member_name ||
                        tx.user_id ||
                        "-"}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="text-muted jb-text-sub">
                      {tx.category || "-"}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {tx.item_name || "-"}
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {formatRp(totalJualBeli)}
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {formatRp(dp)}
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {tx.cooperation_months} Bln
                    </span>
                  </td>
                  <td className="text-center py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {sisaTenor} Bln
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {formatRp(installment)}
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {formatRp(piutang)}
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-success jb-text-main">
                      {formatRp(discount)}
                    </span>
                  </td>
                  <td className="text-end py-3">
                    <span className="fw-bold text-dark jb-text-main">
                      {formatRp(sisaCicilan)}
                    </span>
                  </td>
                  <td className="px-4 text-center py-3">
                    <Badge
                      bg={
                        isTxApproved
                          ? "success"
                          : tx.status === "PENDING"
                          ? "warning"
                          : "secondary"
                      }
                      className={`px-3 py-2 jb-badge-text bg-opacity-10 text-${
                        isTxApproved
                          ? "success"
                          : tx.status === "PENDING"
                          ? "warning"
                          : "secondary"
                      } border border-${
                        isTxApproved
                          ? "success"
                          : tx.status === "PENDING"
                          ? "warning"
                          : "secondary"
                      } border-opacity-25`}
                    >
                      {tx.status}
                    </Badge>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default JualBeliTable;
