"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { createPortal } from "react-dom";
import ArtCard from "./ArtCard";
import artworks from "../data/artworks"; // adjust path if your alias differs

export default function ThreeDFloatingGallery() {
  // sizes loaded outside the Canvas (DOM Image) so we can calculate aspect ratios
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all(
      artworks.map(
        (art) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = art.imageUrl;
            img.onload = () => {
              resolve({ width: img.width, height: img.height });
            };
            img.onerror = () => {
              // fallback to square if load fails
              resolve({ width: 1, height: 1 });
            };
          })
      )
    ).then((results) => {
      if (mounted) setSizes(results);
    });
    return () => {
      mounted = false;
    };
  }, []);

  // modal state is outside Canvas (so we can render React modal normally)
  const [modalArt, setModalArt] = useState(null);

  return (
    <div className="relative h-[80vh] w-full">
      <Canvas shadows camera={{ position: [0, 0, 12], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -5]} intensity={0.6} />

        <Suspense fallback={null}>
          <GalleryScene
            artworks={artworks}
            sizes={sizes}
            onOpenModal={(art) => setModalArt(art)}
          />
        </Suspense>

        <OrbitControls enablePan enableZoom />
      </Canvas>

      {/* Modal rendered in DOM via portal */}
      {modalArt &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            onClick={() => setModalArt(null)}
          >
            <div
              className="relative max-w-[80vw] w-full max-h-[90vh] overflow-auto rounded-lg p-4 bg-black"
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
    </div>
  );
}

/* -------------------
   Scene (inside Canvas)
   ------------------- */
function GalleryScene({ artworks, sizes = [], onOpenModal }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  // Build array of urls for useLoader
  const urls = useMemo(() => artworks.map((a) => a.imageUrl), [artworks]);

  // Load textures inside Canvas (this hook must be in a Canvas child)
  const textures = useLoader(TextureLoader, urls);

  // Ensure textures have correct orientation for use as plane maps
  useEffect(() => {
    if (!textures) return;
    textures.forEach((t) => {
      if (t) t.flipY = false;
    });
  }, [textures]);


  // precompute positions (grid layout, same Y-plane)
  const positions = useMemo(() => {
    const cols = 3; // cards per row
    const spacingX = 3; // horizontal spacing
    const spacingZ = 3; // depth spacing
    const yPlane = 0; // all cards on same Y-plane

    return artworks.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * spacingX; // center grid around 0
      const z = -row * spacingZ;
      return [x, yPlane, z];
    });
  }, [artworks]);


  // auto-rotate group, and floating motion per card
  // useFrame(({ clock }) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y += 0.0016; // slow rotation
  //     groupRef.current.children.forEach((child, i) => {
  //       // subtle floating
  //       const floatY = Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;
  //       child.position.y = floatY;
  //     });
  //   }
  // });

  // Inside GalleryScene
  useFrame(({ clock }) => {
    if (groupRef.current) {
      // rotate the whole group slowly
      groupRef.current.rotation.y += 0.0016;

      groupRef.current.children.forEach((child, i) => {
        // floating motion
        const floatY = Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;
        // smoothly interpolate current y to target floatY
        child.position.y += (floatY - child.position.y) * 0.1;

        // hover scale animation
        const targetScale = hovered === i ? 1.1 : 1;
        child.scale.x += (targetScale - child.scale.x) * 0.1;
        child.scale.y += (targetScale - child.scale.y) * 0.1;
        child.scale.z += (targetScale - child.scale.z) * 0.1;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {artworks.map((art, i) => {
        const tex = textures?.[i];
        const size = sizes?.[i];
        // fallback aspect -> 1:1
        const aspect = size && size.width && size.height ? size.width / size.height : 1;
        const cardHeight = 2; // card height in world units
        const cardWidth = aspect * cardHeight;

        return (
          <group
            key={i}
            position={positions[i]}
            scale={hovered === i ? 1.1 : 1}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(i);
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              setHovered((s) => (s === i ? null : s));
            }}
            onClick={(e) => {
              e.stopPropagation();
              onOpenModal(art);
            }}
          >
            {/* 3D rounded box body (slightly behind the front plane) */}
            <RoundedBox args={[cardWidth + 0.12, cardHeight + 0.12, 0.14]} radius={0.04} smoothness={6}>
              <meshStandardMaterial color="black" metalness={0.2} roughness={0.1} />
            </RoundedBox>

            {/* Front plane sitting just above the box to display the texture */}
            {tex ? (
              <mesh position={[0, 0, (0.14 / 2) + 0.001]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            ) : (
              // fallback simple plane if texture not yet loaded
              <mesh position={[0, 0, (0.14 / 2) + 0.001]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            )}

            {/* subtle hover pop */}
          </group>
        );
      })}
    </group>
  );
}
