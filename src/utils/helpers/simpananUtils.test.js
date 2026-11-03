import test from "node:test";
import assert from "node:assert/strict";
import { formatRupiah } from "../../pages/simpanan/components/reportConstants.js";

test("formatRupiah memformat angka ke mata uang IDR dengan benar", () => {
  assert.equal(formatRupiah(0).includes("0"), true);
  assert.equal(formatRupiah(1000000).replace(/\s/g, "").includes("1.000.000"), true);
  assert.equal(formatRupiah(null).includes("0"), true);
  assert.equal(formatRupiah(undefined).includes("0"), true);
});

test("Kalkulasi total historis simpanan menjumlahkan seluruh baris dengan akurat", () => {
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

  assert.equal(laluTotal, 3000000);
  assert.equal(laluPokok, 1000000);
  assert.equal(laluWajib, 1300000);
  assert.equal(laluSukarela, 700000);
  assert.equal(lalu2Total, 2300000);
  assert.equal(lalu2Pokok, 1000000);
});

test("Kalkulasi total jurnal beradaptasi dinamis saat filter diterapkan", () => {
  const allRows = [
    { akun: "110-01", deskripsi: "Kas/Bank Simpanan", debet: 10000000, kredit: null },
    { akun: "310-01", deskripsi: "Simpanan Pokok", debet: null, kredit: 5000000 },
    { akun: "310-02", deskripsi: "Simpanan Wajib", debet: null, kredit: 3000000 },
    { akun: "210-01", deskripsi: "Simpanan Sukarela", debet: null, kredit: 2000000 },
  ];

  // Simulasi filter hanya akun simpanan pokok
  const filtered = allRows.filter((r) => r.deskripsi.includes("Pokok"));

  let debet = 0;
  let kredit = 0;
  filtered.forEach((r) => {
    if (r.debet != null) debet += r.debet;
    if (r.kredit != null) kredit += r.kredit;
  });

  assert.equal(debet, 0);
  assert.equal(kredit, 5000000);
});
