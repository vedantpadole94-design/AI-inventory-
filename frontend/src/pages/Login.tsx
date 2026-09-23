import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from '../design-system/components/Button';
import { Input } from '../design-system/components/Input';
import { Checkbox } from '../design-system/components/Checkbox';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('demo@smartprocure.ai');
  const [password, setPassword] = useState('demo1234');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, demoLogin } = useAuthStore();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please provide a valid work email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email, password);
      setLoading(false);
      navigate('/dashboard');
    }, 400);
  };

  const handleQuickDemo = (role: 'admin' | 'demo' | 'analyst' = 'demo') => {
    setLoading(true);
    setTimeout(() => {
      demoLogin(role);
      setLoading(false);
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen w-full flex bg-canvas text-text-primary">
      {/* LEFT: 55% Marketing Panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-gradient-to-br from-[#FAFAF9] via-[#F5F5F4] to-[#E7E5E4] border-r border-border-default p-[48px] flex-col justify-between relative overflow-hidden select-none">
        {/* Top: Brand Header */}
        <div className="flex items-center gap-[10px]">
          <div className="w-[36px] h-[36px] rounded-[8px] bg-accent-primary flex items-center justify-center text-white shadow-xs font-semibold text-[16px]">
            SP
          </div>
          <div className="flex flex-col">
            <span className="text-[17px] font-semibold text-text-primary tracking-tight">
              SmartProcure AI
            </span>
            <span className="text-[11px] text-text-tertiary tracking-wider uppercase font-medium">
              Enterprise Supply Chain Intelligence
            </span>
          </div>
        </div>

        {/* Center: Value Proposition & Stats */}
        <div className="max-w-[540px] my-auto py-[40px] space-y-[28px]">
          <div className="inline-flex items-center gap-[6px] px-[10px] py-[4px] rounded-full bg-accent-subtle border border-blue-200 text-accent-primary text-[12px] font-medium">
            <ShieldCheck size={14} /> Enterprise-Grade Procurement SaaS
          </div>

          <h1 className="text-[36px] leading-[44px] font-semibold text-text-primary tracking-[-0.02em]">
            Procurement intelligence for modern supply chains.
          </h1>

          <p className="text-[15px] leading-[24px] text-text-secondary">
            Consolidate real-time commodity pricing, automated supplier risk scoring, and predictive demand analytics into one unified mission control.
          </p>

          <div className="space-y-[14px]">
            {[
              'Real-time AI risk scoring across 40+ global commodities & materials',
              'Predictive price forecasting with Prophet & XGBoost time-series models',
              'Generative contract extraction, audit trails, and automated RFQ workflows',
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-[10px]">
                <CheckCircle2 size={18} className="text-semantic-success shrink-0 mt-[2px]" />
                <span className="text-[14px] text-text-secondary leading-[20px] font-medium">{text}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-[16px] pt-[12px] border-t border-border-default">
            <div>
              <div className="text-[26px] font-semibold text-text-primary tabular-nums">10,000+</div>
              <div className="text-[12px] text-text-tertiary">Global Suppliers Analyzed</div>
            </div>
            <div>
              <div className="text-[26px] font-semibold text-text-primary tabular-nums">94.2%</div>
              <div className="text-[12px] text-text-tertiary">On-Time Delivery Accuracy</div>
            </div>
          </div>
        </div>

        {/* Bottom: Customer Testimonial */}
        <div className="bg-white/80 backdrop-blur-sm border border-border-default rounded-[12px] p-[18px] max-w-[500px] shadow-xs">
          <p className="text-[13px] text-text-secondary italic leading-[20px]">
            "SmartProcure cut our supplier lead-time variance by 34% in our very first quarter, giving our leadership total visibility into tier-1 commodity exposures."
          </p>
          <div className="mt-[10px] flex items-center gap-[10px]">
            <div className="w-[30px] h-[30px] rounded-full bg-slate-200 text-slate-800 text-[12px] font-semibold flex items-center justify-center">
              MV
            </div>
            <div>
              <div className="text-[12px] font-semibold text-text-primary">Marcus Vance</div>
              <div className="text-[11px] text-text-tertiary">VP of Global Sourcing, Industrial Automation</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: 45% Auth Form Panel */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-[24px] sm:p-[48px] bg-white">
        <div className="w-full max-w-[400px] space-y-[24px]">
          {/* Mobile brand header */}
          <div className="lg:hidden flex items-center gap-[10px] mb-[20px]">
            <div className="w-[32px] h-[32px] rounded-[8px] bg-accent-primary flex items-center justify-center text-white font-semibold text-[15px]">
              SP
            </div>
            <span className="text-[16px] font-semibold text-text-primary">SmartProcure AI</span>
          </div>

          <div>
            <h2 className="text-[24px] font-semibold text-text-primary leading-[32px] tracking-[-0.01em]">
              Welcome back
            </h2>
            <p className="text-[14px] text-text-secondary mt-[4px]">
              Sign in to access your procurement workspace
            </p>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-[14px] rounded-[10px] bg-accent-subtle border border-blue-100 space-y-[8px]">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-accent-primary">Instant Evaluation Access</span>
              <span className="text-[11px] font-mono text-accent-primary bg-white px-[6px] py-[1px] rounded border border-blue-200">
                1-Click
              </span>
            </div>
            <p className="text-[12px] text-text-secondary">
              Reviewing the platform? Click below to instantly launch with pre-loaded enterprise data:
            </p>
            <div className="flex gap-[8px] pt-[2px]">
              <Button
                type="button"
                variant="primary"
                size="sm"
                className="flex-1 text-[12px]"
                onClick={() => handleQuickDemo('demo')}
              >
                Manager Demo <ArrowRight size={13} />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-[12px]"
                onClick={() => handleQuickDemo('admin')}
              >
                Admin
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="text-[12px]"
                onClick={() => handleQuickDemo('analyst')}
              >
                Analyst
              </Button>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-[16px]">
            <Input
              label="Work Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />

            <div className="flex items-center justify-between text-[13px]">
              <Checkbox
                label="Remember me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <a href="#forgot" onClick={(e) => { e.preventDefault(); alert('For this demo, please use the 1-click demo login.'); }} className="text-accent-primary hover:underline font-medium">
                Forgot password?
              </a>
            </div>

            {error && (
              <p className="text-[13px] text-semantic-danger font-medium">{error}</p>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="relative flex items-center justify-center my-[20px]">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-default" />
            </div>
            <span className="relative bg-white px-[12px] text-[12px] text-text-tertiary uppercase tracking-wider">
              or continue with
            </span>
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full text-text-primary"
            onClick={() => handleQuickDemo('demo')}
          >
            <svg className="w-[16px] h-[16px] mr-[8px]" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign in with Google Workspace SSO
          </Button>

          <p className="text-[12px] text-text-tertiary text-center leading-[16px]">
            Protected by enterprise encryption & SAML 2.0 SSO.
            <br />
            By signing in, you agree to our Enterprise Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
};
