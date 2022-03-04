import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'


const useBasicViewport = () => {
    const scene = useRef<THREE.Scene>()
    const camera = useRef<THREE.PerspectiveCamera>()
    const renderer = useRef<THREE.WebGLRenderer>()

    useEffect(() => {
        scene.current = new THREE.Scene(),
        camera.current = new THREE.PerspectiveCamera(),
        renderer.current = new THREE.WebGLRenderer()

    }, [])

    function setViewport(callbackfn: (
        scene?: THREE.Scene,
        camera?: THREE.PerspectiveCamera,
        renderer?: THREE.WebGLRenderer
    ) => void){
        callbackfn(scene.current, camera.current, renderer.current)
    }


    return [scene, camera, renderer, setViewport]
}

export default useBasicViewport