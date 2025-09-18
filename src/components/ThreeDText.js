// // ThreeDText.js
// import React, { Suspense } from 'react'
// import { Canvas } from '@react-three/fiber'
// import { OrbitControls, Text3D } from '@react-three/drei'
// import * as THREE from 'three'

// export default function ThreeDText() {
//   return (
//     <Canvas
//       style={{ height: '90vh', width: '90vw', background: 'linear-gradient(60deg, #D9C3AB, #F16001, #C10801, #000000)' }}
//       camera={{ position: [0, 0, 40], fov: 60 }}
//     >
//       {/* Lights */}
//       <ambientLight intensity={0.3} />
//       <directionalLight position={[10, 10, 10]} intensity={1} />

//       {/* Controls */}
//       <OrbitControls enableZoom={true} />

//       <Suspense fallback={null}>
//         <mesh rotation={[0, 0.3, 0]}>
//           <Text3D
//             font="/helvetiker_regular.typeface.json" // place this in your /public folder
//             size={5}
//             height={2}
//             curveSegments={12}
//             bevelEnabled
//             bevelThickness={0.5}
//             bevelSize={0.3}
//             bevelSegments={5}
//           >
//             PORTFOLIO
//             <meshStandardMaterial
//               color={'#00ffff'}
//               metalness={0.2}
//               roughness={0.4}
//             />
//           </Text3D>
//         </mesh>
//       </Suspense>
//     </Canvas>
//   )
// }

// import React, { useRef } from 'react'
// import { Canvas, useFrame } from '@react-three/fiber'
// import { Text3D } from '@react-three/drei'
// import * as THREE from 'three'

// function AnimatedText() {
//   const textRef = useRef()
//   const materialRef = useRef()

//   useFrame((state, delta) => {
//     // Rotate text
//     textRef.current.rotation.y += delta * 0.3

//     // Animate color hue
//     const t = state.clock.getElapsedTime()
//     const hue = (t * 20) % 360 // degrees
//     materialRef.current.color.setHSL(hue / 360, 1, 0.5)
//   })

//   return (
//     <Text3D
//       ref={textRef}
//       font="/helvetiker_regular.typeface.json"
//       size={5}
//       height={2}
//       bevelEnabled
//       bevelThickness={0.5}
//       bevelSize={0.3}
//     >
//       PORTFOLIO
//       <meshStandardMaterial
//         ref={materialRef}
//         color="#00ffff"
//         metalness={0.3}
//         roughness={0.4}
//       />
//     </Text3D>
//   )
// }

// export default function Scene() {
//   return (
//     <Canvas
//       style={{ height: '100vh', background: ' #000000' }}
//       camera={{ position: [0, 0, 50], fov: 60 }}
//     >
//       <ambientLight intensity={0.3} />
//       <directionalLight position={[10, 10, 10]} intensity={1} />

//       <AnimatedText />
//     </Canvas>
//   )
// }
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Text3D } from '@react-three/drei'

function RotatingPlatform({ children }) {
  const platformRef = useRef()
  useFrame((_, delta) => {
    platformRef.current.rotation.y += delta * 0.3
  })
  return <group ref={platformRef}>{children}</group>
}

// New child component to animate text color
function AnimatedText() {
  const textRef = useRef()
  const materialRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    const hue = (t * 20) % 360
    materialRef.current.color.setHSL(hue / 360, 1, 0.5)
  })

  return (
    <Text3D
      ref={textRef}
      // font="/helvetiker_regular.typeface.json"
      font="/fonts/Unbounded Black_Regular.json"

      size={5}
      height={2}
      bevelEnabled
      bevelThickness={0.3}
      bevelSize={0.2}
      bevelSegments={3}
      position={[-15, 0, 0]}
    >
      PORTFOLIO
      <meshStandardMaterial
        ref={materialRef}
        color="#00ffff"
        metalness={0.3}
        roughness={0.4}
      />
    </Text3D>
  )
}

export default function ThreeDTextWithPlatform() {
  return (
    <Canvas
      className='rounded-xl '
      style={{ width: '100%', height: '550px', background: '#000000',  padding: '20px 20px;' }}
      camera={{ position: [0, 5, 40], fov: 60 }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 15, 10]} intensity={1.2} />

      <RotatingPlatform>
        {/* The platform (a cylinder) */}
        <mesh position={[0, -5, 0]}>
          <cylinderGeometry args={[15, 15, 2, 64]} />
          <meshStandardMaterial color="#fff8f8ff" metalness={0.3} roughness={0.9} />
        </mesh>

        {/* Animated text now inside Canvas */}
        <AnimatedText />
      </RotatingPlatform>
    </Canvas>
  )
}
