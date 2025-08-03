import { useState, useEffect } from 'react';
import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaDownload } from 'react-icons/fa';


export default function ArtCard({ title, imageUrl, description, slug, aosDelay = 0 }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsClosing(true);
                setTimeout(() => {
                    setIsModalOpen(false);
                    setIsClosing(false);
                }, 300); // must match the fadeOut duration
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
        };
    }, [isModalOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300); // duration should match CSS fadeOut
    };


    return (
        <>
            {/* Art Card */}
            <motion.div
                whileHover={{ scale: 1.05, y: -10, x: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setIsModalOpen(true)}

            >
                <div
                    className="art-card rounded-lg overflow-hidden  cursor-pointer"
                    data-aos="fade-in" data-aos-delay={aosDelay}
                >
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={600}
                        height={300}
                        className="w-full image h-80 object-cover"
                    />
                </div>
            </motion.div>

            {/* Modal Fullscreen View */}
            {isModalOpen && (
                <div
                    className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'}`}
                    onClick={handleClose}
                >
                    <div
                        className="modal-content relative max-w-[50vw] w-full max-h-[90vh] overflow-auto  rounded-lg p-1 animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-6  text-3xl x-button"
                            onClick={handleClose}
                            aria-label="Close modal"
                        >
                            ✕
                        </button>

                        {/* Fullscreen Image */}
                        <div className="max-w-full max-h-full p-4 flex flex-col items-center">
                            <Image
                                src={imageUrl}
                                alt={title}
                                width={600}
                                height={300}
                                className="w-auto max-h-[70vh] object-contain rounded"
                            />
                            <h2 className="text-white text-2xl mt-4">{title}</h2>
                            {/* <p className="text-gray-300 mt-2">{description}</p> */}

                            {/* Buttons side by side */}
                            <div className="flex gap-4 mt-4">
                                <Link href={`/artworks/${slug}`}>
                                    <button className="m-button rounded-sm">More...</button>
                                </Link>
                                <a href={imageUrl} download className="m-button rounded-sm flex items-center gap-2">
                                    <FaDownload />
                                    Download
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
