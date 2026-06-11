import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import MaintenanceBanner from "@/components/MaintenanceBanner";

export default function Works() {
    const router = useRouter();

    return (
        <div
            className="relative w-full min-h-screen"
            data-aos="fade-in"
            data-aos-delay="400"
        >
            {/* <Navbar /> */}

            <div className="absolute top-0.5 left-0.5  w-8 h-8 border-t-2 border-l-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute top-0.5 right-0.5 w-8 h-8 border-t-2 border-r-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute bottom-0.5 left-0.5  w-8 h-8 border-b-2 border-l-2 border-black/70 pointer-events-none z-10" />
            <div className="absolute bottom-0.5 right-0.5 w-8 h-8 border-b-2 border-r-2 border-black/70 pointer-events-none z-10" />

            <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">

                {/* Title */}
                {/* <h1
                    className="logo-3 text-2xl mb-12 uppercase tracking-widest"
                    style={{
                        borderBottom: "2px solid var(--theme-navbar-text, #111111)",
                        paddingBottom: "8px",
                        fontWeight: 800,
                        color: "var(--theme-navbar-text, #111111)",
                    }}
                >
                    /. Works
                </h1> */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Gallery card */}
                    <button
                        onClick={() => router.push("/gallery")}
                        style={{
                            background: "var(--theme-navbar, #ffffff)",
                            color: "var(--theme-navbar-text, #111111)",
                            border: "2px solid var(--theme-navbar-text, #111111)",
                            boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
                            padding: 0,
                            cursor: "pointer",
                            textAlign: "left",
                            borderRadius: 0,
                            transition: "transform 0.12s ease, box-shadow 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translate(-2px, -2px)";
                            e.currentTarget.style.boxShadow = "6px 6px 0 var(--theme-navbar-text, #111111)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translate(0, 0)";
                            e.currentTarget.style.boxShadow = "3px 3px 0 var(--theme-navbar-text, #111111)";
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = "translate(1px, 1px)";
                            e.currentTarget.style.boxShadow = "1px 1px 0 var(--theme-navbar-text, #111111)";
                        }}
                    >
                        {/* Header bar */}
                        <div style={{
                            borderBottom: "2px solid var(--theme-navbar-text, #111111)",
                            padding: "10px 16px",
                            background: "var(--theme-navbar-text, #111111)",
                            color: "var(--theme-navbar, #ffffff)",
                        }}>
                            <div className="logo-3" style={{
                                fontSize: "0.6rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                fontWeight: 800,
                            }}>
                                /. 2D Art
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "28px 20px" }}>
                            <p className="logo-3" style={{
                                fontSize: "1.6rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 800,
                                marginBottom: "12px",
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                Gallery
                            </p>
                            <p style={{
                                fontSize: "0.65rem",
                                lineHeight: 1.8,
                                fontFamily: "Unbounded, sans-serif",
                                fontWeight: 300,
                                color: "var(--theme-navbar-text, #111111)",
                                opacity: 0.65,
                            }}>
                                Paintings, drawings, and digital works — browse the full collection in an interactive 3D space.
                            </p>
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: "2px solid var(--theme-navbar-text, #111111)",
                            padding: "10px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <span className="logo-3" style={{
                                fontSize: "0.55rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                opacity: 0.5,
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                Enter →
                            </span>
                            <span className="logo-3" style={{
                                fontSize: "0.55rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                opacity: 0.5,
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                Pencil · Paint · Digital
                            </span>
                        </div>
                    </button>

                    {/* Models card */}
                    <button
                        onClick={() => router.push("/models")}
                        style={{
                            background: "var(--theme-navbar, #ffffff)",
                            color: "var(--theme-navbar-text, #111111)",
                            border: "2px solid var(--theme-navbar-text, #111111)",
                            boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
                            padding: 0,
                            cursor: "pointer",
                            textAlign: "left",
                            borderRadius: 0,
                            transition: "transform 0.12s ease, box-shadow 0.12s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translate(-2px, -2px)";
                            e.currentTarget.style.boxShadow = "6px 6px 0 var(--theme-navbar-text, #111111)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translate(0, 0)";
                            e.currentTarget.style.boxShadow = "3px 3px 0 var(--theme-navbar-text, #111111)";
                        }}
                        onMouseDown={(e) => {
                            e.currentTarget.style.transform = "translate(1px, 1px)";
                            e.currentTarget.style.boxShadow = "1px 1px 0 var(--theme-navbar-text, #111111)";
                        }}
                    >
                        {/* Header bar — accent orange */}
                        <div style={{
                            borderBottom: "2px solid var(--theme-navbar-text, #111111)",
                            padding: "10px 16px",
                            background: "#EF9F27",
                            color: "#111111",
                        }}>
                            <div className="logo-3" style={{
                                fontSize: "0.6rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                fontWeight: 800,
                                color: "#111111",
                            }}>
                                /. 3D
                            </div>
                        </div>

                        {/* Body */}
                        <div style={{ padding: "28px 20px" }}>
                            <p className="logo-3" style={{
                                fontSize: "1.6rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                fontWeight: 800,
                                marginBottom: "12px",
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                Models
                            </p>
                            <p style={{
                                fontSize: "0.65rem",
                                lineHeight: 1.8,
                                fontFamily: "Unbounded, sans-serif",
                                fontWeight: 300,
                                color: "var(--theme-navbar-text, #111111)",
                                opacity: 0.65,
                            }}>
                                Explorable 3D models — rotate, inspect, and interact with sculptural works up close.
                            </p>
                        </div>

                        {/* Footer */}
                        <div style={{
                            borderTop: "2px solid var(--theme-navbar-text, #111111)",
                            padding: "10px 16px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <span className="logo-3" style={{
                                fontSize: "0.55rem",
                                letterSpacing: "0.15em",
                                textTransform: "uppercase",
                                opacity: 0.5,
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                Enter →
                            </span>
                            <span className="logo-3" style={{
                                fontSize: "0.55rem",
                                letterSpacing: "0.1em",
                                textTransform: "uppercase",
                                opacity: 0.5,
                                color: "var(--theme-navbar-text, #111111)",
                            }}>
                                GLTF · Blender
                            </span>
                        </div>
                    </button>

                </div>
            </div>
        </div>
    );
}