import React, { useState, useMemo } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Select } from '../design-system/components/Select';
import { Table, Column } from '../design-system/components/Table';
import { commoditiesList, generateCommodityHistory } from '../data/mockData';
import { motion } from 'framer-motion';
import { ease, durations } from '../lib/motion/presets';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  ReferenceLine,
  Line,
} from 'recharts';

interface ForecastRow {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentPrice: number;
  predictedPrice: number;
  changePct: number;
  action: 'Buy Now' | 'Wait' | 'Monitor';
}

export const Forecasting: React.FC = () => {
  const [selectedCommodityId, setSelectedCommodityId] = useState<string>('steel');
  const [horizon, setHorizon] = useState<'30d' | '60d' | '90d'>('90d');

  const selectedCommodity = commoditiesList.find((c) => c.id === selectedCommodityId) || commoditiesList[0];
  const chartHistory = useMemo(() => generateCommodityHistory(selectedCommodityId), [selectedCommodityId]);

  // Trim according to horizon
  const visibleData = useMemo(() => {
    return chartHistory.slice(-27);
  }, [chartHistory]);

  const latestPoint = chartHistory[chartHistory.length - 4]; // last historical
  const forecastPoint = chartHistory[chartHistory.length - 1]; // 90d forecast
  const pctChange = (((forecastPoint.forecast || forecastPoint.price) - latestPoint.price) / latestPoint.price) * 100;
  const isRising = pctChange > 0;

  const recommendation = isRising ? 'Buy Now' : 'Wait & Spot Buy';

  const forecastTableData: ForecastRow[] = commoditiesList.slice(0, 10).map((c) => {
    const hist = generateCommodityHistory(c.id);
    const curr = hist[hist.length - 4].price;
    const fore = hist[hist.length - 1].forecast || curr;
    const diff = ((fore - curr) / curr) * 100;
    return {
      id: c.id,
      name: c.name,
      category: c.category,
      unit: c.unit,
      currentPrice: curr,
      predictedPrice: fore,
      changePct: diff,
      action: diff > 2.5 ? 'Buy Now' : diff < -2.5 ? 'Wait' : 'Monitor',
    };
  });

  const columns: Column<ForecastRow>[] = [
    {
      key: 'name',
      header: 'Commodity Asset',
      render: (r: ForecastRow) => (
        <div>
          <span
            className="font-medium text-text-primary hover:text-accent-primary cursor-pointer block truncate"
            onClick={() => setSelectedCommodityId(r.id)}
          >
            {r.name}
          </span>
          <span className="text-[12px] text-text-tertiary">{r.category}</span>
        </div>
      ),
    },
    {
      key: 'currentPrice',
      header: 'Spot Price',
      align: 'right',
      render: (r: ForecastRow) => <span className="tabular-nums font-medium">${r.currentPrice.toLocaleString()}</span>,
    },
    {
      key: 'predictedPrice',
      header: '90D Forecast',
      align: 'right',
      render: (r: ForecastRow) => <span className="tabular-nums font-semibold text-accent-primary">${r.predictedPrice.toLocaleString()}</span>,
    },
    {
      key: 'changePct',
      header: 'Projected Delta',
      align: 'right',
      render: (r: ForecastRow) => (
        <span className={`tabular-nums font-medium ${r.changePct > 0 ? 'text-semantic-danger' : 'text-semantic-success'}`}>
          {r.changePct > 0 ? `+${r.changePct.toFixed(1)}%` : `${r.changePct.toFixed(1)}%`}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'AI Recommendation',
      align: 'center',
      render: (r: ForecastRow) => {
        const variants: Record<string, 'danger' | 'success' | 'neutral'> = {
          'Buy Now': 'danger',
          Wait: 'success',
          Monitor: 'neutral',
        };
        return <Badge variant={variants[r.action]} size="sm">{r.action}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-[24px]">
      <PageHeader
        title="Commodity Price Forecasting"
        description="Predictive multi-horizon time-series modeling trained on 5 years of global market indices and macro commodity feeds."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Forecasting' }]}
        actions={
          <div className="flex items-center gap-[10px]">
            <div className="flex items-center bg-white border border-border-default rounded-[8px] p-[2px] shadow-xs text-[13px]">
              {(['30d', '60d', '90d'] as const).map((h) => (
                <button
                  key={h}
                  onClick={() => setHorizon(h)}
                  className={`px-[12px] py-[4px] rounded-[6px] font-medium transition-colors ${horizon === h ? 'bg-accent-subtle text-accent-primary font-semibold' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {h} Horizon
                </button>
              ))}
            </div>
            <Button variant="secondary" size="sm" onClick={() => alert('Retraining Prophet model against latest spot prices...')}>
              Retrain Model
            </Button>
          </div>
        }
      />

      {/* TOP CONTROLS & SIDE PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px]">
        {/* MAIN FORECAST CHART (8 cols) */}
        <Card className="lg:col-span-8">
          <CardHeader
            title={
              <div className="flex flex-wrap items-center justify-between gap-[12px]">
                <div className="flex items-center gap-[10px]">
                  <span>{selectedCommodity.name}</span>
                  <Badge variant="neutral" size="sm">{selectedCommodity.unit}</Badge>
                </div>
                <div className="w-[200px]">
                  <Select
                    value={selectedCommodityId}
                    onChange={(e) => setSelectedCommodityId(e.target.value)}
                    options={commoditiesList.map((c) => ({ label: c.name, value: c.id }))}
                  />
                </div>
              </div>
            }
            description="Solid line: Actual LME benchmark price • Dashed line: Machine learning forward projection with 95% confidence intervals"
          />
          <CardBody className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={visibleData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E7E5E4" />
                <XAxis dataKey="date" stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#78716C" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} domain={['auto', 'auto']} />
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-[10px] rounded-[8px] border border-border-default shadow-md text-[12px] space-y-[2px]">
                          <p className="font-semibold text-text-primary">{d.date}</p>
                          {d.forecast ? (
                            <>
                              <p className="text-accent-primary font-semibold">Forecast: ${d.forecast}</p>
                              <p className="text-text-tertiary text-[11px]">Range: ${d.lowerBound} - ${d.upperBound}</p>
                            </>
                          ) : (
                            <p className="text-text-secondary font-medium">Historical: ${d.price}</p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine x="2026-08" stroke="#1E40AF" strokeDasharray="3 3" label={{ value: 'Today', fill: '#1E40AF', fontSize: 11, position: 'top' }} />
                <Line type="monotone" dataKey="price" stroke="#1C1917" strokeWidth={2} dot={false} name="Historical Price" />
                <Line type="monotone" dataKey="forecast" stroke="#1E40AF" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4 }} name="Forecast Projection" />
                <Area type="monotone" dataKey="upperBound" stroke="none" fill="#1E40AF" fillOpacity={0.08} />
              </ComposedChart>
            </ResponsiveContainer>
          </CardBody>
        </Card>

        {/* SIDE PANEL: MODEL & ACTION CARD (4 cols) */}
        <div className="lg:col-span-4 space-y-[16px]">
          <Card>
            <CardHeader title="Tactical Procurement Advice" />
            <CardBody className="space-y-[16px]">
              <div className="p-[14px] bg-subtle rounded-[10px] border border-border-default space-y-[10px]">
                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-tertiary">Forward Strategy</span>
                  <Badge variant={recommendation === 'Buy Now' ? 'danger' : 'success'} size="md">
                    {recommendation}
                  </Badge>
                </div>
                <div className="text-[24px] font-semibold text-text-primary tabular-nums">
                  ${forecastPoint.forecast?.toLocaleString()}{' '}
                  <span className={`text-[14px] font-medium ${isRising ? 'text-semantic-danger' : 'text-semantic-success'}`}>
                    ({pctChange > 0 ? `+${pctChange.toFixed(1)}%` : `${pctChange.toFixed(1)}%`})
                  </span>
                </div>
                <p className="text-[12px] text-text-secondary leading-[18px]">
                  {isRising
                    ? 'Model anticipates price inflation over the next 90 days. Locking in volume via 6-month framework contracts now will mitigate estimated $140k cost overruns.'
                    : 'Model projects downward spot easing. Delay non-critical spot purchases and negotiate index-linked floating prices with suppliers.'}
                </p>
              </div>

              <div className="space-y-[10px] text-[13px] pt-[4px]">
                <div className="flex justify-between py-[4px] border-b border-border-default">
                  <span className="text-text-tertiary">Forecast Horizon</span>
                  <span className="font-medium text-text-primary">{horizon} Forward</span>
                </div>
                <div className="flex justify-between py-[4px] border-b border-border-default">
                  <span className="text-text-tertiary">Confidence Interval</span>
                  <span className="font-medium text-text-primary">95% Bayesian Band</span>
                </div>
                <div className="flex justify-between py-[4px] border-b border-border-default">
                  <span className="text-text-tertiary">Model Architecture</span>
                  <span className="font-medium text-text-primary">Facebook Prophet + XGBoost</span>
                </div>
                <div className="flex justify-between py-[4px]">
                  <span className="text-text-tertiary">Mean Abs. Error (MAPE)</span>
                  <span className="font-semibold text-semantic-success">4.2%</span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* FORECAST OPPORTUNITY TABLE */}
      <Card>
        <CardHeader
          title="Commodity Portfolio Forecast & Arbitrage Table"
          description="Consolidated 90-day price trajectories across 10 strategic raw materials"
        />
        <div className="p-[20px]">
          <Table
            columns={columns}
            data={forecastTableData}
            keyExtractor={(r) => r.id}
          />
        </div>
      </Card>
    </div>
  );
};
