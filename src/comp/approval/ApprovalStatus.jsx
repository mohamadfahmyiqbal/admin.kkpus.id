import { Row, Col, Stack, Ratio } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { IconContext } from "react-icons";
import moment from "moment";

export default function ApprovalStatus({ approvalList = [] }) {
  if (!Array.isArray(approvalList) || approvalList.length === 0) {
    return (
      <Row>
        <Col xs={12} className="text-center">
          <div className="text-muted">Data approval tidak tersedia.</div>
        </Col>
      </Row>
    );
  }

  const count = approvalList.length;
  const xs = Math.max(1, Math.floor(12 / count));

  const statusConfig = {
    pending: { color: "secondary", label: "Pending", icon: <FaClock /> },
    approved: { color: "success", label: "Approved", icon: <FaCheckCircle /> },
    rejected: { color: "danger", label: "Rejected", icon: <FaTimesCircle /> },
  };

  return (
    <Row className="g-3 text-center">
      {approvalList.map((appr, idx) => {
        const cfg = statusConfig[appr.status] || {
          color: "secondary",
          label: appr.status,
          icon: appr.status,
        };

        return (
          <Col xs={xs} key={idx}>
            <Stack gap={2} className="align-items-center">
              {/* Circle Icon */}
              <Ratio aspectRatio="1x1" style={{ width: 70 }}>
                <div
                  className={`rounded-circle bg-${cfg.color} text-white d-flex justify-content-center align-items-center shadow-sm`}
                >
                  <IconContext.Provider value={{ size: "1.6em" }}>
                    {cfg.icon}
                  </IconContext.Provider>
                </div>
              </Ratio>

              {/* Status Label */}
              <div className={`fw-bold text-${cfg.color}`}>{cfg.label}</div>

              {/* Approver Name */}
              <div className="fw-semibold">{appr.approver}</div>
              <div className="fw-semibold">{appr.approverAnggota?.nama}</div>

              {/* Timestamp */}
              <div className="text-muted small">
                {moment(appr.updated_at).format("DD-MM-YYYY HH:mm")}
              </div>
            </Stack>
          </Col>
        );
      })}
    </Row>
  );
}
