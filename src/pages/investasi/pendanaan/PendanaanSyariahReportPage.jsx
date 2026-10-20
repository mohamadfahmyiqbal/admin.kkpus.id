import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Tab, Nav, Row, Col, Spinner } from "react-bootstrap";
import { ArrowClockwise, FilePdf, FileXls } from "phosphor-react";
import investasiService from "../../../utils/api/UInvestasi";
import exportToExcel from "../../../utils/helpers/exportToExcel";

const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const PendanaanSyariahReportPage = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await investasiService.getPendanaanReport();
      if (res.data?.status) {
        setReportData(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch pendanaan report", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleExportExcel = () => {
    const exportRows = reportData?.listData?.map((item, idx) => ({
      No: idx + 1,
      ID: item.id,
      Nama: item.nama,
      Keperluan: item.keperluan,
      Termin: `${item.termin} Bln`,
      "Total Pembiayaan":
        (item.tahun_ini?.total || 0) +
        (item.tahun_lalu?.total || 0) +
        (item.tahun_lalu2?.total || 0),
      "Total Cicilan Masuk":
        (item.tahun_ini?.cicilan || 0) +
        (item.tahun_lalu?.cicilan || 0) +
        (item.tahun_lalu2?.cicilan || 0),
      Status: item.status,
    }));
    exportToExcel(
      exportRows || [],
      `Laporan_Pendanaan_Syariah_${new Date().toISOString().split("T")[0]}`
    );
  };

  if (loading || !reportData) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" className="mb-3" />
        <p className="text-muted fw-medium">
          Memuat Laporan Pendanaan Syariah...
        </p>
      </div>
    );
  }

  const { jurnal, listData } = reportData;

  return (
    <div className="py-4 px-3 px-md-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Laporan Pendanaan Syariah</h4>
          <p className="text-muted small mb-0">
            Laporan neraca piutang, jurnal mutasi, dan performa pembiayaan anggota.
          </p>
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="white"
            className="border shadow-sm d-flex align-items-center gap-2 fw-medium text-muted"
            onClick={fetchReport}
          >
            <ArrowClockwise size={18} /> Refresh
          </Button>
          <Button
            variant="danger"
            className="shadow-sm d-flex align-items-center gap-2 fw-medium"
          >
            <FilePdf size={18} /> Export PDF
          </Button>
          <Button
            variant="success"
            className="shadow-sm d-flex align-items-center gap-2 fw-medium"
            onClick={handleExportExcel}
            disabled={!reportData?.listData}
          >
            <FileXls size={18} /> Export Excel
          </Button>
        </div>
      </div>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Tab.Container defaultActiveKey="jurnal">
            <div className="global-tabs-wrapper mb-0 px-4 pt-3 border-bottom">
              <Nav
                variant="underline"
                className="global-tabs border-0 flex-nowrap pb-2 gap-3"
              >
                <Nav.Item>
                  <Nav.Link eventKey="jurnal" className="text-dark fw-medium px-2">
                    Jurnal & Neraca
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="list" className="text-dark fw-medium px-2">
                    List Detail Anggota
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>

            <Tab.Content>
              {/* TAB JURNAL */}
              <Tab.Pane eventKey="jurnal">
                <div className="animate-fade-in p-4">
                  <Row className="mb-4 g-3">
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100 rounded-4">
                        <Card.Body>
                          <h6
                            className="text-muted mb-2 fw-bold"
                            style={{ letterSpacing: "1px" }}
                          >
                            TOTAL PENDANAAN
                          </h6>
                          <h3 className="fw-bold text-primary mb-0">
                            {formatCurrency(reportData.total_pinjaman_keluar || 0)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100 rounded-4">
                        <Card.Body>
                          <h6
                            className="text-muted mb-2 fw-bold"
                            style={{ letterSpacing: "1px" }}
                          >
                            TOTAL DIBAYAR
                          </h6>
                          <h3 className="fw-bold text-success mb-0">
                            {formatCurrency(reportData.total_dibayar || 0)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4}>
                      <Card className="border-0 shadow-sm h-100 rounded-4 bg-primary bg-opacity-10">
                        <Card.Body>
                          <h6
                            className="text-primary mb-2 fw-bold"
                            style={{ letterSpacing: "1px" }}
                          >
                            SISA PIUTANG
                          </h6>
                          <h3 className="fw-bold text-primary mb-0">
                            {formatCurrency(reportData.sisa_piutang || 0)}
                          </h3>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>

                  <Card className="border-0 shadow-sm rounded-4 overflow-hidden mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                      <h6 className="mb-0 fw-bold text-dark">
                        Ringkasan Saldo Akhir Pendanaan Syariah
                      </h6>
                    </Card.Header>
                    <div className="table-responsive">
                      <Table className="align-middle mb-0" hover>
                        <thead className="bg-light">
                          <tr>
                            <th className="py-3 px-4 text-muted fw-bold">Akun</th>
                            <th className="py-3 text-muted fw-bold text-end">
                              Debet
                            </th>
                            <th className="py-3 text-muted fw-bold text-end">
                              Kredit
                            </th>
                            <th className="py-3 px-4 text-muted fw-bold text-end">
                              Saldo Akhir
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {jurnal?.saldo_akhir &&
                            Object.entries(jurnal.saldo_akhir).map(
                              ([akun, item]) => (
                                <tr key={akun} className="border-bottom">
                                  <td className="py-3 px-4 fw-medium text-capitalize text-dark">
                                    {akun.replace("_", " ")}
                                  </td>
                                  <td className="py-3 text-end fw-medium">
                                    {formatCurrency(item.debet)}
                                  </td>
                                  <td className="py-3 text-end fw-medium">
                                    {formatCurrency(item.kredit)}
                                  </td>
                                  <td
                                    className={`py-3 px-4 text-end fw-bold ${
                                      item.total >= 0
                                        ? "text-success"
                                        : "text-danger"
                                    }`}
                                  >
                                    {formatCurrency(item.total)}
                                  </td>
                                </tr>
                              )
                            )}
                        </tbody>
                      </Table>
                    </div>
                  </Card>
                </div>
              </Tab.Pane>

              {/* TAB LIST */}
              <Tab.Pane eventKey="list">
                <div className="animate-fade-in p-4">
                  <div className="table-responsive border rounded-4 overflow-hidden shadow-sm">
                    <Table className="align-middle mb-0" hover>
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 px-4 text-muted fw-bold">
                            ID / Nama
                          </th>
                          <th className="py-3 text-muted fw-bold">Keperluan</th>
                          <th className="py-3 text-muted fw-bold text-center">
                            Termin
                          </th>
                          <th className="py-3 text-muted fw-bold text-end">
                            Total Pembiayaan
                          </th>
                          <th className="py-3 text-muted fw-bold text-end">
                            Total Cicilan Masuk
                          </th>
                          <th className="py-3 px-4 text-muted fw-bold text-center">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {listData?.length === 0 ? (
                          <tr>
                            <td
                              colSpan="6"
                              className="text-center py-4 text-muted"
                            >
                              Belum ada data laporan
                            </td>
                          </tr>
                        ) : (
                          listData?.map((item, idx) => {
                            const totalPembiayaan =
                              (item.tahun_ini?.total || 0) +
                              (item.tahun_lalu?.total || 0) +
                              (item.tahun_lalu2?.total || 0);
                            const totalCicilan =
                              (item.tahun_ini?.cicilan || 0) +
                              (item.tahun_lalu?.cicilan || 0) +
                              (item.tahun_lalu2?.cicilan || 0);

                            return (
                              <tr key={idx} className="border-bottom">
                                <td className="py-3 px-4">
                                  <div className="fw-bold text-dark">
                                    {item.nama}
                                  </div>
                                  <small className="text-muted">
                                    ID: {item.id}
                                  </small>
                                </td>
                                <td className="py-3 text-dark">
                                  {item.keperluan}
                                </td>
                                <td className="py-3 text-center fw-medium">
                                  {item.termin} Bln
                                </td>
                                <td className="py-3 text-end fw-bold text-primary">
                                  {formatCurrency(totalPembiayaan)}
                                </td>
                                <td className="py-3 text-end fw-bold text-success">
                                  {formatCurrency(totalCicilan)}
                                </td>
                                <td className="py-3 px-4 text-center">
                                  <Badge
                                    bg={
                                      item.status === "COMPLETED"
                                        ? "success"
                                        : item.status === "ACTIVE"
                                        ? "primary"
                                        : "warning"
                                    }
                                    className="rounded-pill px-3 py-2 bg-opacity-10 text-dark border border-opacity-25"
                                  >
                                    {item.status}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PendanaanSyariahReportPage;
