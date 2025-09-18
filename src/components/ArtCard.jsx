import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function ArtCard({ title, imageUrl, description, slug, aosDelay = 0 }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isModalOpen]);

    // 🔹 Escape key closes modal
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') handleClose();
        };
        if (isModalOpen) document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [isModalOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsModalOpen(false);
            setIsClosing(false);
        }, 300); // must match the fadeOut duration
    };

    return (
        <>
            {/*  Card */}
            <motion.div
                // whileHover={{ scale: 1.05, y: -10, x: 0 }}
                // transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                onClick={() => setIsModalOpen(true)}
                className="relative break-inside-avoid rounded-xl mt-15  p-1.5 bg-black/20  //"
            >    
                <div
                    data-aos="fade-in" data-aos-delay={aosDelay}
                >
                    <div
                        className="art-card rounded-xl overflow-hidden flex items-center justify-center cursor-pointer"
                    >
                        <Image
                            loading="lazy"
                            src={imageUrl}
                            alt={title}
                            width={600}
                            height={300}
                            className="image mx-auto object-cover object-center"
                            // sizes="(max-width: 768px) 100vw, 33vw"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Modal (via portal) */}
            {isModalOpen &&
                createPortal(
                    <div
                        className={`modal fixed inset-0 z-50 flex items-center justify-center ${isClosing ? 'animate-fadeOut' : 'animate-fadeIn'
                            }`}
                        onClick={handleClose}
                    >
                        <div
                            className="relative max-w-[50vw] w-full max-h-[90vh] overflow-auto rounded-lg p-1 animate-scaleIn "
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-6 text-3xl x-button"
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
                                <h2 className="modal-text-2 text-white text-2xl mt-4">{title}</h2>

                                {/* Buttons side by side */}
                                <div className="flex gap-4 mt-2">
                                    <Link href={`/artworks/${slug}`}>
                                        <button className="m-button rounded-sm">More...</button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
