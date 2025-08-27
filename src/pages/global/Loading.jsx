import { Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

/**
 * Komponen Loading universal.
 * Dapat digunakan di mana saja untuk menampilkan spinner loading.
 * Props opsional:
 *  - text: string, teks yang ditampilkan di bawah spinner (default: "Memuat…")
 *  - size: "sm" | "md" | "lg" | number, ukuran spinner (default: "md")
 *  - className: string, tambahan class CSS
 *  - variant: string, warna spinner (default: "primary")
 */
export default function Loading({
  text = "Memuat…",
  size = "md",
  className = "",
  variant = "primary",
  ...rest
}) {
  // Optimasi mapping size ke style spinner
  const spinnerSize = (() => {
    if (size === "sm") return { width: "1.5rem", height: "1.5rem" };
    if (size === "lg") return { width: "3rem", height: "3rem" };
    if (typeof size === "number")
      return { width: `${size}px`, height: `${size}px` };
    return { width: "2.2rem", height: "2.2rem" }; // default "md"
  })();

  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center ${className}`}
      {...rest}
    >
      <Spinner
        animation="border"
        role="status"
        variant={variant}
        style={spinnerSize}
        aria-label={text}
      >
        <span className="visually-hidden">{text}</span>
      </Spinner>
      {text && (
        <div
          className="mt-2 text-muted"
          style={{ fontSize: "1rem", textAlign: "center" }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

Loading.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.oneOf(["sm", "md", "lg"]),
    PropTypes.number,
  ]),
  className: PropTypes.string,
  variant: PropTypes.string,
};
