import { motion } from 'framer-motion';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(244,235,224,0.98))] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex w-full max-w-sm flex-col items-center rounded-[2rem] border border-white/80 bg-white/90 px-8 py-10 text-center shadow-[0_20px_70px_rgba(86,58,36,0.16)] backdrop-blur-md"
      >
        <motion.img
          src="/logo.png"
          alt="Junaid Furniture"
          className="h-20 w-auto object-contain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
        />
        <motion.div
          className="mt-8 h-12 w-12 rounded-full border-2 border-[#d9c2ab] border-t-[#8b5e3c]"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-5 text-sm font-medium uppercase tracking-[0.28em] text-text/55"
        >
          Loading luxury experience
        </motion.p>
      </motion.div>
    </div>
  );
}
