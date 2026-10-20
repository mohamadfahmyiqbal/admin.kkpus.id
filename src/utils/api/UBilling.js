import api from "./common";

class BillingService {
  getPendingBills(params = {}) {
    return api.get("/billing/list/pending", { params });
  }

  getBillingHistory(params = {}) {
    return api.get("/billing/list/history", { params });
  }

  getInvoiceDetail(billItemIds, billId) {
    return api.post("/billing/invoice/details", {
      bill_item_ids: billItemIds,
      bill_id: billId,
    });
  }

  createVoluntaryBill(payload) {
    return api.post("/billing/create-voluntary-bill", payload);
  }

  createMidtransTransaction(payload) {
    return api.post("/billing/process-payment", payload);
  }

  manualSyncSummary() {
    return api.post("/billing/manual-sync-summary");
  }

  getPaymentFeeConfigs() {
    return api.get("/billing/payment-fees");
  }

  updatePaymentFeeConfigs(payload) {
    return api.put("/billing/payment-fees", payload);
  }

  createDepositSukarela(payload) {
    return api.post("/billing/create-deposit", payload);
  }

  processSavingsPayment(payload) {
    return api.post("/billing/process-savings", payload);
  }

  getManualVerifications(params = {}) {
    return api.get("/billing/manual-verifications", { params });
  }

  verifyManualPayment(payload) {
    return api.post("/billing/verify-manual-payment", payload);
  }
}

const billingService = new BillingService();
export default billingService;
export { billingService as t };
