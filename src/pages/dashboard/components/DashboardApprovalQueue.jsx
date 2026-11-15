import React from "react";
import { Card, Badge, Tab, Nav } from "react-bootstrap";
import ApprovalTable from "./ApprovalTable";

const DashboardApprovalQueue = ({
  activeTab,
  setActiveTab,
  categorizedData,
  totalPending,
  loading,
  handleReviewClick,
  handleWithdrawalReviewClick,
  handleJualBeliReviewClick,
  handleProgramReviewClick,
  handleTabunganReviewClick,
  handleInvestasiReviewClick,
  onSeeAll,
}) => {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white py-3 border-0 d-flex justify-content-between align-items-center">
        <h5 className="mb-0 fw-bold">Antrian Persetujuan</h5>
        <Badge bg="danger" pill className="px-3 py-2">
          {totalPending} Menunggu
        </Badge>
      </Card.Header>
      <Card.Body className="pt-0">
        <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
          <div className="global-tabs-wrapper mb-3">
            <Nav variant="pills" className="global-tabs tabs-sm flex-nowrap">
              <Nav.Item>
                <Nav.Link eventKey="registration">
                  Keanggotaan ({categorizedData.registration.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="simpanan">
                  Simpanan ({categorizedData.simpanan.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="jualBeli">
                  Jual Beli ({categorizedData.jualBeli.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="program">
                  Program ({categorizedData.program.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="tabungan">
                  Tabungan ({categorizedData.tabungan.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="investasi">
                  Investasi ({categorizedData.investasi.length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content>
            <Tab.Pane eventKey="registration">
              <ApprovalTable
                data={categorizedData.registration}
                titleField="full_name"
                nameField="status_name"
                loading={loading}
                emptyMessage="Tidak ada antrian keanggotaan"
                onAction={handleReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="membersPage"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="simpanan">
              <ApprovalTable
                data={categorizedData.simpanan}
                loading={loading}
                emptyMessage="Tidak ada antrian simpanan"
                onAction={handleWithdrawalReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="simpananDashboard"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="jualBeli">
              <ApprovalTable
                data={categorizedData.jualBeli}
                titleField="name"
                nameField="item"
                loading={loading}
                emptyMessage="Tidak ada antrian jual beli"
                onAction={handleJualBeliReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="jualBeliDashboard"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="program">
              <ApprovalTable
                data={categorizedData.program}
                titleField="name"
                nameField="item"
                loading={loading}
                emptyMessage="Tidak ada antrian program"
                onAction={handleProgramReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="pinjamanList"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="tabungan">
              <ApprovalTable
                data={categorizedData.tabungan}
                titleField="name"
                nameField="item"
                loading={loading}
                emptyMessage="Tidak ada antrian tabungan"
                onAction={handleTabunganReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="tabunganList"
              />
            </Tab.Pane>
            <Tab.Pane eventKey="investasi">
              <ApprovalTable
                data={categorizedData.investasi}
                titleField="name"
                nameField="item"
                loading={loading}
                emptyMessage="Tidak ada antrian investasi"
                onAction={handleInvestasiReviewClick}
                onSeeAll={onSeeAll}
                seeAllPage="investasiHalalList"
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default DashboardApprovalQueue;
