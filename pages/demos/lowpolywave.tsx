import { NextPage } from "next"
import Head from "next/head"
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(
    () => import('../api/demoComponents/lowpolywaveC'),
    { ssr: false}
)

const TerrainGenerator: NextPage = () => {
    return (
        <>
        <Head>
            <meta name="application-name" content="Low-poly Wave Example"/>
            <meta name="description" content="Simple low poly wave."/>
            <meta name="blurb-image" content="/lowpolywave.png"/>
        </Head>

        <DynamicComponent />
        </>
    )
}

export default TerrainGenerator