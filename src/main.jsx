// B1: Env guard — pastikan VITE_API_BASE_URL tersedia di produksi
if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL) {
  console.error(
    "[ENV ERROR] VITE_API_BASE_URL is required in production. " +
    "Set it via .env.production or deployment environment."
  );
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;min-height:100vh;font-family:system-ui">
      <div style="text-align:center;padding:2rem">
        <h1 style="color:#dc3545">⚠️ Configuration Error</h1>
        <p>VITE_API_BASE_URL is not set. Contact your system administrator.</p>
      </div>
    </div>`;
  throw new Error("VITE_API_BASE_URL is required in production");
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);