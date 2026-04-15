import '../globals.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import Footer from '../components/Footer'
import GalleryOverlay from '@/components/NameOverlay';
import TransitionOverlay from '../components/TransitionOverlay';
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router'; 

export default function App({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-in-out',
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/eruda';
      script.onload = () => window.eruda.init();
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="app-layout min-h-screen flex flex-col">

      <main className="content grow">
        <AnimatePresence mode="wait">
          <TransitionOverlay key={router.route} />
          <Component {...pageProps} />
        </AnimatePresence>
        <GalleryOverlay />
      </main>
      <Footer />
    </div>
  )

}
