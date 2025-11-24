"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect } from "react";
import { RoundedBox, OrbitControls, useTexture } from "@react-three/drei";
import ArtCard from "./ArtCard";
import { createPortal } from "react-dom";

export default function ThreeDFloatingGallery({ artworks }) {
  return (
    <div className="relative h-[80vh] w-full">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        <Suspense fallback={null}>
          <GalleryObjects artworks={artworks} />
        </Suspense>

        <OrbitControls enableZoom enablePan />
      </Canvas>
    </div>
  );
}

function GalleryObjects({ artworks }) {
  const groupRef = useRef();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [modalArt, setModalArt] = useState(null);
  const [sizes, setSizes] = useState([]);

  // Load image dimensions
  useEffect(() => {
    Promise.all(
      artworks.map((art) =>
        new Promise((resolve) => {
          const img = new Image();
          img.src = art.imageUrl;
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
        })
      )
    ).then((results) => setSizes(results));
  }, [artworks]);

  // Load all artwork textures
  const textures = useTexture(artworks.map((art) => art.imageUrl));

  // Animate rotation and floating
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001;

      groupRef.current.children.forEach((mesh, i) => {
        mesh.position.y = Math.sin(clock.getElapsedTime() + i) * 0.2;
      });
    }
  });

  return (
    <>
      <group ref={groupRef}>
        {artworks.map((art, i) => {
          const aspect =
            sizes[i]?.width && sizes[i]?.height
              ? sizes[i].width / sizes[i].height
              : 1; // fallback square

          return (
            <mesh
              key={i}
              position={[(i - artworks.length / 2) * 2.2, 0, -i * 0.2]}
              scale={hoveredIndex === i ? 1.2 : 1}
              onPointerOver={() => setHoveredIndex(i)}
              onPointerOut={() => setHoveredIndex(null)}
              onClick={() => setModalArt(art)}
              castShadow
              receiveShadow
            >
              {/* Adjust width to keep aspect ratio */}
              <RoundedBox
                args={[aspect * 2, 2, 0.1]}
                radius={0.05}
                smoothness={4}
              >
                {/* 6 faces: right, left, top, bottom, front, back */}
                <meshStandardMaterial attachArray="material" color="#222" /> {/* right */}
                <meshStandardMaterial attachArray="material" color="#222" /> {/* left */}
                <meshStandardMaterial attachArray="material" color="#222" /> {/* top */}
                <meshStandardMaterial attachArray="material" color="#222" /> {/* bottom */}
                <meshStandardMaterial attachArray="material" map={textures[i]} /> {/* front */}
                <meshStandardMaterial attachArray="material" color="#111" /> {/* back */}
              </RoundedBox>
            </mesh>
          );
        })}
      </group>

      {/* Modal preview using your existing ArtCard */}
      {modalArt &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setModalArt(null)}
          >
            <div
              className="relative max-w-[50vw] w-full max-h-[90vh] overflow-auto rounded-lg p-4 bg-black"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-3 text-2xl text-white"
                onClick={() => setModalArt(null)}
              >
                ✕
              </button>
              <ArtCard {...modalArt} />
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
