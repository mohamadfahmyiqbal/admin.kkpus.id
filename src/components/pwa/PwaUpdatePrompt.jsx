import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { Alert, Button } from "react-bootstrap";
import { ArrowClockwise, WifiSlash } from "phosphor-react";

export const PwaUpdatePrompt = () => {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(registration) {
      if (registration) {
        // Optional: periodic check for service worker updates (every 1 hour)
        setInterval(() => {
          registration.update().catch((err) => console.warn("PWA update check failed:", err));
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn("Service Worker registration error:", error);
    },
  });

  if (!needRefresh) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 99999,
        maxWidth: "380px",
      }}
      className="pwa-update-prompt shadow-lg"
    >
      <Alert
        variant="primary"
        className="d-flex flex-column gap-2 mb-0 border-0 text-white"
        style={{
          backgroundColor: "#02113d",
          borderRadius: "12px",
          boxShadow: "0 10px 30px rgba(2, 17, 61, 0.4)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <ArrowClockwise size={22} className="text-warning flex-shrink-0" />
          <div>
            <strong className="d-block" style={{ fontSize: "14px" }}>
              Pembaruan Sistem Tersedia
            </strong>
            <small style={{ color: "#a5b4fc", fontSize: "12px" }}>
              Versi terbaru aplikasi telah siap. Klik perbarui untuk memuat perubahan.
            </small>
          </div>
        </div>
        <div className="d-flex justify-content-end gap-2 mt-1">
          <Button
            size="sm"
            variant="outline-light"
            style={{ fontSize: "12px", padding: "4px 10px" }}
            onClick={() => setNeedRefresh(false)}
          >
            Nanti
          </Button>
          <Button
            size="sm"
            variant="success"
            style={{
              fontSize: "12px",
              padding: "4px 14px",
              backgroundColor: "#10b981",
              borderColor: "#10b981",
            }}
            onClick={() => updateServiceWorker(true)}
          >
            Perbarui Sekarang
          </Button>
        </div>
      </Alert>
    </div>
  );
};

export default PwaUpdatePrompt;
