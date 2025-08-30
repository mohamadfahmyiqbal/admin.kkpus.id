import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Spinner,
  Button,
  Modal,
  Row,
  Col,
  Pagination,
  Form,
} from "react-bootstrap";
import UAnggota from "../../utils/UAnggota";
import { showNotifikasi } from "../../pages/global/Notikasi";

/* =====================
   Modal Detail Anggota
===================== */
function DetailAnggotaModal({ show, onHide, anggota }) {
  if (!anggota) return null;

  const detailFields = [
    { label: "Nama", value: anggota?.nama },
    { label: "Email", value: anggota?.email },
    { label: "No Tlp", value: anggota?.no_tlp },
    { label: "Status", value: anggota?.status },
    { label: "Role", value: anggota?.role },
  ];

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Detail Anggota</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detailFields.map(({ label, value }, idx) => (
          <Row key={idx} className="mb-2">
            <Col xs={5} className="fw-bold">
              {label}
            </Col>
            <Col xs={7}>{value ?? "-"}</Col>
          </Row>
        ))}
      </Modal.Body>
    </Modal>
  );
}

/* =====================
   Pagination
===================== */
function PaginationAnggota({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  return (
    <Pagination className="justify-content-center mt-3">
      <Pagination.First
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Pagination.Item
          key={page}
          active={page === currentPage}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      />
      <Pagination.Last
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      />
    </Pagination>
  );
}

/* =====================
   Komponen Utama
===================== */
export default function TAnggota() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnggota, setSelectedAnggota] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [globalSearch, setGlobalSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState({
    nik: "",
    email: "",
    nama: "",
    no_tlp: "",
    status: "",
    role: "",
  });

  const itemsPerPage = 10;

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await UAnggota.anggotaList();
      setData(Array.isArray(res?.data) ? res.data : []);
    } catch (error) {
      console.error(error);
      setData([]);
      showNotifikasi("error", "Terjadi kesalahan saat mengambil data anggota");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getData();
  }, [getData]);

  // helper aman ke string lower
  const toLowerStr = (v) => (v ?? "").toString().toLowerCase();

  /* =====================
     Filtering
  ====================== */
  const filteredData = useMemo(() => {
    const keyword = toLowerStr(globalSearch).trim();

    return data.filter((row) => {
      // filter global
      const matchGlobal =
        !keyword ||
        [row.nik, row.email, row.nama, row.no_tlp, row.status, row.role].some(
          (field) => toLowerStr(field).includes(keyword)
        );

      // filter per kolom
      const matchColumns = Object.entries(columnFilters).every(
        ([key, value]) => {
          return !value || toLowerStr(row[key]).includes(toLowerStr(value));
        }
      );

      return matchGlobal && matchColumns;
    });
  }, [data, globalSearch, columnFilters]);

  /* =====================
     Sorting
  ====================== */
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    const { key, direction } = sortConfig;
    const mul = direction === "asc" ? 1 : -1;

    return [...filteredData].sort((a, b) => {
      const aValue = (a?.[key] ?? "").toString();
      const bValue = (b?.[key] ?? "").toString();
      return (
        aValue.localeCompare(bValue, undefined, {
          numeric: true,
          sensitivity: "base",
        }) * mul
      );
    });
  }, [filteredData, sortConfig]);

  /* =====================
     Pagination
  ====================== */
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const renderSortIcon = (key) =>
    sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? " ▲"
        : " ▼"
      : null;

  return (
    <Card>
      <CardHeader className="bg-topbar text-white">Daftar Anggota</CardHeader>
      <CardBody>
        {/* Global Search */}
        <Row className="mb-3">
          <Col md={4} className="ms-auto">
            <Form.Control
              size="sm"
              type="text"
              placeholder="Cari semua kolom..."
              value={globalSearch}
              onChange={(e) => {
                setCurrentPage(1);
                setGlobalSearch(e.target.value);
              }}
            />
          </Col>
        </Row>

        {/* Tabel */}
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
            <div>Memuat data...</div>
          </div>
        ) : sortedData.length === 0 ? (
          <div className="text-center text-muted my-4">
            Data anggota tidak tersedia.
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Aksi</th>
                    <th>No</th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("nik")}
                    >
                      No Induk Anggota{renderSortIcon("nik")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("email")}
                    >
                      Email{renderSortIcon("email")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("nama")}
                    >
                      Nama{renderSortIcon("nama")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("no_tlp")}
                    >
                      No Tlp{renderSortIcon("no_tlp")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("status")}
                    >
                      Status{renderSortIcon("status")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("role")}
                    >
                      Role{renderSortIcon("role")}
                    </th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    {Object.keys(columnFilters).map((col) => (
                      <th key={col}>
                        <Form.Control
                          size="sm"
                          type="text"
                          placeholder={`Cari ${col}`}
                          value={columnFilters[col]}
                          onChange={(e) => {
                            setCurrentPage(1);
                            setColumnFilters((prev) => ({
                              ...prev,
                              [col]: e.target.value,
                            }));
                          }}
                        />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((anggota, idx) => (
                    <tr key={anggota?.id || idx}>
                      <td>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            setSelectedAnggota(anggota);
                            setShowDetail(true);
                          }}
                          title="Lihat Detail"
                        >
                          <i className="fa fa-eye"></i>
                        </Button>
                      </td>
                      <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td>{anggota?.nik ?? "-"}</td>
                      <td>{anggota?.email ?? "-"}</td>
                      <td>{anggota?.nama ?? "-"}</td>
                      <td>{anggota?.no_tlp ?? "-"}</td>
                      <td>{anggota?.status_anggota ?? "-"}</td>
                      <td>{anggota?.roles ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <PaginationAnggota
              totalItems={sortedData.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        )}

        {/* Modal Detail */}
        <DetailAnggotaModal
          show={showDetail}
          onHide={() => setShowDetail(false)}
          anggota={selectedAnggota}
        />
      </CardBody>
    </Card>
  );
}
