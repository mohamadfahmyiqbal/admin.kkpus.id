import { Col, Badge } from "react-bootstrap";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import moment from "moment";

export default function ApprovalStatus({ approvalList = [] }) {
  if (!Array.isArray(approvalList) || approvalList.length === 0) {
    return (
      <Col xs={12} className="text-center">
        <div className="text-muted">Data approval tidak tersedia.</div>
      </Col>
    );
  }

  const count = approvalList.length;
  const xs = Math.max(1, Math.floor(12 / count));

  return approvalList.map((appr, idx) => {
    const statusIcon =
      appr.status === "pending" ? (
        <>
          <FaClock /> Pending
        </>
      ) : appr.status === "approved" ? (
        <>
          <FaCheckCircle /> Approved
        </>
      ) : appr.status === "rejected" ? (
        <>
          <FaTimesCircle /> Rejected
        </>
      ) : (
        appr.status
      );

    return (
      <Col xs={xs} key={idx} className="text-center">
        <div className="fw-bold mb-0">{appr.approval?.nama}</div>
        <div className="mb-0">
          {moment(appr.approval?.updated_at).format("DD-MM-YYYY HH:mm")}
        </div>
        <Badge
          bg={
            appr.status === "approved"
              ? "success"
              : appr.status === "rejected"
              ? "danger"
              : "secondary"
          }
        >
          {statusIcon}
        </Badge>
      </Col>
    );
  });
}
