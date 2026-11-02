import React, { useRef, useState } from "react";
import { Modal, Button, Form, Alert, Spinner, Nav } from "react-bootstrap";
import { UploadSimple, DownloadSimple, Receipt, ShoppingCart } from "phosphor-react";
import Swal from "sweetalert2";
import jualBeliService from "../../../utils/api/UJualBeli";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB, sama dengan batas di API

const ImportExcelModal = ({ show, onHide, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("kontrak"); // "kontrak" atau "cicilan"
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef(null);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFile(null);
    setErrorMsg("");
  };

  const resetFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.value = null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Pilih file Excel terlebih dahulu.");
      return;
    }
    setUploading(true);
    setErrorMsg("");
    const formData = new FormData();
    formData.append("file", file);

    try {
      let res;
      if (activeTab === "kontrak") {
        res = await jualBeliService.importJualBeli(formData);
      } else {
        res = await jualBeliService.importCicilanJualBeli(formData);
      }

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Import Berhasil",
          text: `Berhasil import: ${res.data.data.totalImported} data. Gagal import: ${res.data.data.totalFailed} data.`,
          confirmButtonColor: "#28a745",
        }).then(() => {
          setFile(null);
          resetFileInput();
          if (onSuccess) onSuccess();
          onHide();
        });
      } else {
        setErrorMsg(res.data?.message || "Import gagal diproses.");
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengunggah file."
      );
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const selected = e.target.files[0];
    if (selected) {
      const isExcel =
        [
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(selected.type) ||
        selected.name.endsWith(".xlsx") ||
        selected.name.endsWith(".xls");

      if (!isExcel) {
        setErrorMsg("Harap pilih file Excel yang valid (.xlsx atau .xls)");
        setFile(null);
        resetFileInput();
        return;
      }

      if (selected.size > MAX_FILE_SIZE) {
        setErrorMsg("Ukuran file maksimal 5 MB.");
        setFile(null);
        resetFileInput();
        return;
      }

      setFile(selected);
    }
  };

  const handleDownloadTemplate = async () => {
    setDownloading(true);
    setErrorMsg("");
    try {
      const res = await jualBeliService.downloadImportTemplate(activeTab);
      const blob = new Blob([res.data], {
        type:
          res.headers?.["content-type"] ||
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download =
        activeTab === "kontrak"
          ? "Template_Import_Kontrak_JualBeli.xlsx"
          : "Template_Import_Cicilan_JualBeli.xlsx";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengunduh template."
      );
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-2 rounded">
              <UploadSimple size={20} weight="bold" className="text-primary" />
            </div>
            Import Data Jual Beli
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3 pb-4 px-4">
        {/* Nav Tabs Pemilihan Tipe Import dengan horizontal scroll jika sempit */}
        <div className="global-tabs-wrapper mb-3" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="bg-light p-1 rounded-pill flex-nowrap"
            style={{ minWidth: "max-content", width: "100%" }}
          >
            <Nav.Item className="flex-fill text-center">
              <Nav.Link
                eventKey="kontrak"
                className="rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-nowrap"
              >
                <ShoppingCart size={18} />
                1. Import Kontrak Jual Beli
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-fill text-center">
              <Nav.Link
                eventKey="cicilan"
                className="rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-nowrap"
              >
                <Receipt size={18} />
                2. Import Riwayat Cicilan / Setoran
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Alert
          variant="info"
          className="d-flex gap-3 align-items-start border-0 bg-primary bg-opacity-10 text-primary"
        >
          <div>
            <strong>Langkah-langkah {activeTab === "kontrak" ? "Import Kontrak" : "Import Cicilan"}:</strong>
            <ol className="mb-0 mt-2 ps-3 small">
              <li>Unduh template Excel yang telah disediakan di bawah.</li>
              {activeTab === "kontrak" ? (
                <>
                  <li>Isi data transaksi jual beli sesuai dengan format kolom yang ada.</li>
                  <li>
                    Gunakan kolom <strong>Status</strong>: <code>APPROVED</code> (transaksi aktif) atau <code>PENDING</code>.
                  </li>
                </>
              ) : (
                <>
                  <li>Isi nomor anggota, nama transaksi jual beli, nomor cicilan ke-berapa, nominal, dan tanggal pembayarannya.</li>
                  <li>Pilih status cicilan: <code>PAID</code> (sudah lunas) atau <code>UNPAID</code>.</li>
                </>
              )}
              <li>Unggah file Excel yang sudah diisi ke form di bawah.</li>
            </ol>
            <Button
              variant="outline-primary"
              size="sm"
              className="mt-3 d-flex align-items-center gap-2 fw-semibold"
              onClick={handleDownloadTemplate}
              disabled={downloading}
            >
              <DownloadSimple size={16} weight="bold" />
              {downloading
                ? "Mengunduh..."
                : `Unduh Template ${activeTab === "kontrak" ? "Kontrak Jual Beli" : "Riwayat Cicilan"}`}
            </Button>
          </div>
        </Alert>

        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark">
              Unggah File Excel ({activeTab === "kontrak" ? "Kontrak Jual Beli" : "Riwayat Cicilan"})
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={uploading}
                ref={fileInputRef}
                className="py-2 form-control-file"
              />
            </div>
            {errorMsg && (
              <div className="text-danger small mt-2">{errorMsg}</div>
            )}
            <Form.Text className="text-muted small">
              Format yang didukung: .xlsx, .xls
            </Form.Text>
          </Form.Group>

          <div className="d-flex gap-2 mt-4 pt-2 justify-content-end">
            <Button
              variant="light"
              onClick={onHide}
              disabled={uploading}
              className="px-4 fw-semibold border"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!file || uploading}
              className="px-4 fw-semibold d-flex align-items-center gap-2"
            >
              {uploading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  Memproses...
                </>
              ) : (
                `Import ${activeTab === "kontrak" ? "Kontrak" : "Cicilan"}`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImportExcelModal;
