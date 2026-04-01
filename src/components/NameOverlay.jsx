"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GalleryOverlay() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <Link href="/">
      <div className="main-logo-h fixed bottom-22 right-4 z-50 text-white uppercase tracking-widest cursor-pointer">
        <div className="text-xs opacity-70">
          the
        </div>
        <div className="flex items-center gap-2 text-xl">
          <span>GALLERY</span>
        </div>
      </div>
    </Link>
  );
}