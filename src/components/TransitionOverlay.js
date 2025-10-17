import { m, motion } from "framer-motion";
import Image from "next/image";

const circleVariants = {
    initial: { clipPath: "circle(0% at 50% 50%)" },   // tiny circle center
    animate: { clipPath: "circle(0% at 50% 50%)" },   // stays tiny after entering
    exit: { clipPath: "circle(150% at 50% 50%)" },    // expands to full
};

const imageVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 0, scale: 0.8 }, // stays invisible while page active
    exit: { opacity: 1, scale: 1 }, // fade/scale in during transition
};

export default function TransitionOverlay() {
    return (
        <motion.div
            // initial={{ scaleX: 0 }}
            // animate={{ scaleX: 0 }}
            // exit={{ scaleX: 1 }}
            // transition={{ duration: 0.5, ease: "easeInOut" }}
            // className="fixed top-0 left-0 w-full h-full bg-black z-50 origin-left"

            variants={circleVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full h-full bg-[#1d709dac] z-50 "
        >
            <motion.div
                className="absolute inset-0 flex items-center justify-center"
                variants={imageVariants}
                transition={{ duration: 0.6, ease: "easeOut" }}
            >
                <Image
                    src="/globe-2.svg"
                    alt="Logo"
                    width={120}
                    height={120}
                    className="z-50 logo-transition"
                />
            </motion.div>

        </motion.div>
    );
}
