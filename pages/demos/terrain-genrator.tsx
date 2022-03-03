import { NextPage } from "next"
import Head from "next/head"

interface Props {
    name: string
}

const TerrainGenerator: NextPage<Props> = ({ name }) => {
    return (
        <>
        <Head>
            <meta name="application-name" content="Terrain Generator"/>
            <meta name="description" content="Allows for automatic terrain generation using 2D Perlin Noise with adjustible parameters to fully customise your terrain."/>
        </Head>
        <main>
            <h1>{name}</h1>
        </main>
        </>
    )
}

export default TerrainGenerator