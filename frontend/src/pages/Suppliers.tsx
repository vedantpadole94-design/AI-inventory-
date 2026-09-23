import React, { useState, useMemo } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { DataTable } from '../design-system/components/DataTable';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Avatar } from '../design-system/components/Avatar';
import { Select } from '../design-system/components/Select';
import { Modal } from '../design-system/components/Modal';
import { Input } from '../design-system/components/Input';
import { mockSuppliers, Supplier } from '../data/mockData';
import { Plus, LayoutGrid, List, Download, Eye, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Column } from '../design-system/components/Table';
import { StaggerContainer, StaggerItem } from '../design-system/motion/StaggerContainer';
import { ease, durations } from '../lib/motion/presets';

export const Suppliers: React.FC = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [countryFilter, setCountryFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New supplier form state
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    country: 'USA',
    industry: 'Steel & Metals',
    commodity: 'Industrial Grade Alloys',
    contactPerson: '',
    email: '',
  });

  const countries = useMemo(() => {
    const list = Array.from(new Set(mockSuppliers.map((s) => s.country)));
    return [{ label: 'All Countries', value: 'ALL' }, ...list.map((c) => ({ label: c, value: c }))];
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) => {
      if (countryFilter !== 'ALL' && s.country !== countryFilter) return false;
      if (riskFilter !== 'ALL' && s.riskLevel !== riskFilter) return false;
      if (tierFilter !== 'ALL' && s.tier !== tierFilter) return false;
      return true;
    });
  }, [suppliers, countryFilter, riskFilter, tierFilter]);

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSupplier.name.trim()) return;

    const created: Supplier = {
      id: `SUP-0${suppliers.length + 1}`,
      name: newSupplier.name,
      country: newSupplier.country,
      countryCode: newSupplier.country.substring(0, 2).toUpperCase(),
      city: 'Industrial Center',
      industry: newSupplier.industry,
      commodity: newSupplier.commodity,
      tier: 'Silver',
      qualityScore: 90.0,
      deliveryScore: 90.0,
      costScore: 85.0,
      sustainabilityScore: 85.0,
      riskScore: 22.0,
      riskLevel: 'Low',
      financialStability: 90.0,
      operationalRisk: 15.0,
      geopoliticalRisk: 15.0,
      complianceRisk: 10.0,
      contactPerson: newSupplier.contactPerson || 'Procurement Rep',
      email: newSupplier.email || 'supplier@corp.com',
      phone: '+1 555 0192',
      address: 'Industrial District Boulevard',
      certifications: ['ISO 9001'],
      annualSpend: 1000000,
      status: 'Active',
      leadTimeDays: 20,
      onTimeDeliveryRate: 95.0,
    };

    setSuppliers([created, ...suppliers]);
    setIsAddModalOpen(false);
    setNewSupplier({ name: '', country: 'USA', industry: 'Steel & Metals', commodity: 'Industrial Grade Alloys', contactPerson: '', email: '' });
  };

  const columns: Column<Supplier>[] = [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedIds.length === filteredSuppliers.length && filteredSuppliers.length > 0}
          onChange={(e) => {
            if (e.target.checked) setSelectedIds(filteredSuppliers.map((s) => s.id));
            else setSelectedIds([]);
          }}
          className="rounded border-border-strong text-accent-primary"
        />
      ),
      width: '40px',
      render: (s) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(s.id)}
          onChange={(e) => {
            e.stopPropagation();
            toggleSelectRow(s.id);
          }}
          className="rounded border-border-strong text-accent-primary"
        />
      ),
    },
    {
      key: 'name',
      header: 'Supplier Organization',
      sortable: true,
      render: (s) => (
        <div className="flex items-center gap-[10px]">
          <Avatar name={s.name} size="sm" />
          <div className="truncate">
            <span
              className="font-medium text-text-primary hover:text-accent-primary cursor-pointer truncate block"
              onClick={() => navigate(`/suppliers/${s.id}`)}
            >
              {s.name}
            </span>
            <span className="text-[12px] text-text-tertiary">{s.commodity}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'country',
      header: 'Country',
      sortable: true,
      render: (s) => (
        <span className="text-text-secondary text-[13px]">
          {s.country}
        </span>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      sortable: true,
      render: (s) => <span className="text-text-secondary">{s.industry}</span>,
    },
    {
      key: 'tier',
      header: 'Tier',
      align: 'center',
      sortable: true,
      render: (s) => {
        const tierVariants: Record<string, 'neutral' | 'success' | 'warning' | 'info'> = {
          Platinum: 'info',
          Gold: 'warning',
          Silver: 'neutral',
          Bronze: 'neutral',
        };
        return <Badge variant={tierVariants[s.tier] || 'neutral'} size="sm">{s.tier}</Badge>;
      },
    },
    {
      key: 'qualityScore',
      header: 'Quality',
      align: 'right',
      sortable: true,
      render: (s) => (
        <div className="flex items-center justify-end gap-[8px]">
          <div className="w-[60px] bg-subtle h-[4px] rounded-full overflow-hidden border border-border-default">
            <div className="bg-semantic-success h-full rounded-full" style={{ width: `${s.qualityScore}%` }} />
          </div>
          <span className="tabular-nums font-medium text-[13px]">{s.qualityScore}%</span>
        </div>
      ),
    },
    {
      key: 'deliveryScore',
      header: 'On-Time SLA',
      align: 'right',
      sortable: true,
      render: (s) => (
        <div className="flex items-center justify-end gap-[8px]">
          <div className="w-[60px] bg-subtle h-[4px] rounded-full overflow-hidden border border-border-default">
            <div className="bg-accent-primary h-full rounded-full" style={{ width: `${s.deliveryScore}%` }} />
          </div>
          <span className="tabular-nums font-medium text-[13px]">{s.deliveryScore}%</span>
        </div>
      ),
    },
    {
      key: 'riskLevel',
      header: 'Risk Score',
      align: 'center',
      sortable: true,
      render: (s) => {
        const riskVariants: Record<string, 'success' | 'warning' | 'danger'> = {
          Low: 'success',
          Medium: 'warning',
          High: 'danger',
        };
        return (
          <Badge variant={riskVariants[s.riskLevel] || 'neutral'} size="sm" dot>
            {s.riskScore.toFixed(1)} • {s.riskLevel}
          </Badge>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) => (
        <div className="flex items-center justify-end gap-[6px]">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/suppliers/${s.id}`);
            }}
            className="text-[12px] h-[28px] px-[8px]"
          >
            <Eye size={14} className="mr-[4px]" /> Profile
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-[20px]">
      <PageHeader
        title="Supplier Directory"
        description="Comprehensive intelligence, performance benchmarks, and risk evaluations across 40+ strategic enterprise vendors."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Suppliers' }]}
        actions={
          <>
            <div className="relative flex items-center bg-subtle border border-border-default rounded-[8px] p-[2px] shadow-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`relative z-10 px-[10px] py-[6px] rounded-[6px] text-[13px] font-medium transition-colors flex items-center gap-[6px] cursor-pointer ${
                  viewMode === 'table' ? 'text-emerald-700 font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
                title="Table View"
              >
                {viewMode === 'table' && (
                  <motion.span
                    layoutId="supplierViewModePill"
                    className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-10"
                    transition={{ duration: durations.fast, ease: ease.out }}
                  />
                )}
                <List size={15} /> <span>Table</span>
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`relative z-10 px-[10px] py-[6px] rounded-[6px] text-[13px] font-medium transition-colors flex items-center gap-[6px] cursor-pointer ${
                  viewMode === 'grid' ? 'text-emerald-700 font-semibold' : 'text-text-secondary hover:text-text-primary'
                }`}
                title="Grid View"
              >
                {viewMode === 'grid' && (
                  <motion.span
                    layoutId="supplierViewModePill"
                    className="absolute inset-0 bg-white rounded-[6px] shadow-xs border border-border-default/60 -z-10"
                    transition={{ duration: durations.fast, ease: ease.out }}
                  />
                )}
                <LayoutGrid size={15} /> <span>Grid</span>
              </button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={<Download size={14} />}
              onClick={() => alert(`Exporting ${filteredSuppliers.length} supplier profiles to CSV...`)}
            >
              Export
            </Button>

            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={14} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Supplier
            </Button>
          </>
        }
      />

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px] p-[16px] bg-white border border-border-default rounded-[10px] shadow-xs">
        <Select
          label="Country / Region"
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          options={countries}
        />
        <Select
          label="Risk Level"
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value)}
          options={[
            { label: 'All Risk Tiers', value: 'ALL' },
            { label: 'Low Risk (<30)', value: 'Low' },
            { label: 'Medium Risk (30-60)', value: 'Medium' },
            { label: 'High Risk (>60)', value: 'High' },
          ]}
        />
        <Select
          label="Tier Classification"
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          options={[
            { label: 'All Tiers', value: 'ALL' },
            { label: 'Platinum Tier', value: 'Platinum' },
            { label: 'Gold Tier', value: 'Gold' },
            { label: 'Silver Tier', value: 'Silver' },
            { label: 'Bronze Tier', value: 'Bronze' },
          ]}
        />
        <div className="flex items-end">
          <Button
            variant="ghost"
            size="md"
            className="w-full text-text-tertiary hover:text-text-primary border border-border-default"
            onClick={() => {
              setCountryFilter('ALL');
              setRiskFilter('ALL');
              setTierFilter('ALL');
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* BULK ACTIONS BAR */}
      {selectedIds.length > 0 && (
        <div className="p-[12px] px-[16px] bg-accent-subtle border border-blue-200 rounded-[8px] flex items-center justify-between text-[13px] animate-in fade-in-50">
          <span className="font-medium text-accent-primary">
            {selectedIds.length} supplier{selectedIds.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-[8px]">
            <Button variant="secondary" size="sm" onClick={() => alert(`Starting RFQ email dispatch to ${selectedIds.length} vendors...`)}>
              Bulk RFQ
            </Button>
            <Button variant="secondary" size="sm" onClick={() => alert(`Running automated AI risk audit on ${selectedIds.length} suppliers...`)}>
              Trigger Risk Audit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds([])}>
              Deselect All
            </Button>
          </div>
        </div>
      )}

      {/* CONTENT: TABLE OR GRID */}
      {viewMode === 'table' ? (
        <DataTable
          columns={columns}
          data={filteredSuppliers}
          keyExtractor={(s) => s.id}
          searchableKey="name"
          searchPlaceholder="Search suppliers by name or commodity..."
          onRowClick={(s) => navigate(`/suppliers/${s.id}`)}
          pageSize={10}
        />
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px]">
          {filteredSuppliers.map((s) => (
            <StaggerItem key={s.id}>
              <div
                onClick={() => navigate(`/suppliers/${s.id}`)}
                className="bg-surface border border-border-default rounded-[12px] p-[20px] shadow-xs hover:border-emerald-300 hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 ease-out cursor-pointer flex flex-col justify-between space-y-[16px]"
              >
                <div className="flex items-start justify-between gap-[12px]">
                  <div className="flex items-center gap-[10px]">
                    <Avatar name={s.name} size="md" />
                    <div>
                      <h3 className="text-[15px] font-semibold text-text-primary leading-[20px]">{s.name}</h3>
                      <p className="text-[12px] text-text-tertiary">{s.country} • {s.commodity}</p>
                    </div>
                  </div>
                  <Badge variant={s.tier === 'Platinum' ? 'info' : 'neutral'} size="sm">{s.tier}</Badge>
                </div>

                <div className="grid grid-cols-3 gap-[8px] py-[10px] border-y border-border-default text-center text-[12px]">
                  <div>
                    <div className="text-text-tertiary text-[11px]">Quality</div>
                    <div className="font-semibold text-text-primary tabular-nums mt-[2px]">{s.qualityScore}%</div>
                  </div>
                  <div>
                    <div className="text-text-tertiary text-[11px]">Delivery</div>
                    <div className="font-semibold text-text-primary tabular-nums mt-[2px]">{s.deliveryScore}%</div>
                  </div>
                  <div>
                    <div className="text-text-tertiary text-[11px]">Risk Score</div>
                    <div className="font-semibold text-emerald-600 tabular-nums mt-[2px]">{s.riskScore.toFixed(1)}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <span className="text-text-tertiary">Lead Time: <span className="font-medium text-text-primary">{s.leadTimeDays}d</span></span>
                  <span className="text-emerald-700 font-medium flex items-center gap-[4px] hover:underline">
                    View Profile <ExternalLink size={12} />
                  </span>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

      {/* ADD SUPPLIER MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Supplier Profile"
        description="Onboard an enterprise supplier with baseline performance and commodity classification."
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddSupplier}>
              Save & Onboard
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddSupplier} className="space-y-[14px]">
          <Input
            label="Company Legal Name"
            required
            value={newSupplier.name}
            onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
            placeholder="e.g. Nippon Carbon Co."
          />
          <div className="grid grid-cols-2 gap-[12px]">
            <Select
              label="Country of Incorporation"
              value={newSupplier.country}
              onChange={(e) => setNewSupplier({ ...newSupplier, country: e.target.value })}
              options={[
                { label: 'United States', value: 'USA' },
                { label: 'Germany', value: 'Germany' },
                { label: 'Japan', value: 'Japan' },
                { label: 'India', value: 'India' },
                { label: 'China', value: 'China' },
                { label: 'South Korea', value: 'South Korea' },
              ]}
            />
            <Input
              label="Primary Commodity"
              required
              value={newSupplier.commodity}
              onChange={(e) => setNewSupplier({ ...newSupplier, commodity: e.target.value })}
              placeholder="e.g. Graphite Anodes"
            />
          </div>
          <div className="grid grid-cols-2 gap-[12px]">
            <Input
              label="Contact Person"
              value={newSupplier.contactPerson}
              onChange={(e) => setNewSupplier({ ...newSupplier, contactPerson: e.target.value })}
              placeholder="Full Name"
            />
            <Input
              label="Official Contact Email"
              type="email"
              value={newSupplier.email}
              onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
              placeholder="rep@supplier.com"
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
