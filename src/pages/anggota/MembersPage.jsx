import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button, Spinner, Table, Form, Modal, Alert, Badge } from "react-bootstrap";
import {
  Users,
  CheckCircle,
  FileArrowDown,
  MagnifyingGlass,
  Eye,
  Trash,
  User,
  EnvelopeSimple,
  Phone,
  GenderIntersex,
  Cake,
  Calendar,
  House,
  UploadSimple,
  DownloadSimple,
} from "phosphor-react";
import Swal from "sweetalert2";
import api from "../../utils/api/common";
import exportToExcel from "../../utils/helpers/exportToExcel";
import ImportAnggotaModal from "./components/ImportAnggotaModal";

const MembersPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [search, setSearch] = useState({ id: "", name: "", type: "", status: "" });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/anggota/all?limit=1000");
      if (res.data?.success) {
        setMembers(res.data.data.members || []);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredMembers = members.filter((m) => {
    const idMatch = String(m.member_no || m.member_id || "")
      .toLowerCase()
      .includes(search.id.toLowerCase());
    const nameMatch = String(m.full_name || "")
      .toLowerCase()
      .includes(search.name.toLowerCase());
    const typeMatch = search.type === "" || String(m.member_type || "").toLowerCase().includes(search.type.toLowerCase());
    return idMatch && nameMatch && typeMatch;
  });

  const handleExportMembers = () => {
    if (!filteredMembers || filteredMembers.length === 0) {
      Swal.fire("Peringatan", "Tidak ada data anggota untuk diekspor", "warning");
      return;
    }

    const dataToExport = filteredMembers.map((m, idx) => ({
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
      "Pekerjaan": m.employment?.occupation || "-",
      "Nama Perusahaan / Tempat Bekerja": m.employment?.employer_name || "-",
      "Nama Usaha": m.business?.business_name || "-",
      "Omzet Bulanan": m.business?.monthly_revenue || "-",
      "Nama Kontak Darurat": m.emergencyContact?.contact_name || "-",
      "No HP Darurat": m.emergencyContact?.phone_number || "-",
      "Hubungan": m.emergencyContact?.relation || "-",
      "Nama Bank": m.bankAccount?.bank_name || "-",
      "Nomor Rekening": m.bankAccount?.bank_account_no || "-",
      "Nama Pemilik Rekening": m.bankAccount?.account_holder || "-",
    }));

    exportToExcel(dataToExport, `Data_Anggota_Koperasi_${new Date().toISOString().split("T")[0]}`);
  };

  const handleDeleteMember = async (memberId) => {
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
        }
      } catch (err) {
        Swal.fire("Gagal", err.response?.data?.message || "Gagal menghapus anggota", "error");
      }
    }
  };

  return (
    <div className="pb-5">
      <Row className="mb-4 align-items-center">
        <Col md={7}>
          <h3 className="fw-bold mb-1">Daftar Anggota Koperasi</h3>
          <p className="text-muted mb-0">
            Kelola data akun seluruh anggota terdaftar di Paguyuban Usaha Sukses.
          </p>
        </Col>
        <Col md={5} className="text-md-end mt-3 mt-md-0 d-flex gap-2 justify-content-md-end">
          <Button
            variant="outline-primary"
            className="d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm"
            onClick={() => setShowImportModal(true)}
          >
            <UploadSimple size={18} weight="bold" />
            Import Excel
          </Button>
          <Button
            variant="success"
            className="d-flex align-items-center gap-2 fw-semibold px-3 shadow-sm text-white"
            onClick={handleExportMembers}
            disabled={loading || filteredMembers.length === 0}
          >
            <DownloadSimple size={18} weight="bold" />
            Export Excel
          </Button>
        </Col>
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-4">
          <Row className="g-3 mb-4">
            <Col md={4}>
              <Form.Control
                placeholder="Cari ID Anggota..."
                value={search.id}
                onChange={(e) => setSearch({ ...search, id: e.target.value })}
              />
            </Col>
            <Col md={5}>
              <Form.Control
                placeholder="Cari Nama Lengkap..."
                value={search.name}
                onChange={(e) => setSearch({ ...search, name: e.target.value })}
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={search.type}
                onChange={(e) => setSearch({ ...search, type: e.target.value })}
              >
                <option value="">Semua Jenis Anggota</option>
                <option value="reguler">Reguler</option>
                <option value="luar biasa">Luar Biasa</option>
              </Form.Select>
            </Col>
          </Row>

          <div className="table-responsive">
            <Table hover className="align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>ID Anggota</th>
                  <th>Nama Lengkap</th>
                  <th>Jenis Anggota</th>
                  <th>Tanggal Bergabung</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      <Spinner animation="border" size="sm" className="me-2" />
                      Memuat daftar anggota...
                    </td>
                  </tr>
                ) : filteredMembers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      Tidak ada data anggota yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredMembers.map((m) => (
                    <tr key={m.member_id}>
                      <td className="fw-bold text-primary">
                        {m.member_no || `${m.member_id.substring(0, 8)}...`}
                      </td>
                      <td className="fw-semibold text-dark">{m.full_name}</td>
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
                      <td className="text-muted">{formatDate(m.join_date)}</td>
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
                      <td className="text-center">
                        <Button
                          variant="light"
                          size="sm"
                          className="rounded-circle p-2 text-primary border"
                          onClick={() => {
                            setSelectedMember(m);
                            setShowDetailModal(true);
                          }}
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Detail Anggota */}
      <Modal
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton className="border-0 px-4 pt-4">
          <Modal.Title className="fw-bold">Detail Profil Anggota</Modal.Title>
        </Modal.Header>
        <Modal.Body className="px-4 pb-4">
          {selectedMember && (
            <div>
              <Row className="mb-4 align-items-center">
                <Col xs="auto">
                  <div
                    className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                    style={{ width: "70px", height: "70px" }}
                  >
                    <User size={36} />
                  </div>
                </Col>
                <Col>
                  <h4 className="fw-bold mb-1">{selectedMember.full_name}</h4>
                  <p className="text-muted mb-0">ID: {selectedMember.member_no || selectedMember.member_id}</p>
                </Col>
              </Row>

              <Row className="g-3">
                <Col md={6}>
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted d-block mb-1">NIK KTP</small>
                    <span className="fw-bold">{selectedMember.nik_ktp || "-"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted d-block mb-1">Nomor Telepon</small>
                    <span className="fw-bold">{selectedMember.phone_number || "-"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted d-block mb-1">Email</small>
                    <span className="fw-bold">{selectedMember.email || "-"}</span>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted d-block mb-1">Jenis Kelamin</small>
                    <span className="fw-bold">
                      {selectedMember.gender === "L"
                        ? "Laki-laki"
                        : selectedMember.gender === "P"
                        ? "Perempuan"
                        : "-"}
                    </span>
                  </div>
                </Col>
                <Col md={12}>
                  <div className="p-3 border rounded-3 bg-light">
                    <small className="text-muted d-block mb-1">Alamat Lengkap</small>
                    <span className="fw-bold">{selectedMember.address || "-"}</span>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-0 px-4 pb-4 d-flex justify-content-between">
          <Button
            variant="danger"
            onClick={() => handleDeleteMember(selectedMember?.member_id)}
          >
            Hapus Anggota
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowDetailModal(false)}
          >
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Import Anggota */}
      <ImportAnggotaModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        onSuccess={fetchMembers}
      />
    </div>
  );
};

export default MembersPage;
