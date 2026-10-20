import api from "./common";

class ProgramService {
  getLoanProducts() {
    return api.get("/program/pinjaman/produk");
  }

  applyLoan(payload) {
    return api.post("/program/pinjaman/apply", payload);
  }

  postInputModal(payload) {
    return api.post("/program/pinjaman/modal", payload);
  }

  getArisanDetail(id) {
    return api.get(`/program/arisan/detail/${id}`);
  }

  getArisanBatches() {
    return api.get("/program/arisan/batches");
  }

  createArisanBatch(payload) {
    return api.post("/program/arisan/batches", payload);
  }

  updateArisanBatchStatus(id, status) {
    return api.put(`/program/arisan/batches/${id}/status`, { status });
  }

  updateArisanBatch(id, payload) {
    return api.put(`/program/arisan/batches/${id}`, payload);
  }

  deleteArisanBatch(id) {
    return api.delete(`/program/arisan/batches/${id}`);
  }

  getArisanParticipants(batchId) {
    return api.get(`/program/arisan/batches/${batchId}/participants`);
  }

  updateArisanParticipantStatus(id, status) {
    return api.put(`/program/arisan/participants/${id}/status`, { status });
  }

  updateArisanParticipantNo(id, no) {
    return api.put(`/program/arisan/participants/${id}/no`, { participant_no: no });
  }

  getArisanPayments(batchId) {
    return api.get(`/program/arisan/batches/${batchId}/payments`);
  }

  recordArisanPayment(batchId, payload) {
    return api.post(`/program/arisan/batches/${batchId}/payments`, payload);
  }

  getArisanDraws(batchId) {
    return api.get(`/program/arisan/batches/${batchId}/draws`);
  }

  conductArisanDraw(batchId, payload) {
    return api.post(`/program/arisan/batches/${batchId}/draws`, payload);
  }

  updateArisanDrawStatus(id, payload) {
    if (payload instanceof FormData) {
      return api.put(`/program/arisan/draws/${id}/status`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return api.put(`/program/arisan/draws/${id}/status`, payload);
  }

  importPinjaman(formData) {
    return api.post("/program/pinjaman/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  importArisan(formData) {
    return api.post("/program/arisan/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }
}

const programService = new ProgramService();
export default programService;
export { programService as t };
