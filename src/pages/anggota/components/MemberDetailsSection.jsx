import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const MemberDetailsSection = ({ data }) => {
  const { memberTypeDetail, member_type, member, registered_at, email, phone_number } = data || {};

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark mt-4">3. Informasi Akun</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Waktu Pendaftaran
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {registered_at ? new Date(registered_at).toLocaleString("id-ID") : "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Tipe Anggota
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {memberTypeDetail?.status_name || member?.status?.status_name || member_type || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Role / Akses
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.roleAssignments && member.roleAssignments.length > 0
              ? member.roleAssignments.map((e) => e.role?.role_name).join(", ")
              : "Anggota"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Email
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {email || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            No. Handphone
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {phone_number || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            No. Telepon Darurat
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.emergencyContacts?.[0]?.phone_number || "-"}
          </Col>
        </Row>
        <Row className="pb-1">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Hubungan Kontak Darurat
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.emergencyContacts?.[0]?.relation
              ? `${member.emergencyContacts[0].contact_name} (${member.emergencyContacts[0].relation})`
              : "-"}
          </Col>
        </Row>
      </Card>

      <h6 className="fw-bold mb-3 text-dark mt-4">4. Informasi Pekerjaan</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Pekerjaan / Jabatan
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.employments?.[0]?.occupation || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Nama Instansi / Perusahaan
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.employments?.[0]?.employer_name || "-"}
          </Col>
        </Row>
        <Row className="pb-1">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Alamat Instansi
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.employments?.[0]?.employer_address || "-"}
          </Col>
        </Row>
      </Card>

      <h6 className="fw-bold mb-3 text-dark mt-4">5. Informasi Bank</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Nama Bank
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.bankAccounts?.[0]?.bank_name || "-"}
          </Col>
        </Row>
        <Row className="border-bottom border-light pb-2 mb-2">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            No. Rekening
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.bankAccounts?.[0]?.bank_account_no || "-"}
          </Col>
        </Row>
        <Row className="pb-1">
          <Col xs={4} md={4} className="text-muted fw-medium small">
            Nama Pemilik Rekening
          </Col>
          <Col xs={8} md={8} className="fw-semibold text-dark text-start">
            {member?.bankAccounts?.[0]?.account_holder || "-"}
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default MemberDetailsSection;
