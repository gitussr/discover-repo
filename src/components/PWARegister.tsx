"use client";

import { useEffect } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register(`${BASE_PATH}/sw.js`, { scope: `${BASE_PATH}/` }).catch(() => {
      // Offline/installability is a nice-to-have here, not load-bearing — a
      // failed registration (unsupported browser, blocked storage) should
      // never break the app itself.
    });
  }, []);

  return null;
}
