import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../utils/api/common";

const AkadConfigPage = () => {
  const [products, setProducts] = useState([]);
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConfigs = async () => {
    try {
      const [prodRes, featRes] = await Promise.all([
        api.get("/simpanan/products"),
        api.get("/simpanan/features"),
      ]);
      if (prodRes.data?.status) setProducts(prodRes.data.data);
      if (featRes.data?.status) setFeatures(featRes.data.data);
    } catch (err) {
      console.error("Gagal mengambil data produk simpanan atau fitur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const handleProductAkadChange = (productId, akad) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.savings_product_id === productId ? { ...item, akad } : item
      )
    );
  };

  const handleSaveProductAkad = async (productId, akad) => {
    if (!akad) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih akad terlebih dahulu",
      });
      return;
    }
    try {
      const res = await api.put(`/simpanan/products/${productId}/akad`, {
        akad_type: akad,
      });
      if (res.data?.status) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Akad berhasil disimpan",
        });
        fetchConfigs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal menyimpan akad",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan",
      });
    }
  };

  const handleFeatureAkadChange = (featureId, akad) => {
    setFeatures((prev) =>
      prev.map((item) =>
        item.id === featureId ? { ...item, akad_type: akad } : item
      )
    );
  };

  const handleSaveFeatureAkad = async (featureId, akad) => {
    if (!akad) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Silakan pilih akad terlebih dahulu",
      });
      return;
    }
    try {
      const res = await api.put(`/simpanan/features/${featureId}/akad`, {
        akad_type: akad,
      });
      if (res.data?.status) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Akad fitur berhasil disimpan",
        });
        fetchConfigs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal menyimpan akad fitur",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Terjadi kesalahan saat menyimpan akad fitur",
      });
    }
  };

  const akadOptions = [
    "Wadiah",
    "Mudharabah",
    "Musyarakah",
    "Murabahah",
    "Qardh",
    "Wakalah",
  ];

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 py-5">
        <h5 className="mb-4 fw-bold">Konfigurasi Akad</h5>
        <div className="table-responsive text-start">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Menu</th>
                <th>Sub Menu / Fitur</th>
                <th>Konfigurasi Akad</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Memuat data...
                  </td>
                </tr>
              ) : (
                <>
                  {products.map((item, index) => (
                    <tr key={item.savings_product_id}>
                      <td>{index + 1}</td>
                      <td>Simpanan</td>
                      <td>{item.product_name}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={item.akad || ""}
                          onChange={(e) =>
                            handleProductAkadChange(
                              item.savings_product_id,
                              e.target.value
                            )
                          }
                        >
                          <option value="" disabled>
                            Pilih Akad...
                          </option>
                          {akadOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            handleSaveProductAkad(
                              item.savings_product_id,
                              item.akad
                            )
                          }
                        >
                          Simpan
                        </button>
                      </td>
                    </tr>
                  ))}
                  {features.map((item, index) => (
                    <tr key={item.id}>
                      <td>{products.length + index + 1}</td>
                      <td>{item.menu}</td>
                      <td>{item.submenu}</td>
                      <td>
                        <select
                          className="form-select form-select-sm"
                          value={item.akad_type || ""}
                          onChange={(e) =>
                            handleFeatureAkadChange(item.id, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Pilih Akad...
                          </option>
                          {akadOptions.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() =>
                            handleSaveFeatureAkad(item.id, item.akad_type)
                          }
                        >
                          Simpan
                        </button>
                      </td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AkadConfigPage;
