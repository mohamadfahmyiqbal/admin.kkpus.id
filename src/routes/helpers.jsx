// Encode object ke JWT sederhana (tanpa tanda tangan)
export const jwtEncode = (payload) => {
  const encode = (obj) =>
    btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_");

  const header = { alg: "none", typ: "JWT" };
  return `${encode(header)}.${encode(payload)}.`;
};

// Decode nama halaman dari token
export const jwtDecodePage = (token) => {
  try {
    const [, payload] = token.split(".");
    const json = decodeURIComponent(
      escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))
    );
    return JSON.parse(json)?.page ?? null;
  } catch (err) {
    console.warn("Token tidak valid:", token, err);
    return null;
  }
};
