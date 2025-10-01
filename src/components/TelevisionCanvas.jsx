"use client";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import PolyHavenTV from "./PolyHavenTV";

export default function TelevisionCanvas() {
  return (
    <Canvas
      className="rounded-lg cursor-grab"
      style={{ width: "15%", height: "215px", margin: "auto", background: "#141414ff", }}
    >
      <ambientLight intensity={0.1} />
      {/* <directionalLight position={[5, 5]} intensity={1.2} /> */}
      <Environment preset="sunset" />
      <OrbitControls makeDefault enableDamping dampingFactor={0.05} enablePan enableZoom={false} />

      <PolyHavenTV
        // path="/models/Television_01_4k.gltf/Television_01_4k.gltf"
        path="/models/Television_01_custom.glb"
        screenTextureUrl="models/Television_01_4k.gltf/textures/S.jpg"
      />
    </Canvas>
  );
}
