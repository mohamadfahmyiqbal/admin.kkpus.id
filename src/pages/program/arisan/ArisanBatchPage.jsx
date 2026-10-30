import React, { useState, useEffect } from "react";
import { Container, Button, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FileArrowDown, Plus } from "phosphor-react";
import Swal from "sweetalert2";
import programService from "../../../utils/api/UProgram";
import { jwtEncode } from "../../../utils/helpers";
import exportToExcel from "../../../utils/helpers/exportToExcel";
import { FileXls } from "phosphor-react";
import ArisanBatchTable from "./components/ArisanBatchTable";
import ArisanBatchModal from "./components/ArisanBatchModal";
import ArisanParticipantsModal from "./components/ArisanParticipantsModal";
import ArisanDrawView from "./components/ArisanDrawView";
import ImportArisanModal from "./components/ImportArisanModal";

const ArisanBatchPage = () => {
  const navigate = useNavigate();
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showBatchModal, setShowBatchModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedBatchIdForParticipants, setSelectedBatchIdForParticipants] =
    useState(null);
  const [selectedBatchForDraw, setSelectedBatchForDraw] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const [formData, setFormData] = useState({
    program_name: "",
    category: "Arisan",
    batch_name: "",
    participants_quota: "",
    target_amount: "",
    monthly_installment: "",
    jumlah_keberangkatan: "",
    term_months: "",
    period_start_month: new Date().getMonth() + 1,
    period_start_year: new Date().getFullYear(),
    status: "DRAFT",
  });

  const fetchBatches = async () => {
    setLoading(true);
    try {
      const res = await programService.getArisanBatches();
      if (res.data?.success) {
        setBatches(res.data.data || []);
      }
    } catch (err) {
      console.error("Error fetching batches:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleSaveBatch = async () => {
    try {
      let res;
      if (editingId) {
        res = await programService.updateArisanBatch(editingId, formData);
      } else {
        res = await programService.createArisanBatch(formData);
      }

      if (res.data?.success) {
        setShowBatchModal(false);
        setFormData({
          program_name: "",
          category: "Arisan",
          batch_name: "",
          participants_quota: "",
          target_amount: "",
          monthly_installment: "",
          jumlah_keberangkatan: "",
          term_months: "",
          period_start_month: new Date().getMonth() + 1,
          period_start_year: new Date().getFullYear(),
          status: "DRAFT",
        });
        setEditingId(null);
        fetchBatches();
        Swal.fire(
          "Berhasil",
          `Batch arisan berhasil ${editingId ? "diperbarui" : "dibuat"}`,
          "success"
        );
      }
    } catch (err) {
      console.error("Error saving batch:", err);
      Swal.fire("Error", "Gagal menyimpan data", "error");
    }
  };

  const handleEditBatch = (item) => {
    setEditingId(item.arisan_batch_id);
    setFormData({
      program_name: item.program_name || "",
      category: item.category || "Arisan",
      batch_name: item.batch_name || "",
      participants_quota: item.participants_quota || "",
      target_amount: item.target_amount || "",
      monthly_installment: item.monthly_installment || "",
      jumlah_keberangkatan: item.jumlah_keberangkatan || "",
      term_months: item.cooperation_months || "",
      period_start_month:
        item.period_start_month || new Date().getMonth() + 1,
      period_start_year:
        item.period_start_year || new Date().getFullYear(),
      status: item.status || "DRAFT",
    });
    setShowBatchModal(true);
  };

  const handleDeleteBatch = async (id) => {
    const confirmRes = await Swal.fire({
      title: "Apakah anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirmRes.isConfirmed) {
      try {
        const res = await programService.deleteArisanBatch(id);
        if (res.data?.success) {
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          fetchBatches();
        }
      } catch (err) {
        console.error("Error deleting batch:", err);
        Swal.fire("Error", "Gagal menghapus data", "error");
      }
    }
  };

  const handleExportBatches = () => {
    if (!batches || batches.length === 0) {
      Swal.fire("Info", "Tidak ada data batch arisan untuk diexport.", "info");
      return;
    }

    const exportRows = batches.map((b, idx) => ({
      No: idx + 1,
      "Program Arisan": b.program_name || "-",
      "Nama Batch": b.batch_name || "-",
      Kategori: b.category || "Arisan",
      "Kuota Peserta": b.participants_quota || 0,
      "Total Terdaftar": b.total_participants || b.participants_count || 0,
      "Target Nominal": parseFloat(b.target_amount) || 0,
      "Iuran Bulanan": parseFloat(b.monthly_installment) || 0,
      "Jumlah Keberangkatan": b.jumlah_keberangkatan || 0,
      "Tenor (Bulan)": b.term_months || 0,
      "Periode Mulai": (b.period_start_month || "-") + "/" + (b.period_start_year || "-"),
      Status: b.status || "-",
    }));

    const today = new Date().toISOString().split("T")[0];
    exportToExcel(exportRows, "Data_Batch_Arisan_" + today);
  };

  const handleOpenNewBatch = () => {
    setEditingId(null);
    setFormData({
      program_name: "",
      category: "Arisan",
      batch_name: "",
      participants_quota: "",
      target_amount: "",
      monthly_installment: "",
      jumlah_keberangkatan: "",
      term_months: "",
      period_start_month: new Date().getMonth() + 1,
      period_start_year: new Date().getFullYear(),
      status: "DRAFT",
    });
    setShowBatchModal(true);
  };

  if (selectedBatchForDraw) {
    return (
      <div className="py-4 px-3 px-md-4">
        {/* Breadcrumb Header */}
        <div className="mb-3">
          <Breadcrumb className="small mb-1">
            <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
              Dashboard
            </Breadcrumb.Item>
            <Breadcrumb.Item
              onClick={() => setSelectedBatchForDraw(null)}
            >
              Arisan Batch
            </Breadcrumb.Item>
            <Breadcrumb.Item active>Riwayat Kocokan</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <ArisanDrawView
          batch={selectedBatchForDraw}
          onBack={() => setSelectedBatchForDraw(null)}
        />
      </div>
    );
  }

  return (
    <div className="page-content py-4 px-3 px-md-4">
      {/* Breadcrumb Header */}
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Program</Breadcrumb.Item>
          <Breadcrumb.Item active>Arisan Batch</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Container fluid className="px-0">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
          <div>
            <h4 className="fw-bold text-dark mb-1">Manajemen Arisan Batch</h4>
            <p className="text-muted small mb-0">
              Kelola master data grup/batch arisan untuk anggota.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              className="d-flex align-items-center gap-2 bg-white"
              onClick={handleExportBatches}
              disabled={loading || batches.length === 0}
              title="Export Batch Arisan ke Excel"
            >
              <FileXls size={20} className="text-success" /> Export Excel
            </Button>
            <Button
              variant="success"
              className="d-flex align-items-center gap-2"
              onClick={() => setShowImportModal(true)}
            >
              <FileArrowDown size={20} /> Import Excel
            </Button>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={handleOpenNewBatch}
            >
              <Plus size={20} /> Buat Batch Baru
            </Button>
          </div>
        </div>

        <ArisanBatchTable
          batches={batches}
          loading={loading}
          onAddNew={handleOpenNewBatch}
          onViewParticipant={(id) => setSelectedBatchIdForParticipants(id)}
          onViewDraw={(b) => setSelectedBatchForDraw(b)}
          onEdit={handleEditBatch}
          onDelete={handleDeleteBatch}
        />

        {/* Modal Buat / Edit Batch */}
        <ArisanBatchModal
          show={showBatchModal}
          onHide={() => setShowBatchModal(false)}
          formData={formData}
          setFormData={setFormData}
          onSave={handleSaveBatch}
          isEditing={Boolean(editingId)}
        />

        {/* Modal Kelola Peserta Arisan */}
        <ArisanParticipantsModal
          batchId={selectedBatchIdForParticipants}
          onBack={() => setSelectedBatchIdForParticipants(null)}
        />

        {/* Modal Import Excel */}
        <ImportArisanModal
          show={showImportModal}
          onHide={() => setShowImportModal(false)}
          onSuccess={() => fetchBatches()}
        />
      </Container>
    </div>
  );
};

export default ArisanBatchPage;
