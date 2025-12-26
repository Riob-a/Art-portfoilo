"use client";

import React, { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Text3D, Environment, Center, Bounds, RoundedBox, Edges } from "@react-three/drei";
import { a, useSpring } from "@react-spring/three";
import { useRouter } from "next/navigation";
import { Html, Sparkles } from "@react-three/drei";
import { FaSearch } from "react-icons/fa";
import Link from 'next/link';


import * as THREE from "three";


// ----------------------------------------
// Rotating platform for text/cube
// ----------------------------------------
function RotatingPlatform({ children }) {
  const platformRef = useRef();

  useFrame((_, delta) => {
    platformRef.current.rotation.y += delta * 0.2; // slow rotation
  });

  return <group ref={platformRef}>{children}</group>;
}

// ----------------------------------------
// Swappable Text <-> Cube Component
// ----------------------------------------
function SwappableTextCube() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // const hoverSoundRef = useRef(null);
  // const clickSoundRef = useRef(null);
  // const hoverSourceRef = useRef(null);
  // const hoverGainRef = useRef(null);

  const audioCtxRef = useRef(null);

  const hoverBufferRef = useRef(null);
  const clickBufferRef = useRef(null);

  const hoverSourceRef = useRef(null);
  const hoverGainRef = useRef(null);


  const { color } = useSpring({
    color: clicked ? "rgba(240, 146, 6, 1)" : "rgba(0, 127, 140, 1)",
    config: { tension: 200, friction: 20 },
  });


  // Smooth animation for BOTH text and cube
  const { textScale, cubeScale } = useSpring({
    textScale: hovered ? 0.2 : 1,   // shrink text smaller than cube
    cubeScale: hovered ? 3.0 : 0,   // cube grows 
    config: { tension: 150, friction: 20 },
  });

  const sphereRef = useRef();

  useFrame((_, delta) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += delta * 0.6;  // smooth spin
    }
  });

  // Volume modifier
  // function fadeVolume(audio, target, duration = 200) {
  //   if (!audio) return;

  //   const start = audio.volume;
  //   const diff = target - start;
  //   const startTime = performance.now();

  //   function step(now) {
  //     const t = Math.min((now - startTime) / duration, 1);
  //     audio.volume = start + diff * t;
  //     if (t < 1) requestAnimationFrame(step);
  //   }

  //   requestAnimationFrame(step);
  // }

  // sound clip setup
  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   hoverSoundRef.current = new Audio("/sounds/hover.wav");
  //   clickSoundRef.current = new Audio("/sounds/click.wav");

  //   hoverSoundRef.current.volume = 0.15; // subtle
  //   clickSoundRef.current.volume = 0.25;

  //   // Prevent overlap
  //   hoverSoundRef.current.preload = "auto";
  //   clickSoundRef.current.preload = "auto";
  // }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    audioCtxRef.current = ctx;

    const loadSound = async (url, ref) => {
      const res = await fetch(url);
      const arrayBuffer = await res.arrayBuffer();
      ref.current = await ctx.decodeAudioData(arrayBuffer);
    };

    loadSound("/sounds/hover.wav", hoverBufferRef);
    loadSound("/sounds/click.wav", clickBufferRef);
  }, []);

  // trigger sounds
  // useEffect(() => {
  //   const unlockAudio = () => {
  //     if (hoverSoundRef.current) {
  //       hoverSoundRef.current.play().then(() => {
  //         hoverSoundRef.current.pause();
  //         hoverSoundRef.current.currentTime = 0;
  //       }).catch(() => { });
  //     }

  //     document.removeEventListener("pointerdown", unlockAudio);
  //   };

  //   document.addEventListener("pointerdown", unlockAudio);
  //   return () => document.removeEventListener("pointerdown", unlockAudio);
  // }, []);

  useEffect(() => {
    const unlock = () => {
      const ctx = audioCtxRef.current;
      if (ctx && ctx.state === "suspended") ctx.resume();

      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointermove", unlock);
    };

    document.addEventListener("pointerdown", unlock);
    document.addEventListener("pointermove", unlock);

    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("pointermove", unlock);
    };
  }, []);

  const startHoverSound = () => {
    const ctx = audioCtxRef.current;
    const buffer = hoverBufferRef.current;
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
    const buffer = clickBufferRef.current;
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
    // <group
    //   onPointerOver={() => {
    //     setHovered(true);
    //     document.body.style.cursor = "pointer";

    //     if (!hasPlayedHoverRef.current && hoverSoundRef.current) {
    //       hoverSoundRef.current.currentTime = 0;
    //       hoverSoundRef.current.play().catch(() => { });
    //       hasPlayedHoverRef.current = true;
    //     }
    //   }}
    //   onPointerOut={() => {
    //     setHovered(false);
    //     document.body.style.cursor = "default";
    //     hasPlayedHoverRef.current = false;
    //   }}
    // >
    <group
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";

        startHoverSound();
        setHoverVolume(0.2, 0.15);
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";

        setHoverVolume(0.2, 0.15);
      }}
    >

      {/* --- 3D TEXT (shrinks instead of fading) --- */}
      <a.group scale={textScale.to(s => [s, s, s])}>
        <Center>
          <Text3D
            font="/fonts/Panchang_Bold.json"
            size={2}
            height={2}
            bevelEnabled
            bevelThickness={0.8}
            bevelSize={0.4}
            bevelSegments={12}
            curveSegments={12}
          >
            [ PORTFOLIO. ]
            <meshPhysicalMaterial
              color="rgba(0, 127, 140, 1)"
              // color='black'
              metalness={1}
              roughness={0.5}
              reflectivity={1}
              clearcoat={1}
              clearcoatRoughness={0}
            />
          </Text3D>
        </Center>
      </a.group>

      {/* --- SPHERE (grows massively on hover) --- */}
      <a.group
        ref={sphereRef}
        scale={cubeScale.to(s => [s, s, s])}
        onPointerEnter={(e) => {
          // e.stopPropagation();          // prevents text hover triggering
          setHovered(true);
          setShowTooltip(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          setShowTooltip(false);
          document.body.style.cursor = "default";
        }}
        onClick={() => {
          setClicked(true);

          playClick();

          setTimeout(() => setClicked(false), 250);
          router.push("/gallery");
        }}
      >
        {/* --- Tooltip --- */}
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

        {/* Main visible sphere */}
        <mesh>
          <sphereGeometry args={[2, 64, 64]} />
          <a.meshPhysicalMaterial
            color={color}
            metalness={1}
            roughness={0.5}
            clearcoat={1}
            clearcoatRoughness={0}
            reflectivity={1}
          />
        </mesh>

        {/* Wireframe overlay */}
        <mesh>
          <sphereGeometry args={[2.02, 30, 15]} />
          <meshBasicMaterial
            color="black"
            transparent
            // wireframe
            opacity={0}
            depthWrite={false}
          />
          <Edges threshold={2} color="rgba(136, 136, 136, 1)" />
        </mesh>

        <Sparkles
          count={40}
          scale={20}
          size={1.5}
          speed={0.2}
          color="white"
        />

      </a.group>
    </group>
  );
}


// ----------------------------------------
// Main Canvas Component
// ----------------------------------------
export default function ThreeDTextWithPlatform() {
  const [showHint, setShowHint] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Canvas
      style={{
        height: "725px",
        margin: "auto",
        display: "block",
      }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [0, -10, 40], fov: 60 }}
    >
      {/* Lighting & Environment */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Environment preset="sunset" blur={0.9} />

      <Bounds fit clip observe>
        <RotatingPlatform>
          <SwappableTextCube />
          <Html>
            {/* {showHint && (<div
              className="md:hidden animate-bounc fixed left-12 top-15 logo-3"
              style={{
                background: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "10px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
                backdropFilter: "blur(4px)",
                transform: "translateY(-10px)",
                animation: "fadeIn 0.2s ease-out",
              }}
            >
              View Gallery
            </div>)} */}

            <Link
              href="/gallery"
              className="fixed top-65 z-50 md:hidden items-center justify-center"
            >
              <div className="relative flex items-center justify-center gap-1">
                {/* Pulse indicator */}
                <span className="absolute inline-flex h-10 w-10 rounded-full bg-white/30 animate-ping" />

                <button
                  className="relative p-2 text-white text-center bg-black/60 rounded-full"
                  aria-label="Open gallery"
                >
                  <FaSearch size={18} />
                </button>
              </div>
            </Link>
          </Html>
        </RotatingPlatform>
      </Bounds>
    </Canvas>
  );
}