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
        {/* <style>{`
        .loader {
          width: 16px;
          height: 16px;
          aspect-ratio: 1 / 1;       
          border: 3px solid #fff;
          border-top-color: transparent;
          border-radius: 50%;
          display: inline-block;
          box-sizing: border-box;   
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style> */}
      </Html>
    );
  }


  return (
    <div className="relative h-screen w-full ">

      {/* DIM BACKGROUND WHEN MODAL OPEN */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 pointer-events-none"></div>
      )}

      <Canvas camera={{ position: [0, 0, 10], fov: 60 }} dpr={[1, 1.5]} className="bg[#161515]/5 rounded-lg" style={{margin: "auto", display:"block", width: "90%"}}>
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
            />
          </Bounds>
        </Suspense>

        <OrbitControls makeDefault enablePan enableZoom={!isModalOpen} enabled={!isModalOpen} minDistance={6} maxDistance={14}/>
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
                className="absolute top-4 right-8 text-3xl x-button"
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
                  className="w-auto max-h-[70vh] object-contain rounded"
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
function GalleryScene({ artworks, sizes = [], openModal, modalOpen }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

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
    const startY = 3;

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

  /* -------- SPRINGS -------- */
  const springs = useSprings(
    artworks.length,
    artworks.map((_, i) => ({
      scale: hovered === i ? 1.1 : 1,
      rotation: hovered === i ? [0.1, 0.4, 0] : [0, 0, 0],
      opacity: 1,
      config: { mass: 1, tension: 170, friction: 20 },
    }))
  );

  /* -------- FLOATING ANIMATION -------- */
  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    groupRef.current.children.forEach((child, i) => {
      const floatY = Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;

      const baseY = basePositions[i][1];
      child.position.y = baseY + floatY;

      const targetScale = hovered === i ? 1.1 : 1;
      child.scale.x += (targetScale - child.scale.x) * 0.1;
      child.scale.y += (targetScale - child.scale.y) * 0.1;
      child.scale.z += (targetScale - child.scale.z) * 0.1;
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
            position={positions[i]}
            scale={springs[i].scale.to((s) => [s, s, s])}
            rotation={springs[i].rotation}
            onPointerOver={() => !modalOpen && setHovered(i)}
            onPointerOut={() => !modalOpen && setHovered(null)}
            onClick={(e) => {
              e.stopPropagation();
              if (!modalOpen) {
                openModal({
                  imageUrl: art.imageUrl,
                  title: art.title,
                  description: art.description,
                  slug: art.slug,
                });
              }
            }}
          >
            {/* BACK BEVELED PLATE */}
            <BeveledCard
              width={cardWidth + 0.12}
              height={cardHeight + 0.12}
              depth={0.5}
            />

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
