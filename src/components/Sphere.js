"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Edges,
  Html,
  Sparkles,
  Bounds,
} from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// ----------------------------------------
// Rotating Sphere
// ----------------------------------------
function InteractiveSphere({ audioCtxRef }) {
  const router = useRouter();
  const sphereGroupRef = useRef(null);

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const hoverSourceRef = useRef(null);
  const hoverGainRef = useRef(null);

  // Color feedback
  const { color } = useSpring({
    color: clicked
      ? "#f5f7fa"
      : "#1d709dac",
    config: { tension: 180, friction: 20 },
  });

  // Subtle scale feedback
  const { scale } = useSpring({
    scale: hovered ? 1.15 : 1,
    config: { tension: 150, friction: 18 },
  });

  // Rotation
  useFrame((_, delta) => {
    if (sphereGroupRef.current) {
      const targetSpeed = hovered ? 1 : 0.5;
      sphereGroupRef.current.userData.currentSpeed =
        THREE.MathUtils.lerp(
          sphereGroupRef.current.userData.currentSpeed || 0.5,
          targetSpeed,
          delta * 3 // adjust smoothing factor
        );
      sphereGroupRef.current.rotation.y += delta * sphereGroupRef.current.userData.currentSpeed;
    }
  });


  // ----------------------------------------
  // Audio helpers
  // ----------------------------------------
  const startHoverSound = () => {
    const ctx = audioCtxRef.current;
    const buffer = ctx && ctx.hoverBuffer;
    if (!ctx || !buffer || hoverSourceRef.current) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    source.loop = true;
    gain.gain.value = 0.05;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);

    hoverSourceRef.current = source;
    hoverGainRef.current = gain;
  };

  const setHoverVolume = (value, duration = 0.15) => {
    const ctx = audioCtxRef.current;
    const gain = hoverGainRef.current;
    if (!ctx || !gain) return;

    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(
      value,
      ctx.currentTime + duration
    );
  };

  const playClick = () => {
    const ctx = audioCtxRef.current;
    const buffer = ctx && ctx.clickBuffer;
    if (!ctx || !buffer) return;

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();

    source.buffer = buffer;
    gain.gain.value = 0.25;

    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  };

  return (
    <a.group
      ref={sphereGroupRef}
      scale={scale.to((s) => [s, s, s])}
      onPointerOver={() => {
        setHovered(true);
        setShowTooltip(true);
        document.body.style.cursor = "pointer";
        startHoverSound();
        setHoverVolume(0.2, 0.15);
      }}
      onPointerOut={() => {
        setHovered(false);
        setShowTooltip(false);
        document.body.style.cursor = "default";
        setHoverVolume(0.15, 0.2);
      }}
      onClick={() => {
        setClicked(true);
        playClick();
        setTimeout(() => setClicked(false), 200);
        router.push("/gallery");
      }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <Html position={[0, 3.2, 0]} center>
          <div
            className="logo-3"
            style={{
              background: "rgba(0,0,0,0.7)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "6px",
              fontSize: "14px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              backdropFilter: "blur(4px)",
              transform: "translateY(-10px)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            Click to View Gallery
          </div>
        </Html>
      )}

      {/* Solid sphere */}
      <mesh>
        <sphereGeometry args={[2, 64, 64]} />
        <a.meshPhysicalMaterial
          color={color}
          metalness={0.2}
          roughness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.4}
          reflectivity={1}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh>
        <sphereGeometry args={[2.02, 40, 20]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges threshold={1} color="rgba(136, 136, 136, 1)"
        />
      </mesh>

      {/* <Sparkles count={30} scale={12} size={1.2} speed={0.25} /> */}
    </a.group>
  );
}

// ----------------------------------------
// Canvas Wrapper with Audio Unlock
// ----------------------------------------
export default function InteractiveSpinningSphere() {
  const audioCtxRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioCtxRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();

    const loadSound = async (url) => {
      const res = await fetch(url);
      const buffer = await res.arrayBuffer();
      return audioCtxRef.current.decodeAudioData(buffer);
    };

    Promise.all([
      loadSound("/sounds/hover.wav"),
      loadSound("/sounds/click.wav"),
    ]).then(([hoverBuffer, clickBuffer]) => {
      audioCtxRef.current.hoverBuffer = hoverBuffer;
      audioCtxRef.current.clickBuffer = clickBuffer;
    });

    const unlock = async () => {
      if (audioUnlockedRef.current) return;
      audioUnlockedRef.current = true;

      if (audioCtxRef.current.state === "suspended") {
        await audioCtxRef.current.resume();
      }

      document.removeEventListener("pointerdown", unlock);
    };

    document.addEventListener("pointerdown", unlock);
    return () => document.removeEventListener("pointerdown", unlock);
  }, []);

  return (
    <Canvas
      className="home"
      style={{ height: "625px", width: "99%", margin: "auto", display: "block" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, -4, 5], fov: 60 }}
      gl={{ antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.0} />
      <Environment preset="studio" blur={0.8} />

      <Bounds clip observe>
        <InteractiveSphere audioCtxRef={audioCtxRef} />
      </Bounds>
    </Canvas>
  );
}
