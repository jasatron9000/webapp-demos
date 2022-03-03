import { useEffect, useState } from "react";
import { AnimatePresence, m, motion, transform, usePresence } from "framer-motion";

const Layout: React.FC = ({ children }) => {
    const getRand = (end: string) => {
        const options = ["-100", "100"]
        return options[Math.floor(Math.random() * options.length)] + end
    }

    const mainLayout = {
        enter: {
            x: getRand("vw"),
            y: getRand("vh"),
            rotate: -45,
            scale: 0.8,
        },
        animate: {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            transition: {
                type: "spring",
                bounce: 0.15,
                duration: 0.4,
                scale: {
                    delay: 0.4,
                    type: "spring",
                    bounce: 0.15,
                    duration: 0.4,
                }
            }
        },
        exit: {
            x: getRand("vw"),
            y: getRand("vh"),
            rotate: 45,
            scale: 0.8,
            transition: {
                type: "spring",
                bounce: 0.15,
                duration: 0.4,
                delay: 0.4,
                scale: {
                    delay: 0,
                    type: "spring",
                    bounce: 0.15,
                    duration: 0.4,
                }
            }
        }
    }

    return (
        <motion.main 
            variants={mainLayout}
            initial="enter"
            animate="animate"
            exit="exit"
        >
            {children}
        </motion.main>
    )
}

export default Layout