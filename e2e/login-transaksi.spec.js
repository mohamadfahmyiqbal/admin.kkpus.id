// E2E Critical Path: Login dan Transaksi
import { test, expect } from "@playwright/test";

test("login admin lalu buat transaksi", async ({ page }) => {
  // 1. Buka halaman login
  await page.goto("/login");

  // 2. Isi kredensial
  await page.fill('input[name="email"]', "admin@kkpus.id");
  await page.fill('input[name="password"]', "password");

  // 3. Klik tombol login
  await page.click('button:has-text("Masuk"), button[type="submit"]');

  // 4. Tunggu redirect ke dashboard
  await page.waitForURL("**/dashboard");

  // 5. Buka halaman buat transaksi
  await page.click('a:has-text("Transaksi"), [data-testid="nav-transaksi"]');

  // 6. Isi form transaksi
  await page.fill('input[name="amount"]', "500000");
  await page.click('button:has-text("Simpan"), button[type="submit"]');

  // 7. Verifikasi transaksi berhasil dibuat
  await expect(page.locator("text=transaksi berhasil")).toBeVisible();
});
