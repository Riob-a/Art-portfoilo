"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const textVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
};

export default function GalleryOverlay() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link href="/">
      <motion.div
        variants={textVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
        className="main-logo-h fixed bottom-10 right-4 z-50 text-white uppercase tracking-widest cursor-pointer"
      >
        <div className="text-xs opacity-70">
          the
        </div>
        <div className="flex items-center gap-2 text-xl">
          <span>GALLERY</span>
        </div>
      </motion.div>
    </Link>
  );
}