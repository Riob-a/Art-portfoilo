import { motion } from "framer-motion";
import Image from "next/image";

// const circleVariants = {
//     initial: { clipPath: "circle(0% at 50% 50%)" },
//     animate: { clipPath: "circle(0% at 50% 50%)" },
//     exit: { clipPath: "circle(150% at 50% 50%)" },
// };

// const wipeVariants = {
//     initial: { clipPath: "inset(0 0 100% 0)" },
//     animate: { clipPath: "inset(0 0 100% 0)" },
//     exit: { clipPath: "inset(0 0 0% 0)" },
// };

const expandVariants = {
    initial: { clipPath: "inset(50% 50% 50% 50%)" },
    animate: { clipPath: "inset(50% 50% 50% 50%)" },
    exit: {
        clipPath: [
            "inset(50% 50% 50% 50%)",
            "inset(0% 0% 0% 0%)",
            "inset(0% 0% 0% 0%)",
            "inset(50% 50% 50% 50%)",
        ],
    },
};

const textVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 0, y: 10 },
    exit: { opacity: 1, y: 0 },
};

export default function TransitionOverlay() {
    return (
        // CIRCLE VARIANT
        // <motion.div
        //     variants={circleVariants}
        //     initial="initial"
        //     animate="animate"
        //     exit="exit"
        //     transition={{ duration: 1.35, ease: "easeInOut" }}
        //     className="fixed top-0 left-0 w-full h-full bg-[#fbf8f5] z-50"
        // >
        // OPTION 1
        // <motion.div
        //     variants={wipeVariants}
        //     initial="initial"
        //     animate="animate"
        //     exit="exit"
        //     transition={{ duration: 0.9, ease: [0.77, 0, 0.175, 1] }}
        //     className="fixed top-0 left-0 w-full h-full z-50"
        //     style={{ background: "var(--theme-navbar, #ffffff)" }}
        // >
        // OPTION 2
        <motion.div
            variants={expandVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
                duration: 2.2,
                type: "keyframes",
                times: [0, 0.35, 0.65, 1],  // 35% expand, 30% hold, 35% compress
                ease: [
                    [0.77, 0, 0.175, 1],   // expand
                    "linear",               // hold (no easing needed)
                    [0.25, 0.1, 0.25, 1],  // compress
                ],
            }}
            className="fixed top-0 left-0 w-full h-full z-50"
            style={{ background: "var(--theme-navbar, #ffffff)" }}
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
                className="main-logo-h2 fixed bottom-10 left-4 z-55 uppercase tracking-widest cursor-pointer"
            >
                <div className="text-xs opacity-70 text-black">the</div>
                <div className="flex items-center gap-2 text-lg text-black">
                    <span>GALLERY</span>
                </div>
            </motion.div>
        </motion.div>
    );
}
