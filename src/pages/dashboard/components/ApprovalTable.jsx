import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { ArrowRight } from "phosphor-react";
import EmptyState from "../../../components/ui/EmptyState";

const ApprovalTable = ({
  data = [],
  titleField = "item",
  nameField = "name",
  loading,
  emptyMessage,
  onAction,
  onSeeAll,
  seeAllPage,
}) => (
  <>
    <div className="table-responsive">
      <table className="table table-hover align-middle custom-table-admin mb-0 small">
        <thead>
          <tr
            className="text-muted text-uppercase"
            style={{ letterSpacing: "0.5px", fontSize: "0.8rem" }}
          >
            <th className="px-3 py-2 border-0 bg-light rounded-start">Rincian</th>
            <th className="px-3 py-2 border-0 bg-light">Nominal</th>
            <th className="px-3 py-2 border-0 bg-light">Waktu</th>
            <th className="px-3 py-2 text-end border-0 bg-light rounded-end">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan="4" className="text-center py-4 text-muted">
                <Spinner animation="border" size="sm" className="me-2" />
                Memuat data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-0 border-0">
                <EmptyState title="Antrian Kosong" message={emptyMessage} />
              </td>
            </tr>
          ) : (
            data.map((item, idx) => (
              <tr key={item.id || idx}>
                <td className="px-3 py-3 border-bottom-0">
                  <div
                    className="fw-bold text-dark mb-1 text-truncate"
                    style={{ maxWidth: "180px" }}
                  >
                    {item[titleField] || item.full_name || item.item || item.name || "-"}
                  </div>
                  <div
                    className="text-muted text-truncate"
                    style={{ maxWidth: "180px" }}
                  >
                    {item[nameField] || item.status_name || item.name || item.tx_category || "-"}
                  </div>
                </td>
                <td className="px-3 py-3 fw-semibold text-dark border-bottom-0">
                  {item.amount || "-"}
                </td>
                <td className="px-3 py-3 text-muted border-bottom-0">
                  {item.date || "-"}
                </td>
                <td className="px-3 py-3 text-end border-bottom-0">
                  <Button
                    variant="light"
                    size="sm"
                    className="rounded-pill px-3 py-1 shadow-sm border text-primary"
                    style={{ fontWeight: 600 }}
                    onClick={() => onAction(item)}
                  >
                    {item.is_manual_payment ? "Proses" : item.registration_id ? "Review" : "Proses"}
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
    {data.length > 0 && (
      <div className="text-center py-3 border-top mt-2">
        <Button
          variant="link"
          className="text-decoration-none extra-small fw-bold p-0 d-inline-flex align-items-center gap-1"
          onClick={() => onSeeAll(seeAllPage)}
        >
          Lihat Semua <ArrowRight size={14} />
        </Button>
      </div>
    )}
  </>
);

export default ApprovalTable;
