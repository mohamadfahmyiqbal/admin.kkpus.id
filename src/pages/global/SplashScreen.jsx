import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Spinner } from "react-bootstrap";

/**
 * SplashScreen
 * - Navigasi otomatis ke halaman login
 * - Props:
 *    - delay: ms sebelum redirect (default 1200)
 *    - className: tambahan class CSS optional
 */
export default function SplashScreen({ delay = 1200, className = "" }) {
  const navigate = useNavigate();
  const timeoutRef = useRef();

  const getReducedMotion = useCallback(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  }, []);

  const [reducedMotion, setReducedMotion] = useState(getReducedMotion);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const styles = useMemo(
    () => ({
      page: {
        minHeight: "100vh",
        minWidth: "100vw",
        background: "linear-gradient(180deg, #13547A 0%, #80D0C7 100%)",
        overflow: "hidden",
        padding: 0,
      },
      logo: {
        width: "clamp(120px, 30vw, 320px)",
        height: "auto",
        display: "block",
        margin: "0 auto",
        filter: "drop-shadow(0 4px 4px rgba(0,0,0,.3))",
      },
      subtitle: {
        fontSize: "clamp(18px, 5vw, 48px)",
        fontFamily:
          "Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        textShadow: "0 4px 4px rgba(0,0,0,.3)",
      },
    }),
    []
  );

  useEffect(() => {
    const wait = Math.max(300, Number(delay) || 0);

    timeoutRef.current = setTimeout(() => {
      // Redirect langsung ke halaman login
      navigate("/login", { replace: true });
    }, wait);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [delay, navigate]);

  return (
    <Container
      fluid
      className={`d-flex flex-column justify-content-center align-items-center ${className}`}
      style={styles.page}
    >
      <Row className="w-100 justify-content-center align-items-center">
        <Col xs="auto">
          <img
            src="/assets/icons/pusLogo.png"
            alt="Logo PUS"
            style={styles.logo}
            aria-label="Logo PUS"
          />
        </Col>
      </Row>

      <Row className="w-100 justify-content-center align-items-center mt-3">
        <Col xs="auto">
          <h2
            className="text-white fw-bold m-0 text-center"
            style={styles.subtitle}
          >
            Paguyuban Usaha Sukses
          </h2>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col xs="auto">
          <Spinner
            animation={reducedMotion ? undefined : "border"}
            variant="light"
            role="status"
            aria-live="polite"
            aria-label="Memuat…"
          >
            <span className="visually-hidden">Memuat…</span>
          </Spinner>
        </Col>
      </Row>
    </Container>
  );
}
