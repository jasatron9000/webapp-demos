import * as THREE from 'three'
import useBasicViewport from '../hooks/useBasicViewport'
import { OrbitControls } from '../OrbitControls'

import { useEffect, useRef } from 'react'
import styles from "../../../styles/LowPolyWave.module.css"
import { GUI } from 'dat.gui'
import { motion } from 'framer-motion'

const LowPolyWaveComponent: React.FC = () => {
    const [scene, camera, renderer, setViewport] = useBasicViewport()
    const guiRef = useRef<GUI>()

    const mainRef = useRef<HTMLElement | null>(null)
    const controllerRef = useRef<HTMLDivElement | null>(null)
    
    const randomiseMesh = (mesh: THREE.Mesh): void => {
        let meshArray: THREE.BufferAttribute | THREE.InterleavedBufferAttribute = mesh.geometry.getAttribute('position')
        
        for (let i = 0; i < meshArray.count; i++) {
            meshArray.setZ(i, (Math.random() * 0.25) - 0.125)
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
                widthSegments: 10,
                heightSegments: 10,
            }
        }

        if(main && controller) {
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
            guiRef.current.add(world.plane, 'width', 1, 10, 0.05).onChange(updatePlaneMesh)
            guiRef.current.add(world.plane, 'height', 1, 10, 0.05).onChange(updatePlaneMesh)
            guiRef.current.add(world.plane, 'widthSegments', 1, 20, 1).onChange(updatePlaneMesh)
            guiRef.current.add(world.plane, 'heightSegments', 1, 20, 1).onChange(updatePlaneMesh)

            // set up the scene, camera and renderer
            setViewport((scene, camera, ) => {

            })
            
            main.appendChild(rendererRef.current.domElement)
            controller.appendChild(guiRef.current.domElement)

            // add controller
            const controls = new OrbitControls(cameraRef.current, rendererRef.current.domElement)

            // insert a new plane geomery
            const planeGeometry = new THREE.PlaneGeometry(
                5, 5, 10, 10
            )
            const planeMaterial = new THREE.MeshPhongMaterial({
                color: 0xf6b93b,
                side: THREE.DoubleSide,
                flatShading: true
            })
            const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)
            sceneRef.current.add(planeMesh)

            randomiseMesh(planeMesh)

            // add light to the scene
            const light = new THREE.DirectionalLight(
                0xffffff,
                1
            )
            light.position.set(0, 0, 1)
            sceneRef.current.add(light)

            // move camera back and render
            cameraRef.current.position.z = 5
            rendererRef.current.render(sceneRef.current, cameraRef.current)
            controls.update()

            const animate = (
                offset: number,
                renderer: THREE.WebGLRenderer, 
                scene: THREE.Scene,
                camera: THREE.Camera
            ) => {
                requestAnimationFrame(() => {animate(offset + 0.25, renderer, scene, camera)})
                renderer.render(scene, camera)
                controls.update()
                
            }
            animate(0, rendererRef.current, sceneRef.current ,cameraRef.current)
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
            <main ref={mainRef} className={styles.main}/>
            <motion.div
                ref={controllerRef} 
                className={styles.controller}
            >
            </motion.div>
        </>
    )
}

export default LowPolyWaveComponent