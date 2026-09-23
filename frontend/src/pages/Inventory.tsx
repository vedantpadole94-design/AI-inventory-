import React, { useState, useRef } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { DataTable } from '../design-system/components/DataTable';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { StatCard } from '../design-system/components/StatCard';
import { StaggerContainer, StaggerItem } from '../design-system/motion/StaggerContainer';
import { motion } from 'framer-motion';
import { ease, durations } from '../lib/motion/presets';
import { mockInventory, InventoryItem } from '../data/mockData';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { List, Box as BoxIcon, AlertCircle, RotateCcw, Layers, Warehouse, AlertTriangle, Clock } from 'lucide-react';
import { Column } from '../design-system/components/Table';

// 3D Shelf Component with discrete boxes
const WarehouseShelf = ({
  item,
  onSelect,
  isSelected,
}: {
  item: InventoryItem;
  onSelect: (item: InventoryItem) => void;
  isSelected: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const fillRatio = Math.min(1, item.currentStock / item.maxCapacity);

  // Muted category color map
  const colorMap: Record<string, string> = {
    'Steel & Metals': '#1E40AF',
    Aluminum: '#0E7490',
    Copper: '#B45309',
    Chemicals: '#15803D',
    Nickel: '#475569',
    Semiconductors: '#6B21A8',
  };

  const baseColor = colorMap[item.category] || '#57534E';
  const boxHeight = Math.max(0.4, fillRatio * 1.8);

  return (
    <group position={item.shelfPosition}>
      {/* Metal shelf rack frame */}
      <Box args={[1.6, 2.2, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#D6D3D1" wireframe transparent opacity={0.35} />
      </Box>

      {/* Stock unit box */}
      <Box
        args={[1.3, boxHeight, 0.9]}
        position={[0, -1.0 + boxHeight / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <meshStandardMaterial
          color={isSelected ? '#1E3A8A' : hovered ? '#2563EB' : baseColor}
          roughness={0.4}
        />
      </Box>

      {/* Label above rack */}
      <Text
        position={[0, 1.3, 0]}
        fontSize={0.22}
        color={hovered || isSelected ? '#1E40AF' : '#57534E'}
        anchorX="center"
        anchorY="middle"
      >
        {item.sku}
      </Text>
    </group>
  );
};

export const Inventory: React.FC = () => {
  const [viewMode, setViewMode] = useState<'3d' | 'table'>('3d');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(mockInventory[0]);
  const controlsRef = useRef<any>(null);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const columns: Column<InventoryItem>[] = [
    {
      key: 'sku',
      header: 'SKU / Code',
      sortable: true,
      render: (i) => <span className="font-mono text-accent-primary font-medium">{i.sku}</span>,
    },
    {
      key: 'name',
      header: 'Material Name',
      sortable: true,
      render: (i) => <span className="font-medium text-text-primary">{i.name}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (i) => <span className="text-text-secondary">{i.category}</span>,
    },
    {
      key: 'currentStock',
      header: 'Stock / Capacity',
      align: 'right',
      sortable: true,
      render: (i) => (
        <span className="tabular-nums">
          <span className="font-semibold text-text-primary">{i.currentStock}</span> / {i.maxCapacity} MT
        </span>
      ),
    },
    {
      key: 'warehouseLocation',
      header: 'Bay Location',
      align: 'center',
      render: (i) => <span className="px-[6px] py-[2px] bg-subtle rounded border border-border-default text-[12px] font-mono">{i.warehouseLocation}</span>,
    },
    {
      key: 'status',
      header: 'Stock Status',
      align: 'center',
      sortable: true,
      render: (i) => {
        const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
          Healthy: 'success',
          'Low Stock': 'warning',
          Critical: 'danger',
          Overstock: 'info',
        };
        return <Badge variant={variants[i.status] || 'neutral'} size="sm" dot>{i.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-[20px]">
      <PageHeader
        title="Inventory & Digital Twin"
        description="Real-time multi-echelon stock levels, reorder alerts, and 3D spatial isometric warehouse monitoring."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Inventory' }]}
        actions={
          <>
            <div className="relative flex items-center bg-subtle border border-border-default rounded-[8px] p-[2px] shadow-xs">
              <button
                onClick={() => setViewMode('3d')}
                className={`relative z-10 flex items-center gap-[6px] px-[10px] py-[6px] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  viewMode === '3d' ? 'text-amber-800 font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {viewMode === '3d' && (
                  <motion.span
                    layoutId="inventoryViewModePill"
                    className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-10"
                    transition={{ duration: durations.fast, ease: ease.out }}
                  />
                )}
                <BoxIcon size={15} /> <span>3D Digital Twin</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`relative z-10 flex items-center gap-[6px] px-[10px] py-[6px] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer ${
                  viewMode === 'table' ? 'text-amber-800 font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {viewMode === 'table' && (
                  <motion.span
                    layoutId="inventoryViewModePill"
                    className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-10"
                    transition={{ duration: durations.fast, ease: ease.out }}
                  />
                )}
                <List size={15} /> <span>Table View</span>
              </button>
            </div>
            <Button
              variant="secondary"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={resetCamera}
            >
              Reset 3D View
            </Button>
          </>
        }
      />

      {/* INVENTORY KPI ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <StatCard
          label="Tracked SKU Inventory"
          countTo={1420}
          accentColor="#D97706"
          trend={{ value: "+45", direction: "up", label: "added this quarter" }}
          sparklineData={[1320, 1340, 1370, 1390, 1405, 1412, 1420]}
          icon={<Layers size={18} className="text-amber-600" />}
        />
        <StatCard
          label="Warehouse Bay Capacity"
          countTo={78.4}
          decimals={1}
          formatter={(v) => `${v}%`}
          accentColor="#D97706"
          trend={{ value: "Optimal", direction: "neutral", label: "within safety bounds" }}
          sparklineData={[72, 74, 76, 75, 77, 78, 78.4]}
          icon={<Warehouse size={18} className="text-amber-600" />}
        />
        <StatCard
          label="Critical Low Stock Alerts"
          countTo={14}
          accentColor="#B91C1C"
          trend={{ value: "-3", direction: "down", label: "restocked today" }}
          sparklineData={[24, 22, 19, 18, 16, 15, 14]}
          icon={<AlertTriangle size={18} className="text-semantic-danger" />}
        />
        <StatCard
          label="Avg Stock Turnover"
          countTo={18.2}
          decimals={1}
          formatter={(v) => `${v}d`}
          accentColor="#059669"
          trend={{ value: "↓ 1.4d", direction: "down", label: "faster cycle" }}
          sparklineData={[21.0, 20.4, 19.8, 19.2, 18.9, 18.4, 18.2]}
          icon={<Clock size={18} className="text-semantic-success" />}
        />
      </div>

      {viewMode === '3d' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
          {/* 3D CANVAS (8 cols) */}
          <div className="lg:col-span-8 bg-white border border-border-default rounded-[12px] shadow-xs overflow-hidden h-[540px] relative flex flex-col">
            <div className="p-[14px] px-[18px] border-b border-border-default bg-subtle/40 flex items-center justify-between z-10">
              <div>
                <span className="text-[13px] font-semibold text-text-primary">Bay Floor Plan - Main Receiving Depot</span>
                <span className="text-[11px] text-text-tertiary block">Drag to rotate • Scroll to zoom • Click pallet rack to inspect</span>
              </div>
              <div className="flex items-center gap-[12px] text-[11px] text-text-secondary">
                <span className="flex items-center gap-[4px]"><span className="w-[8px] h-[8px] rounded-full bg-[#1E40AF]" /> Steel</span>
                <span className="flex items-center gap-[4px]"><span className="w-[8px] h-[8px] rounded-full bg-[#0E7490]" /> Aluminum</span>
                <span className="flex items-center gap-[4px]"><span className="w-[8px] h-[8px] rounded-full bg-[#B45309]" /> Copper</span>
                <span className="flex items-center gap-[4px]"><span className="w-[8px] h-[8px] rounded-full bg-[#15803D]" /> Chemicals</span>
              </div>
            </div>

            <div className="flex-1 w-full h-full bg-[#F5F5F4]">
              <Canvas camera={{ position: [7, 7, 9], fov: 42 }}>
                <ambientLight intensity={0.7} />
                <directionalLight position={[10, 15, 10]} intensity={0.8} />

                {/* Warehouse Floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]}>
                  <planeGeometry args={[16, 16]} />
                  <meshStandardMaterial color="#E7E5E4" />
                </mesh>
                <gridHelper args={[16, 16, '#D6D3D1', '#E7E5E4']} position={[0, -1.09, 0]} />

                {/* Shelves */}
                {mockInventory.map((item) => (
                  <WarehouseShelf
                    key={item.id}
                    item={item}
                    onSelect={(it) => setSelectedItem(it)}
                    isSelected={selectedItem?.id === item.id}
                  />
                ))}

                <OrbitControls ref={controlsRef} maxPolarAngle={Math.PI / 2.1} minDistance={4} maxDistance={20} />
              </Canvas>
            </div>
          </div>

          {/* SIDE PANEL: SELECTED ITEM DETAILS (4 cols) */}
          <div className="lg:col-span-4">
            {selectedItem ? (
              <Card className="h-full">
                <CardHeader
                  title={selectedItem.name}
                  description={`Location: ${selectedItem.warehouseLocation}`}
                  action={
                    <Badge variant={selectedItem.status === 'Healthy' ? 'success' : selectedItem.status === 'Critical' ? 'danger' : 'warning'} size="sm" dot>
                      {selectedItem.status}
                    </Badge>
                  }
                />
                <CardBody className="space-y-[18px]">
                  <div>
                    <div className="flex justify-between text-[12px] text-text-tertiary mb-[4px]">
                      <span>Capacity Utilization</span>
                      <span className="tabular-nums font-semibold text-text-primary">
                        {((selectedItem.currentStock / selectedItem.maxCapacity) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-subtle h-[8px] rounded-full overflow-hidden border border-border-default">
                      <div
                        className={`h-full rounded-full ${selectedItem.currentStock < selectedItem.reorderPoint ? 'bg-semantic-danger' : 'bg-accent-primary'}`}
                        style={{ width: `${(selectedItem.currentStock / selectedItem.maxCapacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-[12px] p-[12px] bg-subtle rounded-[8px] border border-border-default text-[13px]">
                    <div>
                      <span className="text-[11px] text-text-tertiary">Current Stock</span>
                      <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-[2px]">
                        {selectedItem.currentStock} MT
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-tertiary">Reorder Threshold</span>
                      <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-[2px]">
                        {selectedItem.reorderPoint} MT
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-tertiary">Unit Valuation</span>
                      <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-[2px]">
                        ${selectedItem.unitCost}/MT
                      </div>
                    </div>
                    <div>
                      <span className="text-[11px] text-text-tertiary">Holding Value</span>
                      <div className="text-[16px] font-semibold text-text-primary tabular-nums mt-[2px]">
                        ${selectedItem.totalValue.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-[8px] text-[13px]">
                    <div className="flex justify-between py-[4px] border-b border-border-default">
                      <span className="text-text-tertiary">SKU Code</span>
                      <span className="font-mono text-text-primary font-medium">{selectedItem.sku}</span>
                    </div>
                    <div className="flex justify-between py-[4px] border-b border-border-default">
                      <span className="text-text-tertiary">Category</span>
                      <span className="text-text-primary">{selectedItem.category}</span>
                    </div>
                    <div className="flex justify-between py-[4px] border-b border-border-default">
                      <span className="text-text-tertiary">Turnover Velocity</span>
                      <span className="text-text-primary font-medium">{selectedItem.turnoverRate}x / year</span>
                    </div>
                  </div>

                  {selectedItem.currentStock <= selectedItem.reorderPoint && (
                    <div className="p-[12px] bg-semantic-danger-bg border border-rose-200 rounded-[8px] flex items-start gap-[10px] text-[12px] text-semantic-danger">
                      <AlertCircle size={16} className="shrink-0 mt-[2px]" />
                      <div>
                        <span className="font-semibold">Replenishment Alert</span>
                        <p className="mt-[2px]">Stock is below reorder point. Immediate purchase order recommended.</p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => alert(`Drafting automated reorder PO for ${selectedItem.name}...`)}
                  >
                    Draft Replenishment PO
                  </Button>
                </CardBody>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center p-[24px] text-center text-text-tertiary bg-white border border-border-default rounded-[12px]">
                Click any pallet bay in the 3D view to inspect stock specifications.
              </div>
            )}
          </div>
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={mockInventory}
          keyExtractor={(i) => i.id}
          searchableKey="name"
          searchPlaceholder="Search inventory by name or SKU..."
          onRowClick={(i) => {
            setSelectedItem(i);
            setViewMode('3d');
          }}
          pageSize={10}
        />
      )}
    </div>
  );
};
