import Navbar from '../components/Navbar'
import Link from 'next/link'


export default function About() {
  return (
    <div>
      <Navbar />
      <section className="p-8 max-w-2xl mx-auto animate-fadeInLeft a-content">
        <h2 className="text-2xl font-bold mb-4 a-heading">About Me</h2>
        <p>
          I am a visual artist comfortable with both paint and pencil, preferrably pencil, specializing in
          creating intricate compositions that combine both pencil and paint, with the occasional still life.
        </p>
        <br />
        <p>
          I also have a background in web development, which facilitated the design and creation of this very website.
          Hope you enjoy my work and feel free to reach out and check out my other web projects
        </p>

        <p>
          <Link href="https://portfolio-five-five.vercel.app/" className="a-link">Here</Link>
        </p>
      </section>
    </div>
  )
}
