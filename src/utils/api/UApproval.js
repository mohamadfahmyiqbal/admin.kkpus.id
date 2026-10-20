import api from "./common";

class ApprovalService {
  getPendingRegistrations() {
    return api.get("/approvals/pendaftaran/pending");
  }

  processRegistrationApproval(id, payload) {
    return api.put(`/approvals/pendaftaran/approve/${id}`, payload);
  }

  processTerminationApproval(id, payload) {
    return api.post(`/approvals/process/exit_requests/${id}`, payload);
  }

  processWithdrawalApproval(id, payload) {
    return api.put(`/approvals/penarikan/approve/${id}`, payload);
  }

  processFinancingApproval(id, payload) {
    return api.put(`/approvals/financing/approve/${id}`, payload);
  }

  processTabunganApproval(id, payload) {
    return api.put(`/approvals/tabungan/approve/${id}`, payload);
  }

  processSukukApproval(id, payload) {
    return api.put(`/approvals/sukuk/approve/${id}`, payload);
  }
}

const approvalService = new ApprovalService();
export default approvalService;
export { approvalService as t };
