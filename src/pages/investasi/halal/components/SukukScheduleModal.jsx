import React from "react";
import { Modal, Button, Table, Badge } from "react-bootstrap";
import { CalendarBlank, Coins, X } from "phosphor-react";

const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const SukukScheduleModal = ({ show, onHide, type, member, issueName }) => {
  if (!member) return null;

  const isPrincipal = type === "pengembalian";
  const title = isPrincipal
    ? "Jadwal Pengembalian Pokok"
    : "Jadwal Imbal Hasil";
  const icon = isPrincipal ? (
    <Coins size={24} />
  ) : (
    <CalendarBlank size={24} />
  );

  const schedules = (() => {
    const list = [];
    const now = new Date();
    if (isPrincipal) {
      const dueDate = new Date(now.setMonth(now.getMonth() + 12));
      list.push({
        id: 1,
        date: dueDate.toISOString().split("T")[0],
        amount: member.amount,
        status: member.status === "PAID" ? "Selesai" : "Menunggu",
        notes: "Pengembalian Pokok Sukuk (Jatuh Tempo)",
      });
    } else {
      const monthlyShare = member.imbal_hasil / 12;
      for (let i = 1; i <= 12; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() + i);
        list.push({
          id: i,
          date: d.toISOString().split("T")[0],
          amount: monthlyShare,
          status: "Menunggu",
          notes: `Distribusi Bagi Hasil Bulan ke-${i}`,
        });
      }
    }
    return list;
  })();

  const totalAmount = schedules.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      contentClassName="border-0 rounded-4 shadow-xl overflow-hidden"
    >
      <div
        className={`bg-gradient bg-${
          isPrincipal ? "success" : "info"
        } bg-opacity-10 px-4 pt-4 pb-3 border-bottom`}
        style={{ borderColor: "rgba(0,0,0,0.05)" }}
      >
        <div className="d-flex justify-content-between align-items-start">
          <div className="d-flex align-items-center gap-3">
            <div
              className={`bg-white text-${
                isPrincipal ? "success" : "info"
              } p-3 rounded-circle shadow-sm d-flex`}
            >
              {icon}
            </div>
            <div>
              <h5 className="fw-bold mb-1 text-dark">{title}</h5>
              <div className="text-muted small fw-medium">
                {member.member_name} <span className="mx-2">•</span>{" "}
                <span className="text-secondary">{issueName}</span>
              </div>
            </div>
          </div>
          <Button
            variant="light"
            size="sm"
            className="rounded-circle d-flex align-items-center justify-content-center bg-white shadow-sm"
            style={{ width: "32px", height: "32px", border: "none" }}
            onClick={onHide}
          >
            <X size={18} className="text-muted" />
          </Button>
        </div>
      </div>

      <Modal.Body className="p-0">
        <div className="table-responsive" style={{ maxHeight: "60vh" }}>
          <Table hover className="align-middle border-0 mb-0">
            <thead
              className="bg-light sticky-top text-secondary text-uppercase"
              style={{ letterSpacing: "0.5px", zIndex: 1 }}
            >
              <tr>
                <th className="py-3 px-4 border-0">No</th>
                <th className="py-3 border-0">Tanggal</th>
                <th className="py-3 border-0">Keterangan</th>
                <th className="py-3 text-end border-0">Nominal</th>
                <th className="py-3 text-center border-0 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {schedules.map((s, idx) => (
                <tr
                  key={s.id}
                  className="border-bottom"
                  style={{ transition: "background-color 0.2s" }}
                >
                  <td className="px-4 text-muted small">{idx + 1}</td>
                  <td className="fw-medium text-dark">
                    {new Date(s.date).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td className="text-muted small">{s.notes}</td>
                  <td className="text-end fw-bold text-dark">
                    {formatCurrency(s.amount)}
                  </td>
                  <td className="text-center px-4">
                    <Badge
                      bg={s.status === "Selesai" ? "success" : "light"}
                      text={s.status === "Selesai" ? "white" : "dark"}
                      className={`rounded-pill px-3 py-2 fw-medium ${
                        s.status !== "Selesai" && "border"
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-light sticky-bottom">
              <tr>
                <td
                  colSpan="3"
                  className="text-end fw-bold px-4 py-3 text-uppercase"
                  style={{ letterSpacing: "0.5px" }}
                >
                  Total Estimasi:
                </td>
                <td
                  className={`text-end fw-bolder text-${
                    isPrincipal ? "success" : "info"
                  } fs-5 py-3`}
                >
                  {formatCurrency(totalAmount)}
                </td>
                <td />
              </tr>
            </tfoot>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SukukScheduleModal;
