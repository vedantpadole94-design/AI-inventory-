import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface RadarData {
  supplier: string;
  metrics: { label: string; value: number }[];
  color: string;
}

interface RadarChart3DProps {
  data: RadarData[];
  height?: number;
}

const RadarShape = ({ data }: { data: RadarData }) => {
  const points = useMemo(() => {
    const step = (Math.PI * 2) / data.metrics.length;
    return data.metrics.map((metric, index) => {
      const angle = index * step - Math.PI / 2;
      const radius = (metric.value / 100) * 2;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
  }, [data]);

  return (
    <group>
      {points.map((point, index) => {
        const next = points[(index + 1) % points.length];
        const vertices = new Float32Array([0, 0, 0, point.x, point.y, 0, next.x, next.y, 0]);
        return (
          <mesh key={index}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" count={3} array={vertices} itemSize={3} />
            </bufferGeometry>
            <meshBasicMaterial color={data.color} transparent opacity={0.25} side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      <Line points={[...points, points[0]]} color={data.color} lineWidth={2} />
      {data.metrics.map((metric, index) => {
        const angle = index * ((Math.PI * 2) / data.metrics.length) - Math.PI / 2;
        return (
          <Html key={metric.label} position={[Math.cos(angle) * 2.45, Math.sin(angle) * 2.45, 0]} center>
            <span className="whitespace-nowrap text-xs text-slate-600">{metric.label}</span>
          </Html>
        );
      })}
    </group>
  );
};

const RadarChart3D = ({ data, height = 400 }: RadarChart3DProps) => (
  <div className="relative w-full overflow-hidden rounded-2xl bg-gradient-to-br from-white to-violet-50" style={{ height }}>
    <Canvas orthographic camera={{ position: [0, 0, 6], zoom: 100 }}>
      <RadarShape data={data[0]} />
      {data.slice(1).map((item) => (
        <RadarShape key={item.supplier} data={item} />
      ))}
      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
    <div className="absolute bottom-4 left-4 rounded-xl bg-white/80 p-3 shadow-lg backdrop-blur-md">
      {data.map((item) => (
        <div key={item.supplier} className="flex items-center gap-2 text-xs text-slate-600">
          <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
          {item.supplier}
        </div>
      ))}
    </div>
  </div>
);

export default RadarChart3D;
