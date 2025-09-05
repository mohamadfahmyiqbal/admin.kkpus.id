import { useEffect, useState, useCallback, useMemo } from "react";
import { Modal, Button, Row, Col, Image, Form, Spinner } from "react-bootstrap";
import UApproval from "../../utils/UApproval";
import ApprovalStatus from "./ApprovalStatus";
import moment from "moment";
import { showNotifikasi } from "../../pages/global/Notikasi";

function InfoRow({ label, value, children, xs = 6 }) {
  return (
    <Col xs={xs} className="mb-2">
      <div className="fw-bold mb-0">{label}</div>
      {children ? children : <div>{value ?? "-"}</div>}
    </Col>
  );
}

export default function ApprovalDetail({ show, onHide, data, user, feedBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  const getDetailRequest = useCallback(async () => {
    if (!data?.token && !data?.id) {
      setDetail(null);
      return;
    }
    setLoading(true);
    try {
      const res = await UApproval.getApprovalDetail({
        type: data?.type,
        nik: data?.requester_id,
      });
      setDetail(res?.data || null);
    } catch (error) {
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (show && (data?.token || data?.id)) {
      getDetailRequest();
    } else {
      setDetail(null);
    }
  }, [show, data, getDetailRequest]);

  const detailData = useMemo(() => detail || data, [detail, data]);

  if (!data) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton className="bg-topbar text-white">
          <Modal.Title>Detail Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body>Data tidak tersedia.</Modal.Body>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton className="bg-topbar text-white">
          <Modal.Title>Detail Approval</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <Spinner animation="border" className="me-2" />
          Memuat detail...
        </Modal.Body>
      </Modal>
    );
  }

  // 🔧 Mapping data sesuai struktur baru
  const anggota = detailData?.anggota || {};
  const requester = {
    ...anggota,
    ...anggota.detail,
    ktp: anggota?.ktpImg || anggota?.detail?.ktp,
    foto: anggota?.fotoImg || anggota?.detail?.foto,
  };
  const akun = {
    email: anggota?.email,
    roles: anggota?.roles,
    waktu_daftar: moment(anggota?.createdAt).format("YYYY-MM-DD HH:mm"),
    tipe_anggota: detailData?.tipe_anggota,
  };
  const job = Array.isArray(anggota?.job) ? anggota.job[0] : {};
  const bank = Array.isArray(anggota?.bank) ? anggota.bank[0] : {};
  const approval = detailData?.RequestApproval || [];

  // Cari data approval yang approver = user.nik
  const approvalUser = Array.isArray(approval)
    ? approval.find(
        (appr) =>
          (String(appr?.approver) === String(user?.nik) ||
            String(appr?.approverAnggota?.nik) === String(user?.nik)) &&
          appr.status !== "done"
      )
    : null;

  const handleClick = async (action) => {
    if (!user?.nik) {
      showNotifikasi("error", "User tidak valid.");
      return;
    }

    const approvalUser = Array.isArray(approval)
      ? approval.find(
          (appr) => String(appr?.approverAnggota?.nik) === String(user?.nik)
        )
      : null;

    if (!approvalUser?.id) {
      showNotifikasi("error", "Approval untuk user ini tidak ditemukan.");
      return;
    }

    if (action !== "approved" && action !== "rejected") {
      showNotifikasi("error", "Aksi tidak dikenali.");
      return;
    }

    setLoading(true);
    try {
      const res = await UApproval.manageApproval({
        btn: action,
        id: approvalUser.id,
      });
      feedBack(res);

      if (res?.status === 200) {
        showNotifikasi(
          "success",
          `Berhasil melakukan ${action === "approved" ? "Approve" : "Reject"}.`
        );
      } else {
        showNotifikasi("error", res?.data?.message || "Terjadi kesalahan.");
      }

      if (typeof getDetailRequest === "function") {
        await getDetailRequest();
      }
    } catch (error) {
      showNotifikasi("error", "Gagal melakukan aksi approval.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton className="bg-topbar text-white">
        <Modal.Title>Detail Approval</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflow: "auto", maxHeight: "70vh" }}>
        {/* Informasi Registrasi */}
        <Row className="mb-3">
          <Col xs={12} className="border-bottom fw-bold mb-2">
            Informasi Registrasi
          </Col>
          <InfoRow label="Nama" value={requester?.nama} />
          <InfoRow label="Jenis Kelamin" value={requester?.jenis_kelamin} />
          <Col xs={12} className="mb-2">
            <div className="fw-bold">Alamat</div>
            <div>{requester?.alamat || "-"}</div>
          </Col>
          <InfoRow label="Foto KTP">
            <Image
              src={requester?.ktp || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Foto KTP"
            />
          </InfoRow>
          <InfoRow label="Swafoto">
            <Image
              src={requester?.foto || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Swafoto"
            />
          </InfoRow>
        </Row>

        {/* Informasi Akun */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Akun
          </Col>
          <InfoRow label="Waktu Pendaftaran" value={akun?.waktu_daftar} />
          <InfoRow label="Tipe Anggota" value={akun?.tipe_anggota} />
          <InfoRow label="Role">
            <Form.Select value={akun?.roles || ""} disabled>
              <option value="">Pilih Role</option>
              <option value={1}>Calon Anggota</option>
              <option value={2}>Anggota Biasa</option>
              <option value={3}>Anggota Luar Biasa</option>
              <option value={4}>Admin</option>
            </Form.Select>
          </InfoRow>
          <InfoRow label="No Telepon" value={requester?.no_tlp} />
          <InfoRow
            label="No Telepon (Darurat)"
            value={requester?.tlp_darurat}
          />
          <InfoRow label="Hubungan" value={requester?.hubungan} />
          <InfoRow label="Email" value={akun?.email} />
        </Row>

        {/* Informasi Pekerjaan */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Pekerjaan
          </Col>
          <InfoRow label="Pekerjaan" value={job?.pekerjaan} />
          <InfoRow label="Tempat Kerja" value={job?.tempat_kerja} />
          <Col xs={12}>
            <div className="fw-bold">Alamat Tempat Kerja</div>
            <div>{job?.alamat_kerja || "-"}</div>
          </Col>
        </Row>

        {/* Informasi Bank */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Bank
          </Col>
          <InfoRow label="Nama Bank" value={bank?.bank} />
          <InfoRow label="No Rekening" value={bank?.no_rekening} />
          <InfoRow label="Nama Nasabah" value={bank?.nama_nasabah} />
        </Row>

        {/* Informasi Approval */}
        <Row>
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Approval
          </Col>
          <ApprovalStatus approvalList={approval} user={user} />
        </Row>
      </Modal.Body>
      {console.log(approvalUser)}
      <Modal.Footer>
        <Button
          className="bg-blue700 text-white"
          onClick={() => window.print()}
        >
          Print
        </Button>
        {approvalUser && (
          <>
            <Button variant="success" onClick={() => handleClick("approved")}>
              Approve
            </Button>
            <Button variant="danger" onClick={() => handleClick("rejected")}>
              Reject
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}
