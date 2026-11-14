// PATH: src/pages/dashboard/components/DashboardStats.jsx
import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

export const MotionCard = ({ children, className = "", ...props }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
    className={`h-100 ${className}`}
  >
    <Card className="border-0 shadow-sm h-100" {...props}>
      {children}
    </Card>
  </motion.div>
);

const DashboardStats = ({ stats = [], loading = false }) => (
  <Row className="mb-4 g-3">
    {loading && (!stats || stats.length === 0)
      ? Array.from({ length: 6 }).map((_, idx) => (
          <Col md={4} lg={4} className="mb-3" key={`skeleton-${idx}`}>
            <Card className="border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center p-3 placeholder-glow">
                <div
                  className="rounded-3 bg-secondary bg-opacity-10 me-2 flex-shrink-0 placeholder"
                  style={{ width: "40px", height: "40px" }}
                />
                <div className="w-100">
                  <div className="placeholder col-6 mb-2 rounded" style={{ height: "12px" }} />
                  <div className="placeholder col-8 rounded" style={{ height: "18px" }} />
                </div>
              </div>
            </Card>
          </Col>
        ))
      : (Array.isArray(stats) ? stats : []).map((s, idx) => (
          <Col md={4} lg={4} className="mb-3" key={s?.title || idx}>
            <MotionCard>
              <div className="card-body d-flex align-items-center p-3">
                <div
                  className={`p-2 rounded-3 bg-${s?.color || "primary"} bg-opacity-10 text-${s?.color || "primary"} me-2 flex-shrink-0`}
                >
                  {s?.icon}
                </div>
                <div className="overflow-hidden">
                  <h6
                    className="text-muted mb-0 extra-small fw-semibold text-uppercase text-truncate"
                    style={{ letterSpacing: "0.5px" }}
                    title={s?.title || ""}
                  >
                    {s?.title || "-"}
                  </h6>
                  <h5 className="fw-bold mb-0 text-truncate" title={String(s?.value ?? "-")}>
                    {s?.value ?? "-"}
                  </h5>
                </div>
              </div>
            </MotionCard>
          </Col>
        ))}
  </Row>
);

export default DashboardStats;
