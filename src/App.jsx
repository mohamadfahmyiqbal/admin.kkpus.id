import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { APP } from "./constants/app";
import router from "./routes/RouterConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/design-tokens.css";
import "./styles/admin-theme.css";
import "./styles/theme-dark.css";
import "./App.css";
import { initSocket, disconnectSocket } from "./utils/api/socket";
import PwaUpdatePrompt from "./components/pwa/PwaUpdatePrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import { ThemeProvider } from "./context/ThemeContext";

/**
 * Production env guard — shows a user-friendly error screen when
 * VITE_API_BASE_URL is missing. Still renders PwaUpdatePrompt so users
 * on cached old bundles can update to the fixed version.
 */
const EnvErrorScreen = () => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      fontFamily: "system-ui, sans-serif",
      backgroundColor: "#f8fafc",
    }}
  >
    <div
      style={{
        textAlign: "center",
        padding: "2rem",
        maxWidth: "480px",
      }}
    >
      <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚠️</div>
      <h1 style={{ color: "#dc2626", fontSize: "1.5rem", marginBottom: "12px" }}>
        Konfigurasi Belum Lengkap
      </h1>
      <p style={{ color: "#64748b", marginBottom: "24px", lineHeight: 1.6 }}>
        Alamat API belum dikonfigurasi. Jika Anda melihat ini setelah
        pembaruan, silakan klik <strong>Perbarui Sekarang</strong> di pojok
        kanan bawah untuk memuat versi terbaru.
      </p>
      <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
        Hubungi administrator sistem jika masalah berlanjut.
      </p>
    </div>
  </div>
);

const App = () => {
  const isEnvMissing =
    import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (isEnvMissing) return;

    // Socket di-init hanya jika user sudah login (userData ada).
    // Inisialisasi socket sebelum login dapat membuat polling request
    // tanpa token ke API server, mengganggu session cookie.
    const initSocketIfAuthenticated = () => {
      if (localStorage.getItem("userData")) {
        initSocket();
      }
    };

    initSocketIfAuthenticated();

    // Re-init socket setelah login (storage event dari LoginPage)
    const handleStorage = (e) => {
      if (e.key === "userData" && e.newValue) {
        initSocketIfAuthenticated();
      }
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("storage_sync", initSocketIfAuthenticated);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("storage_sync", initSocketIfAuthenticated);
      disconnectSocket();
    };
  }, [isEnvMissing]);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <OfflineIndicator />
        <PwaUpdatePrompt />
        {isEnvMissing ? (
          <EnvErrorScreen />
        ) : (
          <>
            <ToastContainer
              position="top-right"
              autoClose={APP.TOAST_AUTO_CLOSE_MS}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <RouterProvider router={router} />
          </>
        )}
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
