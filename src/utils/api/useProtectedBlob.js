// path: src/utils/api/useProtectedBlob.js
//
// Mengambil dokumen terproteksi (KTP, swafoto, bukti transfer) yang hanya
// dapat diakses via GET /api/files/* dengan header Authorization: Bearer.
// <img src> dan <a href> tidak dapat mengirim header tersebut, sehingga
// berkas harus diambil lewat axios lalu ditampilkan sebagai object URL.

import { useEffect, useState } from "react";
import api from "./common";
import { toProtectedFileRequestPath } from "../helpers";

const PASSTHROUGH = /^(https?:|data:|blob:)/i;

export const useProtectedBlob = (path) => {
  const requestPath = toProtectedFileRequestPath(path);
  const isPassthrough = Boolean(requestPath) && PASSTHROUGH.test(requestPath);
  const [state, setState] = useState({ src: null, loading: false, error: null });

  useEffect(() => {
    let cancelled = false;
    let objectUrl = null;

    if (!requestPath) {
      setState({ src: null, loading: false, error: null });
      return undefined;
    }

    if (isPassthrough) {
      setState({ src: requestPath, loading: false, error: null });
      return undefined;
    }

    setState({ src: null, loading: true, error: null });

    api
      .get(requestPath, { responseType: "blob" })
      .then((res) => {
        if (cancelled) return;
        objectUrl = URL.createObjectURL(res.data);
        setState({ src: objectUrl, loading: false, error: null });
      })
      .catch((err) => {
        if (cancelled) return;
        setState({ src: null, loading: false, error: err });
      });

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [requestPath, isPassthrough]);

  return state;
};

export default useProtectedBlob;