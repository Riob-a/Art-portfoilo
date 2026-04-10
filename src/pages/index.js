import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import InteractiveSpinningSphere from "@/components/Sphere";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen">
      <Navbar />

      <section>
        <motion.header
          className="relative w-full"
          data-aos="fade-in"
          data-aos-delay="200"
        >
          {/* 3D Sphere */}
          <InteractiveSpinningSphere />

          {/* Bottom-left text */}
          <div
            className="
              absolute
              bottom-44
              left-6
              z-10
              select-none
              main-logo
            "
          >
            <div className="text-white uppercase tracking-widest">
              <div
                className="text-sm md:text-base opacity-70"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                the
              </div>

              {/* GALLERY + link */}
              <div
                className="flex items-center gap-3 text-4xl md:text-7xl font-bold"
                data-aos="fade-right"
                data-aos-delay="800"
              >
                <span>GALLERY</span>

                {/* Inline Gallery Link */}
                <Link
                  href="/gallery"
                  className="relative flex items-center justify-center md:hidden"
                  aria-label="Open gallery"
                >
                  <span className="absolute inline-flex h-10 w-10 rounded-full bg-white/30 animate-ping" />
                  <span className="relative p-2 text-white rounded-full">
                    <FaSearch size={18} />
                  </span>
                </Link>
              </div>

              {/* Subtitle */}
              <div
                className="text-xs md:text-xs opacity-50 tracking-widest font-light normal-case mt-1"
                data-aos="fade-right"
                data-aos-delay="1000"
              >
                Artist | Web Developer
              </div>
            </div>
          </div>
        </motion.header>
      </section>
    </div>
  );
}