import Link from 'next/link'
import Image from 'next/image';
import { usePathname } from 'next/navigation'; 

export default function Navbar() {
  const pathname = usePathname();

  const linkClasses = (path) =>
    `link ${pathname === path ? 'active-link': ''}`;


  return (
    <nav className="navbar shadow-md p-4 flex justify-between items-center">
      <p className="logo text-l font-bold flex items-center gap-2" data-aos="fade-in" data-aos-delay=''>
        <Image
          alt="logo"
          src="/globe-2.svg"
          // src="/globe-1-ln.svg"
          width={30}
          height={30}
          className="logo-pic inline-block"
          data-aos="zoomIn" data-aos-delay='200'
        />
        The Portfolio
        {/* D3RRICK */}
      </p>
      <div className="space-x-5 flex items-center">
        <Link className={linkClasses('/')} data-aos="fade-in" data-aos-delay='200' href="/">Home</Link>
        <Link className={linkClasses('/gallery')} data-aos="fade-in" data-aos-delay='400' href="/gallery">Gallery</Link>
        <Link className={linkClasses('/about')} data-aos="fade-in" data-aos-delay='600' href="/about">About</Link>
        <Link className={linkClasses('/contact')} data-aos="fade-in" data-aos-delay='800' href="/contact">Contact</Link>
      </div>
    </nav>
  )
}
