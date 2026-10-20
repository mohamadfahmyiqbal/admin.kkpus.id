import React from "react";
import { Table, Form, Spinner } from "react-bootstrap";
import { SmileyMeh } from "phosphor-react";
import SukukInvestorRow from "./SukukInvestorRow";
import { formatCurrency } from "./SukukInvestorStatusBadge";

const SukukInvestorsTable = ({
  members,
  filteredMembers,
  filters,
  onFilterChange,
  loading,
  onOpenSchedule,
  onTriggerUpload,
  uploadingId,
}) => {
  return (
    <div
      className="table-responsive mt-2 border rounded-4 shadow-sm"
      style={{ backgroundColor: "#fff", overflow: "hidden" }}
    >
      <Table hover responsive className="align-middle border-0 mb-0">
        <thead
          className="bg-light text-secondary text-uppercase"
          style={{ letterSpacing: "0.5px", borderBottom: "2px solid #f1f5f9" }}
        >
          <tr>
            <th
              className="py-3 px-4 border-0 text-center"
              style={{ width: "10%" }}
            >
              Aksi
            </th>
            <th className="py-3 border-0" style={{ width: "18%" }}>
              Nama Anggota
              <Form.Control
                size="sm"
                placeholder="Cari nama..."
                className="mt-2 text-lowercase rounded-3 shadow-none border-light focus-ring-primary"
                value={filters.member_name}
                onChange={(e) =>
                  onFilterChange("member_name", e.target.value)
                }
              />
            </th>
            <th
              className="py-3 text-center border-0"
              style={{ width: "10%" }}
            >
              Lembar
              <Form.Control
                size="sm"
                placeholder="Cari..."
                className="mt-2 text-lowercase text-center rounded-3 shadow-none border-light focus-ring-primary"
                value={filters.lembar}
                onChange={(e) =>
                  onFilterChange("lembar", e.target.value)
                }
              />
            </th>
            <th className="py-3 text-end border-0" style={{ width: "16%" }}>
              Nominal Investasi
              <Form.Control
                size="sm"
                placeholder="Cari nominal..."
                className="mt-2 text-lowercase text-end rounded-3 shadow-none border-light focus-ring-primary"
                value={filters.amount}
                onChange={(e) =>
                  onFilterChange("amount", e.target.value)
                }
              />
            </th>
            <th className="py-3 text-end border-0" style={{ width: "16%" }}>
              Pengembalian Pokok
              <Form.Control
                size="sm"
                placeholder="Cari..."
                className="mt-2 text-lowercase text-end rounded-3 shadow-none border-light focus-ring-primary"
                value={filters.pengembalian}
                onChange={(e) =>
                  onFilterChange("pengembalian", e.target.value)
                }
              />
            </th>
            <th className="py-3 text-end border-0" style={{ width: "16%" }}>
              Estimasi Imbal Hasil
              <Form.Control
                size="sm"
                placeholder="Cari..."
                className="mt-2 text-lowercase text-end rounded-3 shadow-none border-light focus-ring-primary"
                value={filters.imbal_hasil}
                onChange={(e) =>
                  onFilterChange("imbal_hasil", e.target.value)
                }
              />
            </th>
            <th
              className="py-3 text-center border-0 px-4"
              style={{ width: "14%" }}
            >
              Status
              <Form.Select
                size="sm"
                className="mt-2 rounded-3 shadow-none border-light focus-ring-primary text-center"
                value={filters.status}
                onChange={(e) =>
                  onFilterChange("status", e.target.value)
                }
              >
                <option value="">Semua</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Disetujui</option>
                <option value="PAID">Lunas</option>
                <option value="REJECTED">Ditolak</option>
              </Form.Select>
            </th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {loading ? (
            <tr>
              <td colSpan="7" className="text-center py-5">
                <Spinner
                  animation="border"
                  variant="primary"
                  size="sm"
                  className="me-2"
                />
                <span className="text-muted fw-medium">
                  Memuat data investor...
                </span>
              </td>
            </tr>
          ) : filteredMembers.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-5 text-muted">
                <div className="d-flex flex-column align-items-center">
                  <div className="bg-light rounded-circle p-4 mb-3 shadow-sm">
                    <SmileyMeh size={36} className="text-secondary" />
                  </div>
                  <h6 className="fw-bold text-dark fs-5">
                    {members.length === 0
                      ? "Belum Ada Investor"
                      : "Data Tidak Ditemukan"}
                  </h6>
                  <p className="mb-0 text-muted">
                    {members.length === 0
                      ? "Belum ada anggota yang berinvestasi pada produk sukuk ini."
                      : "Silakan ubah kata kunci filter pencarian Anda."}
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            <>
              {filteredMembers.map((item, idx) => (
                <SukukInvestorRow
                  key={item.id || idx}
                  item={item}
                  onOpenSchedule={onOpenSchedule}
                  onTriggerUpload={onTriggerUpload}
                  uploadingId={uploadingId}
                />
              ))}
              <tr className="bg-light bg-gradient border-top">
                <td
                  colSpan="3"
                  className="text-end fw-bold px-4 py-3 text-uppercase"
                  style={{ letterSpacing: "1px" }}
                >
                  Total (Terkumpul):
                </td>
                <td className="text-end fw-bolder text-dark fs-5 py-3">
                  {formatCurrency(
                    filteredMembers
                      .filter(
                        (m) =>
                          m.status === "APPROVED" || m.status === "PAID"
                      )
                      .reduce((acc, curr) => acc + (curr.amount || 0), 0)
                  )}
                </td>
                <td className="text-end fw-bolder text-success fs-5 py-3">
                  {formatCurrency(
                    filteredMembers
                      .filter(
                        (m) =>
                          m.status === "APPROVED" || m.status === "PAID"
                      )
                      .reduce((acc, curr) => acc + (curr.pengembalian || 0), 0)
                  )}
                </td>
                <td className="text-end fw-bolder text-info fs-5 py-3">
                  {formatCurrency(
                    filteredMembers
                      .filter(
                        (m) =>
                          m.status === "APPROVED" || m.status === "PAID"
                      )
                      .reduce((acc, curr) => acc + (curr.imbal_hasil || 0), 0)
                  )}
                </td>
                <td />
              </tr>
            </>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default SukukInvestorsTable;
