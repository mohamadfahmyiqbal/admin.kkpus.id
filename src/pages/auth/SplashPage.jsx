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

  const handleSkip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate(`/${jwtEncode({ page: "authLogin" })}`, { replace: true });
  }, [navigate]);

  useEffect(() => {
    timerRef.current = setTimeout(handleSkip, delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [delay, handleSkip]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

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

          <div className="splashx-loading-container" role="progressbar">
            <div className="splashx-loading-bar">
              <div className="splashx-loading-progress" aria-hidden="true" />
            </div>
            <p className="splashx-loading-text">
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
            © 2025 Paguyuban Usaha Sukses. All rights reserved.
          </p>
        </section>
      </Container>
    </main>
  );
};

export default React.memo(SplashPage);
