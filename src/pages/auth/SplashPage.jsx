import React from "react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtEncode } from "../../utils/helpers";
import "./SplashPage.css";

const LOADING_MESSAGES = [
  "Memuat pengalaman terbaik...",
  "Menyiapkan antarmuka syariah...",
  "Menghubungkan ke layanan...",
  "Hampir selesai...",
];

const SplashPage = ({ delay = 1500, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const intervalRef = useRef(null);

  const handleSkip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    navigate(`/${jwtEncode({ page: "authLogin" })}`, { replace: true });
  }, [navigate]);

  const handlePauseToggle = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      if (next) {
        // Pause message rotation
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      } else {
        // Resume message rotation
        if (!intervalRef.current) {
          intervalRef.current = setInterval(() => {
            setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
          }, 1200);
        }
      }
      return next;
    });
  }, []);

  useEffect(() => {
    // Kurangi delay dari 3000ms ke 1500ms (menghormati Doherty Threshold)
    timerRef.current = setTimeout(handleSkip, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay, handleSkip]);

  useEffect(() => {
    // Rotasi pesan loading - bisa di-pause (WCAG 2.2.2 Timing Adjustable)
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1200);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPaused]);

  // HAPUS: purgeCacheAndCookies - melanggar privasi pengguna
  // Cookie dan sessionStorage tidak boleh dihapus tanpa izin eksplisit
  // Pengguna sudah login harus tetap dalam sesi (session persistence)

  return (
    <main
      className={`splashx-screen ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Memuat aplikasi Paguyuban Usaha Sukses"
    >
      <div className="splashx-stars" aria-hidden="true" />
      <div className="splashx-noise" aria-hidden="true" />
      <div className="splashx-orb splashx-orb-left" aria-hidden="true" />
      <div className="splashx-orb splashx-orb-right" aria-hidden="true" />

      <Container className="splashx-wrap">
        <section className="splashx-content text-center">
          <h1 className="splashx-title">
            <span className="splashx-title-white d-block">Paguyuban Usaha</span>
            <span className="splashx-title-green d-block">Sukses</span>
          </h1>
          <p className="splashx-subtitle">
            Koperasi & Layanan Pembiayaan
            <br />
            Usaha Syariah
          </p>

          <div className="splashx-mosque-illustration">
            {imageError ? (
              <div className="splashx-mosque-fallback" aria-hidden="true">
                <span className="splashx-mosque-icon">🕌</span>
              </div>
            ) : (
              <img
                src="/assets/icons/PUSlogo.png"
                alt="Logo PUS"
                className="splashx-mosque-image"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div className="splashx-loading-container" role="progressbar" aria-label="Progress pemuatan">
            <div className="splashx-loading-bar">
              <div className="splashx-loading-progress" aria-hidden="true" />
            </div>
            <p className="splashx-loading-text" aria-live="polite" aria-atomic="true">
              {LOADING_MESSAGES[msgIndex]}
            </p>
          </div>

          <div className="splashx-controls d-flex gap-2 justify-content-center mb-3">
            <button
              type="button"
              className="splashx-control-btn"
              onClick={handlePauseToggle}
              aria-label={isPaused ? "Lanjutkan animasi" : "Jeda animasi"}
              aria-pressed={isPaused}
            >
              {isPaused ? "▶ Lanjutkan" : "⏸ Jeda"}
            </button>

            <button
              type="button"
              className="splashx-skip-btn"
              onClick={handleSkip}
              aria-label="Lewati halaman pembuka dan langsung ke login"
            >
              Lewati →
            </button>
          </div>

          <p className="splashx-copyright">
            © 2025 Paguyuban Usaha Sukses. All rights reserved.
          </p>
        </section>
      </Container>
    </main>
  );
};

export default React.memo(SplashPage);
