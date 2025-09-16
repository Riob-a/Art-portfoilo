import '../globals.css'
import 'aos/dist/aos.css';
import AOS from 'aos';
import { useEffect } from 'react';
import Footer from '../components/Footer'
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

  return (
    <div className="app-layout min-h-screen flex flex-col">

      <main className="content flex-grow">
        <AnimatePresence mode="wait">
          <TransitionOverlay key={router.route} />
          <Component {...pageProps} />
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  )

}
