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
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function About() {
  return (
    <section
      className="about min-h-screen p-8 flex flex-col"
      style={{ fontFamily: "Unbounded, sans-serif", position: "relative" }}
    >
      {/* CORNER BRACKETS */}
      {/* {[
        "top-0 left-0 border-t-2 border-l-2",
        "top-0 right-0 border-t-2 border-r-2",
        "bottom-0 left-0 border-b-2 border-l-2",
        "bottom-0 right-0 border-b-2 border-r-2",
      ].map((cls, i) => (
        <div key={i} className={`absolute w-8 h-8 border-black/70 pointer-events-none ${cls}`} />
      ))} */}

      {/* HEADER */}
      <div className="flex items-start justify-between mb-18">
        <div>
          {["ABOUT", "ME"].map((word, i) => (
            <div
              key={word}
              data-aos="fade-right"
              data-aos-duration="800"
              data-aos-delay={i * 400}
              style={{
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 900,
                fontSize: "clamp(3rem, 8vw, 6rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.02em",
                color: "var(--theme-navbar-text, #111111)",
                textTransform: "uppercase",
              }}
            >
              {word}
            </div>
          ))}
          {/* ORANGE RULE */}
          <div
            style={{
              marginTop: "1rem",
              width: "120px",
              height: "4px",
              background: "#EF9F27",
              boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
            }}
          />
        </div>

        <motion.div
          whileTap={{ scale: 0.6 }}
          className="line-arrow"
          style={{ marginTop: "0.5rem" }}
        >
          <Link href="/">
            <button className="arrow-l-button">
              <ArrowIcon />
            </button>
          </Link>
        </motion.div>
      </div>

      {/* BODY COPY */}
      <motion.div
        className="space-y-6 max-w-2xl"
        data-aos="fade-in"
        data-aos-delay="800"
        data-aos-duration="400"
      >
        {[
          "I am a visual artist comfortable with both paint and pencil, preferably pencil, specializing in creating intricate compositions that combine both pencil and paint, with the occasional still life.",
          "I also have a background in web development, which facilitated the design and creation of this very website. Hope you enjoy my work and feel free to reach out and check out my other web projects.",
        ].map((text, i) => (
          <p
            key={i}
            style={{
              fontFamily: "Unbounded, sans-serif",
              fontWeight: 400,
              fontSize: "0.65rem",
              letterSpacing: "0.04em",
              lineHeight: 1.9,
              color: "var(--theme-navbar-text, #111111)",
            }}
          >
            {text}
          </p>
        ))}

        {/* CTA LINK */}
        <div data-aos="fade-in" data-aos-delay="1000" data-aos-duration="400">
          <motion.a
            href="https://portfolio-five-five.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ x: 2, y: 2, boxShadow: "1px 1px 0 #111111" }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "Unbounded, sans-serif",
              fontWeight: 800,
              fontSize: "0.5rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-navbar-text, #111111)",
              textDecoration: "none",
              background: "#EF9F27",
              border: "2px solid var(--theme-navbar-text, #111111)",
              boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
              padding: "10px 18px",
              transition: "box-shadow 0.15s ease",
            }}
          >
            Check out my other projects →
          </motion.a>
        </div>
      </motion.div>

      {/* MEDIA ROW */}
      <div
        className="mt-16 pt-16 pb-10"
        data-aos="fade-in"
        data-aos-delay="1200"
        data-aos-duration="600"
      >
        <div
          style={{
            fontFamily: "Unbounded, sans-serif",
            fontWeight: 900,
            fontSize: "0.45rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--theme-navbar-text, #111111)",
            background: "#EF9F27",
            border: "2px solid var(--theme-navbar-text, #111111)",
            boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
            padding: "4px 12px",
            display: "inline-block",
            marginBottom: "16px",
          }}
        >
          Media
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {["Pencil", "Paint", "Digital", "Still Life"].map((skill, i) => (
            <motion.span
              key={skill}
              whileHover={{ x: 2, y: 2, boxShadow: "1px 1px 0 #111111" }}
              style={{
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 700,
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--theme-navbar-text, #111111)",
                background: "var(--theme-navbar, #ffffff)",
                border: "2px solid var(--theme-navbar-text, #111111)",
                boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
                padding: "6px 14px",
                cursor: "default",
                transition: "box-shadow 0.15s ease",
              }}
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}