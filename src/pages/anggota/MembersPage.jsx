import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Card } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../utils/api/common";
import exportToExcel from "../../utils/helpers/exportToExcel";
import ImportAnggotaModal from "./components/ImportAnggotaModal";
import MembersHeader from "./components/MembersHeader";
import MembersStats from "./components/MembersStats";
import MembersTable from "./components/MembersTable";
import MemberDetailModal from "./components/MemberDetailModal";

const MembersPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
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

  const [sortConfig, setSortConfig] = useState({
    key: "join_date",
    direction: "desc",
  });

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/anggota/all?limit=1000");
      if (res.data?.success) {
        setMembers(res.data.data.members || []);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
      Swal.fire("Error", "Gagal mengambil data anggota", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

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

  // Filter & Urutkan Data per-kolom
  const processedMembers = useMemo(() => {
    const fMemberNo = (columnFilters.memberNo || "").trim().toLowerCase();
    const fNameContact = (columnFilters.nameOrContact || "").trim().toLowerCase();
    const fType = (columnFilters.type || "").trim().toLowerCase();
    const fRole = (columnFilters.role || "").trim().toLowerCase();
    const fJoinDate = (columnFilters.joinDate || "").trim().toLowerCase();
    const fStatus = (columnFilters.status || "").trim().toLowerCase();

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
  }, [members, columnFilters, sortConfig, formatDate]);

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

  const handleDeleteMember = useCallback(async (memberId) => {
    if (!memberId) return;

    const confirm = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data anggota ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.delete(`/anggota/${memberId}`);
        if (res.data?.success) {
          Swal.fire("Terhapus!", "Anggota berhasil dihapus.", "success");
          fetchMembers();
          setShowDetailModal(false);
          setSelectedMemberIds((prev) => prev.filter((id) => id !== memberId));
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal menghapus anggota", "error");
      }
    }
  }, [fetchMembers]);

  // Handler Hapus Banyak Sekaligus (Batch Delete)
  const handleDeleteBatch = useCallback(async () => {
    if (selectedMemberIds.length === 0) return;

    const confirm = await Swal.fire({
      title: "Hapus Anggota Terpilih?",
      text: `Apakah Anda yakin ingin menghapus ${selectedMemberIds.length} anggota yang dipilih? Semua data terkait juga akan terhapus secara permanen!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: `Ya, hapus ${selectedMemberIds.length} anggota!`,
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await api.post("/anggota/batch-delete", {
          member_ids: selectedMemberIds,
        });

        if (res.data?.success) {
          Swal.fire(
            "Berhasil!",
            res.data.message || "Anggota terpilih berhasil dihapus.",
            "success"
          );
          setSelectedMemberIds([]);
          fetchMembers();
        }
      } catch (err) {
        console.error("Batch delete error:", err);
        Swal.fire(
          "Gagal",
          err.response?.data?.message || "Gagal menghapus anggota terpilih",
          "error"
        );
      }
    }
  }, [selectedMemberIds, fetchMembers]);

  return (
    <div className="pb-5">
      <MembersHeader
        onImport={() => setShowImportModal(true)}
        onExport={handleExportMembers}
        disableExport={loading || processedMembers.length === 0}
        selectedCount={selectedMemberIds.length}
        onDeleteBatch={handleDeleteBatch}
      />

      <MembersStats members={members} loading={loading} />

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
          />
        </Card.Body>
      </Card>

      <MemberDetailModal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        member={selectedMember}
        onDelete={handleDeleteMember}
        formatDate={formatDate}
      />

      <ImportAnggotaModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default MembersPage;
