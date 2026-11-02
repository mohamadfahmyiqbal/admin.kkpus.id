import test from "node:test";
import assert from "node:assert/strict";
import { jwtEncode, jwtDecodePage } from "./index.js";

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
  assert.equal(jwtDecodePage(null), null);
  assert.equal(jwtDecodePage(undefined), null);
  assert.equal(jwtDecodePage(""), null);
  assert.equal(jwtDecodePage("bukan.token.valid.empat"), null);
  assert.equal(jwtDecodePage("hanya-satu-bagian"), null);
  assert.equal(jwtDecodePage("invalid!base64.invalid!base64."), null);
});

test("jwtEncode mendukung custom expiresIn options", () => {
  const now = Date.now();
  const token = jwtEncode({ page: "dashboard" }, { expiresIn: 60000 });
  const decoded = jwtDecodePage(token);

  assert.equal(decoded.page, "dashboard");
  assert.ok(decoded._exp >= now + 60000);
});
