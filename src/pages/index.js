import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Home() {

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

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Parallax for hero
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const globeY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Parallax for "Turning Ideas Into Reality"
  const headingRef = useRef(null);
  const { scrollYProgress: headingScroll } = useScroll({
    target: headingRef,
    offset: ["start center", "end start"],
  });

  const line1Y = useTransform(headingScroll, [0, 1], [0, -50]);   // "Turning Ideas"
  const line2Y = useTransform(headingScroll, [0, 1], [0, -100]);


  return (
    <div>
      <Navbar />
      <section>
        <header className="header relative text-center" data-aos="fade-in" data-aos-delay="">
          <h1 className="text" data-aos="fade-in" data-aos-delay="2000">[Portfolio]</h1>

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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 main-inde rounded-lg">
          <div className="md:col-span-6 main-ind">
            <h1 className="logo-3 text-2xl md:text-8xl font-bold leading-tight mb-6">
              <motion.span style={{ y: line1Y }} className="block">
                Turning Ideas
              </motion.span>
              <motion.span style={{ y: line2Y }} className="block text-red-500">
                Into Reality
              </motion.span>
            </h1>
          </div>

          {/* Right Column (Details + Text + Link) */}
          <div className="md:col-span-6 flex flex-col gap-4 mb-5">
            {/* Project Details */}
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

            {/* Description */}
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
        </div>
      </section>

      <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling">
        <ul className="marquee__content">
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

      <div className="p-6 columns-1 sm:columns-2 md:columns-4 gap-6 [column-fill:_balance]">
        {artworks.map((art, i) => (
          <ArtCard
            key={i}
            title={art.title}
            imageUrl={art.imageUrl}
            description={art.description}
            slug={art.slug}
            aosDelay={i * 250}
          />
        ))}
      </div>

    </div>
  )
}
