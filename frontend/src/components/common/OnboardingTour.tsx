import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

const steps = [
  'Welcome to the procurement cockpit. Start with the dashboard overview.',
  'Use the supplier view to compare risk, delivery, and cost indicators.',
  'Use analytics and risk assessment to identify procurement opportunities.',
];

export default function OnboardingTour() {
  const onboardingComplete = useStore((state) => state.onboardingComplete);
  const setOnboardingComplete = useStore((state) => state.setOnboardingComplete);
  const [visible, setVisible] = useState(!onboardingComplete);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    setVisible(!onboardingComplete);
  }, [onboardingComplete]);

  if (!visible) return null;

  const current = steps[stepIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="fixed right-6 top-24 z-50 w-80 rounded-2xl border border-sky-200 bg-white/90 p-4 shadow-[0_8px_32px_rgba(31,38,135,0.15)] backdrop-blur-md"
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sky-700">
            <HelpCircle size={18} />
            <span className="font-semibold">Quick tour</span>
          </div>
          <button aria-label="Close onboarding" onClick={() => { setOnboardingComplete(true); setVisible(false); }}>
            <X size={16} className="text-slate-500" />
          </button>
        </div>

        <p className="mb-4 text-sm text-slate-700">{current}</p>

        <div className="mb-4 flex gap-2">
          {steps.map((_, index) => (
            <span
              key={index}
              className={`h-2 flex-1 rounded-full ${index === stepIndex ? 'bg-sky-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm text-slate-600"
            onClick={() => setStepIndex((prev) => (prev === 0 ? 0 : prev - 1))}
          >
            Back
          </button>
          <button
            className="rounded-full bg-sky-500 px-3 py-1.5 text-sm text-white"
            onClick={() => {
              if (stepIndex < steps.length - 1) {
                setStepIndex((prev) => prev + 1);
              } else {
                setOnboardingComplete(true);
                setVisible(false);
              }
            }}
          >
            {stepIndex === steps.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
