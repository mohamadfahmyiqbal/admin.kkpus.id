import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { User } from "phosphor-react";

const TerminationMemberInfoSection = ({ data }) => {
  const member = data?.member;
  const memberName = member?.full_name || "-";
  const memberType = data?.member?.status?.status_name || member?.member_type || "Anggota";
  const email = member?.account?.email || member?.email || "-";
  const phone = member?.phone_number || "-";
  const submittedAt = data?.submitted_at;
  const emergencyContact = member?.emergencyContacts?.[0];
  const employment = member?.employments?.[0];
  const bankAccount = member?.bankAccounts?.[0];

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark">1. Informasi Anggota Lengkap</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <div className="d-flex align-items-center mb-4">
          <div
            className="rounded-circle text-danger d-flex align-items-center justify-content-center me-3"
            style={{ width: "60px", height: "60px", backgroundColor: "#fee2e2" }}
          >
            <User size={28} />
          </div>
          <div>
            <h5 className="fw-bold mb-1">{memberName}</h5>
            <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-1 rounded-pill fw-bold">
              {memberType}
            </span>
          </div>
        </div>

        <Row className="mb-2">
          <Col xs={4} className="text-muted small">Waktu Pengajuan</Col>
          <Col xs={8} className="fw-bold">
            {submittedAt ? new Date(submittedAt).toLocaleString("id-ID") : "-"}
          </Col>
        </Row>
        <Row className="mb-2">
          <Col xs={4} className="text-muted small">NIK / Identitas</Col>
          <Col xs={8} className="fw-bold">{member?.nik_ktp || "-"}</Col>
        </Row>
        <Row className="mb-2">
          <Col xs={4} className="text-muted small">Email</Col>
          <Col xs={8} className="fw-bold">{email}</Col>
        </Row>
        <Row className="mb-2">
          <Col xs={4} className="text-muted small">No HP</Col>
          <Col xs={8} className="fw-bold">{phone}</Col>
        </Row>

        <div className="mt-4 border-top pt-3">
          <h6 className="fw-bold text-dark small mb-3 text-uppercase">Kontak Darurat</h6>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Nama</Col>
            <Col xs={8} className="fw-bold">{emergencyContact?.contact_name || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Hubungan</Col>
            <Col xs={8} className="fw-bold">{emergencyContact?.relation || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Telepon</Col>
            <Col xs={8} className="fw-bold">{emergencyContact?.phone_number || "-"}</Col>
          </Row>
        </div>

        <div className="mt-4 border-top pt-3">
          <h6 className="fw-bold text-dark small mb-3 text-uppercase">Informasi Pekerjaan</h6>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Instansi</Col>
            <Col xs={8} className="fw-bold">{employment?.employer_name || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Jabatan</Col>
            <Col xs={8} className="fw-bold">{employment?.occupation || "-"}</Col>
          </Row>
        </div>

        <div className="mt-4 border-top pt-3">
          <h6 className="fw-bold text-dark small mb-3 text-uppercase">Informasi Bank</h6>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Bank</Col>
            <Col xs={8} className="fw-bold">{bankAccount?.bank_name || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">No Rekening</Col>
            <Col xs={8} className="fw-bold">{bankAccount?.bank_account_no || "-"}</Col>
          </Row>
          <Row className="mb-2">
            <Col xs={4} className="text-muted small">Atas Nama</Col>
            <Col xs={8} className="fw-bold">{bankAccount?.account_holder || "-"}</Col>
          </Row>
        </div>
      </Card>
    </>
  );
};

export default TerminationMemberInfoSection;
