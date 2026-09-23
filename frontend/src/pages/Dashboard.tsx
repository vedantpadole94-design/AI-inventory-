import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { StatCard } from '../design-system/components/StatCard';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Table, Column } from '../design-system/components/Table';
import { StaggerContainer, StaggerItem } from '../design-system/motion/StaggerContainer';
import { mockSuppliers, mockOrders, mockActivityFeed, PurchaseOrder } from '../data/mockData';
import { Download, RefreshCw, ArrowUpRight, Clock, Users, ShoppingCart, Activity, DollarSign, Sparkles } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Spend trend data (last 12 months in USD Millions)
  const spendTrendData = [
    { month: 'Oct 23', spend: 1.85, baseline: 1.90 },
    { month: 'Nov 23', spend: 2.10, baseline: 2.00 },
    { month: 'Dec 23', spend: 2.45, baseline: 2.20 },
    { month: 'Jan 24', spend: 1.95, baseline: 2.10 },
    { month: 'Feb 24', spend: 2.05, baseline: 2.15 },
    { month: 'Mar 24', spend: 2.30, baseline: 2.25 },
    { month: 'Apr 24', spend: 2.15, baseline: 2.30 },
    { month: 'May 24', spend: 2.40, baseline: 2.35 },
    { month: 'Jun 24', spend: 2.60, baseline: 2.40 },
    { month: 'Jul 24', spend: 2.35, baseline: 2.45 },
    { month: 'Aug 24', spend: 2.25, baseline: 2.50 },
    { month: 'Sep 24', spend: 2.40, baseline: 2.55 },
  ];

  // Order status distribution
  const orderStatusData = [
    { name: 'Delivered', value: 390, color: '#15803D' },
    { name: 'In Transit', value: 40, color: '#2563EB' },
    { name: 'Pending', value: 30, color: '#D97706' },
    { name: 'Delayed', value: 25, color: '#B91C1C' },
    { name: 'Cancelled', value: 15, color: '#71717A' },
  ];

  // Top 5 Suppliers by Performance
  const topSuppliers = [...mockSuppliers]
    .sort((a, b) => b.qualityScore + b.deliveryScore - (a.qualityScore + a.deliveryScore))
    .slice(0, 5);

  // Upcoming deliveries
  const upcomingOrders = mockOrders
    .filter((o) => o.status === 'In Transit' || o.status === 'Pending' || o.status === 'Delayed')
    .slice(0, 6);

  const upcomingColumns: Column<PurchaseOrder>[] = [
    {
      key: 'id',
      header: 'PO Number',
      render: (o) => <span className="font-mono text-accent-primary font-medium">{o.id}</span>,
    },
    {
      key: 'supplierName',
      header: 'Supplier',
      render: (o) => (
        <span
          className="font-medium hover:underline cursor-pointer"
          onClick={() => navigate(`/suppliers/${o.supplierId}`)}
        >
          {o.supplierName}
        </span>
      ),
    },
    {
      key: 'itemDescription',
      header: 'Item Lot / Material',
      render: (o) => <span className="text-text-secondary truncate max-w-[220px] block">{o.itemDescription}</span>,
    },
    {
      key: 'expectedDelivery',
      header: 'Expected Date',
      render: (o) => <span className="tabular-nums text-text-secondary">{o.expectedDelivery}</span>,
    },
    {
      key: 'totalAmount',
      header: 'Amount',
      align: 'right',
      render: (o) => <span className="tabular-nums font-medium">${o.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
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
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (o) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/orders?po=${o.id}`)}
          className="text-[12px] h-[28px] px-[8px]"
        >
          Details
        </Button>
      ),
    },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 400);
  };

  return (
    <StaggerContainer className="space-y-[24px]">
      <StaggerItem>
        <div className="rounded-[12px] p-[20px] bg-hero-gradient border border-border-default shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-[16px]">
          <div>
            <div className="flex items-center gap-[8px]">
              <span className="px-[8px] py-[2px] rounded-full bg-white text-accent-primary text-[11px] font-semibold border border-indigo-100 shadow-xs flex items-center gap-[4px]">
                <Sparkles size={12} /> Executive Intelligence
              </span>
              <span className="text-[12px] text-text-tertiary">Real-time procurement telemetry</span>
            </div>
            <h1 className="text-[24px] font-semibold text-text-primary tracking-tight mt-[6px]">
              Procurement Command Center
            </h1>
            <p className="text-[13px] text-text-secondary mt-[2px]">
              Enterprise supply chain metrics, commodity spend trends, and active supplier performance.
            </p>
          </div>
          <div className="flex items-center gap-[8px] shrink-0">
            <Button
              variant="secondary"
              size="sm"
              icon={<RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert('Exporting monthly procurement report (CSV / PDF)...')}
            >
              Export Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<ArrowUpRight size={14} />}
              onClick={() => navigate('/orders?action=new')}
            >
              Create PO
            </Button>
          </div>
        </div>
      </StaggerItem>

      {/* ROW 1: 4 STAT CARDS */}
      <StaggerItem>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          <StatCard
            label="Total Active Suppliers"
            countTo={214}
            accentColor="#4F46E5"
            trend={{ value: "↑ 12", direction: "up", label: "vs last month" }}
            sparklineData={[180, 185, 192, 198, 204, 210, 214]}
            icon={<Users size={18} className="text-accent-primary" />}
          />
          <StatCard
            label="Active Purchase Orders"
            countTo={1247}
            accentColor="#2563EB"
            trend={{ value: "↑ 8.4%", direction: "up", label: "order volume" }}
            sparklineData={[1020, 1080, 1150, 1110, 1190, 1220, 1247]}
            icon={<ShoppingCart size={18} className="text-feature-orders" />}
          />
          <StatCard
            label="On-Time Delivery Rate"
            countTo={94.2}
            decimals={1}
            formatter={(value) => `${value}%`}
            accentColor="#059669"
            trend={{ value: "↑ 3.1%", direction: "up", label: "sla met" }}
            sparklineData={[91.2, 91.8, 92.4, 93.0, 93.8, 93.9, 94.2]}
            icon={<Activity size={18} className="text-feature-suppliers" />}
          />
          <StatCard
            label="Total Spend YTD"
            countTo={2.4}
            decimals={1}
            formatter={(value) => `$${value}M`}
            accentColor="#4F46E5"
            trend={{ value: "↓ 5.2%", direction: "down", label: "cost reduction" }}
            sparklineData={[2.8, 2.7, 2.65, 2.58, 2.5, 2.44, 2.4]}
            icon={<DollarSign size={18} className="text-accent-primary" />}
          />
        </div>
      </StaggerItem>

      {/* ROW 2: SPEND TREND & ORDER DISTRIBUTION */}
      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
          {/* Spend Trend Area Chart (8 cols) */}
          <Card className="lg:col-span-8">
            <CardHeader
              title="Spend Trend (Last 12 Months)"
              description="Historical procurement expenditures vs projected cost baseline ($M USD)"
              action={
                <div className="flex items-center gap-[12px] text-[12px] text-text-secondary select-none">
                  <span className="flex items-center gap-[6px]">
                    <span className="w-[10px] h-[10px] bg-accent-primary rounded-full" /> Actual Spend
                  </span>
                  <span className="flex items-center gap-[6px]">
                    <span className="w-[10px] h-[2px] bg-text-tertiary" /> Baseline
                  </span>
                </div>
              }
            />
            <CardBody className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spendTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.20} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface p-[10px] rounded-[8px] border border-border-default shadow-md text-[12px]">
                            <p className="font-semibold text-text-primary">{payload[0]?.payload.month}</p>
                            <p className="text-accent-primary font-medium">Actual: ${payload[0]?.value}M</p>
                            <p className="text-text-tertiary">Baseline: ${payload[1]?.value}M</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="spend"
                    stroke="#4F46E5"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#spendGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="baseline"
                    stroke="#A1A1AA"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>

          {/* Order Status Distribution Donut Chart (4 cols) */}
          <Card className="lg:col-span-4">
            <CardHeader
              title="Order Status Distribution"
              description="500 tracked global shipments"
            />
            <CardBody className="h-[280px] flex flex-col justify-between">
              <div className="h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-surface p-[8px] rounded-[6px] border border-border-default shadow-sm text-[12px]">
                              <span className="font-semibold text-text-primary">{payload[0].name}: </span>
                              <span className="text-text-secondary">{payload[0].value} orders</span>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-[8px] text-[12px] pt-[8px] border-t border-border-default">
                {orderStatusData.map((item) => (
                  <div key={item.name} className="flex items-center gap-[6px]">
                    <span className="w-[8px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-text-secondary truncate">{item.name}</span>
                    <span className="text-text-primary font-medium ml-auto tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      </StaggerItem>

      {/* ROW 3: TOP 5 SUPPLIERS & RECENT ACTIVITY */}
      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
          {/* Top 5 Suppliers Table (6 cols) */}
          <Card className="lg:col-span-6">
            <CardHeader
              title="Top Suppliers by Performance"
              description="Highest combined score across quality and SLA delivery"
              action={
                <Button variant="ghost" size="sm" onClick={() => navigate('/suppliers')}>
                  View All
                </Button>
              }
            />
            <div className="p-[16px] divide-y divide-border-default">
              {topSuppliers.map((s, idx) => (
                <div key={s.id} className="py-[12px] first:pt-0 last:pb-0 flex items-center justify-between gap-[16px]">
                  <div className="flex items-center gap-[12px] min-w-0">
                    <span className="text-[13px] font-mono text-text-tertiary w-[16px]">0{idx + 1}</span>
                    <div className="truncate">
                      <p
                        onClick={() => navigate(`/suppliers/${s.id}`)}
                        className="text-[14px] font-medium text-text-primary hover:text-accent-primary cursor-pointer truncate"
                      >
                        {s.name}
                      </p>
                      <p className="text-[12px] text-text-tertiary">{s.country} • {s.commodity}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-[16px] shrink-0 text-right">
                    <div className="w-[100px] hidden sm:block">
                      <div className="flex justify-between text-[11px] text-text-tertiary mb-[2px]">
                        <span>Quality</span>
                        <span className="tabular-nums font-medium text-text-primary">{s.qualityScore}%</span>
                      </div>
                      <div className="w-full bg-subtle h-[5px] rounded-full overflow-hidden border border-border-default">
                        <div className="bg-semantic-success h-full rounded-full" style={{ width: `${s.qualityScore}%` }} />
                      </div>
                    </div>

                    <Badge variant="neutral" size="sm">{s.tier}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Activity Feed Timeline (6 cols) */}
          <Card className="lg:col-span-6">
            <CardHeader
              title="Recent Activity Feed"
              description="Real-time order logs, supplier risk alerts, and audit updates"
            />
            <div className="p-[20px] space-y-[16px] max-h-[360px] overflow-y-auto">
              {mockActivityFeed.slice(0, 6).map((evt) => {
                const borderColors = {
                  critical: 'border-l-semantic-danger',
                  warning: 'border-l-semantic-warning',
                  normal: 'border-l-border-strong',
                };
                return (
                  <div
                    key={evt.id}
                    className={`pl-[14px] border-l-2 ${borderColors[evt.severity || 'normal']} space-y-[2px]`}
                  >
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="font-semibold text-text-primary">{evt.title}</span>
                      <span className="text-text-tertiary flex items-center gap-[3px]">
                        <Clock size={11} /> {evt.timestamp}
                      </span>
                    </div>
                    <p className="text-[13px] text-text-secondary leading-[18px]">
                      {evt.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </StaggerItem>

      {/* ROW 4: UPCOMING DELIVERIES TABLE */}
      <StaggerItem>
        <Card>
          <CardHeader
            title="Upcoming Deliveries & Critical Shipments"
            description="Purchase orders currently in transit or pending dispatch"
            action={
              <Button variant="secondary" size="sm" onClick={() => navigate('/orders')}>
                Manage All Orders
              </Button>
            }
          />
          <div className="p-[20px]">
            <Table
              columns={upcomingColumns}
              data={upcomingOrders}
              keyExtractor={(o) => o.id}
            />
          </div>
        </Card>
      </StaggerItem>
    </StaggerContainer>
  );
};
