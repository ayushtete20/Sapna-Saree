import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSilkRibbon({ position, color, speed = 1, distort = 0.4, scale = 1 }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.15 * speed;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.2 * speed;
    }
  });

  return (
    <Float speed={2 * speed} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusKnotGeometry args={[1.6, 0.45, 128, 32, 2, 3]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.25}
          metalness={0.65}
          distort={distort}
          speed={1.5 * speed}
          clearcoat={0.8}
          clearcoatRoughness={0.1}
        />
      </mesh>
    </Float>
  );
}

function GoldParticles({ count = 40 }) {
  const points = React.useMemo(() => {
    const p = [];
    for (let i = 0; i < count; i++) {
      p.push(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6
      );
    }
    return new Float32Array(p);
  }, [count]);

  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#C8A96E"
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3DCanvas() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none opacity-90">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={1.4} color="#FAF6F0" />
        <pointLight position={[-4, -2, -2]} intensity={0.8} color="#C8A96E" />
        <pointLight position={[3, -3, 2]} intensity={0.6} color="#E8C4B8" />

        {/* Regal Silk Formations */}
        <FloatingSilkRibbon position={[2.2, 0.4, -1]} color="#7A1C2E" speed={0.8} distort={0.35} scale={0.9} />
        <FloatingSilkRibbon position={[-2.4, -0.6, -1.5]} color="#C8A96E" speed={0.6} distort={0.45} scale={0.8} />
        <FloatingSilkRibbon position={[0.2, -1.8, -2]} color="#5C1220" speed={0.5} distort={0.3} scale={0.65} />

        {/* Floating Gold Zari Sparks */}
        <GoldParticles count={50} />
      </Canvas>
    </div>
  );
}
