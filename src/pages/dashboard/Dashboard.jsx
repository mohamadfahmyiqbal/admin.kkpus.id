// PATH: src/pages/dashboard/Dashboard.jsx
import React, { useState, useRef, useCallback } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtEncode } from "../../utils/helpers";

import DashboardHeader from "./components/DashboardHeader";
import DashboardStats from "./components/DashboardStats";
import DashboardApprovalQueue from "./components/DashboardApprovalQueue";
import DashboardNotificationsCard from "./components/DashboardNotificationsCard";
import DashboardApprovalModals from "./components/DashboardApprovalModals";

import { useDashboardData } from "./hooks/useDashboardData.jsx";
import { useDashboardModals } from "./hooks/useDashboardModals.jsx";

// Whitelist halaman yang valid untuk navigasi dashboard
const VALID_DASHBOARD_PAGES = new Set([
  "dashboard",
  "reportsPage",
  "membersPage",
  "simpananDashboard",
  "jualBeliDashboard",
  "pinjamanList",
  "tabunganList",
  "investasiHalalList",
  "settings",
]);

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("registration");
  const notifBtnRef = useRef(null);

  const {
    loading,
    statsList,
    categorizedData,
    totalPending,
    notifications,
    fetchData,
  } = useDashboardData();

  const modalState = useDashboardModals(fetchData);

  const handleQuickNav = useCallback((pageName) => {
    if (!VALID_DASHBOARD_PAGES.has(pageName)) {
      console.warn(`[Dashboard] Akses ditolak: halaman tidak valid "${pageName}"`);
      return;
    }

    const payload = {
      page: pageName,
      ts: Date.now(),
      nonce: crypto.randomUUID(),
    };

    const encoded = jwtEncode(payload);
    navigate(`/${encoded}`);
  }, [navigate]);

  const handleOpenNotifications = useCallback(() => {
    if (notifBtnRef.current) {
      notifBtnRef.current.click();
    } else {
      console.warn("[Dashboard] Tombol notifikasi tidak ditemukan, fallback ke reportsPage");
      handleQuickNav("reportsPage");
    }
  }, [handleQuickNav]);

  return (
    <div className="pb-5">
      <DashboardHeader onOpenLogs={() => handleQuickNav("reportsPage")} />

      <DashboardStats stats={statsList} />

      <Row>
        <Col xl={8} lg={12} className="mb-4">
          <DashboardApprovalQueue
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            categorizedData={categorizedData}
            totalPending={totalPending}
            loading={loading}
            handleReviewClick={modalState.handleReviewClick}
            handleWithdrawalReviewClick={modalState.handleWithdrawalReviewClick}
            handleJualBeliReviewClick={modalState.handleJualBeliReviewClick}
            handleProgramReviewClick={modalState.handleProgramReviewClick}
            handleTabunganReviewClick={modalState.handleTabunganReviewClick}
            handleInvestasiReviewClick={modalState.handleInvestasiReviewClick}
            onSeeAll={handleQuickNav}
          />
        </Col>

        <Col xl={4} lg={12} className="mb-4">
          <DashboardNotificationsCard
            notifications={notifications}
            onOpenNotifications={handleOpenNotifications}
            notifBtnRef={notifBtnRef}
          />
        </Col>
      </Row>

      <DashboardApprovalModals modalState={modalState} fetchData={fetchData} />
    </div>
  );
};

export default Dashboard;
