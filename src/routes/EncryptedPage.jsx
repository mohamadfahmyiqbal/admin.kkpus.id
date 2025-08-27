import React from "react";
import { Navigate, useParams } from "react-router-dom";
import PAGE_COMPONENTS from "./PageRoutes";
import { jwtDecodePage } from "./helpers";

export const EncryptedPage = React.memo(() => {
  const { token } = useParams();
  const pageName = jwtDecodePage(token);
  const PageComponent = PAGE_COMPONENTS[pageName];

  return PageComponent ? <PageComponent /> : <Navigate to="/" replace />;
});
