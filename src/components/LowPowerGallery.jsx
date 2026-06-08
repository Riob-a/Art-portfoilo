"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { OrbitControls, Html, Environment, useGLTF, Center } from "@react-three/drei";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaArrowLeft, FaArrowRight, FaDownload, FaSearch } from "react-icons/fa";
import { a, useSpring } from "@react-spring/three";
import { detectDeviceTier } from "../utils/deviceTier";

// Maps tier → drei <Environment> props (or null to skip entirely)
const ENV_CONFIG = {
  high: { preset: "dawn", environmentIntensity: 1.0 },
  mid: { preset: "dawn", environmentIntensity: 0.6 },
  low: null,
};

// Maps tier → directional light intensities [front, back]
const LIGHT_CONFIG = {
  high: [3.7, 3.6],
  mid: [2.8, 2.2],
  low: [1.8, 1.2],
};

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

// --- RECESSED FRAME ---
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

// // --- 3D MODEL CARD ---
// function LPModelCard({ art, clicked, setClicked, onOpenModal, modalOpen, tier }) {
//   const { scene } = useGLTF(art.modelUrl);
//   const ref = useRef();
//   const clickTimeout = useRef(null);
//   const [held, setHeld] = useState(false);
//   const holdTimeout = useRef(null);
//   const HOLD_DELAY = 320;

//   useFrame((_, delta) => {
//     if (ref.current && !clicked) ref.current.rotation.y += delta * 0.4;
//   });

//   const [hovered, setHovered] = useState(false);
//   const spring = useSpring({
//     scale: hovered || clicked || held ? 1.08 : 1,
//     config: clicked || held ? { tension: 240, friction: 22 } : { tension: 170, friction: 20 },
//   });

//   const cardWidth = 3, cardHeight = 3;

//   return (
//     <a.group
//       scale={spring.scale.to((s) => [s, s, s])}
//       onPointerOver={() => setHovered(true)}
//       onPointerOut={() => setHovered(false)}
//       onPointerDown={(e) => {
//         e.stopPropagation();
//         if (modalOpen) return;
//         holdTimeout.current = setTimeout(() => {
//           setHeld(true);
//           setClicked(null);
//         }, HOLD_DELAY);
//       }}
//       onPointerUp={(e) => {
//         e.stopPropagation();
//         if (holdTimeout.current) {
//           clearTimeout(holdTimeout.current);
//           holdTimeout.current = null;
//         }
//         if (held) { setHeld(false); return; }
//         if (clickTimeout.current) {
//           clearTimeout(clickTimeout.current);
//           clickTimeout.current = null;
//           onOpenModal();
//           return;
//         }
//         setClicked(true);
//         clickTimeout.current = setTimeout(() => {
//           setClicked(null);
//           clickTimeout.current = null;
//         }, 600);
//       }}
//       onPointerLeave={() => {
//         if (holdTimeout.current) {
//           clearTimeout(holdTimeout.current);
//           holdTimeout.current = null;
//         }
//       }}
//     >
//       {/* No LPBeveledCard or RecessedFrame here */}

//       <group position={[0, 0, 0]}>
//         <Center>
//           <primitive ref={ref} object={scene} scale={0.8} />
//         </Center>
//       </group>

//       {!modalOpen && (
//         <Html
//           position={[1.5, -1.5, 0]}
//           transform
//           distanceFactor={1.25}
//           occlude
//         >
//           <div style={{
//             pointerEvents: "none",
//             opacity: clicked || held ? 0 : 1,
//             transition: "opacity 0.2s ease",
//             background: "#ffffff",
//             border: "2px solid #111111",
//             padding: "4px 10px",
//             whiteSpace: "nowrap",
//             transform: `translateX(-100%) rotate(${(art.title.length * 137.5) % 20 - 10}deg)`,
//             transformOrigin: "bottom right",
//           }}>
//             <div style={{
//               fontFamily: "Unbounded, sans-serif",
//               fontWeight: 800,
//               fontSize: "0.5rem",
//               letterSpacing: "0.1em",
//               textTransform: "uppercase",
//               color: "#111111",
//             }}>
//               {art.title}
//             </div>
//           </div>
//         </Html>
//       )}
//     </a.group>

//   );
// }

// --- SINGLE CARD COMPONENT ---
function LPSingleCard({ art, clicked, setClicked, onOpenModal, modalOpen, float = true, tier }) {
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
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
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
      <LPBeveledCard width={cardWidth + 0.12} height={cardHeight + 0.12} depth={0.5} />

      {/* BACK FACE INFO */}
      {!modalOpen && (
        <Html
          position={[-cardWidth / 2 + BACK_TEXT_WIDTH / 2, -cardHeight / 2 + 0.1, -0.26]}
          rotation={[0, Math.PI, 0]}
          transform
          distanceFactor={5.5}
          occlude
        >
          <div
            style={{
              width: "260px",
              fontSize: "10px",
              lineHeight: 1.2,
              pointerEvents: "none",
              opacity: clicked || held ? 1 : 0,
              transition: "opacity 0.25s ease 0.15s",
              background: "var(--theme-navbar, #ffffff)",
              border: "2px solid var(--theme-navbar-text, #111111)",
              cursor: "pointer",
            }}
          >
            <div
              className="modal-text m-1 p-3"
              style={{
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 800,
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--theme-navbar-text, #111111)",
                padding: "8px 14px",
                borderBottom: "2px solid var(--theme-navbar-text, #111111)",
              }}
            >
              {art.title}
            </div>
            <div
              className="p-1"
              style={{
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 400,
                fontSize: "0.55rem",
                letterSpacing: "0.05em",
                lineHeight: 1.6,
                color: "var(--theme-navbar-text, #111111)",
                padding: "8px 14px",
                opacity: 0.75,
              }}
            >
              {art.description}
            </div>
          </div>
        </Html>
      )}

      {/* FRONT LABEL PLAQUE */}
      {!modalOpen && (
        <Html
          position={[cardWidth / 2, -cardHeight / 2 - 0.01, 0.80]}
          transform
          distanceFactor={1.25}
          occlude
        >
          <div
            style={{
              pointerEvents: "none",
              opacity: clicked || held ? 0 : 1,
              transition: "opacity 0.2s ease",
              background: "#ffffff",
              border: "2px solid #111111",
              padding: "4px 10px",
              whiteSpace: "nowrap",
              transform: `translateX(-100%) rotate(${(art.title.length * 137.5) % 20 - 10}deg)`,
              transformOrigin: "bottom right",
            }}
          >
            <div
              style={{
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 800,
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#111111",
              }}
            >
              {art.title}
            </div>
          </div>
        </Html>
      )}

      <RecessedFrame width={cardWidth + 0.22} height={cardHeight + 0.22} depth={0.45} inset={0.125} />

      {/* FRONT IMAGE */}
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
        </mesh>
      )}
    </a.group>
  );
}

// --- ROUTER ---
function LPCardRouter(props) {
  if (props.art.modelUrl) {
    // return <LPModelCard {...props} />;
  }
  return <LPSingleCard {...props} />;
}

// --- LOW-POWER SINGLE-CARD GALLERY ---
export default function LowPowerGallery({ artworks }) {
  const [index, setIndex] = useState(0);
  const [clicked, setClicked] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [tier, setTier] = useState("mid");

  // Detect once on mount — utility handles all logging
  useEffect(() => {
    setTier(detectDeviceTier());
  }, []);

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

  // Preload next/prev images
  useEffect(() => {
    [artworks[index + 1], artworks[index - 1]].forEach((art) => {
      if (art?.imageUrl) {
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
            src="/hourglass.png"
            alt="loading"
            className="logo-pic"
            style={{
              width: "40px",
              height: "40px",
              animation: "spin 0.8s linear infinite",
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
      style={{ width: "100%", margin: "auto", height: "100%" }}
    >
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

      {/* HINT TEXT */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/70 text-xs logo-3 pointer-events-none z-10">
        pan to explore · scroll to zoom
      </div>

      <Canvas
        shadows={tier !== "low"}
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={tier === "high" ? [1, 2] : tier === "mid" ? [1, 1.5] : [1, 1]}
      >
        <ambientLight intensity={0.8} />

        {/* Low tier: skip env map, use cheap lights only */}
        {envConfig ? (
          <Environment preset={envConfig.preset} environmentIntensity={envConfig.environmentIntensity} />
        ) : (
          <>
            <directionalLight position={[5, 5, 5]} intensity={backLight} />
            <directionalLight position={[-5, 2, -5]} intensity={frontLight} />
          </>
        )}

        {/* High/mid: env map + directional lights on top */}
        {tier !== "low" && (
          <>
            <directionalLight position={[5, 5, 5]} intensity={frontLight} />
            <directionalLight position={[-5, 2, -5]} intensity={backLight} />
          </>
        )}

        <Suspense fallback={<LPLoadingFallback />}>
          <LPCardRouter
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
        <button onClick={prev} className="px-4 py-2 bg-black text-white logo-3"><FaArrowLeft /></button>
        <button onClick={openModal} className="px-4 py-2 bg-black text-white logo-3"><FaSearch size={18} /></button>
        <button onClick={next} className="px-4 py-2 bg-black text-white logo-3"><FaArrowRight /></button>
      </div>

      {isModalOpen &&
        createPortal(
          <div
            className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
            onClick={closeModal}
          >
            <div
              className="relative max-w-[50vw] w-full max-h-screen overflow-auto rounded-lg p-1 animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button className="absolute top-4 right-8 text-2xl x-button" onClick={closeModal}>✕</button>
              <div className="max-w-full max-h-full p-2 flex flex-col items-center">
                {currentArt.imageUrl ? (
                  <Image
                    src={currentArt.imageUrl}
                    alt={currentArt.title}
                    width={600}
                    height={300}
                    className="w-auto max-h-[60vh] object-contain rounded"
                  />
                ) : (
                  <div style={{
                    width: "100%", height: "300px",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "2px solid black", boxShadow: "3px 3px 0 black",
                    color: "white", fontFamily: "Unbounded, sans-serif",
                    fontSize: "0.7rem", letterSpacing: "0.1em", textTransform: "uppercase",
                  }}>
                    3D Model
                  </div>
                )}
                <h2 className="modal-text-2 text-white text-2xl mt-4">{currentArt.title}</h2>
                <p className="text-white text max-w-[80%]">{currentArt.description}</p>
                {currentArt.imageUrl && (
                  <div className="flex gap-4 mt-2">
                    <a
                      href={currentArt.imageUrl}
                      download
                      className="px-1 py-2 m-button text-lg rounded-lg flex items-center gap-1"
                    >
                      <FaDownload /> Download
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </div>
  );
}