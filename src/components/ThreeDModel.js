import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useGLTF, OrbitControls } from '@react-three/drei'

function PolyHavenModel({ path }) {
  // path = '/models/wooden_crate.glb'
  const { scene } = useGLTF(path)
  return <primitive object={scene} scale={6} /> // scale it up/down as needed
}

// Preload the model for faster loading:
useGLTF.preload('/models/Television_01_4k.gltf')

export default function PolyHavenExample() {
  return (
    <Canvas className="canvas rounded-xl" style={{ width: '30%', height: '500px', background: '#000000' }}>
      <ambientLight intensity={0.5} />
      <Environment preset="sunset" />
      <directionalLight position={[5, 10, 5]} intensity={4} />

      {/* Add orbit controls so you can rotate/zoom */}
      <OrbitControls />

      {/* Load the model */}
      <PolyHavenModel path="/models/Television_01_4k.gltf/Television_01_4k.gltf" />
    </Canvas>
  )
}
