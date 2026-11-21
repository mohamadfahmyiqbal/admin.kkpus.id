import PropTypes from "prop-types";
import { X } from "phosphor-react";
import { Form, Button } from "react-bootstrap";

/**
 * FilterField — Komponen filter reusable/templateable untuk tabel dan halaman laporan.
 *
 * Tujuan: konsolidasikan implementasi filter yang sebelumnya tersebar per-halaman
 * (setiap halaman menulis Form.Control sendiri dengan styling dan aria-label yang bervariasi)
 * ke satu komponen terpusat yang konsisten, teruji, dan ramai aksesibilitas.
 *
 * Aksesibilitas (WCAG 2.2 AA):
 * - <label htmlFor> terprogram terhubung dengan input (1.3.1, 3.3.2)
 * - aria-label konsisten untuk screen reader
 * - Touch target ≥ 44×44 px via CSS global (admin-theme.css)
 * - Fokus-visible via CSS global
 * - Pesan error dihubungkan via aria-describedby (3.3.3)
 *
 * Contoh penggunaan:
 *   <FilterField
 *     id="filter-nama"
 *     label="Nama"
 *     value={filters.nama}
 *     onChange={(v) => setFilters({ ...filters, nama: v })}
 *     placeholder="Cari nama anggota..."
 *   />
 *
 *   <FilterField
 *     id="filter-status"
 *     label="Status"
 *     type="select"
 *     value={filters.status}
 *     onChange={(v) => setFilters({ ...filters, status: v })}
 *     options={[
 *       { value: "", label: "Semua" },
 *       { value: "aktif", label: "Aktif" },
 *       { value: "nonaktif", label: "Nonaktif" },
 *     ]}
 *   />
 */
export const FilterField = ({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  options = [],
  disabled = false,
  required = false,
  isInvalid = false,
  errorMessage = "Kolom wajib diisi",
  size = "sm",
  clearable = false,
  onClear,
  className = "",
  ariaLabel,
}) => {
  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onChange("");
    if (onClear) onClear();
  };

  const isSelect = type === "select";
  const inputId = id || `filter-${label.toLowerCase().replace(/\s+/g, "-")}`;
  const accessibleLabel = ariaLabel || `Filter ${label || inputId}`;

  return (
    <Form.Group className={`filter-field ${className}`.trim()} controlId={inputId}>
      {label && (
        <Form.Label
          htmlFor={inputId}
          className="filter-field-label fw-medium text-dark small mb-1"
        >
          {label}
          {required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
      )}

      {isSelect ? (
        <Form.Select
          id={inputId}
          as="select"
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={isInvalid}
          size={size}
          className={`filter-field-select rounded-2 shadow-none border-secondary border-opacity-25 ${className}`.trim()}
          aria-label={accessibleLabel}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          id={inputId}
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={isInvalid}
          size={size}
          className={`filter-field-input rounded-2 shadow-none border-secondary border-opacity-25 ${className}`.trim()}
          aria-label={accessibleLabel}
          aria-describedby={isInvalid ? `${inputId}-error` : undefined}
        />
      )}

      {clearable && value && (
        <Button
          type="button"
          variant="link"
          size={size}
          onClick={handleClear}
          className="filter-field-clear p-1 border-0 bg-transparent"
          aria-label="Hapus filter"
          title="Hapus filter"
        >
          <X size={14} weight="bold" aria-hidden="true" />
        </Button>
      )}

      {isInvalid && (
        <Form.Control.Feedback type="invalid" id={`${inputId}-error`}>
          {errorMessage}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

FilterField.propTypes = {
  /** ID unik untuk input dan label terprogram */
  id: PropTypes.string.isRequired,
  /** Teks label yang ditampilkan */
  label: PropTypes.string,
  /** Nilai terkontrol input */
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  /** Handler saat nilai berubah, menerima string */
  onChange: PropTypes.func,
  /** Tipe input: text, number, email, date, select */
  type: PropTypes.oneOf(["text", "number", "email", "date", "select"]),
  /** Placeholder teks */
  placeholder: PropTypes.string,
  /** Opsi untuk type select */
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  /** Input disabled */
  disabled: PropTypes.bool,
  /** Input required */
  required: PropTypes.bool,
  /** Tampilkan state invalid */
  isInvalid: PropTypes.bool,
  /** Pesan error saat invalid */
  errorMessage: PropTypes.string,
  /** Ukuran input: sm, md, lg */
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  /** Tampilkan tombol clear saat ada nilai */
  clearable: PropTypes.bool,
  /** Handler saat tombol clear diklik */
  onClear: PropTypes.func,
  /** Kelas CSS tambahan */
  className: PropTypes.string,
  /** Override aria-label */
  ariaLabel: PropTypes.string,
};

FilterField.defaultProps = {
  type: "text",
  placeholder: "",
  options: [],
  disabled: false,
  required: false,
  isInvalid: false,
  errorMessage: "Kolom wajib diisi",
  size: "sm",
  clearable: false,
  className: "",
};

export default FilterField;
