import Navbar from '../components/Navbar'
import { motion, useScroll, useTransform } from "framer-motion";
import ThreeDText from '../components/ThreeDText';

export default function Home() {
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
    <div className='home h-[100vh]'>
      <Navbar />
      {/* --- Hero/Header Section --- */}
      <section>
        <motion.header
          className="relative "
          data-aos="fade-in"
        >
          <ThreeDText />
        </motion.header>
      </section>
    </div>
  );
}
