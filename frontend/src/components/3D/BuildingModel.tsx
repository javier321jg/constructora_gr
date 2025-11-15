import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

interface BuildingModelProps {
  autoRotate?: boolean;
  scale?: number;
}

export const BuildingModel = ({ autoRotate = true, scale = 1 }: BuildingModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const hoverRef = useRef(false);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Rotación automática
    if (autoRotate) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }

    // Efecto de flotación
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;

    // Efecto hover
    if (hoverRef.current) {
      groupRef.current.scale.lerp({ x: scale * 1.1, y: scale * 1.1, z: scale * 1.1 } as any, 0.1);
    } else {
      groupRef.current.scale.lerp({ x: scale, y: scale, z: scale } as any, 0.1);
    }
  });

  return (
    <group
      ref={groupRef}
      scale={scale}
      onPointerOver={() => (hoverRef.current = true)}
      onPointerOut={() => (hoverRef.current = false)}
    >
      {/* Base del edificio */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2, 0.5, 2]} />
        <meshStandardMaterial color="#004E89" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Torre principal */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[1.5, 3, 1.5]} />
        <meshStandardMaterial color="#FF6B35" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Ventanas - Torre principal */}
      {[...Array(6)].map((_, i) => (
        <group key={`window-${i}`}>
          {/* Ventanas frontales */}
          <mesh position={[0.3, 0.5 + i * 0.5, 0.76]}>
            <boxGeometry args={[0.3, 0.3, 0.02]} />
            <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[-0.3, 0.5 + i * 0.5, 0.76]}>
            <boxGeometry args={[0.3, 0.3, 0.02]} />
            <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
          </mesh>

          {/* Ventanas laterales */}
          <mesh position={[0.76, 0.5 + i * 0.5, 0.3]}>
            <boxGeometry args={[0.02, 0.3, 0.3]} />
            <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[0.76, 0.5 + i * 0.5, -0.3]}>
            <boxGeometry args={[0.02, 0.3, 0.3]} />
            <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Torre secundaria izquierda */}
      <mesh position={[-1.2, 1.5, 0]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#F7B801" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Ventanas - Torre secundaria */}
      {[...Array(4)].map((_, i) => (
        <mesh key={`window-left-${i}`} position={[-1.2, 0.5 + i * 0.5, 0.41]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Torre secundaria derecha */}
      <mesh position={[1.2, 1, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#004E89" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Ventanas - Torre derecha */}
      {[...Array(2)].map((_, i) => (
        <mesh key={`window-right-${i}`} position={[1.2, 0.5 + i * 0.5, 0.41]}>
          <boxGeometry args={[0.4, 0.3, 0.02]} />
          <meshStandardMaterial color="#87CEEB" emissive="#87CEEB" emissiveIntensity={0.5} />
        </mesh>
      ))}

      {/* Techo principal - pirámide */}
      <mesh position={[0, 3.8, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[1.1, 0.5, 4]} />
        <meshStandardMaterial color="#1A1A2E" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Antena */}
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#FF6B35" emissive="#FF6B35" emissiveIntensity={0.8} />
      </mesh>

      {/* Luz en la punta */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} />
      </mesh>
      <pointLight position={[0, 5, 0]} color="#FFD700" intensity={1} distance={5} />
    </group>
  );
};
