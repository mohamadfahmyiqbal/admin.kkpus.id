import React, { useState } from "react";
import { Container, Row, Col, Card, Form, InputGroup, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import {
  FaUser,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaShieldAlt,
  FaUsers,
  FaChartLine,
  FaHeadset,
  FaSignInAlt,
  FaArrowRight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { jwtEncode } from "../../utils/helpers";
import "./LoginPage.css";

const LoginPage = () => {
  const [emailHp, setEmailHp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [emailHpInvalid, setEmailHpInvalid] = useState(false);
  const [passwordInvalid, setPasswordInvalid] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setEmailHpInvalid(false);
    setPasswordInvalid(false);

    const cleanEmail = emailHp.trim();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      if (!cleanEmail) setEmailHpInvalid(true);
      if (!cleanPass) setPasswordInvalid(true);
      setError("Email/Nomor Handphone dan Password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const apiBase =
        import.meta.env.VITE_API_BASE_URL ||
        (import.meta.env.PROD ? "https://api.kkpus.id/api" : "https://localhost:3445/api");
      const response = await fetch(`${apiBase}/auth/accountLogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailHp: cleanEmail, password: cleanPass }),
      });
      const data = await response.json();

      if (response.ok && data.success) {
        const roles = data.data.user.roles || [];
        const allowedRoles = ["pengawas", "ketua", "bendahara", "admin"];
        const hasAccess = roles.some((r) =>
          allowedRoles.includes(r.toLowerCase())
        );

        if (!hasAccess) {
          setError(
            "Akses ditolak: Hanya Pengawas, Ketua, atau Bendahara yang dapat mengakses aplikasi ini."
          );
          return;
        }

        localStorage.setItem("token", data.data.token);
        localStorage.setItem("userData", JSON.stringify(data.data.user));
        window.dispatchEvent(new Event("storage_sync"));
        navigate(`/${jwtEncode({ page: "dashboard" })}`);
      } else {
        setError(
          data.message ||
            "Kredensial tidak valid. Email/Nomor HP atau Password salah."
        );
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Terjadi kesalahan jaringan atau server tidak merespon.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pbs-login-v2">
      <header className="pbs-login-topbar">
        <Container fluid="lg">
          <div className="pbs-topbar-wrap py-3 d-flex justify-content-between align-items-center">
            <div className="pbs-topbar-brand">
              <a href="/" className="d-flex align-items-center gap-3 text-decoration-none">
                <img
                  src="/assets/icons/PUSlogo.png"
                  alt="PUS Logo"
                  className="pbs-brand-logo"
                  style={{ height: "40px" }}
                />
                <div>
                  <strong className="text-white d-block fs-5 mb-0 pbs-brand-title">
                    Paguyuban Usaha Sukses
                  </strong>
                </div>
              </a>
            </div>
            <div className="pbs-topbar-login d-flex align-items-center gap-3">
              <span className="d-none d-sm-inline text-white-50 small">
                Backoffice System
              </span>
            </div>
          </div>
        </Container>
      </header>

      <main className="pbs-login-content py-5">
        <Container fluid="lg">
          <Row className="g-5 align-items-stretch justify-content-center">
            <Col lg={6} className="d-none d-lg-block">
              <section className="pbs-login-left-v2 h-100">
                <div className="mosque-overlay" />
                <div className="pbs-login-info-wrap">
                  <div className="mb-4">
                    <span className="badge rounded-pill bg-success bg-opacity-25 text-success px-3 py-2 mb-3 pbs-login-badge">
                      PAGUYUBAN USAHA
                    </span>
                    <h1 className="display-5 fw-bold text-white mb-3 pbs-login-title">
                      Selamat Datang
                      <br />
                      di Panel
                      <br />
                      <span className="pbs-text-highlight">Backoffice</span>
                    </h1>
                    <p className="text-white-50 pbs-login-desc">
                      Panel administrasi untuk mengelola usaha, memantau simpanan, dan memproses layanan pembiayaan syariah. Bersama membangun ekonomi yang lebih berkah.
                    </p>
                  </div>
                  <div className="mb-5" />
                  <div className="d-flex flex-column gap-4">
                    {[
                      {
                        icon: <FaShieldAlt size={22} />,
                        title: "Manajemen Aman",
                        desc: "Sistem administrasi terpusat dan aman.",
                      },
                      {
                        icon: <FaUsers size={22} />,
                        title: "Kelola Anggota",
                        desc: "Pantau dan verifikasi data anggota dengan mudah.",
                      },
                      {
                        icon: <FaChartLine size={22} />,
                        title: "Laporan Real-time",
                        desc: "Akses laporan keuangan dan pertumbuhan secara instan.",
                      },
                    ].map((item, idx) => (
                      <div key={idx} className="d-flex align-items-start gap-3">
                        <div className="d-flex align-items-center justify-content-center rounded-3 pbs-benefit-icon-container">
                          {item.icon}
                        </div>
                        <div>
                          <h6 className="text-white fw-bold mb-1">{item.title}</h6>
                          <small className="text-white-50 d-block">{item.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div
                    className="d-flex align-items-center gap-3 p-4 rounded-4 border border-white border-opacity-10 mt-5"
                    style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  >
                    <div className="bg-success bg-opacity-20 p-2 rounded-circle d-flex align-items-center justify-content-center pbs-support-icon-container">
                      <FaHeadset className="pbs-support-icon text-success" />
                    </div>
                    <div>
                      <small className="d-block text-light">Dukungan Teknis?</small>
                      <span className="text-white fw-bold small">
                        Hubungi IT Support PUS
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            </Col>

            <Col lg={6} md={10} xs={12} className="d-flex flex-column justify-content-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-100"
              >
                <Card className="pbs-login-card-v2 w-100 border-0 shadow-sm">
                  <div className="pbs-login-card-body p-4 p-md-5">
                    <div className="text-center mb-4">
                      <div className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle pbs-card-icon-container bg-primary bg-opacity-10 text-primary" style={{ width: "64px", height: "64px" }}>
                        <FaSignInAlt size={30} />
                      </div>
                      <h3 className="fw-bold text-dark mb-1">Login Admin</h3>
                      <p className="text-muted small">
                        Masukkan kredensial admin Anda
                      </p>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="alert alert-danger mb-4 p-3 d-flex align-items-center gap-3 border-0 rounded-4 pbs-login-error-alert"
                      >
                        <div className="bg-danger bg-opacity-10 p-2 rounded-circle d-flex align-items-center justify-content-center pbs-login-error-icon-wrap">
                          <span className="fw-bold">!</span>
                        </div>
                        <span className="small fw-semibold">{error}</span>
                      </motion.div>
                    )}

                    <Form onSubmit={handleLogin} noValidate>
                      <Row className="g-4">
                        <Col md={12}>
                          <Form.Label>Username atau Email Admin</Form.Label>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaUser />
                            </InputGroup.Text>
                            <Form.Control
                              value={emailHp}
                              onChange={(e) => setEmailHp(e.target.value)}
                              isInvalid={emailHpInvalid}
                              placeholder="admin@koperasi.com"
                            />
                            <Form.Control.Feedback type="invalid">
                              Email atau Nomor HP wajib diisi
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Col>

                        <Col md={12}>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <Form.Label className="mb-0">Password</Form.Label>
                          </div>
                          <InputGroup>
                            <InputGroup.Text>
                              <FaLock />
                            </InputGroup.Text>
                            <Form.Control
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              isInvalid={passwordInvalid}
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                            />
                            <Button
                              variant="light"
                              className="border border-start-0 text-muted pbs-password-eye-btn"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </Button>
                            <Form.Control.Feedback type="invalid">
                              Password wajib diisi
                            </Form.Control.Feedback>
                          </InputGroup>
                        </Col>

                        <Col md={12} className="mt-4 pt-2">
                          <Button
                            type="submit"
                            disabled={loading}
                            className="pbs-submit-v2 w-100 btn-primary py-2 rounded-3"
                          >
                            {loading ? (
                              <>
                                <span
                                  className="spinner-border spinner-border-sm me-2"
                                  role="status"
                                  aria-hidden="true"
                                />
                                Memproses...
                              </>
                            ) : (
                              <>
                                Masuk ke Dashboard{" "}
                                <FaArrowRight size={14} className="ms-1" />
                              </>
                            )}
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default LoginPage;
