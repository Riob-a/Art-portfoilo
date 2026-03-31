"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const ArrowIcon = () => (
  <svg
    className="arrow-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
  >
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
};

export default function About() {
  return (
    <section className="about min-h-screen p-8 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-18">
        <motion.h2 className="text-8xl a-heading">
          <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="0">About</div>
          <div data-aos="fade-right" data-aos-duration="800" data-aos-delay="400">Me</div>
        </motion.h2>

        <motion.div whileTap={{ scale: 0.6 }} className="line-arrow">
          <Link href="/">
            <button className="arrow-l-button">
              <ArrowIcon />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div
        className="space-y-6 leading-relaxed max-w-2xl"
        data-aos="fade-in"
        data-aos-delay="800"
        data-aos-duration="400"
      >
        <p>
          I am a visual artist comfortable with both paint and pencil,
          preferably pencil, specializing in creating intricate compositions
          that combine both pencil and paint, with the occasional still life.
        </p>

        <p>
          I also have a background in web development, which facilitated the
          design and creation of this very website. Hope you enjoy my work and
          feel free to reach out and check out my other web projects.
        </p>

        {/* Project link — styled as a proper CTA */}
        <p
          data-aos="fade-in"
          data-aos-delay="1000"
          data-aos-duration="400"
        >
          <Link
            href="https://portfolio-five-five.vercel.app/"
            className="a-link"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontWeight: 600,
              fontSize: "15px",
              letterSpacing: "0.04em",
              textDecoration: "underline",
              textUnderlineOffset: "4px",
              opacity: 0.9,
            }}
          >
            Check out my other projects →
          </Link>
        </p>
      </motion.div>

      {/* Bottom fill — skills/media row */}
      <div
        className="mt-16 pt-16  pb-10"
        data-aos="fade-in"
        data-aos-delay="1200"
        data-aos-duration="600"
      >
        <p
          style={{
            fontSize: "11px",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            opacity: 0.8,
            marginBottom: "12px",
            display: "flex",
            justifyContent: "center" 
          }}
        >
          Media
        </p>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap",  justifyContent: "center"  }}>
          {["Pencil", "Paint", "Digital", "Still Life"].map((skill) => (
            <span
              key={skill}
              style={{
                padding: "6px 14px",
                borderRadius: "999px",
                border: "1px solid rgba(255,255,255,0.35)",
                fontSize: "13px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.85)",
                letterSpacing: "0.03em",
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}