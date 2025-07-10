"use client";

import { useEffect, useRef } from "react";
import "./components.css";

export default function WavyText({ text = "Variable" }) {
  const textRef = useRef(null);

  useEffect(() => {
    const element = textRef.current;
    const letters = text.split("");

    element.innerHTML = ""; // Clear original

    letters.forEach((char, i) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.animationDelay = `${i * 0.1}s`;
      element.appendChild(span);
    });
  }, [text]);

  return <p className="wavy-text" ref={textRef}></p>;
}
