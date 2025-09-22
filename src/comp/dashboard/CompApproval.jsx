import { useCallback, useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Spinner,
  Button,
  Form,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import UApproval from "../../utils/UApproval";
import { showNotifikasi } from "../../pages/global/Notikasi";
import { FaEye } from "react-icons/fa";
import ApprovalDetail from "../approval/ApprovalDetail";

export default function CompApproval({ user }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const isMounted = useRef(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // state pencarian & pagination
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleClick = (row) => {
    setSelectedRow(row);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRow(null);
  };

  const getApproval = useCallback(async () => {
    if (!user?.nik) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      const res = await UApproval.getApprovalRequestByNik({ nik: user.nik });
      if (isMounted.current) {
        setData(Array.isArray(res?.data?.data) ? res.data.data : []);
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

  const renderRequester = (requester) => {
    if (!requester) return "-";
    if (typeof requester === "string") return requester;
    if (typeof requester === "object" && requester !== null) {
      return requester.nama || requester.nik || requester.email || "-";
    }
    return "-";
  };

  const handleFeedback = async () => {
    getApproval();
  };

  // filter data berdasarkan search
  const filteredData = data.filter((row) => {
    const text = search.toLowerCase();
    return (
      row?.type?.toLowerCase().includes(text) ||
      row?.status?.toLowerCase().includes(text) ||
      renderRequester(row.requesterAnggota)?.toLowerCase().includes(text) ||
      renderRequester(row.approverAnggota)?.toLowerCase().includes(text)
    );
  });

  // pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <>
      <Card className="shadow mb-4 h-100">
        <CardHeader className="bg-topbar text-white">
          <CardTitle as="h5" className="mb-0">
            Approval
          </CardTitle>
        </CardHeader>
        <CardBody style={{ minHeight: "350px" }}>
          {/* Input Pencarian */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Cari approval..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); // reset halaman saat search
                }}
              />
            </Col>
          </Row>

          <Table striped bordered hover responsive className="mb-0">
            <thead>
              <tr>
                <th>Action</th>
                <th>No</th>
                <th>Waktu</th>
                <th>Deskripsi</th>
                <th>Requester</th>
                <th>Approver</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    <Spinner animation="border" size="sm" className="me-2" />
                    Memuat data...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center">
                    Tidak ada data approval.
                  </td>
                </tr>
              ) : (
                currentData.map((row, idx) => (
                  <tr key={row.no ?? idx}>
                    <td>
                      <Button
                        className="bt-blue700 text-white"
                        onClick={() => handleClick(row)}
                      >
                        <FaEye />
                      </Button>
                    </td>
                    <td>{startIndex + idx + 1}</td>
                    <td>
                      {row.created_at
                        ? new Date(row.created_at).toLocaleString("id-ID")
                        : "-"}
                    </td>
                    <td>{row.type || "-"}</td>
                    <td>{renderRequester(row.requesterAnggota)}</td>
                    <td>{renderRequester(row.approverAnggota)}</td>
                    <td>
                      {row.status === "approved" && (
                        <span className="badge bg-success">Disetujui</span>
                      )}
                      {row.status === "rejected" && (
                        <span className="badge bg-danger">Ditolak</span>
                      )}
                      {row.status === "pending" && (
                        <span className="badge bg-warning text-white">
                          Pending
                          {row.flow === 1 && row.approverAnggota?.nama
                            ? ` - ${row.approverAnggota.nama}`
                            : ""}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-3 d-flex justify-content-center">
              <Pagination>
                <Pagination.First
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                />
                <Pagination.Prev
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i + 1}
                    active={i + 1 === currentPage}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
                <Pagination.Last
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                />
              </Pagination>
            </div>
          )}
        </CardBody>
      </Card>

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
