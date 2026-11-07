import React, { useEffect } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

export const PwaUpdatePrompt = () => {
  const { needRefresh: [needRefresh, setNeedRefresh], updateServiceWorker } = useRegisterSW({
    onRegistered(registration) {
      if (registration) {
        setInterval(() => {
          registration.update().catch((err) => console.warn("PWA update check failed:", err));
        }, 60 * 60 * 1000);
      }
    },
    onRegisterError(error) {
      console.warn("Service Worker registration error:", error);
    },
  });

  useEffect(() => {
    if (!needRefresh) return;
    updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);

  return null;
};

export default PwaUpdatePrompt;