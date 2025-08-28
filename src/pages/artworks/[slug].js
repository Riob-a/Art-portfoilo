import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import artworks from '../../data/artworks';
import { FaWindowClose, FaLink } from "react-icons/fa";

export default function ArtworkDetail() {
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
        <div className={`slug p-8 mt-8 mb-8 max-w-6xl mx-auto ${animationClass}`}>
            {/* Header with title + close */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold logo-3">/{artwork.title}</h1>
                <button
                    className="x-button text-3xl"
                    onClick={() => {
                        setAnimationClass('animate-scaleOut');
                        setTimeout(() => router.push('/gallery'), 200);
                    }}
                >
                     ✕
                </button>
            </div>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Left: Large Artwork Image */}
                <div className="w-full">
                    <Image
                        src={artwork.imageUrl}
                        alt={artwork.title}
                        width={800}
                        height={600}
                        className="slug-image rounded-lg shadow-md w-full object-cover"
                        data-aos="fade-in" data-aos-delay="1200"
                    />
                </div>

                {/* Right: Details */}
                <div className="flex flex-col justify-start">
                    <p className="text-lg text-gray-700 leading-relaxed mb-6"
                        data-aos="fade-in" data-aos-delay="600"
                    >
                        {artwork.description}
                    </p>

                    <div className="border-t border-gray-300 pt-4 mt-4 space-y-2 text-sm"
                        data-aos="fade-in" data-aos-delay="1000"
                    >
                        <p><span className="font-semibold">Category:</span> {artwork.category}</p>
                        <p><span className="font-semibold">Year:</span> {artwork.year}</p>
                    </div>

                    {/* CTA Links */}
                    <div className="flex gap-4 mt-6">
                        <a
                            href={artwork.imageUrl}
                            download
                            className="px-4 py-2 m-button text-sm rounded-lg flex items-center gap-1"
                        >
                            Download
                        </a>
                        <button
                            onClick={() => {
                                setAnimationClass('animate-scaleOut');
                                setTimeout(() => router.push('/gallery'), 200);
                            }}
                            className="px-4 py-2 m-button  text-sm rounded-lg  flex items-center gap-1"
                        >
                             Back to Gallery
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
