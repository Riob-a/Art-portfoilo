import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
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

  const { scrollY } = useScroll();

  // Scale goes from 1 → 0
  const scaleHeader = useTransform(scrollY, [0, 200], [1, 0]);
  const opacityHeader = useTransform(scrollY, [0, 250], [1, 0]);
  const scaleTitle = useTransform(scrollY, [150, 300], [1, 0]);

  const scaleCarousel = useTransform(scrollY, [0, 300], [0.7, 1]);


  const [activeIndex, setActiveIndex] = useState(0)
  const galleryRef = useRef(null)
  const [radius, setRadius] = useState(300);

  // const MemoizedArtCard = React.memo(ArtCard);
  const visibleRange = 4;

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setRadius(0); // mobile
      } else if (window.innerWidth < 1024) {
        setRadius(200); // tablet
      } else {
        setRadius(300); // desktop
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextArt = () =>
    setActiveIndex((prev) => (prev + 1) % artworks.length)
  const prevArt = () =>
    setActiveIndex((prev) =>
      prev === 0 ? artworks.length - 1 : prev - 1
    )

  const svg =
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

  const headingRef = useRef(null);

  return (
    <div>
      <Navbar />
      <section>
        <motion.header
          className="heade relative text-center"
          data-aos="fade-in"
          data-aos-delay=""
        // style={{ scale: scaleHeader, opacity: opacityHeader }}
        >
          {/* <h1 className="text rotating-3d" data-aos="fade-in" data-aos-delay="1500">[Portfolio]</h1> */}
          <ThreeDText />
          <div className="globe-container">
            <svg
              viewBox="-2 -15 150 150"
              className="svg-text-arc "
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path
                  id="text-circle"
                  d="M 1,55 A 40,40 0 0,1 90,50"
                  fill="none"
                />
              </defs>
              <text dy="-30" textLength="170">
                <textPath href="#text-circle" startOffset="50%" textAnchor="middle" data-aos="fade-in" data-aos-delay="">
                  D.R.O
                </textPath>
              </text>
            </svg>
            <Image
              alt="logo"
              src="/globe-2.svg"
              className="globe-icon"
              height={30}
              width={30}
            />
          </div>

        </motion.header>
      </section>
      <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
        <ul className="marquee__content" >
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>

          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
        </ul>

        <ul className="marquee__content" aria-hidden="true">
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>

          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
          <li>art </li><li>•</li>
        </ul>
      </div>
      {/* 3D Art Carousel */}
      <section className="carousel-section mb-5 mt-20">
        {/* --- MOBILE VIEW (scroll feed) --- */}
        <div className="block md:hidden w-full px-4 py-6 space-y-6">
          {artworks.map((art, index) => (
            <div key={index} className="w-full">
              <ArtCard
                title={art.title}
                imageUrl={art.imageUrl}
                description={art.description}
                slug={art.slug}
                aosDelay={index * 150}
              />
            </div>
          ))}
        </div>

        {/* --- DESKTOP/TABLET VIEW (3D carousel) --- */}
        <motion.div
          style={{ scale: scaleCarousel }}
          className="hidden md:flex relative min-h-screen flex-col items-center justify-center overflow-hidde"
        >
          {/* Background Circle */}
          <div
            className="absolute rounded-full b-[#f69b13ff] bg-black border border-black"
            style={{
              width: `${radius * 2.5}px`,   // double the radius to match orbit
              height: `${radius * 2.5}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,                  // keep behind artworks but above page bg
            }}
          />

          <div
            className="absolute rounded-full bg-[#e7e2d5] border border-black"
            style={{
              width: `${radius * 1.5}px`,   // double the radius to match orbit
              height: `${radius * 1.5}px`,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 5,                  // keep behind artworks but above page bg
            }}
          />

          <div
            ref={galleryRef}
            className="absolute z-20 w-full max-w-6xl h-screen perspective"
          >
            <SafeMotionDiv className="flex items-center justify-center w-full h-full">
              {artworks.map((art, index) => {
                const isVisible =
                  Math.abs(index - activeIndex) <= visibleRange ||
                  Math.abs(index - activeIndex) >= artworks.length - visibleRange;

                if (!isVisible) return null;

                const total = artworks.length;
                const angleStep = -360 / total;
                const angle = (index - activeIndex) * angleStep;
                const rad = (angle * Math.PI) / 180;
                const x = radius * Math.cos(rad);
                const y = radius * Math.sin(rad);
                const isActive = index === activeIndex;

                return (
                  <SafeMotionDiv
                    key={index}
                    className="art-motion-card"
                    style={{
                      transform: `
                translateX(${x}px)
                translateY(${y}px)
                rotate(${angle}deg)
                scale(${isActive ? 1 : 0.3})
              `,
                      opacity: isActive ? 1 : 0.5,
                      filter: isActive ? "brightness(1)" : "brightness(0.5)",
                      zIndex: total - Math.abs(index - activeIndex),
                      transition:
                        "transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease",
                    }}
                  >
                    <div
                      className={`relative rounded-xl ${isActive ? "glint-effect" : ""
                        }`}
                    >
                      <ArtCard
                        title={art.title}
                        imageUrl={art.imageUrl}
                        description={art.description}
                        slug={art.slug}
                        aosDelay={index * 250}
                      />
                    </div>
                  </SafeMotionDiv>
                );
              })}
            </SafeMotionDiv>


            {/* Prev/Next buttons */}
            <motion.button
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              whileTap={{ scale: 0.8 }}
              onClick={prevArt}
              className="carousel-buttons hidden sm:flex absolute left-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
            >
              Prev
            </motion.button>

            <motion.button
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              whileTap={{ scale: 0.8 }}
              onClick={nextArt}
              className="carousel-buttons hidden sm:flex absolute right-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
            >
              Next
            </motion.button>
          </div>

          {/* Dots navigation */}
          <div className="absolute hidden sm:flex z-30 w-40 h-40 mx-auto" role="tablist" aria-label="Select artwork">
            {artworks.map((_, i) => {
              const total = artworks.length;
              const angle = (i / total) * 2 * Math.PI;
              const dotRadius = 130;
              const x = dotRadius * Math.cos(angle).toFixed(2);
              const y = dotRadius * Math.sin(angle).toFixed(2);

              return (
                <motion.button
                  key={i}
                  animate={{
                    scale: i === activeIndex ? 1.5 : 1,
                    backgroundColor: i === activeIndex ? "#E85002" : "#0b0b0bff",
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setActiveIndex(i)}
                  className="absolute w-3 h-3 rounded-full cursor-pointer"
                  style={{
                    left: `calc(50% + ${x}px - 6px)`,
                    top: `calc(50% + ${y}px - 6px)`,
                  }}
                  aria-label={`Go to artwork ${i + 1}`}
                />
              );
            })}
          </div>
        </motion.div>
      </section>


      {/* <div
        ref={ref}
        className="w-full flex justify-center min-h-screen  mb-20"
      >
        {inView ? (
          <TelevisionCanvas />
        ) : (
          <div className="text-gray-400 flex items-center justify-center">
            Loading 3D model...
          </div>
        )}
      </div> */}
    </div >
  )
}
