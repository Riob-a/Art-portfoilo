"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { TextureLoader } from "three";
import * as THREE from "three";
import artworks from "../data/artworks";
import { a, useSprings } from "@react-spring/three";

export default function ThreeDFloatingGallery() {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all(
      artworks.map(
        art =>
          new Promise(resolve => {
            const img = new Image();
            img.src = art.imageUrl;
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 1, height: 1 });
          })
      )
    ).then(results => mounted && setSizes(results));

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="relative h-[100vh] w-full">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-5, 2, -5]} intensity={0.6} />

        <Suspense fallback={null}>
          <GalleryScene artworks={artworks} sizes={sizes} />
        </Suspense>

        <OrbitControls enablePan enableZoom />
      </Canvas>
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
      bevelSegments: 5
    }),
    [depth]
  );

  return (
    <mesh>
      <extrudeGeometry args={[shape, extrudeSettings]} />
      <meshStandardMaterial
        color="#111"
        roughness={0.3}
        metalness={0.2}
      />
    </mesh>
  );
}

/* -------------------
   Gallery Scene
------------------- */
function GalleryScene({ artworks, sizes = [] }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  const urls = useMemo(() => artworks.map(a => a.imageUrl), [artworks]);
  const textures = useLoader(TextureLoader, urls);

  useEffect(() => {
    textures?.forEach(t => {
      if (t) t.flipY = false;
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

  /* -------- SPRINGS FOR HOVER EFFECT -------- */
  const springs = useSprings(
    artworks.length,
    artworks.map((_, i) => ({
      scale: hovered === i ? 1.1 : 1,
      rotation: hovered === i ? [0.1, 0.4, 0] : [0, 0, 0],
      opacity: 1,
      config: { mass: 1, tension: 170, friction: 20 }
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
            scale={springs[i].scale.to(s => [s, s, s])}
            rotation={springs[i].rotation}
            onPointerOver={() => setHovered(i)}
            onPointerOut={() => setHovered(null)}
          >
            {/* BACK BEVELED PLATE */}
            <BeveledCard
              width={cardWidth + 0.12}
              height={cardHeight + 0.12}
              depth={0.5}
            />

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

            {/* GLASS PANE OVER ART */}
            <mesh position={[0, 0, 0.72]}>
              <planeGeometry args={[cardWidth, cardHeight]} />
              <meshPhysicalMaterial
                transmission={1}
                transparent={true}
                color="#e5f7ff"   // faint blue anti-reflection tint
                opacity={0.12}
                roughness={0.05}
                thickness={0.1}
                ior={1.05}
                clearcoat={1}
                clearcoatRoughness={0}
                reflectivity={1}
                depthWrite={false}
              />
            </mesh>

          </a.group>
        );
      })}
    </group>
  );
}
