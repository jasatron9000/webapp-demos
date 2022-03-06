import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// type Viewport = [
//     THREE.Scene | undefined,
//     THREE.PerspectiveCamera | undefined,
//     THREE.WebGLRenderer | undefined
// ]

type setSize = (width: number, height: number) => void

interface Viewport {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
}

interface ViewportOperation {
    setSize: (height: number, width: number) => void
    setBackgroundColour: (color: THREE.Color) => void
    setCameraPosition: (x: number, y: number, z: number) => void
    setCameraRotation: (x: number, y: number, z: number) => void
    addLight: (light: THREE.Light) => void
    addMesh: (mesh: THREE.Mesh) => void
    render: () => void,
}

export const useDefaultViewport = (
): Viewport => {
    const viewPort = useRef<Viewport>({
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(),
        renderer: new THREE.WebGLRenderer(),
    })

    useEffect(() => {
        viewPort.current = {
            scene: new THREE.Scene(),
            camera: new THREE.PerspectiveCamera(75, 1, 0.1, 1000),
            renderer: new THREE.WebGLRenderer(),
        }
    }, [])

    return viewPort.current
}