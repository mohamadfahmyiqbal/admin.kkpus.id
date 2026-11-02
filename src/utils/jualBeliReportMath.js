/**
 * Hitung angka jurnal jual beli dari total komponen laporan.
 *
 * Asumsi pencatatan (murabahah, snapshot periode):
 * - Kas bertambah sebesar DP + cicilan yang sudah dibayar.
 * - Piutang Usaha = total tagihan (pokok + margin) - kas yang sudah diterima.
 * - Sisi kredit: persediaan/HPP sebesar pokok + margin ditangguhkan.
 *
 * Dengan rumus ini total debit = kas + piutang = total tagihan, dan
 * total kredit = pokok + margin = total tagihan, sehingga margin tidak lagi
 * hilang dari laporan.
 */
export const computeJurnal = (totals = {}) => {
  const sum = (key) =>
    ["tahun_ini", "tahun_lalu", "tahun_lalu2"].reduce(
      (acc, year) => acc + Number(totals[year]?.[key] || 0),
      0
    );

  const piutangPokok = sum("pokok");
  const marginDitangguhkan = sum("margin");
  const kasDp = sum("dp");
  const kasCicilan = sum("cicilan");
  const kas = kasDp + kasCicilan;
  const totalTagihan = piutangPokok + marginDitangguhkan;
  const piutangJualBeli = Math.max(0, totalTagihan - kas);
  const totalDebit = kas + piutangJualBeli;
  const totalKredit = piutangPokok + marginDitangguhkan;

  return {
    totalDebit,
    totalKredit,
    piutangPokok,
    marginDitangguhkan,
    kasDp,
    kasCicilan,
    kas,
    piutangJualBeli,
    totalTagihan,
    selisih: totalDebit - totalKredit,
  };
};

export default computeJurnal;
