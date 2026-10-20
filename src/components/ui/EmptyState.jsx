import React from "react";
import { motion } from "framer-motion";
import { Package } from "phosphor-react";

export const EmptyState = ({
  icon: Icon = Package,
  title = "Tidak Ada Data",
  message = "Saat ini tidak ada data yang tersedia untuk ditampilkan.",
  action,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="d-flex flex-column align-items-center justify-content-center py-5 text-center"
  >
    <div
      className="mb-3 d-flex align-items-center justify-content-center rounded-circle"
      style={{
        width: "80px",
        height: "80px",
        backgroundColor: "#f8f9fa",
        color: "#adb5bd",
      }}
    >
      <Icon size={40} weight="light" />
    </div>
    <h6 className="fw-bold text-dark mb-1">{title}</h6>
    <p className="text-muted small mb-4" style={{ maxWidth: "300px" }}>
      {message}
    </p>
    {action && <div className="mt-2">{action}</div>}
  </motion.div>
);

export default EmptyState;
