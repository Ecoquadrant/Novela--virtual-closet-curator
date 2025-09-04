import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ClothingMeshProps {
  imageUrl: string
  autoRotate?: boolean
}

function ClothingMesh({ imageUrl, autoRotate = true }: ClothingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture(imageUrl)
  
  // Auto rotation animation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2, 2.5]} />
      <meshStandardMaterial 
        map={texture} 
        transparent 
        alphaTest={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

interface Clothing3DViewerProps {
  imageUrl: string
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
}

export function Clothing3DViewer({ 
  imageUrl, 
  className = "w-full h-64", 
  autoRotate = true,
  enableControls = true 
}: Clothing3DViewerProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 5, 5]} 
          intensity={0.8}
          castShadow
        />
        <pointLight position={[-5, -5, -5]} intensity={0.4} />
        
        <ClothingMesh imageUrl={imageUrl} autoRotate={autoRotate} />
        
        {enableControls && (
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            minDistance={2}
            maxDistance={8}
            autoRotate={false}
          />
        )}
      </Canvas>
    </div>
  )
}