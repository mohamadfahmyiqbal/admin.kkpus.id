import { describe, it, expect } from "vitest";
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

describe("jualBeliReportMath", () => {
  it("computeJurnal menghasilkan nol untuk data kosong", () => {
    const jurnal = computeJurnal(buildTotals());
    expect(jurnal.totalDebit).toBe(0);
    expect(jurnal.totalKredit).toBe(0);
    expect(jurnal.selisih).toBe(0);
  });

  it("computeJurnal menyeimbangkan debit dan kredit termasuk margin", () => {
    const jurnal = computeJurnal(
      buildTotals({
        tahun_ini: { pokok: 10_000_000, margin: 2_000_000, dp: 1_000_000, cicilan: 3_000_000 },
      }),
    );

    expect(jurnal.kas).toBe(4_000_000);
    expect(jurnal.piutangJualBeli).toBe(8_000_000);
    expect(jurnal.totalDebit).toBe(12_000_000);
    expect(jurnal.totalKredit).toBe(12_000_000);
    expect(jurnal.selisih).toBe(0);
  });

  it("computeJurnal menjumlahkan tiga tahun", () => {
    const jurnal = computeJurnal(
      buildTotals({
        tahun_ini: { pokok: 1_000_000, margin: 100_000 },
        tahun_lalu: { pokok: 2_000_000, margin: 200_000 },
        tahun_lalu2: { pokok: 3_000_000, margin: 300_000 },
      }),
    );

    expect(jurnal.piutangPokok).toBe(6_000_000);
    expect(jurnal.marginDitangguhkan).toBe(600_000);
    expect(jurnal.totalDebit).toBe(6_600_000);
    expect(jurnal.totalKredit).toBe(6_600_000);
  });

  it("computeJurnal tidak menghasilkan piutang negatif", () => {
    const jurnal = computeJurnal(
      buildTotals({
        tahun_ini: { pokok: 1_000_000, margin: 100_000, dp: 2_000_000 },
      }),
    );

    expect(jurnal.piutangJualBeli).toBe(0);
    expect(jurnal.totalDebit).toBe(2_000_000);
    expect(jurnal.totalKredit).toBe(1_100_000);
    expect(jurnal.selisih).not.toBe(0);
  });
});
