import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import InteractiveSpinningSphere from "@/components/Sphere";

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
              bottom-6
              left-6
              z-10
              pointer-events-none
              select-none

              main-logo
            "
          >
            <span
              className="
                text-white
                text-xl
                md:text-2xl
                font-semibold
                tracking-widest
                opacity-90
                main-logo
              "
            >
              <div className="text-white uppercase tracking-widest">
                <div className="text-sm md:text-base opacity-70"
                  data-aos="fade-right"
                  data-aos-delay="400"
                >
                  the
                </div>
                <div className="text-4xl md:text-7xl font-bold"
                  data-aos="fade-right"
                  data-aos-delay="800"
                >
                  GALLERY
                </div>
              </div>
            </span>
          </div>
        </motion.header>
      </section>
    </div>
  );
}
