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
  const [clicked, setClicked] = useState(false);



  const { clickScale } = useSpring({
    clickScale: clicked ? 1.2 : 1,
    config: { tension: 400, friction: 10 },
    reset: true,
    onRest: () => setClicked(false)   // auto-reset
  });

  const { color } = useSpring({
    color: clicked ? "rgba(240, 146, 6, 1)" : "rgba(0, 127, 140, 1)",
    config: { tension: 200, friction: 20 },
  });


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
              color="rgba(0, 127, 140, 1)"
              // color='black'
              metalness={1}
              roughness={0.5}
              reflectivity={1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Text3D>
        </Center>
      </a.group>

      {/* --- CUBE (grows massively on hover) --- */}
      <a.group
        ref={sphereRef}
        scale={cubeScale.to(s => [s, s, s])}
        // scale={cubeScale.to(s => [s, s, s]).to((s, cs) => [s * clickScale.get(), s * clickScale.get(), s * clickScale.get()])}
        onClick={() => {
          setClicked(true);
          setTimeout(() => setClicked(false), 350);
          router.push("/gallery");
        }}>

        {/* Main visible sphere */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <a.meshPhysicalMaterial
            // color="rgba(0, 127, 140, 1)"
            // color={clicked ? "black" : "rgba(0, 127, 140, 1)"}
            color={color}
            metalness={1}
            roughness={0.5}
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={1}
          />
        </mesh>

        {/* Subtle rotating wireframe overlay */}
        <mesh>
          {/* <sphereGeometry args={[2.02, 24, 24]} /> */}
          <sphereGeometry args={[2.05, 24, 24]} />
          <meshBasicMaterial
            color="black"
            wireframe
            transparent
            opacity={0.5}
            depthWrite={false}
          />
          <Edges
            threshold={10}
          // color="black"           // removes diagonal triangles
          />
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


// "use client";

// import React, { useRef, useState } from "react";
// import { Canvas, useFrame } from "@react-three/fiber";
// import { Text3D, Environment, Center, Bounds, Edges } from "@react-three/drei";
// import { a, useSpring } from "@react-spring/three";
// import { useRouter } from "next/navigation";

// // ----------------------------------------
// // Rotating platform
// // ----------------------------------------
// function RotatingPlatform({ children }) {
//   const platformRef = useRef();
//   useFrame((_, delta) => {
//     platformRef.current.rotation.y += delta * 0.2;
//   });
//   return <group ref={platformRef}>{children}</group>;
// }

// // ----------------------------------------
// // Swappable Text <-> Cube Component
// // ----------------------------------------
// function SwappableTextCube({ setTooltipVisible, setTooltipPos }) {
//   const router = useRouter();
//   const [hovered, setHovered] = useState(false);
//   const [clicked, setClicked] = useState(false);

//   const { clickScale } = useSpring({
//     clickScale: clicked ? 1.2 : 1,
//     config: { tension: 400, friction: 10 },
//     reset: true,
//     onRest: () => setClicked(false),
//   });

//   const { color } = useSpring({
//     color: clicked ? "rgba(240, 146, 6, 1)" : "rgba(0, 127, 140, 1)",
//     config: { tension: 200, friction: 20 },
//   });

//   const { textScale, cubeScale } = useSpring({
//     textScale: hovered ? 0.2 : 1,
//     cubeScale: hovered ? 4.0 : 0,
//     config: { tension: 150, friction: 20 },
//   });

//   const sphereRef = useRef();
//   useFrame((_, delta) => {
//     if (sphereRef.current) {
//       sphereRef.current.rotation.y += delta * 0.6;
//     }
//   });

//   return (
//     <group
//       onPointerOver={() => {
//         setHovered(true);
//         document.body.style.cursor = "pointer";
//         setTooltipVisible(true); // show tooltip
//       }}

//       onPointerOut={() => {
//         setHovered(false);
//         document.body.style.cursor = "default";
//         setTooltipVisible(false); // hide tooltip
//       }}

//     >
//       {/* TEXT */}
//       <a.group scale={textScale.to((s) => [s, s, s])}>
//         <Center>
//           <Text3D
//             font="/fonts/Panchang_Bold.json"
//             size={4}
//             height={4}
//             bevelEnabled
//             bevelThickness={0.9}
//             bevelSize={0.5}
//             bevelSegments={15}
//             curveSegments={24}
//           >
//             [ PORTFOLIO. ]
//             <meshPhysicalMaterial
//               color="rgba(0, 127, 140, 1)"
//               metalness={1}
//               roughness={0.5}
//               reflectivity={1}
//               clearcoat={1}
//               clearcoatRoughness={0}
//             />
//           </Text3D>
//         </Center>
//       </a.group>

//       {/* SPHERE */}
//       <a.group
//         ref={sphereRef}
//         scale={cubeScale.to((s) => [s, s, s])}
//         onClick={() => {
//           setClicked(true);
//           setTimeout(() => setClicked(false), 250);
//           router.push("/gallery");
//         }}
//       >
//         <mesh>
//           <sphereGeometry args={[2, 64, 64]} />
//           <a.meshPhysicalMaterial
//             color={color}
//             metalness={1}
//             roughness={0.5}
//             clearcoat={1}
//             clearcoatRoughness={0}
//             reflectivity={1}
//           />
//         </mesh>

//         {/* Wireframe overlay */}
//         <mesh>
//           <sphereGeometry args={[2.05, 24, 24]} />
//           <meshBasicMaterial
//             color="black"
//             wireframe
//             transparent
//             opacity={0.5}
//             depthWrite={false}
//           />
//           <Edges threshold={10} />
//         </mesh>
//       </a.group>
//     </group>
//   );
// }

// // ----------------------------------------
// // Main Canvas Component (with tooltip wrapper)
// // ----------------------------------------
// export default function ThreeDTextWithPlatform() {
//   const [tooltipVisible, setTooltipVisible] = useState(false);
//   const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

//   return (
//     <div style={{ position: "relative" }}>
//       {/* ----------- Tooltip HTML (OUTSIDE Canvas) ----------- */}
//       {tooltipVisible && (
//         <div
//           style={{
//             position: "fixed",
//             top: "60px",   // fixed Y position near the canvas
//             left: "50px",  // fixed X position near the canvas
//             padding: "6px 10px",
//             background: "rgba(0,0,0,0.75)",
//             color: "white",
//             fontSize: "13px",
//             borderRadius: "6px",
//             pointerEvents: "none",
//             whiteSpace: "nowrap",
//             zIndex: 9999,
//           }}
//         >
//           Go to Gallery →
//         </div>
//       )}


//       {/* ----------- Canvas ----------- */}
//       <Canvas
//         style={{
//           height: "800px",
//           margin: "auto",
//           display: "block",
//         }}
//         dpr={[1, 1.5]}
//         gl={{ antialias: true }}
//         camera={{ position: [0, -10, 40], fov: 60 }}
//       >
//         <ambientLight intensity={0.5} />
//         <directionalLight position={[5, 5, 5]} intensity={1} />
//         <Environment preset="sunset" blur={0.9} />

//         <Bounds fit clip observe>
//           <RotatingPlatform>
//             <SwappableTextCube
//               setTooltipVisible={setTooltipVisible}
//               setTooltipPos={setTooltipPos}
//             />
//           </RotatingPlatform>
//         </Bounds>
//       </Canvas>
//     </div>
//   );
// }
