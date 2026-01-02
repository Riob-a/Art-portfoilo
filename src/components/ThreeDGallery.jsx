"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Environment, Bounds } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import artworks from "../data/artworks";
import { a, useSprings } from "@react-spring/three";
import Image from "next/image";
import Link from "next/link";
import { createPortal } from "react-dom";
import { FaDownload } from "react-icons/fa";

export default function ThreeDFloatingGallery() {
  const [sizes, setSizes] = useState([]);

  /* ------------------ Modal State ------------------ */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedArt, setSelectedArt] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [clicked, setClicked] = useState(null);

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
    }, 200); // match fadeOut animation
  };

  /* -------- preload image sizes -------- */
  useEffect(() => {
    let mounted = true;
    Promise.all(
      artworks.map(
        (art) =>
          new Promise((resolve) => {
            const img = new window.Image();

            img.src = art.imageUrl;
            img.onload = () =>
              resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 1, height: 1 });
          })
      )
    ).then((results) => mounted && setSizes(results));

    return () => {
      mounted = false;
    };
  }, []);

  function LoadingFallback() {
    return (
      <Html center>
        <div
          style={{
            padding: "12px 16px",
            // background: "rgba(255, 255, 255, 0.7)",
            color: "white",
            fontSize: "16px",
            borderRadius: "8px",
            // background: "#161515",
            // backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          {/* <span className="loader"></span> */}
          {/* SVG replaces spinner */}
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
        <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
      </Html>
    );
  }


  return (
    <div className="relative h-screen w-full ">

      {/* DIM BACKGROUND WHEN MODAL OPEN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none"></div>
      )}

      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]} className="bg[#161515]/5 rounded-lg" style={{ margin: "auto", display: "block", width: "95%" }}>
        <Environment preset="dawn" environmentIntensity={1} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -5]} intensity={0.6} />

        <Suspense fallback={<LoadingFallback />}>
          <Bounds
            fit
            clip
            observe
            margin={0.95}
          >
            <GalleryScene
              artworks={artworks}
              sizes={sizes}
              openModal={openModal}
              modalOpen={isModalOpen}
              clicked={clicked}
              setClicked={setClicked}
            />
          </Bounds>
        </Suspense>

        <OrbitControls makeDefault enablePan enableZoom={!isModalOpen && clicked === null} enabled={!isModalOpen && clicked === null} minDistance={6} maxDistance={14} />
      </Canvas>

      {/* ------------------ MODAL ------------------ */}
      {isModalOpen &&
        selectedArt &&
        createPortal(
          <div
            className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"
              }`}
            onClick={handleClose}
          >
            <div
              className="relative max-w-[50vw] w-full max-h-screen overflow-auto rounded-lg p-1 animate-scaleIn "
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-8 text-2xl x-button"
                onClick={handleClose}
              >
                ✕
              </button>

              {/* Fullscreen Image */}
              <div className="max-w-full max-h-full p-2 flex flex-col items-center">
                <Image
                  src={selectedArt.imageUrl}
                  alt={selectedArt.title}
                  width={600}
                  height={300}
                  className="w-auto max-h-[60vh] object-contain rounded"
                />

                <h2 className="modal-text-2 text-white text-2xl mt-4">
                  {selectedArt.title}
                </h2>

                <p className="text-white text max-w-[80%]">
                  {selectedArt.description}
                </p>

                {/* Buttons */}
                <div className="flex gap-4 mt-2">
                  {/* <Link href={`/artworks/${selectedArt.slug}`}>
                    <button className="m-button rounded-lg">More...</button>
                  </Link> */}
                  <a
                    href={selectedArt.imageUrl}
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

/* -------------------------------
   BEVELED / EXTRUDED CARD SHAPE
-------------------------------- */
function BeveledCard({ width, height, depth }) {
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
      depth: depth,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.08,
      bevelSegments: 5,
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
function RecessedFrame({
  width,
  height,
  depth = 0.2,
  inset = 0.15, // how deep the art sits in
}) {
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

    // inner cut-out (the depression)
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

/* -------------------
   Gallery Scene
------------------- */
function GalleryScene({ artworks, sizes = [], openModal, modalOpen, clicked, setClicked }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);
  const clickTimeout = useRef(null);
  const [returning, setReturning] = useState(null);

  const [heldIndex, setHeldIndex] = useState(null);
  const [exitingIndex, setExitingIndex] = useState(null);


  const singlePaneIndex = heldIndex !== null ? heldIndex : clicked;
  const isSinglePane = singlePaneIndex !== null;
  useEffect(() => {
    if (!isSinglePane && exitingIndex !== null) {
      const timeout = setTimeout(() => {
        setExitingIndex(null);
      }, 350); // exit duration

      return () => clearTimeout(timeout);
    }
  }, [isSinglePane, exitingIndex]);


  const holdTimeout = useRef(null);
  const HOLD_DELAY = 320;


  const BACK_TEXT_WIDTH = 0.12

  const urls = useMemo(() => artworks.map((a) => a.imageUrl), [artworks]);
  const textures = useLoader(TextureLoader, urls, (loader) => {
    loader.setCrossOrigin('');
  });

  useMemo(() => {
    textures.forEach((tex) => {
      if (tex) {
        tex.flipY = true;     // **before attach**
        tex.needsUpdate = true;
      }
    });
  }, [textures]);

  /* -------- GRID POSITIONS -------- */
  const positions = useMemo(() => {
    const cols = 3;
    const spacingX = 4;
    const spacingY = 4;
    const startY = 4;

    return artworks.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = (col - (cols - 1) / 2) * spacingX;
      const y = startY - row * spacingY;
      const z = 0;
      return [x, y, z];
    });
  }, [artworks]);

  const basePositions = positions;

  const floatVariations = useMemo(
    () =>
      artworks.map(() => ({
        speed: 0.7 + Math.random() * 0.4,        // 0.7 – 1.1
        amplitude: 0.12 + Math.random() * 0.12,  // 0.12 – 0.24
      })),
    [artworks]
  );


  /* -------- SPRINGS -------- */
  const springs = useSprings(
    artworks.length,
    artworks.map((_, i) => {
      const isFocused = singlePaneIndex === i;
      const shouldYield = isSinglePane && !isFocused;
      const isExiting = exitingIndex === i;

      return {
        scale: isFocused
          ? 1.15
          : shouldYield
            ? 0.92
            : isExiting
              ? 1.02
              : hovered === i
                ? 1.08
                : 1,

        rotation: isFocused
          ? [0, Math.PI * 1.15, 0]
          : isExiting
            ? [0, 0.2, 0]
            : hovered === i && !isSinglePane
              ? [0.08, 0.35, 0]
              // : [0, 0, 0],
              : [0.02, 0.01, 0],


        positionZ: isFocused
          ? 0.6
          : shouldYield
            ? -1.2
            : isExiting
              ? -0.3
              : 0,

        // config: isFocused
        //   ? { mass: 1, tension: 260, friction: 22 }
        //   : isExiting
        //     ? { mass: 1.2, tension: 200, friction: 28 }
        //     : shouldYield
        //       ? { mass: 1, tension: 180, friction: 26 }
        //       : { mass: 1, tension: 170, friction: 20 },
        config: isFocused
          ? { mass: 1, tension: 280, friction: 24 }   // confident lock
          : isExiting
            ? { mass: 1.2, tension: 200, friction: 30 } // graceful release
            : shouldYield
              ? { mass: 1.1, tension: 160, friction: 28 } // background calm
              : hovered === i
                ? { mass: 0.8, tension: 220, friction: 18 } // reactive hover
                : { mass: 1, tension: 170, friction: 22 },  // idle

      };
    })
  );


  /* -------- FLOATING ANIMATION -------- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const { speed, amplitude } = floatVariations[i];

      const isFocused = singlePaneIndex === i;
      const shouldYield = isSinglePane && !isFocused;

      const effectiveAmplitude = isFocused
        ? amplitude * 0.2
        : shouldYield
          ? amplitude * 0.1
          : exitingIndex !== null
            ? amplitude * 0.3
            : amplitude;

      const floatY =
        // Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;
        // Math.sin(clock.getElapsedTime() * speed + i) * amplitude;
        Math.sin(clock.getElapsedTime() * speed + i) * effectiveAmplitude;


      child.position.y = basePositions[i][1] + floatY;
    });
  });

  /* -------- RENDER ART CARDS -------- */
  return (
    <group ref={groupRef}>
      {artworks.map((art, i) => {
        const tex = textures?.[i];
        const size = sizes?.[i];
        const aspect =
          size?.width && size?.height ? size.width / size.height : 1;

        const cardHeight = 3;
        const cardWidth = aspect * cardHeight;

        return (
          <a.group
            key={i}
            position-x={positions[i][0]}
            position-y={positions[i][1]}
            position-z={springs[i].positionZ}
            // scale={springs[i].scale.to((s) => [s, s, s])}
            scale={springs[i].scale.to((s) => [s * 1.02, s, s * 0.98])}

            rotation={springs[i].rotation}
            // onPointerOver={() => !modalOpen && setHovered(i)}
            // onPointerOut={() => !modalOpen && setHovered(null)}
            onPointerOver={() =>
              !modalOpen && !isSinglePane && setHovered(i)
            }
            onPointerOut={() =>
              !modalOpen && !isSinglePane && setHovered(null)
            }


            onPointerDown={(e) => {
              e.stopPropagation();
              if (modalOpen) return;

              holdTimeout.current = setTimeout(() => {
                setHeldIndex(i);     // lock on back
                setClicked(null);   // cancel auto-return
              }, HOLD_DELAY);
            }}

            onPointerUp={(e) => {
              e.stopPropagation();

              if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
                holdTimeout.current = null;
              }

              // If we were holding → release returns card
              if (heldIndex === i) {
                setExitingIndex(i);
                setHeldIndex(null);
                return;
              }

              // Otherwise treat as click (single / double)
              if (clickTimeout.current) {
                clearTimeout(clickTimeout.current);
                clickTimeout.current = null;

                openModal({
                  imageUrl: art.imageUrl,
                  title: art.title,
                  description: art.description,
                  slug: art.slug,
                });
                return;
              }

              setClicked(i);
              clickTimeout.current = setTimeout(() => {
                setExitingIndex(i);
                setClicked(null);
                clickTimeout.current = null;
              }, 650);
            }}

            onPointerLeave={() => {
              if (holdTimeout.current) {
                clearTimeout(holdTimeout.current);
                holdTimeout.current = null;
              }
            }}


          >
            {/* BACK BEVELED PLATE */}
            <BeveledCard
              width={cardWidth + 0.12}
              height={cardHeight + 0.12}
              depth={0.5}
            />

            {/* BACK FACE INFO */}
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
                  width: "120px",
                  fontSize: "10px",
                  lineHeight: 1.2,
                  color: "#bbb",
                  pointerEvents: "none",
                  // opacity: clicked === i && !modalOpen ? 1 : 0,
                  opacity:
                    (clicked === i || heldIndex === i) && !modalOpen ? 1 : 0,
                  transition: "opacity 0.3s ease 0.15s",
                  transform:
                    (clicked === i || heldIndex === i) && !modalOpen
                      ? "translateY(0px)"
                      : "translateY(6px)",
                  background: "rgba(255, 0, 0, 0.363)",
                  backdropFilter: "blur(6px)",
                  outline: "1px solid red",
                  cursor: "pointer"
                }}
              >
                <div
                  className="modal-text m-1"
                  style={{
                    fontWeight: 800,
                    fontSize: "11px",
                    marginBottom: "4px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  {art.title}
                </div>

                <div
                  className="p-1"
                  style={{
                    fontWeight: 400,
                    fontSize: "10px",
                    lineHeight: 1.4,
                    opacity: 0.75,
                  }}
                >
                  {art.description}
                </div>

              </div>
            </Html>

            {/* RECESSED FRAME */}
            <RecessedFrame
              width={cardWidth + 0.22}
              height={cardHeight + 0.22}
              depth={0.40}
              inset={0.1}
            />

            {/* FRONT IMAGE */}
            {tex ? (
              <mesh position={[0, 0, 0.61]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
                {/* <meshStandardMaterial map={tex} toneMapped={false} transparent={false} /> */}
              </mesh>
            ) : (
              <mesh position={[0, 0, 0.41]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            )}

            {/* GLASS PANE */}
            <mesh position={[0, 0, 0.68]}>
              <planeGeometry args={[cardWidth, cardHeight]} />
              <meshPhysicalMaterial
                transmission={0}
                transparent
                color="rgba(0, 0, 0, 1)"
                opacity={0.12}
                roughness={0.05}
                thickness={0.5}
                ior={1.5}
                reflectivity={1}
                depthWrite={false}
                samples={1}
                resolution={256}
              />
            </mesh>
          </a.group>
        );
      })}
    </group>
  );

}
