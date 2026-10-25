import React from "react";
import { Table, Spinner, Badge, Button, Pagination, Form } from "react-bootstrap";
import { Eye, CaretUp, CaretDown, ArrowsDownUp, Phone, EnvelopeSimple, IdentificationCard, X, UserGear } from "phosphor-react";

const MembersTable = ({
  loading = false,
  members = [],
  onSelectMember,
  formatDate,
  sortConfig = { key: "", direction: "asc" },
  onSort,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  filters = {},
  onFilterChange,
  onResetFilters,
  selectedMemberIds = [],
  onToggleSelectAll,
  onToggleSelectMember,
  onEditRole,
}) => {
  const totalItems = members?.length || 0;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedMembers = members?.slice(startIndex, startIndex + pageSize) || [];

  const isCurrentPageAllSelected =
    paginatedMembers.length > 0 &&
    paginatedMembers.every((m) => selectedMemberIds.includes(m.member_id));

  const isSomeSelected =
    paginatedMembers.some((m) => selectedMemberIds.includes(m.member_id)) &&
    !isCurrentPageAllSelected;

  const renderSortIcon = (key) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowsDownUp size={13} className="text-muted ms-1 opacity-50" />;
    }
    return sortConfig.direction === "asc" ? (
      <CaretUp size={13} className="text-primary ms-1" weight="bold" />
    ) : (
      <CaretDown size={13} className="text-primary ms-1" weight="bold" />
    );
  };

  const hasAnyFilter = Object.values(filters).some((v) => Boolean(v));

  return (
    <>
      <div className="table-responsive">
        <Table hover className="align-middle mb-0">
          <thead className="table-light">
            {/* Baris 1: Header Nama Kolom */}
            <tr>
              <th className="text-center" style={{ width: "4%" }}>
                <Form.Check
                  type="checkbox"
                  checked={isCurrentPageAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={(e) =>
                    onToggleSelectAll?.(
                      paginatedMembers.map((m) => m.member_id),
                      e.target.checked
                    )
                  }
                  title="Pilih semua di halaman ini"
                />
              </th>
              <th className="text-center text-nowrap" style={{ width: "6%" }}>
                Aksi
              </th>
              <th
                role="button"
                className="user-select-none text-nowrap"
                style={{ width: "18%" }}
                onClick={() => onSort?.("member_no")}
              >
                No. Anggota / NIK {renderSortIcon("member_no")}
              </th>
              <th
                role="button"
                className="user-select-none text-nowrap"
                style={{ width: "22%" }}
                onClick={() => onSort?.("full_name")}
              >
                Nama & Kontak {renderSortIcon("full_name")}
              </th>
              <th
                role="button"
                className="user-select-none text-nowrap"
                style={{ width: "14%" }}
                onClick={() => onSort?.("member_type")}
              >
                Jenis Anggota {renderSortIcon("member_type")}
              </th>
              <th style={{ width: "13%" }} className="text-nowrap">
                Peran / Role
              </th>
              <th
                role="button"
                className="user-select-none text-nowrap"
                style={{ width: "12%" }}
                onClick={() => onSort?.("join_date")}
              >
                Bergabung {renderSortIcon("join_date")}
              </th>
              <th
                role="button"
                className="user-select-none text-nowrap"
                style={{ width: "11%" }}
                onClick={() => onSort?.("status")}
              >
                Status {renderSortIcon("status")}
              </th>
            </tr>

            {/* Baris 2: Input Pencarian / Filter di Setiap Kolom */}
            <tr className="bg-light bg-opacity-75">
              <th className="text-center py-2">
                {/* Checkbox row column spacer */}
              </th>
              <th className="py-2 px-1 text-center">
                {hasAnyFilter && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="p-1 px-2 border-0"
                    onClick={onResetFilters}
                    title="Reset Semua Pencarian Kolom"
                  >
                    <X size={15} weight="bold" />
                  </Button>
                )}
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari No/NIK..."
                  value={filters.memberNo || ""}
                  onChange={(e) => onFilterChange?.("memberNo", e.target.value)}
                  className="bg-white border-1"
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari Nama/HP/Email..."
                  value={filters.nameOrContact || ""}
                  onChange={(e) => onFilterChange?.("nameOrContact", e.target.value)}
                  className="bg-white border-1"
                />
              </th>
              <th className="py-2 px-2">
                <Form.Select
                  size="sm"
                  value={filters.type || ""}
                  onChange={(e) => onFilterChange?.("type", e.target.value)}
                  className="bg-white border-1"
                >
                  <option value="">Semua</option>
                  <option value="reguler">Reguler</option>
                  <option value="luar biasa">Luar Biasa</option>
                </Form.Select>
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Filter Peran..."
                  value={filters.role || ""}
                  onChange={(e) => onFilterChange?.("role", e.target.value)}
                  className="bg-white border-1"
                />
              </th>
              <th className="py-2 px-2">
                <Form.Control
                  size="sm"
                  placeholder="Cari Thn/Bln..."
                  value={filters.joinDate || ""}
                  onChange={(e) => onFilterChange?.("joinDate", e.target.value)}
                  className="bg-white border-1"
                />
              </th>
              <th className="py-2 px-2">
                <Form.Select
                  size="sm"
                  value={filters.status || ""}
                  onChange={(e) => onFilterChange?.("status", e.target.value)}
                  className="bg-white border-1"
                >
                  <option value="">Semua</option>
                  <option value="aktif">Aktif</option>
                  <option value="nonaktif">Nonaktif</option>
                </Form.Select>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <Spinner animation="border" size="sm" className="me-2 text-primary" />
                  Memuat daftar anggota...
                </td>
              </tr>
            ) : totalItems === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-5 text-muted">
                  <div className="py-3">
                    <p className="mb-1 fw-medium text-dark">Tidak ada data anggota yang cocok.</p>
                    <small className="text-muted d-block mb-2">
                      Coba ubah kata kunci pada kolom pencarian di atas.
                    </small>
                    {hasAnyFilter && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-decoration-none"
                        onClick={onResetFilters}
                      >
                        Reset Semua Pencarian
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              paginatedMembers.map((m) => {
                const roles =
                  m.roleAssignments && m.roleAssignments.length > 0
                    ? m.roleAssignments.map((ra) => ra.role?.role_name).filter(Boolean)
                    : [];

                const isSelected = selectedMemberIds.includes(m.member_id);

                return (
                  <tr key={m.member_id} className={isSelected ? "table-primary bg-opacity-10" : ""}>
                    <td className="text-center">
                      <Form.Check
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectMember?.(m.member_id)}
                      />
                    </td>
                    <td className="text-center">
                      <div className="d-flex align-items-center justify-content-center gap-1">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 text-primary border shadow-none"
                          onClick={() => onSelectMember(m)}
                          title="Lihat Detail Profil Lengkap"
                        >
                          <Eye size={15} />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 text-warning border shadow-none"
                          onClick={() => onEditRole?.(m)}
                          title="Ubah Role / Peran Anggota"
                        >
                          <UserGear size={15} />
                        </Button>
                      </div>
                    </td>
                    <td>
                      <div className="fw-bold text-primary font-monospace">
                        {m.member_no || `${m.member_id?.substring(0, 8)}...`}
                      </div>
                      {m.nik_ktp && (
                        <small className="text-muted d-flex align-items-center gap-1">
                          <IdentificationCard size={13} /> {m.nik_ktp}
                        </small>
                      )}
                    </td>
                    <td>
                      <div className="fw-semibold text-dark">{m.full_name}</div>
                      <div className="d-flex flex-wrap align-items-center gap-2 text-muted small">
                        {m.phone_number && (
                          <span className="d-inline-flex align-items-center gap-1">
                            <Phone size={12} /> {m.phone_number}
                          </span>
                        )}
                        {m.email && (
                          <span
                            className="d-inline-flex align-items-center gap-1 text-truncate"
                            style={{ maxWidth: "160px" }}
                          >
                            <EnvelopeSimple size={12} /> {m.email}
                          </span>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge
                        bg={
                          String(m.member_type || "").toLowerCase().includes("reguler")
                            ? "primary"
                            : "warning"
                        }
                        className="px-3 py-1 rounded-pill"
                      >
                        {m.member_type || "Reguler"}
                      </Badge>
                    </td>
                    <td>
                      {roles.length > 0 ? (
                        <div className="d-flex flex-wrap gap-1">
                          {roles.map((r, i) => (
                            <Badge key={i} bg="light" text="dark" className="border">
                              {r}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted small">Anggota</span>
                      )}
                    </td>
                    <td className="text-muted small">
                      {formatDate
                        ? formatDate(m.join_date || m.created_at || m.createdAt)
                        : (m.join_date || "-")}
                    </td>
                    <td>
                      <Badge
                        bg={
                          String(m.status?.status_name || "").toUpperCase() === "AKTIF"
                            ? "success"
                            : "secondary"
                        }
                        className="px-3 py-1 rounded-pill"
                      >
                        {m.status?.status_name || "Aktif"}
                      </Badge>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>
      </div>

      {!loading && totalItems > 0 && (
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 pt-3 border-top px-1 gap-2">
          <small className="text-muted">
            Menampilkan <b>{startIndex + 1}</b> -{" "}
            <b>{Math.min(startIndex + pageSize, totalItems)}</b> dari{" "}
            <b>{totalItems}</b> anggota
          </small>

          {totalPages > 1 && (
            <Pagination className="mb-0" size="sm">
              <Pagination.First
                onClick={() => onPageChange?.(1)}
                disabled={currentPage === 1}
              />
              <Pagination.Prev
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
              />

              {[...Array(totalPages)].map((_, idx) => {
                const page = idx + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Pagination.Item
                      key={page}
                      active={page === currentPage}
                      onClick={() => onPageChange?.(page)}
                    >
                      {page}
                    </Pagination.Item>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <Pagination.Ellipsis key={page} disabled />;
                }
                return null;
              })}

              <Pagination.Next
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
              />
              <Pagination.Last
                onClick={() => onPageChange?.(totalPages)}
                disabled={currentPage === totalPages}
              />
            </Pagination>
          )}
        </div>
      )}
    </>
  );
};

export default React.memo(MembersTable);
