import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

interface SupplierNode {
  id: number;
  name: string;
  country: string;
  lat: number;
  lng: number;
  risk: 'low' | 'medium' | 'high';
  quality: number;
}

const supplierData: SupplierNode[] = [
  { id: 1, name: 'TechCore Industries', country: 'India', lat: 20.5937, lng: 78.9629, risk: 'low', quality: 95 },
  { id: 2, name: 'GlobalChem Solutions', country: 'China', lat: 35.8617, lng: 104.1954, risk: 'medium', quality: 82 },
  { id: 3, name: 'PrecisionParts GmbH', country: 'Germany', lat: 51.1657, lng: 10.4515, risk: 'low', quality: 98 },
  { id: 4, name: 'EcoTextiles Ltd', country: 'Vietnam', lat: 14.0583, lng: 108.2772, risk: 'high', quality: 65 },
  { id: 5, name: 'SiliconValley Components', country: 'USA', lat: 37.0902, lng: -95.7129, risk: 'low', quality: 92 },
  { id: 6, name: 'NipponPrecision Co', country: 'Japan', lat: 36.2048, lng: 138.2529, risk: 'low', quality: 96 },
  { id: 7, name: 'EuroChem AG', country: 'Switzerland', lat: 46.8182, lng: 8.2275, risk: 'medium', quality: 78 },
  { id: 8, name: 'BrazilMetals', country: 'Brazil', lat: -14.235, lng: -51.9253, risk: 'high', quality: 58 },
];

const latLngToVector3 = (lat: number, lng: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
};

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) earthRef.current.rotation.y += 0.0008;
  });

  return (
    <mesh ref={earthRef}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshPhongMaterial color="#B3E5FC" specular="#4A90E2" shininess={15} transparent opacity={0.95} />
    </mesh>
  );
};

const SupplierMarker = ({ supplier }: { supplier: SupplierNode }) => {
  const [hovered, setHovered] = useState(false);
  const position = latLngToVector3(supplier.lat, supplier.lng, 1.03);
  const color = supplier.risk === 'low' ? '#4CAF50' : supplier.risk === 'medium' ? '#FFA000' : '#FF6B6B';

  return (
    <group position={position}>
      <mesh onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[hovered ? 0.035 : 0.022, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 0.5} />
      </mesh>
      {hovered && (
        <Html position={[0, 0.06, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="min-w-[150px] rounded-xl bg-white/95 px-4 py-2 text-center shadow-lg backdrop-blur">
            <p className="text-sm font-semibold text-gray-800">{supplier.name}</p>
            <p className="text-xs text-gray-500">{supplier.country}</p>
            <p className="mt-1 text-xs text-gray-600">{supplier.risk.toUpperCase()} RISK · {supplier.quality}% quality</p>
          </div>
        </Html>
      )}
    </group>
  );
};

const SupplyChainGlobe = () => (
  <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-teal-50 md:h-[500px]">
    <Canvas camera={{ position: [0, 0.3, 2.8], fov: 45 }} dpr={[1, 2]}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#E3F2FD" />
        <Earth />
        <mesh>
          <sphereGeometry args={[1.08, 64, 64]} />
          <meshBasicMaterial color="#E3F2FD" transparent opacity={0.12} side={THREE.BackSide} />
        </mesh>
        {supplierData.map((supplier) => <SupplierMarker key={supplier.id} supplier={supplier} />)}
        <Stars radius={3} depth={50} count={500} factor={2} fade speed={0.3} />
        <OrbitControls enablePan={false} rotateSpeed={0.4} minDistance={1.8} maxDistance={4.5} />
      </Suspense>
    </Canvas>
    <div className="pointer-events-none absolute left-4 top-4 rounded-xl bg-white/85 px-4 py-2 shadow-lg backdrop-blur-md">
      <h3 className="text-lg font-bold text-gray-800">Global Supply Chain</h3>
      <p className="text-xs text-gray-500">Interactive 3D visualization</p>
    </div>
    <div className="pointer-events-none absolute bottom-4 left-4 rounded-xl bg-white/85 p-3 shadow-lg backdrop-blur-md">
      <h4 className="mb-2 text-sm font-semibold text-gray-700">Supplier Risk</h4>
      <div className="space-y-1 text-xs text-gray-600">
        <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-green-500" />Low Risk</p>
        <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-amber-500" />Medium Risk</p>
        <p><span className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500" />High Risk</p>
      </div>
    </div>
  </div>
);

export default SupplyChainGlobe;
