import React from "react";
import { Button, Badge } from "react-bootstrap";
import { Users, Confetti, PencilSimple, Trash } from "phosphor-react";

export const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

export const getStatusBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return <Badge bg="primary">ACTIVE</Badge>;
    case "OPEN":
      return <Badge bg="success">OPEN</Badge>;
    case "COMPLETED":
      return <Badge bg="dark">COMPLETED</Badge>;
    default:
      return <Badge bg="secondary">{status || "DRAFT"}</Badge>;
  }
};

const ArisanBatchRow = ({
  batch,
  onViewParticipant,
  onViewDraw,
  onEdit,
  onDelete,
}) => {
  const startM = batch.period_start_month
    ? monthNames[batch.period_start_month - 1]
    : "";

  return (
    <tr
      className="border-bottom"
      style={{ borderColor: "#f8fafc" }}
    >
      <td
        className="px-3 py-3 text-center"
        style={{
          position: "sticky",
          left: 0,
          zIndex: 1,
          backgroundColor: "#fff",
          borderRight: "1px solid #e2e8f0",
        }}
      >
        <div className="d-flex justify-content-center gap-1">
          <Button
            variant="light"
            size="sm"
            className="btn-icon text-info rounded-circle border shadow-sm p-1"
            onClick={() => onViewParticipant(batch.arisan_batch_id)}
            title="Kelola Peserta"
          >
            <Users size={18} />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="btn-icon text-warning rounded-circle border shadow-sm p-1"
            onClick={() => onViewDraw(batch)}
            title="Pencairan/Kocokan"
          >
            <Confetti size={18} />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="btn-icon text-primary rounded-circle border shadow-sm p-1"
            onClick={() => onEdit(batch)}
            title="Edit Batch"
          >
            <PencilSimple size={18} />
          </Button>
          <Button
            variant="light"
            size="sm"
            className="btn-icon text-danger rounded-circle border shadow-sm p-1"
            onClick={() => onDelete(batch.arisan_batch_id)}
            title="Hapus Batch"
          >
            <Trash size={18} />
          </Button>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="fw-medium text-dark">{startM}</div>
        <small className="text-muted">{batch.period_start_year}</small>
      </td>
      <td className="px-4 py-3 text-center">
        <span className="badge bg-light text-dark border px-2 py-1 rounded-pill">
          {batch.category || "Arisan"}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="fw-bold text-dark mb-1">
          {batch.program_name}
        </div>
        <div className="text-muted small">
          <span className="fw-medium">Batch:</span> {batch.batch_name}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <Badge
          bg="light"
          text="dark"
          className="border px-2 py-1 rounded-pill fw-medium"
        >
          <Users size={14} className="me-1 text-primary" />
          <span className="text-primary">
            {batch.participant_count || 0}
          </span>{" "}
          / <span className="text-muted">{batch.participants_quota}</span>
        </Badge>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="fw-bold text-dark">
          {batch.cooperation_months}
        </div>
        <small className="text-muted">Bln</small>
      </td>
      <td className="px-4 py-3 text-end">
        <div className="fw-medium">
          {formatCurrency(batch.monthly_installment)}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="fw-bold text-dark">
          {batch.jumlah_keberangkatan || "-"}
        </div>
        <small className="text-muted">Orang</small>
      </td>
      <td className="px-4 py-3 text-end">
        <div className="fw-bold text-success">
          {formatCurrency(batch.target_amount)}
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        {getStatusBadge(batch.status)}
      </td>
    </tr>
  );
};

export default ArisanBatchRow;
