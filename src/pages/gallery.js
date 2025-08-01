import Navbar from '../components/Navbar'
import ArtCard from '../components/ArtCard';
import artworks from '../data/artworks'
// import Image from 'next/image'

export default function Gallery() {
  return (
    <div>
      <Navbar />
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}

