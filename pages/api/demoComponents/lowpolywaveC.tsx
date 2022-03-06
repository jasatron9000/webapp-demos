import * as THREE from 'three'
import useBasicViewport from '../hooks/useBasicViewport'
import { OrbitControls } from '../OrbitControls'

import { useEffect, useRef } from 'react'
import styles from "../../../styles/LowPolyWave.module.css"
import { GUI } from 'dat.gui'
import { motion } from 'framer-motion'
import { GUIOptions } from '../hooks/useGUI'
import { off } from 'process'
import { perlinNoise } from '../perlin'

const LowPolyWaveComponent: React.FC = () => {
    const [scene, camera, renderer] = useBasicViewport()
    const guiRef = useRef<GUI>()

    const mainRef = useRef<HTMLElement | null>(null)
    const controllerRef = useRef<HTMLDivElement | null>(null)

    const randomiseMesh = (mesh: THREE.Mesh): void => {
        let meshArray: THREE.BufferAttribute | THREE.InterleavedBufferAttribute = mesh.geometry.getAttribute('position')

        for (let i = 0; i < meshArray.count; i++) {
            const Z = meshArray.getZ(i)
            meshArray.setZ(i, Z + (Math.random() * 0.01) - 0.05)
        }

        mesh.geometry.setAttribute('position', meshArray)
    }

    const waveFn = (x: number, amplitude: number, frequency: number) => {
        return amplitude * Math.exp(Math.sin(frequency * x))
    }

    const waveMesh = (mesh: THREE.Mesh, offset: number): void => {
        let meshArray: THREE.BufferAttribute | THREE.InterleavedBufferAttribute = mesh.geometry.getAttribute('position')

        for (let i = 0; i < meshArray.count; i++) {
            const [X, Y, Z] = [meshArray.getX(i), meshArray.getY(i), meshArray.getZ(i)]

            const ZR = (perlinNoise((X + offset) / 2, (Y + offset) / 2)) + waveFn((X + offset / 8) + Y, 0.2, 1)
            meshArray.setZ(i, ZR + Z)
        }

        mesh.geometry.setAttribute('position', meshArray)
        // randomiseMesh(mesh)


    }

    useEffect(() => {
        const main = mainRef.current
        const controller = controllerRef.current

        const world = {
            plane: {
                width: 200,
                height: 200,
                widthSegments: 64,
                heightSegments: 64,
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
        
            const sky = new THREE.TextureLoader().load(
                '/res/skybox.jpeg')

            sky.offset = new THREE.Vector2(0, -0.1)
            sky.updateMatrix()

            // set up the scene, camera and renderer
            camera.aspect = width / height
            camera.position.y = 5;
            camera.updateProjectionMatrix()
            scene.background = sky
            renderer.setSize(width, height)


            main.appendChild(renderer.domElement)
            controller.appendChild(guiRef.current.domElement)

            // add controller
            // const controls = new OrbitControls(camera, renderer.domElement)

            // insert a new plane geomery
            

            const planeGeometry = new THREE.PlaneGeometry(
                5, 5, 32, 32
            )
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0x54a0ff,
                side: THREE.DoubleSide,
                flatShading: true,
                shininess: 150
            })
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
            planeMesh.position.z = -40
            planeMesh.rotation.x = THREE.MathUtils.degToRad(-90)

            const sunGeometry = new THREE.SphereGeometry(5, 16, 16)
            const sunMaterial = new THREE.MeshPhongMaterial({
                color: 0xc7ecee,
                emissive: 0xc7ecee
            })
            const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial)
            sunMesh.position.set(120, 50, -500)

            // add light to the scene
            const light = new THREE.DirectionalLight(
                0xc7ecee,
                1.5
            )
            const aLight = new THREE.AmbientLight(
                0x2c3e50
            )
            light.position.set(10, 10, -40)

            scene.add(planeMesh)
            scene.add(sunMesh)
            scene.add(light)
            scene.add(aLight)

            // move camera back and render
            camera.position.z = -5
            renderer.render(scene, camera)
            // controls.update()

            const animate = (
                offset: number,
                renderer: THREE.WebGLRenderer,
                scene: THREE.Scene,
                camera: THREE.Camera
            ) => {
                requestAnimationFrame(() => { animate(offset + 0.01, renderer, scene, camera) })
                renderer.render(scene, camera)
                // controls.update()

                planeMesh.geometry.dispose()
                planeMesh.geometry = new THREE.PlaneGeometry(
                    world.plane.width,
                    world.plane.height,
                    world.plane.widthSegments,
                    world.plane.heightSegments)

                waveMesh(planeMesh, offset)


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