import React, { useState, useEffect } from "react";
import { Container, Button, Tab, Nav, Row, Col, Card, Breadcrumb, Table, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  FileArrowDown,
  Plus,
  Coins,
  PencilSimple,
  Trash,
  FolderOpen,
  FileXls,
} from "phosphor-react";
import Swal from "sweetalert2";
import tabunganService from "../../utils/api/UTabungan";
import commonApi from "../../utils/api/common";
import { jwtEncode } from "../../utils/helpers";
import exportToExcel from "../../utils/helpers/exportToExcel";
import TabunganProgressTable from "./components/TabunganProgressTable";
import TabunganTransactionsTab from "./components/TabunganTransactionsTab";
import MasterProgramModal from "./components/MasterProgramModal";
import ImportTabunganModal from "./components/ImportTabunganModal";

const TabunganPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("peserta");
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  const [summaryCards, setSummaryCards] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [masterPrograms, setMasterPrograms] = useState([]);

  const [showProgramModal, setShowProgramModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchTabunganSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await commonApi.get("/tabungan/admin");
      if (res.data?.data) {
        const summary = res.data.data.summary || {};
        const cards = [];
        let idCounter = 1;

        const formatCurrency = (val) =>
          new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
          }).format(val || 0);

        Object.keys(summary)
          .sort((a, b) => b - a)
          .forEach((year) => {
            const yData = summary[year];
            Object.keys(yData).forEach((cat) => {
              cards.push({
                id: idCounter++,
                title: `Tabungan ${cat} (${year})`,
                total: formatCurrency(yData[cat]),
                year,
              });
            });
          });

        setSummaryCards(cards);
        setTableData(
          (res.data.data.list || []).map((item) => ({
            id: item.id,
            kategori: item.kategori,
            nama: item.nama,
            term: item.term,
            target: item.target,
            setoran: item.setoran,
            saldo: item.saldo,
            status: item.status,
            members: item.members || [],
          }))
        );
      }
    } catch (err) {
      console.error("Gagal mengambil data tabungan:", err);
    } finally {
      setLoadingSummary(false);
    }
  };

  const fetchMasterPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const res = await tabunganService.getPrograms();
      if (res.data?.success) {
        setMasterPrograms(res.data.data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil program tabungan:", err);
    } finally {
      setLoadingPrograms(false);
    }
  };

  useEffect(() => {
    fetchTabunganSummary();
    fetchMasterPrograms();
  }, []);

  const handleExportTabungan = () => {
    if (!tableData || tableData.length === 0) {
      Swal.fire("Info", "Tidak ada data tabungan untuk diexport.", "info");
      return;
    }

    const exportRows = [];
    tableData.forEach((program, pIdx) => {
      if (program.members && program.members.length > 0) {
        program.members.forEach((m, mIdx) => {
          exportRows.push({
            No: exportRows.length + 1,
            "Program Tabungan": program.nama || "-",
            Kategori: program.kategori || "-",
            "No. Anggota": m.no_anggota || m.member_id || "-",
            "Nama Anggota": m.nama || m.nama_anggota || "-",
            "Target Nominal": parseFloat(m.target || program.target) || 0,
            "Total Setoran": parseFloat(m.setoran) || 0,
            "Saldo Akhir": parseFloat(m.saldo) || 0,
            "Tenor (Bulan)": m.term || program.term || "-",
            Status: m.status || program.status || "Aktif",
          });
        });
      } else {
        exportRows.push({
          No: exportRows.length + 1,
          "Program Tabungan": program.nama || "-",
          Kategori: program.kategori || "-",
          "No. Anggota": "-",
          "Nama Anggota": "-",
          "Target Nominal": parseFloat(program.target) || 0,
          "Total Setoran": parseFloat(program.setoran) || 0,
          "Saldo Akhir": parseFloat(program.saldo) || 0,
          "Tenor (Bulan)": program.term || "-",
          Status: program.status || "Aktif",
        });
      }
    });

    const today = new Date().toISOString().split("T")[0];
    exportToExcel(exportRows, `Data_Peserta_Tabungan_${today}`);
  };

  const handleExportPrograms = () => {
    if (!masterPrograms || masterPrograms.length === 0) {
      Swal.fire("Info", "Tidak ada master program tabungan untuk diexport.", "info");
      return;
    }

    const exportRows = masterPrograms.map((prog, idx) => ({
      No: idx + 1,
      "Nama Program": prog.nama || "-",
      Kategori: prog.kategori || "-",
      "Target Nominal": parseFloat(prog.target) || 0,
      "Setoran Rutin": parseFloat(prog.setoran) || 0,
      "Tenor (Bulan)": prog.term || 0,
      Deskripsi: prog.deskripsi || "-",
      Status: prog.status || "Aktif",
    }));

    const today = new Date().toISOString().split("T")[0];
    exportToExcel(exportRows, `Master_Program_Tabungan_${today}`);
  };

  const handleDeleteProgram = (id) => {
    Swal.fire({
      title: "Hapus Program Tabungan?",
      text: "Program yang sudah memiliki peserta tidak dapat dihapus.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#adb5bd",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await tabunganService.deleteProgram(id);
          Swal.fire("Terhapus!", "Program tabungan berhasil dihapus.", "success");
          fetchMasterPrograms();
        } catch (err) {
          Swal.fire(
            "Gagal",
            err?.response?.data?.message || "Terjadi kesalahan sistem",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="py-3 py-md-4 px-2 px-sm-3 px-md-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Breadcrumb Header */}
      <div className="mb-2 mb-md-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Tabungan</Breadcrumb.Item>
          <Breadcrumb.Item active>List</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center mb-3 mb-md-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1 fs-5 fs-sm-4">Manajemen Tabungan</h4>
          <p className="text-muted small mb-0">
            Kelola progress simpanan target/tabungan mudharabah anggota.
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {activeTab === "peserta" && (
            <>
              <Button
                variant="outline-success"
                onClick={handleExportTabungan}
                className="fw-medium d-inline-flex align-items-center gap-1 gap-sm-2 px-3 py-2 shadow-sm rounded-3 text-nowrap flex-grow-1 flex-sm-grow-0 justify-content-center bg-white"
                size="sm"
                disabled={loadingSummary || tableData.length === 0}
                title="Export Data Peserta Tabungan ke Excel"
              >
                <FileXls size={18} weight="bold" className="text-success" />
                <span>Export Excel</span>
              </Button>
              <Button
                variant="success"
                onClick={() => setShowImportModal(true)}
                className="fw-medium d-inline-flex align-items-center gap-1 gap-sm-2 px-3 py-2 shadow-sm rounded-3 text-nowrap flex-grow-1 flex-sm-grow-0 justify-content-center"
                size="sm"
              >
                <FileArrowDown size={18} weight="bold" />
                <span>Import Excel</span>
              </Button>
            </>
          )}
          {activeTab === "program" && (
            <>
              <Button
                variant="outline-success"
                onClick={handleExportPrograms}
                className="fw-medium d-inline-flex align-items-center gap-1 gap-sm-2 px-3 py-2 shadow-sm rounded-3 text-nowrap flex-grow-1 flex-sm-grow-0 justify-content-center bg-white"
                size="sm"
                disabled={loadingPrograms || masterPrograms.length === 0}
                title="Export Master Program Tabungan ke Excel"
              >
                <FileXls size={18} weight="bold" className="text-success" />
                <span>Export Excel</span>
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setSelectedProgram(null);
                  setShowProgramModal(true);
                }}
                className="fw-medium d-inline-flex align-items-center gap-1 gap-sm-2 px-3 py-2 shadow-sm rounded-3 text-nowrap flex-grow-1 flex-sm-grow-0 justify-content-center"
                size="sm"
              >
                <Plus size={18} weight="bold" />
                <span>Buat Program</span>
              </Button>
            </>
          )}
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        {/* Scrollable Tabs Wrapper for Mobile */}
        <div className="global-tabs-wrapper mb-3 mb-md-4 pb-2" style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
          <Nav
            variant="pills"
            className="global-tabs tabs-md flex-nowrap bg-white p-1 rounded-4 shadow-sm"
            style={{ width: "fit-content" }}
          >
            <Nav.Item>
              <Nav.Link
                eventKey="peserta"
                className="px-3 px-md-4 py-2 rounded-pill fw-medium transition-all text-nowrap"
              >
                Daftar Peserta
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="transaksi"
                className="px-3 px-md-4 py-2 rounded-pill fw-medium transition-all text-nowrap"
              >
                Transaksi & Persetujuan
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="program"
                className="px-3 px-md-4 py-2 rounded-pill fw-medium transition-all text-nowrap"
              >
                Master Program
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Tab.Content>
          {/* Tab 1: Daftar Peserta & Cards */}
          <Tab.Pane eventKey="peserta">
            {loadingSummary ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "40vh" }}
              >
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : (
              <>
                {/* Summary Cards */}
                <Row className="mb-3 mb-md-4 g-2 g-sm-3">
                  {summaryCards.map((c) => (
                    <Col xs={12} sm={6} lg={3} key={c.id}>
                      <Card
                        className="shadow-sm border-0 h-100"
                        style={{ borderRadius: "12px" }}
                      >
                        <Card.Body className="p-3 p-md-4 d-flex align-items-center">
                          <div
                            className="me-3 bg-light rounded-circle d-flex align-items-center justify-content-center text-primary flex-shrink-0"
                            style={{ width: "46px", height: "46px" }}
                          >
                            <Coins size={22} weight="bold" />
                          </div>
                          <div className="overflow-hidden">
                            <h6 className="text-muted fw-semibold mb-1 extra-small text-uppercase text-truncate">
                              {c.title}
                            </h6>
                            <h5 className="fw-bold text-dark mb-0 fs-6 fs-md-5 text-truncate">{c.total}</h5>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                <TabunganProgressTable
                  currentPage="tabunganList"
                  tableData={tableData}
                />
              </>
            )}
          </Tab.Pane>

          {/* Tab 2: Transaksi & Persetujuan */}
          <Tab.Pane eventKey="transaksi">
            <TabunganTransactionsTab />
          </Tab.Pane>

          {/* Tab 3: Master Program */}
          <Tab.Pane eventKey="program">
            {loadingPrograms ? (
              <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "40vh" }}
              >
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : (
              <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                <div className="table-responsive">
                  <Table hover className="mb-0 align-middle custom-table-admin text-nowrap">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-3 px-md-4 py-3 font-medium text-muted small">No</th>
                        <th className="px-3 px-md-4 py-3 font-medium text-muted small">Nama Program</th>
                        <th className="px-3 px-md-4 py-3 font-medium text-muted small">Kategori</th>
                        <th className="px-3 px-md-4 py-3 font-medium text-muted small text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {masterPrograms.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <div className="text-muted mb-3">
                              <FolderOpen size={48} className="text-light mb-2 opacity-50" />
                              <br />
                              Belum ada master program tabungan.
                            </div>
                          </td>
                        </tr>
                      ) : (
                        masterPrograms.map((p, idx) => (
                          <tr
                            key={p.saving_target_id || idx}
                            className="border-bottom"
                            style={{ borderColor: "#f8fafc" }}
                          >
                            <td className="px-3 px-md-4 py-3 text-muted small">{idx + 1}</td>
                            <td className="px-3 px-md-4 py-3 fw-medium text-dark">
                              {p.target_name || "-"}
                            </td>
                            <td className="px-3 px-md-4 py-3">
                              <Badge
                                bg="info"
                                className="bg-opacity-10 text-info px-2 py-1 rounded-pill fw-medium border-0"
                              >
                                {p.category || "-"}
                              </Badge>
                            </td>
                            <td className="px-3 px-md-4 py-3 text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon text-primary rounded-circle border shadow-sm p-1 d-inline-flex align-items-center justify-content-center"
                                  style={{ width: "32px", height: "32px" }}
                                  onClick={() => {
                                    setSelectedProgram(p);
                                    setShowProgramModal(true);
                                  }}
                                  title="Edit Program"
                                >
                                  <PencilSimple size={18} />
                                </Button>
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon text-danger rounded-circle border shadow-sm p-1 d-inline-flex align-items-center justify-content-center"
                                  style={{ width: "32px", height: "32px" }}
                                  onClick={() => handleDeleteProgram(p.saving_target_id)}
                                  title="Hapus Program"
                                >
                                  <Trash size={18} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              </Card>
            )}
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>

      {/* Modal Buat / Edit Master Program */}
      <MasterProgramModal
        show={showProgramModal}
        onHide={() => setShowProgramModal(false)}
        program={selectedProgram}
        onSuccess={() => {
          setShowProgramModal(false);
          fetchMasterPrograms();
        }}
      />

      {/* Modal Import Excel */}
      <ImportTabunganModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onSuccess={() => fetchTabunganSummary()}
      />
    </div>
  );
};

export default TabunganPage;
