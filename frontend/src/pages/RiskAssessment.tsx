import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { StatCard } from '../design-system/components/StatCard';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Table, Column } from '../design-system/components/Table';
import { Drawer } from '../design-system/components/Drawer';
import { mockSuppliers, Supplier } from '../data/mockData';
import { AlertTriangle, ShieldCheck, ShieldAlert, Download, Sparkles } from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export const RiskAssessment: React.FC = () => {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // 2D Risk Matrix Scatter Data (Probability vs Impact)
  const matrixData = mockSuppliers.map((s) => ({
    id: s.id,
    name: s.name,
    probability: Math.round(s.geopoliticalRisk * 0.8 + s.operationalRisk * 0.2),
    impact: Math.round((s.annualSpend / 50000000) * 100),
    spend: s.annualSpend,
    riskLevel: s.riskLevel,
  }));

  // Risk by category bar chart
  const categoryRiskData = [
    { category: 'Chemicals', avgRisk: 52 },
    { category: 'Rare Earth', avgRisk: 48 },
    { category: 'Steel & Metals', avgRisk: 26 },
    { category: 'Semiconductors', avgRisk: 34 },
    { category: 'Logistics', avgRisk: 38 },
  ];

  const columns: Column<Supplier>[] = [
    {
      key: 'name',
      header: 'Supplier Organization',
      sortable: true,
      render: (s) => (
        <div>
          <span className="font-medium text-text-primary hover:text-accent-primary cursor-pointer block truncate">
            {s.name}
          </span>
          <span className="text-[12px] text-text-tertiary">{s.country} • {s.commodity}</span>
        </div>
      ),
    },
    {
      key: 'riskScore',
      header: 'Composite Risk Score',
      align: 'right',
      sortable: true,
      render: (s) => (
        <div className="flex items-center justify-end gap-[8px]">
          <div className="w-[60px] bg-subtle h-[5px] rounded-full overflow-hidden border border-border-default">
            <div
              className={`h-full rounded-full ${s.riskScore > 60 ? 'bg-semantic-danger' : s.riskScore > 30 ? 'bg-semantic-warning' : 'bg-semantic-success'}`}
              style={{ width: `${s.riskScore}%` }}
            />
          </div>
          <span className="tabular-nums font-semibold text-[13px]">{s.riskScore.toFixed(1)}</span>
        </div>
      ),
    },
    {
      key: 'financialStability',
      header: 'Financial',
      align: 'right',
      sortable: true,
      render: (s) => <span className="tabular-nums text-text-secondary">{s.financialStability}/100</span>,
    },
    {
      key: 'operationalRisk',
      header: 'Operational',
      align: 'right',
      sortable: true,
      render: (s) => <span className="tabular-nums text-text-secondary">{s.operationalRisk}/100</span>,
    },
    {
      key: 'geopoliticalRisk',
      header: 'Geopolitical',
      align: 'right',
      sortable: true,
      render: (s) => <span className="tabular-nums text-text-secondary">{s.geopoliticalRisk}/100</span>,
    },
    {
      key: 'riskLevel',
      header: 'Tier Level',
      align: 'center',
      sortable: true,
      render: (s) => {
        const variants: Record<string, 'success' | 'warning' | 'danger'> = {
          Low: 'success',
          Medium: 'warning',
          High: 'danger',
        };
        return <Badge variant={variants[s.riskLevel] || 'neutral'} size="sm" dot>{s.riskLevel}</Badge>;
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            setSelectedSupplier(s);
            setIsDrawerOpen(true);
          }}
          className="text-[12px] h-[28px] px-[8px]"
        >
          Audit Details
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-[24px]">
      <PageHeader
        title="Supplier Risk Assessment Matrix"
        description="Autonomous multi-factor scoring synthesizing geopolitical exposure, operational bottlenecks, balance sheet health, and ESG compliance."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Risk Assessment' }]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => alert('Exporting full vendor risk audit to PDF...')}
          >
            Export Risk Audit
          </Button>
        }
      />

      {/* OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-[16px]">
        <StatCard
          label="High Risk Suppliers"
          value="12"
          trend={{ value: "Action Required", direction: "down" }}
          icon={<AlertTriangle size={18} className="text-semantic-danger" />}
        />
        <StatCard
          label="Medium Risk Suppliers"
          value="34"
          trend={{ value: "Active Monitoring", direction: "neutral" }}
          icon={<ShieldAlert size={18} className="text-semantic-warning" />}
        />
        <StatCard
          label="Low Risk (Secure) Suppliers"
          value="168"
          trend={{ value: "Qualified Base", direction: "up" }}
          icon={<ShieldCheck size={18} className="text-semantic-success" />}
        />
      </div>

      {/* 2D RISK MATRIX & CATEGORY BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
        {/* 2D RISK MATRIX SCATTER (8 cols) */}
        <Card className="lg:col-span-8">
          <CardHeader
            title="Supply Chain Risk Exposure Matrix"
            description="Probability of Disruption (%) vs Operational / Financial Impact (%)"
          />
          <CardBody className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                <XAxis dataKey="probability" name="Probability" unit="%" stroke="#78716C" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="impact" name="Impact" unit="%" stroke="#78716C" fontSize={11} domain={[0, 100]} />
                <ZAxis dataKey="spend" range={[40, 260]} />
                <RechartsTooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-[10px] rounded-[8px] border border-border-default shadow-md text-[12px] space-y-[2px]">
                          <p className="font-semibold text-text-primary">{d.name}</p>
                          <p className="text-text-secondary">Spend: ${(d.spend / 1000000).toFixed(1)}M</p>
                          <p className="text-text-tertiary">Prob: {d.probability}% • Impact: {d.impact}%</p>
                          <Badge variant={d.riskLevel === 'High' ? 'danger' : d.riskLevel === 'Medium' ? 'warning' : 'success'} size="sm">
                            {d.riskLevel} Risk
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={matrixData} fill="#1E40AF" />
              </ScatterChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* RISK BY CATEGORY (4 cols) */}
        <Card className="lg:col-span-4">
          <CardHeader
            title="Average Risk by Commodity Sector"
            description="Composite industry risk index"
          />
          <CardBody className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={categoryRiskData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5E4" />
                <XAxis type="number" stroke="#78716C" fontSize={11} domain={[0, 100]} />
                <YAxis dataKey="category" type="category" stroke="#78716C" fontSize={11} width={90} />
                <RechartsTooltip />
                <Bar dataKey="avgRisk" fill="#B45309" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>
      </div>

      {/* SUPPLIER RISK TABLE */}
      <Card>
        <CardHeader
          title="Comprehensive Vendor Risk Register"
          description="Detailed breakdown across all scored strategic supply partners"
        />
        <div className="p-[20px]">
          <Table
            columns={columns}
            data={mockSuppliers}
            keyExtractor={(s) => s.id}
            onRowClick={(s) => {
              setSelectedSupplier(s);
              setIsDrawerOpen(true);
            }}
          />
        </div>
      </Card>

      {/* RISK DETAIL DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedSupplier ? `${selectedSupplier.name} - Risk Evaluation` : 'Risk Audit'}
        description={selectedSupplier ? `${selectedSupplier.industry} • Risk Tier: ${selectedSupplier.riskLevel}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => alert(`Generating PDF mitigation plan for ${selectedSupplier?.name}...`)}>
              Generate Mitigation Plan
            </Button>
          </>
        }
      >
        {selectedSupplier && (
          <div className="space-y-[24px]">
            <div className="p-[16px] bg-subtle border border-border-default rounded-[10px] flex items-center justify-between">
              <div>
                <span className="text-[12px] text-text-tertiary">Overall Composite Score</span>
                <div className="text-[24px] font-semibold text-text-primary tabular-nums mt-[2px]">
                  {selectedSupplier.riskScore.toFixed(1)} / 100
                </div>
              </div>
              <Badge variant={selectedSupplier.riskLevel === 'High' ? 'danger' : selectedSupplier.riskLevel === 'Medium' ? 'warning' : 'success'} size="md" dot>
                {selectedSupplier.riskLevel} Risk Tier
              </Badge>
            </div>

            <div className="space-y-[14px]">
              <h4 className="text-[14px] font-semibold text-text-primary">Factor Evaluation</h4>
              <div className="space-y-[10px]">
                <div>
                  <div className="flex justify-between text-[12px] mb-[2px]">
                    <span className="text-text-secondary">Geopolitical Exposure</span>
                    <span className="tabular-nums font-medium text-text-primary">{selectedSupplier.geopoliticalRisk}/100</span>
                  </div>
                  <div className="w-full bg-subtle h-[5px] rounded-full overflow-hidden border border-border-default">
                    <div className="bg-semantic-warning h-full rounded-full" style={{ width: `${selectedSupplier.geopoliticalRisk}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-[2px]">
                    <span className="text-text-secondary">Operational Fragility</span>
                    <span className="tabular-nums font-medium text-text-primary">{selectedSupplier.operationalRisk}/100</span>
                  </div>
                  <div className="w-full bg-subtle h-[5px] rounded-full overflow-hidden border border-border-default">
                    <div className="bg-semantic-danger h-full rounded-full" style={{ width: `${selectedSupplier.operationalRisk}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[12px] mb-[2px]">
                    <span className="text-text-secondary">Regulatory & ESG Non-Compliance</span>
                    <span className="tabular-nums font-medium text-text-primary">{selectedSupplier.complianceRisk}/100</span>
                  </div>
                  <div className="w-full bg-subtle h-[5px] rounded-full overflow-hidden border border-border-default">
                    <div className="bg-semantic-success h-full rounded-full" style={{ width: `${selectedSupplier.complianceRisk}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-[14px] bg-accent-subtle/50 border border-blue-200 rounded-[10px] space-y-[8px]">
              <div className="flex items-center gap-[6px] text-accent-primary font-semibold text-[13px]">
                <Sparkles size={16} /> AI Prescriptive Actions
              </div>
              <p className="text-[12px] text-text-secondary leading-[18px]">
                1. Dual-source 20% of {selectedSupplier.commodity} demand to reduce dependency.<br />
                2. Audit ESG compliance certificates before Q4 contract renewal.<br />
                3. Structure a price-ceiling clause linked to LME index benchmarks.
              </p>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
