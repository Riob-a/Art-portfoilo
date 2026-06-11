"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Bounds } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import artworks from "../data/artworks";
import { a, useSprings } from "@react-spring/three";
import Image from "next/image";
import { createPortal } from "react-dom";
import { FaDownload } from "react-icons/fa";
import { detectDeviceTier } from "../utils/deviceTier";

// ─── Tier configs ─────────────────────────────────────────────────────────────
const ENV_CONFIG = {
  high: { preset: "dawn", environmentIntensity: 1.0 },
  mid:  { preset: "dawn", environmentIntensity: 0.6 },
  low:  null,
};

const LIGHT_CONFIG = {
  high: [1.2, 0.6],
  mid:  [1.0, 0.4],
  low:  [1.8, 1.2],
};

// ─── Main component ───────────────────────────────────────────────────────────
export default function ThreeDFloatingGallery() {
  const [sizes, setSizes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [clicked, setClicked] = useState(null);
  const [tier, setTier] = useState("mid");

  // Detect once on mount — utility handles all logging
  useEffect(() => {
    setTier(detectDeviceTier());
  }, []);

  const envConfig = ENV_CONFIG[tier];
  const [frontLight, backLight] = LIGHT_CONFIG[tier];

  const openModal = (art) => {
    setSelectedArt(art);
    setIsModalOpen(true);
    setIsClosing(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setSelectedArt(null);
    }, 200);
  };

  /* -------- Preload image sizes -------- */
  useEffect(() => {
    let mounted = true;
    Promise.all(
      artworks.map(
        (art) =>
          new Promise((resolve) => {
            const img = new window.Image();
            img.src = art.imageUrl;
            img.onload  = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 1, height: 1 });
          })
      )
    ).then((results) => mounted && setSizes(results));
    return () => { mounted = false; };
  }, []);

  function LoadingFallback() {
    return (
      <Html center>
        <div style={{ padding: "12px 16px", color: "white", fontSize: "16px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
          <img src="/hourglass.png" alt="loading" className="logo-pic" style={{ width: "40px", height: "40px", animation: "spin 0.8s linear infinite", opacity: 0.9 }} />
          <p className="logo-3">Loading...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </Html>
    );
  }

  return (
    <div className="relative h-screen w-full">

      {/* HINT TEXT */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 text-xs logo-3 pointer-events-none z-10">
        drag to rotate · scroll to zoom · pan to move
      </div>

      {/* DIM BACKGROUND WHEN MODAL OPEN */}
      {isModalOpen && (
        <div className="fixed inset-0  backdrop-blur-sm z-50 pointer-events-none" />
      )}

      <div className="relative h-screen" style={{ width: "100%", margin: "auto", height: "100%" }}>

        {/* CORNER BRACKETS */}
        <div className="absolute top-0.5 left-0.5  w-8 h-8 border-t-2 border-l-2 border-black/70 pointer-events-none z-10" />
        <div className="absolute top-0.5 right-0.5 w-8 h-8 border-t-2 border-r-2 border-black/70 pointer-events-none z-10" />
        <div className="absolute bottom-0.5 left-0.5  w-8 h-8 border-b-2 border-l-2 border-black/70 pointer-events-none z-10" />
        <div className="absolute bottom-0.5 right-0.5 w-8 h-8 border-b-2 border-r-2 border-black/70 pointer-events-none z-10" />

        {/* EDGE PLUSES */}
        <div className="absolute top-0    left-1/2 -translate-x-1/2 text-black/70 text-3xl font-thin pointer-events-none z-10">+</div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-black/70 text-3xl font-thin pointer-events-none z-10">+</div>
        <div className="absolute left-0  top-1/2 -translate-y-1/2 text-black/70 text-3xl font-thin pointer-events-none z-10">+</div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-black/70 text-3xl font-thin pointer-events-none z-10">+</div>

        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          shadows={tier !== "low"}
          dpr={tier === "high" ? [1, 2] : tier === "mid" ? [1, 1.5] : [1, 1]}
          style={{ display: "block", width: "100%" }}
        >
          {envConfig ? (
            <Environment preset={envConfig.preset} environmentIntensity={envConfig.environmentIntensity} />
          ) : (
            /* Low tier: skip env map, use cheap lights */
            <>
              <directionalLight position={[5,  5,  5]} intensity={backLight} />
              <directionalLight position={[-5, 2, -5]} intensity={frontLight} />
            </>
          )}

          <ambientLight intensity={0.8} />
          {/* High/mid also get directional lights on top of the env map */}
          {tier !== "low" && (
            <>
              <directionalLight position={[5,  5,  5]} intensity={frontLight} />
              <directionalLight position={[-5, 2, -5]} intensity={backLight} />
            </>
          )}

          <Suspense fallback={<LoadingFallback />}>
            <Bounds fit clip observe margin={0.95}>
              <GalleryScene
                artworks={artworks}
                sizes={sizes}
                openModal={openModal}
                modalOpen={isModalOpen}
                clicked={clicked}
                setClicked={setClicked}
                tier={tier}
              />
            </Bounds>
          </Suspense>

          <OrbitControls
            makeDefault
            enablePan
            enableZoom={!isModalOpen && clicked === null}
            enabled={!isModalOpen && clicked === null}
            minDistance={6}
            maxDistance={14}
          />
        </Canvas>
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && selectedArt && createPortal(
        <div
          className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
          onClick={handleClose}
        >
          <div
            className="relative max-w-[50vw] w-full max-h-screen overflow-auto rounded-lg p-1 animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button className="absolute top-4 right-8 text-2xl x-button" onClick={handleClose}>✕</button>

            <div className="max-w-full max-h-full p-2 flex flex-col items-center">
              <Image
                src={selectedArt.imageUrl}
                alt={selectedArt.title}
                width={600}
                height={300}
                className="w-auto max-h-[60vh] object-contain rounded"
              />
              <h2 className="modal-text-2 text-white text-2xl mt-4">{selectedArt.title}</h2>
              <p className="text-white text max-w-[80%]">{selectedArt.description}</p>
              <div className="flex gap-4 mt-2">
                <a href={selectedArt.imageUrl} download className="px-1 py-2 m-button text-lg rounded-lg flex items-center gap-1">
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

// ─── BeveledCard ─────────────────────────────────────────────────────────────
function BeveledCard({ width, height, depth }) {
  const shape = useMemo(() => {
    const w = width / 2, h = height / 2;
    const s = new THREE.Shape();
    s.moveTo(-w, -h); s.lineTo(w, -h); s.lineTo(w, h); s.lineTo(-w, h); s.lineTo(-w, -h);
    return s;
  }, [width, height]);

  const extrudeSettings = useMemo(() => ({
    steps: 1, depth,
    bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.08, bevelSegments: 5,
  }), [depth]);

  return (
    <mesh>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

// ─── RecessedFrame ────────────────────────────────────────────────────────────
function RecessedFrame({ width, height, depth = 0.2, inset = 0.15 }) {
  const shape = useMemo(() => {
    const w = width / 2, h = height / 2;
    const holeW = w - inset, holeH = h - inset;
    const s = new THREE.Shape();
    s.moveTo(-w, -h); s.lineTo(w, -h); s.lineTo(w, h); s.lineTo(-w, h); s.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-holeW, -holeH); hole.lineTo(holeW, -holeH); hole.lineTo(holeW, holeH); hole.lineTo(-holeW, holeH); hole.closePath();
    s.holes.push(hole);
    return s;
  }, [width, height, inset]);

  return (
    <mesh position={[0, 0, 0.26]}>
      <extrudeGeometry args={[shape, { depth, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3 }]} />
      <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
    </mesh>
  );
}

// ─── GalleryScene ─────────────────────────────────────────────────────────────
function GalleryScene({ artworks, sizes = [], openModal, modalOpen, clicked, setClicked, tier }) {
  const groupRef     = useRef();
  const [hovered, setHovered]         = useState(null);
  const [heldIndex, setHeldIndex]     = useState(null);
  const [exitingIndex, setExitingIndex] = useState(null);
  const clickTimeout  = useRef(null);
  const holdTimeout   = useRef(null);
  const HOLD_DELAY    = 320;
  const BACK_TEXT_WIDTH = 0.12;

  const singlePaneIndex = heldIndex !== null ? heldIndex : clicked;
  const isSinglePane    = singlePaneIndex !== null;

  useEffect(() => {
    if (!isSinglePane && exitingIndex !== null) {
      const t = setTimeout(() => setExitingIndex(null), 350);
      return () => clearTimeout(t);
    }
  }, [isSinglePane, exitingIndex]);

  const urls     = useMemo(() => artworks.map((a) => a.imageUrl), [artworks]);
  const textures = useLoader(TextureLoader, urls, (loader) => { loader.setCrossOrigin(""); });

  useMemo(() => {
    textures.forEach((tex) => { if (tex) { tex.flipY = true; tex.needsUpdate = true; } });
  }, [textures]);

  const positions = useMemo(() => {
    const cols = 3, spacingX = 4, spacingY = 4, startY = 4;
    return artworks.map((_, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      return [(col - (cols - 1) / 2) * spacingX, startY - row * spacingY, 0];
    });
  }, [artworks]);

  const floatVariations = useMemo(() =>
    artworks.map(() => ({
      speed:     0.7 + Math.random() * 0.4,
      amplitude: 0.12 + Math.random() * 0.12,
    })),
  [artworks]);

  const springs = useSprings(
    artworks.length,
    artworks.map((_, i) => {
      const isFocused  = singlePaneIndex === i;
      const shouldYield = isSinglePane && !isFocused;
      const isExiting  = exitingIndex === i;
      return {
        scale: isFocused ? 1.15 : shouldYield ? 0.92 : isExiting ? 1.02 : hovered === i ? 1.08 : 1,
        rotation: isFocused
          ? [0, Math.PI * 1.15, 0]
          : isExiting ? [0, 0.2, 0]
          : hovered === i && !isSinglePane ? [0.08, 0.35, 0]
          : [0.02, 0.01, 0],
        positionZ: isFocused ? 0.6 : shouldYield ? -1.2 : isExiting ? -0.3 : 0,
        config: isFocused
          ? { mass: 1,   tension: 280, friction: 24 }
          : isExiting   ? { mass: 1.2, tension: 200, friction: 30 }
          : shouldYield ? { mass: 1.1, tension: 160, friction: 28 }
          : hovered === i ? { mass: 0.8, tension: 220, friction: 18 }
          : { mass: 1, tension: 170, friction: 22 },
      };
    })
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      const { speed, amplitude } = floatVariations[i];
      const isFocused   = singlePaneIndex === i;
      const shouldYield = isSinglePane && !isFocused;
      const eff = isFocused ? amplitude * 0.2 : shouldYield ? amplitude * 0.1 : exitingIndex !== null ? amplitude * 0.3 : amplitude;
      child.position.y = positions[i][1] + Math.sin(clock.getElapsedTime() * speed + i) * eff;
    });
  });

  return (
    <group ref={groupRef}>
      {artworks.map((art, i) => {
        const tex    = textures?.[i];
        const size   = sizes?.[i];
        const aspect = size?.width && size?.height ? size.width / size.height : 1;
        const cardHeight = 3;
        const cardWidth  = aspect * cardHeight;
        const plaqueRotation = ((i * 137.5) % 15) - 7.5;

        return (
          <a.group
            key={i}
            position-x={positions[i][0]}
            position-y={positions[i][1]}
            position-z={springs[i].positionZ}
            scale={springs[i].scale.to((s) => [s * 1.02, s, s * 0.98])}
            rotation={springs[i].rotation}
            onPointerOver={() => !modalOpen && !isSinglePane && setHovered(i)}
            onPointerOut={()  => !modalOpen && !isSinglePane && setHovered(null)}
            onPointerDown={(e) => {
              e.stopPropagation();
              if (modalOpen) return;
              holdTimeout.current = setTimeout(() => {
                setHeldIndex(i);
                setClicked(null);
              }, HOLD_DELAY);
            }}
            onPointerUp={(e) => {
              e.stopPropagation();
              if (holdTimeout.current) { clearTimeout(holdTimeout.current); holdTimeout.current = null; }
              if (heldIndex === i) { setExitingIndex(i); setHeldIndex(null); return; }
              if (clickTimeout.current) {
                clearTimeout(clickTimeout.current); clickTimeout.current = null;
                openModal({ imageUrl: art.imageUrl, title: art.title, description: art.description, slug: art.slug });
                return;
              }
              setClicked(i);
              clickTimeout.current = setTimeout(() => {
                setExitingIndex(i); setClicked(null); clickTimeout.current = null;
              }, 650);
            }}
            onPointerLeave={() => {
              if (holdTimeout.current) { clearTimeout(holdTimeout.current); holdTimeout.current = null; }
            }}
          >
            <BeveledCard width={cardWidth + 0.12} height={cardHeight + 0.12} depth={0.5} />

            {/* BACK FACE INFO */}
            <Html position={[-cardWidth / 2 + BACK_TEXT_WIDTH / 2, -cardHeight / 2 + 0.1, -0.26]} rotation={[0, Math.PI, 0]} transform distanceFactor={5.5} occlude>
              <div style={{ width: "260px", pointerEvents: "none", opacity: (clicked === i || heldIndex === i) && !modalOpen ? 1 : 0, transition: "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s", transform: (clicked === i || heldIndex === i) && !modalOpen ? "translateY(0px)" : "translateY(6px)", background: "var(--theme-navbar, #ffffff)", border: "2px solid var(--theme-navbar-text, #111111)", borderRadius: "0", backdropFilter: "none" }}>
                <div className="logo-3" style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 800, fontSize: "0.6rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--theme-navbar-text, #111111)", padding: "8px 14px", borderBottom: "2px solid var(--theme-navbar-text, #111111)" }}>{art.title}</div>
                <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 400, fontSize: "0.55rem", letterSpacing: "0.05em", lineHeight: 1.6, color: "var(--theme-navbar-text, #111111)", padding: "8px 14px", opacity: 0.75 }}>{art.description}</div>
              </div>
            </Html>

            {/* FRONT LABEL PLAQUE */}
            <Html position={[cardWidth / 2, -cardHeight / 2 - 0.01, 0.80]} transform distanceFactor={1.25} occlude>
              <div style={{ pointerEvents: "none", opacity: clicked || heldIndex ? 0 : 1, transition: "opacity 0.2s ease", background: "#ffffff", border: "2px solid #111111", padding: "4px 10px", whiteSpace: "nowrap", transform: `translateX(-100%) rotate(${plaqueRotation}deg)`, transformOrigin: "bottom right" }}>
                <div style={{ fontFamily: "Unbounded, sans-serif", fontWeight: 800, fontSize: "0.5rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#111111" }}>{art.title}</div>
              </div>
            </Html>

            <RecessedFrame width={cardWidth + 0.22} height={cardHeight + 0.22} depth={0.45} inset={0.125} />

            {/* FRONT IMAGE */}
            {tex ? (
              <mesh position={[0, 0, 0.61]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            ) : (
              <mesh position={[0, 0, 0.41]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            )}

            {/* GLASS PANE — skipped on low-tier devices */}
            {tier !== "low" && (
              <mesh position={[0, 0, 0.68]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshPhysicalMaterial transmission={0} transparent color="#1a3322" opacity={0.20} roughness={0.05} thickness={0.5} ior={1.5} reflectivity={1} depthWrite={false} samples={1} resolution={256} />
              </mesh>
            )}
          </a.group>
        );
      })}
    </group>
  );
}