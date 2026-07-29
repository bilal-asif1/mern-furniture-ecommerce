import { motion } from 'framer-motion';

export default function MetricCard({ label, value, delta, icon: Icon }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl bg-white p-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#f2e6db]/50 relative overflow-hidden group transition-colors"
    >
      <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#fcfaf7] group-hover:bg-[#f7efe3] transition-colors duration-300 pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <p className="text-sm font-medium text-text/60 tracking-wide uppercase">{label}</p>
        {Icon && (
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#f7efe3] text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Icon size={24} strokeWidth={2} />
          </div>
        )}
      </div>
      <div className="mt-4 flex items-end justify-between gap-4 relative z-10">
        <p className="font-display text-4xl font-semibold text-text tracking-tight">{value}</p>
        {delta && (
          <span className="rounded-full bg-[#f2e6db] px-3 py-1.5 text-xs font-semibold text-primary">{delta}</span>
        )}
      </div>
    </motion.div>
  );
}
