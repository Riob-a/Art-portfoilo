import { useState, useEffect } from 'react';
import { useRef } from 'react';
import Image from 'next/image';

export default function ArtCard({ title, imageUrl, description, aosDelay = 0 }) {
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
            <div
                className="art-card rounde overflow-hidden  cursor-pointer"
                onClick={() => setIsModalOpen(true)}

            >
                <div data-aos="fade-up" data-aos-delay={aosDelay}>
                    <Image
                        src={imageUrl}
                        alt={title}
                        width={400}
                        height={300}
                        className="w-full image  object-cover"
                    />
                    <div className="p-4">
                        <h2 className="text-xl font-bold mb-2">{title}</h2>
                        <p className="desc text-sm">{description}</p>
                    </div>
                </div>
            </div>

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
                            className="absolute top-4 right-6 text-white text-3xl hover:text-red-400 z-10"
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
                                width={1200}
                                height={800}
                                className="w-auto max-h-[70vh] object-contain rounded"
                            />
                            <h2 className="text-white text-2xl mt-4">{title}</h2>
                            <p className="text-gray-300 mt-2">{description}</p>

                            {/* Download Button */}
                            <a
                                href={imageUrl}
                                download
                                className="mt-4 bg-white  text-black px-5 py-2 rounded hover:bg-gray-500 transition hover:text-white"
                            >
                                <Image
                                          alt="logo"
                                          src="/file.svg"
                                          // src="/globe-1-ln.svg"
                                          width={20}
                                          height={20}
                                          className="m-1 inline-block"
                                        />
                                Download Artwork
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
