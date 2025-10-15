import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import artworks from '../../data/artworks';
import { FaDownload } from "react-icons/fa";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ArtworkDetail() {
    const svg =
        <svg xmlns="http://www.w3.org/2000/svg"
            width="30" height="30"
            viewBox="0 0 24 24"
            className='svg-1 inline-block'
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M7 17L17 7" />
            <polyline points="7 7 17 7 17 17" />
        </svg>;

    const router = useRouter();
    const { slug } = router.query;
    const [animationClass, setAnimationClass] = useState('animate-scaleIn');

    const artwork = typeof slug === 'string'
        ? artworks.find((a) => a.slug === slug)
        : null;

    useEffect(() => {
        setAnimationClass('animate-scaleIn');

        const handleRouteChangeStart = () => {
            setAnimationClass('animate-scaleOut');
        };

        router.events.on('routeChangeStart', handleRouteChangeStart);
        return () => {
            router.events.off('routeChangeStart', handleRouteChangeStart);
        };
    }, [router]);


    if (!slug || !artwork) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div>
            <div className="flex float-end mb-1">
                {/* <h1 className="text-3xl font-bold modal-heading">/. {artwork.title}</h1> */}
            </div>
            <div className={`slug p-1 mt-5 mb-8 max-w-6xl mx-auto rounded-xl ${animationClass}`}>
                {/* Header with title + close */}
                <div className="relative w-full h-[80vh] md:h-[80vh] overflow-hidden rounded-2xl shadow-xl">
                    <button
                        className="x-button text-3xl z-100 absolute"
                        onClick={() => {
                            setAnimationClass('animate-scaleOut');
                            setTimeout(() => router.push('/gallery'), 200);
                        }}
                    >
                        {svg}
                    </button>
                    {/* Background Image */}
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        fill
                        className="object-cover object-center"
                        data-aos="fade-in"
                        data-aos-delay="1200"
                    />

                    {/* Right: Details with Parallax */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="absolute left-160 top-0 h-[70vh] w-full md:w-[40%] flex flex-col justify-center p-8 main-index | sticky top-8  rounded-xl "
                    >
                        <h1 className="text-3xl font-bold modal-heading">/. {artwork.title}</h1><br />
                        <p className="modal-text-1 text-sm text-gray-700 leading-relaxed mb-6"
                            data-aos="fade-in" data-aos-delay="600"
                        >
                            {artwork.description}
                        </p>

                        <div className="border-t border-gray-300 pt-4 mt-4 space-y-2 text-sm"
                            data-aos="fade-in" data-aos-delay="1000"
                        >
                            <p><span className="font-semibold modal-text-2">Category: </span> <span className="modal-text-1">{artwork.category}</span></p>
                            <p><span className="font-semibold modal-text-2">Year: </span> <span className="modal-text-1">{artwork.year}</span></p>
                        </div>

                        {/* CTA Links */}
                        <div className="flex gap-4 mt-6">
                            <a
                                href={artwork.imageUrl}
                                download
                                className="px-1 py-2 m-button text-lg rounded-lg flex items-center gap-1"
                            >
                                <FaDownload /> Download
                            </a>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
