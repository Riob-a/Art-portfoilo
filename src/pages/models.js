import { useEffect, useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF, Center, Html } from "@react-three/drei";
import models from "../data/model-data";
import Navbar from "../components/Navbar";
import { FaArrowLeft, FaArrowRight, FaDownload, FaSearch } from "react-icons/fa";
import { detectDeviceTier } from "../utils/deviceTier";

const ENV_CONFIG = {
  high: { preset: "sunset" },
  mid:  { preset: "sunset" },
  low:  null,
};

const TIER_CONFIG = {
  high: { dpr: [1, 2],   antialias: true  },
  mid:  { dpr: [1, 1.5], antialias: false },
  low:  { dpr: [1, 1],   antialias: false },
};

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
  const [tier, setTier] = useState("mid");

  useEffect(() => {
    setTier(detectDeviceTier());
  }, []);

  const current = modelArtworks[index];
  const env = ENV_CONFIG[tier];
  const cfg = TIER_CONFIG[tier];

  if (modelArtworks.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center logo-3">
        No 3D models yet.
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute top-0.5 left-0.5  w-8 h-8 border-t-2 border-l-2 border-black/70 pointer-events-none z-10" />
      <div className="absolute top-0.5 right-0.5 w-8 h-8 border-t-2 border-r-2 border-black/70 pointer-events-none z-10" />
      <div className="absolute bottom-0.5 left-0.5  w-8 h-8 border-b-2 border-l-2 border-black/70 pointer-events-none z-10" />
      <div className="absolute bottom-0.5 right-0.5 w-8 h-8 border-b-2 border-r-2 border-black/70 pointer-events-none z-10" />

      <div className="max-w-4xl mx-auto px-4 pt-6 pb-12">

        <h1 className="logo-3 text-2xl mb-8 uppercase tracking-widest"
          style={{
            borderBottom: "2px solid var(--theme-navbar-text, #111111)",
            paddingBottom: "8px",
            fontWeight: 900,
          }}>
          3D Models
        </h1>

        {/* Viewer */}
        <div style={{
          width: "100%",
          height: "500px",
          border: "2px solid var(--theme-navbar-text, #111111)",
          boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
          background: "#0a0a0a",
          overflow: "hidden",
          position: "relative",
        }}>
          {/* Hint text */}
          <div style={{
            position: "absolute",
            bottom: "12px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.6rem",
            fontFamily: "Unbounded, sans-serif",
            letterSpacing: "0.1em",
            pointerEvents: "none",
            zIndex: 10,
            whiteSpace: "nowrap",
          }}>
            drag to rotate · scroll to zoom · pan to move
          </div>

          <Canvas
            frameloop="always"
            dpr={cfg.dpr}
            gl={{ antialias: cfg.antialias }}
            camera={{ position: [0, 1.5, 4], fov: 40 }}
            style={{ width: "100%", height: "100%" }}
          >
            <ambientLight intensity={tier === "low" ? 1.5 : 0.5} />
            <directionalLight position={[5, 5, 5]} intensity={tier === "low" ? 2 : 1} />
            <directionalLight position={[-5, 2, -3]} intensity={0.6} />

            {env && <Environment preset={env.preset} />}

            <Suspense fallback={null}>
              <Model key={current.modelUrl} path={current.modelUrl} />
            </Suspense>

            <OrbitControls enableDamping dampingFactor={0.05} enableZoom={true} enablePan={true} />
          </Canvas>
        </div>

        {/* Info plaque */}
        <div style={{
          border: "2px solid var(--theme-navbar-text, #111111)",
          boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
          background: "var(--theme-navbar, #ffffff)",
          marginTop: "12px",
        }}>
          <div className="logo-3" style={{
            padding: "10px 16px",
            borderBottom: "2px solid var(--theme-navbar-text, #111111)",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 900,
            color: "var(--theme-navbar-text, #111111)",
          }}>
            /. {current.title}
          </div>
          <div style={{ padding: "16px" }}>
            <p className="text-sm leading-relaxed mb-4" style={{
              fontFamily: "Unbounded, sans-serif",
              fontWeight: 300,
              color: "var(--theme-navbar-text, #111111)",
              opacity: 0.75,
            }}>
              {current.description}
            </p>
            <div style={{
              borderTop: "2px solid var(--theme-navbar-text, #111111)",
              paddingTop: "12px",
              display: "flex",
              gap: "24px",
              fontSize: "0.7rem",
              fontFamily: "Unbounded, sans-serif",
              color: "var(--theme-navbar-text, #111111)",
            }}>
              <span><span style={{ fontWeight: 700 }}>Category: </span>{current.category}</span>
              <span><span style={{ fontWeight: 700 }}>Year: </span>{current.year}</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        {modelArtworks.length > 1 && (
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setIndex((i) => Math.max(i - 1, 0))}
              disabled={index === 0}
              className="m-button"
              style={{ opacity: index === 0 ? 0.3 : 1, cursor: index === 0 ? "not-allowed" : "pointer" }}
            >
              <FaArrowLeft /> Prev
            </button>

            <div className="flex gap-2">
              {modelArtworks.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  style={{
                    width: "10px", height: "10px",
                    background: i === index ? "var(--theme-navbar-text, #111111)" : "transparent",
                    border: "2px solid var(--theme-navbar-text, #111111)",
                    cursor: "pointer",
                  }}
                />
              ))}
            </div>

            <button
              onClick={() => setIndex((i) => Math.min(i + 1, modelArtworks.length - 1))}
              disabled={index === modelArtworks.length - 1}
              className="m-button"
              style={{ opacity: index === modelArtworks.length - 1 ? 0.3 : 1, cursor: index === modelArtworks.length - 1 ? "not-allowed" : "pointer" }}
            >
              Next <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}