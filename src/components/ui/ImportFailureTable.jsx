import React, { useMemo, useState } from "react";
import { Table, Form, InputGroup, Button } from "react-bootstrap";
import {
  MagnifyingGlass,
  DownloadSimple,
  IdentificationCard,
  User,
  WarningCircle,
  Rows,
} from "phosphor-react";

/**
 * Ubah payload `errors` dari backend menjadi baris tabel yang seragam.
 *
 * Backend mengembalikan `errors: [{ row, reason, member_no, member_name, field }]`
 * (field identitas sudah dikirim eksplisit oleh controller import). Sebagai
 * fallback untuk payload lama, nomor anggota/nama disuling dari teks alasan.
 */
const normalizeRows = (errors = [], failedCount = 0) => {
  const mapped = errors.map((err, index) => {
    const reason = String(
      err.reason || err.message || err.error || "Kesalahan tidak diketahui"
    );
    const rowNumber =
      err.row ?? err.row_number ?? err.line ?? err.baris ?? null;

    // Identitas eksplisit dari backend (bila tersedia)
    const account = String(
      err.memberNo ??
        err.member_no ??
        err.account ??
        err.noAnggota ??
        err.no_anggota ??
        ""
    ).trim();
    const name = String(
      err.memberName ?? err.member_name ?? err.name ?? err.nama ?? ""
    ).trim();

    // Fallback: ekstrak nomor anggota dari teks alasan (payload lama).
    // Contoh: "Anggota dengan No. A009 tidak ditemukan", "No. Anggota A010 sudah terdaftar".
    const fromReason =
      reason.match(/Anggota\s+dengan\s+No\.?\s*([A-Za-z0-9._-]+)/i) ||
      reason.match(/No\.?\s*Anggota\s*[-: ]?\s*([A-Za-z0-9._-]+)/i) ||
      reason.match(/No\.?\s*[-: ]\s*([A-Za-z0-9._-]+)/i) ||
      null;

    const finalAccount = account || (fromReason ? fromReason[1] : "");

    return {
      key: `${rowNumber ?? "-"}-${index}`,
      row: rowNumber,
      account: finalAccount,
      name,
      reason,
      field: err.field ? String(err.field) : "",
    };
  });

  // Backend melaporkan ada baris gagal, tetapi tidak mengirim rinciannya.
  if (mapped.length === 0 && failedCount > 0) {
    mapped.push({
      key: "synthetic-0",
      row: null,
      account: "",
      name: "",
      reason: `${failedCount} baris gagal diproses. Rincian per baris tidak tersedia dari server.`,
      field: "",
    });
  }

  return mapped;
};

const ImportFailureTable = ({
  errors = [],
  failedCount = 0,
  filename = "Data_Gagal_Import",
}) => {
  const [query, setQuery] = useState("");

  const rows = useMemo(
    () => normalizeRows(errors, failedCount),
    [errors, failedCount]
  );

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.row, r.account, r.name, r.reason, r.field]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, query]);

  const hasAccountColumn = useMemo(
    () => rows.some((r) => r.account || r.name),
    [rows]
  );

  const handleDownload = () => {
    const header = [
      "Baris",
      ...(hasAccountColumn ? ["No. Anggota", "Nama Anggota"] : []),
      "Penyebab Gagal",
    ];

    const body = filteredRows.map((r) => [
      r.row ?? "-",
      ...(hasAccountColumn ? [r.account || "-", r.name || "-"] : []),
      r.reason,
    ]);

    const escapeCell = (value) => {
      const text = value === null || value === undefined ? "" : String(value);
      return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };

    const csv = [header, ...body]
      .map((cols) => cols.map(escapeCell).join(";"))
      .join("\r\n");

    // BOM agar Excel membaca UTF-8 dengan benar
    const blob = new Blob(["\ufeff" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (rows.length === 0) return null;

  return (
    <div className="text-start mt-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
        <div className="fw-semibold small text-danger d-flex align-items-center gap-2">
          <WarningCircle size={16} weight="fill" aria-hidden="true" />
          Daftar Baris Gagal ({rows.length})
        </div>
        <Button
          variant="outline-secondary"
          size="sm"
          className="d-inline-flex align-items-center gap-2"
          onClick={handleDownload}
        >
          <DownloadSimple size={14} weight="bold" aria-hidden="true" />
          Unduh CSV
        </Button>
      </div>

      <InputGroup size="sm" className="mb-2">
        <InputGroup.Text className="bg-white">
          <MagnifyingGlass size={14} weight="bold" aria-hidden="true" />
        </InputGroup.Text>
        <Form.Control aria-label="Filter Cari baris, no. anggota, nama, atau penyebab"
          placeholder="Cari baris, no. anggota, nama, atau penyebab..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <div
        className="border rounded-3"
        style={{ maxHeight: 260, overflowY: "auto" }}
      >
        <Table hover size="sm" className="mb-0 align-middle custom-table-admin">
          <thead className="sticky-top bg-light">
            <tr>
              <th style={{ width: 70 }} className="py-2">
                <Rows size={13} className="me-1" aria-hidden="true" />
                Baris
              </th>
              {hasAccountColumn && (
                <>
                  <th style={{ width: 140 }} className="py-2">
                    <IdentificationCard size={13} className="me-1" aria-hidden="true" />
                    No. Anggota
                  </th>
                  <th className="py-2">
                    <User size={13} className="me-1" aria-hidden="true" />
                    Nama
                  </th>
                </>
              )}
              <th className="py-2">Penyebab Gagal</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td
                  colSpan={hasAccountColumn ? 4 : 2}
                  className="text-center py-4 text-muted small"
                >
                  Tidak ada baris yang cocok dengan pencarian.
                </td>
              </tr>
            ) : (
              filteredRows.map((r) => (
                <tr key={r.key}>
                  <td className="fw-semibold text-muted">{r.row ?? "-"}</td>
                  {hasAccountColumn && (
                    <>
                      <td className="fw-semibold">
                        {r.account ? (
                          <span className="badge bg-light text-dark border">
                            {r.account}
                          </span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {r.name ? (
                          r.name
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </>
                  )}
                  <td>
                    <span className="text-danger">{r.reason}</span>
                    {r.field ? (
                      <span className="badge bg-danger-subtle text-danger-emphasis ms-2 fw-normal">
                        {r.field}
                      </span>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-2">
        <small className="text-muted">
          Menampilkan {filteredRows.length} dari {rows.length} baris gagal
        </small>
      </div>
    </div>
  );
};

export default React.memo(ImportFailureTable);
export { normalizeRows };