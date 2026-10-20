import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { NumericFormat } from "react-number-format";

const ArisanBatchModal = ({
  show,
  onHide,
  formData,
  setFormData,
  onSave,
  isEditing,
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton className="bg-light border-bottom-0 pb-3">
        <Modal.Title className="fw-bold text-primary">
          {isEditing ? "Edit Batch Arisan" : "Buat Batch Arisan Baru"}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4 bg-light">
        {/* Informasi Program */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6
              className="fw-bold text-muted mb-3 text-uppercase"
              style={{ letterSpacing: "1px" }}
            >
              Informasi Program
            </h6>
            <div className="row g-3">
              <div className="col-md-12">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Nama Program
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.program_name}
                    onChange={(e) =>
                      setFormData({ ...formData, program_name: e.target.value })
                    }
                    placeholder="Contoh: Arisan Umrah Keluarga"
                    className="p-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Kategori
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    placeholder="Contoh: Umrah"
                    className="p-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Nama Batch
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.batch_name}
                    onChange={(e) =>
                      setFormData({ ...formData, batch_name: e.target.value })
                    }
                    placeholder="Contoh: Batch 1 2026"
                    className="p-2"
                  />
                </Form.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Target & Biaya */}
        <div className="card border-0 shadow-sm rounded-4 mb-4">
          <div className="card-body p-4">
            <h6
              className="fw-bold text-muted mb-3 text-uppercase"
              style={{ letterSpacing: "1px" }}
            >
              Target & Biaya
            </h6>
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Kuota Peserta
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      value={formData.participants_quota}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          participants_quota: e.target.value,
                        })
                      }
                      className="p-2"
                    />
                    <span className="input-group-text bg-white text-muted">
                      Orang
                    </span>
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Jml. Keberangkatan
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      value={formData.jumlah_keberangkatan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jumlah_keberangkatan: e.target.value,
                        })
                      }
                      className="p-2"
                    />
                    <span className="input-group-text bg-white text-muted">
                      Orang
                    </span>
                  </div>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Durasi Arisan
                  </Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="number"
                      value={formData.term_months}
                      onChange={(e) => {
                        const t = e.target.value;
                        const r = formData.target_amount;
                        const a = t && r ? Math.round(r / t) : "";
                        setFormData({
                          ...formData,
                          term_months: t,
                          monthly_installment: a,
                        });
                      }}
                      className="p-2"
                    />
                    <span className="input-group-text bg-white text-muted">
                      Bulan
                    </span>
                  </div>
                </Form.Group>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Total Biaya Perjalanan <span className="text-danger">*</span>
                  </Form.Label>
                  <NumericFormat
                    className="form-control p-2 fw-bold text-success"
                    value={formData.target_amount}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    onValueChange={(vals) => {
                      const t = vals.value;
                      const r = formData.term_months;
                      const a = r && t ? Math.round(t / r) : "";
                      setFormData({
                        ...formData,
                        target_amount: t,
                        monthly_installment: a,
                      });
                    }}
                    placeholder="Rp 0"
                  />
                  <Form.Text className="text-muted">
                    Total dana yang dikumpulkan per peserta.
                  </Form.Text>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Setoran Bulanan (Otomatis)
                  </Form.Label>
                  <NumericFormat
                    className="form-control p-2 bg-light border-0 fw-bold"
                    style={{ color: "#475569" }}
                    value={formData.monthly_installment}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="Rp "
                    readOnly
                    disabled
                  />
                  <Form.Text className="text-muted">
                    Dihitung otomatis (Biaya / Durasi).
                  </Form.Text>
                </Form.Group>
              </div>
            </div>
          </div>
        </div>

        {/* Pelaksanaan & Status */}
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body p-4">
            <h6
              className="fw-bold text-muted mb-3 text-uppercase"
              style={{ letterSpacing: "1px" }}
            >
              Pelaksanaan & Status
            </h6>
            <div className="row g-3">
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Bulan Mulai
                  </Form.Label>
                  <Form.Select
                    value={formData.period_start_month}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period_start_month: e.target.value,
                      })
                    }
                    className="p-2"
                  >
                    {[...Array(12)].map((_, idx) => (
                      <option key={idx + 1} value={idx + 1}>
                        {new Date(0, idx).toLocaleString("id-ID", {
                          month: "long",
                        })}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Tahun Mulai
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.period_start_year}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        period_start_year: e.target.value,
                      })
                    }
                    className="p-2"
                  />
                </Form.Group>
              </div>
              <div className="col-md-4">
                <Form.Group>
                  <Form.Label className="fw-medium text-dark small">
                    Status Batch
                  </Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="p-2 fw-medium text-primary"
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="OPEN">OPEN (Pendaftaran)</option>
                    <option value="ACTIVE">ACTIVE (Berjalan)</option>
                    <option value="COMPLETED">COMPLETED (Selesai)</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="bg-white border-top-0 pt-0 pb-4 px-4 d-flex justify-content-end gap-2">
        <Button
          variant="light"
          onClick={onHide}
          className="px-4 py-2 rounded-pill fw-medium text-muted border"
        >
          Batal
        </Button>
        <Button
          variant="primary"
          onClick={onSave}
          className="px-4 py-2 rounded-pill fw-medium shadow-sm"
        >
          Simpan Perubahan
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ArisanBatchModal;
