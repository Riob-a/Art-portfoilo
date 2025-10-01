
import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds } from "@react-three/drei";

function RotatingPlatform({ children }) {
  const platformRef = useRef();
  useFrame((_, delta) => {
    platformRef.current.rotation.y += delta * 0.1; // slow rotation
  });
  return <group ref={platformRef}>{children}</group>;
}

function ChromeText() {
  const textRef = useRef();
  const { viewport } = useThree();

  const textSize = Math.max(1.5, viewport.width / 6);

  return (
    <Center>
      <Text3D
        ref={textRef}
        font="/fonts/Panchang_Bold.json"
        size={4}
        height={3}
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.5}
        bevelSegments={10}
        curveSegments={24}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
      >
        [ PORTFOLIO. ]
        <meshPhysicalMaterial
          color="#ffffff"       // base white, reflections do the rest
          metalness={1}         // fully metallic
          roughness={0.05}         // perfectly smooth surface
          reflectivity={1}      // strong reflections
          clearcoat={1}         // extra shiny layer
          clearcoatRoughness={0}
        />
      </Text3D>
    </Center>
  );
}

export default function ThreeDTextWithPlatform() {
  return (
    <Canvas
      className="rounded-xl"
      style={{
        width: "100%",
        height: "550px",
        background: "#000000ff", // dark bg makes chrome stand out
      }}
      gl={{ antialias: true }}
      camera={{ position: [0, 5, 40], fov: 60 }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />

      <Environment preset="studio" />

      <Bounds fit clip observe>
        <RotatingPlatform>
          <ChromeText />
        </RotatingPlatform>
      </Bounds>
    </Canvas>
  );
}
