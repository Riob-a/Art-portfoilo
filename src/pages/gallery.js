import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
import ThreeDGallery from "../components/ThreeDGallery";

// import Image from 'next/image'

export default function Gallery() {
  return (
    <div>
      {/* <Navbar /> */}
      {/* <div className="logo-3 border-t border-black border-b border-black marquee mt-0.6 relative z-0" role="marquee" aria-label="art projects scrolling" data-aos="fade-in" data-aos-delay="2000s">
        <ul className="marquee__content">
          {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
        </ul>
        <ul className="marquee__content" aria-hidden="true">
          {Array(20).fill("art •").map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div> */}

      {/* <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6"> */}
      {/* <div className="p-4 columns-1 sm:columns-2 md:columns-4 gap-4 [column-fill:_balance]">
        {artworks.map((art, i) => (
          <ArtCard
            key={i}
            title={art.title}
            imageUrl={art.imageUrl}
            description={art.description}
            slug={art.slug}
            aosDelay={i * 250}
          />
        ))}
      </div> */}
      <div className=""> <ThreeDGallery artworks={artworks} /></div>

    </div>
  );
}

