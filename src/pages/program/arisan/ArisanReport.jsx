import React, { useState, useEffect, useMemo } from "react";
import { Card, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jualBeliService from "../../../utils/api/UJualBeli";
import exportToExcel from "../../../utils/helpers/exportToExcel";
import { jwtEncode } from "../../../utils/helpers";
import {
  ArisanPesertaTab,
  ArisanDanaTab,
  ArisanJurnalTab,
} from "./components/ArisanReportTabs";

const ArisanReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("arisan");
  const [loading, setLoading] = useState(false);
  const [listData, setListData] = useState([]);
  const [danaList, setDanaList] = useState([]);
  const [jurnal, setJurnal] = useState({
    totalSetoran: 0,
    totalPenarikan: 0,
    totalProgram: 0,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await jualBeliService.getArisanReport({ all: true });
      if (res.data?.status) {
        setListData(res.data.data.listData || []);
        setDanaList(res.data.data.danaList || []);
        setJurnal(
          res.data.data.jurnal || {
            totalSetoran: 0,
            totalPenarikan: 0,
            totalProgram: 0,
          }
        );
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
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

  const { listTotals, danaTotals } = useMemo(() => {
    const lTotals = listData.reduce(
      (acc, curr) => {
        acc.total_pembayaran += curr.total_pembayaran || 0;
        acc.sisa_cicilan += curr.sisa_cicilan || 0;
        acc.pembayaran_ini += curr.pembayaran_ini || 0;
        acc.pembayaran_lalu += curr.pembayaran_lalu || 0;
        acc.pembayaran_lalu2 += curr.pembayaran_lalu2 || 0;
        return acc;
      },
      {
        total_pembayaran: 0,
        sisa_cicilan: 0,
        pembayaran_ini: 0,
        pembayaran_lalu: 0,
        pembayaran_lalu2: 0,
      }
    );

    const dTotals = danaList.reduce(
      (acc, curr) => {
        acc.total_komitmen += curr.total_komitmen || 0;
        acc.sisa_komitmen += curr.sisa_komitmen || 0;
        acc.penggunaan_ini += curr.penggunaan_ini || 0;
        acc.penggunaan_lalu += curr.penggunaan_lalu || 0;
        acc.penggunaan_lalu2 += curr.penggunaan_lalu2 || 0;
        return acc;
      },
      {
        total_komitmen: 0,
        sisa_komitmen: 0,
        penggunaan_ini: 0,
        penggunaan_lalu: 0,
        penggunaan_lalu2: 0,
      }
    );

    return { listTotals: lTotals, danaTotals: dTotals };
  }, [listData, danaList]);

  const currentYear = new Date().getFullYear();

  const handleExportExcel = () => {
    const dataToExport = listData.map((item, idx) => ({
      No: idx + 1,
      Nama: item.nama,
      Batch: item.batch,
      Jenis: item.jenis,
      Term: item.term ? `${item.term} Bln` : "-",
      "Total Pembayaran": item.total_pembayaran || 0,
      "Sisa Cicilan": item.sisa_cicilan || 0,
      Status: item.status_cicilan || "-",
      [`Pembayaran ${currentYear}`]: item.pembayaran_ini || 0,
      [`Pembayaran ${currentYear - 1}`]: item.pembayaran_lalu || 0,
      [`Pembayaran ${currentYear - 2}`]: item.pembayaran_lalu2 || 0,
    }));

    exportToExcel(
      dataToExport,
      `Laporan_Arisan_${new Date().toISOString().split("T")[0]}`
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
            onClick={() => navigate(`/${jwtEncode("arisanBatchPage")}`)}
          >
            Arisan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Report Arisan</h4>
          <p className="text-muted small mb-0">
            Laporan pembayaran, penggunaan dana, dan jurnal transaksi arisan.
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
                    <Nav.Link eventKey="arisan" className="fw-medium">
                      Arisan
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="penggunaan_dana" className="fw-medium">
                      Penggunaan Dana
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jurnal" className="fw-medium">
                      Jurnal
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="arisan">
                  <ArisanPesertaTab
                    loading={loading}
                    listData={listData}
                    listTotals={listTotals}
                    currentYear={currentYear}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="penggunaan_dana">
                  <ArisanDanaTab
                    loading={loading}
                    danaList={danaList}
                    danaTotals={danaTotals}
                    currentYear={currentYear}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="jurnal">
                  <ArisanJurnalTab
                    loading={loading}
                    jurnal={jurnal}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Tab.Container>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ArisanReport;
