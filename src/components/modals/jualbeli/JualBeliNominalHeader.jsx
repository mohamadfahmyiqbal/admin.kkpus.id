import React from "react";
import { CurrencyDollar } from "phosphor-react";

const JualBeliNominalHeader = ({ totalDisplay, formatCurrency }) => {
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
          Nominal Pokok + Laba
        </p>
        <h2
          className="fw-bolder text-primary mb-0"
          style={{ letterSpacing: "-0.5px" }}
        >
          {formatCurrency(totalDisplay)}
        </h2>
      </div>
      <CurrencyDollar
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

export default JualBeliNominalHeader;
