import React from "react";
import { Modal, Button } from "react-bootstrap";
import { Info } from "phosphor-react";

export const MemberInfoModal = ({ show, onHide, member, formatRupiah }) => (
  <Modal show={show} onHide={onHide} size="md" centered>
    <Modal.Header closeButton className="border-0 pb-0">
      <Modal.Title className="fw-bold d-flex align-items-center gap-2">
        <Info size={24} className="text-info" weight="fill" />
        Informasi Pendaftaran Anggota
      </Modal.Title>
    </Modal.Header>
    <Modal.Body className="pt-3">
      {member && (
        <div className="d-flex flex-column gap-3">
          <div className="p-3 bg-light rounded-3">
            <div className="text-muted small mb-1">Nama Anggota</div>
            <div className="fw-bold fs-5 text-dark">{member.nama}</div>
          </div>
          <div className="row g-3">
            <div className="col-6">
              <div className="p-3 border rounded-3 d-flex flex-column h-100">
                <span className="text-muted small d-flex align-items-center gap-1 mb-1">
                  Kategori
                </span>
                <span className="fw-semibold text-dark">{member.kategori}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 border rounded-3 d-flex flex-column h-100">
                <span className="text-muted small d-flex align-items-center gap-1 mb-1">
                  Durasi
                </span>
                <span className="fw-semibold text-dark">{member.term}</span>
              </div>
            </div>
            <div className="col-6">
              <div className="p-3 border rounded-3 d-flex flex-column h-100">
                <span className="text-muted small d-flex align-items-center gap-1 mb-1">
                  Target Nominal
                </span>
                <span className="fw-semibold text-primary">
                  {formatRupiah(member.target)}
                </span>
              </div>
            </div>
            <div className="col-12">
              <div className="p-3 bg-success bg-opacity-10 rounded-3 d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-success small d-flex align-items-center gap-1 mb-1 fw-bold">
                    Saldo Saat Ini
                  </span>
                  <span className="text-muted">
                    Kekurangan: {formatRupiah(member.kekurangan)}
                  </span>
                </div>
                <span className="fw-bold text-success fs-5">
                  {formatRupiah(member.saldo)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal.Body>
    <Modal.Footer className="border-0 pt-0 mt-3">
      <Button variant="light" className="w-100" onClick={onHide}>
        Tutup
      </Button>
    </Modal.Footer>
  </Modal>
);

export default MemberInfoModal;
