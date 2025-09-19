"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function SafeMotionDiv(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null; // don’t render until client hydration is done
  return <motion.div {...props} />;
}
