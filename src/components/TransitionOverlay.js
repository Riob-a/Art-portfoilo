// import { motion } from "framer-motion";
// import Image from "next/image";

// const circleVariants = {
//     initial: { clipPath: "circle(0% at 50% 50%)" },
//     animate: { clipPath: "circle(0% at 50% 50%)" },
//     exit: { clipPath: "circle(150% at 50% 50%)" },
// };

// const contentVariants = {
//     initial: { opacity: 0, scale: 0.8 },
//     animate: { opacity: 0, scale: 0.8 },
//     exit: { opacity: 1, scale: 1 },
// };

// // Separate variant so text can stagger in slightly after the image
// const textVariants = {
//     initial: { opacity: 0, y: 10 },
//     animate: { opacity: 0, y: 10 },
//     exit: { opacity: 1, y: 0 },
// };

// export default function TransitionOverlay() {
//     return (
//         <motion.div
//             variants={circleVariants}
//             initial="initial"
//             animate="animate"
//             exit="exit"
//             transition={{ duration: 1.35, ease: "easeInOut" }}
//             className="fixed top-0 left-0 w-full h-full bg-[#fbf8f5] z-50"
//         >
//             {/* Centered logo */}
//             <motion.div
//                 className="absolute inset-0 flex items-center justify-center"
//                 variants={contentVariants}
//                 transition={{ duration: 0.6, ease: "easeOut" }}
//             >
//                 <Image
//                     src="/globe-2.svg"
//                     alt="Logo"
//                     width={120}
//                     height={120}
//                     className="z-50 logo-transition"
//                 />
//             </motion.div>

//             {/* Bottom-right text — now a motion.div with its own variant */}
//             <motion.div
//                 variants={textVariants}
//                 transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
//                 className="main-logo-h2 fixed bottom-10 right-4 z-55 uppercase tracking-widest cursor-pointer"
//             >
//                 <div className="text-xs opacity-70 text-black">the</div>
//                 <div className="flex items-center gap-2 text-xl text-black">
//                     <span>GALLERY</span>
//                 </div>
//             </motion.div>
//         </motion.div>
//     );
// }
import { motion } from "framer-motion";
import Image from "next/image";

const circleVariants = {
    initial: { clipPath: "circle(0% at 50% 50%)" },
    animate: { clipPath: "circle(0% at 50% 50%)" },
    exit: { clipPath: "circle(150% at 50% 50%)" },
};

const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 0, y: 10 },
    exit: { opacity: 1, y: 0 },
};

export default function TransitionOverlay() {
    return (
        <motion.div
            variants={circleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 1.35, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-full bg-[#fbf8f5] z-50"
        >
            {/* Centered logo — shares layoutId with the navbar logo */}
            <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                    layoutId="site-logo"
                    style={{ width: 120, height: 120, overflow: "hidden" }}
                >
                    <Image
                        src="/globe-2.svg"
                        alt="Logo"
                        width={120}
                        height={120}
                        style={{ width: "100%", height: "100%" }}
                        className="z-50 logo-transition"
                    />
                </motion.div>
            </div>

            {/* Bottom-right text */}
            <motion.div
                variants={textVariants}
                transition={{ duration: 0.3, ease: "easeOut", delay: 0.5 }}
                className="main-logo-h2 fixed bottom-10 right-4 z-55 uppercase tracking-widest cursor-pointer"
            >
                <div className="text-xs opacity-70 text-black">the</div>
                <div className="flex items-center gap-2 text-xl text-black">
                    <span>GALLERY</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
