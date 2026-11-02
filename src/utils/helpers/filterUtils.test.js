import test from "node:test";
import assert from "node:assert/strict";
import {
  checkNumeric,
  calculateRemainingDebt,
  getCicilanStatus,
} from "./filterUtils.js";

test("checkNumeric mengembalikan true untuk filter kosong", () => {
  assert.equal(checkNumeric("", 1000), true);
  assert.equal(checkNumeric(null, 1000), true);
  assert.equal(checkNumeric(undefined, 1000), true);
  assert.equal(checkNumeric("abc", 1000), true);
});

test("checkNumeric mencocokkan angka polos", () => {
  assert.equal(checkNumeric("1000000", 1000000), true);
  assert.equal(checkNumeric("1000000", 2000000), false);
});

test("checkNumeric mendukung format ribuan Indonesia", () => {
  assert.equal(checkNumeric("1.000.000", 1000000), true);
  assert.equal(checkNumeric("1.000.000", 2000000), false);
});

test("checkNumeric mendukung desimal koma", () => {
  assert.equal(checkNumeric("1,5", 1.5), true);
  assert.equal(checkNumeric("1.000,50", 1000.5), true);
});

test("calculateRemainingDebt mengurangi DP dan pembayaran", () => {
  assert.equal(
    calculateRemainingDebt({
      amount_requested: 1_000_000,
      margin_amount: 200_000,
      down_payment: 100_000,
      paid_amount: 300_000,
    }),
    800_000
  );
  assert.equal(
    calculateRemainingDebt({ amount_requested: 100_000, paid_amount: 500_000 }),
    0
  );
});

test("getCicilanStatus menentukan Lunas dengan benar", () => {
  assert.equal(
    getCicilanStatus({
      amount_requested: 1_000_000,
      margin_amount: 200_000,
      down_payment: 200_000,
      paid_amount: 1_000_000,
    }),
    "Lunas"
  );
  assert.equal(
    getCicilanStatus({
      amount_requested: 1_000_000,
      margin_amount: 200_000,
      down_payment: 200_000,
      paid_amount: 999_999,
    }),
    "Belum Lunas"
  );
});
