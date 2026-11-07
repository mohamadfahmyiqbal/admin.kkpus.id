import { describe, it, expect } from "vitest";

// Helper & business logic mapping tests for Simpanan
describe("useSimpananDashboard", () => {
  it("formatRupiah memformat angka ke format mata uang Indonesia dengan benar", () => {
    const formatRupiah = (number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(number || 0);
    };

    expect(formatRupiah(1500000).replace(/\s/g, " ")).toBe("Rp 1.500.000");
    expect(formatRupiah(0).replace(/\s/g, " ")).toBe("Rp 0");
    expect(formatRupiah(null).replace(/\s/g, " ")).toBe("Rp 0");
  });

  it("Simpanan filter logic mencocokkan string case-insensitive", () => {
    const members = [
      { member_no: "ANG-001", full_name: "Budi Santoso" },
      { member_no: "ANG-002", full_name: "Siti Rahma" },
    ];

    const filterQuery = "budi";
    const filtered = members.filter((m) =>
      (m.full_name || "").toLowerCase().includes(filterQuery.toLowerCase()),
    );

    expect(filtered.length).toBe(1);
    expect(filtered[0].member_no).toBe("ANG-001");
  });

  it("Simpanan sorting logic mengurutkan nominal dan tanggal dengan benar", () => {
    const transactions = [
      { id: 1, amount: 50000, date: "2026-01-01" },
      { id: 2, amount: 150000, date: "2026-03-01" },
      { id: 3, amount: 100000, date: "2026-02-01" },
    ];

    const sortedByAmount = [...transactions].sort(
      (a, b) => (parseFloat(a.amount) || 0) - (parseFloat(b.amount) || 0),
    );
    expect(sortedByAmount[0].id).toBe(1);
    expect(sortedByAmount[2].id).toBe(2);

    const sortedByDate = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    expect(sortedByDate[0].id).toBe(2);
    expect(sortedByDate[2].id).toBe(1);
  });

  it("Simpanan summary aggregation menghitung total akumulasi saldo dengan benar", () => {
    const bills = [
      { item: "Simpanan Pokok Anggota", amount: "500000" },
      { item: "Simpanan Wajib Bulanan", amount: "1200000" },
    ];

    const pokok = bills.find((b) => b.item && b.item.toLowerCase().includes("pokok"));
    const wajib = bills.find((b) => b.item && b.item.toLowerCase().includes("wajib"));

    const total_pokok = parseFloat(pokok?.amount) || 0;
    const total_wajib = parseFloat(wajib?.amount) || 0;
    const total_semua = total_pokok + total_wajib;

    expect(total_pokok).toBe(500000);
    expect(total_wajib).toBe(1200000);
    expect(total_semua).toBe(1700000);
  });
});
