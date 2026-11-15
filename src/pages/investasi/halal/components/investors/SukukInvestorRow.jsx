import React from "react";
import { Button, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { Coins, CalendarBlank, UploadSimple, FileText } from "phosphor-react";
import { SukukInvestorStatusBadge, formatCurrency } from "./SukukInvestorStatusBadge";

const SukukInvestorRow = ({
  item,
  onOpenSchedule,
  onTriggerUpload,
  uploadingId,
}) => {
  const isUploading = uploadingId === (item.order_id || item.id);

  return (
    <tr
      className="border-bottom"
      style={{ transition: "background-color 0.2s ease-in-out" }}
    >
      <td className="text-center px-4">
        <div className="d-flex justify-content-center gap-2">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Jadwal Pengembalian Pokok</Tooltip>}
          >
            <Button
              variant="outline-success"
              size="sm"
              className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 border-0 hover-scale"
              onClick={() => onOpenSchedule(item, "pengembalian")}
              style={{
                width: "36px",
                height: "36px",
                transition: "all 0.2s",
              }}
            >
              <Coins size={18} />
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>Jadwal Imbal Hasil</Tooltip>}
          >
            <Button
              variant="outline-info"
              size="sm"
              className="rounded-circle d-flex align-items-center justify-content-center bg-info bg-opacity-10 border-0 hover-scale"
              onClick={() => onOpenSchedule(item, "imbal_hasil")}
              style={{
                width: "36px",
                height: "36px",
                transition: "all 0.2s",
              }}
            >
              <CalendarBlank size={18} />
            </Button>
          </OverlayTrigger>

          {item.status === "WITHDRAWAL_REQUESTED" && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Upload Bukti Transfer Pencairan</Tooltip>}
            >
              <Button
                variant="outline-primary"
                size="sm"
                className="rounded-circle d-flex align-items-center justify-content-center bg-primary bg-opacity-10 border-0 hover-scale"
                onClick={() => onTriggerUpload(item.order_id || item.id)}
                style={{
                  width: "36px",
                  height: "36px",
                  transition: "all 0.2s",
                }}
                disabled={isUploading}
              >
                {isUploading ? (
                  <Spinner size="sm" animation="border" />
                ) : (
                  <UploadSimple size={16} />
                )}
              </Button>
            </OverlayTrigger>
          )}

          {item.status === "WITHDRAWN" && item.transfer_proof && (
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Lihat Bukti Transfer</Tooltip>}
            >
              <Button
                variant="outline-success"
                size="sm"
                className="rounded-circle d-flex align-items-center justify-content-center bg-success bg-opacity-10 border-0 hover-scale"
                onClick={() =>
                  window.open(
                    `https://api.kkpus.id/api/${item.transfer_proof}`,
                    "_blank"
                  )
                }
                style={{
                  width: "36px",
                  height: "36px",
                  transition: "all 0.2s",
                }}
              >
                <FileText size={16} />
              </Button>
            </OverlayTrigger>
          )}
        </div>
      </td>
      <td className="text-dark">
        <div className="fw-bold">{item.member_name}</div>
        <div className="text-muted small fw-medium mt-1">
          ID: {item.member_no}
        </div>
      </td>
      <td className="text-center fw-medium text-dark">{item.lembar} lb</td>
      <td className="fw-bold text-end text-dark">
        {formatCurrency(item.amount)}
      </td>
      <td className="fw-bold text-end text-success">
        {formatCurrency(item.pengembalian)}
      </td>
      <td className="fw-bold text-end text-info">
        {formatCurrency(item.imbal_hasil)}
      </td>
      <td className="text-center px-4">
        <SukukInvestorStatusBadge status={item.status} />
      </td>
    </tr>
  );
};

export default SukukInvestorRow;
