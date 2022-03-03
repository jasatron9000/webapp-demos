import type { NextPage } from 'next'
import styles from '../styles/Home.module.css'
import Card from '../components/card'
import { PagesMetaData } from "../pages/api/interface"
import Modal from '../components/modal'
import { animate, AnimatePresence, motion } from 'framer-motion'
import { useState } from "react"
import Layout from '../components/layout'

const backdrop = {
    visible: {
        backgroundColor: "#000000d3",
        transition: {
            duration: 0.25
        }
    },
    hidden: {
        backgroundColor: "#00000000",
        transition: {
            delay: 0.5,
            duration: 0.25
        }
    }
}

const Home: NextPage = () => {
    const [visible, setVisible] = useState<boolean>(false);
    const [clickedIndex, setClickedIndex] = useState<number>(0);
    
    let newData: PagesMetaData[] = []
    if (process.env.menu) {
        newData = JSON.parse(process.env.menu)
        console.log(newData);
    }

    const onClickCard = (index: number) => {
        setVisible(!visible)
        setClickedIndex(index)
    }

    const cardList = newData.map((value, index) => {
        return <Card key={index} index={index} page={value} onClickHandle={onClickCard}/>
    })

    return (
        <>
            <AnimatePresence>
                {(visible) && 
                <motion.div 
                    className={styles.backdrop}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={backdrop}
                    onClick={() => setVisible(!visible)}
                >
                    <Modal page={newData[clickedIndex]}/>
                </motion.div>}
            </AnimatePresence>
            
            <main className={styles.home}>
                {cardList}
            </main>
            <footer>
                <p>{"~w~ jason b. ~w~"}</p>
            </footer>
        </>
    )
}

export default Home
