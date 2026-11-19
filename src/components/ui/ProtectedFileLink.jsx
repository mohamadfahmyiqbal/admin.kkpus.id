// path: src/components/ui/ProtectedFileLink.jsx
//
// Tautan ke dokumen terproteksi. Dokumen diambil via axios dengan header
// Bearer, lalu dibuka sebagai object URL. <a href> biasa tidak bisa dipakai
// karena endpoint /api/files/* menolak permintaan tanpa Authorization.

import { useState } from "react";
import api from "../../utils/api/common";
import { toProtectedFileRequestPath } from "../../utils/helpers";

const PASSTHROUGH = /^(https?:|data:|blob:)/i;

const ProtectedFileLink = ({
  path,
  children,
  className,
  style,
  target = "_blank",
  rel = "noopener noreferrer",
  onOpenError,
  ...anchorProps
}) => {
  const [busy, setBusy] = useState(false);
  const requestPath = toProtectedFileRequestPath(path);

  const handleClick = async (event) => {
    event.preventDefault();
    if (!requestPath) return;

    setBusy(true);
    let objectUrl = null;
    try {
      let url = requestPath;
      if (!PASSTHROUGH.test(requestPath)) {
        const res = await api.get(requestPath, { responseType: "blob" });
        objectUrl = URL.createObjectURL(res.data);
        url = objectUrl;
      }
      window.open(url, target, "noopener,noreferrer");
      if (objectUrl) {
        // Object URL hanya diperlukan selama tab baru masih memakainya.
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
      }
    } catch (err) {
      if (onOpenError) onOpenError(err);
    } finally {
      setBusy(false);
    }
  };

  return (
    <a
      href="#"
      onClick={handleClick}
      className={className}
      style={style}
      rel={rel}
      aria-busy={busy}
      {...anchorProps}
    >
      {children}
    </a>
  );
};

export { ProtectedFileLink };
export default ProtectedFileLink;