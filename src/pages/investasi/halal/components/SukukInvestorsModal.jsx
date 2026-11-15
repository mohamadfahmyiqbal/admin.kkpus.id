import React, { useState, useEffect, useRef, useMemo } from "react";
import { Modal } from "react-bootstrap";
import api from "../../../../utils/api/common";
import SukukScheduleModal from "./SukukScheduleModal";
import {
  SukukInvestorsModalHeader,
  SukukInvestorsModalFooter,
} from "./investors/SukukInvestorsModalHeaderFooter";
import SukukInvestorsTable from "./investors/SukukInvestorsTable";

const initialFilters = {
  member_name: "",
  lembar: "",
  amount: "",
  pengembalian: "",
  imbal_hasil: "",
  status: "",
};

const SukukInvestorsModal = ({ show, onHide, transaction }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState(initialFilters);

  const [selectedMember, setSelectedMember] = useState(null);
  const [scheduleType, setScheduleType] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    if (show && transaction) {
      fetchMembers();
      setFilters(initialFilters);
    } else {
      setMembers([]);
    }
  }, [show, transaction]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/financing/sukuk/members/${transaction.issue_id}`
      );
      if (res.data && res.data.data) {
        setMembers(res.data.data);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data anggota sukuk:", err);
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, val) => {
    setFilters((prev) => ({ ...prev, [field]: val }));
  };

  const openSchedule = (member, type) => {
    setSelectedMember(member);
    setScheduleType(type);
  };

  const handleProofChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !uploadingId) return;
    const formData = new FormData();
    formData.append("transfer_proof", file);

    try {
      setLoading(true);
      const res = await api.post(
        `/financing/sukuk/withdraw/${uploadingId}/proof`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      if (res.data.status) {
        alert("Bukti transfer berhasil diupload.");
        fetchMembers();
      }
    } catch {
      alert("Gagal upload bukti transfer.");
    } finally {
      setLoading(false);
      setUploadingId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerUpload = (orderId) => {
    setUploadingId(orderId);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const filteredMembers = useMemo(() => {
    return members.filter(
      (item) =>
        (item.member_name || "")
          .toLowerCase()
          .includes(filters.member_name.toLowerCase()) &&
        String(item.lembar || "")
          .toLowerCase()
          .includes(filters.lembar.toLowerCase()) &&
        String(item.amount || "")
          .toLowerCase()
          .includes(filters.amount.toLowerCase()) &&
        String(item.pengembalian || "")
          .toLowerCase()
          .includes(filters.pengembalian.toLowerCase()) &&
        String(item.imbal_hasil || "")
          .toLowerCase()
          .includes(filters.imbal_hasil.toLowerCase()) &&
        (item.status || "").toLowerCase().includes(filters.status.toLowerCase())
    );
  }, [members, filters]);

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="xl"
        centered
        backdrop="static"
        contentClassName="border-0 rounded-4 shadow-xl"
      >
        <SukukInvestorsModalHeader issueName={transaction?.issue_name} />

        <Modal.Body className="pt-0 px-4 pb-4">
          <SukukInvestorsTable
            members={members}
            filteredMembers={filteredMembers}
            filters={filters}
            onFilterChange={handleFilterChange}
            loading={loading}
            onOpenSchedule={openSchedule}
            onTriggerUpload={triggerUpload}
            uploadingId={uploadingId}
          />
        </Modal.Body>

        <SukukInvestorsModalFooter
          totalCount={filteredMembers.length}
          onHide={onHide}
        />
      </Modal>

      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/jpeg,image/png,image/jpg,application/pdf"
        onChange={handleProofChange}
      />

      <SukukScheduleModal
        show={!!selectedMember}
        onHide={() => setSelectedMember(null)}
        type={scheduleType}
        member={selectedMember}
        issueName={transaction?.issue_name}
      />
    </>
  );
};

export default SukukInvestorsModal;
