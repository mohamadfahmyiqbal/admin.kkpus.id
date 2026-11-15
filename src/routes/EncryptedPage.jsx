import React, { Suspense, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import PAGE_COMPONENTS from "./PageRoutes";
import { jwtDecodePage } from "../utils/helpers";
import LayoutGlobal from "../components/layout/LayoutGlobal";

const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

export const EncryptedPage = React.memo(() => {
  const { token } = useParams();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [token]);

  const decodedData = useMemo(() => {
    try {
      return jwtDecodePage(token);
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, [token]);

  const pageName = decodedData?.page;
  const routeConfig = PAGE_COMPONENTS[pageName];

  if (!decodedData || !routeConfig) {
    return <Navigate to="/" replace />;
  }

  const { component: PageComponent, isProtected } = routeConfig;

  // Cek token auth untuk protected route
  if (isProtected) {
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      return <Navigate to="/" replace />;
    }
  }

  const content = (
    <Suspense fallback={<PageLoader />}>
      <PageComponent decodedToken={decodedData} />
    </Suspense>
  );

  return isProtected ? (
    <LayoutGlobal pageName={pageName}>{content}</LayoutGlobal>
  ) : (
    content
  );
});

export default EncryptedPage;
