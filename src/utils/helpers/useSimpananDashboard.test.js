import test from "node:test";
import assert from "node:assert/strict";

// Helper & business logic mapping tests for Simpanan
test("formatRupiah memformat angka ke format mata uang Indonesia dengan benar", () => {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  assert.equal(formatRupiah(1500000).replace(/\s/g, " "), "Rp 1.500.000");
  assert.equal(formatRupiah(0).replace(/\s/g, " "), "Rp 0");
  assert.equal(formatRupiah(null).replace(/\s/g, " "), "Rp 0");
});

test("Simpanan filter logic mencocokkan string case-insensitive", () => {
  const members = [
    { member_no: "ANG-001", full_name: "Budi Santoso" },
    { member_no: "ANG-002", full_name: "Siti Rahma" },
  ];

  const filterQuery = "budi";
  const filtered = members.filter((m) =>
    (m.full_name || "").toLowerCase().includes(filterQuery.toLowerCase())
  );

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].member_no, "ANG-001");
});

test("Simpanan sorting logic mengurutkan nominal dan tanggal dengan benar", () => {
  const transactions = [
    { id: 1, amount: 50000, date: "2026-01-01" },
    { id: 2, amount: 150000, date: "2026-03-01" },
    { id: 3, amount: 100000, date: "2026-02-01" },
  ];

  // Sort by amount ascending
  const sortedByAmount = [...transactions].sort(
    (a, b) => (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0)
  );
  assert.equal(sortedByAmount[0].id, 1);
  assert.equal(sortedByAmount[2].id, 2);

  // Sort by date descending
  const sortedByDate = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  assert.equal(sortedByDate[0].id, 2);
  assert.equal(sortedByDate[2].id, 1);
});

test("Simpanan summary aggregation menghitung total akumulasi saldo dengan benar", () => {
  const bills = [
    { item: "Simpanan Pokok Anggota", amount: "500000" },
    { item: "Simpanan Wajib Bulanan", amount: "1200000" },
  ];

  const pokok = bills.find((b) => b.item && b.item.toLowerCase().includes("pokok"));
  const wajib = bills.find((b) => b.item && b.item.toLowerCase().includes("wajib"));

  const total_pokok = parseFloat(pokok?.amount) || 0;
  const total_wajib = parseFloat(wajib?.amount) || 0;
  const total_semua = total_pokok + total_wajib;

  assert.equal(total_pokok, 500000);
  assert.equal(total_wajib, 1200000);
  assert.equal(total_semua, 1700000);
});
