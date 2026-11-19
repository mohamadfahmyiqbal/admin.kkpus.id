import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner, Nav } from "react-bootstrap";
import { UploadSimple, DownloadSimple, Coins, Receipt } from "phosphor-react";
import Swal from "sweetalert2";
import programService from "../../../../utils/api/UProgram";
import ImportFailureTable from "../../../../components/ui/ImportFailureTable";

const ImportPinjamanModal = ({ show, onHide, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("master"); // "master" | "transaksi"
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [importResult, setImportResult] = useState(null);

  const handleTabChange = (k) => {
    setActiveTab(k);
    setFile(null);
    setErrorMsg("");
    setImportResult(null);
  };

  const getTemplateDownloadUrl = () => {
    const apiOrigin =
      import.meta.env.VITE_API_ORIGIN ||
      (import.meta.env.VITE_API_URL
        ? new URL(import.meta.env.VITE_API_URL).origin
        : window.location.origin);

    return activeTab === "transaksi"
      ? `${apiOrigin}/api/program/pinjaman/template-import-transaksi`
      : `${apiOrigin}/api/program/pinjaman/template-import`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Pilih file Excel terlebih dahulu.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      let res;
      if (activeTab === "transaksi") {
        res = await programService.importTransaksiPinjaman(formData);
      } else {
        res = await programService.importPinjaman(formData);
      }

      if (res.data?.success) {
        const totalImported = res.data.data?.totalImported || 0;
        const totalFailed = res.data.data?.totalFailed || 0;
        const errors = res.data.data?.errors || [];

        if (errors.length > 0 || totalFailed > 0) {
          setImportResult({
            label:
              activeTab === "transaksi"
                ? "Transaksi Cicilan Pinjaman"
                : "Data Pinjaman",
            totalImported,
            totalFailed,
            errors,
          });
          setFile(null);
          if (onSuccess) onSuccess({ totalImported, totalFailed });
          return;
        }

        Swal.fire({
          icon: totalImported > 0 ? "success" : "warning",
          title:
            activeTab === "transaksi"
              ? "Import Transaksi Selesai"
              : "Import Pinjaman Selesai",
          html: `
            <div>
              <p class="mb-1">Berhasil diimport: <b class="text-success">${totalImported}</b> data</p>
              <p class="mb-1">Gagal / Dilewati: <b class="text-danger">${totalFailed}</b> data</p>
            </div>
          `,
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
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const selected = e.target.files[0];
    if (selected) {
      const validTypes = [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ];
      if (
        !validTypes.includes(selected.type) &&
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
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-2 rounded">
              <UploadSimple size={20} weight="bold" className="text-primary" aria-hidden="true" />
            </div>
            Import Data Pinjaman
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 pb-4 px-4">
        {/* Nav Tabs Pemilihan Tipe Import */}
        <div
          className="global-tabs-wrapper mb-3"
          style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}
        >
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={handleTabChange}
            className="bg-light p-1 rounded-pill flex-nowrap"
            style={{ minWidth: "max-content", width: "100%" }}
          >
            <Nav.Item className="flex-fill text-center">
              <Nav.Link
                eventKey="master"
                className="rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-nowrap"
              >
                <Coins size={18} aria-hidden="true" />
                1. Import Data Pinjaman (Kontrak)
              </Nav.Link>
            </Nav.Item>
            <Nav.Item className="flex-fill text-center">
              <Nav.Link
                eventKey="transaksi"
                className="rounded-pill py-2 fw-semibold d-flex align-items-center justify-content-center gap-2 text-nowrap"
              >
                <Receipt size={18} aria-hidden="true" />
                2. Import Data Transaksi (Cicilan)
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Alert
          variant="info"
          className="d-flex gap-3 align-items-start border-0 bg-primary bg-opacity-10 text-primary"
        >
          <div className="w-100">
            <strong>
              Langkah-langkah{" "}
              {activeTab === "master"
                ? "Import Data Pinjaman"
                : "Import Data Transaksi Cicilan"}
              :
            </strong>
            <ol className="mb-0 mt-2 ps-3 small">
              <li>Unduh template Excel yang telah disediakan di bawah.</li>
              {activeTab === "master" ? (
                <>
                  <li>
                    Isi data pengajuan pinjaman (No. Anggota, Nama Pinjaman,
                    Jumlah, DP, Margin, Tenor, Tanggal Pengajuan, Status, dan
                    Metode Pencairan).
                  </li>
                  <li>
                    Pilih <strong>Status</strong>: <code>APPROVED</code>{" "}
                    (pinjaman aktif berjalan), <code>COMPLETED</code> (lunas),
                    atau <code>PENDING</code>.
                  </li>
                </>
              ) : (
                <>
                  <li>
                    Isi nomor anggota, nama pinjaman, nomor cicilan ke-berapa,
                    nominal bayar, dan tanggal pembayaran.
                  </li>
                  <li>
                    Pilih <strong>Status</strong>: <code>PAID</code> (sudah
                    dibayar / lunas) atau <code>UNPAID</code>.
                  </li>
                </>
              )}
              <li>Unggah file Excel yang sudah diisi ke form di bawah.</li>
            </ol>
            <Button
              variant="outline-primary"
              size="sm"
              className="mt-3 d-flex align-items-center gap-2 fw-semibold"
              onClick={() => {
                window.location.href = getTemplateDownloadUrl();
              }}
            >
              <DownloadSimple size={16} weight="bold" aria-hidden="true" />
              Unduh Template{" "}
              {activeTab === "master"
                ? "Data Pinjaman"
                : "Transaksi Cicilan Pinjaman"}
            </Button>
          </div>
        </Alert>

        {importResult && (
          <div className="mt-3">
            <Alert
              variant={importResult.totalImported > 0 ? "success" : "danger"}
              className="border-0"
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <strong className="d-block">
                    Import {importResult.label}:{" "}
                    {importResult.totalImported > 0
                      ? "Selesai Sebagian"
                      : "Gagal"}
                  </strong>
                  <small>
                    Berhasil diimpor:{" "}
                    <b className="text-success">{importResult.totalImported}</b>{" "}
                    data · Gagal:{" "}
                    <b className="text-danger">{importResult.totalFailed}</b> data
                  </small>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    setImportResult(null);
                    onSuccess?.();
                    onHide();
                  }}
                >
                  Tutup
                </Button>
              </div>
            </Alert>
            <ImportFailureTable
              errors={importResult.errors}
              failedCount={importResult.totalFailed}
              filename={`Data_Gagal_Import_Pinjaman_${activeTab}`}
            />
          </div>
        )}

        <Form onSubmit={handleSubmit} className="mt-4">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark">
              Unggah File Excel (
              {activeTab === "master"
                ? "Data Pinjaman"
                : "Data Transaksi Cicilan"}
              )
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileChange}
                disabled={loading}
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
              disabled={loading}
              className="px-4 fw-semibold border"
            >
              Batal
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!file || loading}
              className="px-4 fw-semibold d-flex align-items-center gap-2"
            >
              {loading ? (
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
                `Import ${activeTab === "master" ? "Data Pinjaman" : "Data Transaksi"}`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImportPinjamanModal;
