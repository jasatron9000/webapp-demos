import * as THREE from 'three'
import useBasicViewport from '../hooks/useBasicViewport'
import { OrbitControls } from '../OrbitControls'

import { useEffect, useRef } from 'react'
import styles from "../../../styles/LowPolyWave.module.css"
import { motion } from 'framer-motion'
import { perlinNoise } from '../perlin'
import { Texture } from 'three'
import { GUI } from 'dat.gui'
import { maxHeaderSize } from 'http'

const INIT = {
    SCENE: {
        BACKGROUND: new THREE.Color(0xc7eccee)
    },
    CAMERA: {
        ZPOS: 10
    }
}

const initWindow = (
    mainDOM: HTMLElement | null,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
) => {
    if (mainDOM) {
        const { width, height } = mainDOM.getBoundingClientRect()

        // set up the camera
        camera.aspect = width / height
        camera.position.z = INIT.CAMERA.ZPOS
        camera.position.y = 6
        camera.position.x = 6
        camera.updateProjectionMatrix()

        // set up the background
        scene.background = INIT.SCENE.BACKGROUND

        // set up the renderer
        renderer.setSize(width, height)

        mainDOM.appendChild(renderer.domElement)
    }
}

const setNoiseMap = (
    mesh: THREE.Mesh,
    scale: number,
    octaves: number,
    persistence: number,
    lacuranity: number,
    height: number,
    clipMin: number,
    clipMax: number,
    offsetX: number,
    offsetY: number
) => {
    let meshPositions = mesh.geometry.getAttribute('position')
    let posLength = Math.sqrt(meshPositions.count)

    if (scale <= 0) {
        scale = 0.0001
    }

    let minValue = Infinity
    let maxValue = -Infinity

    for (let y = 0; y < posLength; y++) {
        for (let x = 0; x < posLength; x++) {
            const index = (y * posLength) + x
            let amplitude = 1;
            let frequency = 1;
            let noiseHeight = 0;

            for (let octave = 0; octave < octaves; octave++) {
                const sX = ((x + offsetX) / scale) * frequency
                const sY = ((y + offsetY) / scale) * frequency

                const perlinValue = perlinNoise(sX, sY)
                noiseHeight += perlinValue * amplitude

                amplitude *= persistence
                frequency *= lacuranity
            }

            if (minValue > noiseHeight) {
                minValue = noiseHeight
            }

            if (maxValue < noiseHeight) {
                maxValue = noiseHeight
            }

            meshPositions.setZ(index, noiseHeight)
        }
    }

    for (let i = 0; i < meshPositions.count; i++) {
        const Z = meshPositions.getZ(i)

        let normZ = (Z - minValue) / (maxValue - minValue)

        if (normZ > clipMax) {
            normZ = clipMax
        }
        else if (normZ < clipMin) {
            normZ = clipMin
        }

        meshPositions.setZ(i, normZ * height)
    }

    mesh.geometry.setAttribute('position', meshPositions)
    mesh.geometry.computeVertexNormals()
}

const LowPolyWaveComponent: React.FC = () => {
    const [scene, camera, renderer] = useBasicViewport()
    const mainRef = useRef<HTMLElement | null>(null)
    const controllerRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const main = mainRef.current
        initWindow(main, scene, camera, renderer)

        const updateTerrain = () => {
            planeMesh.geometry.dispose()

            planeMesh.geometry = new THREE.PlaneGeometry(
                5, 5, 127, 127
            )

            setNoiseMap(
                planeMesh,
                63,
                params.terrain.octaves,
                params.terrain.persistence,
                params.terrain.lacuranity,
                params.terrain.height,
                params.terrain.clipMin,
                params.terrain.clipMax,
                params.terrain.offsetX,
                params.terrain.offsetY,
            )
        }

        const params = {
            terrain: {
                octaves: 4,
                persistence: 0.25,
                lacuranity: 2,
                height: 1,
                clipMin: 0,
                clipMax: 1,
                offsetX: 0,
                offsetY: 0
            }
        }

        const gui = new GUI()
        const terrain = gui.addFolder("Terrain")
        terrain.add(params.terrain, 'octaves', 1, 8, 1).onChange(updateTerrain)
        terrain.add(params.terrain, 'persistence', 0, 1, 0.01).onChange(updateTerrain)
        terrain.add(params.terrain, 'lacuranity', 1, 10, 0.05).onChange(updateTerrain)
        terrain.add(params.terrain, 'height', 1, 10, 0.05).onChange(updateTerrain)
        terrain.add(params.terrain, 'clipMin', 0, 1, 0.001).onChange(updateTerrain)
        terrain.add(params.terrain, 'clipMax', 0, 1, 0.001).onChange(updateTerrain)
        terrain.add(params.terrain, 'offsetX', -100, 100, 1).onChange(updateTerrain)
        terrain.add(params.terrain, 'offsetY', -100, 100, 1).onChange(updateTerrain)
        terrain.open()

        if (controllerRef.current) {
            controllerRef.current.appendChild(gui.domElement)
        }

        // set up the dom elements
        // add controller
        const controls = new OrbitControls(camera, renderer.domElement)

        // texture normal map
        const normalTex = new THREE.TextureLoader().load(
            '/res/grass/GroundForest003_NRM_3K.jpg'
        )

        const colorTex = new THREE.TextureLoader().load(
            '/res/grass/GroundForest003_COL_VAR1_3K.jpg'
        )

        // const bumpMap = new THREE.TextureLoader().load(
        //     '/res/grass/GroundDirtForest014_BUMP_3K.jpg'
        // )

        const aoMap = new THREE.TextureLoader().load(
            'res/grass/GroundForest003_AO_3K.jpg'
        )

        const dispMap = new THREE.TextureLoader().load(
            '/res/grass/GroundForest003_DISP_3K.jpg'
        )

        const metalMap = new THREE.TextureLoader().load(
            '/res/grass/GroundForest003_REFL_3K.jpg'
        )

        // insert a new plane geomery
        const planeGeometry = new THREE.PlaneGeometry(
            5, 5, 127, 127
        )

        let material = new THREE.MeshStandardMaterial({
            map: colorTex,
            normalMap: normalTex,
            aoMap: aoMap,
            displacementMap: dispMap,
            displacementScale: 0.1,
            metalnessMap: metalMap
        });

        const planeMesh = new THREE.Mesh(planeGeometry, material)
        planeMesh.castShadow = true;
        planeMesh.receiveShadow = true;

        planeMesh.position.y = -2
        planeMesh.rotation.x = THREE.MathUtils.degToRad(-90)

        setNoiseMap(
            planeMesh,
            64,
            6,
            0.25,
            2,
            1,
            0,
            1,
            0,
            0
        )

        // add light to the scene
        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(0, 10, 10);
        dirLight.castShadow = true;
        scene.add(dirLight);

        const ambientLight = new THREE.AmbientLight(
            0xaaaaaa
        )

        // light.position.set(0, 15, 15)
        scene.add(planeMesh)
        scene.add(ambientLight)
        // scene.add(light)


        // move camera back and render
        renderer.render(scene, camera)
        controls.update()

        const animate = (
            offset: number,
            renderer: THREE.WebGLRenderer,
            scene: THREE.Scene,
            camera: THREE.Camera
        ) => {
            requestAnimationFrame(() => { animate(offset + 0.001, renderer, scene, camera) })
            renderer.render(scene, camera)
            controls.update()
        }
        animate(0, renderer, scene, camera)

        return () => {
            if (main && controllerRef.current) {
                main.innerHTML = ''
                controllerRef.current.innerHTML = ''
            }
        }

    }, [])

    return (
        <>
            <main ref={mainRef} className={styles.main} />
            <motion.div
                ref={controllerRef}
                className={styles.controller}
            >
            </motion.div>
        </>
    )
}

export default LowPolyWaveComponent