import { createBrowserRouter, Navigate } from "react-router-dom";
import globalRoutes from "./pages/globalRoutes";
import PAGE_COMPONENTS from "./PageRoutes";
import { jwtEncode } from "./helpers";
import { EncryptedPage } from "./EncryptedPage";

const SplashScreen = globalRoutes.splash;

const router = createBrowserRouter([
  {
    path: "/",
    element: <SplashScreen />,
  },
  // Redirect otomatis ke /page/:token berdasarkan nama halaman
  ...Object.keys(PAGE_COMPONENTS).map((key) => ({
    path: `/${key}`,
    element: (
      <Navigate to={`/page/${jwtEncode({ page: key })}`} replace={true} />
    ),
  })),
  {
    path: "/page/:token",
    element: <EncryptedPage />,
  },
  {
    path: "*",
    element: <Navigate to="/" replace={true} />,
  },
]);

export default router;
