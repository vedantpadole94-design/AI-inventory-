import { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BarData {
  label: string;
  value: number;
  color: string;
}

interface BarChart3DProps {
  data: BarData[];
  title?: string;
  height?: number;
}

const AnimatedBar = ({
  data,
  index,
  maxValue,
  offset,
}: {
  data: BarData;
  index: number;
  maxValue: number;
  offset: number;
}) => {
  const [hovered, setHovered] = useState(false);
  const meshRef = useRef<THREE.Mesh>(null);
  const height = Math.max((data.value / maxValue) * 3, 0.05);

  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? height * 1.08 : height;
    meshRef.current.scale.y += (target - meshRef.current.scale.y) * 0.12;
    meshRef.current.position.y = meshRef.current.scale.y / 2;
  });

  return (
    <group position={[index * 1.2 - offset, 0, 0]}>
      <mesh
        ref={meshRef}
        scale={[0.8, height, 0.8]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={hovered ? 0.45 : 0.1}
          roughness={0.3}
        />
      </mesh>
      <Text position={[0, -0.3, 0]} fontSize={0.22} color="#475569" anchorX="center">
        {data.label}
      </Text>
      {hovered && (
        <Text position={[0, height + 0.25, 0]} fontSize={0.2} color="#0f172a" anchorX="center">
          {data.value.toLocaleString()}
        </Text>
      )}
    </group>
  );
};

const BarChart3D = ({ data, title, height = 400 }: BarChart3DProps) => {
  const maxValue = useMemo(() => Math.max(...data.map((item) => item.value), 1), [data]);
  const offset = (data.length - 1) * 0.6;

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-sky-50" style={{ height }}>
      <Canvas camera={{ position: [0, 2.8, Math.max(6, data.length * 0.8)], fov: 45 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 8, 5]} intensity={1.2} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <planeGeometry args={[data.length * 1.5, 5]} />
          <meshStandardMaterial color="#f8fafc" />
        </mesh>
        <gridHelper args={[data.length * 1.5, 10, '#93c5fd', '#e2e8f0']} position={[0, -0.49, 0]} />
        {data.map((item, index) => (
          <AnimatedBar key={item.label} data={item} index={index} maxValue={maxValue} offset={offset} />
        ))}
        <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.2} minDistance={3} maxDistance={15} />
      </Canvas>
      {title && (
        <div className="absolute left-4 top-4 rounded-xl bg-white/80 px-4 py-2 shadow-lg backdrop-blur-md">
          <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>
      )}
    </div>
  );
};

export default BarChart3D;
