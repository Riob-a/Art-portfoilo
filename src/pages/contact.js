import { useState } from 'react'
import Navbar from '../components/Navbar'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const [status, setStatus] = useState('')

  // Update form state as user types
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Submit form data to Flask backend
  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('Sending...')

    try {
      const res = await fetch('http://art-portfoilo-backend-production.up.railway.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

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
    <div>
      <Navbar />
      <section className="p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 animate-fadeInLeft">Get in Touch</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border p-2 animate-fadeInLeftDelay delay-1"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="border p-2 animate-fadeInLeftDelay delay-2"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="border p-2 animate-fadeInLeftDelay delay-3"
            rows="5"
            required
          />
          <button
            type="submit"
            className="gradient-text py-2 px-4 animate-fadeInLeftDelay delay-4"
          >
            Send Message
          </button>
          <p className="text-sm text-gray-600 mt-2">{status}</p>
        </form>
      </section>
    </div>
  )
}
