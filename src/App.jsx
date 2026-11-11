import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/RouterConfig";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/admin-theme.css";
import "./App.css";
import { initSocket, disconnectSocket } from "./utils/api/socket";
import PwaUpdatePrompt from "./components/pwa/PwaUpdatePrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";
import { useSocketUpdateListener } from "./hooks/useSocketUpdateListener";

const App = () => {
  useSocketUpdateListener();

  useEffect(() => {
    // Read token from cookies instead of localStorage
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop().split(';').shift() : null;
    };
    
    const token = getCookie("auth_token");
    if (token) {
      initSocket(token);
    }

    const handleCookieChange = () => {
      const token = getCookie("auth_token");
      if (token) {
        initSocket(token);
      }
    };

    window.addEventListener("cookieChange", handleCookieChange);

    return () => {
      window.removeEventListener("cookieChange", handleCookieChange);
      disconnectSocket();
    };
  }, []);

  return (
    <>
      <OfflineIndicator />
      <PwaUpdatePrompt />
      <ToastContainer
        position="top-right"
        autoClose={4000}
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
  );
};

export default App;
