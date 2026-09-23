import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Line } from '@react-three/drei';
import * as THREE from 'three';

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshPhongMaterial 
        color="#0a192f" 
        emissive="#000000" 
        specular="#111111" 
        shininess={5} 
        wireframe={true} 
        transparent 
        opacity={0.3} 
      />
    </mesh>
  );
};

const SupplierNode = ({ position, color }: { position: [number, number, number], color: string }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = React.useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true); }}
      onPointerOut={() => setHover(false)}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshBasicMaterial color={hovered ? "#ffffff" : color} />
      {hovered && (
        <mesh position={[0, 0.2, 0]}>
          <planeGeometry args={[1, 0.3]} />
          <meshBasicMaterial color="#000" transparent opacity={0.8} />
          {/* HTML Overlay could be used here via Html from drei for text */}
        </mesh>
      )}
    </mesh>
  );
};

const Route = ({ start, end }: { start: [number, number, number], end: [number, number, number] }) => {
  const points = useMemo(() => {
    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(0, 3, 0), // Midpoint pulled out
      new THREE.Vector3(...end)
    );
    return curve.getPoints(50);
  }, [start, end]);

  return (
    <Line
      points={points}
      color="#3b82f6"
      lineWidth={1}
      transparent
      opacity={0.5}
    />
  );
};

export default function GlobalSupplyChainMap() {
  const suppliers = [
    { id: 1, pos: [1.5, 1, 1] as [number, number, number], color: "#10b981", name: "Alpha Tech (Low Risk)" },
    { id: 2, pos: [-1, 1.5, -1] as [number, number, number], color: "#ef4444", name: "Beta Supply (High Risk)" },
    { id: 3, pos: [0, -1.8, 0.8] as [number, number, number], color: "#f59e0b", name: "Gamma Logistics (Med Risk)" },
  ];

  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden glass-panel relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Global Network</h3>
        <p className="text-sm text-gray-400">Live Supplier Risk Monitoring</p>
      </div>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Earth />
        {suppliers.map(s => (
          <SupplierNode key={s.id} position={s.pos} color={s.color} />
        ))}
        <Route start={suppliers[0].pos} end={suppliers[1].pos} />
        <Route start={suppliers[1].pos} end={suppliers[2].pos} />
        <OrbitControls enableZoom={true} enablePan={false} autoRotate={false} />
      </Canvas>
    </div>
  );
}
