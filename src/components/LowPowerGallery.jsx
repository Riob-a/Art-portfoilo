"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { OrbitControls, Html, Environment } from "@react-three/drei";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaDownload, FaSearch } from "react-icons/fa";
import { a, useSpring } from "@react-spring/three";

// ─── DEVICE POWER DETECTION ──────────────────────────────────────────────────
function detectDeviceTier() {
  if (typeof window === "undefined") return "mid";

  const cores = navigator.hardwareConcurrency ?? 2;

  // navigator.deviceMemory is Chrome/Android only — falls back gracefully
  const ram = navigator.deviceMemory ?? 4;

  // GPU tier via WebGL renderer string
  let gpuScore = 1; // default: mid
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl) {
      const ext = gl.getExtension("WEBGL_debug_renderer_info");
      if (ext) {
        const renderer = gl
          .getParameter(ext.UNMASKED_RENDERER_WEBGL)
          .toLowerCase();
        // High-end GPU signals
        if (
          /rtx|rx 6|rx 7|rx 5700|m[12] (pro|max|ultra)|a\d{4}|quadro/i.test(
            renderer
          )
        )
          gpuScore = 2;
        // Low-end GPU signals
        else if (
          // /intel (uhd 6[0-5]|hd [456]|hd graphics)|mali-[gt][0-9]+|adreno [0-9]{3}[^0-9]|powervr/i.test(
          //   renderer
           /intel (uhd 6[0-5]|hd [456]|hd graphics)|mali-[gt][0-9]+|adreno \(tm\) [0-9]+|adreno [0-9]{3}[^0-9]|powervr/i.test(
            renderer
          )
        )
          gpuScore = 0;
      }
    }
  } catch (_) { }

  try {
  const adreno = renderer.match(/adreno[^0-9]+(\d+)/i);
  if (adreno && parseInt(adreno[1]) < 500) return "low";
} catch(_) {}

  // Network hint (saves on texture env loads on slow connections)
  const conn = navigator.connection;
  const slowNetwork =
    conn &&
    (conn.saveData ||
      conn.effectiveType === "2g" ||
      conn.effectiveType === "slow-2g");

  if (slowNetwork) return "low";

  const score = cores + ram / 2 + gpuScore * 2;
  if (score >= 10) return "high";
  if (score >= 5) return "mid";
  return "low";
}

// Maps tier → drei <Environment> props (or null to skip entirely)
const ENV_CONFIG = {
  high: { preset: "dawn", environmentIntensity: 1.0 },
  mid: { preset: "dawn", environmentIntensity: 0.6 },
  low: null, // skip Environment completely; fallback to flat lights only
};

// Maps tier → directional light intensities [front, back]
const LIGHT_CONFIG = {
  high: [3.7, 3.6],
  mid: [2.8, 2.2],
  low: [1.8, 1.2],
};
// ─────────────────────────────────────────────────────────────────────────────


// --- SINGLE BEVELED CARD ---
function LPBeveledCard({ width, height, depth }) {
  const shape = useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    const s = new THREE.Shape();
    s.moveTo(-w, -h);
    s.lineTo(w, -h);
    s.lineTo(w, h);
    s.lineTo(-w, h);
    s.lineTo(-w, -h);
    return s;
  }, [width, height]);

  const extrudeSettings = useMemo(
    () => ({
      steps: 1,
      depth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 2,
    }),
    [depth]
  );

  return (
    <mesh>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}
/*  Recess for sunk card */
function RecessedFrame({ width, height, depth = 0.2, inset = 0.15 }) {
  const shape = useMemo(() => {
    const w = width / 2;
    const h = height / 2;
    const holeW = w - inset;
    const holeH = h - inset;
    const s = new THREE.Shape();
    s.moveTo(-w, -h);
    s.lineTo(w, -h);
    s.lineTo(w, h);
    s.lineTo(-w, h);
    s.closePath();
    //  inner cut-out (the depression)
    const hole = new THREE.Path();
    hole.moveTo(-holeW, -holeH);
    hole.lineTo(holeW, -holeH);
    hole.lineTo(holeW, holeH);
    hole.lineTo(-holeW, holeH);
    hole.closePath();
    s.holes.push(hole);
    return s;
  }, [width, height, inset]);

  return (
    <mesh position={[0, 0, 0.26]}>
      <extrudeGeometry
        args={[
          shape,
          {
            depth,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.03,
            bevelSegments: 3,
          },
        ]}
      />
      <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

// --- SINGLE CARD COMPONENT ---
function LPSingleCard({
  art,
  clicked,
  setClicked,
  onOpenModal,
  modalOpen,
  float = true,
  tier, 
}) {
  const meshRef = useRef();
  const clickTimeout = useRef(null);
  const [held, setHeld] = useState(false);
  const holdTimeout = useRef(null);
  const HOLD_DELAY = 320;
  const BACK_TEXT_WIDTH = 0.12;

  const texture = useLoader(TextureLoader, art.imageUrl);
  useMemo(() => {
    if (texture) {
      texture.flipY = true;
      texture.needsUpdate = true;
    }
  }, [texture]);
  // Float animation
  useFrame(({ clock }) => {
    if (meshRef.current && float && clicked === null) {
      meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2;
    }
  });
  // Hover scale
  const [hovered, setHovered] = useState(false);
  const spring = useSpring({
    scale: hovered || clicked || held ? 1.08 : 1,
    rotation: clicked || held ? [0, Math.PI * 1.1, 0] : [0, 0, 0],
    positionZ: clicked || held ? 0.5 : 0,
    config:
      clicked || held
        ? { tension: 240, friction: 22 }
        : { tension: 170, friction: 20 },
  });

  const cardHeight = 3;
  const aspect = texture.image
    ? texture.image.width / texture.image.height
    : 1;
  const cardWidth = aspect * cardHeight;

  return (
    <a.group
      ref={meshRef}
      scale={spring.scale.to((s) => [s, s, s])}
      rotation={spring.rotation}
      position-z={spring.positionZ}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (modalOpen) return;
        holdTimeout.current = setTimeout(() => {
          setHeld(true);
          setClicked(null);
        }, HOLD_DELAY);
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (holdTimeout.current) {
          clearTimeout(holdTimeout.current);
          holdTimeout.current = null;
        }
        // RELEASE FROM HOLD → RETURN
        if (held) { setHeld(false); return; }
        // DOUBLE CLICK → MODAL
        if (clickTimeout.current) {
          clearTimeout(clickTimeout.current);
          clickTimeout.current = null;
          onOpenModal();
          return;
        }
        // SINGLE CLICK → TEMP FLIP
        setClicked(true);
        clickTimeout.current = setTimeout(() => {
          setClicked(null);
          clickTimeout.current = null;
        }, 600);
      }}
      onPointerLeave={() => {
        if (holdTimeout.current) {
          clearTimeout(holdTimeout.current);
          holdTimeout.current = null;
        }
      }}
    >
      <LPBeveledCard
        width={cardWidth + 0.12}
        height={cardHeight + 0.12}
        depth={0.5}
      />

      {/* BACK FACE INFO */}
      {!modalOpen && (
        <Html
          position={[
            -cardWidth / 2 + BACK_TEXT_WIDTH / 2,
            -cardHeight / 2 + 0.1,
            -0.26,
          ]}
          rotation={[0, Math.PI, 0]}
          transform
          distanceFactor={5.5}
          occlude
        >
          <div
            style={{
              maxWidth: "200px",
              fontSize: "10px",
              lineHeight: 1.2,
              color: "#bbb",
              pointerEvents: "none",
              opacity: clicked || held ? 1 : 0,
              transition: "opacity 0.25s ease 0.15s",
              background: "rgba(20, 12, 4, 0.82)",
              outline: "1px solid grey",
              cursor: "pointer",
            }}
          >
            <div
              className="modal-text m-1 p-3"
              style={{
                fontWeight: 800,
                color: "#EF9F27",
                fontSize: "16px",
                marginBottom: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderBottom: "1px solid rgba(255,255,255,0.15)",
                paddingBottom: "8px",
              }}
            >
              {art.title}
            </div>
            <div
              className="p-1"
              style={{
                fontWeight: 400,
                fontSize: "10px",
                color: "rgba(255,255,255,0.88)",
                lineHeight: 1.4,
                opacity: 0.75,
              }}
            >
              {art.description}
            </div>
          </div>
        </Html>
      )}

      {/* RECESSED FRAME */}
      <RecessedFrame
        width={cardWidth + 0.22}
        height={cardHeight + 0.22}
        depth={0.45}
        inset={0.125}
      />

      <mesh position={[0, 0, 0.61]}>
        <planeGeometry args={[cardWidth, cardHeight]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>
      {/* GLASS PANE */}
      {tier !== "low" && (
        <mesh position={[0, 0, 0.68]}>
          <planeGeometry args={[cardWidth, cardHeight]} />
          <meshPhysicalMaterial
            transmission={0}
            transparent
            color="rgba(0, 0, 0, 1)"
            opacity={0.12}
            roughness={0.01}
            thickness={0.1}
            ior={1.01}
            reflectivity={1}
            depthWrite={false}
            samples={1}
            resolution={256}
          />
        </mesh>)}
    </a.group>
  );
}
//  Screen size render conditional (Redundant)
// function useIsLargeScreen(breakpoint = 1024) {
//   const [isLarge, setIsLarge] = useState(false);
//   useEffect(() => {
//     const check = () => setIsLarge(window.innerWidth >= breakpoint);
//     check();
//     window.addEventListener("resize", check);
//     return () => window.removeEventListener("resize", check);
//   }, [breakpoint]);
//   return isLarge;
// }

// --- LOW-POWER SINGLE-CARD GALLERY ---
export default function LowPowerGallery({ artworks }) {
  const [index, setIndex] = useState(0);
  const [clicked, setClicked] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // Detect once on mount — stable for the session
  const [tier, setTier] = useState("mid");
  useEffect(() => { setTier(detectDeviceTier()); }, []);

  //   const isLargeScreen = useIsLargeScreen(1024);
  const currentArt = artworks[index];

  const envConfig = ENV_CONFIG[tier];
  const [frontLight, backLight] = LIGHT_CONFIG[tier];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    const t = detectDeviceTier();
    setTier(t);
    console.log("Device tier:", t);

    // also log the raw GPU string
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl");
      const ext = gl?.getExtension("WEBGL_debug_renderer_info");
      if (ext) console.log("GPU:", gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
    } catch (_) { }
  }, []);

  // Preload next/prev images
  useEffect(() => {
    [artworks[index + 1], artworks[index - 1]].forEach((art) => {
      if (art) {
        const img = new window.Image();
        img.src = art.imageUrl;
      }
    });
  }, [index, artworks]);

  const next = () => setIndex((i) => Math.min(i + 1, artworks.length - 1));
  const prev = () => setIndex((i) => Math.max(i - 1, 0));
  // ------------------ LOADING FALLBACK ------------------
  function LPLoadingFallback() {
    return (
      <Html center>
        <div
          style={{
            padding: "12px 16px",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img
            src="/globe-2.svg"
            alt="loading"
            className="logo-pic"
            style={{
              width: "20px",
              height: "20px",
              animation: "spin 0.6s linear infinite",
              opacity: 0.9,
            }}
          />
          <p className="logo-3">Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Html>
    );
  }

  return (
    <div
      className="relative h-screen w-full"
      style={{ width: "100%", margin: "auto", height: "99%" }}
    >
      <Canvas
        shadows={tier !== "low"}        // skip shadow maps on low-end
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={tier === "high" ? [1, 2] : tier === "mid" ? [1, 1.5] : [1, 1]}
      >
        <ambientLight intensity={0.8} />

        {/* Conditionally mount Environment — null config = skip entirely */}
        {envConfig && (
          <Environment
            preset={envConfig.preset}
            environmentIntensity={envConfig.environmentIntensity}
          />
        )}

        <directionalLight position={[5, 5, 5]} intensity={frontLight} />
        <directionalLight position={[-5, 2, -5]} intensity={backLight} />

        <Suspense fallback={<LPLoadingFallback />}>
          <LPSingleCard
            art={currentArt}
            clicked={clicked}
            setClicked={setClicked}
            onOpenModal={openModal}
            modalOpen={isModalOpen}
            tier={tier} 
          />
        </Suspense>

        <OrbitControls
          enablePan
          enableZoom={false}
          enabled={!isModalOpen && clicked === null}
        />
      </Canvas>

      <div className="flex justify-between w-full px-6 absolute bottom-45 md:bottom-30">
        <button
          onClick={prev}
          className="px-4 py-2 bg-black text-white hover:text-[#007f8cff] transition rounded-lg logo-3"
        >
          ◀ Prev
        </button>
        <button
          onClick={openModal}
          className="px-4 py-2 text-white hover:text-[#007f8cff] transition"
        >
          <FaSearch size={18} />
        </button>
        <button
          onClick={next}
          className="px-4 py-2 bg-black text-white hover:text-[#007f8cff] transition rounded-lg logo-3"
        >
          Next ▶
        </button>
      </div>

      {isModalOpen &&
        createPortal(
          <div
            className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"
              }`}
            onClick={closeModal}
          >
            <div
              className="relative max-w-[50vw] w-full max-h-screen overflow-auto rounded-lg p-1 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-8 text-2xl x-button"
                onClick={closeModal}
              >
                ✕
              </button>
              <div className="max-w-full max-h-full p-2 flex flex-col items-center">
                <Image
                  src={currentArt.imageUrl}
                  alt={currentArt.title}
                  width={600}
                  height={300}
                  className="w-auto max-h-[60vh] object-contain rounded"
                />
                <h2 className="modal-text-2 text-white text-2xl mt-4">
                  {currentArt.title}
                </h2>
                <p className="text-white text max-w-[80%]">
                  {currentArt.description}
                </p>
                <div className="flex gap-4 mt-2">
                  <a
                    href={currentArt.imageUrl}
                    download
                    className="px-1 py-2 m-button text-lg rounded-lg flex items-center gap-1"
                  >

                    <FaDownload /> Download
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}