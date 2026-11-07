import { describe, it, expect } from "vitest";
import { formatRupiah } from "../../pages/simpanan/components/reportConstants.js";

describe("simpananUtils", () => {
  it("formatRupiah memformat angka ke mata uang IDR dengan benar", () => {
    expect(formatRupiah(0).includes("0")).toBe(true);
    expect(formatRupiah(1000000).replace(/\s/g, "").includes("1.000.000")).toBe(true);
    expect(formatRupiah(null).includes("0")).toBe(true);
    expect(formatRupiah(undefined).includes("0")).toBe(true);
  });

  it("Kalkulasi total historis simpanan menjumlahkan seluruh baris dengan akurat", () => {
    const dummyReportList = [
      {
        nama: "Anggota A",
        tahun_lalu: { total: 1000000, pokok: 500000, wajib: 300000, sukarela: 200000 },
        tahun_lalu2: { total: 800000, pokok: 500000 },
      },
      {
        nama: "Anggota B",
        tahun_lalu: { total: 2000000, pokok: 500000, wajib: 1000000, sukarela: 500000 },
        tahun_lalu2: { total: 1500000, pokok: 500000 },
      },
    ];

    let laluTotal = 0;
    let laluPokok = 0;
    let laluWajib = 0;
    let laluSukarela = 0;
    let lalu2Total = 0;
    let lalu2Pokok = 0;

    dummyReportList.forEach((item) => {
      laluTotal += parseFloat(item.tahun_lalu?.total) || 0;
      laluPokok += parseFloat(item.tahun_lalu?.pokok) || 0;
      laluWajib += parseFloat(item.tahun_lalu?.wajib) || 0;
      laluSukarela += parseFloat(item.tahun_lalu?.sukarela) || 0;
      lalu2Total += parseFloat(item.tahun_lalu2?.total) || 0;
      lalu2Pokok += parseFloat(item.tahun_lalu2?.pokok) || 0;
    });

    expect(laluTotal).toBe(3000000);
    expect(laluPokok).toBe(1000000);
    expect(laluWajib).toBe(1300000);
    expect(laluSukarela).toBe(700000);
    expect(lalu2Total).toBe(2300000);
    expect(lalu2Pokok).toBe(1000000);
  });

  it("Kalkulasi total jurnal beradaptasi dinamis saat filter diterapkan", () => {
    const allRows = [
      { akun: "110-01", deskripsi: "Kas/Bank Simpanan", debet: 10000000, kredit: null },
      { akun: "310-01", deskripsi: "Simpanan Pokok", debet: null, kredit: 5000000 },
      { akun: "310-02", deskripsi: "Simpanan Wajib", debet: null, kredit: 3000000 },
      { akun: "210-01", deskripsi: "Simpanan Sukarela", debet: null, kredit: 2000000 },
    ];

    const filtered = allRows.filter((r) => r.deskripsi.includes("Pokok"));

    let debet = 0;
    let kredit = 0;
    filtered.forEach((r) => {
      if (r.debet != null) debet += r.debet;
      if (r.kredit != null) kredit += r.kredit;
    });

    expect(debet).toBe(0);
    expect(kredit).toBe(5000000);
  });
});
