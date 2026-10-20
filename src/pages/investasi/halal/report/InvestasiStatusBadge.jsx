import React from "react";
import { Badge } from "react-bootstrap";

const InvestasiStatusBadge = ({ status }) => {
  switch (status) {
    case "PENDING":
      return (
        <Badge bg="warning" text="dark" className="rounded-pill fw-medium shadow-sm">
          Pending
        </Badge>
      );
    case "APPROVED":
      return (
        <Badge bg="primary" className="rounded-pill fw-medium shadow-sm">
          Disetujui
        </Badge>
      );
    case "PAID":
      return (
        <Badge bg="success" className="rounded-pill fw-medium shadow-sm">
          Lunas
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge bg="danger" className="rounded-pill fw-medium shadow-sm">
          Ditolak
        </Badge>
      );
    default:
      return (
        <Badge bg="secondary" className="rounded-pill fw-medium shadow-sm">
          {status}
        </Badge>
      );
  }
};

export default InvestasiStatusBadge;
