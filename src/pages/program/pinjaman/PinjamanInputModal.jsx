import React, { useState, useEffect } from "react";
import { Card, Button, Form, Row, Col, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, FloppyDisk } from "phosphor-react";
import Swal from "sweetalert2";
import programService from "../../../utils/api/UProgram";
import { jwtEncode } from "../../../utils/helpers";

const PinjamanInputModal = () => {
  const navigate = useNavigate();
  const userData = (() => {
    try {
      return JSON.parse(localStorage.getItem("userData") || "{}");
    } catch {
      return {};
    }
  })();

  const [formData, setFormData] = useState({
    bulan: "",
    noTransaksi: "",
    pic: "",
    keperluan: "",
    jenis: "DEBET",
    jumlah: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userData) {
      const name =
        userData.name ||
        userData.full_name ||
        userData.username ||
        "Admin";
      setFormData((prev) => ({ ...prev, pic: name }));
    }
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "jumlah") {
      let raw = value.replace(/\D/g, "");
      const formatted = raw
        ? new Intl.NumberFormat("id-ID").format(Number(raw))
        : "";
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await programService.postInputModal(formData);
      if (res.data?.status) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: res.data.message || "Data modal berhasil disimpan",
          confirmButtonColor: "#2563eb",
        });
        setFormData({
          bulan: "",
          noTransaksi: "",
          pic:
            userData?.name ||
            userData?.full_name ||
            userData?.username ||
            "Admin",
          keperluan: "",
          jenis: "DEBET",
          jumlah: "",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal menyimpan data modal",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      console.error("Submit Error:", err);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: err?.response?.data?.message || "Koneksi ke server bermasalah",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="py-4 px-3 px-md-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Breadcrumb Header */}
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode("pinjamanList")}`)}
          >
            Pinjaman Lunak
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Input Modal</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Input Modal</h4>
          <p className="text-muted small mb-0">
            Form input penambahan atau penarikan modal Pinjaman Lunak.
          </p>
        </div>
        <Button
          variant="outline-secondary"
          className="d-flex align-items-center gap-2"
          onClick={() => window.history.back()}
          style={{ borderRadius: "8px" }}
        >
          <ArrowLeft size={18} />
          Kembali
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4 overflow-hidden animate-fade-in">
        <Card.Body className="p-4 p-md-5">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">
                    Bulan / Tanggal <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="bulan"
                    value={formData.bulan}
                    onChange={handleChange}
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-medium text-dark">
                    No Transaksi
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="noTransaksi"
                    value={formData.noTransaksi}
                    onChange={handleChange}
                    placeholder="Auto-generate jika kosong"
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">
                PIC (Person In Charge) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="pic"
                value={formData.pic}
                readOnly
                className="form-control-lg bg-light"
                style={{ cursor: "not-allowed" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-medium text-dark">
                Keperluan <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="keperluan"
                value={formData.keperluan}
                onChange={handleChange}
                placeholder="Contoh: Penambahan modal awal"
                required
                className="form-control-lg"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-dark">
                    Jenis Transaksi <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    name="jenis"
                    value={formData.jenis}
                    onChange={handleChange}
                    required
                    className="form-control-lg"
                  >
                    <option value="DEBET">Debet (Penambahan Modal)</option>
                    <option value="KREDIT">Kredit (Penarikan Modal)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="fw-medium text-dark">
                    Jumlah (Rp) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="jumlah"
                    value={formData.jumlah}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="form-control-lg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-grid pt-2">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
                className="btn-lg d-flex justify-content-center align-items-center gap-2"
                style={{ borderRadius: "8px", fontWeight: 500 }}
              >
                <FloppyDisk size={20} />
                {loading ? "Menyimpan..." : "Simpan Modal"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PinjamanInputModal;
