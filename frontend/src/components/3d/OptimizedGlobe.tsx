import React, { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SupplierMarker {
  id: number;
  position: [number, number, number];
  color: string;
  name: string;
  risk: 'low' | 'medium' | 'high';
}

function GlobeMesh() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0025;
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.25) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[2.1, 32, 32]} />
        <meshStandardMaterial
          color="#B3E5FC"
          emissive="#7DD3FC"
          emissiveIntensity={0.15}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh scale={1.05}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#C8E6C9" wireframe transparent opacity={0.2} />
      </mesh>
    </group>
  );
}

function SupplierMarker({ marker }: { marker: SupplierMarker }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 3 + marker.id) * 0.35;
    ref.current.scale.setScalar(pulse);
  });

  return (
    <group position={marker.position}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={marker.color} emissive={marker.color} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

function TradeRoute({ from, to, color }: { from: [number, number, number]; to: [number, number, number]; color: string }) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(3.4);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(60);
  }, [from, to]);

  return <Line points={points} color={color} lineWidth={1.2} transparent opacity={0.55} />;
}

export default function OptimizedGlobe() {
  const markers: SupplierMarker[] = [
    { id: 1, position: [1.7, 1.1, 0.8], color: '#2BBBAD', name: 'Alpha Tech', risk: 'low' },
    { id: 2, position: [-1.6, 1.3, -0.9], color: '#FF6B6B', name: 'Beta Supply', risk: 'high' },
    { id: 3, position: [0.4, -1.8, 1.1], color: '#FFA000', name: 'Gamma Logistics', risk: 'medium' },
    { id: 4, position: [-0.9, -0.2, -1.8], color: '#7C4DFF', name: 'Delta Components', risk: 'low' },
    { id: 5, position: [1.4, -0.9, -1.3], color: '#4A90E2', name: 'Epsilon Imports', risk: 'medium' },
  ];

  return (
    <div className="relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-slate-200 bg-white/70 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md">
      <div className="absolute left-4 top-4 z-10">
        <h3 className="text-xl font-semibold text-slate-800">Global network</h3>
        <p className="text-sm text-slate-500">Live supplier risk monitoring</p>
      </div>

      <Canvas camera={{ position: [0, 0, 6], fov: 42 }} dpr={[1, 1.5]}>
        <color attach="background" args={['#f8fafc']} />
        <ambientLight intensity={0.8} />
        <pointLight position={[8, 8, 8]} intensity={1.8} />
        <pointLight position={[-8, -4, -4]} intensity={0.8} color="#93c5fd" />
        <Stars radius={50} depth={25} count={1200} factor={2.5} fade speed={0.8} />
        <GlobeMesh />

        {markers.map((marker, index) => (
          <React.Fragment key={marker.id}>
            <SupplierMarker marker={marker} />
            {(index + 1) % 2 === 0 && index < markers.length - 1 && (
              <TradeRoute
                from={marker.position}
                to={markers[(index + 1) % markers.length].position}
                color={marker.risk === 'high' ? '#FF6B6B' : marker.risk === 'medium' ? '#FFA000' : '#2BBBAD'}
              />
            )}
          </React.Fragment>
        ))}

        <OrbitControls enablePan={false} enableZoom autoRotate autoRotateSpeed={0.55} />
      </Canvas>
    </div>
  );
}
