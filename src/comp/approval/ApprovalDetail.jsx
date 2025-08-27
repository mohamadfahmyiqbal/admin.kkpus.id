import { useEffect, useState, useCallback } from "react";
import { Modal, Button, Row, Col, Image, Form, Spinner } from "react-bootstrap";
import UApproval from "../../utils/UApproval";

// Komponen InfoRow untuk menampilkan label dan value/children
function InfoRow({ label, value, children, xs = 6 }) {
  return (
    <Col xs={xs} className="mb-2">
      <div className="fw-bold mb-0">{label}</div>
      {children ? children : <div>{value ?? "-"}</div>}
    </Col>
  );
}

export default function ApprovalDetail({ show, onHide, data }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil detail approval jika data berubah dan ada id/token
  const getDetailRequest = useCallback(async () => {
    if (!data?.token && !data?.id) {
      setDetail(null);
      return;
    }
    setLoading(true);
    try {
      // Gunakan token atau id untuk ambil detail
      const res = await UApproval.getApprovalDetail({
        type: data.type,
        nik: data.requester.nik,
      });

      setDetail(res?.data || null);
    } catch (error) {
      setDetail(null);
      // Bisa tambahkan notifikasi error di sini jika perlu
      // showNotifikasi("error", "Gagal mengambil detail approval");
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
    // eslint-disable-next-line
  }, [show, data, getDetailRequest]);

  console.log(detail);

  // Jika tidak ada data sama sekali
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

  // Loading spinner saat ambil detail
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

  // Gunakan detail jika ada, fallback ke data (untuk backward compatibility)
  const detailData = detail || data;
  const requester = detailData?.requester || {};
  const transaksi = detailData?.transaksi || {};
  const akun = detailData?.akun || {};
  const job = detailData?.job || {};
  const bank = detailData?.bank || {};
  const approval = detailData?.approval || {};

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton className="bg-topbar text-white">
        <Modal.Title>Detail Approval</Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          overflow: "auto",
          maxHeight: "70vh",
        }}
      >
        {/* Informasi Registrasi */}
        <Row className="mb-3">
          <Col xs={12} className="border-bottom fw-bold mb-2">
            Informasi Registrasi
          </Col>
          <InfoRow label="Nama" value={requester.nama} />
          <InfoRow label="Jenis Kelamin" value={requester.jenis_kelamin} />
          <Col xs={12} className="mb-2">
            <div className="fw-bold">Alamat</div>
            <div>{requester.alamat || "-"}</div>
          </Col>
          <InfoRow label="Foto KTP">
            <Image
              src={requester.fotoKtp || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Foto KTP"
            />
          </InfoRow>
          <InfoRow label="Swafoto">
            <Image
              src={requester.swafoto || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Swafoto"
            />
          </InfoRow>
        </Row>

        {/* Informasi Transaksi */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Transaksi
          </Col>
          <InfoRow label="Tanggal" value={transaksi.tgl_daftar} />
          <InfoRow label="Transaksi" value={transaksi.transaksi} />
          <InfoRow label="Invoice Simpanan Pokok">
            <Image
              src={transaksi.invoicePokok || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Invoice Simpanan Pokok"
            />
          </InfoRow>
          <InfoRow label="Invoice Simpanan Wajib">
            <Image
              src={transaksi.invoiceWajib || "https://placehold.co/479x250"}
              fluid
              rounded
              alt="Invoice Simpanan Wajib"
            />
          </InfoRow>
        </Row>

        {/* Informasi Akun */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Akun
          </Col>
          <InfoRow label="Waktu Pendaftaran" value={akun.waktu_daftar} />
          <InfoRow label="Tipe Anggota" value={akun.tipe_anggota} />
          <InfoRow label="Role">
            <Form.Select value={akun.roles || ""} disabled>
              <option value="">Pilih Role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="member">Member</option>
            </Form.Select>
          </InfoRow>
          <InfoRow label="No Telepon" value={akun.no_tlp} />
          <InfoRow label="No Telepon (Darurat)" value={akun.telepon_darurat} />
          <InfoRow label="Hubungan" value={akun.hubungan} />
          <InfoRow label="Email" value={akun.email} />
        </Row>

        {/* Informasi Pekerjaan */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Pekerjaan
          </Col>
          <InfoRow label="Pekerjaan" value={job.pekerjaan} />
          <InfoRow label="Tempat Kerja" value={job.tempat_kerja} />
          <Col xs={12}>
            <div className="fw-bold">Alamat Tempat Kerja</div>
            <div>{job.alamat_kerja || "-"}</div>
          </Col>
        </Row>

        {/* Informasi Bank */}
        <Row className="mb-3">
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Bank
          </Col>
          <InfoRow label="Nama Bank" value={bank.bank} />
          <InfoRow label="No Rekening" value={bank.no_rekening} />
          <InfoRow label="Nama Nasabah" value={bank.nama_nasabah} />
        </Row>

        {/* Informasi Approval */}
        <Row>
          <Col xs={12} className="border-top border-bottom fw-bold mb-2">
            Informasi Approval
          </Col>
          <InfoRow label="Pengawas" value={approval.approvalPengawas} />
          <InfoRow label="Ketua" value={approval.approvalKetua} />
          <InfoRow label="Bendahara" value={approval.approvalBendahara} />
        </Row>
      </Modal.Body>

      <Modal.Footer>
        <Button
          className="bg-blue700 text-white"
          onClick={() => window.print()}
        >
          Print
        </Button>
        <Button variant="success" onClick={onHide}>
          Approve
        </Button>
        <Button variant="danger" onClick={onHide}>
          Reject
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
