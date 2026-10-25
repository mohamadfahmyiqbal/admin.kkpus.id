import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Users, CheckCircle, ShieldCheck, Clock } from "phosphor-react";

const MembersStats = ({ members = [], loading = false }) => {
  const total = members.length;
  const regulerCount = members.filter((m) =>
    String(m.member_type || "").toLowerCase().includes("reguler")
  ).length;
  const luarBiasaCount = members.filter((m) =>
    String(m.member_type || "").toLowerCase().includes("luar biasa")
  ).length;
  const aktifCount = members.filter(
    (m) => String(m.status?.status_name || "").toUpperCase() === "AKTIF"
  ).length;

  const stats = [
    {
      title: "Total Anggota",
      value: loading ? "..." : total,
      icon: <Users size={24} weight="duotone" />,
      color: "primary",
      bgLight: "bg-primary bg-opacity-10 text-primary",
    },
    {
      title: "Anggota Aktif",
      value: loading ? "..." : aktifCount,
      icon: <CheckCircle size={24} weight="duotone" />,
      color: "success",
      bgLight: "bg-success bg-opacity-10 text-success",
    },
    {
      title: "Anggota Reguler",
      value: loading ? "..." : regulerCount,
      icon: <ShieldCheck size={24} weight="duotone" />,
      color: "info",
      bgLight: "bg-info bg-opacity-10 text-info",
    },
    {
      title: "Anggota Luar Biasa",
      value: loading ? "..." : luarBiasaCount,
      icon: <Clock size={24} weight="duotone" />,
      color: "warning",
      bgLight: "bg-warning bg-opacity-10 text-warning",
    },
  ];

  return (
    <Row className="g-3 mb-4">
      {stats.map((item, idx) => (
        <Col key={idx} xs={6} lg={3}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-3 d-flex align-items-center gap-3">
              <div
                className={`rounded-3 d-flex align-items-center justify-content-center p-2.5 ${item.bgLight}`}
                style={{ width: "48px", height: "48px", flexShrink: 0 }}
              >
                {item.icon}
              </div>
              <div className="overflow-hidden">
                <p className="text-muted small mb-0 text-truncate">{item.title}</p>
                <h4 className="fw-bold mb-0 text-dark">{item.value}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default React.memo(MembersStats);
