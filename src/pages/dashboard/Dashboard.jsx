// PATH: src/pages/dashboard/Dashboard.jsx
import React, { useState } from "react";
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

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("registration");

  const {
    loading,
    statsList,
    categorizedData,
    totalPending,
    notifications,
    fetchData,
  } = useDashboardData();

  const modalState = useDashboardModals(fetchData);

  const handleQuickNav = (pageName) => {
    navigate(`/${jwtEncode({ page: pageName })}`);
  };

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
            onOpenNotifications={() => handleQuickNav("notificationPage")}
          />
        </Col>
      </Row>

      <DashboardApprovalModals modalState={modalState} fetchData={fetchData} />
    </div>
  );
};

export default Dashboard;
