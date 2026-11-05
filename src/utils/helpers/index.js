export const jwtEncode = (payload, options = {}) => {
  try {
    const data = {
      ...payload,
      _v: "1.0",
      _ts: Date.now(),
      _exp: options.expiresIn ? Date.now() + options.expiresIn : Date.now() + 1440 * 60 * 1000,
      _src: options.source || "encode",
    };

    const encode = (obj) => {
      const json = JSON.stringify(obj);
      return btoa(encodeURIComponent(json))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    };

    const header = { alg: "none", typ: "JWT", ver: "1.0" };
    return `${encode(header)}.${encode(data)}.`;
  } catch (err) {
    console.error("jwtEncode Error:", err);
    return "";
  }
};

export const jwtDecodePage = (token) => {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    const decoded = atob(base64);
    const obj = JSON.parse(decodeURIComponent(decoded));
    return obj;
  } catch (err) {
    console.warn("Token decode failed:", err.message);
    return null;
  }
};

export const isJwtExpired = (token) => {
  if (!token || typeof token !== "string") return true;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return true;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const pad = base64.length % 4;
    if (pad) {
      base64 += "=".repeat(4 - pad);
    }
    const decoded = atob(base64);
    const payload = JSON.parse(decodeURIComponent(decoded));
    if (!payload.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const formatRupiah = (value) => {
  if (!value) return "Rp 0";
  const num = parseInt(value, 10);
  if (isNaN(num)) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

export const getMediaUrl = (path) => {
  if (!path) return "";
  const cleanPath = path.replace(/\\/g, "/");
  if (cleanPath.startsWith("http") || cleanPath.startsWith("data:")) return cleanPath;
  const base = (
    import.meta.env.VITE_API_ORIGIN ||
    (import.meta.env.PROD ? "https://api.kkpus.id" : "https://localhost:3445")
  ).replace(/\/$/, "");
  return `${base}${cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`}`;
};

export const SVG_FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22400%22%20height%3D%22300%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23f1f5f9%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20dominant-baseline%3D%22middle%22%20text-anchor%3D%22middle%22%20font-family%3D%22sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%2394a3b8%22%3EDokumen%20Tidak%20Ditemukan%3C%2Ftext%3E%3C%2Fsvg%3E";

import { sanitizeString } from "./sanitization.js";
export { sanitizeString };

export default {
  jwtEncode,
  jwtDecodePage,
  isJwtExpired,
  formatRupiah,
  getMediaUrl,
  SVG_FALLBACK_IMAGE,
  sanitizeString,
};
