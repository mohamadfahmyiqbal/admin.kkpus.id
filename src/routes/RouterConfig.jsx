import { createBrowserRouter, Navigate } from "react-router-dom";
import { jwtEncode } from "../utils/helpers";
import { EncryptedPage } from "./EncryptedPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Navigate to={`/${jwtEncode({ page: "globalSplash" })}`} replace />
    ),
  },
  {
    path: "/:token",
    element: <EncryptedPage />,
  },
]);

export default router;
