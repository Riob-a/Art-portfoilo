"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Edges, Html, Bounds } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { detectDeviceTier } from "../utils/deviceTier";

// ─── Per-tier sphere configs ────────────────────────────────────────────────
const SPHERE_CONFIG = {
  high: {
    segments:        [64, 64],
    wireSegments:    [40, 25],
    metalness:       1.0,
    roughness:       0.0,
    clearcoat:       1,
    clearcoatRough:  0,
    thickness:       2.5,
    resolution:      256,
    samples:         1,
    envPreset:       "dawn",
    envBlur:         1.8,
    dpr:             [1, 1.5],
    antialias:       true,
  },
  mid: {
    segments:        [48, 32],
    wireSegments:    [32, 20],
    metalness:       1.0,
    roughness:       0.05,
    clearcoat:       0.6,
    clearcoatRough:  0.1,
    thickness:       1.5,
    resolution:      128,
    samples:         0,
    envPreset:       "dawn",
    envBlur:         1.8,
    dpr:             [1, 1],
    antialias:       true,
  },
  low: {
    segments:        [32, 20],
    wireSegments:    [24, 14],
    metalness:       0.6,
    roughness:       0.3,
    clearcoat:       0,
    clearcoatRough:  0,
    thickness:       0,
    resolution:      0,
    samples:         0,
    envPreset:       null,   // use directional lights instead
    dpr:             [1, 1],
    antialias:       false,
  },
};

// ─── Sphere mesh ─────────────────────────────────────────────────────────────
function InteractiveSphere({ audioCtxRef, isSmallScreen, tier }) {
  const router  = useRouter();
  const groupRef = useRef(null);
  const cfg = SPHERE_CONFIG[tier];

  const baseScale = isSmallScreen ? 1.35 : 1;

  const [hovered,     setHovered]     = useState(false);
  const [clicked,     setClicked]     = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const hoverSourceRef = useRef(null);
  const hoverGainRef   = useRef(null);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints > 0) &&
    window.innerWidth < 1024;

  const { color } = useSpring({
    color: clicked ? "#FF3333" : "#FFFFFF",
    config: { tension: 180, friction: 20 },
  });

  const { scale } = useSpring({
    scale: hovered ? baseScale * 1.12 : baseScale,
    config: { tension: 150, friction: 18 },
  });

  useFrame((_, delta) => {
    if (groupRef.current) {
      const targetSpeed = hovered ? 2 : 0.5;
      groupRef.current.userData.currentSpeed = THREE.MathUtils.lerp(
        groupRef.current.userData.currentSpeed || 0.5,
        targetSpeed,
        delta * 3
      );
      groupRef.current.rotation.y += delta * groupRef.current.userData.currentSpeed;
    }
  });

  useEffect(() => {
    const canvas = document.querySelector(".home");
    if (!canvas) return;
    const observer = new IntersectionObserver(
      ([entry]) => { canvas.style.visibility = entry.isIntersecting ? "visible" : "hidden"; },
      { threshold: 0.1 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);

  // ── Audio helpers ──────────────────────────────────────────────────────────
  const startHoverSound = () => {
    const ctx    = audioCtxRef.current;
    const buffer = ctx?.hoverBuffer;
    if (!ctx || !buffer || hoverSourceRef.current) return;
    const source = ctx.createBufferSource();
    const gain   = ctx.createGain();
    source.buffer    = buffer;
    source.loop      = true;
    gain.gain.value  = 0.05;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
    hoverSourceRef.current = source;
    hoverGainRef.current   = gain;
  };

  const setHoverVolume = (value, duration = 0.15) => {
    const ctx  = audioCtxRef.current;
    const gain = hoverGainRef.current;
    if (!ctx || !gain) return;
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.linearRampToValueAtTime(value, ctx.currentTime + duration);
  };

  const playClick = () => {
    const ctx    = audioCtxRef.current;
    const buffer = ctx?.clickBuffer;
    if (!ctx || !buffer) return;
    const source = ctx.createBufferSource();
    const gain   = ctx.createGain();
    source.buffer   = buffer;
    gain.gain.value = 0.25;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start(ctx.currentTime);
  };

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

  // Derive geometry args from config, further reduced on small screens
  const sW = cfg.segments[0];
  const sH = cfg.segments[1];
  const radius      = isSmallScreen ? 1    : 2;
  const wireRadius  = isSmallScreen ? 1.01 : 2.02;
  const wW = isSmallScreen ? Math.min(cfg.wireSegments[0], 32) : cfg.wireSegments[0];
  const wH = isSmallScreen ? Math.min(cfg.wireSegments[1], 20) : cfg.wireSegments[1];

  return (
    <a.group
      ref={groupRef}
      scale={scale.to((s) => [s, s, s])}
      onPointerOver={() => {
        document.body.style.cursor = "pointer";
        activateHover();
      }}
      onPointerOut={() => {
        document.body.style.cursor = "default";
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
              background:     "var(--theme-navbar, #ffffff)",
              border:         "2px solid var(--theme-navbar-text, #111111)",
              color:          "var(--theme-navbar-text, #111111)",
              padding:        "8px 14px",
              borderRadius:   "0",
              fontSize:       "0.6rem",
              fontFamily:     "Unbounded, sans-serif",
              fontWeight:     800,
              letterSpacing:  "0.1em",
              textTransform:  "uppercase",
              whiteSpace:     "nowrap",
              pointerEvents:  "none",
              boxShadow:      "3px 3px 0 var(--theme-navbar-text, #111111)",
              transform:      "translateY(-10px)",
              animation:      "fadeIn 0.2s ease-out",
            }}
          >
            {isTouchDevice ? "Tap again to open Gallery" : "Click to View Gallery"}
          </div>
        </Html>
      )}

      {/* Solid sphere */}
      <mesh>
        <sphereGeometry args={[radius, sW, sH]} />
        <a.meshPhysicalMaterial
          color={color}
          depthWrite={false}
          metalness={cfg.metalness}
          roughness={tier === "low" ? cfg.roughness : (isSmallScreen ? 0.5 : cfg.roughness)}
          clearcoat={tier === "low" ? 0 : (isSmallScreen ? 0.4 : cfg.clearcoat)}
          clearcoatRoughness={cfg.clearcoatRough}
          thickness={isSmallScreen ? 0 : cfg.thickness}
          reflectivity={1}
          samples={cfg.samples}
          resolution={isSmallScreen ? 0 : cfg.resolution}
          antialias={cfg.antialias}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh renderOrder={10}>
        <sphereGeometry args={[wireRadius, wW, wH]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        <Edges
          threshold={1}
          color={isSmallScreen ? "grey" : "black"}
          lineWidth={isSmallScreen ? 1.5 : 1.1}
        />
      </mesh>
    </a.group>
  );
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
export default function InteractiveSpinningSphere() {
  const audioCtxRef       = useRef(null);
  const audioUnlockedRef  = useRef(false);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [tier,          setTier]          = useState("mid");
  const [ready,         setReady]         = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 768px)");
    const update = () => setIsSmallScreen(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  // Detect tier once on mount
  useEffect(() => {
    const t = detectDeviceTier();
    setTier(t);
    // console.log("[Sphere] Device tier:", t);
  }, []);

  useEffect(() => { setReady(true); }, [isSmallScreen]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();

    const loadSound = async (url) => {
      const res    = await fetch(url);
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
      if (audioCtxRef.current.state === "suspended") await audioCtxRef.current.resume();
      document.removeEventListener("pointerdown", unlock);
    };

    document.addEventListener("pointerdown", unlock);
    return () => document.removeEventListener("pointerdown", unlock);
  }, []);

  if (!ready) return null;

  const cfg = SPHERE_CONFIG[tier];

  return (
    <Canvas
      className="home"
      style={{ height: "100%", width: "100%", margin: "auto", display: "block" }}
      dpr={cfg.dpr}
      camera={{ position: [0, 4, 3], fov: 90 }}
      gl={{ antialias: cfg.antialias }}
    >
      <ambientLight intensity={0.5} />

      {/* Low tier: skip Environment, use cheap directional lights instead */}
      {tier === "low" ? (
        <>
          <directionalLight position={[5,  5,  5]} intensity={1.8} />
          <directionalLight position={[-3, 2, -4]} intensity={1.2} />
        </>
      ) : (
        <Environment preset={cfg.envPreset} blur={cfg.envBlur} />
      )}

      <Bounds clip observe fit={isSmallScreen} margin={isSmallScreen ? 1.2 : 1}>
        <InteractiveSphere
          audioCtxRef={audioCtxRef}
          isSmallScreen={isSmallScreen}
          tier={tier}
        />
      </Bounds>
    </Canvas>
  );
}