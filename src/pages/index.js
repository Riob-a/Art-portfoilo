// import Navbar from '../components/Navbar'
// import ArtCard from '../components/ArtCard';
// import artworks from '../data/artworks'
// import Image from 'next/image';
// import Link from 'next/link';
// import { SafeMotionDiv } from '@/components/SafeMotionDiv';
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef, useState, useEffect } from "react";
// import ThreeDText from '../components/ThreeDText';
// import { useInView } from "react-intersection-observer";
// import dynamic from "next/dynamic";

// const TelevisionCanvas = dynamic(() => import("../components/TelevisionCanvas"), {
//   ssr: false,
// });

// export default function Home() {

//   const { scrollY } = useScroll();
//   const scaleHeader = useTransform(scrollY, [0, 200], [1, 0]);
//   const opacityHeader = useTransform(scrollY, [0, 250], [1, 0]);
//   const scaleCarousel = useTransform(scrollY, [0, 300], [0.9, 1]);

//   const svg = (
//     <svg xmlns="http://www.w3.org/2000/svg"
//       width="30" height="30"
//       viewBox="0 0 24 24"
//       className='svg inline-block'
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="3"
//       strokeLinecap="round"
//       strokeLinejoin="round">
//       <path d="M7 17L17 7" />
//       <polyline points="7 7 17 7 17 17" />
//     </svg>
//   );

//   return (
//     <div>
//       <Navbar />
//       {/* --- Hero Section --- */}
//       <section>
//         <motion.header
//           className="heade relative text-center mb-10"
//           data-aos="fade-in"
//         >
//           <ThreeDText />
//           <div className="globe-container">
//             <svg viewBox="-2 -15 150 150" className="svg-text-arc" xmlns="http://www.w3.org/2000/svg">
//               <defs>
//                 <path id="text-circle" d="M 1,55 A 40,40 0 0,1 90,50" fill="none" />
//               </defs>
//               <text dy="-30" textLength="170">
//                 <textPath href="#text-circle" startOffset="50%" textAnchor="middle">D.R.O</textPath>
//               </text>
//             </svg>
//             <Image alt="logo" src="/globe-2.svg" className="globe-icon" height={30} width={30} />
//           </div>
//         </motion.header>
//       </section>

//       {/* --- Marquee --- */}
//       {/* <div className="logo-3 border-t border-black border-b border-black marquee" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
//         <ul className="marquee__content">
//           {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
//         </ul>
//         <ul className="marquee__content" aria-hidden="true">
//           {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
//         </ul>
//       </div> */}

//       <section className="p-8 mb-8 intro">
//         <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold mb-1" data-aos="fade-up">
//               <b className="logo-3">Welcome.</b>
//             </h1>
//             <p className="text-base text-gray-700 logo-3" data-aos="fade-up" data-aos-delay="200">
//               Feel free to explore.
//             </p>
//           </div>
//           <motion.div
//             whileHover={{ scale: 1.05 }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <Link
//               href="/gallery"
//               className="g-link inline-block px-6 py-2 rounded-md"
//               data-aos="fade-right"
//               data-aos-delay="400"
//             >
//               [ View Projects ]
//             </Link>
//           </motion.div>
//         </div>
//       </section>

//     </div>
//   );
// }
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
          className="heade relative text-center mb-10"
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

          {/* --- Welcome Section moved inside header --- */}
          <div className="p-8  intro rounded-xl">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold mb-1" data-aos="fade-right">
                  <b className="logo-3">Welcome.</b>
                </h1>
                <p className="text-base logo-3" data-aos="fade-right" data-aos-delay="200">
                  Feel free to explore.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Link
                  href="/gallery"
                  className="g-link inline-block px-6 py-2 rounded-md"
                  data-aos="fade-right"
                  data-aos-delay="400"
                >
                  [ View Projects ]
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.header>
      </section>
    </div>
  );
}
