import React, { useState } from 'react';
import { PageHeader } from '../design-system/components/PageHeader';
import { Tabs, TabItem } from '../design-system/components/Tabs';
import { Card, CardHeader, CardBody, CardFooter } from '../design-system/components/Card';
import { Input } from '../design-system/components/Input';
import { Button } from '../design-system/components/Button';
import { Switch } from '../design-system/components/Switch';
import { Badge } from '../design-system/components/Badge';
import { Avatar } from '../design-system/components/Avatar';
import { Select } from '../design-system/components/Select';
import { Table, Column } from '../design-system/components/Table';
import { useAuthStore } from '../store/authStore';
import { mockUsers, UserAccount } from '../data/mockData';
import { ShieldCheck, Key, Plus } from 'lucide-react';

export const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');

  // Profile Form State
  const [profileName, setProfileName] = useState(user?.name || 'Elena Rostova');
  const [profileEmail, setProfileEmail] = useState(user?.email || 'elena.rostova@smartprocure.ai');
  const [timezone, setTimezone] = useState('UTC-5 (Eastern Time)');

  // Notification toggles
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [riskSpikes, setRiskSpikes] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  // Integrations state
  const [integrations, setIntegrations] = useState([
    { id: 'sap', name: 'SAP S/4HANA ERP', desc: 'Sync purchase orders, goods receipts, and vendor records.', connected: true },
    { id: 'oracle', name: 'Oracle Cloud SCM', desc: 'Automate requisition approval flows and material ledgers.', connected: false },
    { id: 'slack', name: 'Slack Procurement Alerts', desc: 'Post instant notifications when supplier risk exceeds threshold 60.', connected: true },
    { id: 'teams', name: 'Microsoft Teams', desc: 'Executive dashboard updates and approval action cards.', connected: false },
  ]);

  const tabs: TabItem[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'organization', label: 'Organization' },
    { id: 'team', label: 'Team & Roles' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'apikeys', label: 'API Keys' },
    { id: 'billing', label: 'Billing & Plan' },
    { id: 'integrations', label: 'Integrations' },
  ];

  const teamColumns: Column<UserAccount>[] = [
    {
      key: 'name',
      header: 'Member Name',
      render: (u) => (
        <div className="flex items-center gap-[10px]">
          <Avatar name={u.name} size="sm" />
          <div>
            <span className="font-medium text-text-primary block">{u.name}</span>
            <span className="text-[12px] text-text-tertiary">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role Access',
      render: (u) => <Badge variant={u.role === 'Admin' ? 'info' : 'neutral'} size="sm">{u.role}</Badge>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: () => <Badge variant="success" size="sm" dot>Active</Badge>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: () => (
        <Button variant="ghost" size="sm" className="text-[12px] h-[28px] text-text-tertiary hover:text-text-primary">
          Edit Role
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-[24px]">
      <PageHeader
        title="Settings & Workspace Configuration"
        description="Manage organizational accounts, team access privileges, security credentials, and ERP system integrations."
        breadcrumbs={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Settings' }]}
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {/* TAB: PROFILE */}
      {activeTab === 'profile' && (
        <Card className="max-w-[720px]">
          <CardHeader
            title="Personal Profile & Preferences"
            description="Update your identification and regional display settings"
          />
          <CardBody className="space-y-[18px]">
            <div className="flex items-center gap-[16px] pb-[16px] border-b border-border-default">
              <Avatar name={profileName} size="xl" />
              <div>
                <Button variant="secondary" size="sm">
                  Upload Photo
                </Button>
                <p className="text-[11px] text-text-tertiary mt-[4px]">JPG, PNG or GIF up to 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[14px]">
              <Input
                label="Full Legal Name"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
              <Input
                label="Corporate Email Address"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </div>

            <Select
              label="System Timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              options={[
                { label: 'UTC-5 (Eastern Time - US & Canada)', value: 'UTC-5' },
                { label: 'UTC+0 (Greenwich Mean Time - London)', value: 'UTC+0' },
                { label: 'UTC+1 (Central European Time - Berlin)', value: 'UTC+1' },
                { label: 'UTC+5:30 (India Standard Time - Mumbai)', value: 'UTC+5:30' },
                { label: 'UTC+8 (Singapore, Beijing, Taipei)', value: 'UTC+8' },
                { label: 'UTC+9 (Japan Standard Time - Tokyo)', value: 'UTC+9' },
              ]}
            />
          </CardBody>
          <CardFooter>
            <span className="text-[12px] text-text-tertiary">Changes sync instantly across your active devices.</span>
            <Button variant="primary" size="sm" onClick={() => alert('Profile settings updated successfully.')}>
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB: ORGANIZATION */}
      {activeTab === 'organization' && (
        <Card className="max-w-[720px]">
          <CardHeader
            title="Organization Profile"
            description="Company identity for purchase orders and vendor correspondence"
          />
          <CardBody className="space-y-[16px]">
            <Input label="Enterprise Legal Entity" defaultValue="SmartProcure Global Supply Corp" />
            <div className="grid grid-cols-2 gap-[14px]">
              <Input label="Industry Vertical" defaultValue="Advanced Industrial Manufacturing" />
              <Input label="Tax Registration / VAT ID" defaultValue="US-EIN 84-2910391" />
            </div>
            <Input label="Corporate Headquarters Address" defaultValue="100 Enterprise Way, Suite 400, Chicago, IL 60601" />
          </CardBody>
          <CardFooter>
            <span />
            <Button variant="primary" size="sm" onClick={() => alert('Organization details saved.')}>
              Save Organization
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* TAB: TEAM & ROLES */}
      {activeTab === 'team' && (
        <Card>
          <CardHeader
            title="Active Team Members & Role Privileges"
            description="Manage RBAC access for analysts, managers, and system administrators"
            action={
              <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => alert('Opening member invite dialog...')}>
                Invite Colleague
              </Button>
            }
          />
          <div className="p-[20px]">
            <Table
              columns={teamColumns}
              data={mockUsers}
              keyExtractor={(u) => u.id}
            />
          </div>
        </Card>
      )}

      {/* TAB: NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <Card className="max-w-[720px]">
          <CardHeader
            title="Notification & Alert Thresholds"
            description="Configure automated dispatch criteria for anomalous supplier activities"
          />
          <CardBody className="space-y-[18px]">
            <Switch
              checked={riskSpikes}
              onChange={setRiskSpikes}
              label="Supplier Risk Spike Threshold Alerts"
              description="Dispatch priority alerts when composite vendor risk jumps over 15 points in 30 days."
            />
            <div className="h-[1px] bg-border-default" />
            <Switch
              checked={emailAlerts}
              onChange={setEmailAlerts}
              label="Purchase Order SLA Breach Warnings"
              description="Notify procurement managers when actual delivery lead time exceeds contracted SLA."
            />
            <div className="h-[1px] bg-border-default" />
            <Switch
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
              label="Weekly Commodity Forecasting Summary"
              description="Receive weekly digest of 90-day price trajectories and suggested spot hedges."
            />
          </CardBody>
        </Card>
      )}

      {/* TAB: API KEYS */}
      {activeTab === 'apikeys' && (
        <Card className="max-w-[720px]">
          <CardHeader
            title="Production API Keys"
            description="Programmatic REST API tokens for integrating SmartProcure with external pipelines"
            action={
              <Button variant="secondary" size="sm" icon={<Key size={14} />} onClick={() => alert('New API key generated: sp_live_8492049103982')}>
                Create Key
              </Button>
            }
          />
          <CardBody className="space-y-[16px]">
            <div className="p-[14px] bg-subtle border border-border-default rounded-[10px] flex items-center justify-between">
              <div>
                <span className="font-mono text-[13px] font-semibold text-text-primary">sp_live_9481028491048••••••••</span>
                <span className="text-[12px] text-text-tertiary block mt-[2px]">Created Sep 2024 • Read/Write Scopes</span>
              </div>
              <Button variant="ghost" size="sm" className="text-semantic-danger hover:bg-semantic-danger-bg">
                Revoke
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB: BILLING */}
      {activeTab === 'billing' && (
        <Card className="max-w-[720px]">
          <CardHeader
            title="Subscription & Capacity"
            description="Current contract licensing and provisioned seat allocation"
          />
          <CardBody className="space-y-[16px]">
            <div className="p-[16px] bg-accent-subtle/50 border border-blue-200 rounded-[10px] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-[6px]">
                  <ShieldCheck size={18} className="text-accent-primary" />
                  <span className="font-semibold text-text-primary text-[15px]">Enterprise Pro Plan</span>
                  <Badge variant="info" size="sm">Annual</Badge>
                </div>
                <p className="text-[13px] text-text-secondary mt-[4px]">
                  Unlimited supplier audits, Prophet forecasting, and multi-user RBAC.
                </p>
              </div>
              <div className="text-right">
                <div className="text-[20px] font-semibold text-text-primary">$2,400 / mo</div>
                <span className="text-[11px] text-text-tertiary">Billed annually</span>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {/* TAB: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {integrations.map((item) => (
            <Card key={item.id}>
              <CardBody className="space-y-[14px] flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-[6px]">
                    <h4 className="font-semibold text-text-primary text-[15px]">{item.name}</h4>
                    <Badge variant={item.connected ? 'success' : 'neutral'} size="sm" dot>
                      {item.connected ? 'Connected' : 'Disconnected'}
                    </Badge>
                  </div>
                  <p className="text-[13px] text-text-secondary leading-[18px]">{item.desc}</p>
                </div>

                <div className="pt-[10px] border-t border-border-default flex items-center justify-between">
                  <span className="text-[12px] text-text-tertiary">Real-time Webhook</span>
                  <Button
                    variant={item.connected ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => {
                      setIntegrations(
                        integrations.map((i) => (i.id === item.id ? { ...i, connected: !i.connected } : i))
                      );
                    }}
                  >
                    {item.connected ? 'Configure' : 'Connect'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
