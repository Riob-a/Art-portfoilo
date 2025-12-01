"use client"
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa'
import ThreeDHeader from '../components/ThreeDHeader';

export default function Contact() {
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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [status, setStatus] = useState('')
  const [canRender3D, setCanRender3D] = useState(false)

  // Detect device capability (simple GPU & width check)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
      if (gl && window.innerWidth > 768) {
        setCanRender3D(true)
      }
    } catch {
      setCanRender3D(false)
    }
  }, [])

  // Track scroll position for motion heading
  const { scrollY } = useScroll()
  const ySlow = useTransform(scrollY, [0, 500], [0, 50])
  const yMedium = useTransform(scrollY, [0, 500], [0, 100])
  const yFast = useTransform(scrollY, [0, 500], [0, 150])

  // Update form state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submit form data to Flask backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const res = await fetch(
        'https://art-portfoilo-backend-production.up.railway.app/api/contact',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      )

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('Message sent successfully!')
        setFormData({ name: '', email: '', message: '' }) // Clear form
      } else {
        setStatus(data.error || 'Something went wrong.')
      }
    } catch (error) {
      setStatus('Failed to send. Server might be down.')
    }
  }

  return (
    <div className='animate-fadeInLeft'>
      <section className="p-8 max-w-2xl mx-auto a-content min-h-screen md:min-h-[180vh] flex flex-col justify-center">
        <div className="flex items-center justify-between mb-18 ">
          {/*Conditional heading: 3D for capable devices, 2D for others */}
          {canRender3D ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}>
              <ThreeDHeader heading="Get in Touch" />
            </motion.div>
          ) : (
            <div className="flex flex-col gap-2 ">
              <motion.h2
                style={{ y: ySlow }}
                className="text-2xl md:text-8xl font-bold a-heading"
              >
                Get
              </motion.h2>
              <motion.h2
                style={{ y: yMedium }}
                className="text-2xl md:text-8xl font-bold a-heading"
              >
                in
              </motion.h2>
              <motion.h2
                style={{ y: yFast }}
                className="text-2xl md:text-8xl font-bold a-heading"
              >
                Touch
              </motion.h2>
            </div>
          )}

          <motion.div
            className='line-arrow'
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
            whileTap={{ scale: 0.6 }}
          >
            <Link href="/">
              <button className="arrow-l-button">{arrow}</button>
            </Link>
          </motion.div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col form space-y-6  mt-5 a-content">
          <motion.input
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="form-input border p-2 "
            required
          />
          <motion.input
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="form-input border p-2 "
            required
          />
          <motion.textarea
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="form-input border p-2 "
            rows="5"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="submit"
            className="form-input gradient-text py-2 px-4 "
          >
            Send Message
          </motion.button>
          <p className="text-sm text-gray-600 mt-2">{status}</p>
        </form>
      </section>

      {/* Contact Info */}
      <section
        className="contact h-[80vh] p-8 mt-8 mb-8 max-w-xl mx-auto text-center"
        data-aos="fade-in"
        data-aos-delay="400"
      >
        <h2 className="text-2xl font-bold mb-4 a-heading">
          Contact Information
        </h2>
        <p className="flex flex-wrap items-center gap-4 justify-center a-content">
          <motion.a
            href="mailto: riobad74@gmail.com"
            className="p-link flex items-center gap-1 text-sm"
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaGoogle size={14} /> riobad74@gmail.com
          </motion.a>
          <span>|</span>
          <motion.a
            href="https://github.com/Riob-a"
            title="Github"
            className="p-link flex items-center gap-1 text-sm"
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaGithub size={14} /> Riob-a
          </motion.a>
          <span>|</span>
          <motion.a
            href="https://www.linkedin.com/in/derrick-r-ongwae-1530142bb/"
            title="LinkedIn"
            className="p-link flex items-center gap-1 text-sm"
            whileHover={{ scale: 1.05, color: '#007f8c' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaLinkedin size={14} /> Derrick Ongwae
          </motion.a>
        </p>
      </section>
    </div>
  )
}
