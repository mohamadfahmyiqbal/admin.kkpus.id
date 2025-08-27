import { useState, useCallback, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
// Hapus import toast, ganti dengan notifikasi global
// import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import UAnggota from "../../utils/UAnggota";
import { showNotifikasi } from "./Notikasi";

const initialForm = { email: "", password: "" };

export default function LoginScreen() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  // Optimasi handleChange: update error hanya jika ada
  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    },
    [errors]
  );

  // Validasi: cek format email & password minimal 8 karakter, password harus ada huruf & angka
  const validate = (data) => {
    const newErrors = {};
    if (!data.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
      newErrors.email = "Format email tidak valid";
    }
    if (!data.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (data.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(data.password)) {
      newErrors.password = "Password harus mengandung huruf dan angka";
    }
    return newErrors;
  };

  // Handle submit login
  const handleLoginSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setErrors({});

      const newErrors = validate(formData);
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        // Fokus ke input pertama yang error
        if (newErrors.email && emailRef.current) {
          emailRef.current.focus();
        } else if (newErrors.password && passwordRef.current) {
          passwordRef.current.focus();
        }
        return;
      }

      setLoading(true);
      try {
        const res = await UAnggota.login(formData);
        localStorage.setItem("token", res.data.token);
        showNotifikasi("success", res.data?.message || "Login berhasil", {
          autoClose: 1500,
        });
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } catch (err) {
        let newErrors = {};
        let toastMsg = "";

        if (err.response?.data?.message) {
          toastMsg = err.response.data.message;
          // Jika error spesifik pada field, tampilkan di field
          if (/email/i.test(toastMsg) && !/password/i.test(toastMsg)) {
            newErrors.email = toastMsg;
          } else if (/password/i.test(toastMsg) && !/email/i.test(toastMsg)) {
            newErrors.password = toastMsg;
          } else {
            newErrors.email = toastMsg;
            newErrors.password = toastMsg;
          }
        } else {
          newErrors.email = "Login gagal. Silakan coba lagi.";
          newErrors.password = "Login gagal. Silakan coba lagi.";
          toastMsg = "Login gagal. Silakan coba lagi.";
        }
        setErrors(newErrors);
        showNotifikasi("error", toastMsg, {
          autoClose: 3000,
          closeOnClick: true,
        });
        // Fokus ke input pertama yang error
        if (newErrors.email && emailRef.current) {
          emailRef.current.focus();
        } else if (newErrors.password && passwordRef.current) {
          passwordRef.current.focus();
        }
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  return (
    <Container
      fluid
      className="d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: `url('/assets/images/background/bg1.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={8} md={6} lg={4} xl={3}>
          <Card className="login-box border border-2 shadow-lg">
            <Card.Body>
              <Form
                id="loginform"
                className="mt-4"
                onSubmit={handleLoginSubmit}
                autoComplete="off"
              >
                <div className="text-center mb-4">
                  <img
                    src="/assets/icons/pus.png"
                    alt="Logo"
                    className="mb-3"
                    style={{ maxWidth: 120, maxHeight: 120 }}
                  />
                </div>

                <div className="text-center mb-3">
                  <span style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                    Assalamualaikum, silahkan login untuk melanjutkan
                  </span>
                </div>

                <Form.Group controlId="email" className="mt-4">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    ref={emailRef}
                    type="email"
                    placeholder="Masukkan email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    isInvalid={!!errors.email}
                    autoFocus
                    autoComplete="email"
                    disabled={loading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="password" className="mt-3">
                  <Form.Label className="fw-semibold">Password</Form.Label>
                  <InputGroup>
                    <Form.Control
                      ref={passwordRef}
                      type={showPassword ? "text" : "password"}
                      placeholder="Masukkan password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      autoComplete="current-password"
                      disabled={loading}
                      minLength={8}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword((v) => !v)}
                      tabIndex={0}
                      aria-label={
                        showPassword
                          ? "Sembunyikan password"
                          : "Tampilkan password"
                      }
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        border: "1px solid #ced4da",
                        borderTopRightRadius: ".375rem",
                        borderBottomRightRadius: ".375rem",
                        background: "white",
                        color: "#6c757d",
                        zIndex: 2,
                        boxShadow: "none",
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          setShowPassword((v) => !v);
                        }
                      }}
                    >
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </Button>
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <div
                    className="form-text text-muted mt-1"
                    style={{ fontSize: "0.95em" }}
                  >
                    Password minimal 8 karakter, harus mengandung huruf dan
                    angka.
                  </div>
                </Form.Group>

                <Form.Group className="text-center mt-4">
                  <Button
                    className="btn-lg bg-blue700 text-white w-100 text-uppercase"
                    variant="info"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loading text="Memeriksa..." size="md" variant="light" />
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
