import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../../../utils/api/common";

const SukukIssueModal = ({ show, onHide, data, onSuccess }) => {
  const isEdit = !!data;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    issue_name: "",
    issuer: "Koperasi Syariah",
    type: "Sukuk Mudharabah",
    total_amount: "",
    min_investment: "",
    coupon: "",
    tenor: "12 Bulan",
    price: 100,
    start_date: "",
    end_date: "",
    status: "OPEN",
  });

  useEffect(() => {
    if (data) {
      setForm({
        issue_name: data.issue_name || "",
        issuer: data.issuer || "Koperasi Syariah",
        type: data.type || "Sukuk Mudharabah",
        total_amount: data.total_amount || "",
        min_investment: data.min_investment || "",
        coupon: data.coupon || "",
        tenor: data.tenor || "12 Bulan",
        price: data.price || 100,
        start_date: data.start_date || "",
        end_date: data.end_date || "",
        status: data.status || "OPEN",
      });
    } else {
      setForm({
        issue_name: "",
        issuer: "Koperasi Syariah",
        type: "Sukuk Mudharabah",
        total_amount: "",
        min_investment: "",
        coupon: "",
        tenor: "12 Bulan",
        price: 100,
        start_date: "",
        end_date: "",
        status: "OPEN",
      });
    }
  }, [data, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await api.put(`/financing/sukuk/issue/${data.issue_id}`, form);
      } else {
        await api.post(`/financing/sukuk/issue`, form);
      }
      Swal.fire(
        "Berhasil",
        `Data investasi berhasil ${isEdit ? "diperbarui" : "disimpan"}`,
        "success"
      );
      if (onSuccess) onSuccess();
      onHide();
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Gagal",
        err?.response?.data?.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit" : "Tambah"} Investasi Halal (Sukuk)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={12}>
              <Form.Group>
                <Form.Label>Nama Produk</Form.Label>
                <Form.Control
                  type="text"
                  name="issue_name"
                  value={form.issue_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Penerbit</Form.Label>
                <Form.Control
                  type="text"
                  name="issuer"
                  value={form.issuer}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Kategori / Jenis</Form.Label>
                <Form.Control
                  type="text"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Target Pendanaan (Rp)</Form.Label>
                <Form.Control
                  type="number"
                  name="total_amount"
                  value={form.total_amount}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Minimum Investasi (Rp)</Form.Label>
                <Form.Control
                  type="number"
                  name="min_investment"
                  value={form.min_investment}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Proyeksi Imbal Hasil (Kupon)</Form.Label>
                <Form.Control
                  type="text"
                  name="coupon"
                  placeholder="Cth: 8.0% p.a."
                  value={form.coupon}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tenor</Form.Label>
                <Form.Control
                  type="text"
                  name="tenor"
                  value={form.tenor}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Harga Sukuk per Lembar (Rp)</Form.Label>
                <Form.Control
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Status</Form.Label>
                <Form.Select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  required
                >
                  <option value="OPEN">OPEN</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="FULLY_PAID">FULLY_PAID</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tanggal Mulai</Form.Label>
                <Form.Control
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Tanggal Berakhir</Form.Label>
                <Form.Control
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Batal
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default SukukIssueModal;
