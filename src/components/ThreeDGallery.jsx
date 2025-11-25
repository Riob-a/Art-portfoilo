"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import { TextureLoader } from "three";
import artworks from "../data/artworks";
import { a, useSprings } from "@react-spring/three";

export default function ThreeDFloatingGallery() {
  const [sizes, setSizes] = useState([]);

  useEffect(() => {
    let mounted = true;
    Promise.all(
      artworks.map(
        (art) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = art.imageUrl;
            img.onload = () => resolve({ width: img.width, height: img.height });
            img.onerror = () => resolve({ width: 1, height: 1 });
          })
      )
    ).then((results) => mounted && setSizes(results));

    return () => { mounted = false; };
  }, []);

  return (
    <div className="relative h-[100vh] w-full">
      <Canvas shadows camera={{ position: [0, 0, 10], fov: 60 ,  margin: "auto",  display: "block"}}>
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

/* -------------------
   Gallery Scene
------------------- */
function GalleryScene({ artworks, sizes = [] }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(null);

  const urls = useMemo(() => artworks.map((a) => a.imageUrl), [artworks]);
  const textures = useLoader(TextureLoader, urls);

  useEffect(() => {
    textures?.forEach((t) => { if (t) t.flipY = false; });
  }, [textures]);

  const positions = useMemo(() => {
    const cols = 3;
    const spacingX = 4;
    const spacingZ = 4;
    const yPlane = 3;

    return artworks.map((_, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = (col - (cols - 1) / 2) * spacingX;
      const z = -row * spacingZ;
      return [x, yPlane, z];
    });
  }, [artworks]);

  const springs = useSprings(
    artworks.length,
    artworks.map((_, i) => ({
      from: { scale: 0, opacity: 0 },
      to: { scale: 1, opacity: 1 },
      delay: i * 150,
      config: { mass: 1, tension: 170, friction: 26 },
    }))
  );

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.0016;

    groupRef.current.children.forEach((child, i) => {
      const floatY = Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;
      child.position.y += (floatY - child.position.y) * 0.1;

      const targetScale = hovered === i ? 1.1 : 1;
      child.scale.x += (targetScale - child.scale.x) * 0.1;
      child.scale.y += (targetScale - child.scale.y) * 0.1;
      child.scale.z += (targetScale - child.scale.z) * 0.1;
    });
  });

  return (
    <group ref={groupRef}>
      {artworks.map((art, i) => {
        const tex = textures?.[i];
        const size = sizes?.[i];
        const aspect = size?.width && size?.height ? size.width / size.height : 1;
        const cardHeight = 3;
        const cardWidth = aspect * cardHeight;

        return (
          <a.group
            key={i}
            position={positions[i]}
            scale={springs[i].scale.to(s => [s, s, s])}
            onPointerOver={() => setHovered(i)}
            onPointerOut={() => setHovered(null)}
          >
            <RoundedBox args={[cardWidth + 0.12, cardHeight + 0.12, 0.14]} radius={0.03} smoothness={4}>
              <meshStandardMaterial color="black" metalness={0} roughness={0.1} />
            </RoundedBox>

            {tex ? (
              <mesh position={[0, 0, 0.071]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial map={tex} toneMapped={false} />
              </mesh>
            ) : (
              <mesh position={[0, 0, 0.071]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshStandardMaterial color="#333" />
              </mesh>
            )}
          </a.group>
        );
      })}
    </group>
  );
}
