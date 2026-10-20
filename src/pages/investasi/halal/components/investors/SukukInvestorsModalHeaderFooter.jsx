import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Users } from "phosphor-react";

export const SukukInvestorsModalHeader = ({ issueName }) => (
  <Modal.Header className="border-0 px-4 pt-4 pb-3" closeButton>
    <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-3">
      <div className="bg-primary text-white p-2 rounded-3 shadow-sm d-flex">
        <Users size={24} />
      </div>
      <div>
        <div className="text-dark">Investor Sukuk</div>
        <div className="text-muted fw-normal">{issueName}</div>
      </div>
    </Modal.Title>
  </Modal.Header>
);

export const SukukInvestorsModalFooter = ({ totalCount, onHide }) => (
  <Modal.Footer className="border-0 px-4 pb-4 pt-2">
    <div className="w-100 d-flex justify-content-between align-items-center">
      <div className="bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill small fw-medium shadow-sm">
        Menampilkan <span className="fw-bold">{totalCount}</span> investor
      </div>
      <Button
        variant="light"
        className="rounded-pill px-5 py-2 fw-bold border text-muted shadow-sm hover-scale"
        style={{ transition: "all 0.2s" }}
        onClick={onHide}
      >
        Tutup
      </Button>
    </div>
  </Modal.Footer>
);
