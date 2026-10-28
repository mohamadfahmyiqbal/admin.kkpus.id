import http from "./common";

class UNotification {
  /**
   * Mengambil list notifikasi untuk user/admin yang sedang login
   * Mengarah ke: GET /api/notifikasi/list
   */
  getNotifications(filter = {}) {
    return http.get("/notifikasi/list", { params: filter });
  }

  /**
   * Update status baca (SENT -> READ)
   * Mengarah ke: POST /api/notifikasi/update-status
   */
  markAsRead(idNotifikasi) {
    const payload = {
      id: Array.isArray(idNotifikasi) ? idNotifikasi : [idNotifikasi],
      status: 2, // READ
    };
    return http.post("/notifikasi/update-status", payload);
  }
}

export default new UNotification();
