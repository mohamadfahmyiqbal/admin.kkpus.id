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

export default {
  jwtEncode,
  jwtDecodePage,
  formatRupiah,
};
