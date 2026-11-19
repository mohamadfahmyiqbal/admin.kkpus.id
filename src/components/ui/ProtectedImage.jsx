// path: src/components/ui/ProtectedImage.jsx
//
// Menampilkan gambar dokumen terproteksi. Berkas diambil lewat API dengan
// header Bearer (lihat useProtectedBlob), bukan <img src> langsung, karena
// endpoint /api/files/* menolak permintaan tanpa Authorization.

import { Spinner } from "react-bootstrap";
import { SVG_FALLBACK_IMAGE } from "../../utils/helpers";
import { useProtectedBlob } from "../../utils/api/useProtectedBlob";

const ProtectedImage = ({
  path,
  alt = "",
  className,
  style,
  fallback = SVG_FALLBACK_IMAGE,
  onError,
  asLink = false,
  ...imgProps
}) => {
  const { src, loading, error } = useProtectedBlob(path);

  if (loading) {
    return (
      <div
        className={className}
        style={{ ...style, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}
        role="status"
        aria-label={`Memuat ${alt || "dokumen"}`}
      >
        <Spinner animation="border" size="sm" className="text-secondary" />
      </div>
    );
  }

  const image = error || !src
    ? <img src={fallback} alt={alt} className={className} style={style} {...imgProps} />
    : (
      <img
        src={src}
        alt={alt}
        className={className}
        style={style}
        onError={(e) => {
          if (onError) return onError(e);
          e.target.onerror = null;
          e.target.src = fallback;
        }}
        {...imgProps}
      />
    );

  // Saat src sudah berupa object URL, tautan langsung ke URL tersebut aman:
  // tidak ada secret di URL dan tidak perlu fetch kedua.
  if (asLink && src && !error) {
    return (
      <a href={src} target="_blank" rel="noopener noreferrer">
        {image}
      </a>
    );
  }

  return image;
};

export { ProtectedImage };
export default ProtectedImage;