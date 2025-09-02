import { useState } from 'react'
import Navbar from '../components/Navbar'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedin, FaGoogle } from 'react-icons/fa'

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

  // Track scroll position
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
      {/* <Navbar /> */}
      <section className="p-8 max-w-xl mx-auto a-content min-h-screen md:min-h-[180vh] | flex flex-col justify-center">
        <div className="flex items-center justify-between mb-4 ">
          <div className="flex flex-col gap-2">
            <motion.h2
              style={{ y: ySlow }}
              className="text-2xl md:text-8xl font-bold a-heading "
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
          <Link href="/" className="line-arrow">
            <button className="arrow-l-button">{arrow}</button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col form space-y-6">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="form-input border p-2 animate-fadeInLeftDelay delay-1"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="form-input border p-2 animate-fadeInLeftDelay delay-2"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="form-input border p-2 animate-fadeInLeftDelay delay-3"
            rows="5"
            required
          />
          <button
            type="submit"
            className="form-input gradient-text py-2 px-4 animate-fadeInLeftDelay delay-4"
          >
            Send Message
          </button>
          <p className="text-sm text-gray-600 mt-2">{status}</p>
        </form>
      </section>

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
            whileHover={{ scale: 1.05, color: '#ff7e5f' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaGoogle size={14} /> riobad74@gmail.com
          </motion.a>
          <span>|</span>
          <motion.a
            href="https://github.com/Riob-a"
            title="Github"
            className="p-link flex items-center gap-1 text-sm"
            whileHover={{ scale: 1.05, color: '#ff7e5f' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaGithub size={14} /> Riob-a
          </motion.a>
          <span>|</span>
          <motion.a
            href="https://www.linkedin.com/in/derrick-r-ongwae-1530142bb/"
            title="LinkedIn"
            className="p-link flex items-center gap-1 text-sm"
            whileHover={{ scale: 1.05, color: '#ff7e5f' }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FaLinkedin size={14} /> Derrick Ongwae
          </motion.a>
        </p>
      </section>

      {/* Spacer so scrolling/parallax is visible */}
      {/* <section className="h-[80vh] flex items-center justify-center text-gray-500">
        <p>Scroll ↑ to see the parallax effect</p>
      </section> */}
    </div>
  )
}
