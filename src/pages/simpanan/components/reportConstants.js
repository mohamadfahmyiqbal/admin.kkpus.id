import React from "react";

export const formatRupiah = (val) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(val || 0);

export const REPORT_SEARCH_PLACEHOLDERS = [
  "",
  "Cari Nama",
  "Cari Total",
  "Cari Pokok",
  "Cari Wajib",
  "Cari Sukarela",
  "Cari Total",
  "Cari Pokok",
  "Cari Wajib",
  "Cari Sukarela",
  "Cari Total",
  "Cari Pokok",
];
