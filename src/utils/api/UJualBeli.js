import api from "./common";

class JualBeliService {
  createJualBeli(data) {
    return api.post("/jualbeli/create", data);
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

  createPinjamanHutang(data) {
    return api.post("/financial/hutang/create", data);
  }

  createPinjamanAktivaTetap(data) {
    return api.post("/financial/aktiva-tetap/create", data);
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

  submitPengajuan(data) {
    return api.post("/financial/apply", data);
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

  importCicilanJualBeli(formData) {
    return api.post("/jualbeli/import-cicilan", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  deleteJualBeli(id) {
    return api.delete(`/jualbeli/${id}`);
  }

  deleteBatchJualBeli(ids) {
    return api.post("/jualbeli/batch-delete", { ids });
  }
}

const jualBeliService = new JualBeliService();
export default jualBeliService;
export { jualBeliService as t };
