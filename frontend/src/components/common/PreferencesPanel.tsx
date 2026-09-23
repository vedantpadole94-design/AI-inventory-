import { motion } from 'framer-motion';
import { Settings2, MoonStar, Languages, BellRing } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function PreferencesPanel() {
  const preferences = useStore((state) => state.preferences);
  const setPreferences = useStore((state) => state.setPreferences);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md"
    >
      <div className="mb-4 flex items-center gap-2 text-slate-700">
        <Settings2 size={18} />
        <h3 className="font-semibold">User preferences</h3>
      </div>

      <div className="space-y-4 text-sm text-slate-700">
        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
          <span className="flex items-center gap-2"><MoonStar size={16} /> Compact mode</span>
          <input type="checkbox" checked={preferences.compactMode} onChange={(e) => setPreferences({ compactMode: e.target.checked })} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
          <span className="flex items-center gap-2"><BellRing size={16} /> Real-time alerts</span>
          <input type="checkbox" checked={preferences.enableRealtime} onChange={(e) => setPreferences({ enableRealtime: e.target.checked })} />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3">
          <span className="flex items-center gap-2"><Languages size={16} /> Show onboarding tips</span>
          <input type="checkbox" checked={preferences.showTips} onChange={(e) => setPreferences({ showTips: e.target.checked })} />
        </label>

        <div className="rounded-xl bg-slate-50 p-3">
          <label className="mb-2 block text-slate-600">Accent color</label>
          <input
            type="color"
            value={preferences.accentColor}
            onChange={(e) => setPreferences({ accentColor: e.target.value })}
            className="h-10 w-full rounded border border-slate-200 bg-transparent"
            aria-label="Choose accent color"
          />
        </div>
      </div>
    </motion.div>
  );
}
