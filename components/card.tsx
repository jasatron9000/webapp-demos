import { PagesMetaData } from "../pages/api/interface"
import Image from "next/image"
import styles from "../styles/components/Card.module.css"
import React, { useState } from "react"
import { motion, Variants } from "framer-motion"

interface Props {
    index: number,
    page: PagesMetaData,
    onClickHandle: (index: number) => void
}


const CardButton = React.forwardRef<any, {onClick?: React.MouseEventHandler, href?: string}>(({ onClick, href }, ref) => {
    return (
        <a href={href} onClick={onClick} ref={ref} className={styles.link}>
            Click Me
        </a>
    )
})

const largeCard:Variants = {
    enter: {
        y: 15,
        opacity: 0
    },
    visible: i => ({
        y: 0,
        opacity: 1,
        transition: {
            delay: (0.1 * i),
            type: "spring",
            bound: 0.5,
            y: {duration: 0.25},
            opacity: {duration: 0.4}
        }
    }),
    hover: {
        scale: 0.95,
        transition: {
            type:"spring",
            bounce: 0.5,
            duration: 0.25
        }
    }
    
}

const Card: React.FC<Props> = ({ 
    index,
    page,
    onClickHandle
}) => {
    const imgLink:string = (page.blurb_image) ? page.blurb_image : "/no_pic.png"

    return (
        <>
            <motion.div
                variants={largeCard}
                initial="enter"
                animate="visible"
                whileHover="hover"
                custom={index}
                className={styles.card}
                onClick={() => {onClickHandle(index)}}
            >
                <div className={styles.imageContainer}>
                    <Image src={imgLink} width="1600" height="900" layout="responsive" />
                </div>
                <div className={styles.textBox}>
                    <h2>{page.application_name}</h2>
                </div>
            </motion.div>
        </>
        )
        
}  

export default Card