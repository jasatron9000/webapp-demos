import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

type Viewport = [
    THREE.Scene,
    THREE.PerspectiveCamera,
    THREE.WebGLRenderer
]

const useBasicViewport = (): Viewport => {
    const scene = useRef<THREE.Scene>(new THREE.Scene())
    const camera = useRef<THREE.PerspectiveCamera>(new THREE.PerspectiveCamera())
    const renderer = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer())

    useEffect(() => {
        scene.current = new THREE.Scene()
        camera.current = new THREE.PerspectiveCamera()
        renderer.current = new THREE.WebGLRenderer()
    }, [])

    return [scene.current, camera.current, renderer.current]
}

export default useBasicViewport