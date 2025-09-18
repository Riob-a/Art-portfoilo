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
          <h1 className="text rotating-3d" data-aos="fade-in" data-aos-delay="1500">[Portfolio]</h1>

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
      <div className="d-card relative min-h-screen flex flex-col items-center justify-center overflow-hidde">
        {radius === 0 ? (
          // --- MOBILE: Linear carousel ---
          <div className="flex w-full overflow-x-auto space-x-4 px-4  snap-x snap-mandatory">
            {artworks.map((art, index) => {
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

                  </motion.div>
                )
              })}
            </motion.div>

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

        {/* Dots */}

        <div className="absolute hidden sm:flex  justify-center mt-8 gap-5 " role="tablist" aria-label="Select artwork">
          {artworks.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002]' : 'bg-gray-400'} cursor-pointer`}
              aria-label={`Go to artwork ${i + 1}`}
            />
          ))}
        </div>

      </div>

    </div>
  )
}
