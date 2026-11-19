import { Component } from "react";
import { Button, Container } from "react-bootstrap";

/**
 * Error Boundary untuk menangkap error React di level aplikasi.
 * Mencegah seluruh aplikasi crash ketika ada komponen yang error.
 * 
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state agar render fallback UI pada next render
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log error ke error reporting service (mis: Sentry)
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
    
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload halaman untuk reset state
    window.location.href = window.location.origin;
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center">
          <div className="text-center p-5 bg-white rounded shadow-sm" style={{ maxWidth: "500px" }}>
            <h1 className="display-4 text-danger mb-3">Oops!</h1>
            <h4 className="mb-3">Terjadi Kesalahan</h4>
            <p className="text-muted mb-4">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi administrator.
            </p>
            
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="text-start mb-4 p-3 bg-light rounded">
                <small className="text-muted">Development Error Details:</small>
                <pre className="mt-2 mb-0 text-danger" style={{ fontSize: "12px", whiteSpace: "pre-wrap" }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </div>
            )}
            
            <div className="d-flex gap-2 justify-content-center">
              <Button variant="outline-secondary" onClick={() => window.history.back()}>
                Kembali
              </Button>
              <Button variant="primary" onClick={this.handleReset}>
                Muat Ulang
              </Button>
            </div>
            
            <p className="mt-4 text-muted small">
              Jika masalah berlanjut, hubungi tim support dengan menyertakan screenshot error ini.
            </p>
          </div>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
