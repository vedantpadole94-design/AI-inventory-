import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const Shelf = ({ position, stockLevel }: { position: [number, number, number], stockLevel: number }) => {
  return (
    <group position={position}>
      {/* Frame */}
      <Box args={[2, 4, 1]} material-color="#333" material-wireframe />
      {/* Boxes on shelf based on stock level */}
      {[...Array(5)].map((_, i) => {
        const fillThreshold = (i + 1) * 20;
        const color = stockLevel < 30 ? "#ef4444" : stockLevel > 70 ? "#10b981" : "#f59e0b";
        return stockLevel >= fillThreshold ? (
          <Box key={i} args={[1.8, 0.6, 0.8]} position={[0, -1.5 + (i * 0.8), 0]}>
            <meshStandardMaterial color={color} opacity={0.8} transparent />
          </Box>
        ) : null;
      })}
    </group>
  );
};

export default function WarehouseDigitalTwin() {
  return (
    <div className="w-full h-full min-h-[400px] rounded-xl overflow-hidden glass-panel relative">
      <div className="absolute top-4 left-4 z-10">
        <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Digital Twin</h3>
        <p className="text-sm text-gray-400">Warehouse Inventory Heatmap</p>
      </div>
      <Canvas camera={{ position: [5, 5, 8], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        <gridHelper args={[20, 20, "#333", "#222"]} position={[0, -2.49, 0]} />

        {/* Shelves */}
        <Shelf position={[-3, 0, -2]} stockLevel={85} />
        <Shelf position={[0, 0, -2]} stockLevel={45} />
        <Shelf position={[3, 0, -2]} stockLevel={15} />
        
        <Shelf position={[-3, 0, 2]} stockLevel={90} />
        <Shelf position={[0, 0, 2]} stockLevel={60} />
        <Shelf position={[3, 0, 2]} stockLevel={100} />

        <OrbitControls />
      </Canvas>
    </div>
  );
}
