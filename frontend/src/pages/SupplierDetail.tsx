import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../design-system/components/PageHeader';
import { StatCard } from '../design-system/components/StatCard';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Avatar } from '../design-system/components/Avatar';
import { Tabs, TabItem } from '../design-system/components/Tabs';
import { Table, Column } from '../design-system/components/Table';
import { mockSuppliers, mockOrders, PurchaseOrder } from '../data/mockData';
import { Mail, Phone, MapPin, Award, FileText, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export const SupplierDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const supplier = mockSuppliers.find((s) => s.id === id) || mockSuppliers[0];
  const supplierOrders = mockOrders.filter((o) => o.supplierId === supplier.id).slice(0, 8);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'performance', label: 'Performance Analytics' },
    { id: 'orders', label: 'Purchase Orders', count: supplierOrders.length },
    { id: 'risk', label: 'Risk Breakdown' },
    { id: 'documents', label: 'Contracts & Certifications' },
  ];

  // Radar chart comparison data
  const radarData = [
    { metric: 'Quality Assurance', supplier: supplier.qualityScore, categoryAvg: 88 },
    { metric: 'Delivery Reliability', supplier: supplier.deliveryScore, categoryAvg: 86 },
    { metric: 'Cost Competitiveness', supplier: supplier.costScore, categoryAvg: 84 },
    { metric: 'ESG & Sustainability', supplier: supplier.sustainabilityScore, categoryAvg: 80 },
    { metric: 'Financial Stability', supplier: supplier.financialStability, categoryAvg: 85 },
  ];

  const orderColumns: Column<PurchaseOrder>[] = [
    {
      key: 'id',
      header: 'PO ID',
      render: (o) => <span className="font-mono text-accent-primary font-medium">{o.id}</span>,
    },
    {
      key: 'itemDescription',
      header: 'Line Item',
      render: (o) => <span className="truncate max-w-[200px] block">{o.itemDescription}</span>,
    },
    {
      key: 'orderDate',
      header: 'Order Date',
      render: (o) => <span className="tabular-nums">{o.orderDate}</span>,
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
  ];

  return (
    <div className="space-y-[24px]">
      <PageHeader
        title={supplier.name}
        description={`ID: ${supplier.id} • ${supplier.industry} • ${supplier.commodity}`}
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Suppliers', href: '/suppliers' },
          { label: supplier.name },
        ]}
        actions={
          <>
            <Button variant="secondary" size="sm" icon={<ArrowLeft size={14} />} onClick={() => navigate('/suppliers')}>
              Back
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Sparkles size={14} />}
              onClick={() => navigate(`/copilot?q=Analyze performance and risks for ${encodeURIComponent(supplier.name)}`)}
            >
              Analyze with Copilot
            </Button>
            <Button variant="primary" size="sm" onClick={() => alert(`Opening contract management for ${supplier.name}...`)}>
              Edit Agreement
            </Button>
          </>
        }
      />

      {/* SUPPLIER SUMMARY HEADER BAR */}
      <div className="bg-white border border-border-default rounded-[12px] p-[20px] shadow-xs flex flex-wrap items-center justify-between gap-[20px]">
        <div className="flex items-center gap-[16px]">
          <Avatar name={supplier.name} size="xl" />
          <div>
            <div className="flex items-center gap-[8px]">
              <h2 className="text-[20px] font-semibold text-text-primary leading-[26px]">{supplier.name}</h2>
              <Badge variant="info" size="sm">{supplier.tier} Tier</Badge>
              <Badge variant={supplier.status === 'Active' ? 'success' : 'warning'} size="sm">{supplier.status}</Badge>
            </div>
            <p className="text-[13px] text-text-secondary mt-[3px] flex items-center gap-[6px]">
              <MapPin size={13} className="text-text-tertiary" /> {supplier.city}, {supplier.country}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-[24px] text-right">
          <div>
            <div className="text-[12px] text-text-tertiary">Annual Spend YTD</div>
            <div className="text-[20px] font-semibold text-text-primary tabular-nums mt-[2px]">
              ${(supplier.annualSpend / 1000000).toFixed(1)}M
            </div>
          </div>
          <div>
            <div className="text-[12px] text-text-tertiary">On-Time Delivery</div>
            <div className="text-[20px] font-semibold text-semantic-success tabular-nums mt-[2px]">
              {supplier.onTimeDeliveryRate}%
            </div>
          </div>
          <div>
            <div className="text-[12px] text-text-tertiary">Composite Risk</div>
            <div className="text-[20px] font-semibold text-accent-primary tabular-nums mt-[2px]">
              {supplier.riskScore.toFixed(1)} / 100
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-[20px]">
          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
            <StatCard
              label="Quality Assessment"
              value={`${supplier.qualityScore}%`}
              trend={{ value: "Top Decile", direction: "up" }}
              sparklineData={[92, 93, 94, 93.8, 94.8]}
            />
            <StatCard
              label="Delivery SLA Score"
              value={`${supplier.deliveryScore}%`}
              trend={{ value: "Stable", direction: "neutral" }}
              sparklineData={[94, 95, 95.5, 96.0, 96.2]}
            />
            <StatCard
              label="Average Lead Time"
              value={`${supplier.leadTimeDays} Days`}
              trend={{ value: "↓ 2d vs benchmark", direction: "up" }}
              sparklineData={[28, 27, 26, 25, 24]}
            />
            <StatCard
              label="Financial Stability Index"
              value={`${supplier.financialStability}/100`}
              trend={{ value: "Investment Grade", direction: "up" }}
              sparklineData={[88, 89, 90, 91.5, 92.5]}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
            {/* RADAR BENCHMARK CHART (7 cols) */}
            <Card className="lg:col-span-7">
              <CardHeader
                title="Capability Radar vs Category Average"
                description="Comparative multi-dimensional scoring benchmark"
              />
              <CardBody className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#E7E5E4" />
                    <PolarAngleAxis dataKey="metric" tick={{ fill: '#57534E', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#E7E5E4" />
                    <Radar name={supplier.name} dataKey="supplier" stroke="#1E40AF" fill="#1E40AF" fillOpacity={0.25} />
                    <Radar name="Category Average" dataKey="categoryAvg" stroke="#78716C" fill="#78716C" fillOpacity={0.1} />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardBody>
            </Card>

            {/* CONTACT & LOCATION CARD (5 cols) */}
            <div className="lg:col-span-5 space-y-[16px]">
              <Card>
                <CardHeader title="Primary Commercial Contact" />
                <CardBody className="space-y-[14px]">
                  <div>
                    <h4 className="text-[15px] font-semibold text-text-primary">{supplier.contactPerson}</h4>
                    <p className="text-[12px] text-text-tertiary">Senior Account Director</p>
                  </div>
                  <div className="space-y-[8px] text-[13px] pt-[8px] border-t border-border-default">
                    <div className="flex items-center gap-[10px] text-text-secondary">
                      <Mail size={15} className="text-text-tertiary shrink-0" />
                      <a href={`mailto:${supplier.email}`} className="text-accent-primary hover:underline truncate">
                        {supplier.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-[10px] text-text-secondary">
                      <Phone size={15} className="text-text-tertiary shrink-0" />
                      <span>{supplier.phone}</span>
                    </div>
                    <div className="flex items-start gap-[10px] text-text-secondary">
                      <MapPin size={15} className="text-text-tertiary shrink-0 mt-[2px]" />
                      <span>{supplier.address}</span>
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader title="Verified Certifications" />
                <CardBody>
                  <div className="flex flex-wrap gap-[6px]">
                    {supplier.certifications.map((cert) => (
                      <span
                        key={cert}
                        className="inline-flex items-center gap-[5px] px-[8px] py-[3px] bg-subtle border border-border-default rounded-[6px] text-[12px] font-medium text-text-primary"
                      >
                        <Award size={13} className="text-accent-primary" /> {cert}
                      </span>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* RECENT ORDERS TABLE */}
          <Card>
            <CardHeader
              title="Recent Executed Purchase Orders"
              description="Historical fulfillment and delivery SLA tracking"
              action={
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('orders')}>
                  View All Orders
                </Button>
              }
            />
            <div className="p-[20px]">
              <Table
                columns={orderColumns}
                data={supplierOrders}
                keyExtractor={(o) => o.id}
              />
            </div>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <Card>
          <CardHeader title={`All Purchase Orders for ${supplier.name}`} />
          <div className="p-[20px]">
            <Table
              columns={orderColumns}
              data={supplierOrders}
              keyExtractor={(o) => o.id}
            />
          </div>
        </Card>
      )}

      {/* TAB CONTENT: RISK */}
      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          <Card>
            <CardHeader title="Risk Dimension Breakdown" />
            <CardBody className="space-y-[16px]">
              <div>
                <div className="flex justify-between text-[13px] mb-[4px]">
                  <span className="text-text-secondary">Geopolitical & Trade Tariffs</span>
                  <span className="tabular-nums font-semibold text-text-primary">{supplier.geopoliticalRisk}/100</span>
                </div>
                <div className="w-full bg-subtle h-[6px] rounded-full overflow-hidden border border-border-default">
                  <div className="bg-semantic-warning h-full rounded-full" style={{ width: `${supplier.geopoliticalRisk}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] mb-[4px]">
                  <span className="text-text-secondary">Operational & Factory Capacity</span>
                  <span className="tabular-nums font-semibold text-text-primary">{supplier.operationalRisk}/100</span>
                </div>
                <div className="w-full bg-subtle h-[6px] rounded-full overflow-hidden border border-border-default">
                  <div className="bg-semantic-success h-full rounded-full" style={{ width: `${supplier.operationalRisk}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[13px] mb-[4px]">
                  <span className="text-text-secondary">Regulatory & ESG Compliance</span>
                  <span className="tabular-nums font-semibold text-text-primary">{supplier.complianceRisk}/100</span>
                </div>
                <div className="w-full bg-subtle h-[6px] rounded-full overflow-hidden border border-border-default">
                  <div className="bg-semantic-success h-full rounded-full" style={{ width: `${supplier.complianceRisk}%` }} />
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="AI Recommended Mitigations" />
            <CardBody className="space-y-[12px] text-[13px] text-text-secondary leading-[20px]">
              <div className="p-[12px] bg-subtle rounded-[8px] border border-border-default flex items-start gap-[10px]">
                <ShieldAlert size={16} className="text-accent-primary shrink-0 mt-[2px]" />
                <div>
                  <p className="font-semibold text-text-primary">Secondary Sourcing Redundancy</p>
                  <p className="text-[12px] mt-[2px]">Maintain 15% secondary allocation with North American suppliers to hedge against export customs delays.</p>
                </div>
              </div>
              <div className="p-[12px] bg-subtle rounded-[8px] border border-border-default flex items-start gap-[10px]">
                <FileText size={16} className="text-semantic-success shrink-0 mt-[2px]" />
                <div>
                  <p className="font-semibold text-text-primary">Buffer Stock Adjustment</p>
                  <p className="text-[12px] mt-[2px]">Increase safety stock in Zone A warehouse from 14 days to 21 days during monsoon maritime shipping windows.</p>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === 'documents' && (
        <Card>
          <CardHeader title="Contracts, Master Service Agreements & Audits" />
          <div className="p-[20px] divide-y divide-border-default">
            {[
              { title: 'Master Supply Agreement (MSA-2024-TATA)', date: 'Valid until Dec 2026', size: '2.4 MB PDF' },
              { title: 'ISO 9001:2015 Quality Certificate of Compliance', date: 'Audited Sep 2024', size: '840 KB PDF' },
              { title: 'ESG Sustainability Charter & Carbon Scorecard', date: 'Submitted Jun 2024', size: '1.2 MB PDF' },
            ].map((doc, idx) => (
              <div key={idx} className="py-[14px] first:pt-0 last:pb-0 flex items-center justify-between">
                <div className="flex items-center gap-[10px]">
                  <FileText size={18} className="text-text-tertiary" />
                  <div>
                    <p className="text-[14px] font-medium text-text-primary">{doc.title}</p>
                    <p className="text-[12px] text-text-tertiary">{doc.date} • {doc.size}</p>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => alert(`Downloading ${doc.title}...`)}>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};
