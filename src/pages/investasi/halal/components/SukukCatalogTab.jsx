import React, { useState, useEffect } from "react";
import { Card, Table, Button, Badge, Form, Spinner } from "react-bootstrap";
import { Eye, Users, SmileyMeh } from "phosphor-react";
import api from "../../../../utils/api/common";
import DetailSukukModal from "./DetailSukukModal";
import SukukInvestorsModal from "./SukukInvestorsModal";

const formatCurrency = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

const SukukCatalogTab = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [showInvestors, setShowInvestors] = useState(false);
  const [selectedSukuk, setSelectedSukuk] = useState(null);
  const [filters, setFilters] = useState({
    type: "",
    issue_name: "",
    issuer: "",
    min_investment: "",
    total_amount: "",
    tenor: "",
    coupon: "",
    price: "",
    status: "",
  });

  const handleFilterChange = (e, field) => {
    setFilters((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const filteredData = data.filter(
    (item) =>
      (item.type || "").toLowerCase().includes(filters.type.toLowerCase()) &&
      (item.issue_name || "")
        .toLowerCase()
        .includes(filters.issue_name.toLowerCase()) &&
      (item.issuer || "")
        .toLowerCase()
        .includes(filters.issuer.toLowerCase()) &&
      String(item.min_investment || "")
        .toLowerCase()
        .includes(filters.min_investment.toLowerCase()) &&
      String(item.total_amount || "")
        .toLowerCase()
        .includes(filters.total_amount.toLowerCase()) &&
      String(item.tenor || "")
        .toLowerCase()
        .includes(filters.tenor.toLowerCase()) &&
      (item.coupon || "")
        .toLowerCase()
        .includes(filters.coupon.toLowerCase()) &&
      String(item.price || "")
        .toLowerCase()
        .includes(filters.price.toLowerCase()) &&
      (item.status || "").toLowerCase().includes(filters.status.toLowerCase())
  );

  const fetchCatalog = async () => {
    setLoading(true);
    try {
      const res = await api.get("/financing/sukuk/catalog");
      if (res.data && res.data.data) {
        setData(res.data.data);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error("Gagal mengambil data investasi:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog();
  }, []);

  return (
    <>
      <Card className="border-0 shadow-sm rounded-4 mt-3 bg-white">
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h5 className="mb-1 fw-bold text-dark">
                Katalog Produk Investasi
              </h5>
              <p className="text-muted mb-0 small">
                Daftar produk sukuk yang tersedia untuk anggota koperasi.
              </p>
            </div>
            <Button
              variant="light"
              size="sm"
              className="rounded-pill px-3 shadow-sm border"
              onClick={fetchCatalog}
              disabled={loading}
            >
              <i className="bi bi-arrow-clockwise me-1" /> Refresh
            </Button>
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
                  <th className="py-3 px-4 border-0">Aksi</th>
                  <th className="py-3 border-0">Jenis</th>
                  <th className="py-3 border-0">Nama</th>
                  <th className="py-3 border-0">Penerbit</th>
                  <th className="py-3 text-end border-0">Nilai Pendanaan</th>
                  <th className="py-3 text-end border-0">Target Pendanaan</th>
                  <th className="py-3 text-center border-0">Tenor</th>
                  <th className="py-3 text-center border-0">Proyeksi</th>
                  <th className="py-3 text-center border-0">Harga Sukuk</th>
                  <th className="py-3 text-center border-0">Status</th>
                </tr>
                <tr>
                  <th className="py-2 px-2 border-0 bg-light" />
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.type}
                      onChange={(e) => handleFilterChange(e, "type")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.issue_name}
                      onChange={(e) => handleFilterChange(e, "issue_name")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.issuer}
                      onChange={(e) => handleFilterChange(e, "issuer")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.min_investment}
                      onChange={(e) => handleFilterChange(e, "min_investment")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.total_amount}
                      onChange={(e) => handleFilterChange(e, "total_amount")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.tenor}
                      onChange={(e) => handleFilterChange(e, "tenor")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.coupon}
                      onChange={(e) => handleFilterChange(e, "coupon")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.price}
                      onChange={(e) => handleFilterChange(e, "price")}
                    />
                  </th>
                  <th className="py-2 px-1 border-0 bg-light">
                    <Form.Control
                      size="sm"
                      placeholder="Cari..."
                      value={filters.status}
                      onChange={(e) => handleFilterChange(e, "status")}
                    />
                  </th>
                </tr>
              </thead>
              <tbody className="border-top-0">
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5">
                      <Spinner
                        animation="border"
                        variant="primary"
                        size="sm"
                        className="me-2"
                      />
                      <span className="text-muted">
                        Memuat katalog investasi...
                      </span>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-light rounded-circle p-3 mb-3">
                          <SmileyMeh size={32} className="text-secondary" />
                        </div>
                        <h6 className="fw-semibold text-dark">Katalog Kosong</h6>
                        <p className="mb-0 small">
                          Belum ada penawaran produk investasi saat ini.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-5 text-muted">
                      <div className="d-flex flex-column align-items-center">
                        <div className="bg-light rounded-circle p-3 mb-3">
                          <SmileyMeh size={32} className="text-secondary" />
                        </div>
                        <h6 className="fw-semibold text-dark">
                          Data Tidak Ditemukan
                        </h6>
                        <p className="mb-0 small">
                          Belum ada penawaran produk investasi yang sesuai
                          pencarian.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item) => (
                    <tr key={item.issue_id} className="border-bottom">
                      <td className="text-center px-4">
                        <div className="d-flex gap-2 justify-content-center">
                          <Button
                            variant="primary"
                            size="sm"
                            className="rounded-circle shadow-sm"
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            title="Lihat Detail Sukuk"
                            onClick={() => {
                              setSelectedSukuk(item);
                              setShowDetail(true);
                            }}
                          >
                            <Eye size={18} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="rounded-circle shadow-sm"
                            style={{ width: "32px", height: "32px", padding: 0 }}
                            title="Lihat Anggota"
                            onClick={() => {
                              setSelectedSukuk(item);
                              setShowInvestors(true);
                            }}
                          >
                            <Users size={18} />
                          </Button>
                        </div>
                      </td>
                      <td className="text-muted text-nowrap">{item.type}</td>
                      <td className="fw-bold text-dark text-nowrap">
                        {item.issue_name}
                      </td>
                      <td className="text-muted text-nowrap">{item.issuer}</td>
                      <td className="fw-bold text-end text-dark">
                        {formatCurrency(item.min_investment)}
                      </td>
                      <td className="fw-bold text-end text-primary">
                        {formatCurrency(item.total_amount)}
                      </td>
                      <td className="text-center">
                        <Badge bg="light" text="dark" className="px-2 py-1 border">
                          {item.tenor || "-"}
                        </Badge>
                      </td>
                      <td className="text-center text-success fw-bold text-nowrap">
                        {item.coupon}
                      </td>
                      <td className="fw-bold text-end text-dark">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="text-center">
                        <Badge
                          pill
                          bg={item.status === "OPEN" ? "success" : "secondary"}
                          className="px-3 py-2"
                        >
                          {item.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      <DetailSukukModal
        show={showDetail}
        onHide={() => setShowDetail(false)}
        transaction={selectedSukuk}
      />
      <SukukInvestorsModal
        show={showInvestors}
        onHide={() => setShowInvestors(false)}
        transaction={selectedSukuk}
      />
    </>
  );
};

export default SukukCatalogTab;
