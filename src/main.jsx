import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

function handleDynamicImportError(event) {
  const msg = event.message || event.reason?.message || "";
  if (/Failed to fetch dynamically imported module/.test(msg)) {
    window.location.reload();
  }
}

window.addEventListener("unhandledrejection", (event) => {
  handleDynamicImportError(event);
});

window.addEventListener("error", (event) => {
  handleDynamicImportError(event);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
