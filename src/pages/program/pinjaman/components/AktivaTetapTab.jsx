import React, { useState } from "react";
import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
import { Plus } from "phosphor-react";
import Swal from "sweetalert2";
import jualBeliService from "../../../../utils/api/UJualBeli";

const AktivaTetapTab = ({ loading, aktivaTetapData, formatRupiah, refreshData }) => {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    tanggal: "",
    no_transaksi: "",
    pic: "",
    keperluan: "",
    jenis: "DEBET",
    jumlah: "",
  });
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setShowModal(false);
    setForm({
      tanggal: "",
      no_transaksi: "",
      pic: "",
      keperluan: "",
      jenis: "DEBET",
      jumlah: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await jualBeliService.createPinjamanAktivaTetap(form);
      if (res.data?.status) {
        Swal.fire("Berhasil", "Data Aktiva Tetap berhasil ditambahkan", "success");
        resetForm();
        if (refreshData) refreshData();
      } else {
        Swal.fire("Gagal", res.data?.message || "Gagal menambahkan data", "error");
      }
    } catch (err) {
      Swal.fire(
        "Gagal",
        err.response?.data?.message || err.message || "Terjadi kesalahan",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 fw-bold">Daftar Transaksi Aktiva Tetap</h5>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowModal(true)}
          className="d-flex align-items-center"
        >
          <Plus className="me-1" /> Tambah Transaksi
        </Button>
      </div>

      <div className="table-responsive border rounded-3">
        <Table
          striped
          hover
          bordered
          className="align-middle mb-0 text-nowrap custom-table-admin compact-table"
        >
          <thead className="table-light text-center sticky-top">
            <tr>
              <th rowSpan="2" className="align-middle">
                No
              </th>
              <th rowSpan="2" className="align-middle text-start">
                Bulan
              </th>
              <th rowSpan="2" className="align-middle text-start">
                No Transaksi
              </th>
              <th rowSpan="2" className="align-middle text-start">
                PIC
              </th>
              <th rowSpan="2" className="align-middle text-start">
                Keperluan
              </th>
              <th colSpan="3">Jumlah</th>
            </tr>
            <tr>
              <th className="text-end">Debet</th>
              <th className="text-end">Kredit</th>
              <th className="text-end">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-4">
                  <Spinner animation="border" variant="primary" />
                  <div className="mt-2 text-muted">Memuat data...</div>
                </td>
              </tr>
            ) : !aktivaTetapData || aktivaTetapData.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center text-muted py-4">
                  Belum ada data laporan aktiva tetap
                </td>
              </tr>
            ) : (
              aktivaTetapData.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td>
                    {item.tanggal
                      ? new Date(item.tanggal).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td>{item.no_transaksi}</td>
                  <td>{item.pic}</td>
                  <td className="text-wrap" style={{ minWidth: "200px" }}>
                    {item.keperluan}
                  </td>
                  <td className="text-end text-success">
                    {item.jenis === "DEBET" ? formatRupiah(item.jumlah) : "-"}
                  </td>
                  <td className="text-end text-danger">
                    {item.jenis === "KREDIT" ? formatRupiah(item.jumlah) : "-"}
                  </td>
                  <td className="text-end fw-bold text-primary">
                    {formatRupiah(item.saldo)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={resetForm} backdrop="static" centered>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="fs-5">Tambah Transaksi Aktiva Tetap</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tanggal</Form.Label>
              <Form.Control
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>No Transaksi</Form.Label>
              <Form.Control
                type="text"
                name="no_transaksi"
                value={form.no_transaksi}
                onChange={handleChange}
                placeholder="AKT-001"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>PIC</Form.Label>
              <Form.Control
                type="text"
                name="pic"
                value={form.pic}
                onChange={handleChange}
                placeholder="Nama Penanggung Jawab"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keperluan</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="keperluan"
                value={form.keperluan}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jenis Transaksi</Form.Label>
              <Form.Select
                name="jenis"
                value={form.jenis}
                onChange={handleChange}
                required
              >
                <option value="DEBET">Debet (Penambahan Aktiva/Aset)</option>
                <option value="KREDIT">Kredit (Pengurangan Aktiva/Aset)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Jumlah (Rp)</Form.Label>
              <Form.Control
                type="number"
                name="jumlah"
                value={form.jumlah}
                onChange={handleChange}
                min="1"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={resetForm} disabled={saving}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={saving}>
              {saving ? <Spinner size="sm" /> : "Simpan"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AktivaTetapTab;
