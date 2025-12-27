import Navbar from '../components/Navbar'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import ThreeDHeader from '../components/ThreeDHeader'

const arrow = (
  <svg
    className="arrow-icon"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="28"
    height="28"
  >
    <path
      d="M19 12H5M11 6l-6 6 6 6"
      fill="none"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default function About() {
  const [isLowPowerDevice, setIsLowPowerDevice] = useState(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = window.innerWidth < 768
      const gl = document.createElement('canvas').getContext('webgl2')
      const weakGPU = !gl
      setIsLowPowerDevice(isMobile || weakGPU)
    }
  }, [])

  if (isLowPowerDevice === null) return null

  return (
    <div>
      <section
        className="about mt-8 mb-40 p-7 max-w-2xl mx-auto animate-fadeInLeft"
      >
        <div className="flex items-center justify-between mb-18">
          {/* Conditional rendering: 3D header only for high-power devices */}
            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              // className="text-3xl md:text-8xl font-bold mb-18 a-heading"
              className="text-8xl font-bold mt-4 a-heading"
            >
              About Me
            </motion.h2>
           
          <motion.div
            className="line-arrow"
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            whileTap={{ scale: 0.6 }}
          >
            <Link href="/">
              <button className="arrow-l-button">{arrow}</button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-7 mt-30 text-lg leading-relaxed"
        >
          <p>
            I am a visual artist comfortable with both paint and pencil,
            preferably pencil, specializing in creating intricate compositions
            that combine both pencil and paint, with the occasional still life.
          </p>

          <p>
            I also have a background in web development, which facilitated the
            design and creation of this very website. Hope you enjoy my work and
            feel free to reach out and check out my other web projects.
          </p>

          <p>
            <Link href="https://portfolio-five-five.vercel.app/" className="a-link">
              Here
            </Link>
          </p>
        </motion.div>
      </section>
    </div>
  )
}
