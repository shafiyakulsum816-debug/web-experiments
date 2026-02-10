
import React, { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Image, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ImageItem } from '../types';

interface ImageSphereProps {
  images: ImageItem[];
  radius: number;
  zoom: number;
  selectedId: string | null;
}

const ImageCard: React.FC<{ 
  url: string; 
  position: THREE.Vector3; 
  isSelected: boolean;
}> = ({ url, position, isSelected }) => {
  const meshRef = useRef<THREE.Group>(null);
  const scale = isSelected ? [2.6, 3.4] as [number, number] : [1.6, 2.2] as [number, number];
  
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.04;
      meshRef.current.scale.set(pulse, pulse, pulse);
    } else if (meshRef.current) {
      const targetScale = 1;
      meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale, 0.1);
      meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
      meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScale, 0.1);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Billboard follow={true}>
        {isSelected && (
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[scale[0] + 0.3, scale[1] + 0.3]} />
            <meshBasicMaterial color="#18181b" transparent opacity={0.08} />
          </mesh>
        )}
        <Image 
          url={url} 
          transparent 
          opacity={isSelected ? 1.0 : 0.85}
          scale={scale} 
          toneMapped={false}
          radius={0.1} // Rounded corners if supported by Drei Image
        />
      </Billboard>
    </group>
  );
};

const ImageSphere: React.FC<ImageSphereProps> = ({ images, radius, zoom, selectedId }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse, camera } = useThree();

  const positions = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const n = images.length;
    if (n === 0) return points;
    
    const phi = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      points.push(new THREE.Vector3(x * radius, y * radius, z * radius));
    }
    return points;
  }, [images, radius]);

  useFrame((state, delta) => {
    if (groupRef.current) {
      if (!selectedId) {
        // Smooth idle rotation
        groupRef.current.rotation.y += delta * 0.02;
        // Dampened mouse tracking
        const targetRotationX = mouse.y * 0.4;
        const targetRotationY = mouse.x * 0.4;
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.04);
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.04);
      } else {
        const idx = images.findIndex(img => img.id === selectedId);
        if (idx !== -1) {
          const pos = positions[idx];
          if (pos) {
            const targetQuat = new THREE.Quaternion().setFromUnitVectors(
              pos.clone().normalize(),
              new THREE.Vector3(0, 0, 1)
            );
            groupRef.current.quaternion.slerp(targetQuat, 0.08);
          }
        }
      }
    }

    const baseZ = radius * 3;
    const targetZ = baseZ - (zoom * radius * 2.2);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06);
  });

  return (
    <group ref={groupRef}>
      {images.map((img, idx) => (
        <ImageCard 
          key={img.id} 
          url={img.url} 
          position={positions[idx]} 
          isSelected={selectedId === img.id}
        />
      ))}
      <mesh>
        <sphereGeometry args={[radius * 0.02, 32, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.01} />
      </mesh>
    </group>
  );
};

export default ImageSphere;
