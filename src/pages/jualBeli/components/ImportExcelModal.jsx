import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { UploadSimple, DownloadSimple } from "phosphor-react";
import Swal from "sweetalert2";
import jualBeliService from "../../../utils/api/UJualBeli";

const ImportExcelModal = ({ show, onHide, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      const res = await jualBeliService.importJualBeli(formData);
      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Import Berhasil",
          html: `Berhasil import: <b>${res.data.data.totalImported}</b> data<br/>Gagal import: <b>${res.data.data.totalFailed}</b> data`,
          confirmButtonColor: "#28a745",
        }).then(() => {
          setFile(null);
          if (onSuccess) onSuccess();
          onHide();
        });
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

  return (
    <Modal show={show} onHide={onHide} centered>
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
        <Alert
          variant="info"
          className="d-flex gap-3 align-items-start border-0 bg-primary bg-opacity-10 text-primary"
        >
          <div>
            <strong>Langkah-langkah:</strong>
            <ol className="mb-0 mt-2 ps-3 small">
              <li>Unduh template Excel yang telah disediakan.</li>
              <li>
                Isi data transaksi jual beli sesuai dengan format kolom yang ada.
              </li>
              <li>Unggah file Excel yang sudah diisi ke form di bawah.</li>
            </ol>
            <Button
              variant="outline-primary"
              size="sm"
              className="mt-3 d-flex align-items-center gap-2 fw-semibold"
              onClick={() => {
                window.location.href =
                  "https://api.kkpus.id/api/jualbeli/template-import";
              }}
            >
              <DownloadSimple size={16} weight="bold" />
              Unduh Template
            </Button>
          </div>
        </Alert>

        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark">
              Unggah File Excel
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={uploading}
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
                "Import Data"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImportExcelModal;
