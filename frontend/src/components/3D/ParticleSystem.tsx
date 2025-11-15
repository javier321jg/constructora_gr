import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleSystemProps {
  count?: number;
  color?: string;
  speed?: number;
}

export const ParticleSystem = ({ count = 1000, color = '#FF6B35', speed = 1 }: ParticleSystemProps) => {
  const particlesRef = useRef<THREE.Points>(null);

  // Crear partículas
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Posición aleatoria
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

      // Velocidad aleatoria
      velocities[i * 3] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    return { positions, velocities };
  }, [count]);

  // Animación de partículas
  useFrame((state) => {
    if (!particlesRef.current) return;

    const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Movimiento con ruido Perlin simulado
      positions[i3] += Math.sin(time + i) * 0.001 * speed;
      positions[i3 + 1] += Math.cos(time + i) * 0.001 * speed;
      positions[i3 + 2] += Math.sin(time + i * 0.5) * 0.001 * speed;

      // Mantener dentro de los límites
      if (Math.abs(positions[i3]) > 10) positions[i3] *= -0.9;
      if (Math.abs(positions[i3 + 1]) > 10) positions[i3 + 1] *= -0.9;
      if (Math.abs(positions[i3 + 2]) > 10) positions[i3 + 2] *= -0.9;
    }

    particlesRef.current.geometry.attributes.position.needsUpdate = true;

    // Rotación suave
    particlesRef.current.rotation.y = time * 0.05 * speed;
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particles.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};
