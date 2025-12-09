"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { OrbitControls, Html } from "@react-three/drei";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FaDownload } from "react-icons/fa";
import { a, useSpring } from "@react-spring/three";

// --- SINGLE BEVELED CARD ---
function LPBeveledCard({ width, height, depth }) {
    const shape = useMemo(() => {
        const w = width / 2;
        const h = height / 2;
        const s = new THREE.Shape();
        s.moveTo(-w, -h);
        s.lineTo(w, -h);
        s.lineTo(w, h);
        s.lineTo(-w, h);
        s.lineTo(-w, -h);
        return s;
    }, [width, height]);

    const extrudeSettings = useMemo(() => ({
        steps: 1,
        depth,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.08,
        bevelSegments: 5,
    }), [depth]);

    return (
        <mesh>
            <extrudeGeometry args={[shape, extrudeSettings]} />
            <meshStandardMaterial color="#111" roughness={0.3} metalness={0.2} />
        </mesh>
    );
}

// --- SINGLE LOW-POWER CARD COMPONENT ---
function LPSingleCard({ art, float = true }) {
    const meshRef = useRef();

    const texture = useLoader(TextureLoader, art.imageUrl);
    useMemo(() => {
        if (texture) {
            texture.flipY = true;
            texture.needsUpdate = true;
        }
    }, [texture]);

    // Float animation
    useFrame(({ clock }) => {
        if (meshRef.current && float) {
            meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.8) * 0.2;
        }
    });

    // Hover scale
    const [hovered, setHovered] = useState(false);
    const spring = useSpring({ scale: hovered ? 1.05 : 1 });

    const cardHeight = 3;
    const aspect = texture.image ? texture.image.width / texture.image.height : 1;
    const cardWidth = aspect * cardHeight;

    return (
        <a.group
            ref={meshRef}
            scale={spring.scale.to((s) => [s, s, s])}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <LPBeveledCard width={cardWidth + 0.12} height={cardHeight + 0.12} depth={0.5} />

            <mesh position={[0, 0, 0.61]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshBasicMaterial map={texture} toneMapped={false} />
            </mesh>

            <mesh position={[0, 0, 0.72]}>
                <planeGeometry args={[cardWidth, cardHeight]} />
                <meshPhysicalMaterial
                    transmission={1}
                    transparent
                    color="#e5f7ff"
                    opacity={0.12}
                    roughness={0.1}
                    thickness={0.1}
                    ior={1.05}
                    clearcoat={1}
                    reflectivity={1}
                    depthWrite={false}
                />
            </mesh>
        </a.group>
    );
}

// --- LOW-POWER SINGLE-CARD GALLERY ---
export default function LowPowerGallery({ artworks }) {
    const [index, setIndex] = useState(0);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const currentArt = artworks[index];

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 200);
    };

    // Preload next/prev images
    useEffect(() => {
        [artworks[index + 1], artworks[index - 1]].forEach((art) => {
            if (art) {
                const img = new window.Image();
                img.src = art.imageUrl;
            }
        });
    }, [index, artworks]);

    const next = () => setIndex((i) => Math.min(i + 1, artworks.length - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    // ------------------ LOADING FALLBACK ------------------
    function LPLoadingFallback() {
        return (
            <Html center>
                <div
                    style={{
                        padding: "12px 16px",
                        color: "white",
                        fontSize: "16px",
                        borderRadius: "8px",
                        backdropFilter: "blur(6px)",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <img
                        src="/globe-2.svg"
                        alt="loading"
                        className="logo-pic"
                        style={{
                            width: "20px",
                            height: "20px",
                            animation: "spin 2s linear infinite",
                            opacity: 0.9,
                        }}
                    />
                    <p className="logo-3">Loading...</p>
                </div>
                <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
            </Html>
        );
    }


    return (
        <div className="relative h-[100vh] w-full">
            <Canvas shadows camera={{ position: [0, 0, 7], fov: 60 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-5, 2, -5]} intensity={0.6} />

                {/* <Suspense fallback={<Html center><div className="text-white">Loading...</div></Html>}>
                    <LPSingleCard art={currentArt} />
                </Suspense> */}
                <Suspense fallback={<LPLoadingFallback />}>
                    <LPSingleCard art={currentArt} />
                </Suspense>


                <Html center>
                    <div className="flex justify-between w-full px-6 absolute bottom-10">
                        <button onClick={prev} className="px-4 py-2 bg-black text-white rounded-lg">◀ Prev</button>
                        <button onClick={next} className="px-4 py-2 bg-black text-white rounded-lg">Next ▶</button>
                    </div>
                </Html>
                <OrbitControls enablePan  enabled={!isModalOpen} />
            </Canvas>

            {isModalOpen && createPortal(
                <div
                    className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? "animate-fadeOut" : "animate-fadeIn"}`}
                    onClick={closeModal}
                >
                    <div
                        className="relative max-w-[90vw] max-h-[90vh] overflow-auto rounded-lg p-4 bg-black"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button className="absolute top-4 right-4 text-3xl text-white" onClick={closeModal}>✕</button>
                        <Image src={currentArt.imageUrl} alt={currentArt.title} width={600} height={300} className="w-auto max-h-[80vh] object-contain rounded" />
                        <h2 className="text-white text-2xl mt-4">{currentArt.title}</h2>
                        <p className="text-white mt-2">{currentArt.description}</p>
                        <a href={currentArt.imageUrl} download className="flex items-center gap-1 mt-4 px-2 py-2 bg-white text-black rounded">
                            <FaDownload /> Download
                        </a>
                    </div>
                </div>, document.body
            )}
        </div>
    );
}
