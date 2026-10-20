import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Wallet, ChartLineUp, CheckCircle } from "phosphor-react";

const InvestasiJurnalReportTab = ({ summaryData, loading, formatRupiah }) => {
  const { totalSetoran = 0, totalImbalHasil = 0, totalPengembalian = 0 } =
    summaryData || {};

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-2 text-muted fw-medium">Memuat data jurnal...</div>
      </div>
    );
  }

  return (
    <div className="jurnal-tab-wrapper animate-fade-in p-4">
      <div className="mb-4">
        <h5 className="fw-bold text-dark mb-1">Rekapitulasi Jurnal Investasi</h5>
        <p className="text-muted small">
          Ringkasan total dana investasi terkumpul, proyeksi keuntungan, dan total liabilitas pengembalian dana.
        </p>
      </div>

      <Row className="g-4 mb-4">
        <Col lg={4} md={6}>
          <Card
            className="border-0 shadow-sm rounded-4 h-100 overflow-hidden"
            style={{ transition: "transform 0.2s", cursor: "pointer" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle me-4">
                <Wallet size={32} />
              </div>
              <div>
                <p
                  className="text-muted small fw-bold mb-1 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Investasi (Pokok)
                </p>
                <h4 className="fw-bold text-dark mb-0">
                  {formatRupiah(totalSetoran)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={6}>
          <Card
            className="border-0 shadow-sm rounded-4 h-100 overflow-hidden"
            style={{ transition: "transform 0.2s", cursor: "pointer" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle me-4">
                <ChartLineUp size={32} />
              </div>
              <div>
                <p
                  className="text-muted small fw-bold mb-1 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Proyeksi Imbal Hasil
                </p>
                <h4 className="fw-bold text-dark mb-0">
                  {formatRupiah(totalImbalHasil)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} md={12}>
          <Card
            className="border-0 shadow-sm rounded-4 h-100 overflow-hidden bg-success text-white"
            style={{ transition: "transform 0.2s", cursor: "pointer" }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Card.Body className="p-4 d-flex align-items-center">
              <div className="bg-white bg-opacity-25 text-white p-3 rounded-circle me-4">
                <CheckCircle size={32} />
              </div>
              <div>
                <p
                  className="text-white-50 small fw-bold mb-1 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Liabilitas (Pengembalian)
                </p>
                <h4 className="fw-bold text-white mb-0">
                  {formatRupiah(totalPengembalian)}
                </h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4 mt-5">
        <Card.Header className="bg-white border-0 pt-4 pb-0">
          <h6 className="fw-bold text-dark">Detail Akuntansi</h6>
        </Card.Header>
        <Card.Body className="p-4">
          <div className="table-responsive">
            <table className="table table-borderless compact-table mb-0">
              <tbody>
                <tr>
                  <td className="text-muted fw-medium" style={{ width: "30%" }}>
                    Debit (Kas/Bank Masuk)
                  </td>
                  <td className="fw-bold text-dark text-end">
                    {formatRupiah(totalSetoran)}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="text-muted fw-medium pb-3">
                    Kredit (Liabilitas Sukuk)
                  </td>
                  <td className="fw-bold text-primary pb-3 text-end">
                    {formatRupiah(totalSetoran)}
                  </td>
                </tr>
                <tr>
                  <td className="text-muted fw-medium pt-3">
                    Proyeksi Beban Imbal Hasil
                  </td>
                  <td className="fw-bold text-dark pt-3 text-end">
                    {formatRupiah(totalImbalHasil)}
                  </td>
                </tr>
                <tr className="border-bottom">
                  <td className="text-muted fw-medium pb-3">
                    Kredit (Utang Bagi Hasil)
                  </td>
                  <td className="fw-bold text-info pb-3 text-end">
                    {formatRupiah(totalImbalHasil)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default InvestasiJurnalReportTab;
