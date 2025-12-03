"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds, RoundedBox, Edges } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useRouter } from "next/navigation";
import * as THREE from "three";


// ----------------------------------------
// Rotating platform for text/cube
// ----------------------------------------
function RotatingPlatform({ children }) {
  const platformRef = useRef();

  useFrame((_, delta) => {
    platformRef.current.rotation.y += delta * 0.2; // slow rotation
  });

  return <group ref={platformRef}>{children}</group>;
}

// ----------------------------------------
// Swappable Text <-> Cube Component
// ----------------------------------------
function SwappableTextCube() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const svgString = `
     <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"
      viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 17L17 7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
    `;

  const svgDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;

  const texture = useLoader(THREE.TextureLoader, svgDataUrl);
  texture.colorSpace = THREE.SRGBColorSpace;

  // Smooth animation for BOTH text and cube
  const { textScale, cubeScale } = useSpring({
    textScale: hovered ? 0.2 : 1,   // shrink text smaller than cube
    cubeScale: hovered ? 4.0 : 0,   // cube grows huge
    config: { tension: 150, friction: 20 },
  });

  const sphereRef = useRef();

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.6;  // smooth spin
    }
  });

  return (
    <group
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      {/* --- 3D TEXT (shrinks instead of fading) --- */}
      <a.group scale={textScale.to(s => [s, s, s])}>
        <Center>
          <Text3D
            font="/fonts/Panchang_Bold.json"
            size={4}
            height={4}
            bevelEnabled
            bevelThickness={0.9}
            bevelSize={0.5}
            bevelSegments={15}
            curveSegments={24}
          >
            [ PORTFOLIO. ]
            <meshPhysicalMaterial
              color="black"
              metalness={1}
              roughness={0.05}
              reflectivity={1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Text3D>
        </Center>
      </a.group>

      {/* --- CUBE (grows massively on hover) --- */}
      <a.group ref={sphereRef} scale={cubeScale.to(s => [s, s, s])}>

        {/* Main visible sphere */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <meshPhysicalMaterial
            color="#007f8c"
            roughness={0.5}
            clearcoat={1}
            clearcoatRoughness={1}
            reflectivity={1}
          />
        </mesh>

        {/* Subtle rotating wireframe overlay */}
        <mesh>
          {/* <sphereGeometry args={[2.02, 24, 24]} /> */}
          <sphereGeometry args={[2.02, 24, 12]} />
          <meshBasicMaterial
            color="black"
            wireframe
            transparent
            opacity={0.5}
            depthWrite={false}
          />
          {/* <Edges
            threshold={2}          // removes diagonal triangles
          /> */}
        </mesh>

      </a.group>

    </group>
  );
}


// ----------------------------------------
// Main Canvas Component
// ----------------------------------------
export default function ThreeDTextWithPlatform() {
  return (
    <Canvas
      style={{
        height: "800px",
        margin: "auto",
        display: "block",
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [0, -10, 40], fov: 60 }}
    >
      {/* Lighting & Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="sunset" blur={0.9} />

      <Bounds fit clip observe>
        <RotatingPlatform>
          <SwappableTextCube />
        </RotatingPlatform>
      </Bounds>
    </Canvas>
  );
}
