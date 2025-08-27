import { Container, Row, Col } from "react-bootstrap";
import { FaHourglassHalf, FaCheck, FaTimes, FaQuestion } from "react-icons/fa";
import { useMemo } from "react";

export default function ApprovalStepper({
  currentStep = 0,
  steps = [],
  user = {},
}) {
  const STEP_STATUS_STYLE = {
    completed: {
      circleBg: "#0d6efd",
      circleColor: "#fff",
      labelColor: "#0d6efd",
    },
    active: {
      circleBg: "#ffc107",
      circleColor: "#212529",
      labelColor: "#ffc107",
    },
    waiting: {
      circleBg: "#dee2e6",
      circleColor: "#6c757d",
      labelColor: "#6c757d",
    },
    pending: {
      circleBg: "#dee2e6",
      circleColor: "#6c757d",
      labelColor: "#6c757d",
    },
    rejected: {
      circleBg: "#dc3545",
      circleColor: "#fff",
      labelColor: "#dc3545",
    },
  };

  const getStatus = (index) => {
    if (currentStep === "rejected") return "rejected";
    if (currentStep === 0 && index === 0) return "waiting";
    if (index < currentStep) return "completed";
    if (index === currentStep) return "active";
    return "pending";
  };

  const baseCircleStyle = {
    width: 40,
    height: 40,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: 18,
    zIndex: 2,
  };

  const baseLabelStyle = {
    marginTop: 8,
    fontSize: 12,
    maxWidth: 80,
    wordWrap: "break-word",
    textAlign: "center",
  };

  const getCircleStyle = (status) => ({
    ...baseCircleStyle,
    backgroundColor: STEP_STATUS_STYLE[status]?.circleBg || "#dee2e6",
    color: STEP_STATUS_STYLE[status]?.circleColor || "#000",
  });

  const getLabelStyle = (status) => ({
    ...baseLabelStyle,
    color: STEP_STATUS_STYLE[status]?.labelColor || "#000",
  });

  const renderStepContent = (status, index) => {
    if (status === "completed") return <FaCheck />;
    if (status === "waiting" || status === "pending") return <FaQuestion />;
    if (status === "active") return <FaHourglassHalf />;
    if (status === "rejected") return <FaTimes />;
    return index + 1;
  };

  const stepItems = useMemo(() => {
    if (!Array.isArray(steps) || steps.length === 0) return [];
    return steps.map((label, index) => {
      const status = getStatus(index);
      return (
        <div
          key={index}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            flex: 1,
            position: "relative",
          }}
        >
          <div style={getCircleStyle(status)}>
            {renderStepContent(status, index)}
          </div>
          <div style={getLabelStyle(status)}>{label}</div>
        </div>
      );
    });
  }, [steps, currentStep]);

  if (!Array.isArray(steps) || steps.length === 0) {
    return (
      <div className="mt-4 text-center text-muted">
        <h6 className="border-bottom fw-bold mb-3">Progress Approval</h6>
        <p>Belum ada data tahapan approval.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h6 className="border-bottom fw-bold mb-3">Progress Approval</h6>
      <Container className="d-flex justify-content-center mt-4">
        <Row className="w-100">
          <Col xs={12} md={10} lg={8} className="mx-auto">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                position: "relative",
                padding: "20px 0",
              }}
            >
              {/* Garis abu-abu latar */}
              <div
                style={{
                  position: "absolute",
                  top: 20,
                  left: 0,
                  right: 0,
                  height: 4,
                  backgroundColor: "#dee2e6",
                  zIndex: 0,
                }}
              />

              {/* Garis biru progress dinamis */}
              {currentStep !== "rejected" && (
                <div
                  style={{
                    position: "absolute",
                    top: 20,
                    left: 0,
                    width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    height: 4,
                    backgroundColor: "#0d6efd",
                    zIndex: 1,
                    transition: "width 0.3s ease",
                  }}
                />
              )}

              {/* Step Items */}
              {stepItems}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
