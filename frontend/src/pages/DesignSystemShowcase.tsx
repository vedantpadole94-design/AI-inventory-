import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { Card, CardHeader, CardBody } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { IconButton } from '../design-system/components/IconButton';
import { Input } from '../design-system/components/Input';
import { Select } from '../design-system/components/Select';
import { Checkbox, Radio } from '../design-system/components/Checkbox';
import { Switch } from '../design-system/components/Switch';
import { Badge } from '../design-system/components/Badge';
import { Chip } from '../design-system/components/Chip';
import { Avatar } from '../design-system/components/Avatar';
import { Tooltip } from '../design-system/components/Tooltip';
import { DropdownMenu } from '../design-system/components/DropdownMenu';
import { Modal } from '../design-system/components/Modal';
import { Drawer } from '../design-system/components/Drawer';
import { Tabs } from '../design-system/components/Tabs';
import { Table } from '../design-system/components/Table';
import { Pagination } from '../design-system/components/Pagination';
import { Breadcrumb } from '../design-system/components/Breadcrumb';
import { Toast } from '../design-system/components/Toast';
import { Skeleton } from '../design-system/components/Skeleton';
import { EmptyState } from '../design-system/components/EmptyState';
import { StatCard } from '../design-system/components/StatCard';
import {
  Sparkles,
  Search,
  Filter,
  Package,
  Layers,
  Plus,
} from 'lucide-react';

export const DesignSystemShowcase: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [switchVal, setSwitchVal] = useState(true);
  const [activeTab, setActiveTab] = useState('one');
  const [page, setPage] = useState(1);
  const [selectedRadio, setSelectedRadio] = useState('opt1');

  return (
    <div className="space-y-[32px]">
      <PageHeader
        title="SmartProcure AI Design System (25 Primitives)"
        description="Comprehensive production-grade UI components built for enterprise consistency, keyboard accessibility, and strict light-theme tokens."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Design System' }]}
      />

      {/* 1. BUTTONS & ICON BUTTONS */}
      <Card>
        <CardHeader title="1. Button & 2. IconButton" description="Variants (primary, secondary, ghost, danger), sizes (sm, md, lg), and loading states" />
        <CardBody className="space-y-[16px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <Button variant="primary" size="sm">Primary SM</Button>
            <Button variant="primary" size="md">Primary MD</Button>
            <Button variant="primary" size="lg">Primary LG</Button>
            <Button variant="secondary" size="md">Secondary</Button>
            <Button variant="ghost" size="md">Ghost</Button>
            <Button variant="danger" size="md">Danger</Button>
            <Button variant="primary" size="md" loading>Loading</Button>
          </div>
          <div className="flex items-center gap-[10px] pt-[8px] border-t border-border-default">
            <IconButton icon={<Search size={16} />} tooltip="Search Records" variant="secondary" size="sm" />
            <IconButton icon={<Plus size={16} />} tooltip="Add Vendor" variant="primary" size="md" />
            <IconButton icon={<Filter size={16} />} tooltip="Filter Columns" variant="ghost" size="md" />
          </div>
        </CardBody>
      </Card>

      {/* 3. INPUT & 4. SELECT */}
      <Card>
        <CardHeader title="3. Input & 4. Select" description="With labels, hints, prefixes, suffixes, and error states" />
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
          <Input label="Commodity Code" placeholder="e.g. STL-HRC-01" prefix={<Package size={16} />} hint="Standard ERP format" />
          <Input label="Contract Value" placeholder="0.00" suffix={<span className="text-[12px] font-mono">USD</span>} />
          <Select
            label="Incoterms Standard"
            options={[
              { label: 'FOB (Free on Board)', value: 'FOB' },
              { label: 'CIF (Cost, Insurance & Freight)', value: 'CIF' },
              { label: 'DDP (Delivered Duty Paid)', value: 'DDP' },
            ]}
          />
        </CardBody>
      </Card>

      {/* 5. CHECKBOX, RADIO & 6. SWITCH */}
      <Card>
        <CardHeader title="5. Checkbox & Radio, 6. Switch" description="Accessible form controls with focus rings" />
        <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-[24px]">
          <div className="space-y-[10px]">
            <span className="text-[13px] font-medium text-text-primary block">Checkboxes</span>
            <Checkbox label="Require ESG Certification" checked />
            <Checkbox label="Enforce 30-Day Lead Time" />
          </div>
          <div className="space-y-[10px]">
            <span className="text-[13px] font-medium text-text-primary block">Radio Group</span>
            <Radio label="Fixed Price Index" checked={selectedRadio === 'opt1'} onChange={() => setSelectedRadio('opt1')} />
            <Radio label="Floating Collar Index" checked={selectedRadio === 'opt2'} onChange={() => setSelectedRadio('opt2')} />
          </div>
          <div>
            <span className="text-[13px] font-medium text-text-primary block mb-[10px]">Toggle Switch</span>
            <Switch checked={switchVal} onChange={setSwitchVal} label="Autonomous Dispatch" description="Automatically flag late orders" />
          </div>
        </CardBody>
      </Card>

      {/* 7. BADGE, 8. CHIP, 9. AVATAR, 10. TOOLTIP */}
      <Card>
        <CardHeader title="7. Badge, 8. Chip, 9. Avatar, 10. Tooltip" description="Status indicators, metadata tags, and accessible tooltips" />
        <CardBody className="space-y-[18px]">
          <div className="flex flex-wrap items-center gap-[10px]">
            <Badge variant="neutral">Neutral</Badge>
            <Badge variant="success" dot>Success SLA</Badge>
            <Badge variant="warning" dot>Audit Pending</Badge>
            <Badge variant="danger" dot>Critical Risk</Badge>
            <Badge variant="info">Platinum Tier</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Chip active>Active Material</Chip>
            <Chip onDismiss={() => alert('Dismissed')}>Dismissible Filter</Chip>
            <Chip icon={<Layers size={14} />}>With Icon</Chip>
          </div>
          <div className="flex items-center gap-[16px]">
            <Avatar name="Tata Steel" size="sm" />
            <Avatar name="Nucor Corp" size="md" />
            <Avatar name="BASF SE" size="lg" />
            <Tooltip content="Verified Supplier via ISO 9001">
              <span className="text-[13px] text-accent-primary font-medium cursor-help underline decoration-dashed">
                Hover for Tooltip
              </span>
            </Tooltip>
          </div>
        </CardBody>
      </Card>

      {/* 11. DROPDOWN, 12. MODAL, 13. DRAWER, 14. TABS */}
      <Card>
        <CardHeader title="11. Dropdown, 12. Modal, 13. Drawer, 14. Tabs" description="Overlays, menus, and tabbed navigation" />
        <CardBody className="space-y-[18px]">
          <div className="flex flex-wrap items-center gap-[12px]">
            <DropdownMenu
              trigger={<Button variant="secondary" size="sm">Open Dropdown Menu</Button>}
              sections={[
                {
                  title: 'Actions',
                  items: [
                    { id: '1', label: 'View Profile', onClick: () => alert('Viewed') },
                    { id: '2', label: 'Trigger Audit', onClick: () => alert('Audit') },
                  ],
                },
              ]}
            />
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(true)}>
              Open Dialog Modal
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setDrawerOpen(true)}>
              Open Side Drawer
            </Button>
          </div>
          <Tabs
            tabs={[
              { id: 'one', label: 'Underline Tab 1', count: 12 },
              { id: 'two', label: 'Underline Tab 2', count: 4 },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </CardBody>
      </Card>

      {/* 15. TABLE & 16. PAGINATION */}
      <Card>
        <CardHeader title="15. Table & 16. Pagination" description="Data tables with sorting, alignment, and page controls" />
        <div className="p-[20px] space-y-[14px]">
          <Table
            columns={[
              { key: 'code', header: 'Code' },
              { key: 'name', header: 'Commodity' },
              { key: 'price', header: 'Unit Price', align: 'right' },
            ]}
            data={[
              { code: 'STL-01', name: 'Hot Rolled Steel', price: '$845.00' },
              { code: 'ALM-02', name: 'Primary Aluminum', price: '$2,420.00' },
            ]}
            keyExtractor={(r) => r.code}
          />
          <Pagination
            currentPage={page}
            totalPages={5}
            totalItems={50}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      </Card>

      {/* 17. BREADCRUMB, 18. TOAST, 19. SKELETON, 20. EMPTY STATE */}
      <Card>
        <CardHeader title="17. Breadcrumb, 18. Toast, 19. Skeleton, 20. EmptyState" description="Feedback components and placeholder states" />
        <CardBody className="space-y-[20px]">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Suppliers', href: '/suppliers' }, { label: 'Tata Steel' }]} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
            <Toast variant="success" title="Purchase Order Approved" description="PO-2024-00488 issued to Tata Steel Limited." />
            <Toast variant="error" title="SLA Breach Alert" description="GlobalChem delivery delayed by 8 days." />
          </div>
          <div className="space-y-[8px]">
            <span className="text-[12px] text-text-tertiary">Skeleton Shimmer:</span>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="rectangular" height={60} />
          </div>
          <EmptyState
            icon={<Package size={24} />}
            title="No Purchase Orders Found"
            description="Try adjusting your filters or date range to see matching orders."
            action={<Button variant="secondary" size="sm">Clear Filters</Button>}
          />
        </CardBody>
      </Card>

      {/* 21. CARD, 22. STATCARD, 25. PAGEHEADER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
        <StatCard
          label="SaaS Benchmark Efficiency"
          value="98.4%"
          trend={{ value: "↑ 2.4%", direction: "up" }}
          sparklineData={[92, 94, 95, 96, 98.4]}
          icon={<Sparkles size={18} />}
        />
        <Card>
          <CardHeader title="21. Card Container" description="Standardized header, body, footer framing" />
          <CardBody>
            <p className="text-[13px] text-text-secondary">
              Strict 4px grid spacing, no glowing shadows, and WCAG AA accessible contrast ratios.
            </p>
          </CardBody>
        </Card>
      </div>

      {/* DEMO MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Design System Dialog Primitive"
        description="Features full keyboard escape trapping, background blur, and accessible footer."
        footer={<Button variant="primary" onClick={() => setModalOpen(false)}>Done</Button>}
      >
        <p className="text-[14px] text-text-secondary">
          This dialog modal adheres strictly to the SmartProcure light theme tokens with `#FFFFFF` surface and `#E7E5E4` border.
        </p>
      </Modal>

      {/* DEMO DRAWER */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Side Sheet Drawer Primitive"
        description="Smooth slide-over panel for complex inspection flows."
        footer={<Button variant="secondary" onClick={() => setDrawerOpen(false)}>Close</Button>}
      >
        <p className="text-[14px] text-text-secondary">
          Used throughout the platform for deep purchase order inspections, supplier risk scorecards, and customer lifetime audits.
        </p>
      </Drawer>
    </div>
  );
};
