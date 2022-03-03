
import { useEffect, useState } from 'react'

import styles from "../styles/components/Navbar.module.css"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"

// animations
const hidden = {
    height: 0,
    color: "transparent",
    borderColor: "transparent",
    transition: {
        type: "spring",
        duration: 0.3,
        bounce: 0.3,
        height: {
            delay: 0.1,
        }
    }
}

const visible = {
    height: "calc(100vh - 4rem)",
    color: "var(--main-color)",
    borderColor: "var(--main-color)"
}

const NavBar = () => {
    return (
        <nav className={styles.navbar}>
            <ul className={`${styles.ul}`}>
                <Link href="/">
                    <li>Home</li>
                </Link>
            </ul>
        </nav>
    )
}

export default NavBar