import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import api from "../../../utils/api/common";

const ProtectedDocViewer = ({ url, title }) => {
  const [blobUrl, setBlobUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentBlob = null;
    if (url && url !== "#") {
      (async () => {
        try {
          setLoading(true);
          const res = await api.get(url, { responseType: "blob" });
          currentBlob = URL.createObjectURL(res.data);
          setBlobUrl(currentBlob);
        } catch (err) {
          console.error("Failed to load protected file:", err);
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      setLoading(false);
    }

    return () => {
      if (currentBlob) URL.revokeObjectURL(currentBlob);
    };
  }, [url]);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-light text-secondary">
        <Spinner size="sm" animation="border" className="me-2" /> Memuat...
      </div>
    );
  }

  if (error || !url || url === "#") {
    return (
      <div className="d-flex align-items-center justify-content-center w-100 h-100 bg-light text-danger small">
        Gagal memuat dokumen
      </div>
    );
  }

  return (
    <iframe
      src={blobUrl}
      title={title}
      style={{ width: "100%", height: "100%", border: "none" }}
    />
  );
};

export default ProtectedDocViewer;
