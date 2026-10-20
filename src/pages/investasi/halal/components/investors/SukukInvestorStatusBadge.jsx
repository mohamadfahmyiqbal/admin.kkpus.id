import React from "react";
import { Badge } from "react-bootstrap";

export const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

export const SukukInvestorStatusBadge = ({ status }) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-medium">
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge bg="primary" className="px-3 py-2 rounded-pill fw-medium shadow-sm">
          Disetujui
        </Badge>
      );
    case "PAID":
      return (
        <Badge bg="success" className="px-3 py-2 rounded-pill fw-medium shadow-sm">
          Lunas
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge bg="danger" className="px-3 py-2 rounded-pill fw-medium shadow-sm">
          Ditolak
        </Badge>
      );
    case "WITHDRAWAL_REQUESTED":
      return (
        <Badge bg="info" className="px-3 py-2 rounded-pill fw-medium shadow-sm">
          Pencairan Diproses
        </Badge>
      );
    case "WITHDRAWN":
      return (
        <Badge bg="success" className="px-3 py-2 rounded-pill fw-medium shadow-sm">
          Sudah Dicairkan
        </Badge>
      );
    default:
      return (
        <Badge bg="secondary" className="px-3 py-2 rounded-pill fw-medium">
          {status}
        </Badge>
      );
  }
};
