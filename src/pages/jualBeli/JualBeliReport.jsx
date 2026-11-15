import React, { useState, useEffect, useMemo } from "react";
import { Card, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import jualBeliService from "../../utils/api/UJualBeli";
import { exportToExcel } from "../../utils/helpers/exportToExcel";
import { jwtEncode } from "../../utils/helpers";

import JualBeliReportHeader from "./report/JualBeliReportHeader";
import JualBeliReportListTable from "./report/JualBeliReportListTable";
import JualBeliReportJurnalTable from "./report/JualBeliReportJurnalTable";

const JualBeliReport = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState([]);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await jualBeliService.getJualBeliReport();
      if (res.data?.status) {
        setReportData(res.data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const { listData, listTotals, jurnal } = useMemo(() => {
    const list = reportData;
    const totals = list.reduce(
      (acc, item) => {
        ["tahun_ini", "tahun_lalu", "tahun_lalu2"].forEach((yearKey) => {
          if (item[yearKey]) {
            acc[yearKey].total += Number(item[yearKey].total || 0);
            acc[yearKey].pokok += Number(item[yearKey].pokok || 0);
            acc[yearKey].dp += Number(item[yearKey].dp || 0);
            acc[yearKey].margin += Number(item[yearKey].margin || 0);
            acc[yearKey].cicilan += Number(item[yearKey].cicilan || 0);
          }
        });
        return acc;
      },
      {
        tahun_ini: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
        tahun_lalu: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
        tahun_lalu2: { total: 0, pokok: 0, dp: 0, margin: 0, cicilan: 0 },
      }
    );

    const piutangPokok =
      totals.tahun_ini.pokok +
      totals.tahun_lalu.pokok +
      totals.tahun_lalu2.pokok;
    const marginDitangguhkan =
      totals.tahun_ini.margin +
      totals.tahun_lalu.margin +
      totals.tahun_lalu2.margin;
    const kasDp =
      totals.tahun_ini.dp + totals.tahun_lalu.dp + totals.tahun_lalu2.dp;
    const kasCicilan =
      totals.tahun_ini.cicilan +
      totals.tahun_lalu.cicilan +
      totals.tahun_lalu2.cicilan;
    const kas = kasDp + kasCicilan;
    const piutangJualBeli = piutangPokok - kasDp - kasCicilan;
    const totalDebit = kas + piutangJualBeli;
    const totalKredit = piutangPokok;

    return {
      listData: list,
      listTotals: totals,
      jurnal: {
        totalDebit,
        totalKredit,
        piutangPokok,
        marginDitangguhkan,
        kasDp,
        kasCicilan,
        kas,
        piutangJualBeli,
      },
    };
  }, [reportData]);

  const handleExport = () => {
    const exportData = listData.map((item, idx) => ({
      No: idx + 1,
      Nama: item.nama,
      "Total Pembiayaan Tahun Ini": item.tahun_ini?.total || 0,
      "Pokok Tahun Ini": item.tahun_ini?.pokok || 0,
      "DP Tahun Ini": item.tahun_ini?.dp || 0,
      "Margin Tahun Ini": item.tahun_ini?.margin || 0,
      "Cicilan Tahun Ini": item.tahun_ini?.cicilan || 0,
      "Total Pembiayaan Tahun Lalu": item.tahun_lalu?.total || 0,
      "Pokok Tahun Lalu": item.tahun_lalu?.pokok || 0,
      "DP Tahun Lalu": item.tahun_lalu?.dp || 0,
      "Margin Tahun Lalu": item.tahun_lalu?.margin || 0,
      "Cicilan Tahun Lalu": item.tahun_lalu?.cicilan || 0,
      "Total Pembiayaan 2 Tahun Lalu": item.tahun_lalu2?.total || 0,
      "Pokok 2 Tahun Lalu": item.tahun_lalu2?.pokok || 0,
      "DP 2 Tahun Lalu": item.tahun_lalu2?.dp || 0,
      "Margin 2 Tahun Lalu": item.tahun_lalu2?.margin || 0,
      "Cicilan 2 Tahun Lalu": item.tahun_lalu2?.cicilan || 0,
    }));
    exportToExcel(
      exportData,
      `Laporan_Jual_Beli_${new Date().toISOString().split("T")[0]}`
    );
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="simpanan-dashboard px-md-4">
      {/* Breadcrumb */}
      <div className="mb-2 animate-fade-in">
        <Breadcrumb className="mb-0" style={{ fontSize: "12px" }}>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "dashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() =>
              navigate(`/${jwtEncode({ page: "jualBeliDashboard" })}`)
            }
            style={{ cursor: "pointer" }}
          >
            Jual Beli
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Header & Export Action */}
      <JualBeliReportHeader
        onExport={handleExport}
        loading={loading}
        hasData={listData.length > 0}
      />

      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <div className="global-tabs-wrapper pt-3 mb-0">
              <Tab.Container
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k)}
              >
                <Nav
                  variant="pills"
                  className="global-tabs tabs-sm border-0 px-4 mb-0"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="list">List Report</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jurnal">Jurnal Report</Nav.Link>
                  </Nav.Item>
                </Nav>

                <Tab.Content>
                  <Tab.Pane eventKey="list">
                    <div className="p-3 p-md-4">
                      <JualBeliReportListTable
                        listData={listData}
                        listTotals={listTotals}
                        loading={loading}
                        formatRupiah={formatRupiah}
                        currentYear={currentYear}
                      />
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="jurnal">
                    <div className="p-3 p-md-4">
                      <JualBeliReportJurnalTable
                        jurnal={jurnal}
                        loading={loading}
                        hasData={listData.length > 0}
                        formatRupiah={formatRupiah}
                      />
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Tab.Container>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default JualBeliReport;
