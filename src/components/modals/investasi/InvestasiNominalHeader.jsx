import React from "react";
import { Receipt } from "phosphor-react";

const InvestasiNominalHeader = ({ amount, formatCurrency }) => (
  <div
    className="bg-gradient bg-success bg-opacity-10 p-4 rounded-4 mb-4 position-relative overflow-hidden"
    style={{ border: "1px solid rgba(25, 135, 84, 0.15)" }}
  >
    <div className="position-relative z-1 text-center">
      <p
        className="text-success small mb-1 text-uppercase fw-bold"
        style={{ letterSpacing: "1px", opacity: 0.8 }}
      >
        Nominal Investasi
      </p>
      <h2
        className="fw-bolder text-success mb-0"
        style={{ letterSpacing: "-0.5px" }}
      >
        {formatCurrency(amount)}
      </h2>
    </div>
    <Receipt
      size={100}
      className="position-absolute text-success"
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

export default InvestasiNominalHeader;
