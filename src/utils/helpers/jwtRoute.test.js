import test from "node:test";
import assert from "node:assert/strict";
import { jwtEncode, jwtDecodePage, isJwtExpired } from "./index.js";

test("jwtEncode menghasilkan string berformat header.payload.", () => {
  const token = jwtEncode({ page: "globalSplash" });
  assert.equal(typeof token, "string");
  const parts = token.split(".");
  assert.equal(parts.length, 3);
  assert.equal(parts[2], "");
});

test("jwtDecodePage berhasil menguraikan token yang di-encode", () => {
  const payload = { page: "authLogin", role: "admin" };
  const token = jwtEncode(payload);
  const decoded = jwtDecodePage(token);

  assert.equal(decoded.page, "authLogin");
  assert.equal(decoded.role, "admin");
  assert.equal(decoded._v, "1.0");
  assert.ok(decoded._ts > 0);
  assert.ok(decoded._exp > decoded._ts);
});

test("jwtDecodePage mengembalikan null untuk input tidak valid", () => {
  // Matikan console.error sementara saat menguji error token parsing
  const originalError = console.error;
  console.error = () => {};
  try {
    assert.equal(jwtDecodePage(null), null);
    assert.equal(jwtDecodePage(undefined), null);
    assert.equal(jwtDecodePage(""), null);
    assert.equal(jwtDecodePage("bukan.token.valid.empat"), null);
    assert.equal(jwtDecodePage("hanya-satu-bagian"), null);
    assert.equal(jwtDecodePage("invalid!base64.invalid!base64."), null);
  } finally {
    console.error = originalError;
  }
});

test("jwtEncode mendukung custom expiresIn options", () => {
  const now = Date.now();
  const token = jwtEncode({ page: "dashboard" }, { expiresIn: 60000 });
  const decoded = jwtDecodePage(token);

  assert.equal(decoded.page, "dashboard");
  assert.ok(decoded._exp >= now + 60000);
});

test("isJwtExpired memvalidasi token kedaluwarsa dengan tepat", () => {
  // Token null / string kosong / acak dianggap expired
  assert.equal(isJwtExpired(null), true);
  assert.equal(isJwtExpired(undefined), true);
  assert.equal(isJwtExpired(""), true);
  assert.equal(isJwtExpired("invalid.token"), true);

  // Token yang belum expired (exp di masa depan)
  const futureExp = Math.floor(Date.now() / 1000) + 3600; // 1 jam ke depan
  const validPayload = btoa(JSON.stringify({ member_id: 1, exp: futureExp }));
  const validToken = `header.${validPayload}.signature`;
  assert.equal(isJwtExpired(validToken), false);

  // Token yang sudah expired (exp di masa lalu)
  const pastExp = Math.floor(Date.now() / 1000) - 3600; // 1 jam lalu
  const expiredPayload = btoa(JSON.stringify({ member_id: 1, exp: pastExp }));
  const expiredToken = `header.${expiredPayload}.signature`;
  assert.equal(isJwtExpired(expiredToken), true);
});
