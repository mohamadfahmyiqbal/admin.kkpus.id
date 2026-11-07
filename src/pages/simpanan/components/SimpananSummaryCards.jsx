import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { Wallet, Money, ArrowDownLeft, ArrowUpRight } from "phosphor-react";
import { formatRupiah } from "../../../utils/helpers";

const SimpananSummaryCards = ({ summary = {} }) => {
  const cards = [
    { title: "Total Semua Simpanan", value: summary.total_semua, icon: Wallet, color: "primary" },
    { title: "Total Simpanan Pokok", value: summary.total_pokok, icon: Money, color: "success" },
    { title: "Total Simpanan Wajib", value: summary.total_wajib, icon: ArrowDownLeft, color: "warning" },
    { title: "Total Simpanan Sukarela", value: summary.total_sukarela, icon: ArrowUpRight, color: "info" },
  ];

  return (
    <Row className="g-3 mb-4">
      {cards.map((c, idx) => (
        <Col md={3} sm={6} key={idx}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Body className="p-3 d-flex align-items-center">
              <div className={`bg-${c.color} bg-opacity-10 p-3 rounded-4 me-3 flex-shrink-0`}>
                <c.icon size={24} className={`text-${c.color}`} weight="fill" />
              </div>
              <div className="overflow-hidden">
                <p className="text-muted fw-semibold mb-0 text-truncate small text-uppercase">
                  {c.title}
                </p>
                <h5 className="fw-bold text-dark mb-0 text-truncate mt-1">
                  {formatRupiah(c.value || 0)}
                </h5>
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default SimpananSummaryCards;
