import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { ArrowDownLeft, ArrowUpRight } from "phosphor-react";

const TerminationFinancialSummarySection = ({ financialSummary = {}, formatRp }) => {
  const totalHak =
    Number(financialSummary.simpanan_pokok || 0) +
    Number(financialSummary.simpanan_wajib || 0) +
    Number(financialSummary.simpanan_sukarela || 0) +
    Number(financialSummary.tabungan_reguler || 0);

  const totalKewajiban =
    Number(financialSummary.jual_beli_sisa_cicilan || 0) +
    Number(financialSummary.pinjaman_sisa_cicilan || 0) +
    Number(financialSummary.arisan_sisa_cicilan || 0);

  return (
    <>
      <h6 className="fw-bold mb-3 text-dark">3. Ringkasan Hak & Kewajiban</h6>
      <Card className="border-0 shadow-sm rounded-4 p-4 mb-4" style={{ borderColor: "#f1f5f9" }}>
        {/* Hak / Aset Anggota */}
        <div className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <ArrowDownLeft className="text-success me-2" size={20} />
            <h6 className="fw-bold mb-0 text-success">Aset / Hak Anggota (Akan Dikembalikan)</h6>
          </div>
          <div className="bg-success bg-opacity-10 p-3 rounded-3">
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Simpanan Pokok</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.simpanan_pokok)}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Simpanan Wajib</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.simpanan_wajib)}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Simpanan Sukarela</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.simpanan_sukarela)}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Total Tabungan</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.tabungan_reguler)}</Col>
            </Row>
            <hr className="my-2 border-success border-opacity-25" />
            <Row>
              <Col xs={6} className="fw-bold text-dark">Total Hak</Col>
              <Col xs={6} className="fw-bold text-success text-end">
                {formatRp(totalHak)}
              </Col>
            </Row>
          </div>
        </div>

        {/* Kewajiban / Tagihan */}
        <div>
          <div className="d-flex align-items-center mb-3">
            <ArrowUpRight className="text-danger me-2" size={20} />
            <h6 className="fw-bold mb-0 text-danger">Kewajiban / Tagihan (Harus Dilunasi)</h6>
          </div>
          <div className="bg-danger bg-opacity-10 p-3 rounded-3">
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Sisa Cicilan Jual Beli</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.jual_beli_sisa_cicilan)}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Sisa Cicilan Pinjaman</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.pinjaman_sisa_cicilan)}</Col>
            </Row>
            <Row className="mb-2">
              <Col xs={6} className="text-muted small">Sisa Cicilan Arisan</Col>
              <Col xs={6} className="fw-bold text-end">{formatRp(financialSummary.arisan_sisa_cicilan)}</Col>
            </Row>
            <hr className="my-2 border-danger border-opacity-25" />
            <Row>
              <Col xs={6} className="fw-bold text-dark">Total Kewajiban</Col>
              <Col xs={6} className="fw-bold text-danger text-end">
                {formatRp(totalKewajiban)}
              </Col>
            </Row>
          </div>
        </div>
      </Card>
    </>
  );
};

export default TerminationFinancialSummarySection;
