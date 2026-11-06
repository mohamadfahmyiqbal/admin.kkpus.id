import { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { getSocket } from "../utils/api/socket";

/**
 * Hook global di admin panel untuk memantau pembaruan real-time dari backend (Socket.io).
 * Menampilkan SweetAlert toast / alert informatif dengan tombol Refresh jika ada data/aplikasi baru.
 */
export const useSocketUpdateListener = () => {
  const isAlertShowingRef = useRef(false);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleUpdate = (payload = {}) => {
      // Mencegah penumpukan dialog SweetAlert jika banyak event datang bersamaan
      if (isAlertShowingRef.current) return;
      isAlertShowingRef.current = true;

      const title = payload.title || "Pembaruan Data Baru";
      const message =
        payload.message ||
        "Terdapat data atau pembaruan baru dari sistem. Muat ulang halaman untuk melihat perubahan?";

      Swal.fire({
        title,
        text: message,
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Muat Ulang Halaman",
        cancelButtonText: "Nanti Saja",
        confirmButtonColor: "#0d6efd",
        cancelButtonColor: "#6c757d",
        backdrop: true,
        allowOutsideClick: true,
      }).then((result) => {
        isAlertShowingRef.current = false;
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    };

    // Event broadcast pembaruan data dan rilis aplikasi
    socket.on("APPROVAL_UPDATE", handleUpdate);
    socket.on("REGISTRATION_UPDATED", handleUpdate);
    socket.on("TRANSACTION_UPDATED", handleUpdate);
    socket.on("WITHDRAWAL_UPDATED", handleUpdate);
    socket.on("DATA_UPDATE", handleUpdate);
    socket.on("APP_UPDATE", handleUpdate);
    socket.on("SYSTEM_UPDATE", handleUpdate);

    return () => {
      socket.off("APPROVAL_UPDATE", handleUpdate);
      socket.off("REGISTRATION_UPDATED", handleUpdate);
      socket.off("TRANSACTION_UPDATED", handleUpdate);
      socket.off("WITHDRAWAL_UPDATED", handleUpdate);
      socket.off("DATA_UPDATE", handleUpdate);
      socket.off("APP_UPDATE", handleUpdate);
      socket.off("SYSTEM_UPDATE", handleUpdate);
    };
  }, []);
};

export default useSocketUpdateListener;
