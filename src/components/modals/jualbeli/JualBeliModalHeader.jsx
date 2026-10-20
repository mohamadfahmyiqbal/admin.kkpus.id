// PATH: src/components/modals/jualbeli/JualBeliModalHeader.jsx
import React from "react";
import { Modal } from "react-bootstrap";
import { ShoppingCart } from "phosphor-react";

const JualBeliModalHeader = () => {
  return (
    <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
      <Modal.Title className="fw-bold text-dark d-flex align-items-center gap-3">
        <div className="bg-primary bg-opacity-10 p-2 rounded-3 d-flex">
          <ShoppingCart size={24} className="text-primary" weight="fill" />
        </div>
        Persetujuan Jual Beli
      </Modal.Title>
    </Modal.Header>
  );
};

export default React.memo(JualBeliModalHeader);
