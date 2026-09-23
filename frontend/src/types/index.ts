export type Language = 'en' | 'hi' | 'zh';
export type NotificationType = 'info' | 'success' | 'warning' | 'alert';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface DashboardKpi {
  label: string;
  value: string;
  change: string;
  icon: string;
  tone: 'up' | 'down' | 'neutral';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: string;
  read: boolean;
}

export interface SupplierScorecard {
  name: string;
  country: string;
  score: number;
  quality: number;
  delivery: number;
  cost: number;
  sustainability: number;
  risk: RiskLevel;
}

export interface Preferences {
  compactMode: boolean;
  showTips: boolean;
  accentColor: string;
  enableRealtime: boolean;
  density: 'comfortable' | 'compact';
}
