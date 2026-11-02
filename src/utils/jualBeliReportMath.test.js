import test from "node:test";
import assert from "node:assert/strict";
import { computeJurnal } from "./jualBeliReportMath.js";

const emptyYear = () => ({
  total: 0,
  pokok: 0,
  dp: 0,
  margin: 0,
  cicilan: 0,
});

const buildTotals = (override = {}) => ({
  tahun_ini: { ...emptyYear(), ...override.tahun_ini },
  tahun_lalu: { ...emptyYear(), ...override.tahun_lalu },
  tahun_lalu2: { ...emptyYear(), ...override.tahun_lalu2 },
});

test("computeJurnal menghasilkan nol untuk data kosong", () => {
  const jurnal = computeJurnal(buildTotals());
  assert.equal(jurnal.totalDebit, 0);
  assert.equal(jurnal.totalKredit, 0);
  assert.equal(jurnal.selisih, 0);
});

test("computeJurnal menyeimbangkan debit dan kredit termasuk margin", () => {
  const jurnal = computeJurnal(
    buildTotals({
      tahun_ini: { pokok: 10_000_000, margin: 2_000_000, dp: 1_000_000, cicilan: 3_000_000 },
    })
  );

  assert.equal(jurnal.kas, 4_000_000);
  assert.equal(jurnal.piutangJualBeli, 8_000_000);
  assert.equal(jurnal.totalDebit, 12_000_000);
  assert.equal(jurnal.totalKredit, 12_000_000);
  assert.equal(jurnal.selisih, 0);
});

test("computeJurnal menjumlahkan tiga tahun", () => {
  const jurnal = computeJurnal(
    buildTotals({
      tahun_ini: { pokok: 1_000_000, margin: 100_000 },
      tahun_lalu: { pokok: 2_000_000, margin: 200_000 },
      tahun_lalu2: { pokok: 3_000_000, margin: 300_000 },
    })
  );

  assert.equal(jurnal.piutangPokok, 6_000_000);
  assert.equal(jurnal.marginDitangguhkan, 600_000);
  assert.equal(jurnal.totalDebit, 6_600_000);
  assert.equal(jurnal.totalKredit, 6_600_000);
});

test("computeJurnal tidak menghasilkan piutang negatif", () => {
  const jurnal = computeJurnal(
    buildTotals({
      tahun_ini: { pokok: 1_000_000, margin: 100_000, dp: 2_000_000 },
    })
  );

  assert.equal(jurnal.piutangJualBeli, 0);
  assert.equal(jurnal.totalDebit, 2_000_000);
  assert.equal(jurnal.totalKredit, 1_100_000);
  assert.notEqual(jurnal.selisih, 0);
});
