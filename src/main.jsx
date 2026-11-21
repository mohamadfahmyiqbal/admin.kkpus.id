// B1: Env guard — warn if VITE_API_BASE_URL missing in production, but don't block React mount.
// Blocking (document.body.innerHTML + throw) prevents PwaUpdatePrompt from ever rendering,
// trapping users on cached old bundles that lack the env var. Non-blocking lets the app
// show a React-based error state with the PWA update prompt still accessible.
if (import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "[ENV WARN] VITE_API_BASE_URL is not set. " +
    "API calls will fail. Set it via .env.production or CI build env vars."
  );
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