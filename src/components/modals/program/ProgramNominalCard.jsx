import React from "react";
import { CurrencyCircleDollar } from "phosphor-react";

const ProgramNominalCard = ({ amount, formatCurrency }) => (
  <div className="bg-primary bg-opacity-10 p-4 rounded-4 mb-4 border border-primary border-opacity-10 position-relative overflow-hidden">
    <div className="position-relative z-1 text-center">
      <p
        className="text-primary small mb-1 text-uppercase fw-bold"
        style={{ letterSpacing: "1px" }}
      >
        Nominal Pokok
      </p>
      <h2 className="fw-bold text-primary mb-0">
        {formatCurrency(amount)}
      </h2>
    </div>
    <CurrencyCircleDollar
      size={80}
      className="position-absolute text-primary opacity-5"
      style={{ right: -10, bottom: -10 }}
      weight="fill"
    />
  </div>
);

export default ProgramNominalCard;
