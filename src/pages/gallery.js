"use client";

import { useState, useEffect } from "react";
import artworks from "../data/artworks";
import Image from 'next/image'
import ThreeDGallery from "../components/ThreeDGallery";
import LowPowerGallery from "../components/LowPowerGallery";

export default function Gallery() {
  const [lowPowerMode, setLowPowerMode] = useState(null);
  const [isSwitching, setIsSwitching] = useState(false);

  // Load mode from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("galleryMode");
    setLowPowerMode(saved === "low");
  }, []);

  // Save mode
  useEffect(() => {
    if (lowPowerMode === null) return;
    localStorage.setItem("galleryMode", lowPowerMode ? "low" : "high");
  }, [lowPowerMode]);

  // Loader on switch
  const switchMode = () => {
    setIsSwitching(true); // show loader

    setTimeout(() => {
      // Switch the mode
      setLowPowerMode(prev => !prev);

      // Give the 3D component a moment to mount
      setTimeout(() => setIsSwitching(false), 600);
    }, 200);
  };

  if (lowPowerMode === null) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white logo-3">
        Loading mode...
      </div>
    );
  }

  return (
    <div className="relative">

      {/* ───────── TOGGLE BUTTON ───────── */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={switchMode}
          className="px-4 py-2 bg-black text-white text-sm rounded-lg shadow-md hover:bg-neutral-800 transition logo-3"
        >
          {lowPowerMode ? "Switch to Full Gallery" : "Switch to Single Pane"}
        </button>
      </div>

      {/* ───────── SWITCH LOADER ───────── */}
      {isSwitching && (
        <div className="fixed inset-0 z-40 flex items-center justify-center  backdrop-[#161515]-md transition-opacity">
          <div
            style={{
              padding: "12px 16px",
              color: "white",
              fontSize: "16px",
              borderRadius: "8px",
              // backdropFilter: "blur(6px)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <Image
              src="/globe-2.svg"
              alt="loading"
              className="logo-pic"
              width={20}
              height={20}
              style={{

                animation: "spin 0.6s linear infinite",
                opacity: 0.9,
              }}
            />
            <p className="logo-3">Loading...</p>
          </div>

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* ───────── GALLERY RENDERING ───────── */}
      <div className="w-full h-screen">
        {lowPowerMode ? (
          <LowPowerGallery artworks={artworks} />
        ) : (
          <ThreeDGallery artworks={artworks} />
        )}
      </div>
    </div>
  );
}
