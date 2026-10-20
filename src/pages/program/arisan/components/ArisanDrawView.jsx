import React, { useState, useEffect } from "react";
import { Modal, Table, Button, Badge, Spinner, Form, Card } from "react-bootstrap";
import { ArrowLeft, Confetti, Check, Eye } from "phosphor-react";
import Swal from "sweetalert2";
import programService from "../../../../utils/api/UProgram";

const ArisanDrawView = ({ batch, onBack }) => {
  const [draws, setDraws] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showProofModal, setShowProofModal] = useState(false);
  const [selectedDraw, setSelectedDraw] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDraws = async () => {
    setLoading(true);
    try {
      const res = await programService.getArisanDraws(batch.arisan_batch_id);
      if (res.data?.success) {
        setDraws(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching draws:", err);
      Swal.fire("Error", "Gagal mengambil data kocokan", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (batch?.arisan_batch_id) {
      fetchDraws();
    }
  }, [batch]);

  const handleConductDraw = async () => {
    const nextMonth = draws.length + 1;
    if (nextMonth > (batch.cooperation_months || 12)) {
      Swal.fire(
        "Selesai",
        "Kocokan sudah dilakukan untuk seluruh periode (bulan).",
        "info"
      );
      return;
    }

    const confirmRes = await Swal.fire({
      title: `Kocok Untuk Bulan ${nextMonth}?`,
      text: "Sistem akan memilih peserta secara acak (kocokan otomatis).",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, Kocok Sekarang!",
      cancelButtonText: "Batal",
    });

    if (confirmRes.isConfirmed) {
      try {
        const res = await programService.conductArisanDraw(
          batch.arisan_batch_id,
          { draw_month: nextMonth }
        );
        if (res.data?.success) {
          Swal.fire(
            "Berhasil",
            `Pemenang bulan ${nextMonth} telah terpilih!`,
            "success"
          );
          fetchDraws();
        }
      } catch (err) {
        console.error("Error conducting draw:", err);
        const msg = err.response?.data?.message || "Gagal melakukan kocokan";
        Swal.fire("Error", msg, "error");
      }
    }
  };

  const handleOpenProofModal = (item) => {
    setSelectedDraw(item);
    setProofFile(null);
    setShowProofModal(true);
  };

  const handleUploadProof = async () => {
    if (!proofFile) {
      Swal.fire("Error", "Silakan pilih file bukti transfer terlebih dahulu.", "error");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("status", "TRANSFERRED");
      fd.append("bukti_transfer", proofFile);

      const res = await programService.updateArisanDrawStatus(
        selectedDraw.arisan_draw_id,
        fd
      );
      if (res.data?.success) {
        Swal.fire("Berhasil", "Status pencairan berhasil diupdate", "success");
        setShowProofModal(false);
        fetchDraws();
      }
    } catch (err) {
      console.error("Error updating draw status:", err);
      Swal.fire("Error", "Gagal mengupdate status pencairan.", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="d-flex align-items-center mb-4 gap-3">
        <Button
          variant="light"
          onClick={onBack}
          className="p-2 rounded-circle border shadow-sm"
        >
          <ArrowLeft size={20} />
        </Button>
        <div className="flex-grow-1">
          <h4 className="fw-bold text-dark mb-1">
            Riwayat Pencairan / Kocokan - {batch.batch_name}
          </h4>
          <p className="text-muted small mb-0">
            Kelola riwayat pemenang kocokan dan status pencairan dana.
          </p>
        </div>
        <Button
          variant="primary"
          className="d-flex align-items-center gap-2"
          onClick={handleConductDraw}
        >
          <Confetti size={20} /> Kocok Bulan Selanjutnya
        </Button>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table
            hover
            responsive
            borderless
            className="align-middle mb-0 custom-table-admin"
          >
            <thead className="table-light">
              <tr>
                <th className="px-4 py-3">Bulan Ke</th>
                <th className="px-4 py-3">Pemenang</th>
                <th className="px-4 py-3">Tanggal Kocok</th>
                <th className="px-4 py-3 text-end">Total Pencairan</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </td>
                </tr>
              ) : draws.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">
                    Belum ada kocokan dilakukan.
                  </td>
                </tr>
              ) : (
                draws.map((d) => (
                  <tr key={d.arisan_draw_id}>
                    <td className="px-4 py-3 fw-bold">Bulan {d.draw_month}</td>
                    <td className="px-4 py-3">
                      <div className="fw-medium text-dark">
                        {d.winner?.full_name || "-"}
                      </div>
                      <div className="small text-muted">
                        {d.winner?.phone_number || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {d.draw_date
                        ? new Date(d.draw_date).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td className="px-4 py-3 text-end fw-bold text-success">
                      Rp {parseFloat(d.disbursement_amount || 0).toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge
                        bg={d.status === "TRANSFERRED" ? "success" : "warning"}
                      >
                        {d.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {d.status === "PENDING" ? (
                        <Button
                          variant="light"
                          size="sm"
                          className="text-primary d-flex align-items-center gap-1 mx-auto border shadow-sm"
                          onClick={() => handleOpenProofModal(d)}
                        >
                          <Check size={16} /> Tandai Cair
                        </Button>
                      ) : (
                        <div className="d-flex flex-column align-items-center gap-1">
                          <span className="text-muted small d-flex align-items-center">
                            <Check size={16} className="text-success me-1" /> Selesai
                          </span>
                          {d.transfer_proof && (
                            <a
                              href={`https://api.kkpus.id/api/${d.transfer_proof}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-primary small text-decoration-none d-flex align-items-center gap-1"
                            >
                              <Eye size={14} /> Lihat Bukti
                            </a>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal Upload Bukti Transfer */}
      <Modal
        show={showProofModal}
        onHide={() => !uploading && setShowProofModal(false)}
        centered
      >
        <Modal.Header closeButton={!uploading}>
          <Modal.Title className="fs-5 fw-bold">Upload Bukti Transfer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <p className="text-muted small mb-3">
              Anda akan menandai pencairan untuk pemenang{" "}
              <strong>{selectedDraw?.winner?.full_name}</strong> (Bulan ke-
              {selectedDraw?.draw_month}). Silakan upload bukti transfer sejumlah{" "}
              <strong>
                Rp{" "}
                {parseFloat(
                  selectedDraw?.disbursement_amount || 0
                ).toLocaleString("id-ID")}
              </strong>
              .
            </p>
            <Form.Group>
              <Form.Label className="fw-medium small">
                File Bukti Transfer
              </Form.Label>
              <Form.Control
                type="file"
                accept="image/jpeg,image/png,image/jpg,application/pdf"
                onChange={(e) => setProofFile(e.target.files[0])}
                disabled={uploading}
              />
              <Form.Text className="text-muted small">
                Maksimal ukuran file 5MB. Format yang didukung: JPG, PNG, PDF.
              </Form.Text>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pb-4">
          <Button
            variant="light"
            onClick={() => setShowProofModal(false)}
            disabled={uploading}
          >
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleUploadProof}
            disabled={uploading || !proofFile}
          >
            {uploading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Simpan & Cairkan"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArisanDrawView;
