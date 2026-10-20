import api from "./common";

class JualBeliService {
  createJualBeli(payload) {
    return api.post("/jualbeli/create", payload);
  }

  getJualBeliHistory(params) {
    return api.get("/jualbeli/history", { params });
  }

  getJualBeliDetail(id) {
    return api.get(`/jualbeli/${id}`);
  }

  getJualBeliOptions() {
    return api.get("/jualbeli/options");
  }

  getJualBeliReport() {
    return api.get("/jualbeli/report");
  }

  getPinjamanReport() {
    return api.get("/financial/report/pinjaman");
  }

  createPinjamanHutang(payload) {
    return api.post("/financial/hutang/create", payload);
  }

  createPinjamanAktivaTetap(payload) {
    return api.post("/financial/aktiva-tetap/create", payload);
  }

  getGeneralJualBeliHistory(params) {
    return this.getJualBeliHistory(params);
  }

  getFinancingHistory(params) {
    return api.get("/financial/history", { params });
  }

  getArisanReport(params) {
    return api.get("/financial/report/arisan", { params });
  }

  submitPengajuan(payload) {
    return api.post("/financial/apply", payload);
  }

  getFinancingDetail(id) {
    return api.get(`/financial/detail/${id}`);
  }

  getOptions() {
    return api.get("/financial/options");
  }

  getTerms() {
    return api.get("/financial/terms");
  }

  downloadReceipt(id) {
    return api.get(`/financial/receipt/${id}`, { responseType: "blob" });
  }

  importJualBeli(formData) {
    return api.post("/jualbeli/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const jualBeliService = new JualBeliService();
export default jualBeliService;
export { jualBeliService as t };
