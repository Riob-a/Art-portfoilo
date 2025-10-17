import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
import Link from 'next/link';
import { SafeMotionDiv } from '@/components/SafeMotionDiv';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ThreeDText from '../components/ThreeDText';
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const TelevisionCanvas = dynamic(() => import("../components/TelevisionCanvas"), {
  ssr: false,
});

export default function Home() {
  // const [activeIndex, setActiveIndex] = useState(5);
  const [activeIndex, setActiveIndex] = useState(() => {
    return Math.floor(artworks.length / 2);
  });
  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % artworks.length);

  const handlePrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + artworks.length) % artworks.length
    );

  const { scrollY } = useScroll();
  const scaleHeader = useTransform(scrollY, [0, 200], [1, 0]);
  const opacityHeader = useTransform(scrollY, [0, 250], [1, 0]);
  const scaleCarousel = useTransform(scrollY, [0, 300], [0.9, 1]);

  const svg = (
    <svg xmlns="http://www.w3.org/2000/svg"
      width="30" height="30"
      viewBox="0 0 24 24"
      className='svg inline-block'
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M7 17L17 7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );

  return (
    <div>
      <Navbar />
      {/* --- Hero/Header Section --- */}
      <section>
        <motion.header
          className="heade relative text-cente mb-10"
          data-aos="fade-in"
        // style={{ scale: scaleHeader, opacity: opacityHeader }}
        >
          {/* 3D Text + Globe */}
          <ThreeDText />
          <div className="globe-container">
            <svg viewBox="-2 -15 150 150" className="svg-text-arc" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <path id="text-circle" d="M 1,55 A 40,40 0 0,1 90,50" fill="none" />
              </defs>
              <text dy="-30" textLength="170">
                <textPath href="#text-circle" startOffset="50%" textAnchor="middle">D.R.O</textPath>
              </text>
            </svg>
            <Image alt="logo" src="/globe-2.svg" className="globe-icon" height={30} width={30} />
          </div>
        </motion.header>
      </section>

      <section className="mb-4 px-4 sm:px-8 h-[25vh] text-black">
        <div className="intro rounded-xl">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 text-center sm:text-left">
            <div className="space-y-1">
              <h1
                className="text-2xl sm:text-3xl font-bold logo-3"
                data-aos="fade-right"
              >
                Welcome.
              </h1>
              <p
                className="text-base sm:text-lg text-gray logo-3"
                data-aos="fade-right"
                data-aos-delay="200"
              >
                Feel free to explore.
              </p>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-4 sm:mt-0"
            >
              <Link
                href="/gallery"
                className="g-link inline-block px-6 py-2 rounded-md text-base sm:text-lg"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                [ View Projects ]
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* <section className="relative bg-[#d5bc8d] flex flex-col items-center justify-center h-[100vh]  overflow-hidden">
        <button
          onClick={handlePrev}
          className="absolute left-30 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
        >
          ‹
        </button>
        <button
          onClick={handleNext}
          className="absolute right-30 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white transition"
        >
          ›
        </button>

        <SafeMotionDiv className="relative flex items-center justify-center w-full h-[100vh]">
          {artworks.map((art, index) => {
            const total = artworks.length;
            const angleStep = 180 / (total - 1); // distribute along a 180° arc
            const angle = (index - activeIndex) * angleStep - 90; // start left (-90°) to right (+90°)
            const rad = (angle * Math.PI) / 180;

            // Arc coordinates
            const radius = 350;
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad) + 60

            // Smooth depth + fading
            const distance = Math.abs(index - activeIndex);
            const scale = 1 - distance * 0.1;
            const opacity = 1 - distance * 0.25;

            return (
              <SafeMotionDiv
                key={index}
                className="absolute transition-all duration-500 ease-out"
                style={{
                  transform: `
              translateX(${x}px)
              translateY(${y}px)
              rotate(${angle}deg)
              scale(${scale})
            `,
                  opacity,
                  zIndex: total - distance,
                }}
              >
                <div
                  className="rounded-2xl overflow-hidde shadow-lg hover:shadow-xl transition-all duration-300"
                  style={{
                    width: "100px",
                    height: "auto",
                    transform: "rotate(-" + angle + "deg)", // keep upright
                  }}
                >
                  <ArtCard
                    title={art.title}
                    imageUrl={art.imageUrl}
                    aosDelay={index * 150}
                  />
                </div>
              </SafeMotionDiv>
            );
          })}
        </SafeMotionDiv>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
          <h5 className="logo-3 text-xl sm:text-2xl mb-2">
            Explore more in the gallery
          </h5>
          <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mt-4 sm:mt-0"
            >
              <Link
                href="/gallery"
                className="g-link inline-block px-6 py-2 rounded-md text-base sm:text-lg"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                [ View Projects ]
              </Link>
            </motion.div>
        </div>


      </section> */}

    </div>
  );
}
