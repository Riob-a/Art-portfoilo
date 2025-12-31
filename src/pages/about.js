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
    <section className="about max-h-screen  p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-18">
        <motion.h2
          // {...fadeUp}
          // transition={{ duration: 0.8 }}
          className="text-8xl  a-heading"
        >
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
        // {...fadeUp}
        // transition={{ duration: 1 }}
        className="space-y-5  leading-relaxed mx-auto"
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

        <p>
          <Link
            href="https://portfolio-five-five.vercel.app/"
            className="a-link"
          >
            Here
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
