
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
            <Nav variant="pills" className="global-tabs tabs-sm flex-nowrap" role="tablist" aria-label="Kategori antrian persetujuan">
              {categorizedData.registration.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="registration" role="tab" aria-controls="pane-registration">
                    Keanggotaan ({categorizedData.registration.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {categorizedData.simpanan.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="simpanan" role="tab" aria-controls="pane-simpanan">
                    Simpanan ({categorizedData.simpanan.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {categorizedData.jualBeli.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="jualBeli" role="tab" aria-controls="pane-jualBeli">
                  Jual Beli ({categorizedData.jualBeli.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {categorizedData.program.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="program" role="tab" aria-controls="pane-program">
                    Program ({categorizedData.program.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {categorizedData.tabungan.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="tabungan" role="tab" aria-controls="pane-tabungan">
                    Tabungan ({categorizedData.tabungan.length})
                  </Nav.Link>
                </Nav.Item>
              )}
              {categorizedData.investasi.length > 0 && (
                <Nav.Item role="presentation">
                  <Nav.Link eventKey="investasi" role="tab" aria-controls="pane-investasi">
                    Investasi ({categorizedData.investasi.length})
                  </Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </div>
          <Tab.Content role="tabpanel">
            {categorizedData.registration.length > 0 && (
              <Tab.Pane eventKey="registration" id="pane-registration" role="tabpanel" aria-label="Antrian keanggotaan">
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
            )}
            {categorizedData.simpanan.length > 0 && (
              <Tab.Pane eventKey="simpanan" id="pane-simpanan" role="tabpanel" aria-label="Antrian simpanan">
                <ApprovalTable
                  data={categorizedData.simpanan}
                  loading={loading}
                  emptyMessage="Tidak ada antrian simpanan"
                  onAction={handleWithdrawalReviewClick}
                  onSeeAll={onSeeAll}
                  seeAllPage="simpananDashboard"
                />
              </Tab.Pane>
            )}
            {categorizedData.jualBeli.length > 0 && (
              <Tab.Pane eventKey="jualBeli" id="pane-jualBeli" role="tabpanel" aria-label="Antrian jual beli">
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
            )}
            {categorizedData.program.length > 0 && (
              <Tab.Pane eventKey="program" id="pane-program" role="tabpanel" aria-label="Antrian program">
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
            )}
            {categorizedData.tabungan.length > 0 && (
              <Tab.Pane eventKey="tabungan" id="pane-tabungan" role="tabpanel" aria-label="Antrian tabungan">
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
            )}
            {categorizedData.investasi.length > 0 && (
              <Tab.Pane eventKey="investasi" id="pane-investasi" role="tabpanel" aria-label="Antrian investasi">
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
            )}
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default DashboardApprovalQueue;
