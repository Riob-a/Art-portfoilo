"use client";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
// import Spots from "../textures/Spots.jpg";

export default function PolyHavenTV({ path, screenTextureUrl }) {
  const { scene } = useGLTF(path);

  // Load the screen texture once
  const texture = useMemo(() => new THREE.TextureLoader().load(screenTextureUrl), [screenTextureUrl]);
  // const texture = useMemo(() => new THREE.TextureLoader().load(Spots), []);

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("screen")) {
        child.material = new THREE.MeshBasicMaterial({ map: texture, toneMapped: false });
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} scale={3} />;
}

useGLTF.preload("/models/Television_01_4k.gltf/Television_01_4k.gltf");
