import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import Image from 'next/image';
import Link from 'next/link';
import { SafeMotionDiv } from '@/components/SafeMotionDiv';
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import ThreeDText from '../components/ThreeDText';
import CombinedHeaderGallery from '../components/CombinedHeaderGallery'
import { useInView } from "react-intersection-observer";
import dynamic from "next/dynamic";
import ThreeDGallery from "../components/ThreeDGallery";

const TelevisionCanvas = dynamic(() => import("../components/TelevisionCanvas"), {
  ssr: false,
});

export default function Home() {
  // const [activeIndex, setActiveIndex] = useState(5);
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
          className="canvas relative text-cente "
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

            <Link
              href="/gallery"
              className="text-center p-5 text-lg font-medium cursor-pointer block g-link"
            >
              <div data-aos="fade-up" >
              View gallery{svg}
              </div>
            </Link>
        </motion.header>
      </section>
      {/*<ThreeDGallery artworks={artworks} />*/}
    </div>
  );
}
