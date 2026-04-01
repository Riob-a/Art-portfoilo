"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Edges, Html, Bounds } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// ----------------------------------------
// Rotating Sphere
// ----------------------------------------
function InteractiveSphere({ audioCtxRef, isSmallScreen }) {
  const router = useRouter();
  const sphereGroupRef = useRef(null);

  const baseScale = isSmallScreen ? 1.35 : 1;

  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const hoverSourceRef = useRef(null);
  const hoverGainRef = useRef(null);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth < 1024;

  // Color feedback
  const { color } = useSpring({
    color: clicked ? "#a70404" : "#1d709dac",
    config: { tension: 180, friction: 20 },
  });

  // Subtle scale feedback
  const { scale } = useSpring({
    scale: hovered ? baseScale * 1.12 : baseScale,
    config: { tension: 150, friction: 18 },
  });

  // Rotation
  useFrame((_, delta) => {
    if (sphereGroupRef.current) {
      const targetSpeed = hovered ? 1 : 0.5;
      sphereGroupRef.current.userData.currentSpeed = THREE.MathUtils.lerp(
        sphereGroupRef.current.userData.currentSpeed || 0.5,
        targetSpeed,
        delta * 3
      );
      sphereGroupRef.current.rotation.y +=
        delta * sphereGroupRef.current.userData.currentSpeed;
    }
  });

  // Intersection observer — pause when off screen
  useEffect(() => {
    const canvas = document.querySelector(".home");
    if (!canvas) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        canvas.style.visibility = entry.isIntersecting ? "visible" : "hidden";
      },
      { threshold: 0.1 }
    );

    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

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
    gain.gain.linearRampToValueAtTime(value, ctx.currentTime + duration);
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

  // Phone/Tablet interactivity
  const activateHover = () => {
    setHovered(true);
    setShowTooltip(true);
    startHoverSound();
    setHoverVolume(0.2, 0.15);
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const deactivateHover = () => {
    setHovered(false);
    setShowTooltip(false);
    setHoverVolume(0.15, 0.2);
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
        activateHover();
      }}
      onPointerOut={() => {
        setHovered(false);
        setShowTooltip(false);
        document.body.style.cursor = "default";
        setHoverVolume(0.15, 0.2);
        deactivateHover();
      }}
      onClick={() => {
        if (isTouchDevice && !hovered) {
          activateHover();
          setTimeout(() => deactivateHover(), 2500);
          return;
        }

        setClicked(true);
        playClick();

        setTimeout(() => {
          setClicked(false);
          router.push("/gallery");
        }, 250);
      }}
    >
      {/* Tooltip */}
      {showTooltip && (
        <Html position={[0, 0, 0]} left>
          <div
            className="logo-3"
            style={{
              background: "rgba(20, 12, 4, 0.85)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.88)",
              padding: "10px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              backdropFilter: "blur(6px)",
              transform: "translateY(-10px)",
              animation: "fadeIn 0.2s ease-out",
            }}
          >
            {isTouchDevice ? "Tap again to open Gallery" : "Click to View Gallery"}
          </div>
        </Html>
      )}

      {/* Solid sphere */}
      <mesh>
        <sphereGeometry
          args={[
            isSmallScreen ? 1 : 2,
            isSmallScreen ? 64 : 64,
            isSmallScreen ? 32 : 64,
          ]}
        />
        <a.meshPhysicalMaterial
          color={color}
          transparent
          depthWrite={false}
          metalness={0.5}
          roughness={isSmallScreen ? 0.5 : 0.5}
          clearcoat={isSmallScreen ? 0.4 : 1}
          clearcoatRoughness={isSmallScreen ? 0.2 : 0}
          thickness={isSmallScreen ? 0 : 2.5}
          reflectivity={1}
          samples={isSmallScreen ? 0 : 1}
          resolution={isSmallScreen ? 0 : 256}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh renderOrder={10}>
        <sphereGeometry
          args={[
            isSmallScreen ? 1.01 : 2.01,
            isSmallScreen ? 40 : 40,
            isSmallScreen ? 20 : 20,
          ]}
        />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        {/* <Edges threshold={1} color="rgba(136, 136, 136, 1)" lineWidth={0.5} /> */}
        <Edges
          threshold={1}
          color={isSmallScreen ? "green" : "rgba(136, 136, 136, 1)"}
          lineWidth={isSmallScreen ? 1.5 : 1}
        />
      </mesh>
    </a.group>
  );
}

// ----------------------------------------
// Canvas Wrapper with Audio Unlock
// ----------------------------------------
export default function InteractiveSpinningSphere() {
  const audioCtxRef = useRef(null);
  const audioUnlockedRef = useRef(false);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const media = window.matchMedia("(max-width: 768px)");

    const update = () => setIsSmallScreen(media.matches);
    update();

    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Only render Canvas once isSmallScreen is known
  useEffect(() => {
    setReady(true);
  }, [isSmallScreen]);

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

  if (!ready) return null;

  return (
    <Canvas
      className="home"
      style={{ height: "625px", width: "100%", margin: "auto", display: "block" }}
      dpr={isSmallScreen ? [1, 1] : [1, 1.5]}
      camera={{ position: [0, 4, 3], fov: 90 }}
      gl={{ antialias: !isSmallScreen }}
    >
      <ambientLight intensity={0.5} />
      {isSmallScreen ? (
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
      ) : (
        <Environment preset="studio" blur={1.8} />
      )}

      <Bounds clip observe fit={isSmallScreen} margin={isSmallScreen ? 1.2 : 1}>
        <InteractiveSphere audioCtxRef={audioCtxRef} isSmallScreen={isSmallScreen} />
      </Bounds>
    </Canvas>
  );
}