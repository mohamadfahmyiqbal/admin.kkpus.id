import React from "react";
import { Card, Button, ListGroup } from "react-bootstrap";
import { Clock } from "phosphor-react";

const DashboardNotificationsCard = ({
  notifications = [],
  onOpenNotifications,
}) => {
  return (
    <Card className="border-0 shadow-sm h-100">
      <Card.Header className="bg-white py-2 border-0">
        <h6 className="mb-0 fw-bold small">Notifikasi Sistem</h6>
      </Card.Header>
      <Card.Body className="p-0 d-flex flex-column h-100">
        <ListGroup
          variant="flush"
          className="flex-grow-1 overflow-auto"
          style={{ maxHeight: "350px" }}
        >
          {notifications.map((n) => (
            <ListGroup.Item
              key={n.id}
              className="border-0 border-bottom px-3 py-2 bg-transparent"
            >
              <div className="d-flex align-items-start gap-2">
                <div
                  className={`p-1 rounded-circle bg-${n.type || "primary"} bg-opacity-10 text-${n.type || "primary"} flex-shrink-0`}
                >
                  <Clock size={14} />
                </div>
                <div className="flex-grow-1 overflow-hidden">
                  <div className="d-flex justify-content-between align-items-center mb-0">
                    <h6 className="mb-0 fw-bold extra-small text-truncate">
                      {n.title}
                    </h6>
                    <small className="text-muted extra-small ms-2 flex-shrink-0">
                      {n.time}
                    </small>
                  </div>
                  <p className="mb-0 text-muted extra-small lh-sm text-truncate">
                    {n.body}
                  </p>
                </div>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
        <div className="p-2 text-center border-top">
          <Button
            variant="link"
            size="sm"
            className="w-100 fw-bold extra-small text-decoration-none p-0"
            onClick={onOpenNotifications}
          >
            Buka Semua Notifikasi
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DashboardNotificationsCard;
