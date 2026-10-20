import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Tab, Nav } from "react-bootstrap";
import tabunganService from "../../utils/api/UTabungan";
import exportToExcel from "../../utils/helpers/exportToExcel";
import TabunganReportHeader from "./report/TabunganReportHeader";
import TabunganListReportTab from "./report/TabunganListReportTab";
import TabunganJurnalTab from "./report/TabunganJurnalTab";

const TabunganReportPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState(Array(16).fill(""));

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await tabunganService.getAdminTabungan();
      if (res.data?.status) {
        const list = res.data.data.list || [];
        const summary = {
          total_saldo: 0,
          total_target: 0,
          total_value_per_bulan: 0,
          total_kekurangan: 0,
          total_piutang: 0,
          total_term_now: 0,
          total_term_1: 0,
          total_term_2: 0,
          total_term_sisa: 0,
          total_aktual_now: 0,
          total_aktual_1: 0,
          total_aktual_2: 0,
          categories: {},
        };

        const rows = [];
        let counter = 1;

        list.forEach((prog) => {
          (prog.members || []).forEach((m) => {
            const termVal = m.term ? parseInt(m.term) : 0;
            const setoranVal = m.setoran || 0;
            const targetVal = m.target || 0;
            const saldoVal = m.saldo || 0;
            const kekurVal = m.kekurangan || 0;
            const cat = m.kategori || "Lainnya";

            rows.push({
              id: m.member_saving_target_id,
              no: counter++,
              no_transaksi: `TRX-${m.member_saving_target_id}`,
              bulan_pencairan: "-",
              nama: m.nama,
              termin: termVal,
              value_per_bulan: setoranVal,
              target: targetVal,
              term_now: 0,
              term_1: 0,
              term_2: 0,
              term_sisa: termVal,
              aktual_now: saldoVal,
              aktual_1: 0,
              aktual_2: 0,
              kekurangan: kekurVal,
              piutang: 0,
            });

            summary.total_saldo += saldoVal;
            summary.total_target += targetVal;
            summary.total_value_per_bulan += setoranVal;
            summary.total_kekurangan += kekurVal;
            summary.total_term_sisa += termVal;
            summary.total_aktual_now += saldoVal;
            summary.categories[cat] = (summary.categories[cat] || 0) + saldoVal;
          });
        });

        setReportData(rows);
        setSummaryData(summary);
      }
    } catch (err) {
      console.error("Failed to fetch tabungan report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const handleSearchChange = useCallback((index, val) => {
    setSearchFilters((prev) => {
      const updated = [...prev];
      updated[index] = val;
      return updated;
    });
  }, []);

  const filteredData = useMemo(() => {
    const hasFilter = searchFilters.some((f) => f && f.trim() !== "");
    if (!hasFilter) return reportData;

    return reportData.filter((row) => {
      const rawValues = [
        String(row.no),
        (row.no_transaksi || "").toLowerCase(),
        (row.bulan_pencairan || "").toLowerCase(),
        (row.nama || "").toLowerCase(),
        String(row.termin ?? ""),
        String(row.value_per_bulan ?? ""),
        String(row.target ?? ""),
        String(row.term_now ?? ""),
        String(row.term_1 ?? ""),
        String(row.term_2 ?? ""),
        String(row.term_sisa ?? ""),
        String(row.aktual_now ?? ""),
        String(row.aktual_1 ?? ""),
        String(row.aktual_2 ?? ""),
        String(row.kekurangan ?? ""),
        String(row.piutang ?? ""),
      ];

      const formattedValues = [
        String(row.no),
        (row.no_transaksi || "").toLowerCase(),
        (row.bulan_pencairan || "").toLowerCase(),
        (row.nama || "").toLowerCase(),
        `${row.termin || 0} Bln`,
        formatCurrency(row.value_per_bulan),
        formatCurrency(row.target),
        String(row.term_now ?? ""),
        String(row.term_1 ?? ""),
        String(row.term_2 ?? ""),
        String(row.term_sisa ?? ""),
        formatCurrency(row.aktual_now),
        formatCurrency(row.aktual_1),
        formatCurrency(row.aktual_2),
        formatCurrency(row.kekurangan),
        formatCurrency(row.piutang),
      ];

      return searchFilters.every((query, idx) => {
        if (!query || !query.trim()) return true;
        const q = query.toLowerCase();
        const rawMatch = rawValues[idx] && rawValues[idx].includes(q);
        const fmtMatch = formattedValues[idx] && formattedValues[idx].includes(q);
        return rawMatch || fmtMatch;
      });
    });
  }, [reportData, searchFilters]);

  const handleExportExcel = () => {
    const dataToExport = filteredData.map((item) => ({
      No: item.no,
      "No Transaksi": item.no_transaksi,
      "Bulan Pencairan": item.bulan_pencairan,
      Nama: item.nama,
      Termin: `${item.termin || 0} Bln`,
      "Value Per Bulan": item.value_per_bulan,
      Target: item.target,
      "Aktual Now (Saldo)": item.aktual_now,
      Kekurangan: item.kekurangan,
    }));

    exportToExcel(
      dataToExport,
      `Laporan_Tabungan_${new Date().toISOString().split("T")[0]}`
    );
  };

  return (
    <div
      className="simpanan-dashboard py-4 px-3 px-md-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <TabunganReportHeader
        onExportExcel={handleExportExcel}
        exportDisabled={loading || reportData.length === 0}
      />

      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
              <div className="global-tabs-wrapper px-4 pt-3 mb-0">
                <Nav
                  variant="pills"
                  className="global-tabs tabs-sm border-0 mb-3"
                >
                  <Nav.Item>
                    <Nav.Link eventKey="list" className="fw-medium">
                      List Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="jurnal" className="fw-medium">
                      Jurnal Report
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <Tab.Content>
                <Tab.Pane eventKey="list">
                  <TabunganListReportTab
                    filteredData={filteredData}
                    reportData={reportData}
                    summaryData={summaryData}
                    loading={loading}
                    searchFilters={searchFilters}
                    handleSearchChange={handleSearchChange}
                    formatRupiah={formatCurrency}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="jurnal">
                  <TabunganJurnalTab
                    summaryData={summaryData}
                    loading={loading}
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

export default TabunganReportPage;
