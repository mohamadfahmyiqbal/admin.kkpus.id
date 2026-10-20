import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { Money } from "phosphor-react";
import Swal from "sweetalert2";
import tabunganService from "../../../utils/api/UTabungan";

const MasterProgramModal = ({ show, onHide, program, onSuccess }) => {
  const isEditing = Boolean(program);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    target_name: "",
    category: "Haji",
  });

  useEffect(() => {
    if (show && isEditing && program) {
      setForm({
        target_name: program.target_name || "",
        category: program.category || "Haji",
      });
    } else if (show && !isEditing) {
      setForm({
        target_name: "",
        category: "Haji",
      });
    }
  }, [show, isEditing, program]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await tabunganService.updateProgram(program.saving_target_id, form);
      } else {
        await tabunganService.createProgram(form);
      }
      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: `Program tabungan berhasil ${isEditing ? "diperbarui" : "dibuat"}.`,
        timer: 1500,
        showConfirmButton: false,
      });
      onSuccess();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err?.response?.data?.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold d-flex align-items-center gap-2">
            <Money size={24} className="text-primary" weight="fill" />
            {isEditing ? "Edit Program Tabungan" : "Buat Program Tabungan"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-3">
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Kategori Tabungan
            </Form.Label>
            <Form.Select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
            >
              <option value="Haji">Haji</option>
              <option value="Umrah">Umrah</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Qurban">Qurban</option>
              <option value="Lainnya">Lainnya</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="fw-medium text-dark small">
              Nama Program (opsional)
            </Form.Label>
            <Form.Control
              type="text"
              value={form.target_name}
              onChange={(e) =>
                setForm({ ...form, target_name: e.target.value })
              }
              placeholder="Contoh: Tabungan Qurban 2026"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button
            variant="light"
            onClick={onHide}
            disabled={loading}
            className="fw-medium px-4"
          >
            Batal
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={loading}
            className="fw-medium px-4 d-flex align-items-center gap-2"
          >
            {loading && <Spinner size="sm" />}
            Simpan Program
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default MasterProgramModal;
