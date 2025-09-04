import { Canvas } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ClothingCategory } from '@/types/wardrobe'

interface ClothingMeshProps {
  imageUrl: string
  category: ClothingCategory
  autoRotate?: boolean
}

function ClothingMesh({ imageUrl, category, autoRotate = true }: ClothingMeshProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useTexture(imageUrl)
  
  // Auto rotation animation
  useFrame((state, delta) => {
    if (meshRef.current && autoRotate) {
      meshRef.current.rotation.y += delta * 0.3
    }
  })

  // Create different 3D geometries based on clothing category
  const getGeometry = () => {
    switch (category) {
      case 'tops':
        // T-shirt shape using extruded geometry
        const shirtShape = new THREE.Shape()
        shirtShape.moveTo(-1, -1.5)
        shirtShape.lineTo(-1, 0)
        shirtShape.lineTo(-1.5, 0.5)
        shirtShape.lineTo(-1.5, 1)
        shirtShape.lineTo(-0.5, 1)
        shirtShape.lineTo(-0.5, 1.5)
        shirtShape.lineTo(0.5, 1.5)
        shirtShape.lineTo(0.5, 1)
        shirtShape.lineTo(1.5, 1)
        shirtShape.lineTo(1.5, 0.5)
        shirtShape.lineTo(1, 0)
        shirtShape.lineTo(1, -1.5)
        shirtShape.lineTo(-1, -1.5)
        return new THREE.ExtrudeGeometry(shirtShape, { depth: 0.1, bevelEnabled: false })
      
      case 'bottoms':
        // Pants shape
        const pantsShape = new THREE.Shape()
        pantsShape.moveTo(-0.8, 1)
        pantsShape.lineTo(-0.8, -0.5)
        pantsShape.lineTo(-1, -0.5)
        pantsShape.lineTo(-1, -2)
        pantsShape.lineTo(-0.6, -2)
        pantsShape.lineTo(-0.6, -0.5)
        pantsShape.lineTo(-0.2, -0.5)
        pantsShape.lineTo(-0.2, -2)
        pantsShape.lineTo(0.2, -2)
        pantsShape.lineTo(0.2, -0.5)
        pantsShape.lineTo(0.6, -0.5)
        pantsShape.lineTo(0.6, -2)
        pantsShape.lineTo(1, -2)
        pantsShape.lineTo(1, -0.5)
        pantsShape.lineTo(0.8, -0.5)
        pantsShape.lineTo(0.8, 1)
        pantsShape.lineTo(-0.8, 1)
        return new THREE.ExtrudeGeometry(pantsShape, { depth: 0.1, bevelEnabled: false })
      
      case 'dresses':
        // Dress shape
        const dressShape = new THREE.Shape()
        dressShape.moveTo(-0.6, 1.5)
        dressShape.lineTo(-0.6, 1)
        dressShape.lineTo(-1.2, 0)
        dressShape.lineTo(-1.5, -1.5)
        dressShape.lineTo(1.5, -1.5)
        dressShape.lineTo(1.2, 0)
        dressShape.lineTo(0.6, 1)
        dressShape.lineTo(0.6, 1.5)
        dressShape.lineTo(-0.6, 1.5)
        return new THREE.ExtrudeGeometry(dressShape, { depth: 0.1, bevelEnabled: false })
      
      case 'shoes':
        // Shoe shape using box geometry
        return new THREE.BoxGeometry(1.5, 0.5, 2.5)
      
      case 'accessories':
        // Generic accessory shape
        return new THREE.CylinderGeometry(0.5, 0.5, 0.2, 16)
      
      default:
        // Default to a basic rectangular shape
        return new THREE.PlaneGeometry(1.5, 2)
    }
  }

  const geometry = getGeometry()

  return (
    <mesh ref={meshRef} position={[0, 0, 0]} geometry={geometry}>
      <meshStandardMaterial 
        map={texture} 
        transparent 
        alphaTest={0.1}
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  )
}

interface Clothing3DViewerProps {
  imageUrl: string
  category: ClothingCategory
  className?: string
  autoRotate?: boolean
  enableControls?: boolean
}

export function Clothing3DViewer({ 
  imageUrl, 
  category,
  className = "w-full h-64", 
  autoRotate = false,
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
        <spotLight position={[0, 10, 0]} intensity={0.3} />
        
        <ClothingMesh 
          imageUrl={imageUrl} 
          category={category}
          autoRotate={autoRotate} 
        />
        
        {enableControls && (
          <OrbitControls 
            enableZoom={true}
            enablePan={true}
            minDistance={2}
            maxDistance={8}
            autoRotate={false}
            enableDamping={true}
            dampingFactor={0.05}
          />
        )}
      </Canvas>
    </div>
  )
}