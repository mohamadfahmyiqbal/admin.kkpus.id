import { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Table,
  Spinner,
  Form,
  Pagination,
  Row,
  Col,
} from "react-bootstrap";
import UNotif from "../../utils/UNotif";
import { showNotifikasi } from "../../pages/global/Notikasi";

export default function CompNotif() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // state pencarian
  const [search, setSearch] = useState("");

  // state pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // jumlah baris per halaman

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const res = await UNotif.getNotification();
        setData(res?.data?.data || []);
        setError(null);
      } catch (err) {
        console.error("Gagal mengambil notifikasi:", err);
        setData([]);
        setError("Gagal mengambil notifikasi");
        showNotifikasi("error", "Gagal mengambil notifikasi");
      } finally {
        setLoading(false);
      }
    };

    fetchNotif();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      return new Intl.DateTimeFormat("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(dateStr));
    } catch {
      return dateStr;
    }
  };

  // filter data berdasarkan pencarian
  const filteredData = data.filter(
    (row) =>
      row?.body?.toLowerCase().includes(search.toLowerCase()) ||
      row?.created_at?.toLowerCase().includes(search.toLowerCase())
  );

  // hitung data untuk pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Card className="shadow mb-4 h-100">
      <CardHeader className="bg-topbar text-white">
        <CardTitle as="h5" className="mb-0">
          Notifikasi
        </CardTitle>
      </CardHeader>
      <CardBody>
        {/* Input Pencarian */}
        <Row className="mb-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Cari notifikasi..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset ke halaman 1 setelah cari
              }}
            />
          </Col>
        </Row>

        <Table striped bordered hover responsive className="mb-0">
          <thead>
            <tr>
              <th>No</th>
              <th>Tanggal</th>
              <th>Pesan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} className="text-center">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Memuat data...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={3} className="text-center text-danger">
                  {error}
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center">
                  Tidak ada notifikasi.
                </td>
              </tr>
            ) : (
              currentData.map((row, index) => (
                <tr key={row.id || index}>
                  <td>{startIndex + index + 1}</td>
                  <td>{formatDate(row.created_at)}</td>
                  <td>{row.body || "-"}</td>
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
  );
}
