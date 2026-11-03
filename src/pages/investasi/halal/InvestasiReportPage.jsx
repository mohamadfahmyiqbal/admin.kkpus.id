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
  const [searchFilters, setSearchFilters] = useState({
    member_name: "",
    member_no: "",
    issue_name: "",
    lembar: "",
    amount: "",
    imbal_hasil: "",
    pengembalian: "",
    status: "",
  });

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

  const handleSearchChange = useCallback((field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const filteredData = useMemo(() => {
    return reportData.filter((item) => {
      const matchName = !searchFilters.member_name ||
        (item.member_name || "").toLowerCase().includes(searchFilters.member_name.toLowerCase());
      const matchNo = !searchFilters.member_no ||
        (item.member_no || "").toLowerCase().includes(searchFilters.member_no.toLowerCase());
      const matchIssue = !searchFilters.issue_name ||
        (item.issue_name || "").toLowerCase().includes(searchFilters.issue_name.toLowerCase());
      const matchLembar = !searchFilters.lembar ||
        String(item.lembar ?? "").toLowerCase().includes(searchFilters.lembar.toLowerCase());
      const matchAmount = !searchFilters.amount ||
        String(item.amount ?? "").toLowerCase().includes(searchFilters.amount.toLowerCase()) ||
        formatRupiah(item.amount).toLowerCase().includes(searchFilters.amount.toLowerCase());
      const matchImbalHasil = !searchFilters.imbal_hasil ||
        String(item.imbal_hasil ?? "").toLowerCase().includes(searchFilters.imbal_hasil.toLowerCase()) ||
        formatRupiah(item.imbal_hasil).toLowerCase().includes(searchFilters.imbal_hasil.toLowerCase());
      const matchPengembalian = !searchFilters.pengembalian ||
        String(item.pengembalian ?? "").toLowerCase().includes(searchFilters.pengembalian.toLowerCase()) ||
        formatRupiah(item.pengembalian).toLowerCase().includes(searchFilters.pengembalian.toLowerCase());
      const matchStatus = !searchFilters.status ||
        (item.status || "").toLowerCase().includes(searchFilters.status.toLowerCase());

      return (
        matchName &&
        matchNo &&
        matchIssue &&
        matchLembar &&
        matchAmount &&
        matchImbalHasil &&
        matchPengembalian &&
        matchStatus
      );
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
