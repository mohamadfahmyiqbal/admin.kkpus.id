import React from "react";
import { Button } from "react-bootstrap";
import { ListDashes } from "phosphor-react";

const DashboardHeader = ({ onOpenLogs }) => (
  <div className="mb-4 d-flex justify-content-between align-items-center">
    <div>
      <h3 className="fw-bold mb-1">Panel Ringkasan Admin</h3>
      <p className="text-muted mb-0">
        Selamat datang kembali, berikut status operasional hari ini.
      </p>
    </div>
    <Button
      variant="primary"
      className="rounded-pill px-4 shadow-sm d-flex align-items-center gap-2"
      onClick={onOpenLogs}
    >
      <ListDashes size={18} /> Log Aktivitas
    </Button>
  </div>
);

export default DashboardHeader;
