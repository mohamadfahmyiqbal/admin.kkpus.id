import api from "./common";

class DashboardService {
  getAdminDashboardData() {
    return api.get(`/dashboard/admin?_t=${new Date().getTime()}`);
  }
}

const dashboardService = new DashboardService();
export default dashboardService;
export { dashboardService as t };
