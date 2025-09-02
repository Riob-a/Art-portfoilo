import Navbar from '../components/Navbar'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

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
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  // Parallax transforms
  const yHeading = useTransform(scrollYProgress, [0, 1], [0, -150])
  const yText = useTransform(scrollYProgress, [0, 1], [0, 120])
  const yArrow = useTransform(scrollYProgress, [0, 1], [0, -60])

  return (
    <div>
      {/* <Navbar /> */}
      <section
        ref={ref}
        className="p-8 max-w-2xl mx-auto animate-fadeInLeft a-content min-h-screen md:min-h-[180vh] flex flex-col justify-center"
      >
        <div className="flex items-center justify-between mb-16">
          <motion.h2
            style={{ y: yHeading }}
            className="text-2xl md:text-8xl font-bold mb-4 a-heading"
          >
            About Me
          </motion.h2>
          <motion.div className="line-arrow" style={{ y: yArrow }}>
            <Link href="/" >
              <button  className="arrow-l-button">
                {arrow}
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div style={{ y: yText }} className="space-y-6 text-lg leading-relaxed">
          <p>
            I am a visual artist comfortable with both paint and pencil,
            preferrably pencil, specializing in creating intricate compositions
            that combine both pencil and paint, with the occasional still life.
          </p>

          <p>
            I also have a background in web development, which facilitated the
            design and creation of this very website. Hope you enjoy my work and
            feel free to reach out and check out my other web projects
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
