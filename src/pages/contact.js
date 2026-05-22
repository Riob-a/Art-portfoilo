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
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
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

  const inputStyle = {
    fontFamily: "Unbounded, sans-serif",
    fontSize: "0.6rem",
    fontWeight: 600,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    background: "var(--theme-navbar, #ffffff)",
    border: "2px solid var(--theme-navbar-text, #111111)",
    boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
    borderRadius: "0",
    padding: "12px 16px",
    width: "100%",
    outline: "none",
    color: "var(--theme-navbar-text, #111111)",
    transition: "box-shadow 0.15s ease, transform 0.15s ease",
  };

  return (
    <div style={{ fontFamily: "Unbounded, sans-serif" }}>

      {/* ── FORM SECTION ── */}
      <section style={{ padding: "2.5rem", minHeight: "100vh", position: "relative" }}>

        {/* CORNER BRACKETS */}
        {/* {["top-0 left-0 border-t-2 border-l-2", "top-0 right-0 border-t-2 border-r-2",
          "bottom-0 left-0 border-b-2 border-l-2", "bottom-0 right-0 border-b-2 border-r-2"].map((cls, i) => (
            <div key={i} className={`absolute w-8 h-8 border-black/70 pointer-events-none ${cls}`} />
          ))} */}

        {/* HEADER ROW */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "3rem" }}>
          <div>
            {["GET", "IN", "TOUCH"].map((word, i) => (
              <div
                key={word}
                data-aos="fade-right"
                data-aos-duration="800"
                data-aos-delay={i * 400}
                style={{
                  fontFamily: "Unbounded, sans-serif",
                  fontWeight: 900,
                  fontSize: "clamp(3rem, 8vw, 6rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.02em",
                  color: "var(--theme-navbar-text, #111111)",
                  textTransform: "uppercase",
                }}
              >
                {word}
              </div>
            ))}

            {/* DECORATIVE RULE */}
            <div style={{
              marginTop: "1rem",
              width: "120px",
              height: "4px",
              background: "#EF9F27",
              boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
            }} />
          </div>

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

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          data-aos="fade-in"
          data-aos-delay="1000"
          style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "100%" }}
        >
          {/* LABEL + INPUT pairs */}
          {[
            { name: "name", placeholder: "YOUR NAME", type: "text" },
            { name: "email", placeholder: "YOUR EMAIL", type: "email" },
          ].map(({ name, placeholder, type }) => (
            <div key={name} style={{ position: "relative" }}>
              <div style={{
                fontFamily: "Unbounded, sans-serif",
                fontSize: "0.45rem",
                fontWeight: 800,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--theme-navbar-text, #111111)",
                marginBottom: "4px",
                paddingLeft: "2px",
              }}>
                {placeholder}
              </div>
              <motion.input
                whileFocus={{ boxShadow: "5px 5px 0 #EF9F27", border: "2px solid #EF9F27" }}
                name={name}
                type={type}
                value={formData[name]}
                onChange={handleChange}
                placeholder={placeholder}
                style={inputStyle}
                required
              />
            </div>
          ))}

          <div style={{ position: "relative" }}>
            <div style={{
              fontFamily: "Unbounded, sans-serif",
              fontSize: "0.45rem",
              fontWeight: 800,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--theme-navbar-text, #111111)",
              marginBottom: "4px",
              paddingLeft: "2px",
            }}>
              YOUR MESSAGE
            </div>
            <motion.textarea
              whileFocus={{ boxShadow: "5px 5px 0 #EF9F27", border: "2px solid #EF9F27"  }}
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="YOUR MESSAGE"
              rows={5}
              style={{ ...inputStyle, resize: "none" }}
              required
            />
          </div>

          <motion.button
            whileTap={{ scale: 0.97, x: 2, y: 2 }}
            whileHover={{ boxShadow: "1px 1px 0 #111111", x: 2, y: 2 }}
            type="submit"
            style={{
              fontFamily: "Unbounded, sans-serif",
              fontWeight: 900,
              fontSize: "0.6rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              background: "#EF9F27",
              border: "2px solid var(--theme-navbar-text, #111111)",
              boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
              padding: "14px 28px",
              cursor: "pointer",
              color: "var(--theme-navbar-text, #111111)",
              alignSelf: "flex-start",
              transition: "box-shadow 0.15s ease",
            }}
          >
            Send Message →
          </motion.button>

          {status && (
            <div style={{
              fontFamily: "Unbounded, sans-serif",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              padding: "8px 14px",
              border: "2px solid var(--theme-navbar-text, #111111)",
              boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
              background: status.includes("success") ? "#EF9F27" : "#ffffff",
              color: "var(--theme-navbar-text, #111111)",
              display: "inline-block",
            }}>
              {status}
            </div>
          )}
        </form>
      </section>

      {/* ── CONTACT INFO SECTION ── */}
      <section
        data-aos="fade-in"
        data-aos-delay="200"
        style={{
          padding: "3rem 2.5rem",
          // borderTop: "2px solid #111111",
          position: "relative",
        }}
      >
        <div style={{
          display: "inline-block",
          marginBottom: "1.5rem",
        }}>
          <div style={{
            fontFamily: "Unbounded, sans-serif",
            fontWeight: 900,
            fontSize: "0.55rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--theme-navbar-text, #111111)",
            background: "#EF9F27",
            border: "2px solid var(--theme-navbar-text, #111111)",
            boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
            padding: "4px 12px",
            display: "inline-block",
          }}>
            Contact Information
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
          {[
            { href: "mailto:riobad74@gmail.com", icon: <FaGoogle size={12} />, label: "riobad74@gmail.com" },
            { href: "https://github.com/Riob-a", icon: <FaGithub size={12} />, label: "Riob-a" },
            { href: "https://www.linkedin.com/in/derrick-r-ongwae-1530142bb/", icon: <FaLinkedin size={12} />, label: "Derrick Ongwae" },
          ].map(({ href, icon, label }, i) => (
            <motion.a
              key={i}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ x: 2, y: 2, boxShadow: "1px 1px 0 #111111" }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontFamily: "Unbounded, sans-serif",
                fontWeight: 700,
                fontSize: "0.5rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--theme-navbar-text, #111111",
                textDecoration: "none",
                background: "var(--theme-navbar, #ffffff)",
                border: "2px solid var(--theme-navbar-text, #111111)",
                boxShadow: "3px 3px 0 var(--theme-navbar-text, #111111)",
                padding: "6px 12px",
                transition: "box-shadow 0.15s ease",
              }}
            >
              {icon} {label}
            </motion.a>
          ))}
        </div>
      </section>

    </div>
  );
}