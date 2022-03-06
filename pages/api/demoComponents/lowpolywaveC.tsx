import * as THREE from 'three'
import useBasicViewport from '../hooks/useBasicViewport'
import { OrbitControls } from '../OrbitControls'

import { useEffect, useRef } from 'react'
import styles from "../../../styles/LowPolyWave.module.css"
import { GUI } from 'dat.gui'
import { motion } from 'framer-motion'
import { GUIOptions } from '../hooks/useGUI'

const LowPolyWaveComponent: React.FC = () => {
    const [scene, camera, renderer] = useBasicViewport()
    const guiRef = useRef<GUI>()

    const mainRef = useRef<HTMLElement | null>(null)
    const controllerRef = useRef<HTMLDivElement | null>(null)

    const randomiseMesh = (mesh: THREE.Mesh): void => {
        let meshArray: THREE.BufferAttribute | THREE.InterleavedBufferAttribute = mesh.geometry.getAttribute('position')

        for (let i = 0; i < meshArray.count; i++) {
            meshArray.setZ(i, (Math.random() * 0.05) - 0.025)
        }

        mesh.geometry.setAttribute('position', meshArray)
    }

    const waveFn = (x: number, y: number, amplitude: number, frequency: number) => {
        return amplitude * Math.sin(frequency * (x + y))
    }

    const waveMesh = (mesh: THREE.Mesh, offset: number): void => {
        let meshArray: THREE.BufferAttribute | THREE.InterleavedBufferAttribute = mesh.geometry.getAttribute('position')

        for (let i = 0; i < meshArray.count; i++) {
            const [X, Y, Z] = [meshArray.getX(i), meshArray.getY(i), meshArray.getZ(i)]

            const ZR = waveFn(X - offset, Y, 0.25, 1 / 3) + waveFn(X, Y + offset, 0.01, 8)
            meshArray.setZ(i, ZR + Z)
        }

        mesh.geometry.setAttribute('position', meshArray)

    }

    useEffect(() => {
        const main = mainRef.current
        const controller = controllerRef.current

        const world = {
            plane: {
                width: 5,
                height: 5,
                widthSegments: 50,
                heightSegments: 50,
            },
            light: {
                position: {
                    x: 0,
                    y: 0,
                    z: 1
                },
                rotation: {
                    x: 0,
                    y: 0,
                    z: 0
                }
            }
        }

        if (main && controller) {
            const { width, height } = main.getBoundingClientRect()
            const updatePlaneMesh = (): void => {
                planeMesh.geometry.dispose()
                planeMesh.geometry = new THREE.PlaneGeometry(
                    world.plane.width,
                    world.plane.height,
                    world.plane.widthSegments,
                    world.plane.heightSegments)

                randomiseMesh(planeMesh)
            }

            // GUI
            guiRef.current = new GUI()
            // guiRef.current.add(world.plane, 'width', 1, 10, 0.05).onChange(updatePlaneMesh)
            // guiRef.current.add(world.plane, 'height', 1, 10, 0.05).onChange(updatePlaneMesh)
            // guiRef.current.add(world.plane, 'widthSegments', 1, 100, 1).onChange(updatePlaneMesh)
            // guiRef.current.add(world.plane, 'heightSegments', 1, 100, 1).onChange(updatePlaneMesh)


            // set up the scene, camera and renderer
            camera.aspect = width / height
            camera.position.y = 1;
            camera.updateProjectionMatrix()
            scene.background = new THREE.Color(0xc7ecee)
            renderer.setSize(width, height)


            main.appendChild(renderer.domElement)
            controller.appendChild(guiRef.current.domElement)

            // load in texture
            const texLoader = new THREE.TextureLoader()
            const waveNormalMap1 = texLoader.load('/res/water_normals_1.png')

            waveNormalMap1.wrapS = THREE.RepeatWrapping;
            waveNormalMap1.wrapT = THREE.RepeatWrapping;

            // add controller
            const controls = new OrbitControls(camera, renderer.domElement)

            // insert a new plane geomery
            const planeGeometry = new THREE.PlaneGeometry(
                40, 40, 500, 500
            )
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0x487eb0,
                side: THREE.DoubleSide,
                displacementMap: waveNormalMap1,
                displacementScale: -0.2,
                normalMap: waveNormalMap1
            })
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
            planeMesh.rotation.x = THREE.MathUtils.degToRad(-90)


            // add light to the scene
            const light = new THREE.DirectionalLight(
                0xffffff,
                1.5
            )

            const lightOpt = guiRef.current.addFolder('Light')
            const lightPosOpt = lightOpt.addFolder('Position')
            lightPosOpt.add(light.position, "x", -5, 5)
            lightPosOpt.add(light.position, "y", -5, 5)
            lightPosOpt.add(light.position, "z", -5, 5)
            lightPosOpt.open()
            lightOpt.open()

            light.position.set(0, 1, 1)

            scene.add(planeMesh)
            scene.add(light)

            // move camera back and render
            camera.position.z = 5
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

                if (planeMesh.material.normalMap) {
                    planeMesh.material.normalMap.offset = new THREE.Vector2(offset, offset)
                    planeMesh.material.normalMap.updateMatrix()
                }



            }
            animate(0, renderer, scene, camera)
        }

        return () => {
            if (main && controller) {
                main.innerHTML = ''
                controller.innerHTML = ''
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