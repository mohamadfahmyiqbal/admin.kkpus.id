import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { APP } from "./constants/app";
import router from "./routes/RouterConfig";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./styles/admin-theme.css";
import "./App.css";
import { initSocket, disconnectSocket } from "./utils/api/socket";
import PwaUpdatePrompt from "./components/pwa/PwaUpdatePrompt";
import OfflineIndicator from "./components/pwa/OfflineIndicator";

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
    <ErrorBoundary>
      <OfflineIndicator />
      <PwaUpdatePrompt />
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
    </ErrorBoundary>
  );
};

export default App;
