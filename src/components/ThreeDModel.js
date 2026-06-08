import React, { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, Center, Html } from '@react-three/drei'
import { detectDeviceTier } from '@/utils/deviceTier'

const tier = detectDeviceTier()

const ENV_CONFIG = {
  high: { preset: 'studio' },
  mid:  { preset: 'sunset' },
  low:  null,
}

const TIER_CONFIG = {
  high: { dpr: [1, 2],   antialias: true  },
  mid:  { dpr: [1, 1.5], antialias: false },
  low:  { dpr: [1, 1],   antialias: false },
}

function Model({ path, autoRotate }) {
  const { scene } = useGLTF(path)   // hooks first
  const ref = useRef()
  useFrame((_, delta) => {
    if (autoRotate && ref.current) ref.current.rotation.y += delta * 0.4
  })
  if (!path) return null             // guard after hooks
  return (
    <Center>
      <primitive ref={ref} object={scene} scale={3}/>
    </Center>
  )
}

function LoadingFallback() {
  return (
    <Html center>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        color: 'white', fontFamily: 'Unbounded, sans-serif',
        fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase',
      }}>
        <span style={{ opacity: 0.8 }}>Loading...</span>
      </div>
    </Html>
  )
}

export default function ThreeDModel({
  path,
  height = '400px',
  autoRotate = true,
}) {
  if (!path) return null

  const env = ENV_CONFIG[tier]
  const cfg = TIER_CONFIG[tier]

  return (
    <div style={{
      width: '100%',
      height,
      border: '2px solid black',
      boxShadow: '3px 3px 0 black',
      background: 'var(--bg, #0a0a0a)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Canvas
        frameloop={autoRotate ? "always" : "demand"}
        dpr={cfg.dpr}
        gl={{ antialias: cfg.antialias }}
        camera={{ position: [0, 1.5, 4], fov: 40 }}
        style={{ width: '100%', height: '100%' }}
      >
        <ambientLight intensity={tier === 'low' ? 1.5 : 0.5} />
        <directionalLight position={[5, 5, 5]} intensity={tier === 'low' ? 2 : 1} />
        <directionalLight position={[-5, 2, -3]} intensity={0.6} />

        {env && <Environment preset={env.preset} />}

        <Suspense fallback={<LoadingFallback />}>
          <Model path={path} autoRotate={autoRotate} />
        </Suspense>

        <OrbitControls makeDefault enableDamping dampingFactor={0.05} enableZoom={true} enablePan={false} />
      </Canvas>
    </div>
  )
}