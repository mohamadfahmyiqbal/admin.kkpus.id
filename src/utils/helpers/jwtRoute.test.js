import { describe, it, expect } from "vitest";
import { jwtEncode, jwtDecodePage, isJwtExpired } from "./index.js";

describe("jwtRoute", () => {
  it("jwtEncode menghasilkan string berformat header.payload.", () => {
    const token = jwtEncode({ page: "globalSplash" });
    expect(typeof token).toBe("string");
    const parts = token.split(".");
    expect(parts.length).toBe(3);
    expect(parts[2]).toBe("");
  });

  it("jwtDecodePage berhasil menguraikan token yang di-encode", () => {
    const payload = { page: "authLogin", role: "admin" };
    const token = jwtEncode(payload);
    const decoded = jwtDecodePage(token);

    expect(decoded.page).toBe("authLogin");
    expect(decoded.role).toBe("admin");
    expect(decoded._v).toBe("1.0");
    expect(decoded._ts > 0).toBe(true);
    expect(decoded._exp > decoded._ts).toBe(true);
  });

  it("jwtDecodePage mengembalikan null untuk input tidak valid", () => {
    const originalError = console.error;
    console.error = () => {};
    try {
      expect(jwtDecodePage(null)).toBe(null);
      expect(jwtDecodePage(undefined)).toBe(null);
      expect(jwtDecodePage("")).toBe(null);
      expect(jwtDecodePage("bukan.token.valid.empat")).toBe(null);
      expect(jwtDecodePage("hanya-satu-bagian")).toBe(null);
      expect(jwtDecodePage("invalid!base64.invalid!base64.")).toBe(null);
    } finally {
      console.error = originalError;
    }
  });

  it("jwtEncode mendukung custom expiresIn options", () => {
    const now = Date.now();
    const token = jwtEncode({ page: "dashboard" }, { expiresIn: 60000 });
    const decoded = jwtDecodePage(token);

    expect(decoded.page).toBe("dashboard");
    expect(decoded._exp >= now + 60000).toBe(true);
  });

  it("isJwtExpired memvalidasi token kedaluwarsa dengan tepat", () => {
    expect(isJwtExpired(null)).toBe(true);
    expect(isJwtExpired(undefined)).toBe(true);
    expect(isJwtExpired("")).toBe(true);
    expect(isJwtExpired("invalid.token")).toBe(true);

    const futureExp = Math.floor(Date.now() / 1000) + 3600;
    const validPayload = btoa(JSON.stringify({ member_id: 1, exp: futureExp }));
    const validToken = `header.${validPayload}.signature`;
    expect(isJwtExpired(validToken)).toBe(false);

    const pastExp = Math.floor(Date.now() / 1000) - 3600;
    const expiredPayload = btoa(JSON.stringify({ member_id: 1, exp: pastExp }));
    const expiredToken = `header.${expiredPayload}.signature`;
    expect(isJwtExpired(expiredToken)).toBe(true);
  });
});
