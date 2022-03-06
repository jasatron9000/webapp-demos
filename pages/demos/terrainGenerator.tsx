import { NextPage } from "next"
import Head from "next/head"
import dynamic from 'next/dynamic'

const DynamicComponent = dynamic(
    () => import('../api/demoComponents/terrainGeneratorC'),
    { ssr: false }
)

const TerrainGenerator: NextPage = () => {
    return (
        <>
            <Head>
                <meta name="application-name" content="Terrain Generator" />
                <meta name="description" content="Procedurally generates a 3D Terrain based on a 2D Perlin Noise to generate the height map. Options are available to customise the look of the terrain to however you want." />
            </Head>

            <DynamicComponent />
        </>
    )
}

export default TerrainGenerator