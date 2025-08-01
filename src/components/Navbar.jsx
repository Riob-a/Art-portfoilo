import Link from 'next/link'
import Image from 'next/image';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';


export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClasses = (path) =>
    `link ${pathname === path ? 'active-link' : ''}`;


  return (
    <nav className="navbar shadow-md p-4 flex justify-between items-center">
      <p className="logo text-l font-bold flex items-center gap-2" data-aos="fade-in" data-aos-delay=''>
        <Image
          alt="logo"
          src="/globe-2.svg"
          // src="/globe-1-ln.svg"
          width={30}
          height={30}
          className="logo-pic inline-block"
          data-aos="zoomIn" data-aos-delay='200'
        />
        The Portfolio
        {/* D3RRICK */}
      </p>
      <div className="hidden md:flex space-x-5 flex items-center">
        <Link className={linkClasses('/')} data-aos="fade-in" data-aos-delay='200' href="/">Home</Link>
        <Link className={linkClasses('/gallery')} data-aos="fade-in" data-aos-delay='400' href="/gallery">Gallery</Link>
        <Link className={linkClasses('/about')} data-aos="fade-in" data-aos-delay='600' href="/about">About</Link>
        <Link className={linkClasses('/contact')} data-aos="fade-in" data-aos-delay='800' href="/contact">Contact</Link>
      </div>
      
      {/* mobile and smaller */}
      <div className="md:hidden hamburger">
        <button onClick={toggleMenu} className="text-2xl h-button">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* dropdown */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-16 left-0 w-full bg-black shadow-lg md:hidden z-40"
          >
            <div className="flex flex-col items-start px-6 py-4 space-y-2">
              <Link className={linkClasses('/')} href="/" onClick={toggleMenu}>Home</Link>
              <Link className={linkClasses('/gallery')} data-aos="fade-in" data-aos-delay='400' href="/gallery">Gallery</Link>
        <Link className={linkClasses('/about')} data-aos="fade-in" data-aos-delay='600' href="/about">About</Link>
        <Link className={linkClasses('/contact')} data-aos="fade-in" data-aos-delay='800' href="/contact">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
