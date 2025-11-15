import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import { BuildingModel } from './BuildingModel';
import { ParticleSystem } from './ParticleSystem';
import { Suspense } from 'react';

interface ConstructionSceneProps {
  enableControls?: boolean;
  particleCount?: number;
  particleColor?: string;
  particleSpeed?: number;
}

const LoadingFallback = () => (
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#FF6B35" wireframe />
  </mesh>
);

export const ConstructionScene = ({
  enableControls = false,
  particleCount = 1000,
  particleColor = '#FF6B35',
  particleSpeed = 1,
}: ConstructionSceneProps) => {
  return (
    <div className="w-full h-full">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 2, 8]} fov={50} />

        {/* Luces */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#F7B801" />

        {/* Entorno */}
        <Environment preset="sunset" />

        {/* Modelos 3D */}
        <Suspense fallback={<LoadingFallback />}>
          <BuildingModel autoRotate scale={1} />
          <ParticleSystem count={particleCount} color={particleColor} speed={particleSpeed} />
        </Suspense>

        {/* Controles opcionales */}
        {enableControls && (
          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={5}
            maxDistance={15}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        {/* Niebla atmosférica */}
        <fog attach="fog" args={['#1A1A2E', 10, 25]} />
      </Canvas>
    </div>
  );
};
