import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { useGLTF, OrbitControls } from '@react-three/drei'

function PolyHavenModel({ path }) {
  const { scene } = useGLTF(path)
  return <primitive object={scene} scale={3} /> // scale it up/down as needed
}

// Preload the model for faster loading:
useGLTF.preload('/models/Television_01_4k.gltf/Television_01_4k.gltf')

export default function PolyHavenExample() {
  return (
    <Canvas
      className="canvas rounded-xl justify-center"
      // camera={{ position: [0, 0, 5], fov: 30 }}
      style={{ width: '50%', height: '300px', background: '#080808ff' , margin: 'auto'}}
      frameloop="demand"
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.1} />
      <Environment preset="sunset" />
      <directionalLight position={[ 10 ]} intensity={2} />

      {/* Add orbit controls so you can rotate/zoom */}
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} enableZoom={false} enablePan={true}/>

      {/* Load the model */}
      <PolyHavenModel path="/models/Television_01_4k.gltf/Television_01_4k.gltf" />
    </Canvas>
  )
}
