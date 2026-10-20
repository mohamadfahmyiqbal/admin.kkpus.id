import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { User } from "phosphor-react";

const MemberIdentitySection = ({ data, getMediaUrl }) => {
  const {
    full_name,
    nik_ktp,
    member_type,
    ktp_photo_path,
    selfie_photo_path,
    province_name,
    city_name,
    district_name,
    subdistrict_name,
    rt,
    rw,
    address_ktp,
  } = data || {};

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark">1. Informasi Registrasi & Identitas</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        <Row className="align-items-center">
          <Col md={2} className="text-center text-md-start mb-3 mb-md-0">
            <div
              className="mx-auto mx-md-0 rounded-circle text-primary d-flex align-items-center justify-content-center"
              style={{ width: "80px", height: "80px", backgroundColor: "#e0e7ff" }}
            >
              <User size={36} />
            </div>
          </Col>
          <Col md={10}>
            <div className="d-flex flex-column gap-3">
              <Row className="border-bottom border-light pb-2">
                <Col xs={4} md={4} className="text-muted fw-medium small">
                  Nama Lengkap
                </Col>
                <Col xs={8} md={8} className="fw-bold text-dark text-start">
                  {full_name || "-"}
                </Col>
              </Row>
              <Row className="border-bottom border-light pb-2">
                <Col xs={4} md={4} className="text-muted fw-medium small">
                  Nomor Identitas (NIK)
                </Col>
                <Col xs={8} md={8} className="fw-bold text-dark text-start">
                  {nik_ktp || "-"}
                </Col>
              </Row>
              <Row className="pb-1">
                <Col xs={4} md={4} className="text-muted fw-medium small">
                  Tipe Anggota
                </Col>
                <Col xs={8} md={8} className="text-start">
                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold">
                    {data.memberTypeDetail?.status_name ||
                      data.member?.status?.status_name ||
                      member_type ||
                      "Calon Anggota"}
                  </span>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        <div className="mt-4 border-top pt-3">
          <h6 className="fw-bold mb-3 text-dark">Verifikasi Dokumen</h6>
          <Row className="g-3">
            <Col md={6}>
              <div className="text-center p-3 border rounded-3 bg-light shadow-sm">
                <p className="small fw-bold text-muted mb-2">Foto KTP</p>
                <img
                  src={getMediaUrl(ktp_photo_path)}
                  className="img-fluid rounded border shadow-sm"
                  alt="KTP"
                  style={{
                    maxHeight: "200px",
                    objectFit: "contain",
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=Gambar+Tidak+Ditemukan";
                  }}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="text-center p-3 border rounded-3 bg-light shadow-sm">
                <p className="small fw-bold text-muted mb-2">Swafoto</p>
                <img
                  src={getMediaUrl(selfie_photo_path)}
                  className="img-fluid rounded border shadow-sm"
                  alt="Selfie"
                  style={{
                    maxHeight: "200px",
                    objectFit: "contain",
                    width: "100%",
                    backgroundColor: "#fff",
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://placehold.co/400x300?text=Gambar+Tidak+Ditemukan";
                  }}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className="mt-4 border-top pt-3">
          <h6 className="fw-bold mb-3 text-dark">Detail Domisili (Sesuai KTP)</h6>
          <div className="d-flex flex-column gap-3">
            <Row className="border-bottom border-light pb-2">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                Provinsi
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                {province_name || "-"}
              </Col>
            </Row>
            <Row className="border-bottom border-light pb-2">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                Kota / Kabupaten
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                {city_name || "-"}
              </Col>
            </Row>
            <Row className="border-bottom border-light pb-2">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                Kecamatan
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                {district_name || "-"}
              </Col>
            </Row>
            <Row className="border-bottom border-light pb-2">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                Kelurahan
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                {subdistrict_name || "-"}
              </Col>
            </Row>
            <Row className="border-bottom border-light pb-2">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                RT / RW
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                RT.{rt || "00"} / RW.{rw || "00"}
              </Col>
            </Row>
            <Row className="pb-1">
              <Col xs={4} md={4} className="text-muted fw-medium small">
                Alamat Lengkap
              </Col>
              <Col xs={8} md={8} className="fw-semibold text-dark text-start">
                {address_ktp || "-"}
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </>
  );
};

export default MemberIdentitySection;
