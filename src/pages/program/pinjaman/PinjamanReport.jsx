import React, { useState, useEffect } from "react";
import { Card, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jualBeliService from "../../../utils/api/UJualBeli";
import exportToExcel from "../../../utils/helpers/exportToExcel";
import { jwtEncode } from "../../../utils/helpers";
import {
  ModalTab,
  ListReportTab,
  JurnalTab,
  NeracaTab,
} from "./components/PinjamanReportTabs";
import HutangKasTab from "./components/HutangKasTab";
import AktivaTetapTab from "./components/AktivaTetapTab";

const PinjamanReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("modal");
  const [loading, setLoading] = useState(false);

  const [listData, setListData] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [hutangData, setHutangData] = useState([]);
  const [aktivaTetapData, setAktivaTetapData] = useState([]);
  const [listTotals, setListTotals] = useState({
    tahun_ini: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
    tahun_lalu: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
    tahun_lalu2: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
  });
  const [jurnal, setJurnal] = useState({
    totalDebit: 0,
    totalKredit: 0,
    piutangPokok: 0,
    marginDitangguhkan: 0,
    kasDp: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await jualBeliService.getPinjamanReport();
      if (res.data?.status) {
        const d = res.data.data;
        setListData(d.listData || []);
        if (d.listTotals) setListTotals(d.listTotals);
        if (d.jurnal) setJurnal(d.jurnal);
        if (d.modalData) setModalData(d.modalData);
        if (d.hutangData) setHutangData(d.hutangData);
        if (d.aktivaTetapData) setAktivaTetapData(d.aktivaTetapData);
      }
    } catch (err) {
      console.error("Failed to fetch report data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const handleExportExcel = () => {
    const dataToExport = listData.map((item, idx) => ({
      No: idx + 1,
      Nama: item.nama,
      Keperluan: item.keperluan,
      "Jml Pinjaman Tahun Ini": item.tahun_ini?.total || 0,
      "Jml Pinjaman Thn Lalu": item.tahun_lalu?.total || 0,
      "Jml Pinjaman 2 Thn Lalu": item.tahun_lalu2?.total || 0,
      Termin: item.termin ? `${item.termin} Bln` : "-",
      "Cicilan Tahun Ini": item.tahun_ini?.cicilan || 0,
      "Cicilan Thn Lalu": item.tahun_lalu?.cicilan || 0,
      "Cicilan 2 Thn Lalu": item.tahun_lalu2?.cicilan || 0,
      "Sisa Cicilan":
        (item.tahun_ini?.total || 0) +
        (item.tahun_lalu?.total || 0) +
        (item.tahun_lalu2?.total || 0) -
        ((item.tahun_ini?.cicilan || 0) +
          (item.tahun_lalu?.cicilan || 0) +
          (item.tahun_lalu2?.cicilan || 0)),
      "Cicilan Tak Tertagih": 0,
      Status: item.status === "COMPLETED" ? "Lunas" : "Belum Lunas",
    }));

    exportToExcel(
      dataToExport,
      `Laporan_Pinjaman_${new Date().toISOString().split("T")[0]}`
    );
  };

  return (
    <div className="simpanan-dashboard py-4 px-3 px-md-4">
      {/* Breadcrumb Header */}
      <div className="mb-3">
        <Breadcrumb className="small mb-1">
          <Breadcrumb.Item onClick={() => navigate(`/${jwtEncode("dashboard")}`)}>
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode("pinjamanList")}`)}
          >
            Pinjaman Lunak
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Report Pinjaman Lunak</h4>
          <p className="text-muted small mb-0">
            Laporan neraca dan jurnal transaksi pinjaman lunak anggota.
          </p>
        </div>
        <div>
          <button
            className="btn btn-success d-flex align-items-center"
            onClick={handleExportExcel}
            disabled={loading || listData.length === 0}
          >
            <i className="bi bi-file-earmark-excel me-2" /> Export Excel
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <div className="global-tabs-wrapper mb-3 px-4 pt-3">
                <Nav
                  variant="pills"
                  className="global-tabs border-0 flex-nowrap"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="modal" className="fw-medium">
                      Modal
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="hutang" className="fw-medium">
                      Hutang Kas
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="aktiva" className="fw-medium">
                      Aktiva Tetap
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="list" className="fw-medium">
                      List Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jurnal" className="fw-medium">
                      Jurnal
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="neraca" className="fw-medium">
                      Neraca
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="modal">
                  <ModalTab
                    loading={loading}
                    modalData={modalData}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="hutang">
                  <HutangKasTab
                    loading={loading}
                    hutangData={hutangData}
                    formatRupiah={formatCurrency}
                    refreshData={fetchData}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="aktiva">
                  <AktivaTetapTab
                    loading={loading}
                    aktivaTetapData={aktivaTetapData}
                    formatRupiah={formatCurrency}
                    refreshData={fetchData}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="list">
                  <ListReportTab
                    loading={loading}
                    listData={listData}
                    listTotals={listTotals}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="jurnal">
                  <JurnalTab jurnal={jurnal} formatRupiah={formatCurrency} />
                </Tab.Pane>
                <Tab.Pane eventKey="neraca">
                  <NeracaTab jurnal={jurnal} formatRupiah={formatCurrency} />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default PinjamanReport;
