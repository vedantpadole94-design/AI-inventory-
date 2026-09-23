import React, { useState, useMemo } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { DataTable } from '../design-system/components/DataTable';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Tabs, TabItem } from '../design-system/components/Tabs';
import { Drawer } from '../design-system/components/Drawer';
import { Modal } from '../design-system/components/Modal';
import { Input } from '../design-system/components/Input';
import { Select } from '../design-system/components/Select';
import { mockOrders, mockSuppliers, PurchaseOrder } from '../data/mockData';
import { Plus, Download, CheckCircle2, Clock, Truck } from 'lucide-react';
import { Column } from '../design-system/components/Table';
import { useSearchParams } from 'react-router-dom';

export const Orders: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(() => {
    const poParam = searchParams.get('po');
    if (poParam) return mockOrders.find((o) => o.id === poParam) || null;
    return null;
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(!!selectedOrder);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(searchParams.get('action') === 'new');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<Record<string, { user: string; text: string; time: string }[]>>({
    'PO-2024-00001': [
      { user: 'Elena Rostova', text: 'Confirmed payment terms Net 30 with supplier accounting.', time: '2 days ago' },
      { user: 'Marcus Thorne', text: 'Customs clearance documents validated.', time: '1 day ago' },
    ],
  });

  const tabs: TabItem[] = [
    { id: 'All', label: 'All Orders', count: orders.length },
    { id: 'Pending', label: 'Pending', count: orders.filter((o) => o.status === 'Pending').length },
    { id: 'In Transit', label: 'In Transit', count: orders.filter((o) => o.status === 'In Transit').length },
    { id: 'Delivered', label: 'Delivered', count: orders.filter((o) => o.status === 'Delivered').length },
    { id: 'Delayed', label: 'Delayed', count: orders.filter((o) => o.status === 'Delayed').length },
    { id: 'Cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'Cancelled').length },
  ];

  const filteredOrders = useMemo(() => {
    if (activeTab === 'All') return orders;
    return orders.filter((o) => o.status === activeTab);
  }, [orders, activeTab]);

  const [newPoData, setNewPoData] = useState({
    supplierId: mockSuppliers[0].id,
    itemDescription: 'Industrial Grade Heavy Steel Plates',
    quantity: 500,
    unitPrice: 850,
  });

  const handleCreatePo = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = mockSuppliers.find((s) => s.id === newPoData.supplierId) || mockSuppliers[0];
    const created: PurchaseOrder = {
      id: `PO-2024-00${orders.length + 1}`,
      supplierId: sup.id,
      supplierName: sup.name,
      commodity: sup.commodity,
      itemDescription: newPoData.itemDescription,
      quantity: Number(newPoData.quantity),
      unit: 'Units',
      unitPrice: Number(newPoData.unitPrice),
      totalAmount: Number(newPoData.quantity) * Number(newPoData.unitPrice),
      orderDate: new Date().toISOString().split('T')[0],
      expectedDelivery: new Date(Date.now() + sup.leadTimeDays * 86400000).toISOString().split('T')[0],
      status: 'Pending',
      paymentTerms: 'Net 30',
      buyer: 'Elena Rostova',
    };

    setOrders([created, ...orders]);
    setIsCreateModalOpen(false);
    setSelectedOrder(created);
    setIsDrawerOpen(true);
  };

  const handleAddComment = () => {
    if (!commentInput.trim() || !selectedOrder) return;
    const current = comments[selectedOrder.id] || [];
    setComments({
      ...comments,
      [selectedOrder.id]: [
        ...current,
        { user: 'Current User', text: commentInput, time: 'Just now' },
      ],
    });
    setCommentInput('');
  };

  const columns: Column<PurchaseOrder>[] = [
    {
      key: 'id',
      header: 'Order ID',
      sortable: true,
      render: (o) => <span className="font-mono text-accent-primary font-medium">{o.id}</span>,
    },
    {
      key: 'supplierName',
      header: 'Vendor Name',
      sortable: true,
      render: (o) => <span className="font-medium text-text-primary">{o.supplierName}</span>,
    },
    {
      key: 'itemDescription',
      header: 'Commodity Item',
      sortable: true,
      render: (o) => <span className="text-text-secondary truncate max-w-[200px] block">{o.itemDescription}</span>,
    },
    {
      key: 'quantity',
      header: 'Quantity',
      align: 'right',
      sortable: true,
      render: (o) => <span className="tabular-nums">{o.quantity.toLocaleString()} {o.unit}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Total Value',
      align: 'right',
      sortable: true,
      render: (o) => <span className="tabular-nums font-semibold">${o.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'orderDate',
      header: 'Ordered',
      sortable: true,
      render: (o) => <span className="tabular-nums text-text-secondary">{o.orderDate}</span>,
    },
    {
      key: 'expectedDelivery',
      header: 'Est. Arrival',
      sortable: true,
      render: (o) => <span className="tabular-nums text-text-secondary">{o.expectedDelivery}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      sortable: true,
      render: (o) => {
        const variants: Record<string, 'success' | 'info' | 'warning' | 'danger' | 'neutral'> = {
          Delivered: 'success',
          'In Transit': 'info',
          Pending: 'warning',
          Delayed: 'danger',
          Cancelled: 'neutral',
        };
        return <Badge variant={variants[o.status] || 'neutral'} size="sm" dot>{o.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-[20px]">
      <PageHeader
        title="Purchase Orders"
        description="Fulfillment tracking, invoice matching, and delivery logistics for 500+ enterprise procurement requisitions."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Purchase Orders' }]}
        actions={
          <>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert(`Exporting ${filteredOrders.length} orders to CSV...`)}
            >
              Export Orders
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create PO
            </Button>
          </>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <DataTable
        columns={columns}
        data={filteredOrders}
        keyExtractor={(o) => o.id}
        searchableKey="id"
        searchPlaceholder="Search by PO ID, supplier, or commodity..."
        onRowClick={(o) => {
          setSelectedOrder(o);
          setIsDrawerOpen(true);
        }}
        pageSize={12}
      />

      {/* ORDER DETAIL DRAWER (600px wide) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedOrder ? `Purchase Order ${selectedOrder.id}` : 'Order Details'}
        description={selectedOrder ? `${selectedOrder.supplierName} • Ordered on ${selectedOrder.orderDate}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
            <Button
              variant="primary"
              onClick={() => alert(`Downloading formal PDF Invoice for ${selectedOrder?.id}...`)}
            >
              Download PDF PO
            </Button>
          </>
        }
      >
        {selectedOrder && (
          <div className="space-y-[24px]">
            {/* Status Highlight */}
            <div className="p-[16px] bg-subtle border border-border-default rounded-[10px] flex items-center justify-between">
              <div>
                <span className="text-[12px] text-text-tertiary">Current Logistics Status</span>
                <div className="mt-[2px]">
                  <Badge variant={selectedOrder.status === 'Delivered' ? 'success' : selectedOrder.status === 'Delayed' ? 'danger' : 'info'} size="md" dot>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[12px] text-text-tertiary">Total Billed Amount</span>
                <div className="text-[18px] font-semibold text-text-primary tabular-nums mt-[2px]">
                  ${selectedOrder.totalAmount.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h4 className="text-[14px] font-semibold text-text-primary mb-[10px]">Requisition Line Items</h4>
              <div className="border border-border-default rounded-[8px] overflow-hidden text-[13px]">
                <table className="w-full text-left">
                  <thead className="bg-subtle/60 border-b border-border-default text-text-secondary text-[12px]">
                    <tr>
                      <th className="p-[10px] px-[14px]">Description</th>
                      <th className="p-[10px] text-right">Qty</th>
                      <th className="p-[10px] text-right">Unit Price</th>
                      <th className="p-[10px] px-[14px] text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-default">
                    <tr>
                      <td className="p-[12px] px-[14px] font-medium text-text-primary">
                        {selectedOrder.itemDescription}
                      </td>
                      <td className="p-[12px] text-right tabular-nums">
                        {selectedOrder.quantity.toLocaleString()} {selectedOrder.unit}
                      </td>
                      <td className="p-[12px] text-right tabular-nums">
                        ${selectedOrder.unitPrice.toFixed(2)}
                      </td>
                      <td className="p-[12px] px-[14px] text-right tabular-nums font-semibold">
                        ${selectedOrder.totalAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Timeline */}
            <div>
              <h4 className="text-[14px] font-semibold text-text-primary mb-[12px]">Fulfillment Milestones</h4>
              <div className="space-y-[12px] pl-[6px]">
                <div className="flex items-start gap-[12px]">
                  <CheckCircle2 size={16} className="text-semantic-success mt-[2px] shrink-0" />
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">PO Issued & Accepted</p>
                    <p className="text-[12px] text-text-tertiary">{selectedOrder.orderDate} by {selectedOrder.buyer}</p>
                  </div>
                </div>
                <div className="flex items-start gap-[12px]">
                  <Truck size={16} className={selectedOrder.status !== 'Pending' ? 'text-accent-primary mt-[2px] shrink-0' : 'text-text-disabled mt-[2px] shrink-0'} />
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">Customs Clearance & Dispatch</p>
                    <p className="text-[12px] text-text-tertiary">Carrier: Maersk Global Logistics (B/L #MAEU-849102)</p>
                  </div>
                </div>
                <div className="flex items-start gap-[12px]">
                  <Clock size={16} className={selectedOrder.status === 'Delivered' ? 'text-semantic-success mt-[2px] shrink-0' : 'text-text-disabled mt-[2px] shrink-0'} />
                  <div>
                    <p className="text-[13px] font-medium text-text-primary">Expected Delivery at Receiving Bay</p>
                    <p className="text-[12px] text-text-tertiary">{selectedOrder.expectedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit Notes Thread */}
            <div>
              <h4 className="text-[14px] font-semibold text-text-primary mb-[10px]">Internal Audit & Notes</h4>
              <div className="space-y-[10px] mb-[12px]">
                {(comments[selectedOrder.id] || []).map((c, i) => (
                  <div key={i} className="p-[10px] bg-subtle rounded-[8px] text-[13px]">
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary mb-[2px]">
                      <span className="font-semibold text-text-primary">{c.user}</span>
                      <span>{c.time}</span>
                    </div>
                    <p className="text-text-secondary">{c.text}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-[8px]">
                <Input
                  placeholder="Add internal audit note..."
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                />
                <Button variant="secondary" size="md" onClick={handleAddComment}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* CREATE ORDER MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Draft New Purchase Order"
        description="Initiate a commercial procurement order against an approved master contract."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreatePo}>
              Issue Order
            </Button>
          </>
        }
      >
        <form onSubmit={handleCreatePo} className="space-y-[14px]">
          <Select
            label="Designated Supplier"
            value={newPoData.supplierId}
            onChange={(e) => setNewPoData({ ...newPoData, supplierId: e.target.value })}
            options={mockSuppliers.map((s) => ({ label: `${s.name} (${s.commodity})`, value: s.id }))}
          />
          <Input
            label="Line Item Description"
            required
            value={newPoData.itemDescription}
            onChange={(e) => setNewPoData({ ...newPoData, itemDescription: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-[12px]">
            <Input
              label="Order Quantity (Units / MT)"
              type="number"
              required
              value={newPoData.quantity}
              onChange={(e) => setNewPoData({ ...newPoData, quantity: Number(e.target.value) })}
            />
            <Input
              label="Agreed Unit Price ($ USD)"
              type="number"
              required
              value={newPoData.unitPrice}
              onChange={(e) => setNewPoData({ ...newPoData, unitPrice: Number(e.target.value) })}
            />
          </div>
          <div className="p-[12px] bg-subtle rounded-[8px] text-[13px] flex items-center justify-between">
            <span className="text-text-secondary">Estimated Total Obligation:</span>
            <span className="font-semibold text-text-primary text-[15px] tabular-nums">
              ${(newPoData.quantity * newPoData.unitPrice).toLocaleString()}
            </span>
          </div>
        </form>
      </Modal>
    </div>
  );
};
