import { Component, ErrorInfo, ReactNode, Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface HeatmapZone {
  id: number;
  position: [number, number, number];
  temperature: number;
  itemCount: number;
  category: string;
  turnoverRate: number;
}

const heatmapData: HeatmapZone[] = [
  { id: 1, position: [-4, 0, -2], temperature: 85, itemCount: 250, category: 'Electronics', turnoverRate: 12 },
  { id: 2, position: [-2, 0, -2], temperature: 60, itemCount: 180, category: 'Raw Materials', turnoverRate: 8 },
  { id: 3, position: [0, 0, -2], temperature: 40, itemCount: 150, category: 'Packaging', turnoverRate: 5 },
  { id: 4, position: [2, 0, -2], temperature: 75, itemCount: 200, category: 'Chemicals', turnoverRate: 10 },
  { id: 5, position: [4, 0, -2], temperature: 95, itemCount: 50, category: 'Critical Parts', turnoverRate: 20 },
  { id: 6, position: [-4, 0, 2], temperature: 30, itemCount: 300, category: 'Bulk Materials', turnoverRate: 3 },
  { id: 7, position: [-2, 0, 2], temperature: 55, itemCount: 220, category: 'Components', turnoverRate: 7 },
  { id: 8, position: [0, 0, 2], temperature: 70, itemCount: 175, category: 'Assemblies', turnoverRate: 9 },
  { id: 9, position: [2, 0, 2], temperature: 45, itemCount: 190, category: 'Supplies', turnoverRate: 6 },
  { id: 10, position: [4, 0, 2], temperature: 88, itemCount: 80, category: 'Emergency Stock', turnoverRate: 15 },
];

const getHeatColor = (temperature: number): string => {
  if (temperature >= 90) return '#FF1744';
  if (temperature >= 75) return '#FF5722';
  if (temperature >= 60) return '#FF9800';
  if (temperature >= 45) return '#FFC107';
  if (temperature >= 30) return '#4CAF50';
  return '#2196F3';
};

function HeatZone({ zone }: { zone: HeatmapZone }) {
  const [hovered, setHovered] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const color = getHeatColor(zone.temperature);
  const baseHeight = 0.2 + (zone.temperature / 100) * 1.2;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = Math.sin(clock.getElapsedTime() * 1.5 + zone.id) * 0.12;
    groupRef.current.position.y = baseHeight / 2 + pulse;
  });

  return (
    <group position={zone.position}>
      <group ref={groupRef} position={[0, baseHeight / 2, 0]}>
        <mesh
          castShadow
          onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
          onPointerOut={() => setHovered(false)}
        >
          <boxGeometry args={[1.4, baseHeight, 1.4]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 0.9 : 0.35}
            roughness={0.35}
            metalness={0.15}
            transparent
            opacity={0.92}
          />
        </mesh>
        <mesh position={[0, -baseHeight / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.85, 1.0, 32]} />
          <meshBasicMaterial color={color} transparent opacity={0.35} />
        </mesh>
        {hovered && (
          <Html position={[0, baseHeight / 2 + 0.6, 0]} center distanceFactor={8}>
            <div className="pointer-events-none min-w-[180px] rounded-xl border border-gray-100 bg-white/95 px-4 py-3 shadow-xl backdrop-blur">
              <h4 className="mb-2 text-sm font-semibold text-gray-800">{zone.category}</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between"><span className="text-gray-500">Heat</span><span className="font-bold" style={{ color }}>{zone.temperature}°</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Items</span><span className="font-semibold">{zone.itemCount}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Turnover</span><span className="font-semibold">{zone.turnoverRate}x/mo</span></div>
              </div>
            </div>
          </Html>
        )}
      </group>
    </group>
  );
}

function Floor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[16, 12]} />
        <meshStandardMaterial color="#F5F7FA" roughness={0.9} />
      </mesh>
      <gridHelper args={[16, 16, '#4A90E2', '#E5E7EB']} position={[0, 0.01, 0]} />
    </>
  );
}

function TemperatureLegend() {
  const items = [
    { label: 'Critical (90-100°)', color: '#FF1744' },
    { label: 'Hot (75-89°)', color: '#FF5722' },
    { label: 'Warm (60-74°)', color: '#FF9800' },
    { label: 'Mild (45-59°)', color: '#FFC107' },
    { label: 'Cool (30-44°)', color: '#4CAF50' },
    { label: 'Cold (0-29°)', color: '#2196F3' },
  ];

  return (
    <div className="pointer-events-none absolute bottom-4 left-4 max-w-[200px] rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-700">Heat Legend</h4>
      <div className="space-y-1.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
            <span className="text-[11px] text-gray-600">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FallbackCube() {
  return (
    <div className="flex h-full min-h-[500px] items-center justify-center bg-gradient-to-b from-white via-blue-50/30 to-gray-50">
      <div className="text-center">
        <div className="mx-auto mb-4 h-24 w-24 animate-[spin_5s_linear_infinite] rounded-2xl bg-gradient-to-br from-blue-500 via-violet-500 to-orange-500 shadow-xl" />
        <p className="font-semibold text-gray-700">3D preview unavailable</p>
        <p className="mt-1 text-xs text-gray-500">WebGL is unavailable. Inventory data is still accessible.</p>
      </div>
    </div>
  );
}

interface CanvasBoundaryProps { children: ReactNode; onError: () => void }
interface CanvasBoundaryState { hasError: boolean }

class CanvasBoundary extends Component<CanvasBoundaryProps, CanvasBoundaryState> {
  state: CanvasBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Warehouse heatmap failed to initialize:', error, info);
    this.props.onError();
  }

  render() {
    return this.state.hasError ? <FallbackCube /> : this.props.children;
  }
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch {
    return false;
  }
}

export default function WarehouseHeatmap() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [canvasFailed, setCanvasFailed] = useState(false);
  const totals = useMemo(() => ({
    items: heatmapData.reduce((sum, zone) => sum + zone.itemCount, 0),
    avgTurnover: heatmapData.reduce((sum, zone) => sum + zone.turnoverRate, 0) / heatmapData.length,
    hotZones: heatmapData.filter((zone) => zone.temperature >= 75).length,
  }), []);
  const webGLAvailable = typeof window !== 'undefined' && supportsWebGL();

  return (
    <div className="relative h-[500px] min-h-[500px] w-full overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-b from-white via-blue-50/30 to-gray-50 shadow-sm">
      {webGLAvailable && !canvasFailed ? (
        <CanvasBoundary onError={() => setCanvasFailed(true)}>
          <Canvas
            camera={{ position: [9, 9, 9], fov: 45, near: 0.1, far: 200 }}
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ display: 'block', height: '100%', width: '100%' }}
          >
            <Suspense fallback={null}>
              <ambientLight intensity={1.1} />
              <directionalLight position={[8, 14, 6]} intensity={1.6} castShadow />
              <pointLight position={[-8, 6, -8]} intensity={0.5} color="#E3F2FD" />
              <hemisphereLight args={['#ffffff', '#e3f2fd', 0.6]} />
              <Floor />
              {heatmapData.map((zone) => <HeatZone key={zone.id} zone={zone} />)}
              <OrbitControls target={[0, 1, 0]} maxPolarAngle={Math.PI / 2.15} minDistance={6} maxDistance={22} autoRotate={autoRotate} autoRotateSpeed={0.6} enableDamping dampingFactor={0.08} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      ) : <FallbackCube />}

      <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-white/90 px-4 py-2.5 shadow-lg backdrop-blur-md">
        <h3 className="text-base font-bold text-gray-800">Digital Twin — Warehouse Heatmap</h3>
        <p className="text-xs text-gray-500">Real-time inventory activity</p>
      </div>

      {webGLAvailable && !canvasFailed && (
        <button type="button" onClick={() => setAutoRotate((value) => !value)} className={`absolute right-4 top-4 rounded-xl px-3.5 py-2 text-xs font-medium shadow-md transition-all ${autoRotate ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-white/90 text-gray-700 hover:bg-white'}`}>
          {autoRotate ? '⏸ Pause' : '▶ Rotate'}
        </button>
      )}

      <TemperatureLegend />
      <div className="pointer-events-none absolute bottom-4 right-4 rounded-xl bg-white/90 p-4 shadow-lg backdrop-blur-md">
        <div className="space-y-2 text-xs">
          <div className="flex justify-between gap-6"><span className="text-gray-500">Hot Zones</span><span className="font-bold text-red-600">{totals.hotZones}</span></div>
          <div className="flex justify-between gap-6"><span className="text-gray-500">Total Items</span><span className="font-bold text-gray-800">{totals.items.toLocaleString()}</span></div>
          <div className="flex justify-between gap-6"><span className="text-gray-500">Avg Turnover</span><span className="font-bold text-gray-800">{totals.avgTurnover.toFixed(1)}x</span></div>
        </div>
      </div>
    </div>
  );
}
