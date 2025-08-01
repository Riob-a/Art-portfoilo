import { useRouter } from 'next/router';
// import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import artworks from '../../data/artworks';
import { FaLink, FaWindowClose } from "react-icons/fa";

export default function ArtworkDetail() {
    const router = useRouter();
    const { slug } = router.query;
    const [animationClass, setAnimationClass] = useState('animate-scaleIn');

    const artwork = typeof slug === 'string'
        ? artworks.find((a) => a.slug === slug)
        : null;

    if (!slug || !artwork) {
        return <div className="p-8">Loading...</div>;
    }

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

    if (!artwork) return <div className="p-8">Project not found or loading...</div>;


    return (
        <div className={`slug p-8 mt-8 mb-8 max-w-5xl mx-auto  ${animationClass}`}>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">/.{artwork.title}</h1>
                <button
                    className="text-red-500 text-4xl hover:text-red-700 transition duration-300 "
                    onClick={() => {
                        setAnimationClass('animate-scaleOut');
                        setTimeout(() => router.push('/gallery'), 200);
                    }}
                >
                    <FaWindowClose />
                </button>
            </div>

            <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                width={600}
                height={300}
                className="slug-image w-full mb-6"
            />
            <br />
            <section className='mb-8' data-aos="fade-in" data-aos-delay="200">
                <p className="text-lg ">
                    {artwork.description}
                </p>
                <br />

            </section>
        </div>
    );
}