import http from "./common";

class UApproval {
  // Helper: kirim request dengan JSON
  postJSON(url, data) {
    return http.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
  }

  // Helper: kirim request dengan FormData
  postFormData(url, data) {
    const formData = new FormData();
    Object.entries(data || {}).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return http.post(url, formData, {
      // Biarkan axios set boundary untuk multipart
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  getApprovalByNikAndType(fields) {
    return this.postJSON("/getApprovalByNikAndType", fields);
  }
  getApprovalRequestByNik(fields) {
    return this.postJSON("/getApprovalRequestByNik", fields);
  }
  getApprovalDetail(fields) {
    return this.postJSON("/getApprovalDetail", fields);
  }
  manageApproval(fields) {
    return this.postJSON("/manageApproval", fields);
  }
}

export default new UApproval();
