import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Chip } from '../design-system/components/Chip';
import { Sparkles, Download, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { StaggerContainer, StaggerItem } from '../design-system/motion/StaggerContainer';
import { ease, durations } from '../lib/motion/presets';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';

export const Analytics: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d' | '12m' | 'YTD'>('12m');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('ALL');

  // Spend by Category (USD Millions)
  const categorySpendData = [
    { category: 'Steel & Heavy Metals', spend: 94.5 },
    { category: 'Semiconductors', spend: 68.4 },
    { category: 'Chemicals & Polymers', spend: 52.8 },
    { category: 'Copper Cathodes', spend: 41.2 },
    { category: 'Aluminum Ingots', spend: 38.6 },
    { category: 'Lithium & Battery', spend: 28.5 },
    { category: 'Timber & Materials', spend: 18.2 },
  ];

  // Performance Distribution (Histogram bins)
  const performanceDistData = [
    { scoreRange: '60-70%', count: 4 },
    { scoreRange: '70-80%', count: 8 },
    { scoreRange: '80-85%', count: 18 },
    { scoreRange: '85-90%', count: 42 },
    { scoreRange: '90-95%', count: 86 },
    { scoreRange: '95-100%', count: 56 },
  ];

  // Delivery Time Trends (Days)
  const deliveryTrendsData = [
    { month: 'Oct', target: 20, actual: 23 },
    { month: 'Nov', target: 20, actual: 22 },
    { month: 'Dec', target: 20, actual: 25 },
    { month: 'Jan', target: 20, actual: 21 },
    { month: 'Feb', target: 20, actual: 19 },
    { month: 'Mar', target: 20, actual: 18 },
    { month: 'Apr', target: 20, actual: 19 },
    { month: 'May', target: 20, actual: 17 },
  ];

  // Price Volatility Scatter (Spend vs Volatility %)
  const priceVolatilityData = [
    { name: 'Lithium Hydroxide', spend: 24.7, volatility: 28.4 },
    { name: 'Hot Rolled Steel', spend: 34.8, volatility: 12.2 },
    { name: 'Silicon Wafers', spend: 68.4, volatility: 8.5 },
    { name: 'Copper Cathodes', spend: 36.7, volatility: 18.0 },
    { name: 'Class 1 Nickel', spend: 41.2, volatility: 24.5 },
    { name: 'Structural Timber', spend: 18.2, volatility: 9.8 },
    { name: 'Polymer Resins', spend: 33.7, volatility: 11.0 },
  ];

  return (
    <div className="space-y-[24px]">
      <PageHeader
        title="Procurement & Spend Analytics"
        description="Cross-category expenditure analysis, delivery velocity curves, and commodity price volatility matrices."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Analytics' }]}
        actions={
          <>
            <div className="relative flex items-center bg-subtle border border-border-default rounded-[8px] p-[2px] shadow-xs text-[13px]">
              {(['7d', '30d', '90d', '12m', 'YTD'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`relative z-10 px-[10px] py-[4px] rounded-[6px] font-medium transition-colors cursor-pointer ${
                    period === p ? 'text-teal-900 font-semibold' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {period === p && (
                    <motion.span
                      layoutId="analyticsPeriodPill"
                      className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-10"
                      transition={{ duration: durations.fast, ease: ease.out }}
                    />
                  )}
                  {p}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert('Exporting analytics charts to executive PDF pack...')}
            >
              Export Analytics
            </Button>
          </>
        }
      />

      {/* FILTER CHIPS */}
      <div className="flex flex-wrap items-center gap-[8px] pb-[8px]">
        <span className="text-[12px] font-medium text-text-tertiary flex items-center gap-[4px] mr-[4px]">
          <Filter size={13} /> Filter View:
        </span>
        {['All Categories', 'Metals & Steel', 'Electronics', 'Chemicals', 'Energy', 'Rare Earth'].map((cat) => (
          <Chip
            key={cat}
            active={selectedCommodity === cat || (cat === 'All Categories' && selectedCommodity === 'ALL')}
            onClick={() => setSelectedCommodity(cat === 'All Categories' ? 'ALL' : cat)}
          >
            {cat}
          </Chip>
        ))}
      </div>

      {/* 2x2 CHART GRID */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        {/* CHART 1: SPEND BY CATEGORY */}
        <StaggerItem>
          <Card>
            <CardHeader
              title="Spend by Commodity Category ($M USD)"
              description="Aggregated 12-month procurement volume"
            />
            <CardBody className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={categorySpendData} margin={{ top: 10, right: 20, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E7E5E4" />
                  <XAxis type="number" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}M`} />
                  <YAxis dataKey="category" type="category" stroke="#71717A" fontSize={11} tickLine={false} axisLine={false} width={130} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface p-[8px] rounded-[6px] border border-border-default shadow-sm text-[12px]">
                            <span className="font-semibold text-text-primary">{payload[0].payload.category}: </span>
                            <span className="text-teal-700 font-medium">${payload[0].value}M</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="spend" fill="#0D9488" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </StaggerItem>

        {/* CHART 2: PERFORMANCE DISTRIBUTION */}
        <StaggerItem>
          <Card>
            <CardHeader
              title="Supplier Performance Distribution"
              description="Count of vendors across composite performance tiers"
            />
            <CardBody className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceDistData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="scoreRange" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-surface p-[8px] rounded-[6px] border border-border-default shadow-sm text-[12px]">
                            <span className="font-semibold text-text-primary">{payload[0].payload.scoreRange}: </span>
                            <span className="text-text-secondary">{payload[0].value} suppliers</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#059669" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </StaggerItem>

        {/* CHART 3: DELIVERY TIME TRENDS */}
        <StaggerItem>
          <Card>
            <CardHeader
              title="Average Fulfillment Lead Time (Days)"
              description="Actual dispatch-to-dock cycle vs target threshold"
            />
            <CardBody className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={deliveryTrendsData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                  <XAxis dataKey="month" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="actual" stroke="#0D9488" strokeWidth={2} dot={{ r: 3 }} name="Actual Lead Time" />
                  <Line type="monotone" dataKey="target" stroke="#D97706" strokeDasharray="4 4" strokeWidth={1.5} dot={false} name="Target SLA" />
                </LineChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </StaggerItem>

        {/* CHART 4: PRICE VOLATILITY SCATTER */}
        <StaggerItem>
          <Card>
            <CardHeader
              title="Price Volatility vs Annual Spend ($M)"
              description="Material risk exposure quadrant (Bubble size = Spend)"
            />
            <CardBody className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E7E5E4" />
                  <XAxis dataKey="volatility" name="Volatility" unit="%" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis dataKey="spend" name="Spend" unit="M" stroke="#71717A" fontSize={12} tickLine={false} axisLine={false} />
                  <ZAxis dataKey="spend" range={[60, 300]} />
                  <RechartsTooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-surface p-[10px] rounded-[8px] border border-border-default shadow-md text-[12px]">
                            <p className="font-semibold text-text-primary">{data.name}</p>
                            <p className="text-text-secondary">Spend: ${data.spend}M</p>
                            <p className="text-semantic-danger font-medium">Volatility: {data.volatility}%</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Scatter data={priceVolatilityData} fill="#0D9488" />
                </ScatterChart>
              </ResponsiveContainer>
            </CardBody>
          </Card>
        </StaggerItem>
      </StaggerContainer>

      {/* AI INSIGHTS SUMMARY BANNER */}
      <Card className="border-blue-200 bg-accent-subtle/30">
        <CardHeader
          title={
            <div className="flex items-center gap-[8px] text-accent-primary">
              <Sparkles size={18} />
              <span>SmartProcure AI Executive Insights</span>
            </div>
          }
          description="Autonomous analysis based on 24-month ERP transactional logs & LME market feeds"
        />
        <CardBody className="space-y-[12px] text-[13px] text-text-secondary leading-[22px]">
          <div className="flex items-start gap-[10px]">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-primary mt-[8px] shrink-0" />
            <p>
              <strong className="text-text-primary">Steel Consolidation Opportunity:</strong> Purchasing is distributed across 7 primary mills with a 6.4% price variance. Standardizing hot-rolled specifications onto Tata Steel and Nucor Corporation could unlock $1.8M in annual volume rebates.
            </p>
          </div>
          <div className="flex items-start gap-[10px]">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-primary mt-[8px] shrink-0" />
            <p>
              <strong className="text-text-primary">Lithium Volatility Hedging:</strong> Battery grade lithium hydroxide exhibited 28.4% annualized volatility over the past two quarters. We recommend shifting 35% of volume to 12-month fixed collar index agreements to defend unit margins.
            </p>
          </div>
          <div className="flex items-start gap-[10px]">
            <span className="w-[6px] h-[6px] rounded-full bg-accent-primary mt-[8px] shrink-0" />
            <p>
              <strong className="text-text-primary">Lead-Time Compression:</strong> Average supplier cycle time decreased from 23 days in Q4 to 17 days in May, reflecting improved freight route resilience following the European port restructuring.
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};
