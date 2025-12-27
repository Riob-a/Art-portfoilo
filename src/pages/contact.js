"use client"
import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa'
import ThreeDHeader from '../components/ThreeDHeader';
import { Svg } from '@react-three/drei'

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
    <div className=''>
      <section className=" p-7 mt-8 max-w-xl mx-auto my-auto h-screen">
        <div className='flex items-center justify-between mb-20'>
          {/* <h2 className="text-8xl font-bold mb-4 a-heading">Get in Touch</h2> */}
          <h2 className="text-8xl font-bold mb-4 a-heading">
            <div data-aos="fade-up" data-aos-delay="0">Get</div>
            <div data-aos="fade-up" data-aos-delay="150">in</div>
            <div data-aos="fade-up" data-aos-delay="300">Touch</div>
          </h2>
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
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <motion.input
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border contact-field p-2 inline-block w-full hover:text-[#007f8c] "
            required
          />
          <motion.input
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="border contact-field p-2 inline-block w-full hover:text-[#007f8c]"
            required
          />
          <motion.textarea
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="border contact-field p-2 inline-block w-full hover:text-[#007f8c]"
            rows="5"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            type="submit"
            className="gradient-text py-2 px-4"
          >
            Send Message
          </motion.button>
          <p className="text-sm text-gray-600 mt-2">{status}</p>
        </form>
      </section>

      {/* Contact Info */}
      <section
        className="contact h-[50vh] p-8 mt-18 mb-8 max-w-xl mx-auto my-auto text-center"
        data-aos="fade-in"
        data-aos-delay="200"
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
