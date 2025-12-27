"use client";
import { useEffect, useRef } from "react";

export function useGlobalAudio() {
  const audioCtxRef = useRef(null);
  const unlockedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const unlock = () => {
      if (unlockedRef.current) return;

      unlockedRef.current = true;

      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointermove", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("wheel", unlock);
    };

    document.addEventListener("pointerdown", unlock);
    document.addEventListener("pointermove", unlock);
    document.addEventListener("touchstart", unlock);
    document.addEventListener("wheel", unlock);

    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointermove", unlock);
      document.removeEventListener("touchstart", unlock);
      document.removeEventListener("wheel", unlock);
    };
  }, []);

  return audioCtxRef;
}
