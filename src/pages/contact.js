"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaGoogle } from "react-icons/fa";

const ArrowIcon = () => (
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
);

const hoverSpring = {
  whileHover: { scale: 1.05 },
  transition: { type: "spring", stiffness: 300, damping: 20 },
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch(
        "https://art-portfoilo-backend-production.up.railway.app/api/contact",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus(data.error || "Something went wrong.");
      }
    } catch {
      setStatus("Failed to send. Server might be down.");
    }
  };

  return (
    <div>
      {/* Contact Form */}
      <section className="p-7 h-screen">
        <div className="flex items-center justify-between mb-20">
          <h2 className="text-8xl font-bold a-heading">
            <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="0">Get</div>
            <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="400">in</div>
            <div data-aos="fade-right" data-aos-duration="500" data-aos-delay="800">Touch</div>
          </h2>

          <motion.div
            className="line-arrow"
            whileTap={{ scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
          >
            <Link href="/">
              <button className="arrow-l-button">
                <ArrowIcon />
              </button>
            </Link>
          </motion.div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-3">
          <motion.input
            {...hoverSpring}
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="border contact-field p-2"
            required
          />

          <motion.input
            {...hoverSpring}
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="border contact-field p-2"
            required
          />

          <motion.textarea
            {...hoverSpring}
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            className="border contact-field p-2"
            rows={5}
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95, y: 2 }}
            transition={hoverSpring.transition}
            className="gradient-text py-2 px-4"
            type="submit"
          >
            Send Message
          </motion.button>

          <p className="text-sm text-gray-600">{status}</p>
        </form>
      </section>

      {/* Contact Info */}
      <section className="contact  h-[50vh] p-8 max-w-xl mx-auto text-center md: mt-50">
        <h2 className="text-2xl font-bold mb-4 a-heading">
          Contact Information
        </h2>

        <p className="flex flex-wrap items-center gap-4 justify-center a-content">
          <ContactLink
            href="mailto:riobad74@gmail.com"
            icon={<FaGoogle size={14} />}
            label="riobad74@gmail.com"
          />
          <span>|</span>
          <ContactLink
            href="https://github.com/Riob-a"
            icon={<FaGithub size={14} />}
            label="Riob-a"
          />
          <span>|</span>
          <ContactLink
            href="https://www.linkedin.com/in/derrick-r-ongwae-1530142bb/"
            icon={<FaLinkedin size={14} />}
            label="Derrick Ongwae"
          />
        </p>
      </section>
    </div>
  );
}

const ContactLink = ({ href, icon, label }) => (
  <motion.a
    href={href}
    className="p-link flex items-center gap-1 text-sm"
    whileHover={{ scale: 1.05, color: "#007f8c" }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    {icon} {label}
  </motion.a>
);
