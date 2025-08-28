import Navbar from '../components/Navbar'
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'

export default function Home() {
  return (
    <div>
      <Navbar />
      <section>
        <header className="header relative text-center" data-aos="fade-in" data-aos-delay="">
          <h1 className="text" data-aos="fade-in" data-aos-delay="2000">[Portfolio]</h1>

          <div className="globe-container">
            <svg
              viewBox="-2 -15 150 150"
              className="svg-text-arc "
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <path
                  id="text-circle"
                  d="M 1,55 A 40,40 0 0,1 90,50"
                  fill="none"
                />
              </defs>
              <text dy="-30" textLength="170">
                <textPath href="#text-circle" startOffset="50%" textAnchor="middle" data-aos="fade-in" data-aos-delay="">
                  D.R.O
                </textPath>
              </text>
            </svg>
            <Image
              alt="logo"
              src="/globe-2.svg"
              className="globe-icon"
              height={30}
              width={30}
            />
          </div>

        </header>
      </section>

      <section className="p-8 mb-4">
        <div className="main-index flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 rounded-lg" data-aos="fade-in">
          <div>
            <h1 className="text-2xl font-bold mb-1" data-aos="fade-up">
              <b className="logo-2">The Portfolio.</b>
            </h1>
            <p className="text-base" data-aos="fade-up" data-aos-delay="200">
              Feel free to explore my collection of visual art
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <Link
              href="/gallery"
              className="g-link inline-block px-6 py-2 rounded-md"
              data-aos="fade-right"
              data-aos-delay="400"
            >
              [ View Gallery ]
            </Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}
