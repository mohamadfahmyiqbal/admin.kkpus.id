import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Nav, Tab } from "react-bootstrap";
import api from "../../../utils/api/common";
import exportToExcel from "../../../utils/helpers/exportToExcel";
import InvestasiReportHeader from "./report/InvestasiReportHeader";
import InvestasiListReportTab from "./report/InvestasiListReportTab";
import InvestasiJurnalReportTab from "./report/InvestasiJurnalReportTab";

const InvestasiReportPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [reportData, setReportData] = useState([]);
  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState(Array(10).fill(""));

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/financing/sukuk/report");
      if (res.data?.success) {
        setReportData(res.data.data.listData || []);
        setSummaryData(res.data.data.jurnal || {});
      }
    } catch (err) {
      console.error("Failed to fetch investasi report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportData();
  }, []);

  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val || 0);

  const handleSearchChange = useCallback((index, value) => {
    setSearchFilters((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!searchFilters.some((f) => f && f.trim() !== "")) return reportData;

    return reportData.filter((item) => {
      const rawValues = [
        String(item.no),
        (item.member_name || "").toLowerCase(),
        (item.member_no || "").toLowerCase(),
        (item.issue_name || "").toLowerCase(),
        String(item.lembar ?? ""),
        String(item.amount ?? ""),
        String(item.imbal_hasil ?? ""),
        String(item.pengembalian ?? ""),
        (item.status || "").toLowerCase(),
      ];

      const formattedValues = [
        String(item.no),
        (item.member_name || "").toLowerCase(),
        (item.member_no || "").toLowerCase(),
        (item.issue_name || "").toLowerCase(),
        `${item.lembar} lb`,
        formatRupiah(item.amount),
        formatRupiah(item.imbal_hasil),
        formatRupiah(item.pengembalian),
        (item.status || "").toLowerCase(),
      ];

      return searchFilters.every((filterVal, idx) => {
        if (!filterVal || !filterVal.trim()) return true;
        if (idx === 8 && filterVal !== "") {
          return rawValues[idx].includes(filterVal.toLowerCase());
        }
        const searchLower = filterVal.toLowerCase();
        const matchesRaw = rawValues[idx] && rawValues[idx].includes(searchLower);
        const matchesFormatted =
          formattedValues[idx] && formattedValues[idx].includes(searchLower);
        return matchesRaw || matchesFormatted;
      });
    });
  }, [reportData, searchFilters]);

  const handleExportExcel = () => {
    const exportRows = filteredData.map((item, idx) => ({
      No: idx + 1,
      Nama: item.member_name,
      "No Anggota": item.member_no,
      "Investasi (Sukuk)": item.issue_name,
      Lembar: item.lembar,
      "Total Investasi": item.amount,
      "Imbal Hasil": item.imbal_hasil,
      "Pengembalian Pokok": item.pengembalian,
      Status: item.status,
    }));
    exportToExcel(
      exportRows,
      `Laporan_Investasi_${new Date().toISOString().split("T")[0]}`
    );
  };

  return (
    <div
      className="simpanan-dashboard py-4 px-3 px-md-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <InvestasiReportHeader
        onExportExcel={handleExportExcel}
        exportDisabled={loading || reportData.length === 0}
      />

      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <Tab.Container
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
            >
              <div className="global-tabs-wrapper px-4 pt-3 mb-0 border-bottom">
                <Nav variant="pills" className="global-tabs tabs-sm border-0 gap-2">
                  <Nav.Item>
                    <Nav.Link
                      eventKey="list"
                      className="rounded-pill px-4 py-2 fw-medium"
                    >
                      List Report
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      eventKey="jurnal"
                      className="rounded-pill px-4 py-2 fw-medium"
                    >
                      Jurnal Report
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </div>

              <Tab.Content className="p-4">
                <Tab.Pane eventKey="list">
                  <InvestasiListReportTab
                    filteredData={filteredData}
                    reportData={reportData}
                    loading={loading}
                    searchFilters={searchFilters}
                    handleSearchChange={handleSearchChange}
                    formatRupiah={formatRupiah}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey="jurnal">
                  <InvestasiJurnalReportTab
                    summaryData={summaryData}
                    loading={loading}
                    formatRupiah={formatRupiah}
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

export default InvestasiReportPage;
