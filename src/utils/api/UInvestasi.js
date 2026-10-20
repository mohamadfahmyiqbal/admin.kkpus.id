import api from "./common";

class InvestasiService {
  getPortofolioSummary() {
    return api.get("/investasi/portofolio/summary");
  }

  getAvailableProducts() {
    return api.get("/investasi/produk/list");
  }

  submitOrder(payload) {
    return api.post("/investasi/order/submit", payload);
  }

  getPendanaanHistory(params) {
    return api.get("/financing/history", { params });
  }

  getPendanaanReport(params) {
    return api.get("/financing/report/pendanaan", { params });
  }

  importPendanaan(formData) {
    return api.post("/financing/pendanaan/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  importInvestasi(formData) {
    return api.post("/financing/investasi/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const investasiService = new InvestasiService();
export default investasiService;
export { investasiService as t };
