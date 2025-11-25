"use client";

import React, { useRef, useState, useEffect, Suspense, useMemo } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, RoundedBox, Text3D, Center, Bounds, Environment } from "@react-three/drei";
import * as THREE from "three";
import { TextureLoader } from "three";
import { createPortal } from "react-dom";
import ArtCard from "./ArtCard";
import artworks from "../data/artworks";

// ---------- Rotating Platform for 3D Text ----------
function RotatingPlatform({ children }) {
    const platformRef = useRef();
    useFrame((_, delta) => {
        platformRef.current.rotation.y += delta * 0.2;
    });
    return <group ref={platformRef}>{children}</group>;
}

// ---------- 3D Chrome Text ----------
function ChromeText() {
    const textRef = useRef();
    const { viewport } = useThree();
    const textSize = Math.max(1.5, viewport.width / 6);

    return (
        <Center>
            <Text3D
                ref={textRef}
                font="/fonts/Panchang_Bold.json"
                size={4}
                height={4}
                bevelEnabled
                bevelThickness={0.9}
                bevelSize={0.5}
                bevelSegments={15}
                curveSegments={24}
            >
                [ PORTFOLIO. ]
                <meshPhysicalMaterial
                    color="black"
                    metalness={1}
                    roughness={0.05}
                    reflectivity={1}
                    clearcoat={1}
                    clearcoatRoughness={0}
                />
            </Text3D>
        </Center>
    );
}

// ---------- Floating Gallery ----------
function GalleryScene({ artworks, sizes = [], onOpenModal }) {
    const groupRef = useRef();
    const [hovered, setHovered] = useState(null);

    const urls = useMemo(() => artworks.map(a => a.imageUrl), [artworks]);
    const textures = useLoader(TextureLoader, urls);

    useEffect(() => {
        textures?.forEach(t => t && (t.flipY = false));
    }, [textures]);

    const positions = useMemo(() => {
        const cols = 3;
        const spacingX = 3;
        const spacingZ = 3;
        const yPlane = -6; // place gallery below text

        return artworks.map((_, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = (col - (cols - 1) / 2) * spacingX;
            const z = -row * spacingZ;
            return [x, yPlane, z];
        });
    }, [artworks]);

    useFrame(({ clock }) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += 0.0016;
            groupRef.current.children.forEach((child, i) => {
                const floatY = Math.sin(clock.getElapsedTime() * 0.9 + i) * 0.18;
                child.position.y += (floatY - child.position.y) * 0.1;

                const targetScale = hovered === i ? 1.1 : 1;
                child.scale.x += (targetScale - child.scale.x) * 0.1;
                child.scale.y += (targetScale - child.scale.y) * 0.1;
                child.scale.z += (targetScale - child.scale.z) * 0.1;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {artworks.map((art, i) => {
                const tex = textures?.[i];
                const size = sizes?.[i];
                const aspect = size?.width && size?.height ? size.width / size.height : 1;
                const cardHeight = 2;
                const cardWidth = aspect * cardHeight;

                return (
                    <group
                        key={i}
                        position={positions[i]}
                        scale={hovered === i ? 1.1 : 1}
                        onPointerOver={e => { e.stopPropagation(); setHovered(i); }}
                        onPointerOut={e => { e.stopPropagation(); setHovered(s => (s === i ? null : s)); }}
                        onClick={e => { e.stopPropagation(); onOpenModal(art); }}
                    >
                        <RoundedBox args={[cardWidth + 0.12, cardHeight + 0.12, 0.14]} radius={0.04} smoothness={6}>
                            <meshStandardMaterial color="black" metalness={0.2} roughness={0.1} />
                        </RoundedBox>
                        {tex ? (
                            <mesh position={[0, 0, 0.071]}>
                                <planeGeometry args={[cardWidth, cardHeight]} />
                                <meshBasicMaterial map={tex} toneMapped={false} />
                            </mesh>
                        ) : (
                            <mesh position={[0, 0, 0.071]}>
                                <planeGeometry args={[cardWidth, cardHeight]} />
                                <meshStandardMaterial color="#333" />
                            </mesh>
                        )}
                    </group>
                );
            })}
        </group>
    );
}

// ---------- Combined Component ----------
export default function ThreeDTextWithGallery() {
    const [sizes, setSizes] = useState([]);
    const [modalArt, setModalArt] = useState(null);

    useEffect(() => {
        let mounted = true;
        Promise.all(
            artworks.map(
                art =>
                    new Promise(resolve => {
                        const img = new Image();
                        img.src = art.imageUrl;
                        img.onload = () => resolve({ width: img.width, height: img.height });
                        img.onerror = () => resolve({ width: 1, height: 1 });
                    })
            )
        ).then(results => mounted && setSizes(results));
        return () => { mounted = false; };
    }, []);

    return (
        <div className="relative h-[90vh] w-full">
            <Canvas shadows camera={{ position: [0, -2, 30], fov: 60 }} dpr={[1, 1.5]}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <directionalLight position={[-5, 2, -5]} intensity={0.6} />

                <Environment preset="sunset" blur={0.8} />

                <Suspense fallback={null}>
                    {/* 3D Text Group */}
                    <group position={[0, 4, 0]}>  {/* move text above */}
                        <Bounds fit clip observe>
                            <RotatingPlatform>
                                <ChromeText />
                            </RotatingPlatform>
                        </Bounds>
                    </group>

                    {/* Gallery Group */}
                    <group position={[0, -8, 0]}> {/* move gallery below */}
                        <GalleryScene artworks={artworks} sizes={sizes} onOpenModal={setModalArt} />
                    </group>
                </Suspense>


                <OrbitControls enablePan enableZoom />
            </Canvas>

            {modalArt && createPortal(
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setModalArt(null)}>
                    <div className="relative max-w-[80vw] w-full max-h-[90vh] overflow-auto rounded-lg p-4 bg-black" onClick={e => e.stopPropagation()}>
                        <button className="absolute top-2 right-3 text-2xl text-white" onClick={() => setModalArt(null)}>✕</button>
                        <ArtCard {...modalArt} />
                    </div>
                </div>, document.body
            )}
        </div>
    );
}
