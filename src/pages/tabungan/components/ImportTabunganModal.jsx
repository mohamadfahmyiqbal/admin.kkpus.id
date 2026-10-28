import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner, Nav, Tab } from "react-bootstrap";
import { UploadSimple, DownloadSimple, Coins, Receipt } from "phosphor-react";
import Swal from "sweetalert2";
import tabunganService from "../../../utils/api/UTabungan";

const ImportTabunganModal = ({ show, onHide, onSuccess }) => {
  const [activeTab, setActiveTab] = useState("master"); // "master" | "transaksi"
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleTabChange = (k) => {
    setActiveTab(k);
    setFile(null);
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Pilih file Excel terlebih dahulu.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      let res;
      if (activeTab === "transaksi") {
        res = await tabunganService.importTransaksiTabungan(formData);
      } else {
        res = await tabunganService.importTabungan(formData);
      }

      if (res.data?.success) {
        const totalImported = res.data.data?.totalImported || 0;
        const totalFailed = res.data.data?.totalFailed || 0;
        const errors = res.data.data?.errors || [];

        let errorHtml = "";
        if (errors.length > 0) {
          const previewErrors = errors.slice(0, 5).map((e) => `<li>Baris ${e.row}: ${e.reason}</li>`).join("");
          errorHtml = `
            <div style="text-align: left; margin-top: 10px; font-size: 12px; max-height: 120px; overflow-y: auto;">
              <b>Catatan Kesalahan (${errors.length}):</b>
              <ul style="padding-left: 18px; margin-top: 4px;">
                ${previewErrors}
                ${errors.length > 5 ? `<li>...dan ${errors.length - 5} baris lainnya</li>` : ""}
              </ul>
            </div>
          `;
        }

        Swal.fire({
          icon: totalImported > 0 ? "success" : "warning",
          title: activeTab === "transaksi" ? "Import Transaksi Selesai" : "Import Tabungan Selesai",
          html: `
            <div>
              <p class="mb-1">Berhasil diimport: <b class="text-success">${totalImported}</b> data</p>
              <p class="mb-1">Gagal / Dilewati: <b class="text-danger">${totalFailed}</b> data</p>
              ${errorHtml}
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

  const handleDownloadTemplate = () => {
    const apiOrigin =
      import.meta.env.VITE_API_ORIGIN ||
      (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445");
    const queryParam = activeTab === "transaksi" ? "?type=transaksi" : "?type=master";
    window.location.href = `${apiOrigin}/api/tabungan/admin/template-import${queryParam}`;
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fs-5 fw-bold text-dark">
          <div className="d-flex align-items-center gap-2">
            <div className="bg-primary bg-opacity-10 p-2 rounded">
              <UploadSimple size={20} weight="bold" className="text-primary" />
            </div>
            Import Data Tabungan
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="pt-3 pb-4 px-3 px-md-4">
        <Tab.Container activeKey={activeTab} onSelect={handleTabChange}>
          {/* Scrollable Tabs Wrapper for Mobile */}
          <div className="global-tabs-wrapper mb-3" style={{ overflowX: "auto" }}>
            <Nav
              variant="pills"
              className="global-tabs tabs-sm flex-nowrap bg-light p-1 rounded-3"
              style={{ width: "fit-content" }}
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="master"
                  className="px-3 py-2 rounded-2 fw-medium d-flex align-items-center gap-2"
                >
                  <Coins size={16} weight="bold" />
                  <span>Master Akun & Saldo Awal</span>
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="transaksi"
                  className="px-3 py-2 rounded-2 fw-medium d-flex align-items-center gap-2"
                >
                  <Receipt size={16} weight="bold" />
                  <span>Transaksi Setoran Tabungan</span>
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>

          <Tab.Content>
            {/* Tab Master */}
            <Tab.Pane eventKey="master">
              <Alert
                variant="info"
                className="d-flex gap-3 align-items-start border-0 bg-primary bg-opacity-10 text-primary mb-3"
              >
                <div className="w-100">
                  <strong className="d-block mb-1">Panduan Import Master Tabungan:</strong>
                  <ol className="mb-0 ps-3 small">
                    <li>Unduh template Excel Master Tabungan di bawah.</li>
                    <li>
                      Isi data akun tabungan anggota (Tabungan Pendidikan, Qurban, Idul Fitri, dll) beserta target dan saldo saat ini.
                    </li>
                    <li>Jika program tabungan belum ada, sistem akan otomatis mendaftarkannya.</li>
                    <li>Unggah file Excel yang sudah diisi ke form berikut.</li>
                  </ol>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="mt-3 d-inline-flex align-items-center gap-2 fw-semibold"
                    onClick={handleDownloadTemplate}
                  >
                    <DownloadSimple size={16} weight="bold" />
                    Unduh Template Master
                  </Button>
                </div>
              </Alert>
            </Tab.Pane>

            {/* Tab Transaksi */}
            <Tab.Pane eventKey="transaksi">
              <Alert
                variant="info"
                className="d-flex gap-3 align-items-start border-0 bg-success bg-opacity-10 text-success mb-3"
              >
                <div className="w-100">
                  <strong className="d-block mb-1">Panduan Import Transaksi Tabungan:</strong>
                  <ol className="mb-0 ps-3 small text-dark">
                    <li>Unduh template Excel Transaksi Tabungan di bawah (sudah berisi referensi akun tabungan anggota terdaftar).</li>
                    <li>
                      Isi rincian <b>Nominal</b>, <b>Tanggal Transaksi</b>, <b>Keterangan</b>, dan <b>Status</b> (PAID / UNPAID).
                    </li>
                    <li>
                      Setoran berstatus <b>PAID</b> akan otomatis menambah saldo tabungan anggota yang bersangkutan.
                    </li>
                    <li>Unggah file Excel yang sudah diisi ke form berikut.</li>
                  </ol>
                  <Button
                    variant="outline-success"
                    size="sm"
                    className="mt-3 d-inline-flex align-items-center gap-2 fw-semibold"
                    onClick={handleDownloadTemplate}
                  >
                    <DownloadSimple size={16} weight="bold" />
                    Unduh Template Transaksi
                  </Button>
                </div>
              </Alert>
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>

        <Form onSubmit={handleSubmit} className="mt-2">
          <Form.Group>
            <Form.Label className="fw-semibold small mb-2 text-dark">
              Unggah File Excel ({activeTab === "transaksi" ? "Transaksi" : "Master"})
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
            {errorMsg && <div className="text-danger small mt-2">{errorMsg}</div>}
            <Form.Text className="text-muted small">
              Format yang didukung: .xlsx, .xls
            </Form.Text>
          </Form.Group>

          <div className="d-flex flex-wrap gap-2 mt-4 pt-2 justify-content-end">
            <Button
              variant="light"
              onClick={onHide}
              disabled={loading}
              className="px-3 px-sm-4 fw-semibold border"
            >
              Batal
            </Button>
            <Button
              variant={activeTab === "transaksi" ? "success" : "primary"}
              type="submit"
              disabled={!file || loading}
              className="px-3 px-sm-4 fw-semibold d-inline-flex align-items-center gap-2"
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
                `Import ${activeTab === "transaksi" ? "Transaksi" : "Master"}`
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ImportTabunganModal;
