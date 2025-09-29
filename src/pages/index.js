import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
import { SafeMotionDiv } from '@/components/SafeMotionDiv';
// import Link from 'next/link';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
// import ThreeDText from '../components/ThreeDText';
// import ThreeDModel from '../components/ThreeDModel';

import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";

const TelevisionCanvas = dynamic(() => import("../components/TelevisionCanvas"), {
  ssr: false,
});

export default function Home() {

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedArt, setSelectedArt] = useState(null);
  const galleryRef = useRef(null)
  const [radius, setRadius] = useState(300);

  // const MemoizedArtCard = React.memo(ArtCard);
  const visibleRange = 4;
  const visibleRangeTwo = 2;
  const [ref, inView] = useInView({ triggerOnce: true, rootMargin: "200px" });

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
        <header className="header relative text-center" data-aos="fade-in" data-aos-delay="">
          <h1 className="text rotating-3d" data-aos="fade-in" data-aos-delay="1500">[Portfolio]</h1>

          {/* <div className="w-full flex justify-center">
            <ThreeDText />
          </div> */}

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

        </header>
      </section>

      <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
        <ul className="marquee__content" >
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
        </ul>

        {/* duplicate track */}
        <ul className="marquee__content" aria-hidden="true">
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
          <li>art projects</li><li>•</li>
        </ul>
      </div>

      {/* 3D Art Carousel */}
      <div className="d-card relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {radius === 0 ? (
          // --- MOBILE: Linear carousel ---
          <div className="flex w-full overflow-x-auto space-x-4 px-4  snap-x snap-mandatory">
            {artworks.map((art, index) => {
              const isVisibleTwo =
                Math.abs(index - activeIndex) <= visibleRangeTwo ||
                Math.abs(index - activeIndex) >= artworks.length - visibleRange; // wrap around

              if (!isVisibleTwo) return null;

              const isActive = index === activeIndex
              return (
                <div
                  key={index}
                  className={`art-motion-card-2 relative  ${isActive ? 'glint-effect-2' : ''}`}
                // className="flex-shrink-0 w-[100vw] snap-center rounded-xl shadow-lg  backdrop-blur-sm p-4"
                >
                  <ArtCard
                    title={art.title}
                    imageUrl={art.imageUrl}
                    description={art.description}
                    slug={art.slug}
                    aosDelay={index * 250}
                  />
                </div>
              )
            })}
          </div>

        ) : (

          // --- DESKTOP/TABLET: 3D Circular carousel ---
          <div
            ref={galleryRef}
            className="absolute z-20 w-full max-w-6xl h-[500px] perspective"
          >
            <SafeMotionDiv
              className="flex items-center justify-center w-full h-full"
            >
              {artworks.map((art, index) => {
                const isVisible =
                  Math.abs(index - activeIndex) <= visibleRange ||
                  Math.abs(index - activeIndex) >= artworks.length - visibleRange; // wrap around

                if (!isVisible) return null;

                const total = artworks.length
                const angleStep = -360 / total
                // shift based on activeIndex so carousel rotates
                const angle = (index - activeIndex) * angleStep
                const rad = (angle * Math.PI) / 180
                const x = radius * Math.cos(rad)
                const y = radius * Math.sin(rad)

                const isActive = index === activeIndex

                return (
                  <SafeMotionDiv
                    key={index}
                    // className=" absolute w-[90vw] sm:w-[40vw] md:w-70 h-auto aspect-[2/1] p-2 sm:p-3 text-center rounded-xl shadow-lg bg-white/20 backdrop-blur-sm
                    // flex items-center justify-center"
                    className="art-motion-card "
                    style={{
                      transform: `
                      translateX(${x}px)
                      translateY(${y}px)
                      rotate(${angle}deg)
                      scale(${index === activeIndex ? 1 : 0.4})
                    `,
                      opacity: isActive ? 1 : 0.6,
                      filter: isActive ? 'brightness(1)' : 'brightness(0.6)',

                      zIndex: total - Math.abs(index - activeIndex),
                      // opacity: 1,
                      transition: 'transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease',
                    }}
                  >

                    <div className={`relative rounded-xl ${isActive ? 'glint-effect' : ''}`}>
                      <ArtCard
                        title={art.title}
                        imageUrl={art.imageUrl}
                        description={art.description}
                        slug={art.slug}
                        aosDelay={index * 250}
                      />
                    </div>

                  </SafeMotionDiv>
                )
              })}
            </SafeMotionDiv>

            <motion.button
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              whileTap={{ scale: 0.8 }}
              onClick={prevArt}
              className=" carousel-buttons hidden sm:flex absolute left-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
            >
              ‹ Prev
            </motion.button>

            <motion.button
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              whileTap={{ scale: 0.8 }}
              onClick={nextArt}
              className=" carousel-buttons hidden sm:flex absolute right-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
            >
              Next ›
            </motion.button>
          </div>
        )}
        {/* Circular Boundaries */}
        <div
          className="absolute z-10 rounded-full border border-gray-400/50"
          style={{
            width: `${radius * 2.25 + 100}px`, // outside circle
            height: `${radius * 2.25 + 100}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        ></div>

        <div
          className="absolute z-10 rounded-full border border-gray-400/40"
          style={{
            width: `${radius * 1.75 - 100}px`, // inside circle
            height: `${radius * 1.75 - 100}px`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        ></div>


        {/* Dots */}

        {/* <div className="absolute hidden sm:flex  justify-center mt-8 gap-5 " role="tablist" aria-label="Select artwork">
          {artworks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002]' : 'bg-gray-400'} cursor-pointer`}
              aria-label={`Go to artwork ${i + 1}`}
            />
          ))}
        </div> */}
        <div className="absolute z-30 w-40 h-40 mx-auto " role="tablist" aria-label="Select artwork" data-aos="fade-in"data-aos-delay="1500">
          {artworks.map((_, i) => {
            const total = artworks.length;
            const angle = (i / total) * 2 * Math.PI;

            const dotRadius = 130; // radius of the dots circle
            const x = dotRadius * Math.cos(angle);
            const y = dotRadius * Math.sin(angle);

            return (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`absolute w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002] scale-160' : 'bg-gray-400 '
                  } cursor-pointer`}
                style={{
                  left: `calc(50% + ${x}px - 6px)`,
                  top: `calc(50% + ${y}px - 6px)`,
                }}
                aria-label={`Go to artwork ${i + 1}`}
              />
            );
          })}
        </div>

      </div>

      <div
        ref={ref}
        className="w-full flex justify-center min-h-[300px]"
        data-aos="fade-in"
        data-aos-delay="1500"
      >
        {inView ? (
          <TelevisionCanvas />
        ) : (
          <div className="text-gray-400 flex items-center justify-center">
            Loading 3D model...
          </div>
        )}
      </div>

    </div >
  )
}
