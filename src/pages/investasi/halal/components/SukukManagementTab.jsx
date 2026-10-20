import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../../../utils/api/common";
import SukukIssueModal from "./SukukIssueModal";

const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const SukukManagementTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const res = await api.get("/financing/sukuk/issue/all");
      if (res.data && res.data.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data manajemen investasi:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setShowModal(true);
  };

  const handleDelete = (issueId) => {
    Swal.fire({
      title: "Hapus Data Investasi?",
      text: "Data yang sudah dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/financing/sukuk/issue/${issueId}`);
          Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
          fetchIssues();
        } catch (err) {
          Swal.fire(
            "Gagal",
            err?.response?.data?.message ||
              "Terjadi kesalahan saat menghapus data.",
            "error"
          );
        }
      }
    });
  };

  return (
    <Card className="border-0 shadow-sm rounded-4 mt-3 bg-white">
      <Card.Body className="p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1 fw-bold text-dark">
              Manajemen Produk Investasi
            </h5>
            <p className="text-muted mb-0 small">
              Kelola penawaran sukuk dan produk investasi lainnya.
            </p>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              size="sm"
              className="rounded-pill px-3 shadow-sm border d-flex align-items-center gap-1"
              onClick={fetchIssues}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise" /> Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="rounded-pill px-3 shadow-sm d-flex align-items-center gap-1"
              onClick={handleAdd}
            >
              <i className="bi bi-plus-lg fw-bold" /> Tambah Produk
            </Button>
          </div>
        </div>

        <div className="table-responsive">
          <Table
            hover
            responsive
            className="align-middle border-0 shadow-sm"
            style={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <thead
              className="bg-light text-secondary text-uppercase"
              style={{ letterSpacing: "0.5px" }}
            >
              <tr>
                <th className="py-3 px-4 border-0">No</th>
                <th className="py-3 border-0">Nama Produk</th>
                <th className="py-3 text-end border-0">Target Pendanaan</th>
                <th className="py-3 text-center border-0">Tenor</th>
                <th className="py-3 text-center border-0">Kupon</th>
                <th className="py-3 text-center border-0">Status</th>
                <th className="py-3 text-center border-0">Aksi</th>
              </tr>
            </thead>
            <tbody className="border-top-0">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    <Spinner
                      animation="border"
                      variant="primary"
                      size="sm"
                      className="me-2"
                    />
                    <span className="text-muted">Memuat data produk...</span>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted">
                    <div className="d-flex flex-column align-items-center">
                      <div className="bg-light rounded-circle p-3 mb-3">
                        <i className="bi bi-box-seam fs-3 text-secondary" />
                      </div>
                      <h6 className="fw-semibold text-dark">Belum ada Data</h6>
                      <p className="mb-0 small">
                        Mulai tambahkan produk investasi baru.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                data.map((item, idx) => (
                  <tr key={item.issue_id} className="border-bottom">
                    <td className="px-4 text-muted">{idx + 1}</td>
                    <td>
                      <div className="d-flex flex-column">
                        <span className="fw-bold text-dark">
                          {item.issue_name}
                        </span>
                        <span className="text-muted">{item.type}</span>
                      </div>
                    </td>
                    <td className="fw-bold text-end text-primary">
                      {formatCurrency(item.total_amount)}
                    </td>
                    <td className="text-center">
                      <Badge bg="light" text="dark" className="px-2 py-1 border">
                        {item.tenor}
                      </Badge>
                    </td>
                    <td className="text-center text-success fw-bold">
                      {item.coupon}
                    </td>
                    <td className="text-center">
                      <Badge
                        pill
                        bg={
                          item.status === "OPEN"
                            ? "success"
                            : item.status === "CLOSED"
                            ? "secondary"
                            : "primary"
                        }
                        className="px-3 py-2"
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-center">
                      <div className="d-flex gap-2 justify-content-center">
                        <Button
                          variant="light"
                          size="sm"
                          className="text-primary rounded-circle shadow-sm border p-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => handleEdit(item)}
                        >
                          <i className="bi bi-pencil" />
                        </Button>
                        <Button
                          variant="light"
                          size="sm"
                          className="text-danger rounded-circle shadow-sm border p-2 d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                          onClick={() => handleDelete(item.issue_id)}
                        >
                          <i className="bi bi-trash" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>

        <SukukIssueModal
          show={showModal}
          onHide={() => setShowModal(false)}
          data={editData}
          onSuccess={fetchIssues}
        />
      </Card.Body>
    </Card>
  );
};

export default SukukManagementTab;
