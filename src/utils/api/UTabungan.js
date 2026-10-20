import api from "./common";

const TabunganService = {
  getPrograms: (params) => api.get("/tabungan/admin/programs", { params }),
  createProgram: (payload) => api.post("/tabungan/admin/programs", payload),
  updateProgram: (id, payload) => api.put(`/tabungan/admin/programs/${id}`, payload),
  deleteProgram: (id) => api.delete(`/tabungan/admin/programs/${id}`),
  getAdminTabungan: (params) => api.get("/tabungan/admin", { params }),
  getAdminTabunganBills: (id) => api.get(`/tabungan/admin/pengajuan/${id}/tagihan`),
  getAdminTabunganTransactions: (params) => api.get("/tabungan/admin/transactions", { params }),
  approveWithdrawal: (id, payload) => api.put(`/approvals/tabungan_penarikan/approve/${id}`, payload),
  disburseWithdrawal: (id, payload) => api.post(`/approvals/tabungan_penarikan/pembayaran/${id}`, payload),
  importTabungan: (formData) => api.post("/tabungan/admin/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }),
};

export default TabunganService;
export { TabunganService as t };
