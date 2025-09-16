import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";

export default function Home() {

  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedArt, setSelectedArt] = useState(null);
  const galleryRef = useRef(null)
  const [radius, setRadius] = useState(300);

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
          <h1 className="text" data-aos="fade-in" data-aos-delay="1500">[Portfolio]</h1>

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

      <section ref={headingRef} className="px-4 py-8 mb-4">
        {/* <div className="grid grid-cols-1 md:grid-cols-12 gap-6 main-inde rounded-lg">
          <div className="md:col-span-6 main-ind">
            <h1 className="logo-3 text-2xl md:text-8xl font-bold leading-tight mb-6">
              <motion.span style={{ y: line1Y }} className="block">
                Turning Ideas
              </motion.span>
              <motion.span style={{ y: line2Y }} className="block text-red-500">
                Into Reality
              </motion.span>
            </h1>
          </div> */}

        {/* Right Column (Details + Text + Link) */}

        {/* <div className="md:col-span-6 flex flex-col gap-4 mb-5">
            <div className="main-index-2 border-gray-300 pt-4 desc-details" data-aos="fade-in" data-aos-delay="200">
              <h2 className="text-sm uppercase tracking-wide font-semibold mb-2" >
                Details
              </h2>
              <div className="border-t border-gray-500 text-sm grid grid-cols-3 gap-y-4">
                <span className="font-medium">Category</span>
                <span className="col-span-2">Art gallery</span>

                <span className="font-medium border-t border-gray-500">Services</span>
                <span className="col-span-2 border-t border-gray-500">
                  Art Direction <br />
                  Web Design <br />
                  Visual Design
                </span>

                <span className="font-medium border-t border-gray-500  border-b border-gray-500">Year</span>
                <span className="col-span-2 border-t border-gray-500  border-b border-gray-500">2024 - Present</span>
              </div>
            </div>

            <br />

            <p className="text-base leading-relaxed text-gray-300 desc-intro" data-aos="fade-up" data-aos-delay="200">
              This website showcases a modern  <span className="font-semibold">art gallery</span>
              that brings together creativity and technology, offering a seamless experience .
              Learn about the creative process,
              and connect with my vision.

            </p>
            <motion.div
              className="text-1xl"
              whileHover={{ scale: 1.08, y: 10, x: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href="/gallery"
                className="g-link rounded-md"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                [ View Gallery {svg}]
              </Link>
            </motion.div>
          </div>
        </div> */}

      </section>

      <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling">
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
      <div className="d-card relative mt-10 min-h-screen flex flex-col items-center justify-center overflow-hidde">
        {radius === 0 ? (
          // --- MOBILE: Linear carousel ---
          <div className="flex w-full overflow-x-auto space-x-4 px-4 snap-x snap-mandatory">
            {artworks.map((art, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[100vw] snap-center rounded-xl shadow-lg  backdrop-blur-sm p-4"
              >
                <ArtCard
                  title={art.title}
                  imageUrl={art.imageUrl}
                  description={art.description}
                  slug={art.slug}
                  aosDelay={index * 250}
                />
              </div>
            ))}
          </div>
          
        ) : (

        // --- DESKTOP/TABLET: 3D Circular carousel ---
        <div
          ref={galleryRef}
          className="relative w-full max-w-6xl h-[500px] perspective"
        >
          <motion.div
            className="flex items-center justify-center w-full h-full"
          >
            {artworks.map((art, index) => {
              const total = artworks.length
              const angleStep = -360 / total
              // shift based on activeIndex so carousel rotates
              const angle = (index - activeIndex) * angleStep
              const rad = (angle * Math.PI) / 180
              // const radius = 300 
              const x = radius * Math.cos(rad)
              const y = radius * Math.sin(rad)

              const isActive = index === activeIndex

              return (
                <motion.div
                  key={index}
                  className="absolute w-[90vw] sm:w-[40vw] md:w-65 h-auto aspect-[3/3] p-2 sm:p-2 text-center rounded-xl shadow-lg bg-white/20 backdrop-blur-sm"
                  
                  style={{
                    transform: `
                      translateX(${x}px)
                      translateY(${y}px)
                      rotate(${angle}deg)
                      scale(${index === activeIndex ? 1 : 0.4})
                    `,
                    opacity: isActive ? 1 : 0.3,
                    filter: isActive ? 'brightness(1)' : 'brightness(0.5)',

                    zIndex: total - Math.abs(index - activeIndex),
                    // opacity: 1,
                    transition: 'transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease',
                  }}
                >
                  <ArtCard
                    title={art.title}
                    imageUrl={art.imageUrl}
                    description={art.description}
                    slug={art.slug}
                    aosDelay={index * 250}
                  />
                </motion.div>
              )
            })}
          </motion.div>

          <motion.button
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            whileTap={{ scale: 0.8 }}
            onClick={prevArt}
            className="hidden sm:flex absolute left-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
          >
            ‹ Prev
          </motion.button>

          <motion.button
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            whileTap={{ scale: 0.8 }}
            onClick={nextArt}
            className="hidden sm:flex absolute right-12 top-1/2 -translate-y-1/2 px-4 py-2 bg-[#64646430] text-white rounded-full"
          >
            Next ›
          </motion.button>
        </div>
        )}

        {/* Dots */}

        <div className="absolute hidden sm:flex  justify-center mt-8 gap-5">
          {artworks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002]' : 'bg-gray-400'}`}
              aria-label={`Go to artwork ${i + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  )
}
