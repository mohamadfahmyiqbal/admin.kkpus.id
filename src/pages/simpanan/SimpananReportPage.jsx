import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Card, Tab, Nav, Breadcrumb } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import savingsService from "../../utils/api/USavings";
import { exportToExcel } from "../../utils/helpers/exportToExcel";
import { jwtEncode } from "../../utils/helpers";
import { formatRupiah } from "./components/reportConstants";
import SimpananListReportTable from "./components/SimpananListReportTable";
import SimpananJurnalReportTable from "./components/SimpananJurnalReportTable";

const SimpananReportPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("list");
  const [reportList, setReportList] = useState([]);
  const [summary, setSummary] = useState({
    total_pokok: 0,
    total_wajib: 0,
    total_sukarela: 0,
    total_all: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchFilters, setSearchFilters] = useState(Array(12).fill(""));

  const currentYear = new Date().getFullYear();

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await savingsService.getAdminSavingsReport();
      if (res.data?.status) {
        setReportList(res.data.data.list || []);
        setSummary(
          res.data.data.summary || {
            total_pokok: 0,
            total_wajib: 0,
            total_sukarela: 0,
            total_all: 0,
          }
        );
      }
    } catch (err) {
      console.error("Failed to fetch report data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = useCallback((idx, val) => {
    setSearchFilters((prev) => {
      const copy = [...prev];
      copy[idx] = val;
      return copy;
    });
  }, []);

  const filteredList = useMemo(() => {
    if (!searchFilters.some((f) => f.trim() !== "")) return reportList;
    return reportList.filter((item, idx) => {
      const numStr = String(idx + 1);
      const rawValues = [
        numStr,
        (item.nama || "").toLowerCase(),
        String(item.tahun_ini?.total ?? ""),
        String(item.tahun_ini?.pokok ?? ""),
        String(item.tahun_ini?.wajib ?? ""),
        String(item.tahun_ini?.sukarela ?? ""),
        String(item.tahun_lalu?.total ?? ""),
        String(item.tahun_lalu?.pokok ?? ""),
        String(item.tahun_lalu?.wajib ?? ""),
        String(item.tahun_lalu?.sukarela ?? ""),
        String(item.tahun_lalu2?.total ?? ""),
        String(item.tahun_lalu2?.pokok ?? ""),
      ];
      const formattedValues = [
        numStr,
        (item.nama || "").toLowerCase(),
        formatRupiah(item.tahun_ini?.total),
        formatRupiah(item.tahun_ini?.pokok),
        formatRupiah(item.tahun_ini?.wajib),
        formatRupiah(item.tahun_ini?.sukarela),
        formatRupiah(item.tahun_lalu?.total),
        formatRupiah(item.tahun_lalu?.pokok),
        formatRupiah(item.tahun_lalu?.wajib),
        formatRupiah(item.tahun_lalu?.sukarela),
        formatRupiah(item.tahun_lalu2?.total),
        formatRupiah(item.tahun_lalu2?.pokok),
      ];
      return searchFilters.every((f, colIdx) => {
        if (!f.trim()) return true;
        const q = f.toLowerCase();
        const rawMatch = rawValues[colIdx].toLowerCase().includes(q);
        const fmtMatch = formattedValues[colIdx].toLowerCase().includes(q);
        return rawMatch || fmtMatch;
      });
    });
  }, [reportList, searchFilters]);

  const handleExport = () => {
    const exportData = filteredList.map((item, idx) => ({
      No: idx + 1,
      Nama: item.nama,
      "Total Saldo (Tahun Ini)": item.tahun_ini?.total || 0,
      "Pokok (Tahun Ini)": item.tahun_ini?.pokok || 0,
      "Wajib (Tahun Ini)": item.tahun_ini?.wajib || 0,
      "Sukarela (Tahun Ini)": item.tahun_ini?.sukarela || 0,
      "Total Saldo (Tahun Lalu)": item.tahun_lalu?.total || 0,
      "Pokok (Tahun Lalu)": item.tahun_lalu?.pokok || 0,
      "Wajib (Tahun Lalu)": item.tahun_lalu?.wajib || 0,
      "Sukarela (Tahun Lalu)": item.tahun_lalu?.sukarela || 0,
      "Total Saldo (2 Tahun Lalu)": item.tahun_lalu2?.total || 0,
      "Pokok (2 Tahun Lalu)": item.tahun_lalu2?.pokok || 0,
    }));
    exportToExcel(
      exportData,
      `Laporan_Simpanan_${new Date().toISOString().split("T")[0]}`
    );
  };

  return (
    <div className="simpanan-dashboard px-md-4">
      <div className="mb-2 animate-fade-in">
        <Breadcrumb className="mb-0" style={{ fontSize: "12px" }}>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "dashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Dashboard
          </Breadcrumb.Item>
          <Breadcrumb.Item
            onClick={() => navigate(`/${jwtEncode({ page: "simpananDashboard" })}`)}
            style={{ cursor: "pointer" }}
          >
            Simpanan
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Report</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3 animate-fade-in">
        <div>
          <h4 className="fw-bold text-dark mb-1">Report Simpanan</h4>
          <p className="text-muted small mb-0">
            Laporan list dan jurnal transaksi simpanan anggota.
          </p>
        </div>
        <div>
          <button
            className="btn btn-success d-flex align-items-center gap-2"
            onClick={handleExport}
            disabled={loading || reportList.length === 0}
          >
            <i className="bi bi-file-earmark-excel me-1" /> Export Excel
          </button>
        </div>
      </div>

      <div className="animate-fade-in">
        <Card className="border-0 shadow-sm rounded-4 overflow-hidden">
          <Card.Body className="p-0">
            <div className="global-tabs-wrapper pt-3 mb-0">
              <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
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
                    <div className="p-2 p-md-3">
                      <SimpananListReportTable
                        loading={loading}
                        filteredList={filteredList}
                        reportList={reportList}
                        summary={summary}
                        searchFilters={searchFilters}
                        onFilterChange={handleFilterChange}
                        currentYear={currentYear}
                      />
                    </div>
                  </Tab.Pane>

                  <Tab.Pane eventKey="jurnal">
                    <div className="p-2 p-md-3">
                      <SimpananJurnalReportTable
                        loading={loading}
                        summary={summary}
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

export default SimpananReportPage;
