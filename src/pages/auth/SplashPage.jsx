import React, { useState, useEffect, useCallback, useRef } from "react";
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

const SplashPage = ({ delay = 3000, className = "" }) => {
  const [imageError, setImageError] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const hasNavigatedRef = useRef(false);

  const handleSkip = useCallback(() => {
    if (hasNavigatedRef.current) return;
    hasNavigatedRef.current = true;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const token = localStorage.getItem("token");
    const targetPage = token ? "dashboard" : "authLogin";
    navigate(`/${jwtEncode({ page: targetPage })}`, { replace: true });
  }, [navigate]);

  useEffect(() => {
    timerRef.current = setTimeout(handleSkip, delay);
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [delay, handleSkip]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 750);
    return () => clearInterval(interval);
  }, []);

  return (
    <main
      className={`splashx-screen ${className}`}
      aria-label="Halaman pembuka Paguyuban Usaha Sukses"
    >
      <div className="splashx-stars" aria-hidden="true" />
      <div className="splashx-noise" aria-hidden="true" />
      <div className="splashx-orb splashx-orb-left" aria-hidden="true" />
      <div className="splashx-orb splashx-orb-right" aria-hidden="true" />

      <Container className="splashx-wrap">
        <section className="splashx-content text-center" aria-labelledby="splashx-heading">
          <h1 id="splashx-heading" className="splashx-title">
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
              <div
                className="splashx-mosque-fallback"
                role="img"
                aria-label="Logo Paguyuban Usaha Sukses"
              >
                <span className="splashx-mosque-icon" aria-hidden="true">
                  🕌
                </span>
              </div>
            ) : (
              <img
                src="/assets/icons/PUSlogo.png"
                alt="Logo Paguyuban Usaha Sukses"
                width="160"
                height="160"
                className="splashx-mosque-image"
                onError={() => setImageError(true)}
              />
            )}
          </div>

          <div
            className="splashx-loading-container"
            role="progressbar"
            aria-label="Proses memuat aplikasi"
            aria-busy="true"
          >
            <div className="splashx-loading-bar">
              <div className="splashx-loading-progress" aria-hidden="true" />
            </div>
            <p className="splashx-loading-text" role="status" aria-live="polite">
              {LOADING_MESSAGES[msgIndex]}
            </p>
          </div>

          <button
            type="button"
            className="splashx-skip-btn"
            onClick={handleSkip}
            aria-label="Lewati halaman pembuka"
          >
            Lewati
          </button>

          <p className="splashx-copyright">
            © {new Date().getFullYear()} Paguyuban Usaha Sukses. All rights reserved.
          </p>
        </section>
      </Container>
    </main>
  );
};

export default React.memo(SplashPage);
