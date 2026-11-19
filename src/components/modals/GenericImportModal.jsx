import React, { useState, useEffect, useRef } from "react";
import { Modal, Button, Form, Alert, Spinner, Nav, Tab } from "react-bootstrap";
import { UploadSimple, DownloadSimple, Money, Receipt, Coins, TrendUp } from "phosphor-react";
import Swal from "sweetalert2";
import api from "../../utils/api/common";
import ImportFailureTable from "../ui/ImportFailureTable";

/**
 * Definisi tab import simpanan.
 * type  : nilai kolom "Jenis Simpanan" yang dikirim ke backend (db.Savings.savings_type)
 * tabKey: key tab + nilai query ?type= pada endpoint template
 */
export const SIMPANAN_IMPORT_TABS = [
  {
    tabKey: "POKOK",
    type: "POKOK",
    label: "Simpanan Pokok",
    shortLabel: "Pokok",
    icon: Money,
    variant: "primary",
    description:
      "Simpanan pokok adalah setoran awal yang dibayarkan anggota satu kali saat pertama kali mendaftar sebagai anggota koperasi.",
    notes: [
      "Nominal Simpanan Pokok umumnya bersifat tetap sesuai ketentuan koperasi.",
      "Data yang diimpor langsung berstatus Selesai (COMPLETED) karena merupakan data historis.",
    ],
  },
  {
    tabKey: "WAJIB",
    type: "WAJIB",
    label: "Simpanan Wajib",
    shortLabel: "Wajib",
    icon: Receipt,
    variant: "warning",
    description:
      "Simpanan wajib adalah setoran rutin berkala (biasanya bulanan) yang wajib dibayarkan setiap anggota selama keanggotaan.",
    notes: [
      "Gunakan satu baris untuk setiap periode setoran (contoh: Januari 2026, Februari 2026).",
      "Keterangan dapat diisi label periode agar mudah ditelusuri di laporan.",
    ],
  },
  {
    tabKey: "SUKARELA",
    type: "SUKARELA",
    label: "Simpanan Sukarela",
    shortLabel: "Sukarela",
    icon: Coins,
    variant: "info",
    description:
      "Simpanan sukarela adalah setoran tambahan yang besifat opsional dan jumlahnya ditentukan sendiri oleh anggota.",
    notes: [
      "Cocok untuk memasukkan riwayat setoran sukarela anggota secara historis.",
      "Pastikan nominal sesuai dengan bukti setoran anggota.",
    ],
  },
  {
    tabKey: "BERJANGKA",
    type: "BERJANGKA",
    label: "Simpanan Berjangka",
    shortLabel: "Berjangka",
    icon: TrendUp,
    variant: "success",
    description:
      "Simpanan berjangka adalah simpanan dengan target dan jangka waktu tertentu sesuai program yang diikuti anggota.",
    notes: [
      "Isi nominal sesuai dengan jumlah setoran pada periode tersebut.",
      "Gunakan kolom Keterangan untuk mencatat nama program berjangka.",
    ],
  },
];

const GenericImportModal = ({
  show,
  onHide,
  onSuccess,
  title = "Import Data Simpanan Anggota",
  templateEndpoint = "/savings/template-import",
  importEndpoint = "/savings/import",
  templateFileName = "Template_Import_Simpanan.xlsx",
  instructionNotes = [],
  tabs = SIMPANAN_IMPORT_TABS,
}) => {
  const [activeTab, setActiveTab] = useState(tabs[0]?.tabKey || "");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [tabCounts, setTabCounts] = useState({});
  const [importResult, setImportResult] = useState(null);
  const fileInputRef = useRef(null);

  const activeConfig = tabs.find((t) => t.tabKey === activeTab) || tabs[0];

  // Reset state setiap kali modal dibuka / ditutup
  useEffect(() => {
    if (show) {
      setActiveTab(tabs[0]?.tabKey || "");
      setFile(null);
      setErrorMsg("");
      setTabCounts({});
      setImportResult(null);
    }
  }, [show, tabs]);

  // Reset input file & pesan error saat berpindah tab
  const handleTabChange = (key) => {
    setActiveTab(key);
    setFile(null);
    setErrorMsg("");
    setImportResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const buildTemplateUrl = (config) => {
    const base = templateEndpoint.startsWith("/") ? templateEndpoint : `/${templateEndpoint}`;
    return `${base}?type=${encodeURIComponent(config.tabKey)}`;
  };

  const handleDownloadTemplate = async () => {
    if (!activeConfig) return;
    setDownloading(true);
    try {
      const response = await api.get(buildTemplateUrl(activeConfig), {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        templateFileName.replace(/\.xlsx$/i, "") + `_${activeConfig.tabKey}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mendownload template:", err);
      // Fallback: buka langsung via browser (membantu saat CORS/blob bermasalah)
      const apiOrigin =
        import.meta.env.VITE_API_ORIGIN ||
        (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445");
      window.location.href = `${apiOrigin}/api${buildTemplateUrl(activeConfig)}`;
    } finally {
      setDownloading(false);
    }
  };

  const handleFileChange = (e) => {
    setErrorMsg("");
    const selected = e.target.files[0];
    if (!selected) return;

    const isValid =
      [
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel",
      ].includes(selected.type) ||
      selected.name.toLowerCase().endsWith(".xlsx") ||
      selected.name.toLowerCase().endsWith(".xls");

    if (!isValid) {
      setErrorMsg("Harap pilih file Excel yang valid (.xlsx atau .xls)");
      setFile(null);
      e.target.value = null;
      return;
    }
    setFile(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !activeConfig) {
      setErrorMsg("Pilih file Excel terlebih dahulu.");
      return;
    }

    setUploading(true);
    setErrorMsg("");
    setImportResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("savings_type", activeConfig.type);
    formData.append("jenis_simpanan", activeConfig.type);

    try {
      const res = await api.post(importEndpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        const {
          totalImported = 0,
          totalFailed = 0,
          totalSkipped = 0,
          errors = [],
        } = res.data.data || {};

        setTabCounts((prev) => ({
          ...prev,
          [activeConfig.tabKey]: { imported: totalImported, failed: totalFailed },
        }));

        // Ada baris gagal -> tampilkan tabel rincian di dalam modal
        // (tidak langsung ditutup) agar admin bisa memeriksa penyebabnya.
        if (errors.length > 0 || totalFailed > 0) {
          setImportResult({
            type: activeConfig.type,
            label: activeConfig.label,
            totalImported,
            totalFailed,
            totalSkipped,
            errors,
          });
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onSuccess?.({ type: activeConfig.type, totalImported, totalFailed });
          return;
        }

        let detailsHtml = `
          <div style="text-align:left;">
            <p class="mb-1">Jenis Simpanan: <b>${activeConfig.label}</b></p>
            <p class="mb-1">Berhasil diimpor: <b style="color:#198754;">${totalImported}</b> data</p>
            <p class="mb-1">Gagal / Dilewati: <b style="color:#dc3545;">${totalFailed}</b> data</p>
          </div>
        `;

        Swal.fire({
          icon: totalImported > 0 ? "success" : "warning",
          title: totalImported > 0 ? "Import Selesai" : "Import Gagal Diproses",
          html: detailsHtml,
          confirmButtonColor: "#28a745",
        }).then(() => {
          setFile(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
          onSuccess?.({ type: activeConfig.type, totalImported, totalFailed });
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

  if (!activeConfig) return null;

  const ActiveIcon = activeConfig.icon;

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
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

      <Modal.Body className="pt-3 pb-4 px-3 px-md-4">
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          {/* Tabs jenis simpanan */}
          <div className="global-tabs-wrapper mb-3" style={{ overflowX: "auto" }}>
            <Nav
              variant="pills"
              className="global-tabs tabs-sm flex-nowrap bg-light p-1 rounded-3"
              style={{ width: "fit-content" }}
            >
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const count = tabCounts[tab.tabKey];
                return (
                  <Nav.Item key={tab.tabKey}>
                    <Nav.Link
                      eventKey={tab.tabKey}
                      className="px-3 py-2 rounded-2 fw-medium d-flex align-items-center gap-2"
                    >
                      <Icon size={16} weight="bold" />
                      <span>{tab.label}</span>
                      {count ? (
                        <span className="badge bg-success rounded-pill ms-1">
                          {count.imported}
                        </span>
                      ) : null}
                    </Nav.Link>
                  </Nav.Item>
                );
              })}
            </Nav>
          </div>

          <Tab.Content>
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tab.Pane eventKey={tab.tabKey} key={tab.tabKey}>
                  <Alert
                    variant="info"
                    className={`d-flex gap-3 align-items-start border-0 bg-${tab.variant} bg-opacity-10 text-${tab.variant} mb-3`}
                  >
                    <div className="w-100">
                      <strong className="d-flex align-items-center gap-2 mb-1">
                        <Icon size={16} weight="fill" />
                        {tab.label}
                      </strong>
                      {tab.description && (
                        <p
                          className="mb-2 small"
                          style={{ color: "inherit", opacity: 0.9 }}
                        >
                          {tab.description}
                        </p>
                      )}
                      <strong>Petunjuk Import:</strong>
                      <ol className="mb-0 mt-2 ps-3 small" style={{ color: "inherit" }}>
                        <li>
                          Unduh template Excel <b>{tab.label}</b> di bawah (kolom Jenis
                          Simpanan sudah terisi otomatis).
                        </li>
                        {instructionNotes.map((note, idx) => (
                          <li key={idx}>{note}</li>
                        ))}
                        {(tab.notes || []).map((note, idx) => (
                          <li key={`note-${idx}`}>{note}</li>
                        ))}
                        <li>Unggah file Excel yang sudah diisi ke formulir di bawah ini.</li>
                      </ol>
                      <Button
                        variant={`outline-${tab.variant}`}
                        size="sm"
                        className="mt-3 d-inline-flex align-items-center gap-2 fw-semibold"
                        onClick={handleDownloadTemplate}
                        disabled={downloading}
                      >
                        {downloading ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          <DownloadSimple size={16} weight="bold" />
                        )}
                        Unduh Template {tab.shortLabel}
                      </Button>
                    </div>
                  </Alert>
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        </Tab.Container>

        {importResult && (
          <div className="mt-3">
            <Alert
              variant={importResult.totalImported > 0 ? "success" : "danger"}
              className="border-0 mb-0"
            >
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div>
                  <strong className="d-block">
                    Import {importResult.label}:{" "}
                    {importResult.totalImported > 0 ? "Selesai Sebagian" : "Gagal"}
                  </strong>
                  <small>
                    Berhasil diimpor:{" "}
                    <b className="text-success">
                      {importResult.totalImported}
                    </b>{" "}
                    baris
                    {importResult.totalFailed > 0 && (
                      <>
                        {" "}
                        · Gagal:{" "}
                        <b className="text-danger">
                          {importResult.totalFailed}
                        </b>{" "}
                        baris
                      </>
                    )}
                    {importResult.totalSkipped > 0 && (
                      <>
                        {" "}
                        · Dilewati:{" "}
                        <b className="text-secondary">
                          {importResult.totalSkipped}
                        </b>{" "}
                        baris
                      </>
                    )}
                  </small>
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    setImportResult(null);
                    onSuccess?.({
                      type: importResult.type,
                      totalImported: importResult.totalImported,
                      totalFailed: importResult.totalFailed,
                    });
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
              filename={`Data_Gagal_Import_${importResult.type}`}
            />
          </div>
        )}

        <Form onSubmit={handleSubmit} className="mt-2">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark d-flex align-items-center gap-2">
              <ActiveIcon size={15} weight="bold" />
              Unggah File Excel — {activeConfig.label} (.xlsx / .xls)
            </Form.Label>
            <Form.Control
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={uploading}
              className="py-2"
            />
            {file && (
              <div className="small text-muted mt-1">
                File dipilih: <b>{file.name}</b> ({(file.size / 1024).toFixed(1)} KB)
              </div>
            )}
            {errorMsg && <div className="text-danger small mt-2">{errorMsg}</div>}
            <Form.Text className="text-muted small">
              Format yang didukung: Microsoft Excel (.xlsx, .xls). Data pada tab{" "}
              {activeConfig.label} akan disimpan sebagai jenis simpanan{" "}
              <b>{activeConfig.type}</b>.
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
              variant={activeConfig.variant}
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
                `Import ${activeConfig.shortLabel}`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default React.memo(GenericImportModal);