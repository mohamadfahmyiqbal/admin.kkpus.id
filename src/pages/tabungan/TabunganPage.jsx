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
} from "phosphor-react";
import Swal from "sweetalert2";
import tabunganService from "../../utils/api/UTabungan";
import commonApi from "../../utils/api/common";
import { jwtEncode } from "../../utils/helpers";
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
    <div className="py-4 px-3 px-md-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* Breadcrumb Header */}
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Tabungan</Breadcrumb.Item>
          <Breadcrumb.Item active>List</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-0">Manajemen Tabungan</h4>
          <p className="text-muted small mb-0">
            Kelola progress simpanan target/tabungan mudharabah anggota.
          </p>
        </div>
        <div className="d-flex gap-2">
          {activeTab === "peserta" && (
            <Button
              variant="success"
              onClick={() => setShowImportModal(true)}
              className="fw-medium d-flex align-items-center gap-2 px-3 shadow-sm rounded-3"
            >
              <FileArrowDown size={18} weight="bold" />
              Import Excel
            </Button>
          )}
          {activeTab === "program" && (
            <Button
              variant="primary"
              onClick={() => {
                setSelectedProgram(null);
                setShowProgramModal(true);
              }}
              className="fw-medium d-flex align-items-center gap-2 px-3 shadow-sm rounded-3"
            >
              <Plus size={18} weight="bold" />
              Buat Program Tabungan
            </Button>
          )}
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav
          variant="pills"
          className="global-tabs tabs-md flex-nowrap mb-4 bg-white p-1 rounded-4 shadow-sm"
          style={{ width: "fit-content" }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="peserta"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Daftar Peserta
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="transaksi"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Transaksi & Persetujuan
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="program"
              className="px-4 py-2 rounded-pill fw-medium transition-all"
            >
              Master Program
            </Nav.Link>
          </Nav.Item>
        </Nav>

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
                <Row className="mb-4 g-3">
                  {summaryCards.map((c) => (
                    <Col xs={12} md={6} lg={3} key={c.id}>
                      <Card
                        className="shadow-sm border-0 h-100"
                        style={{ borderRadius: "12px" }}
                      >
                        <Card.Body className="p-4 d-flex align-items-center">
                          <div
                            className="me-3 bg-light rounded-circle d-flex align-items-center justify-content-center text-primary"
                            style={{ width: "52px", height: "52px", flexShrink: 0 }}
                          >
                            <Coins size={24} weight="bold" />
                          </div>
                          <div>
                            <h6 className="text-muted fw-semibold mb-1 small text-uppercase">
                              {c.title}
                            </h6>
                            <h4 className="fw-bold text-dark mb-0">{c.total}</h4>
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
                  <Table hover className="mb-0 align-middle custom-table-admin">
                    <thead className="bg-light">
                      <tr>
                        <th className="px-4 py-3 font-medium text-muted small">No</th>
                        <th className="px-4 py-3 font-medium text-muted small">Nama Program</th>
                        <th className="px-4 py-3 font-medium text-muted small">Kategori</th>
                        <th className="px-4 py-3 font-medium text-muted small text-center">Aksi</th>
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
                            <td className="px-4 py-3 text-muted small">{idx + 1}</td>
                            <td className="px-4 py-3 fw-medium text-dark">
                              {p.target_name || "-"}
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                bg="info"
                                className="bg-opacity-10 text-info px-2 py-1 rounded-pill fw-medium border-0"
                              >
                                {p.category || "-"}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <div className="d-flex justify-content-center gap-2">
                                <Button
                                  variant="light"
                                  size="sm"
                                  className="btn-icon text-primary rounded-circle border shadow-sm p-1"
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
                                  className="btn-icon text-danger rounded-circle border shadow-sm p-1"
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
