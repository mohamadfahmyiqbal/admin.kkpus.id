import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert, Badge } from "react-bootstrap";
import { ShieldCheck, UserGear } from "phosphor-react";
import Swal from "sweetalert2";
import api from "../../../utils/api/common";

const EditRoleModal = ({ show, onHide, member, onSuccess }) => {
  const [roles, setRoles] = useState([]);
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ambil list semua role dari server
  useEffect(() => {
    if (show) {
      const fetchRoles = async () => {
        setLoadingRoles(true);
        try {
          const res = await api.get("/anggota/roles");
          if (res.data?.success) {
            setRoles(res.data.data || []);
          }
        } catch (err) {
          console.error("Gagal mengambil roles:", err);
        } finally {
          setLoadingRoles(false);
        }
      };
      fetchRoles();
    }
  }, [show]);

  // Set initial selected roles berdasarkan member yang dipilih
  useEffect(() => {
    if (member && show) {
      const currentRoleIds = (member.roleAssignments || [])
        .map((ra) => ra.role_id || ra.role?.role_id)
        .filter(Boolean);
      setSelectedRoleIds(currentRoleIds);
    } else {
      setSelectedRoleIds([]);
    }
  }, [member, show]);

  const handleCheckboxChange = (roleId) => {
    setSelectedRoleIds((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : [...prev, roleId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!member) return;

    // Validasi apakah anggota reguler
    const isReguler = String(member.member_type || "")
      .toLowerCase()
      .includes("reguler");
    if (!isReguler) {
      Swal.fire(
        "Peringatan",
        "Role hanya dapat diatur untuk jenis Anggota Reguler.",
        "warning"
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put(`/anggota/${member.member_id}/role`, {
        role_id: selectedRoleIds,
      });

      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: `Role untuk ${member.full_name} berhasil diperbarui.`,
          timer: 2000,
          showConfirmButton: false,
        });
        onHide();
        onSuccess?.();
      }
    } catch (err) {
      console.error("Update role error:", err);
      Swal.fire(
        "Gagal",
        err.response?.data?.message || "Terjadi kesalahan saat merubah role.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const isReguler = String(member?.member_type || "")
    .toLowerCase()
    .includes("reguler");

  return (
    <Modal show={show} onHide={onHide} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton className="border-0 px-4 pt-4 pb-2">
          <Modal.Title className="fw-bold fs-5 d-flex align-items-center gap-2">
            <UserGear size={24} className="text-primary" weight="bold" />
            <span>Ubah Role / Peran Anggota</span>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-4 pb-4">
          {member && (
            <div className="p-3 mb-3 bg-light rounded-3 border">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="fw-bold text-dark mb-0">{member.full_name}</h6>
                  <small className="text-muted">
                    No. Anggota: <b>{member.member_no || member.member_id}</b>
                  </small>
                </div>
                <Badge
                  bg={isReguler ? "primary" : "warning"}
                  className="rounded-pill px-2.5 py-1"
                >
                  {member.member_type || "Reguler"}
                </Badge>
              </div>
            </div>
          )}

          {!isReguler && (
            <Alert variant="warning" className="small py-2 border-0 mb-3">
              ⚠️ Anggota berstatus <b>{member?.member_type || "Luar Biasa"}</b> tidak dapat diberikan role khusus kepengurusan. Ubah tipe menjadi <b>Reguler</b> jika ingin memberikan hak akses/role.
            </Alert>
          )}

          <div className="mb-2">
            <label className="fw-bold small text-dark mb-2">
              Pilih Peran / Hak Akses Pengguna:
            </label>
            <p className="text-muted small mb-3">
              Pilih satu atau beberapa role yang akan diberikan kepada anggota ini. Jika semua tidak dicentang, anggota akan berstatus sebagai <b>Anggota Biasa</b>.
            </p>

            {loadingRoles ? (
              <div className="text-center py-4 text-muted">
                <Spinner animation="border" size="sm" className="me-2 text-primary" />
                Memuat daftar role...
              </div>
            ) : roles.length === 0 ? (
              <div className="text-center py-3 text-muted border rounded-3 bg-light">
                <small>Tidak ada role yang tersedia di sistem.</small>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2 p-3 border rounded-3 bg-white">
                {roles.map((r) => {
                  const isChecked = selectedRoleIds.includes(r.role_id);
                  return (
                    <div
                      key={r.role_id}
                      className={`p-2.5 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                        isChecked ? "border-primary bg-primary bg-opacity-10" : "bg-light"
                      }`}
                      onClick={() => isReguler && handleCheckboxChange(r.role_id)}
                      style={{ cursor: isReguler ? "pointer" : "not-allowed" }}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <Form.Check
                          type="checkbox"
                          id={`role-${r.role_id}`}
                          checked={isChecked}
                          onChange={() => handleCheckboxChange(r.role_id)}
                          disabled={!isReguler}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          htmlFor={`role-${r.role_id}`}
                          className="fw-semibold text-dark mb-0"
                          style={{ cursor: isReguler ? "pointer" : "not-allowed" }}
                        >
                          {r.role_name}
                        </label>
                      </div>
                      {r.description && (
                        <small className="text-muted ms-2">{r.description}</small>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer className="border-0 px-4 pb-4">
          <Button variant="light" onClick={onHide} disabled={submitting}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-4 fw-semibold"
            disabled={submitting || !isReguler}
          >
            {submitting ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                Menyimpan...
              </>
            ) : (
              "Simpan Role"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default React.memo(EditRoleModal);
