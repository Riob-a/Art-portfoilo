import Navbar from '../components/Navbar'
import Footer from '../components/Footer';


export default function Contact() {
  return (
    <div>
      <Navbar />
      <section className="p-8 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 animate-fadeInLeft">Get in Touch</h2>
        <form className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            className="border p-2 animate-fadeInLeftDelay delay-1"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border p-2 animate-fadeInLeftDelay delay-2"
          />
          <textarea
            placeholder="Your Message"
            className="border p-2 animate-fadeInLeftDelay delay-3"
            rows="5"
          />
          <button
            className="gradient-text py-2 px-4 animate-fadeInLeftDelay delay-4"
          >
            Send Message
          </button>
        </form>
      </section>
    </div>
  )
}
