import React, { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

function Marker({ position }) {
  const mesh = useRef()
  useFrame(({ clock }) => {
    const s = 0.9 + 0.1 * Math.sin(clock.getElapsedTime() * 4)
    mesh.current.scale.setScalar(s)
  })
  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial emissive={'#00ff88'} color={'#00ff88'} />
    </mesh>
  )
}

function Model({ onPick, readOnly }) {
  const { scene } = useGLTF('/human.glb')
  const [markerPos, setMarkerPos] = useState(null)

  const handleClick = e => {
    if (readOnly) return
    e.stopPropagation()
    const { point, object } = e
    const name = object.name || 'Unknown part'
    onPick(name, point)
    setMarkerPos(point.clone())
  }

  return (
    <group>
      <primitive
        object={scene}
        scale={3.0}
        position={[0, -2.75, 0]} /* Centered at origin */
        onClick={handleClick}
      />
      {markerPos && !readOnly && <Marker position={markerPos} />}
    </group>
  )
}

export default function HumanModel({ onPick = () => {}, readOnly = false, markerPos }) {
  return (
    <div className="canvas-wrapper">
      <Canvas camera={{ position: [0, 0, 6], fov: 65 }}> /* Adjusted for centering */
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 5]} intensity={1.0} />
        <Model onPick={onPick} readOnly={readOnly} />
        {readOnly && markerPos && <Marker position={markerPos} />}
        <OrbitControls
          enablePan={!readOnly}
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={10}
          target={[0, 0, 0]} /* Focus on center */
        />
      </Canvas>
    </div>
  )
}