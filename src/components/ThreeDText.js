import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds } from "@react-three/drei";
// import  '../globals.css' 
import { a, useSpring } from "@react-spring/three";

function RotatingPlatform({ children }) {
  const platformRef = useRef();
  useFrame((_, delta) => {
    platformRef.current.rotation.y += delta * 0.2;
    // platformRef.current.rotation.x += delta * 0.2;
    platformRef.current.rotation.z += delta * 0.1;

  });
  return <group ref={platformRef}>{children}</group>;
}

function ChromeText() {
  const textRef = useRef();
  const { viewport } = useThree();
  const textSize = Math.max(1.5, viewport.width / 6);

  // const { opacity } = useSpring({
  //   from: { opacity: 0 },
  //   to: { opacity: 1 },
  //   config: { duration: 1500 }, 
  // });

  return (
    <Center>
      <Text3D

        ref={textRef}
        font="/fonts/Panchang_Bold.json"
        size={4}
        height={4}
        bevelEnabled
        bevelThickness={0.5}
        bevelSize={0.5}
        bevelSegments={10}
        curveSegments={24}
        scale={[1, 1, 1]}
        position={[0, 0, 0]}
      >
        [ PORTFOLIO. ]
        <meshPhysicalMaterial
          color="teal"
          metalness={1}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        // transparent
        // opacity={opacity}
        />
      </Text3D>
    </Center>
  );
}

export default function ThreeDTextWithPlatform() {
  return (
    <Canvas
      className="canvas"
      style={{
        // width: "99%",
        height: "600px",
        padding: "0px",
        margin: "auto",
        display: "block",
        borderBottomLeftRadius: "15px",
        borderBottomRightRadius: "15px",
        // background: "transparent",
      }}
      gl={{ antialias: true }}
      camera={{ position: [0, 5, 40], fov: 60 }}
    >
      {/* Lighting */}
      {/* <ambientLight intensity={0.3} /> */}
      {/* <directionalLight position={[10, 15, 10]} intensity={1.2} /> */}

      <Environment preset="studio" />

      <Bounds fit clip observe>
        {/* <Bounds> */}
        <RotatingPlatform>
          <group scale={[2, 2, 2]}>
            <ChromeText />
          </group>
        </RotatingPlatform>
      </Bounds>
    </Canvas>
  );
}
