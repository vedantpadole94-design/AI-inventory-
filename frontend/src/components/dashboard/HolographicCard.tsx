import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface Props {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}

export default function HolographicCard({ title, value, subtitle, icon, trend }: Props) {
  const trendColor = trend === 'up' ? 'text-green-500' : trend === 'down' ? 'text-red-500' : 'text-gray-400';

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotateX: 5, rotateY: 5 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="glass-panel p-6 rounded-xl flex flex-col justify-between relative overflow-hidden"
      style={{ perspective: 1000 }}
    >
      {/* Decorative gradient orb */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
      
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-gray-400 font-medium">{title}</h4>
        <div className="p-2 bg-white/5 rounded-lg text-primary">
          {icon}
        </div>
      </div>
      
      <div>
        <h2 className="text-3xl font-bold text-white mb-1">{value}</h2>
        <p className={`text-sm ${trendColor}`}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
