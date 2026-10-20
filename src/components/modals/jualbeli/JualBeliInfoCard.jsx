import React from "react";
import { ListGroup, Badge } from "react-bootstrap";
import { Info, User, Tag, CurrencyDollar, Clock } from "phosphor-react";

const JualBeliInfoCard = ({ transaction, formatCurrency, isPelunasan }) => {
  return (
    <div className="mb-4">
      <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
        <Info size={18} className="text-muted" />
        Informasi Pengajuan
      </h6>
      <ListGroup
        variant="flush"
        className="border rounded-4 overflow-hidden bg-white shadow-sm"
        style={{ borderColor: "#f1f5f9" }}
      >
        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <User size={18} weight="fill" />
            </div>
            <span className="text-muted small fw-medium">Nama Anggota</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {transaction.member_name || transaction.name}
            </p>
            <span className="text-muted small">
              ID:{" "}
              {transaction.member_id?.substring(0, 8) ||
                transaction.id?.substring(0, 8)}
            </span>
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <Tag size={18} weight="fill" />
            </div>
            <span className="text-muted small fw-medium">Nama Barang</span>
          </div>
          <div className="text-end">
            <span className="fw-bold text-dark small d-block">
              {transaction.item_name ||
                transaction.item ||
                transaction.category}
            </span>
            {transaction.category &&
              transaction.category !==
                (transaction.item_name || transaction.item) && (
                <span className="text-muted small">
                  {transaction.category}
                </span>
              )}
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <CurrencyDollar size={18} weight="fill" />
            </div>
            <span className="text-muted small fw-medium">Harga & DP</span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {formatCurrency(transaction.amount_requested)}
            </p>
            <span className="text-success fw-bold small">
              DP: {formatCurrency(transaction.down_payment)}
            </span>
          </div>
        </ListGroup.Item>

        <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center border-bottom border-light bg-transparent">
          <div className="d-flex align-items-center gap-3">
            <div
              className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
              style={{ width: "36px", height: "36px" }}
            >
              <CurrencyDollar size={18} weight="fill" />
            </div>
            <span className="text-muted small fw-medium">
              Biaya Operasional
            </span>
          </div>
          <div className="text-end">
            <p className="mb-0 fw-bold text-dark small">
              {formatCurrency(transaction.operational_cost || 0)}
            </p>
          </div>
        </ListGroup.Item>

        {!isPelunasan && (
          <ListGroup.Item className="px-4 py-3 d-flex justify-content-between align-items-center bg-transparent border-0">
            <div className="d-flex align-items-center gap-3">
              <div
                className="bg-light p-2 rounded-circle text-secondary d-flex align-items-center justify-content-center"
                style={{ width: "36px", height: "36px" }}
              >
                <Clock size={18} weight="fill" />
              </div>
              <span className="text-muted small fw-medium">Tenor</span>
            </div>
            <div className="text-end">
              <Badge
                bg="info"
                className="bg-opacity-10 text-info fw-bold border-0 px-3 py-2 rounded-pill small"
              >
                {transaction.tenure} Bulan
              </Badge>
              <span className="text-muted d-block mt-1 small">
                {formatCurrency(transaction.monthly_installment)}/bln
              </span>
            </div>
          </ListGroup.Item>
        )}
      </ListGroup>
    </div>
  );
};

export default JualBeliInfoCard;
