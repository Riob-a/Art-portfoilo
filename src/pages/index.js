import Navbar from '../components/Navbar'
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion'

export default function Home() {
  const svg =
    // <svg xmlns="http://www.w3.org/2000/svg"
    //   width="30" height="30"
    //   viewBox="0 0 24 24"
    //   className='svg inline-block'
    //   // fill="currentColor"
    //   >
    //   <path d="M7 17l8-8v5h2V5h-9v2h5l-8 8z" />
    // </svg>
    <svg xmlns="http://www.w3.org/2000/svg"
      width="30" height="30"
      viewBox="0 0 24 24"
      className='svg inline-block'
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round">
      <path d="M7 17L17 7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>


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

      <section className="px-4 py-8 mb-4">
        <div
          className="grid grid-cols-1 md:grid-cols-12 gap-4 main-inde rounded-lg"
          data-aos="fade-in"
        >
          {/* Left Column (Heading) */}
          <div className="md:col-span-6 main-inde rounded-lg">
            <h1
              className="logo-3 text-2xl md:text-5xl font-bold leading-tight mb-6"
              data-aos="fade-up"
            >
              Where Ideas <br /> Become Reality.
            </h1>
          </div>

          {/* Right Column (Details + Text + Link) */}
          <div className="md:col-span-6 flex flex-col gap-6 mb-5">
            {/* Project Details */}
            <div className="border- border-gray-300 pt-4" data-aos="fade-in" data-aos-delay="200">
              <h2 className="text-sm uppercase tracking-wide font-semibold mb-2">
                Details
              </h2>
              <div className="border-t border-gray-300 text-sm grid grid-cols-3 gap-y-4">
                <span className="font-medium">Category</span>
                <span className="col-span-2">Art gallery</span>

                <span className="font-medium border-t border-gray-300">Services</span>
                <span className="col-span-2 border-t border-gray-300">
                  Art Direction <br />
                  Web Design <br />
                  Visual Design
                </span>

                <span className="font-medium border-t border-gray-300  border-b border-gray-300">Year</span>
                <span className="col-span-2 border-t border-gray-300  border-b border-gray-300">2024 - Present</span>
              </div>
            </div>
            <br />
            {/* Description */}
            <p className="text-base leading-relaxed text-gray-300" data-aos="fade-up" data-aos-delay="200">
              This website showcases a modern  <span className="font-semibold">art gallery</span>
              that brings together creativity and technology, offering a seamless experience .
              Learn about the creative process,
              and connect with my vision.

            </p>
            <motion.div
              className="text-1xl"
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              <Link
                href="/gallery"
                className="g-link inline-block rounded-md"
                data-aos="fade-right"
                data-aos-delay="400"
              >
                [ View Gallery {svg}]
              </Link>
            </motion.div>

          </div>
        </div>
      </section>


    </div>
  )
}
