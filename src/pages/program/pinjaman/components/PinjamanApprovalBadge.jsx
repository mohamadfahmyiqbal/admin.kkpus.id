import React from "react";
import { Badge } from "react-bootstrap";

export const renderApprovalBadge = (status) => {
  switch (status) {
    case "WAITING_APPROVAL":
      return <Badge bg="warning" text="dark">Menunggu Persetujuan</Badge>;
    case "APPROVED":
      return <Badge bg="success">Disetujui</Badge>;
    case "ACTIVE":
      return <Badge bg="primary">Berjalan</Badge>;
    case "COMPLETED":
      return <Badge bg="info">Selesai</Badge>;
    case "REJECTED":
      return <Badge bg="danger">Ditolak</Badge>;
    default:
      return <Badge bg="secondary">{status || "-"}</Badge>;
  }
};
