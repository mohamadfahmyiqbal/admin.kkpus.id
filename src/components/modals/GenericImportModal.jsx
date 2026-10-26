import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { UploadSimple, DownloadSimple } from "phosphor-react";
import Swal from "sweetalert2";
import api from "../../utils/api/common";

const GenericImportModal = ({
  show,
  onHide,
  onSuccess,
  title = "Import Data Excel",
  templateEndpoint = "",
  importEndpoint = "",
  templateFileName = "Template_Import.xlsx",
  instructionNotes = [],
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get(templateEndpoint, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", templateFileName);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mendownload template:", err);
      const apiOrigin =
        import.meta.env.VITE_API_ORIGIN ||
        (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445");
      const cleanEndpoint = templateEndpoint.startsWith("/")
        ? templateEndpoint
        : `/${templateEndpoint}`;
      window.location.href = `${apiOrigin}/api${cleanEndpoint}`;
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const selected = e.target.files[0];
    if (selected) {
      if (
        ![
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "application/vnd.ms-excel",
        ].includes(selected.type) &&
        !selected.name.endsWith(".xlsx") &&
        !selected.name.endsWith(".xls")
      ) {
        setErrorMsg("Harap pilih file Excel yang valid (.xlsx atau .xls)");
        setFile(null);
        e.target.value = null;
        return;
      }
      setFile(selected);
    }
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
      const res = await api.post(importEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        const { totalImported, totalFailed, errors } = res.data.data || {};
        let detailsHtml = `Berhasil diimpor: <b>${totalImported ?? 0}</b> data<br/>Gagal: <b>${totalFailed ?? 0}</b> data`;

        if (errors && errors.length > 0) {
          detailsHtml += `<hr/><div style="max-height: 140px; overflow-y: auto; text-align: left; font-size: 12px;">`;
          errors.slice(0, 5).forEach((err) => {
            detailsHtml += `Baris ${err.row || "-"}: ${err.reason || err.message || JSON.stringify(err)}<br/>`;
          });
          if (errors.length > 5) {
            detailsHtml += `... dan ${errors.length - 5} kesalahan lainnya.`;
          }
          detailsHtml += `</div>`;
        }

        Swal.fire({
          icon: totalImported > 0 ? "success" : "warning",
          title: totalImported > 0 ? "Import Selesai" : "Import Gagal Diproses",
          html: detailsHtml,
          confirmButtonColor: "#28a745",
        }).then(() => {
          setFile(null);
          onSuccess?.();
          onHide();
        });
      } else {
        setErrorMsg(res.data?.message || "Gagal mengimpor file Excel.");
      }
    } catch (err) {
      console.error("Import error:", err);
      setErrorMsg(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat mengunggah file."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-2 rounded">
              <UploadSimple size={20} weight="bold" className="text-primary" />
            </div>
            {title}
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 pb-4 px-4">
        <Alert
          variant="info"
          className="d-flex gap-3 align-items-start border-0 bg-primary bg-opacity-10 text-primary"
        >
          <div className="w-100">
            <strong>Petunjuk Import:</strong>
            <ol className="mb-0 mt-2 ps-3 small">
              <li>Unduh template file Excel yang telah disediakan di bawah.</li>
              <li>Isi data transaksi sesuai dengan kolom dan format yang ditentukan.</li>
              {instructionNotes.map((note, idx) => (
                <li key={idx}>{note}</li>
              ))}
              <li>Pastikan No. Anggota yang dimasukkan sudah terdaftar di sistem.</li>
              <li>Unggah file Excel yang sudah diisi ke formulir di bawah ini.</li>
            </ol>
            {templateEndpoint && (
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-3 d-flex align-items-center gap-2 fw-semibold"
                onClick={handleDownloadTemplate}
              >
                <DownloadSimple size={16} weight="bold" />
                Unduh Template Excel
              </Button>
            )}
          </div>
        </Alert>

        <Form onSubmit={handleSubmit} className="mt-3">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark">
              Pilih File Excel (.xlsx / .xls)
            </Form.Label>
            <Form.Control
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="py-2"
            />
            {errorMsg && <div className="text-danger small mt-2">{errorMsg}</div>}
            <Form.Text className="text-muted small">
              Format yang didukung: Microsoft Excel (.xlsx, .xls)
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
                  <Spinner animation="border" size="sm" />
                  Mengimpor...
                </>
              ) : (
                "Import Data"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(GenericImportModal);
