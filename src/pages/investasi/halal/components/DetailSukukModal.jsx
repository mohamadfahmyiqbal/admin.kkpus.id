import React from "react";
import { Modal, Button, Row, Col, Card, Badge } from "react-bootstrap";

const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const DetailSukukModal = ({ show, onHide, transaction }) => {
  if (!transaction) return null;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Detail Investasi Halal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4 text-center">
          <h4 className="fw-bold text-primary mb-1">
            {transaction.issue_name || "Detail Sukuk"}
          </h4>
          <p className="text-muted mb-0">
            Diterbitkan oleh: {transaction.issuer || "Koperasi"}
          </p>
        </div>

        <Row className="g-3">
          <Col md={12}>
            <Card className="border-0 bg-light rounded-3">
              <Card.Body>
                <h6 className="fw-bold mb-3 border-bottom pb-2">
                  Informasi Pendanaan
                </h6>
                <Row className="gy-3">
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Kategori</p>
                    <p className="fw-semibold mb-0">
                      {transaction.type || "Sukuk"}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Status Penawaran</p>
                    <Badge
                      pill
                      bg={
                        transaction.status === "OPEN"
                          ? "success"
                          : transaction.status === "CLOSED"
                          ? "danger"
                          : "secondary"
                      }
                    >
                      {transaction.status}
                    </Badge>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Target Pendanaan</p>
                    <p className="fw-semibold mb-0">
                      {formatCurrency(transaction.total_amount)}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Proyeksi Imbal Hasil</p>
                    <p className="fw-semibold mb-0 text-success">
                      {transaction.coupon || "-"}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Tenor</p>
                    <p className="fw-semibold mb-0">
                      {transaction.tenor || "-"}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Minimum Investasi</p>
                    <p className="fw-semibold mb-0">
                      {formatCurrency(transaction.min_investment)}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Harga per Lembar</p>
                    <p className="fw-semibold mb-0">
                      {formatCurrency(transaction.price)}
                    </p>
                  </Col>
                  <Col sm={6}>
                    <p className="text-muted mb-1 small">Periode Penawaran</p>
                    <p className="fw-semibold mb-0">
                      {transaction.start_date
                        ? new Date(transaction.start_date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}{" "}
                      s/d{" "}
                      {transaction.end_date
                        ? new Date(transaction.end_date).toLocaleDateString(
                            "id-ID"
                          )
                        : "-"}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col md={12}>
            <Card className="border-0 bg-light rounded-3">
              <Card.Body>
                <h6 className="fw-bold mb-2">Deskripsi Produk</h6>
                <p
                  className="text-muted mb-0 small"
                  style={{ lineHeight: "1.6" }}
                >
                  {transaction.description ||
                    "Sukuk dengan imbal hasil menarik dan risiko terukur yang dikelola secara profesional sesuai prinsip syariah."}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {transaction.member && (
            <Col md={12}>
              <Card className="border-0 bg-light rounded-3">
                <Card.Body>
                  <h6 className="fw-bold mb-3 border-bottom pb-2">
                    Data Transaksi Anggota
                  </h6>
                  <Row className="gy-3">
                    <Col sm={6}>
                      <p className="text-muted mb-1 small">Nama Anggota</p>
                      <p className="fw-semibold mb-0">
                        {transaction.member?.full_name}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p className="text-muted mb-1 small">Tanggal Order</p>
                      <p className="fw-semibold mb-0">
                        {transaction.order_date
                          ? new Date(
                              transaction.order_date
                            ).toLocaleDateString("id-ID")
                          : "-"}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p className="text-muted mb-1 small">Nominal Investasi</p>
                      <p className="fw-bold text-primary mb-0 fs-5">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </Col>
                    <Col sm={6}>
                      <p className="text-muted mb-1 small">Status Transaksi</p>
                      <Badge
                        bg={
                          transaction.status === "APPROVED"
                            ? "primary"
                            : transaction.status === "PAID"
                            ? "success"
                            : "warning"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="secondary" onClick={onHide} className="rounded-3">
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DetailSukukModal;
