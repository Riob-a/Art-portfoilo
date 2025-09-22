"use client";
import React, { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function PolyHavenTV({ path, screenTextureUrl }) {
  const { scene } = useGLTF(path);

  const texture = useMemo(
    () => new THREE.TextureLoader().load(screenTextureUrl),
    [screenTextureUrl]
  );

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.name.toLowerCase().includes("tv_screen")) {
        child.material = new THREE.MeshPhysicalMaterial({
          map: texture,
          metalness: 0.7,           
          roughness: 0.2,           
          clearcoat: 1,             
          clearcoatRoughness: 0.05,  
          reflectivity: 1,           
          transmission: 0,           
          ior: 1.45,
          toneMapped: false,
        });
      }
    });
  }, [scene, texture]);

  return <primitive object={scene} scale={4} />;
}

useGLTF.preload("/models/Television_01_custom.glb");

