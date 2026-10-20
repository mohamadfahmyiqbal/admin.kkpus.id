import React, { useState, useEffect } from "react";
import { Button, Alert, Card, Spinner, Form, Table, Badge } from "react-bootstrap";
import { FaSyncAlt, FaSave } from "react-icons/fa";
import Swal from "sweetalert2";
import billingService from "../../utils/api/UBilling";

const PaymentFeeConfigPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchConfigs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await billingService.getPaymentFeeConfigs();
      if (res.data?.success) {
        setConfigs(res.data.data);
      } else {
        setError(res.data?.message || "Failed to fetch configurations.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil data konfigurasi. Pastikan server berjalan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleChange = (id, field, value) => {
    setConfigs((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const res = await billingService.updatePaymentFeeConfigs({ configs });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Konfigurasi biaya admin berhasil diperbarui.",
        });
        fetchConfigs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal memperbarui konfigurasi.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan konfigurasi.",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0 text-primary">
          Konfigurasi Biaya Admin Pembayaran
        </h4>
        <Button
          variant="outline-primary"
          onClick={fetchConfigs}
          disabled={loading}
        >
          <FaSyncAlt className={loading ? "fa-spin me-2" : "me-2"} />
          Refresh
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center p-5">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Memuat data...</p>
            </div>
          ) : configs.length === 0 ? (
            <div className="text-center p-5">
              <p className="text-muted mb-0">
                Belum ada data konfigurasi pembayaran.
              </p>
              <p className="text-muted small mt-2">
                Data akan dibuat otomatis jika belum ada atau perlu inisialisasi di database.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <Table hover className="align-middle mb-0">
                <thead className="bg-light text-muted">
                  <tr>
                    <th className="py-3 px-4 fw-semibold border-bottom-0">
                      Metode Pembayaran
                    </th>
                    <th className="py-3 fw-semibold border-bottom-0">
                      Tipe Biaya
                    </th>
                    <th className="py-3 fw-semibold border-bottom-0">
                      Biaya Flat (Rp)
                    </th>
                    <th className="py-3 fw-semibold border-bottom-0">
                      Biaya Persen (%)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {configs.map((item) => (
                    <tr key={item.id}>
                      <td className="px-4">
                        <div className="fw-bold text-dark">
                          {item.payment_name}
                        </div>
                        <Badge bg="secondary" className="fw-normal mt-1">
                          {item.payment_type}
                        </Badge>
                      </td>
                      <td>
                        <Form.Select
                          value={item.fee_type}
                          onChange={(e) =>
                            handleChange(item.id, "fee_type", e.target.value)
                          }
                          className="rounded-3"
                        >
                          <option value="FLAT">Flat (Nominal Tetap)</option>
                          <option value="PERCENTAGE">Persentase (%)</option>
                          <option value="FLAT_AND_PERCENTAGE">
                            Flat & Persentase
                          </option>
                        </Form.Select>
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          value={item.flat_fee}
                          onChange={(e) =>
                            handleChange(item.id, "flat_fee", e.target.value)
                          }
                          className="rounded-3"
                          disabled={item.fee_type === "PERCENTAGE"}
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="number"
                          step="0.01"
                          value={item.percentage_fee}
                          onChange={(e) =>
                            handleChange(item.id, "percentage_fee", e.target.value)
                          }
                          className="rounded-3"
                          disabled={item.fee_type === "FLAT"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
        <Card.Footer className="bg-white border-top p-4 d-flex justify-content-end">
          <Button
            variant="primary"
            className="px-4 rounded-pill d-flex align-items-center gap-2 shadow-sm"
            onClick={handleSaveAll}
            disabled={loading || saving || configs.length === 0}
          >
            {saving ? (
              <Spinner animation="border" size="sm" />
            ) : (
              <FaSave />
            )}
            <span>Simpan Perubahan</span>
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default PaymentFeeConfigPage;
