import React from "react";
import { Card, Tab, Nav, Badge } from "react-bootstrap";
import PendanaanTable from "./PendanaanTable";

const PendanaanTabs = ({
  transactions = [],
  pendingCount = 0,
  formatCurrency,
  onDetail,
  onSetoran,
  onApproval,
}) => {
  return (
    <Card className="border-0 shadow-sm rounded-4">
      <Card.Body className="p-0">
        <Tab.Container defaultActiveKey="transaksi">
          <div className="global-tabs-wrapper mb-3 px-4 pt-3 border-bottom">
            <Nav
              variant="underline"
              className="global-tabs border-0 flex-nowrap pb-2 gap-3"
            >
              <Nav.Item>
                <Nav.Link
                  eventKey="transaksi"
                  className="text-dark fw-medium px-1"
                >
                  Daftar Transaksi
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="approval"
                  className="text-dark fw-medium px-1"
                >
                  Approval Pengajuan{" "}
                  {pendingCount > 0 && (
                    <Badge bg="danger" className="ms-1 rounded-pill">
                      {pendingCount}
                    </Badge>
                  )}
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
          <Tab.Content className="p-2">
            <Tab.Pane eventKey="transaksi">
              <PendanaanTable
                items={transactions.filter((i) => i.status !== "PENDING")}
                isApproval={false}
                formatCurrency={formatCurrency}
                onDetail={onDetail}
                onSetoran={onSetoran}
                onApproval={onApproval}
              />
            </Tab.Pane>
            <Tab.Pane eventKey="approval">
              <PendanaanTable
                items={transactions.filter((i) => i.status === "PENDING")}
                isApproval={true}
                formatCurrency={formatCurrency}
                onDetail={onDetail}
                onSetoran={onSetoran}
                onApproval={onApproval}
              />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
      </Card.Body>
    </Card>
  );
};

export default PendanaanTabs;
