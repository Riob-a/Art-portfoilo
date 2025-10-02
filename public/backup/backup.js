import Link from 'next/link'
import Image from 'next/image';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Contact from '@/pages/contact';


export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const linkClasses = (path) =>
    `link ${pathname === path ? 'active-link' : ''}`;


  return (
    <nav className="navbar shadow-md p-3 flex justify-between items-center rounded-lg">
      {/* Left Links */}
      <div className="hidden md:flex space-x-5 items-center">
        <Link className={linkClasses('/about')} data-aos="fade-in" data-aos-delay='600' href="/about">About</Link>
      </div>

      {/* Logo in the Center */}
      <Link
        href="/"
        className="logo text-l font-bold flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2"
        data-aos="fade-in"
      >[
        <Image
          alt="logo"
          src="/globe-2.svg"
          width={30}
          height={30}
          className="logo-pic inline-block"
          data-aos="zoomIn"
          data-aos-delay="200"
        />
        {/* The Portfolio */}]
      </Link>

      {/* Right Links */}
      <div className="hidden md:flex space-x-5 items-center">
        <Link className={linkClasses('/contact')} data-aos="fade-in" data-aos-delay='800' href="/contact">Contact</Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden hamburger ml-auto" style={{ color: '#608561' }}>
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
              {/* <Link className={linkClasses('/gallery')} data-aos="fade-in" data-aos-delay='400' href="/gallery">Gallery</Link> */}
              <Link className={linkClasses('/about')} data-aos="fade-in" data-aos-delay='600' href="/about">About</Link>
              <Link className={linkClasses('/contact')} data-aos="fade-in" data-aos-delay='800' href="/contact">Contact</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

Contact
// import { useState } from 'react'
// import Navbar from '../components/Navbar'
// import { motion } from 'framer-motion'
// import Link from 'next/link'
// import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa'


// export default function Contact() {
//   const arrow = <svg
//     className="arrow-icon"
//     xmlns="http://www.w3.org/2000/svg"
//     viewBox="0 0 24 24"
//     width="28"
//     height="28"
//   >
//     <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
//   </svg>

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     message: ''
//   })

//   const [status, setStatus] = useState('')

//   // Update form state as user types
//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value })
//   }

//   // Submit form data to Flask backend
//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setStatus('Sending...')

//     try {
//       const res = await fetch('https://art-portfoilo-backend-production.up.railway.app/api/contact', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       })

//       const data = await res.json()

//       if (res.ok && data.success) {
//         setStatus('Message sent successfully!')
//         setFormData({ name: '', email: '', message: '' }) // Clear form
//       } else {
//         setStatus(data.error || 'Something went wrong.')
//       }
//     } catch (error) {
//       setStatus('Failed to send. Server might be down.')
//     }
//   }

//   return (
//     <div>
//       {/* <Navbar /> */}
//       <section className="p-8 max-w-xl mx-auto a-content">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl md:text-8xl font-bold mb-4 animate-fadeInLeft a-heading">Get in Touch</h2>
//           <Link href="/" className="line-arrow">
//             <button className="arrow-l-button">
//               {arrow}
//             </button>
//           </Link>
//         </div>
//         <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Your Name"
//             className="border p-2 animate-fadeInLeftDelay delay-1"
//             required
//           />
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Your Email"
//             className="border p-2 animate-fadeInLeftDelay delay-2"
//             required
//           />
//           <textarea
//             name="message"
//             value={formData.message}
//             onChange={handleChange}
//             placeholder="Your Message"
//             className="border p-2 animate-fadeInLeftDelay delay-3"
//             rows="5"
//             required
//           />
//           <button
//             type="submit"
//             className="gradient-text py-2 px-4 animate-fadeInLeftDelay delay-4"
//           >
//             Send Message
//           </button>
//           <p className="text-sm text-gray-600 mt-2">{status}</p>
//         </form>
//       </section>

//       <section className="contact p-8 mt-8 mb-8 max-w-xl mx-auto text-center" data-aos="fade-in" data-aos-delay="400">
//         <h2 className="text-2xl font-bold mb-4 a-heading">Contact Information</h2>
//         <p className="flex flex-wrap items-center gap-4 justify-center a-content">
//           <motion.a href="mailto: riobad74@gmail.com" className="p-link flex items-center gap-1 text-sm" whileHover={{ scale: 1.05, color: '#ff7e5f' }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <FaGoogle size={14} /> riobad74@gmail.com
//           </motion.a>
//           <span>|</span>
//           <motion.a href="https://github.com/Riob-a" title="Github" className="p-link flex items-center gap-1 text-sm" whileHover={{ scale: 1.05, color: '#ff7e5f' }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <FaGithub size={14} /> Riob-a
//           </motion.a>
//           <span>|</span>
//           <motion.a href="https://www.linkedin.com/in/derrick-r-ongwae-1530142bb/" title="LinkedIn" className="p-link flex items-center gap-1 text-sm" whileHover={{ scale: 1.05, color: '#ff7e5f' }}
//             transition={{ type: 'spring', stiffness: 300, damping: 20 }}
//           >
//             <FaLinkedin size={14} /> Derrick Ongwae
//           </motion.a>
//         </p>
//       </section>
//     </div>
//   )
// }

About

// import Navbar from '../components/Navbar'
// import Link from 'next/link'

// const arrow = <svg
//   className="arrow-icon"
//   xmlns="http://www.w3.org/2000/svg"
//   viewBox="0 0 24 24"
//   width="28"
//   height="28"
// >
//   <path d="M19 12H5M11 6l-6 6 6 6" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
// </svg>

// export default function About() {
//   return (
//     <div>
//       {/* <Navbar /> */}
//       <section className="p-8 max-w-2xl mx-auto animate-fadeInLeft a-content">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl md:text-8xl font-bold mb-4 a-heading">About Me</h2>
          
//           <Link href="/" className="line-arrow">
//             <button className="arrow-l-button">
//               {arrow}
//             </button>
//           </Link>
//         </div>
//         <p>
//           I am a visual artist comfortable with both paint and pencil, preferrably pencil, specializing in
//           creating intricate compositions that combine both pencil and paint, with the occasional still life.
//         </p>
//         <br />
//         <p>
//           I also have a background in web development, which facilitated the design and creation of this very website.
//           Hope you enjoy my work and feel free to reach out and check out my other web projects
//         </p>

//         <p>
//           <Link href="https://portfolio-five-five.vercel.app/" className="a-link">Here</Link>
//         </p>
//       </section>
//     </div>
//   )
// }

//          <div className="logo-3 border-t border-gray-500 border-b border-gray-500 marquee" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
//         <ul className="marquee__content" >
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>

//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//         </ul>

//         <ul className="marquee__content" aria-hidden="true">
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>

//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//           <li>art </li><li>•</li>
//         </ul>
//       </div>
// {/* dots */}
//       <div className="absolute hidden sm:flex  justify-center mt-8 gap-5 " role="tablist" aria-label="Select artwork">
//           {artworks.map((_, i) => (
//             <button
//               key={i}
//               onClick={() => setActiveIndex(i)}
//               className={`w-3 h-3 rounded-full ${i === activeIndex ? 'bg-[#E85002]' : 'bg-gray-400'} cursor-pointer`}
//               aria-label={`Go to artwork ${i + 1}`}
//             />
//           ))}
//         </div>

        {/* <motion.div
          style={{ scale: scaleCarousel }}
          className="hidden md:flex relativ min-h-screen flex-col items-center justify-center overflow-hidde ||"
        >
          <div
            ref={galleryRef}
            className="absolut z-20 w-full max-w-6xl h-screen perspective"
          >
            <SafeMotionDiv className="flex items-center justify-center w-full h-full">
              {artworks.map((art, index) => {
                const isVisible =
                  Math.abs(index - activeIndex) <= visibleRange ||
                  Math.abs(index - activeIndex) >= artworks.length - visibleRange;

                if (!isVisible) return null;

                const total = artworks.length;
                const angleStep = -360 / total;
                const angle = (index - activeIndex) * angleStep;
                const rad = (angle * Math.PI) / 180;
                const x = radius * Math.cos(rad);
                const y = radius * Math.sin(rad);
                const isActive = index === activeIndex;

                return (
                  <SafeMotionDiv
                    key={index}
                    className="art-motion-card"
                    style={{
                      transform: `
                  translateX(${x}px)
                  translateY(${y}px)
                  rotate(${angle}deg)
                  scale(${isActive ? 1 : 0.2})
                `,
                      opacity: isActive ? 1 : 0.3,
                      filter: isActive ? "brightness(1)" : "brightness(0.9)",
                      zIndex: total - Math.abs(index - activeIndex),
                      transition:
                        "transform 0.6s ease, opacity 0.6s ease, filter 0.6s ease",
                    }}
                  >
                    <div className={`relative rounded-xl ${isActive ? "glint-effect" : ""}`}>
                      <ArtCard
                        title={art.title}
                        imageUrl={art.imageUrl}
                        description={art.description}
                        slug={art.slug}
                        aosDelay={index * 250}
                      />
                    </div>
                  </SafeMotionDiv>
                );
              })}
            </SafeMotionDiv> */}