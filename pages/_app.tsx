import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import NavBar from '../components/navbar'
import { AnimatePresence } from 'framer-motion'


function MyApp({ Component, pageProps, router }: AppProps) {
    return (
        <React.Fragment>
            <Head>
                <title>Demos</title>
                <meta name="description" content="Different Experiments for Three.JS" />
                <link rel="icon" href="/logo.ico" />
            </Head>
            <NavBar/>
            <AnimatePresence 
                exitBeforeEnter
            >
                <Component {...pageProps} key={router.pathname}/>
            </AnimatePresence>
        </React.Fragment>
    )
}

export default MyApp
