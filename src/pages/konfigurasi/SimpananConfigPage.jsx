import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../utils/api/common";

const SimpananConfigPage = () => {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [originalConfigs, setOriginalConfigs] = useState([]);

  const fetchConfigs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/simpanan/config");
      if (res.data?.success) {
        const data = res.data.data;
        setConfigs(data);
        // Simpan snapshot asli untuk deteksi perubahan
        setOriginalConfigs(JSON.parse(JSON.stringify(data)));
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal memuat konfigurasi simpanan",
        });
      }
    } catch (err) {
      /* console.error: "Gagal mengambil data konfigurasi simpanan:", err */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfigs();
  }, []);

  const formatInputRupiah = (val) => {
    if (!val) return "";
    const clean = val.toString().replace(/[^,\d]/g, "").split(",");
    const mod = clean[0].length % 3;
    let head = clean[0].substr(0, mod);
    const body = clean[0].substr(mod).match(/\d{3}/gi);
    if (body) {
      head += (mod ? "." : "") + body.join(".");
    }
    const dec = clean[1] !== undefined ? "," + clean[1] : "";
    return `Rp ` + head + dec;
  };

  const handleAmountChange = (billTypeId, rawVal) => {
    const numeric = rawVal.replace(/[^0-9]/g, "");
    setConfigs((prev) =>
      prev.map((item) =>
        item.bill_type_id === billTypeId
          ? { ...item, default_amount: numeric }
          : item
      )
    );
  };

  const handleSave = async (billTypeId, amount, effectiveDate = "") => {
    if (!amount || amount < 0) {
      Swal.fire({
        icon: "warning",
        title: "Peringatan",
        text: "Nominal tidak valid",
      });
      return;
    }
    try {
      // Ambil data existing untuk billTypeId
      const existingItems = configs.filter(item => item.bill_type_id === billTypeId);
      const existing = existingItems[0];
      const newItem = {
        bill_type_id: billTypeId,
        type_name: existing ? existing.type_name : "Tidak diketahui",
        type_code: existing ? existing.type_code : "",
        default_amount: amount,
        effective_date: effectiveDate ? new Date(effectiveDate).toISOString().split('T')[0] : undefined,
      };
      const newConfigs = [...configs, newItem];
      const res = await api.put("/simpanan/config", {
        configs: newConfigs,
      });
      if (res.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Konfigurasi nominal berhasil disimpan",
        });
        fetchConfigs();
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data?.message || "Gagal menyimpan konfigurasi",
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

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4 py-5">
        <h5 className="mb-4 fw-bold">Konfigurasi Nominal Simpanan</h5>
        <div className="table-responsive text-start">
          <table className="table table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>No</th>
                <th>Tipe Simpanan</th>
                <th>Kode</th>
                <th>Nominal (Rp)</th>
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
              ) : configs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    Tidak ada data konfigurasi
                  </td>
                </tr>
              ) : (
                configs.map((item, index) => (
                  <tr key={item.bill_type_id}>
                    <td>{index + 1}</td>
                    <td>{item.type_name}</td>
                    <td>
                      <span className="badge bg-secondary">{item.type_code}</span>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formatInputRupiah(item.default_amount)}
                        onChange={(e) =>
                          handleAmountChange(item.bill_type_id, e.target.value)
                        }
                        style={{ maxWidth: "200px" }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={() =>
                          handleSave(item.bill_type_id, item.default_amount)
                        }
                      >
                        Simpan
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SimpananConfigPage;
