import api from "./common";

class SavingsService {
  createSavingsApplication(payload) {
    return api.post("/savings/apply", payload);
  }

  getSavingsHistory(params) {
    return api.get("/savings/history", { params });
  }

  getSavingsDetail(id) {
    return api.get(`/savings/${id}`);
  }

  getSavingsOptions() {
    return api.get("/savings/options");
  }

  getSavingsSummary() {
    return api.get("/savings/summary");
  }

  getAdminSavingsSummary() {
    return api.get("/savings/admin-summary");
  }

  getAdminSavingsTransactions(params) {
    return api.get("/savings/admin-transactions", { params });
  }

  getAdminSavingsReport(params) {
    return api.get("/savings/admin-report", { params });
  }

  importSimpanan(formData) {
    return api.post("/savings/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const savingsService = new SavingsService();
export default savingsService;
export { savingsService as t };
