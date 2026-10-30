import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FileXls } from "phosphor-react";
import SukukCatalogTab from "./components/SukukCatalogTab";
import SukukManagementTab from "./components/SukukManagementTab";
import ImportInvestasiModal from "./components/ImportInvestasiModal";
import { exportToExcel } from "../../../utils/helpers/exportToExcel";
import api from "../../../utils/api/common";
import Swal from "sweetalert2";

const InvestasiHalalListPage = () => {
  const [activeTab, setActiveTab] = useState("katalog");
  const [showImport, setShowImport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      if (activeTab === "katalog") {
        const res = await api.get("/financing/sukuk/catalog");
        const catalogData = res?.data?.data || [];
        if (!catalogData.length) {
          Swal.fire("Info", "Tidak ada data katalog investasi untuk diexport", "info");
          return;
        }
        const exportRows = catalogData.map((item, idx) => ({
          No: idx + 1,
          Jenis: item.type || "-",
          "Nama Sukuk": item.issue_name || item.name || "-",
          Penerbit: item.issuer || "-",
          "Min Investasi": item.min_investment || 0,
          "Total Target Pendanaan": item.total_amount || 0,
          "Tenor (Bulan)": item.tenor || "-",
          "Proyeksi Kupon / Imbal Hasil": item.coupon || "-",
          "Harga Per Unit": item.price || 0,
          Status: item.status || "-",
        }));
        exportToExcel(exportRows, `Katalog_Investasi_Halal_${new Date().toISOString().split("T")[0]}`);
      } else {
        const res = await api.get("/financing/sukuk/issue/all");
        const issueData = res?.data?.data || [];
        if (!issueData.length) {
          Swal.fire("Info", "Tidak ada data manajemen investasi untuk diexport", "info");
          return;
        }
        const exportRows = issueData.map((item, idx) => ({
          No: idx + 1,
          "Nama Produk": item.name || item.issue_name || "-",
          "Target Pendanaan": item.total_amount || item.target_amount || 0,
          "Tenor (Bulan)": item.tenor || "-",
          "Imbal Hasil": item.coupon || item.profit_sharing || "-",
          "Minimal Investasi": item.min_investment || 0,
          "Total Terkumpul": item.collected_amount || 0,
          "Jumlah Investor": item.total_investors || 0,
          Status: item.status || "-",
        }));
        exportToExcel(exportRows, `Manajemen_Investasi_Halal_${new Date().toISOString().split("T")[0]}`);
      }
    } catch (err) {
      console.error("Export error:", err);
      Swal.fire("Error", "Gagal melakukan export data investasi", "error");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0 text-dark">Investasi Halal</h4>
        <div className="d-flex gap-2">
          <Button
            variant="outline-success"
            className="d-flex align-items-center gap-2"
            onClick={handleExport}
            disabled={isExporting}
          >
            <FileXls size={18} className="text-success" />
            {isExporting ? "Exporting..." : `Export Excel (${activeTab === "katalog" ? "Katalog" : "Manajemen"})`}
          </Button>
          <Button
            variant="success"
            className="d-flex align-items-center gap-2"
            onClick={() => setShowImport(true)}
          >
            <i className="bi bi-upload" /> Import Excel
          </Button>
        </div>
      </div>

      <div className="bg-white p-2 rounded-pill shadow-sm mb-4 d-inline-flex border">
        <div className="d-flex gap-1 flex-nowrap">
          <div
            onClick={() => setActiveTab("katalog")}
            className={`rounded-pill px-4 py-2 fw-medium transition-all ${
              activeTab === "katalog"
                ? "bg-primary text-white shadow-sm"
                : "text-muted bg-transparent"
            }`}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
          >
            Katalog Produk
          </div>
          <div
            onClick={() => setActiveTab("manajemen")}
            className={`rounded-pill px-4 py-2 fw-medium transition-all ${
              activeTab === "manajemen"
                ? "bg-primary text-white shadow-sm"
                : "text-muted bg-transparent"
            }`}
            style={{ cursor: "pointer", transition: "all 0.3s ease" }}
          >
            Manajemen
          </div>
        </div>
      </div>

      <div>
        {activeTab === "katalog" && <SukukCatalogTab />}
        {activeTab === "manajemen" && <SukukManagementTab />}
      </div>

      <ImportInvestasiModal
        show={showImport}
        onHide={() => setShowImport(false)}
        onSuccess={() => window.location.reload()}
      />
    </div>
  );
};

export default InvestasiHalalListPage;
