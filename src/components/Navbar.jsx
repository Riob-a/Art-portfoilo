import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = (event) => {
    event.preventDefault()
    setExpanded((prevExpanded) => !prevExpanded)
  }

  const linkClasses = (path) =>
    `link ${pathname === path ? 'active-link' : ''}`

  return (
    <div className="nav-wrapper">
      <nav
        className={`navbar w-full z-50 p-2 flex items-center rounded-lg ${expanded ? 'expanded' : 'collapsed'}`}
      >
        {/* Left Links */}
        <div className="links left flex space-x-3 justify-start w-1/3">
          <Link className={linkClasses('/about')} href="/about">
            About
          </Link>
        </div>

        {/* Logo in the Center */}
        <div className="w-1/3 flex justify-center items-center">
          <button
            onClick={toggleExpanded}
            className="logo text-l font-bold flex items-center justify-center p-1"
          >
            <Image
              alt="logo"
              src="/globe-2.svg"
              width={35}
              height={35}
              className="logo-pic"
            />
          </button>
        </div>

        {/* Right Links */}
        <div className="links right flex space-x-3 justify-end w-1/3">
          <Link className={linkClasses('/contact')} href="/contact">
            Contact
          </Link>
        </div>
      </nav>
    </div>
  )
}
