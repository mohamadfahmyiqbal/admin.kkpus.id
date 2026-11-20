import { useState, useEffect, useMemo, useCallback, useDeferredValue, Suspense, lazy } from "react";
import { Card, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../utils/api/common";
import exportToExcel from "../../utils/helpers/exportToExcel";
import MembersHeader from "./components/MembersHeader";
import MembersStats from "./components/MembersStats";
import MembersTable from "./components/MembersTable";

// Lazy load modal berat untuk optimasi bundle size
const MemberDetailModal = lazy(() => import("./components/MemberDetailModal"));
const EditRoleModal = lazy(() => import("./components/EditRoleModal"));
const ImportAnggotaModal = lazy(() => import("./components/ImportAnggotaModal"));

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberToEditRole, setMemberToEditRole] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const pageSize = 10;

  // State filter per-kolom di thead
  const [columnFilters, setColumnFilters] = useState({
    memberNo: "",
    nameOrContact: "",
    type: "",
    role: "",
    joinDate: "",
    status: "",
  });

  // Arsip mode: false = anggota aktif, true = anggota terarsip
  const [showArchived, setShowArchived] = useState(false);

  // Concurrent transition filter menggunakan useDeferredValue agar pengetikan tidak freeze
  const deferredFilters = useDeferredValue(columnFilters);

  const [sortConfig, setSortConfig] = useState({
    key: "join_date",
    direction: "desc",
  });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const archivedParam = showArchived ? "?archived=true" : "?archived=false";
      const res = await api.get(`/anggota/all${archivedParam}&limit=1000`);
      if (res.data?.success) {
        setMembers(res.data.data.members || []);
      }
    } catch (err) {
      /* console.error: "Error fetching members:", err */
      Swal.fire("Error", "Gagal mengambil data anggota", "error");
    } finally {
      setLoading(false);
    }
  }, [showArchived]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers, showArchived]);

  const formatDate = useCallback((dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }, []);

  const handleFilterChange = useCallback((field, value) => {
    setColumnFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  }, []);

  const handleResetFilters = useCallback(() => {
    setColumnFilters({
      memberNo: "",
      nameOrContact: "",
      type: "",
      role: "",
      joinDate: "",
      status: "",
    });
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  // Selection handlers
  const handleToggleSelectMember = useCallback((memberId) => {
    setSelectedMemberIds((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  }, []);

  const handleToggleSelectAll = useCallback((pageMemberIds, isSelect) => {
    setSelectedMemberIds((prev) => {
      if (isSelect) {
        return Array.from(new Set([...prev, ...pageMemberIds]));
      } else {
        return prev.filter((id) => !pageMemberIds.includes(id));
      }
    });
  }, []);

  // Filter & Urutkan Data per-kolom (menggunakan deferredFilters untuk performa responsif)
  const processedMembers = useMemo(() => {
    const fMemberNo = (deferredFilters.memberNo || "").trim().toLowerCase();
    const fNameContact = (deferredFilters.nameOrContact || "").trim().toLowerCase();
    const fType = (deferredFilters.type || "").trim().toLowerCase();
    const fRole = (deferredFilters.role || "").trim().toLowerCase();
    const fJoinDate = (deferredFilters.joinDate || "").trim().toLowerCase();
    const fStatus = (deferredFilters.status || "").trim().toLowerCase();

    const filtered = members.filter((m) => {
      // 1. Filter No. Anggota / NIK
      if (fMemberNo) {
        const matchNo = String(m.member_no || "").toLowerCase().includes(fMemberNo);
        const matchNik = String(m.nik_ktp || "").toLowerCase().includes(fMemberNo);
        if (!matchNo && !matchNik) return false;
      }

      // 2. Filter Nama & Kontak (Nama, No HP, Email)
      if (fNameContact) {
        const matchName = String(m.full_name || "").toLowerCase().includes(fNameContact);
        const matchPhone = String(m.phone_number || "").toLowerCase().includes(fNameContact);
        const matchEmail = String(m.email || "").toLowerCase().includes(fNameContact);
        if (!matchName && !matchPhone && !matchEmail) return false;
      }

      // 3. Filter Jenis Anggota
      if (fType) {
        if (!String(m.member_type || "").toLowerCase().includes(fType)) return false;
      }

      // 4. Filter Peran / Role
      if (fRole) {
        const roleNames = (m.roleAssignments || [])
          .map((ra) => ra.role?.role_name || "")
          .join(" ")
          .toLowerCase();
        const defaultRole = roleNames ? roleNames : "anggota";
        if (!defaultRole.includes(fRole)) return false;
      }

      // 5. Filter Tanggal Bergabung
      if (fJoinDate) {
        const dateStr = formatDate(m.join_date || m.created_at || m.createdAt).toLowerCase();
        const rawDate = String(m.join_date || "").toLowerCase();
        if (!dateStr.includes(fJoinDate) && !rawDate.includes(fJoinDate)) return false;
      }

      // 6. Filter Status
      if (fStatus) {
        const statusName = String(m.status?.status_name || "aktif").toLowerCase();
        if (!statusName.includes(fStatus)) return false;
      }

      return true;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";

        if (sortConfig.key === "status") {
          aVal = a.status?.status_name || "";
          bVal = b.status?.status_name || "";
        }

        if (sortConfig.key === "join_date") {
          const aTime = aVal ? new Date(aVal).getTime() : 0;
          const bTime = bVal ? new Date(bVal).getTime() : 0;
          return sortConfig.direction === "asc" ? aTime - bTime : bTime - aTime;
        }

        const cmp = String(aVal).localeCompare(String(bVal), "id-ID", {
          numeric: true,
          sensitivity: "base",
        });
        return sortConfig.direction === "asc" ? cmp : -cmp;
      });
    }

    return filtered;
  }, [members, deferredFilters, sortConfig, formatDate]);

  const handleExportMembers = useCallback(() => {
    if (!processedMembers || processedMembers.length === 0) {
      Swal.fire("Peringatan", "Tidak ada data anggota untuk diekspor", "warning");
      return;
    }

    const dataToExport = processedMembers.map((m, idx) => {
      const emp = m.employments?.[0] || m.employment || {};
      const bank = m.bankAccounts?.[0] || m.bankAccount || {};
      const ec = m.emergencyContacts?.[0] || m.emergencyContact || {};
      const bus = m.business || {};

      return {
        "No.": idx + 1,
        "No. Anggota": m.member_no || "-",
        "Nama Lengkap": m.full_name || "-",
        "NIK KTP": m.nik_ktp || "-",
        "No. HP / Telepon": m.phone_number || "-",
        "Email": m.email || "-",
        "Jenis Kelamin":
          m.gender === "L" ? "Laki-laki" : m.gender === "P" ? "Perempuan" : m.gender || "-",
        "Tanggal Lahir": m.date_of_brith ? formatDate(m.date_of_brith) : "-",
        "Jenis Anggota": m.member_type || "Reguler",
        "Tanggal Bergabung": formatDate(m.join_date),
        "Status": m.status?.status_name || "Aktif",
        "Alamat": m.address || "-",
        "RT": m.rt || "-",
        "RW": m.rw || "-",
        "Pekerjaan": emp.occupation || "-",
        "Nama Perusahaan / Tempat Bekerja": emp.employer_name || "-",
        "Nama Usaha": bus.business_name || "-",
        "Omzet Bulanan": bus.monthly_revenue
          ? `Rp ${Number(bus.monthly_revenue).toLocaleString("id-ID")}`
          : "-",
        "Nama Kontak Darurat": ec.contact_name || "-",
        "No HP Darurat": ec.phone_number || "-",
        "Hubungan": ec.relation || "-",
        "Nama Bank": bank.bank_name || "-",
        "Nomor Rekening": bank.bank_account_no || "-",
        "Nama Pemilik Rekening": bank.account_holder || "-",
      };
    });

    exportToExcel(dataToExport, `Data_Anggota_Koperasi_${new Date().toISOString().split("T")[0]}`);
  }, [processedMembers, formatDate]);

  // Handler Arsipkan Anggota Tunggal (Soft Delete) dengan Verifikasi Password & Audit Log
  const handleArchiveMember = useCallback(async (memberId) => {
    if (!memberId) return;

    const { value: password, isConfirmed } = await Swal.fire({
      title: "Konfirmasi Arsipkan Anggota",
      html: `
        <div class="text-start small">
          <p class="text-warning fw-bold mb-1">⚠️ Anggota akan diarsipkan (non-aktif).</p>
          <p class="text-muted mb-2">Data profil dan relasi anggota akan disembunyikan dari daftar aktif, tetapi tetap tersimpan dan dapat dikembalikan kapan saja. Tindakan ini dicatat dalam log audit aktivitas.</p>
          <p class="mb-1 fw-semibold text-dark">Masukkan password akun Anda untuk mengonfirmasi:</p>
        </div>
      `,
      input: "password",
      inputPlaceholder: "Password akun Anda...",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "current-password",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fd7e14",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Arsipkan",
      cancelButtonText: "Batal",
      inputValidator: (val) => {
        if (!val) {
          return "Password administrator wajib diisi!";
        }
      },
    });

    if (isConfirmed && password) {
      try {
        const res = await api.patch(
          `/anggota/${memberId}/archive`,
          { password },
          { skipAuthRedirect: true }
        );
        if (res.data?.success) {
          Swal.fire("Diarsipkan!", res.data.message || "Anggota berhasil diarsipkan.", "success");
          fetchMembers();
          setShowDetailModal(false);
          setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal mengarsipkan anggota", "error");
      }
    }
  }, [fetchMembers]);

  // Handler Arsipkan Banyak Sekaligus (Batch Archive) dengan Verifikasi Password & Audit Log
  const handleArchiveBatch = useCallback(async () => {
    if (selectedMemberIds.length === 0) return;

    const { value: password, isConfirmed } = await Swal.fire({
      title: "Konfirmasi Arsipkan Massal",
      html: `
        <div class="text-start small">
          <p class="text-warning fw-bold mb-1">⚠️ Akan mengarsipkan ${selectedMemberIds.length} Anggota Sekaligus!</p>
          <p class="text-muted mb-2">Data anggota terpilih akan disembunyikan dari daftar aktif, tetapi tetap tersimpan dan dapat dikembalikan. Tindakan ini akan dicatat ke log audit sistem.</p>
          <p class="mb-1 fw-semibold text-dark">Masukkan password akun Anda untuk mengonfirmasi:</p>
        </div>
      `,
      input: "password",
      inputPlaceholder: "Password akun Anda...",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "current-password",
      },
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#fd7e14",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Ya, Arsipkan ${selectedMemberIds.length} Anggota`,
      cancelButtonText: "Batal",
      inputValidator: (val) => {
        if (!val) {
          return "Password administrator wajib diisi!";
        }
      },
    });

    if (isConfirmed && password) {
      try {
        const res = await api.post(
          "/anggota/batch-archive",
          {
            member_ids: selectedMemberIds,
            password,
          },
          {
            skipAuthRedirect: true,
          }
        );

        if (res.data?.success) {
          Swal.fire(
            "Berhasil!",
            res.data.message || "Anggota terpilih berhasil diarsipkan.",
            "success"
          );
          setSelectedMemberIds([]);
          fetchMembers();
        }
      } catch (err) {
        /* console.error: "Batch archive error:", err */
        Swal.fire(
          "Gagal",
          err.response?.data?.message || "Gagal mengarsipkan anggota terpilih",
          "error"
        );
      }
    }
  }, [selectedMemberIds, fetchMembers]);

  // Handler Kembalikan Anggota dari Arsip (Restore)
  const handleRestoreMember = useCallback(async (memberId) => {
    if (!memberId) return;

    const { value: password, isConfirmed } = await Swal.fire({
      title: "Konfirmasi Kembalikan Anggota",
      html: `
        <div class="text-start small">
          <p class="text-info fw-bold mb-1">ℹ️ Anggota akan dikembalikan ke status aktif.</p>
          <p class="text-muted mb-2">Anggota akan kembali muncul di daftar anggota aktif. Tindakan ini dicatat dalam log audit aktivitas.</p>
          <p class="mb-1 fw-semibold text-dark">Masukkan password akun Anda untuk mengonfirmasi:</p>
        </div>
      `,
      input: "password",
      inputPlaceholder: "Password akun Anda...",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "current-password",
      },
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0dcaf0",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Kembalikan",
      cancelButtonText: "Batal",
      inputValidator: (val) => {
        if (!val) {
          return "Password administrator wajib diisi!";
        }
      },
    });

    if (isConfirmed && password) {
      try {
        const res = await api.patch(
          `/anggota/${memberId}/restore`,
          { password },
          { skipAuthRedirect: true }
        );
        if (res.data?.success) {
          Swal.fire("Dikembalikan!", res.data.message || "Anggota berhasil dikembalikan ke aktif.", "success");
          fetchMembers();
          setShowDetailModal(false);
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal mengembalikan anggota", "error");
      }
    }
  }, [fetchMembers]);

  // Handler Kembalikan Banyak dari Arsip (Batch Restore)
  const handleRestoreBatch = useCallback(async () => {
    if (selectedMemberIds.length === 0) return;

    const { value: password, isConfirmed } = await Swal.fire({
      title: "Konfirmasi Kembalikan Massal",
      html: `
        <div class="text-start small">
          <p class="text-info fw-bold mb-1">ℹ️ Akan mengembalikan ${selectedMemberIds.length} Anggota dari arsip.</p>
          <p class="text-muted mb-2">Anggota terpilih akan kembali muncul di daftar anggota aktif. Tindakan ini dicatat ke log audit sistem.</p>
          <p class="mb-1 fw-semibold text-dark">Masukkan password akun Anda untuk mengonfirmasi:</p>
        </div>
      `,
      input: "password",
      inputPlaceholder: "Password akun Anda...",
      inputAttributes: {
        autocapitalize: "off",
        autocorrect: "off",
        autocomplete: "current-password",
      },
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0dcaf0",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Ya, Kembalikan ${selectedMemberIds.length} Anggota`,
      cancelButtonText: "Batal",
      inputValidator: (val) => {
        if (!val) {
          return "Password administrator wajib diisi!";
        }
      },
    });

    if (isConfirmed && password) {
      try {
        const res = await api.post(
          "/anggota/batch-restore",
          {
            member_ids: selectedMemberIds,
            password,
          },
          {
            skipAuthRedirect: true,
          }
        );

        if (res.data?.success) {
          Swal.fire(
            "Berhasil!",
            res.data.message || "Anggota terpilih berhasil dikembalikan.",
            "success"
          );
          setSelectedMemberIds([]);
          fetchMembers();
        }
      } catch (err) {
        /* console.error: "Batch restore error:", err */
        Swal.fire(
          "Gagal",
          err.response?.data?.message || "Gagal mengembalikan anggota terpilih",
          "error"
        );
      }
    }
  }, [selectedMemberIds, fetchMembers]);

  return (
    <div className="pb-5">
      {/* Archive Toggle Bar */}
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3 p-3 bg-light rounded-3 border">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-semibold text-dark small">Tampilan:</span>
          <Button
            variant={!showArchived ? "primary" : "outline-secondary"}
            size="sm"
            onClick={() => setShowArchived(false)}
            aria-pressed={!showArchived}
            className="fw-semibold"
          >
            Anggota Aktif
          </Button>
          <Button
            variant={showArchived ? "warning" : "outline-secondary"}
            size="sm"
            onClick={() => setShowArchived(true)}
            aria-pressed={showArchived}
            className="fw-semibold"
          >
            <span className="d-flex align-items-center gap-1">
              <span className="bi bi-archive" aria-hidden="true"></span> Arsip
            </span>
          </Button>
          </div>
        <div className="text-muted small">
          {showArchived
            ? `Menampilkan ${members.length} anggota terarsip`
            : `Menampilkan ${members.length} anggota aktif`}
        </div>
      </div>

      <MembersHeader
        onImport={() => setShowImportModal(true)}
        onExport={handleExportMembers}
        disableExport={loading || processedMembers.length === 0}
        selectedCount={selectedMemberIds.length}
        onArchiveBatch={showArchived ? handleRestoreBatch : handleArchiveBatch}
        isArchiveMode={showArchived}
      />

      <MembersStats members={members} loading={loading} isArchiveMode={showArchived} />

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-3 p-md-4">
          <MembersTable
            loading={loading}
            members={processedMembers}
            onSelectMember={(member) => {
              setSelectedMember(member);
              setShowDetailModal(true);
            }}
            formatDate={formatDate}
            sortConfig={sortConfig}
            onSort={handleSort}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            filters={columnFilters}
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            selectedMemberIds={selectedMemberIds}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectMember={handleToggleSelectMember}
            onEditRole={(member) => {
              setMemberToEditRole(member);
              setShowRoleModal(true);
            }}
            onArchiveMember={showArchived ? handleRestoreMember : handleArchiveMember}
            isArchiveMode={showArchived}
          />
        </Card.Body>
      </Card>

      <Suspense fallback={null}>
        {showDetailModal && (
          <MemberDetailModal
            show={showDetailModal}
            onHide={() => setShowDetailModal(false)}
            member={selectedMember}
            onArchive={showArchived ? handleRestoreMember : handleArchiveMember}
            formatDate={formatDate}
            onEditRole={(member) => {
              setMemberToEditRole(member);
              setShowRoleModal(true);
            }}
            isArchiveMode={showArchived}
          />
        )}

        {showRoleModal && (
          <EditRoleModal
            show={showRoleModal}
            onHide={() => {
              setShowRoleModal(false);
              setMemberToEditRole(null);
            }}
            member={memberToEditRole}
            onSuccess={() => {
              fetchMembers();
              setShowDetailModal(false);
            }}
          />
        )}

        {showImportModal && (
          <ImportAnggotaModal
            show={showImportModal}
            onHide={() => setShowImportModal(false)}
            onSuccess={fetchMembers}
          />
        )}
      </Suspense>
    </div>
  );
};

export default MembersPage;
