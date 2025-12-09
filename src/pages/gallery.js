"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import ArtCard from "../components/ArtCard";
import artworks from "../data/artworks";
import ThreeDGallery from "../components/ThreeDGallery";
import LowPowerGallery from "../components/LowPowerGallery"; // ← Import low-power version

export default function Gallery() {
  // --- NEW: Manual toggle between HIGH and LOW power mode ---
  const [lowPowerMode, setLowPowerMode] = useState(false);

  return (
    <div className="relative">

      {/* ───────── POWER MODE TOGGLE BUTTON ───────── */}
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setLowPowerMode((prev) => !prev)}
          className="px-4 py-2 bg-black text-white text-sm rounded-lg shadow-md hover:bg-neutral-800 transition"
        >
          {lowPowerMode ? "Switch to High-Power Mode" : "Switch to Low-Power Mode"}
        </button>
      </div>

      {/* ───────── GALLERY RENDERING ───────── */}
      <div className="w-full h-screen">
        {lowPowerMode ? (
          <LowPowerGallery artworks={artworks} />   // Low-power version
        ) : (
          <ThreeDGallery artworks={artworks} />           // High-power version
        )}
      </div>
    </div>
  );
}
