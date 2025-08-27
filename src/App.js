import "./App.css";
import { RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/ReactToastify.css";
import router from "./routes/RouterConfig.jsx";

const App = () => (
  <>
    <ToastContainer />
    <RouterProvider router={router} future={{ v7_startTransition: true }} />
  </>
);

export default App;
