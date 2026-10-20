import React, { useState } from "react";
import { Button } from "react-bootstrap";
import SukukCatalogTab from "./components/SukukCatalogTab";
import SukukManagementTab from "./components/SukukManagementTab";
import ImportInvestasiModal from "./components/ImportInvestasiModal";

const InvestasiHalalListPage = () => {
  const [activeTab, setActiveTab] = useState("katalog");
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="page-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0 text-dark">Investasi Halal</h4>
        <Button
          variant="success"
          className="d-flex align-items-center gap-2"
          onClick={() => setShowImport(true)}
        >
          <i className="bi bi-upload" /> Import Excel
        </Button>
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
