import Decimal from "decimal.js";

/**
 * Util aritmetika uang berbasis decimal.js (cermin backend `api.kkpus.id/utils/money.js`).
 *
 * Nilai finansial (tagihan, piutang, sisa) berasal dari kolom DECIMAL di DB. Aritmetika
 * dengan Number (IEEE-754) dapat menghasilkan drift (mis. 0,1 + 0,2 = 0,30000000000000004),
 * sehingga perbandingan seperti `paid >= totalRequired` bisa salah pada kasus batas.
 * Decimal.js bekerja pada basis-10 sehingga penjumlahan/pengurangan/pembulatan tunai akurat.
 */

/** Ubah nilai (string/number/null) menjadi Decimal aman. */
export const toDecimal = (value) => {
  if (value === null || value === undefined || value === "") return new Decimal(0);
  return new Decimal(value);
};

/** Jumlahkan sekumpulan nilai tanpa drift float. Mengembalikan Decimal. */
export const sumAmounts = (values) =>
  values.reduce((acc, v) => acc.plus(toDecimal(v)), new Decimal(0));

/** `subtractAmounts(a, b)` = a - b. Mengembalikan Decimal. */
export const subtractAmounts = (a, b) => toDecimal(a).minus(toDecimal(b));

/** Maksimum antara nilai dan 0 (untuk sisa piutang/saldo yang tidak boleh negatif). */
export const maxZero = (value) => {
  const d = toDecimal(value);
  return d.isNegative() ? new Decimal(0) : d;
};

/** Decimal/number/string -> Number untuk konsumsi UI (formatCurrency/toLocaleString). */
export const toNumber = (value) => toDecimal(value).toNumber();