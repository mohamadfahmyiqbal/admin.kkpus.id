import { createContext, useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * Theme context — mengelola mode terang/gelap aplikasi.
 *
 * Prioritas penentuan tema awal:
 *   1. Pilihan eksplisit pengguna di localStorage ("kkpus-theme")
 *   2. Preferensi sistem (prefers-color-scheme)
 *   3. Default: "light"
 *
 * Atribut `data-theme` dan `data-bs-theme` di-set pada <html>.
 * `data-bs-theme` memanfaatkan dukungan dark mode bawaan Bootstrap 5.3
 * sehingga komponen (card, table, modal, form, dropdown) otomatis menyesuaikan.
 */

const STORAGE_KEY = "kkpus-theme";
const ThemeContext = createContext(null);

const getInitialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
  } catch {
    // localStorage tidak tersedia — lanjut ke preferensi sistem
  }
  if (typeof window !== "undefined" && window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return "light";
};

const applyTheme = (theme) => {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.setAttribute("data-bs-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#0f172a" : "#02113d");
  }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);

  // Terapkan tema ke DOM setiap kali berubah.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Ikuti perubahan preferensi sistem HANYA jika pengguna belum memilih eksplisit.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return undefined;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => {
      let hasExplicit = false;
      try {
        hasExplicit = Boolean(localStorage.getItem(STORAGE_KEY));
      } catch {
        hasExplicit = false;
      }
      if (!hasExplicit) setTheme(e.matches ? "dark" : "light");
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Abaikan kegagalan penyimpanan (mis. mode privat)
      }
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme harus digunakan di dalam ThemeProvider");
  }
  return ctx;
};

export default ThemeContext;