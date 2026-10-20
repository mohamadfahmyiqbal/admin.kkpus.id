import React, { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes/RouterConfig";
import { ToastContainer } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/admin-theme.css";
import "./App.css";
import { initSocket, disconnectSocket } from "./utils/api/socket";

const App = () => {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      initSocket(token);
    }

    const handleStorage = () => {
      const currentToken = localStorage.getItem("token");
      if (currentToken) {
        initSocket(currentToken);
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      disconnectSocket();
    };
  }, []);

  return (
    <>
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
