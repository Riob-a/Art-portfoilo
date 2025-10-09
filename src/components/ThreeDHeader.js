// import React, { useRef, useEffect, useState } from "react";
// import { Canvas, useFrame, useThree } from "@react-three/fiber";
// import { Text3D, Environment, Center, Bounds } from "@react-three/drei";
// import { a, useSpring } from "@react-spring/three";

// function RotatingPlatform({ children }) {
//   const platformRef = useRef();
//   const [scrollY, setScrollY] = useState(0);

//   // Track scroll position
//   useEffect(() => {
//     const handleScroll = () => setScrollY(window.scrollY);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useFrame(() => {
//     if (platformRef.current) {
//       // Map scroll to tilt (-0.4 to 0.4 radians, ~-23° to 23°)
//       const tilt = (scrollY / window.innerHeight) * 0.8 - 0.4;
//       platformRef.current.rotation.x = tilt;
//     }
//   });

//   return <group ref={platformRef}>{children}</group>;
// }

// function ChromeText({ text, scale = [2, 2, 2]  }) {
//   const textRef = useRef();
//   const { viewport } = useThree();

//   const { opacity } = useSpring({
//     from: { opacity: 0 },
//     to: { opacity: 1 },
//     config: { duration: 1500 },
//   });

//   return (
//     <Center>
//       <Text3D
//         ref={textRef}
//         font="/fonts/Panchang_Bold.json"
//         // size={4}
//         size={8}
//         height={3}
//         bevelEnabled
//         bevelThickness={0.1}
//         bevelSize={0.4}
//         bevelSegments={10}
//         curveSegments={24}
//         // scale={[2, 2, 2]}
//         scale={[3, 3, 3]}
//         position={[0, 0, 0]}
//       >
//         {text}
//         <meshPhysicalMaterial
//           color="#ffffffff"
//           metalness={1}
//           roughness={0.05}
//           reflectivity={1}
//           clearcoat={1}
//           clearcoatRoughness={0}
//           opacity={opacity}
//         />
//       </Text3D>
//     </Center>
//   );
// }

// export default function ThreeDTextWithPlatform({ heading = "PORTFOLIO." , scale = [3, 3, 3], height = "200px",}) {
//   return (
//     <Canvas
//       className="rounded"
//       style={{
//         width: "100%",
//         height: "400px",
//         background: "transparent",
//       }}
//       gl={{ antialias: true }}
//       camera={{ position: [0, 5, 25], fov: 60 }}
//     >
//       <Environment preset="studio" />

//       <Bounds fit clip observe>
//         <RotatingPlatform>
//           <ChromeText text={heading} scale={scale}/>
//         </RotatingPlatform>
//       </Bounds>
//     </Canvas>
//   );
// }
import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";

function RotatingPlatform({ children }) {
  const platformRef = useRef();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame(() => {
    if (platformRef.current) {
      const tilt = (scrollY / window.innerHeight) * 0.8 - 0.4;
      platformRef.current.rotation.x = tilt;
    }
  });

  return <group ref={platformRef}>{children}</group>;
}

function ChromeText({ text, scale = [3, 3, 3] }) {
  const textRef = useRef();
  const { viewport } = useThree();

  const { opacity } = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1500 },
  });

  return (
    <Center>
      <Text3D
        ref={textRef}
        font="/fonts/Panchang_Bold.json"
        size={4}            // bigger font geometry
        height={4}           // thicker depth
        bevelEnabled
        bevelThickness={0.1}
        bevelSize={0.4}
        bevelSegments={10}
        curveSegments={24}
        scale={scale}        // amplify overall scale
        position={[0, 0, 0]}
      >
        {text}
        <meshPhysicalMaterial
          color="black"
          metalness={1}
          roughness={0.05}
          reflectivity={1}
          clearcoat={1}
          clearcoatRoughness={0}
          opacity={opacity}
        />
      </Text3D>
    </Center>
  );
}

export default function ThreeDTextWithPlatform({
  heading = "PORTFOLIO.",
  scale = [1, 1, 1],          // global multiplier
  // height = "200px",
}) {
  return (
    <Canvas
      className="rounded"
      style={{
        width: "600px",
        height: "400px",
        background: "transparent",
      }}
      gl={{ antialias: true }}
      camera={{ position: [0, 5, 40], fov: 60 }}  // closer camera
    >
      <Environment preset="studio" />
      
      {/* Bounds keeps it centered, but we removed "fit" so scaling is manual */}
      <Bounds clip observe>
        <RotatingPlatform>
          <ChromeText text={heading} scale={scale} />
        </RotatingPlatform>
      </Bounds>
    </Canvas>
  );
}

