import { describe, it, expect } from "vitest";
import {
  checkNumeric,
  calculateRemainingDebt,
  getCicilanStatus,
} from "./filterUtils.js";

describe("filterUtils", () => {
  it("checkNumeric mengembalikan true untuk filter kosong", () => {
    expect(checkNumeric("", 1000)).toBe(true);
    expect(checkNumeric(null, 1000)).toBe(true);
    expect(checkNumeric(undefined, 1000)).toBe(true);
    expect(checkNumeric("abc", 1000)).toBe(true);
  });

  it("checkNumeric mencocokkan angka polos", () => {
    expect(checkNumeric("1000000", 1000000)).toBe(true);
    expect(checkNumeric("1000000", 2000000)).toBe(false);
  });

  it("checkNumeric mendukung format ribuan Indonesia", () => {
    expect(checkNumeric("1.000.000", 1000000)).toBe(true);
    expect(checkNumeric("1.000.000", 2000000)).toBe(false);
  });

  it("checkNumeric mendukung desimal koma", () => {
    expect(checkNumeric("1,5", 1.5)).toBe(true);
    expect(checkNumeric("1.000,50", 1000.5)).toBe(true);
  });

  it("calculateRemainingDebt mengurangi DP dan pembayaran", () => {
    expect(
      calculateRemainingDebt({
        amount_requested: 1_000_000,
        margin_amount: 200_000,
        down_payment: 100_000,
        paid_amount: 300_000,
      }),
    ).toBe(800_000);
    expect(
      calculateRemainingDebt({ amount_requested: 100_000, paid_amount: 500_000 }),
    ).toBe(0);
  });

  it("getCicilanStatus menentukan Lunas dengan benar", () => {
    expect(
      getCicilanStatus({
        amount_requested: 1_000_000,
        margin_amount: 200_000,
        down_payment: 200_000,
        paid_amount: 1_000_000,
      }),
    ).toBe("Lunas");
    expect(
      getCicilanStatus({
        amount_requested: 1_000_000,
        margin_amount: 200_000,
        down_payment: 200_000,
        paid_amount: 999_999,
      }),
    ).toBe("Belum Lunas");
  });
});
