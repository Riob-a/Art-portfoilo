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
import ThreeDGallery from "../components/ThreeDGallery";

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
          className="heade relative text-cente "
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

      <div className="logo-3 border-t border-black border-b border-black marquee mt-0.6" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
        <ul className="marquee__content">
          {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <ul className="marquee__content" aria-hidden="true">
          {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>
      
      {/* <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6"> */}
      {/* <div className="p-4 columns-1 sm:columns-2 md:columns-5 gap-4 [column-fill:_balance]">
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
      </div> */}

      <ThreeDGallery artworks={artworks} />
          </div>
  );
}
