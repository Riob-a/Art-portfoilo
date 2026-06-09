import { useRef, useEffect } from 'react'
import styles from './MaintenanceBanner.module.css'

// FA exclamation-triangle path — inlined so createElement can use it
const ICON_SVG = `<svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" style="width:14px;height:14px;display:inline-block;vertical-align:middle;margin-right:8px;fill:#111111"><path d="M569.517 440.013C587.975 472.007 564.806 512 527.94 512H48.054c-36.937 0-59.999-40.055-41.577-71.987L246.423 23.985c18.467-32.009 64.72-31.951 83.154 0l239.94 416.028zM288 354c-25.405 0-46 20.595-46 46s20.595 46 46 46 46-20.595 46-46-20.595-46-46-46zm-43.673-165.346l7.418 136c.347 6.364 5.609 11.346 11.982 11.346h48.546c6.373 0 11.635-4.982 11.982-11.346l7.418-136c.375-6.874-5.098-12.654-11.982-12.654h-63.383c-6.884 0-12.356 5.78-11.981 12.654z"/></svg>`

function TapeStrip({ wrapClass, messages, reverse = false }) {
  const trackRef = useRef(null)
  const animRef = useRef(null)
  const posRef = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const addItem = (msg) => {
      const text = document.createElement('span')
      text.className = styles.tapeText
      text.innerHTML = `${ICON_SVG}${msg}`
      track.appendChild(text)

      const spacer = document.createElement('span')
      spacer.className = styles.tapeSpacer
      track.appendChild(spacer)
    }

    const fill = () => {
      while (track.scrollWidth < window.innerWidth * 3) {
        messages.forEach(addItem)
      }
    }

    fill()

    if (reverse) {
      posRef.current = -(track.scrollWidth / 2)
      track.style.transform = `translateX(${posRef.current}px)`
    }

    const speed = 0.6

    const tick = () => {
      const firstChild = track.firstElementChild

      if (reverse) {
        posRef.current += speed
        if (firstChild && posRef.current > 0) {
          posRef.current -= firstChild.offsetWidth
          track.appendChild(firstChild)
        }
      } else {
        posRef.current -= speed
        if (firstChild && Math.abs(posRef.current) >= firstChild.offsetWidth) {
          posRef.current += firstChild.offsetWidth
          track.appendChild(firstChild)
        }
      }

      track.style.transform = `translateX(${posRef.current}px)`
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animRef.current)
  }, [messages, reverse])

  return (
    <div className={wrapClass}>
      <div ref={trackRef} style={{ display: 'flex', whiteSpace: 'nowrap', willChange: 'transform' }} />
    </div>
  )
}

export default function MaintenanceBanner({
  messages = ['UNDER MAINTENANCE', 'DO NOT ENTER'],
  diagonal = false,
}) {
  if (diagonal) {
    return (
      <div
        data-aos="fade-in"
        data-aos-delay="200"
        aria-label="Under maintenance"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'all',
          zIndex: 50,
          overflow: 'hidden',
          background: 'rgba(0, 0, 0, 0.65)',
        }}
      >
        <TapeStrip wrapClass={styles.tapeWrapDiagonal}        messages={messages} />
        <TapeStrip wrapClass={styles.tapeWrapDiagonalReverse}  messages={messages} reverse />
      </div>
    )
  }

  return <TapeStrip wrapClass={styles.tapeWrap} messages={messages} />
}