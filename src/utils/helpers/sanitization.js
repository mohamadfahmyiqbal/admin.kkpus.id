import { useNavigate } from "react-router-dom";
import { useCallback } from "react";
import { jwtEncode } from "./index";

export const useNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = useCallback(
    (pageName, options = {}) => {
      if (!navigate) {
        console.warn("Navigation not available - Router context missing");
        return;
      }
      try {
        navigate(`/${jwtEncode({ page: pageName })}`, options);
      } catch (err) {
        console.error("Navigation error:", err);
        navigate(`/${pageName}`, options);
      }
    },
    [navigate]
  );

  return { navigateTo };
};

export const sanitizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
};

export const formatDateTime = (dateStr, locale = "id-ID") => {
  try {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString(locale);
  } catch (err) {
    return "-";
  }
};

export const formatDate = (dateStr, locale = "id-ID") => {
  try {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? "-" : d.toLocaleDateString(locale);
  } catch (err) {
    return "-";
  }
};

export default {
  useNavigation,
  sanitizeString,
  formatDateTime,
  formatDate,
};
