import React from "react";
import { Coins } from "phosphor-react";

const PendanaanNominalHeader = ({ amount, formatCurrency }) => {
  return (
    <div
      className="bg-gradient bg-primary bg-opacity-10 p-4 rounded-4 mb-4 position-relative overflow-hidden"
      style={{ border: "1px solid rgba(13, 110, 253, 0.15)" }}
    >
      <div className="position-relative z-1 text-center">
        <p
          className="text-primary small mb-1 text-uppercase fw-bold"
          style={{ letterSpacing: "1px", opacity: 0.8 }}
        >
          Nominal Pendanaan
        </p>
        <h2
          className="fw-bolder text-primary mb-0"
          style={{ letterSpacing: "-0.5px" }}
        >
          {formatCurrency(amount)}
        </h2>
      </div>
      <Coins
        size={100}
        className="position-absolute text-primary"
        style={{
          right: -15,
          bottom: -15,
          opacity: 0.05,
          transform: "rotate(-10deg)",
        }}
        weight="fill"
      />
    </div>
  );
};

export default PendanaanNominalHeader;
