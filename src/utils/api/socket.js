import io from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445");
let socket = null;

export const initSocket = (token) => {
  if (socket && socket.connected) {
    return socket;
  }

  const effectiveToken = token || getCookie("auth_token");

  socket = io(SOCKET_URL, {
    auth: { token: effectiveToken },
    transports: ["websocket", "polling"],
    timeout: 20000,
  });

  socket.on("connect", () => {
    console.log("🔌 [Socket Admin] Terhubung ke server socket:", socket.id);
    try {
      const token = getCookie("auth_token");
      if (token) {
        const stored = getCookie("userData");
        if (stored) {
          const user = JSON.parse(stored);
          const memberId = user.member_id || user.id || user.userId;
          if (memberId) {
            socket.emit("register", memberId);
            console.log("👤 [Socket Admin] Register user ke socket:", memberId);
          }
        }
      }
    } catch (e) {}
  });

  socket.on("disconnect", (reason) => {
    console.log("🔌 [Socket Admin] Terputus:", reason);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Error koneksi socket:", err.message);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket || !socket.connected) {
    const token = getCookie("auth_token");
    if (token) {
      return initSocket(token);
    }
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// Helper to read from httpOnly cookie (token is in auth_token cookie)
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  return parts.length === 2 ? parts.pop().split(';').shift() : null;
};

export default {
  initSocket,
  getSocket,
  disconnectSocket,
};
