import React, { useState, useEffect } from "react";
import { WifiSlash } from "phosphor-react";

export const OfflineIndicator = () => {
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100000,
        backgroundColor: "#dc2626",
        color: "#ffffff",
        padding: "8px 16px",
        textAlign: "center",
        fontSize: "13px",
        fontWeight: 500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <WifiSlash size={18} weight="bold" />
      <span>
        Koneksi Internet Terputus. Anda saat ini dalam mode offline. Data transaksi online memerlukan jaringan.
      </span>
    </div>
  );
};

export default OfflineIndicator;
