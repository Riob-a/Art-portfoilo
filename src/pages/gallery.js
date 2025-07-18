import Navbar from '../components/Navbar'
import Footer from '../components/Footer';
import ArtCard from '../components/ArtCard';
// import Image from 'next/image'



const artworks = [
  // { title: "Skull-Sketch", imageUrl: "/images/Skull-sketch.jpg", description: "A retro-themed digital painting." },
  { title: "skull", imageUrl: "/images/Skull.jpg", description: "A retro-themed digital painting." },
  { title: "mosaic", imageUrl: "/images/Mosaic-skull.jpg", description: "Graffiti meets nature." },
  { title: "Colored-skull", imageUrl: "/images/Colored-skull.jpg", description: "Graffiti meets nature." },
  // { title: "circle", imageUrl: "/images/circle.jpg", description: "Graffiti meets nature." },
  // { title: "good", imageUrl: "/images/good.jpg", description: "Graffiti meets nature." },
  // { title: "peace", imageUrl: "/images/peace.jpg", description: "Graffiti meets nature." },
  // { title: "Robot", imageUrl: "/images/robots.jpg", description: "Graffiti meets nature." },
  // { title: "3-0", imageUrl: "/images/3-0.jpg", description: "Graffiti meets nature." },
  // { title: "triumph", imageUrl: "/images/triumph.jpg", description: "Graffiti meets nature." },
  // { title: "ls-400", imageUrl: "/images/ls-400.jpg", description: "Graffiti meets nature." },
  { title: "still-life", imageUrl: "/images/still life.jpg", description: "Graffiti meets nature." },
  // { title: "house", imageUrl: "/images/house.jpg", description: "Graffiti meets nature." },
];

export default function Gallery() {
  return (
    <div>
      <Navbar />
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {artworks.map((art, i) => (
          <ArtCard
            key={i}
            title={art.title}
            imageUrl={art.imageUrl}
            description={art.description}
            aosDelay={i * 250}
          />
        ))}
      </div>
    </div>
  );
}

