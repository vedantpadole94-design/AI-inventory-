import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { DataTable } from '../design-system/components/DataTable';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Avatar } from '../design-system/components/Avatar';
import { Drawer } from '../design-system/components/Drawer';
import { StatCard } from '../design-system/components/StatCard';
import { mockCustomers, Customer } from '../data/mockData';
import { Column } from '../design-system/components/Table';
import { Download } from 'lucide-react';

export const Customers: React.FC = () => {
  const [customers] = useState<Customer[]>(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const columns: Column<Customer>[] = [
    {
      key: 'name',
      header: 'Buyer Organization',
      sortable: true,
      render: (c) => (
        <div className="flex items-center gap-[10px]">
          <Avatar name={c.name} size="sm" />
          <div>
            <span className="font-medium text-text-primary hover:text-accent-primary cursor-pointer block truncate">
              {c.name}
            </span>
            <span className="text-[12px] text-text-tertiary">{c.city}, {c.country}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry Sector',
      sortable: true,
      render: (c) => <span className="text-text-secondary">{c.industry}</span>,
    },
    {
      key: 'tier',
      header: 'Tier',
      align: 'center',
      sortable: true,
      render: (c) => {
        const variants: Record<string, 'info' | 'warning' | 'neutral'> = {
          Strategic: 'info',
          Enterprise: 'warning',
          Growth: 'neutral',
        };
        return <Badge variant={variants[c.tier] || 'neutral'} size="sm">{c.tier}</Badge>;
      },
    },
    {
      key: 'totalSpend',
      header: 'Contract Spend',
      align: 'right',
      sortable: true,
      render: (c) => (
        <span className="tabular-nums font-semibold text-text-primary">
          ${(c.totalSpend / 1000000).toFixed(1)}M
        </span>
      ),
    },
    {
      key: 'satisfaction',
      header: 'Satisfaction',
      align: 'right',
      sortable: true,
      render: (c) => (
        <div className="flex items-center justify-end gap-[8px]">
          <div className="w-[50px] bg-subtle h-[4px] rounded-full overflow-hidden border border-border-default">
            <div className="bg-semantic-success h-full rounded-full" style={{ width: `${c.satisfaction}%` }} />
          </div>
          <span className="tabular-nums font-medium text-[13px]">{c.satisfaction}%</span>
        </div>
      ),
    },
    {
      key: 'nps',
      header: 'NPS',
      align: 'center',
      sortable: true,
      render: (c) => (
        <span className="tabular-nums font-medium text-text-primary px-[6px] py-[2px] bg-subtle rounded border border-border-default text-[12px]">
          +{c.nps}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Contract Status',
      align: 'center',
      sortable: true,
      render: (c) => {
        const variants: Record<string, 'success' | 'warning' | 'neutral'> = {
          Active: 'success',
          'Contract Renewal': 'warning',
          Review: 'neutral',
        };
        return <Badge variant={variants[c.status] || 'neutral'} size="sm" dot>{c.status}</Badge>;
      },
    },
  ];

  return (
    <div className="space-y-[20px]">
      <PageHeader
        title="Enterprise Customers & Accounts"
        description="Downstream procurement clients, enterprise buyer accounts, and master service contract performance."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Customers' }]}
        actions={
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => alert(`Exporting ${customers.length} buyer accounts to CSV...`)}
          >
            Export Accounts
          </Button>
        }
      />

      {/* CUSTOMERS KPI METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
        <StatCard
          label="Active Enterprise Accounts"
          countTo={customers.length}
          accentColor="#DB2777"
          trend={{ value: "+4", direction: "up", label: "new logos" }}
          sparklineData={[18, 19, 20, 21, 22, 23, customers.length]}
        />
        <StatCard
          label="Annual Contract Portfolio"
          countTo={68.5}
          decimals={1}
          formatter={(v) => `$${v}M`}
          accentColor="#DB2777"
          trend={{ value: "↑ 14.2%", direction: "up", label: "YoY expansion" }}
          sparklineData={[52, 54, 58, 61, 64, 66, 68.5]}
        />
        <StatCard
          label="Average CSAT Score"
          countTo={94.8}
          decimals={1}
          formatter={(v) => `${v}%`}
          accentColor="#059669"
          trend={{ value: "↑ 2.4%", direction: "up", label: "satisfaction" }}
          sparklineData={[91, 92, 93, 93.5, 94.1, 94.5, 94.8]}
        />
        <StatCard
          label="Net Promoter Score (NPS)"
          countTo={68}
          formatter={(v) => `+${v}`}
          accentColor="#DB2777"
          trend={{ value: "World Class", direction: "up", label: "benchmark" }}
          sparklineData={[58, 60, 62, 63, 65, 66, 68]}
        />
      </div>

      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(c) => c.id}
        searchableKey="name"
        searchPlaceholder="Search enterprise accounts by name or sector..."
        onRowClick={(c) => {
          setSelectedCustomer(c);
          setIsDrawerOpen(true);
        }}
        pageSize={12}
      />

      {/* CUSTOMER DETAIL DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={selectedCustomer?.name || 'Account Details'}
        description={selectedCustomer ? `${selectedCustomer.industry} • ${selectedCustomer.city}, ${selectedCustomer.country}` : ''}
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsDrawerOpen(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={() => alert(`Opening CRM sync for ${selectedCustomer?.name}...`)}>
              Sync with ERP
            </Button>
          </>
        }
      >
        {selectedCustomer && (
          <div className="space-y-[24px]">
            <div className="grid grid-cols-2 gap-[12px]">
              <StatCard
                label="Contract Value YTD"
                value={`$${(selectedCustomer.totalSpend / 1000000).toFixed(1)}M`}
                trend={{ value: "Top Tier", direction: "up" }}
              />
              <StatCard
                label="Customer Satisfaction"
                value={`${selectedCustomer.satisfaction}%`}
                trend={{ value: `NPS +${selectedCustomer.nps}`, direction: "up" }}
              />
            </div>

            <div className="p-[16px] bg-subtle border border-border-default rounded-[10px] space-y-[12px] text-[13px]">
              <h4 className="font-semibold text-text-primary text-[14px]">Commercial Relationship</h4>
              <div className="flex justify-between py-[4px] border-b border-border-default">
                <span className="text-text-tertiary">Account Tier</span>
                <span className="font-medium text-text-primary">{selectedCustomer.tier} Partner</span>
              </div>
              <div className="flex justify-between py-[4px] border-b border-border-default">
                <span className="text-text-tertiary">Active Contracts</span>
                <span className="font-medium text-text-primary">{selectedCustomer.activeContracts} MSA Agreements</span>
              </div>
              <div className="flex justify-between py-[4px] border-b border-border-default">
                <span className="text-text-tertiary">Dedicated Lead</span>
                <span className="font-medium text-text-primary">{selectedCustomer.accountManager}</span>
              </div>
              <div className="flex justify-between py-[4px]">
                <span className="text-text-tertiary">Retention Probability</span>
                <span className="font-medium text-semantic-success">{selectedCustomer.retention}%</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-text-primary text-[14px] mb-[12px]">Interaction Timeline</h4>
              <div className="space-y-[10px]">
                <div className="p-[12px] bg-white border border-border-default rounded-[8px] text-[13px]">
                  <div className="flex justify-between text-[11px] text-text-tertiary mb-[2px]">
                    <span className="font-semibold text-text-primary">Quarterly Business Review (QBR)</span>
                    <span>3 days ago</span>
                  </div>
                  <p className="text-text-secondary">Completed Q3 executive review. Target allocations for green steel confirmed.</p>
                </div>
                <div className="p-[12px] bg-white border border-border-default rounded-[8px] text-[13px]">
                  <div className="flex justify-between text-[11px] text-text-tertiary mb-[2px]">
                    <span className="font-semibold text-text-primary">Contract Amendment Executed</span>
                    <span>2 weeks ago</span>
                  </div>
                  <p className="text-text-secondary">Extended framework delivery SLA through Q4 2026 with 99.2% guaranteed fill-rate.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
