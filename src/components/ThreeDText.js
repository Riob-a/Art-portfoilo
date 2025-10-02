import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";

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

  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1500 }, // fade duration (ms)
  });

  return (
    <Center>
      <Text3D

        ref={textRef}
        font="/fonts/Panchang_Bold.json"
        size={4}
        height={3}
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.4}
        bevelSegments={10}
        curveSegments={24}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
      >
        [ PORTFOLIO. ]
        <meshPhysicalMaterial
          color="#ffffffff"       
          metalness={1}        
          roughness={0.05}         
          reflectivity={1}      
          clearcoat={1}         
          clearcoatRoughness={0}
          // transparent
          opacity={opacity}
        />
      </Text3D>
    </Center>
  );
}

export default function ThreeDTextWithPlatform() {
  return (
    <Canvas
      className="rounde"
      style={{
        width: "100%",
        height: "550px",
        background: "#f69b13ff", 
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
