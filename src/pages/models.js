"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import models from "../data/model-data";
import Navbar from "../components/Navbar";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Center } from "@react-three/drei";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Suspense } from "react";

const modelArtworks = models.filter((a) => a.modelUrl);

function Model({ path }) {
    const { scene } = useGLTF(path);
    const ref = useRef();
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.2;
    });
    return (
        <Center>
            <primitive ref={ref} object={scene} />
        </Center>
    );
}

export default function ModelsPage() {
    const [index, setIndex] = useState(0);
    const current = modelArtworks[index];

    if (modelArtworks.length === 0) {
        return (
            <div className="w-full h-screen flex items-center justify-center logo-3 text-white">
                No 3D models yet.
            </div>
        );
    }

    return (
        <div className="relative w-full min-h-screen">
            <Navbar />

            <div className="absolute top-0.5 left-0.5  w-8 h-8 border-t-2 border-l-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute top-0.5 right-0.5 w-8 h-8 border-t-2 border-r-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute bottom-0.5 left-0.5  w-8 h-8 border-b-2 border-l-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute bottom-0.5 right-0.5 w-8 h-8 border-b-2 border-r-2 border-black/70 pointer-events-none z-10" />

            <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">

                <h1 className="logo-3 text-2xl mb-8 uppercase tracking-widest"
                    style={{
                        borderBottom: "2px solid black", paddingBottom: "8px", fontFamily: "Unbounded, sans-serif",
                        fontWeight: 900,
                    }}>
                    3D Models
                </h1>

                {/* Viewer */}
                <div style={{
                    width: "100%",
                    height: "500px",
                    border: "2px solid black",
                    boxShadow: "3px 3px 0 black",
                    background: "var(--bg, #0a0a0a)",
                    overflow: "hidden",
                }}>
                    <Canvas
                        frameloop="always"
                        camera={{ position: [0, 1.5, 4], fov: 40 }}
                        style={{ width: "100%", height: "100%" }}
                    >
                        <ambientLight intensity={0.5} />
                        <directionalLight position={[5, 5, 5]} intensity={1} />
                        <Environment preset="sunset" />

                        <Suspense fallback={null}>
                            <Model key={current.modelUrl} path={current.modelUrl} />
                        </Suspense>

                        <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} enablePan={false} />
                    </Canvas>
                </div>

                {/* Info plaque */}
                <div
                    className="bg-black text-white logo-3"
                    style={{
                        border: "2px solid black",
                        boxShadow: "3px 3px 0 black",
                        marginTop: "12px",
                    }}>
                    <div className="logo-3" style={{
                        padding: "10px 1px",
                        borderBottom: "2px solid var(--theme-navbar-text, #111111)",
                        fontSize: "1.5rem",
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontFamily: "Unbounded, sans-serif",
                        fontWeight: 900,
                        color: "var(--theme-navbar-text, #111111)",
                    }}>
                        /. {current.title}
                    </div>
                    <div style={{
                        padding: "16px"
                    }}>
                        <p className="modal-text-1 mb-4" style={{
                            fontFamily: "Unbounded, sans-serif",
                            fontWeight: 500,
                            fontSize: "1rem",
                            // letterSpacing: "0.05em",
                            lineHeight: 1.6,
                            color: "var(--theme-navbar-text, #111111)",
                            padding: "8px 0px",
                            // opacity: 0.75,
                        }}>
                            {current.description}
                        </p>
                        <div className="modal-text-2" style={{
                            borderTop: "2px solid var(--theme-navbar-text, #111111)",
                            paddingTop: "12px",
                            display: "flex",
                            gap: "24px",
                            fontSize: "0.8rem",
                            color: "var(--theme-navbar-text, #111111)",
                        }}>
                            <span><span className="font-semibold">Category: </span><span className=" ">{current.category}</span></span>
                            <span><span className="font-semibold">Year: </span><span className=" ">{current.year}</span></span>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                {modelArtworks.length > 1 && (
                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={() => setIndex((i) => Math.max(i - 1, 0))}
                            disabled={index === 0}
                            className="px-6 py-3 bg-black text-white logo-3 uppercase text-sm tracking-widest"
                            style={{
                                boxShadow: "3px 3px 0 #555",
                                opacity: index === 0 ? 0.3 : 1,
                                cursor: index === 0 ? "not-allowed" : "pointer",
                            }}
                        >
                            ← Prev
                        </button>

                        <div className="flex gap-2">
                            {modelArtworks.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setIndex(i)}
                                    style={{
                                        width: "10px", height: "10px",
                                        background: i === index ? "black" : "transparent",
                                        border: "2px solid black",
                                        cursor: "pointer",
                                    }}
                                />
                            ))}
                        </div>

                        <button
                            onClick={() => setIndex((i) => Math.min(i + 1, modelArtworks.length - 1))}
                            disabled={index === modelArtworks.length - 1}
                            className="px-6 py-3 bg-black text-white logo-3 uppercase text-sm tracking-widest"
                            style={{
                                boxShadow: "3px 3px 0 #555",
                                opacity: index === modelArtworks.length - 1 ? 0.3 : 1,
                                cursor: index === modelArtworks.length - 1 ? "not-allowed" : "pointer",
                            }}
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}