import { PagesMetaData } from "../pages/api/interface"
import Image from "next/image"
import styles from "../styles/components/Modal.module.css"
import React from "react"
import { motion, Variants } from "framer-motion"
import Link from "next/link"

interface Props {
    page: PagesMetaData,
    onClickHandle?: (index: number) => void
}

const modal:Variants = {
    hiddenModal: {
        y: "100vh",
        scale: 0.5,
        opacity: 0,
        transition: {
            delay: 0.25,
            duration: 0.25,
            scale: {delay:0}
        }
    },
    visibleModal: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            delay: 0.25,
            duration: 0.25,
            scale: {delay:0.5}
        }
    },
}

const Modal: React.FC<Props> = ({ 
    page
}) => {
    const imgLink:string = (page.blurb_image) ? page.blurb_image : "/no_pic.png"
    
    const CardButton = React.forwardRef<any, {onClick?: React.MouseEventHandler, href?: string}>(({ onClick, href }, ref) => {
        return (
            <div className={styles.link}>
                <motion.a 
                    whileHover={{scale: 1.1}}
                    whileTap={{scale: 0.9}}
                    href={href} 
                    onClick={onClick} 
                    ref={ref} 
                >
                    Go To Demo
                </motion.a>
            </div>
        )
    })

    CardButton.displayName = "CardButton"

    return (
        <>
            <motion.div
                initial="hiddenModal"
                animate="visibleModal"
                exit="hiddenModal"
                variants={modal}
                className={styles.modal}
                onClick={(e) => (e.stopPropagation())}
            >
                <div className={styles.imageContainer}>
                    <Image src={imgLink} width="1600" height="900" layout="responsive" alt={page.application_name}/>
                </div>
                <div className={styles.textBox}>
                    <h2>{page.application_name}</h2>
                    <p>{page.description}</p>
                    <Link href={page.link} passHref>
                        <CardButton/>
                    </Link>
                </div>
            </motion.div>
        </>
        )
        
}  

export default Modal