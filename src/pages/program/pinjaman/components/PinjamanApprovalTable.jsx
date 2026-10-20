import React from "react";
import { Button } from "react-bootstrap";

const PinjamanApprovalTable = ({
  loading,
  pendingApprovals = [],
  onProcessApproval,
}) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle custom-table-admin mb-0">
        <thead>
          <tr
            className="text-muted text-uppercase"
            style={{ letterSpacing: "0.5px" }}
          >
            <th className="px-4 py-3 border-0 bg-light rounded-start">
              Rincian
            </th>
            <th className="px-4 py-3 border-0 bg-light">Nominal</th>
            <th className="px-4 py-3 border-0 bg-light">Waktu</th>
            <th className="px-4 py-3 text-end border-0 bg-light rounded-end">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-4 text-muted extra-small"
              >
                Memuat data...
              </td>
            </tr>
          ) : pendingApprovals.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="text-center py-4 text-muted extra-small"
              >
                Tidak ada antrian persetujuan
              </td>
            </tr>
          ) : (
            pendingApprovals.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="px-4 py-3 border-bottom-0">
                  <div
                    className="fw-bold text-dark mb-1 text-truncate"
                    style={{ maxWidth: "180px" }}
                  >
                    {item.name}
                  </div>
                  <div
                    className="text-muted text-truncate"
                    style={{ maxWidth: "180px" }}
                  >
                    {item.item}
                  </div>
                </td>
                <td className="px-4 py-3 fw-semibold text-dark border-bottom-0">
                  {item.amount || "-"}
                </td>
                <td className="px-4 py-3 text-muted border-bottom-0">
                  {item.date
                    ? new Date(item.date).toLocaleDateString("id-ID")
                    : "-"}
                </td>
                <td className="px-4 py-3 text-end border-bottom-0">
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-pill px-3 py-1 shadow-sm border text-primary"
                    style={{ fontWeight: 600 }}
                    onClick={() => onProcessApproval(item)}
                  >
                    Proses
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PinjamanApprovalTable;
