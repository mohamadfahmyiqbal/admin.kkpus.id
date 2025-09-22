import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Col,
  Form,
  Image,
  Modal,
  Ratio,
  Row,
  Spinner,
} from "react-bootstrap";
import UApproval from "../../utils/UApproval";
import moment from "moment";
import { IconContext } from "react-icons";
import { FaCheckCircle, FaClock, FaTimesCircle } from "react-icons/fa";
import { showNotifikasi } from "../../pages/global/Notikasi";

export default function ApprovalDetail({ show, onHide, data, user, feedBack }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null); // 'approved' | 'rejected' | null

  const getDetailRequest = useCallback(async () => {
    if (!data?.type || !data?.requester_id) return;
    setLoading(true);
    try {
      const res = await UApproval.getApprovalDetail({
        type: data.type,
        nik: data.requester_id,
      });
      setDetail(res?.data || null);
    } catch (error) {
      console.error("Gagal mengambil detail approval:", error);
      setDetail(null);
    } finally {
      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (show) getDetailRequest();
  }, [show, getDetailRequest]);

  // 🔧 Memoized Data Mapping
  const requester = useMemo(() => {
    const anggota = detail?.anggota || {};
    return {
      ...anggota,
      ...anggota.detail,
      ktp: anggota?.ktpImg || anggota?.detail?.ktp,
      foto: anggota?.fotoImg || anggota?.detail?.foto,
    };
  }, [detail]);

  const akun = useMemo(
    () => ({
      email: detail?.anggota?.email,
      roles: detail?.anggota?.roles,
      waktu_daftar: moment(detail?.anggota?.createdAt).format(
        "YYYY-MM-DD HH:mm"
      ),
      tipe_anggota: detail?.tipe_anggota,
    }),
    [detail]
  );

  const job = useMemo(
    () => (Array.isArray(detail?.anggota?.job) ? detail.anggota.job[0] : {}),
    [detail]
  );

  const bank = useMemo(
    () => (Array.isArray(detail?.anggota?.bank) ? detail.anggota.bank[0] : {}),
    [detail]
  );

  const approval = detail?.RequestApproval || [];

  // 🔧 Helper Components
  function InfoRow({ label, value, children, xs = 6 }) {
    return (
      <Col xs={xs} className="mb-2">
        <div className="fw-bold mb-0">{label}</div>
        {children ?? <div>{value || "-"}</div>}
      </Col>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return { color: "secondary", icon: <FaClock /> };
      case "approved":
        return { color: "success", icon: <FaCheckCircle /> };
      case "rejected":
      default:
        return { color: "danger", icon: <FaTimesCircle /> };
    }
  };

  const handleClick = async (action) => {
    if (!["approved", "rejected"].includes(action)) {
      showNotifikasi("error", "Aksi tidak dikenali.");
      return;
    }

    setActionLoading(action);
    try {
      const res = await UApproval.manageApproval({
        btn: action,
        token: detail.token,
      });
      showNotifikasi("success", `Berhasil ${action}`);
      getDetailRequest(); // refresh data setelah aksi
      feedBack(res);
    } catch (error) {
      console.error(error);
      showNotifikasi("error", "Gagal memproses approval.");
    } finally {
      setActionLoading(null);
    }
  };

  const renderApprovalButtons = (app) => {
    if (app.approver !== user.nik) return null;

    // cek apakah flow 1 masih pending
    const flow1Pending = approval.some(
      (a) => a.flow === 1 && a.status === "pending"
    );

    // hanya tampilkan tombol jika:
    // - status app ini pending
    // - dan (flow = 1) atau (flow = 2 tapi flow 1 sudah bukan pending)
    if (
      app.status === "pending" &&
      (app.flow === 1 || (app.flow === 2 && !flow1Pending))
    ) {
      return (
        <>
          <Button
            variant="success me-2"
            disabled={actionLoading !== null}
            onClick={() => handleClick("approved")}
          >
            {actionLoading === "approved" ? (
              <>
                <Spinner size="sm" animation="border" /> Menyimpan...
              </>
            ) : (
              "Approve"
            )}
          </Button>
          <Button
            variant="danger"
            disabled={actionLoading !== null}
            onClick={() => handleClick("rejected")}
          >
            {actionLoading === "rejected" ? (
              <>
                <Spinner size="sm" animation="border" /> Menyimpan...
              </>
            ) : (
              "Reject"
            )}
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <Modal show={show} onHide={onHide} centered size="xl">
      <Modal.Header closeButton className="bg-topbar text-white">
        <Modal.Title>Detail Approval</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ overflow: "auto", maxHeight: "70vh" }}>
        {loading ? (
          <Row className="justify-content-center my-3">
            <Col xs="auto" className="text-center">
              <Spinner animation="border" role="status" />
              <div className="mt-2 small text-muted">
                Sedang mengambil data...
              </div>
            </Col>
          </Row>
        ) : detail ? (
          <>
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
              <Row className="g-3">
                {approval.map((app, idx) => {
                  const { color, icon } = getStatusConfig(app?.status);
                  return (
                    <Col xs={6} key={idx} className="text-center">
                      <Ratio
                        aspectRatio="1x1"
                        style={{ width: 70 }}
                        className="mx-auto"
                      >
                        <div
                          className={`rounded-circle bg-${color} shadow-sm d-flex align-items-center justify-content-center text-white`}
                        >
                          <IconContext.Provider value={{ size: "1.6em" }}>
                            {icon}
                          </IconContext.Provider>
                        </div>
                      </Ratio>
                      <div className="mt-2 small fw-semibold">
                        {app?.status}
                      </div>
                      <div className="mt-2 small fw-semibold">
                        {app?.approverAnggota?.categoryAnggota?.nama}
                      </div>
                      <div className="mt-2 small fw-semibold">
                        {app?.approverAnggota?.nama}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Row>
          </>
        ) : (
          <Row className="text-center my-3">
            <Col>Data tidak ditemukan</Col>
          </Row>
        )}
      </Modal.Body>

      <Modal.Footer>
        {approval.map((app, idx) => (
          <div key={idx}>{renderApprovalButtons(app)}</div>
        ))}
      </Modal.Footer>
    </Modal>
  );
}
