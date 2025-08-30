import { useCallback, useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Spinner,
  Button,
} from "react-bootstrap";
import UApproval from "../../utils/UApproval";
import { showNotifikasi } from "../../pages/global/Notikasi";
import { FaEye } from "react-icons/fa";
import ApprovalDetail from "../approval/ApprovalDetail";

// Komponen menerima props user dari parent (DashboardScreen)
export default function CompApproval({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  // State untuk modal
  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Fungsi handleClick untuk menampilkan modal detail
  const handleClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  // Optimasi: gunakan useCallback dengan dependensi user?.nik
  const getApproval = useCallback(async () => {
    if (!user?.nik) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      // Asumsi response dari API adalah { data: [...] }
      const res = await UApproval.getApprovalRequestByNik({ nik: user.nik });
      if (isMounted.current) {
        setData(Array.isArray(res?.data?.data) ? res.data.data : []);
        // showNotifikasi("success", "Berhasil mengambil approval");
      }
    } catch (error) {
      console.error("Gagal mengambil approval:", error);
      if (isMounted.current) {
        setData([]);
        showNotifikasi("error", "Gagal mengambil approval");
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [user?.nik]);

  useEffect(() => {
    isMounted.current = true;
    getApproval();
    return () => {
      isMounted.current = false;
    };
  }, [getApproval]);

  // Fungsi untuk menampilkan nama requester jika requester adalah objek
  const renderRequester = (requester) => {
    if (!requester) return "-";
    if (typeof requester === "string") return requester;
    if (typeof requester === "object" && requester !== null) {
      // Coba ambil nama, jika tidak ada fallback ke nik/email
      return requester.nama || requester.nik || requester.email || "-";
    }
    return "-";
  };

  const handleFeedback = async () => {
    getApproval();
  };
  return (
    <>
      <Card className="shadow mb-4">
        <CardHeader className="bg-topbar text-white">
          <CardTitle as="h5" className="mb-0">
            Approval
          </CardTitle>
        </CardHeader>
        <CardBody>
          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Action</th>
                <th>No</th>
                <th>Waktu</th>
                <th>Deskripsi</th>
                <th>Requester</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center">
                    Tidak ada data approval.
                  </td>
                </tr>
              ) : (
                data.map((row, idx) => (
                  <tr key={row.no ?? idx}>
                    <td>
                      <Button
                        className="bt-blue700 text-white"
                        onClick={() => handleClick(row)}
                      >
                        <FaEye />
                      </Button>
                    </td>
                    <td>{row.no ?? idx + 1}</td>
                    <td>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>{row.type || "-"}</td>
                    <td>{renderRequester(row.requester)}</td>
                    <td>
                      <span
                        className={
                          row.status === "approved"
                            ? "badge bg-success"
                            : row.status === "rejected"
                            ? "badge bg-danger"
                            : row.status === "pending"
                            ? "badge bg-secondary"
                            : "badge bg-secondary"
                        }
                      >
                        {row.status || "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      {/* Modal Detail Approval dipindahkan ke ApprovalDetail */}
      <ApprovalDetail
        show={showModal}
        onHide={handleCloseModal}
        data={selectedRow}
        renderRequester={renderRequester}
        user={user}
        feedBack={handleFeedback}
      />
    </>
  );
}
