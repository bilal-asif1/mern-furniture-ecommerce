import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';

export default function LoadingScreen({
  visible = true,
  progress = 0,
  message = 'Getting things ready for you...',
}) {
  const clampedProgress = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="status"
          aria-live="polite"
          aria-busy="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,248,240,0.96),_rgba(242,232,218,0.99))] px-4"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(139,94,60,0.08),transparent_30%),radial-gradient(circle_at_80%_80%,rgba(216,192,170,0.2),transparent_34%)]" />
          <div className="absolute left-[-8%] top-[12%] h-56 w-56 rounded-full bg-[#d8c0aa]/20 blur-3xl" />
          <div className="absolute bottom-[-10%] right-[-8%] h-72 w-72 rounded-full bg-[#8b5e3c]/10 blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative flex w-full max-w-xl flex-col items-center rounded-[2rem] border border-[#eadfce]/80 bg-white/72 px-6 py-10 text-center shadow-[0_24px_80px_rgba(86,58,36,0.12)] backdrop-blur-xl sm:px-10 sm:py-12"
          >
            <Logo className="h-14 sm:h-16" />
            <div className="mt-10 w-full max-w-md">
              <div className="flex items-end justify-between gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#8a7361]">
                <span>Loading</span>
                <span>{clampedProgress}%</span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full border border-[#eadfce] bg-[#f7efe6] shadow-inner">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#8b5e3c,#b78967,#d5b08b)]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${clampedProgress}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>

              <motion.p
                key={message}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-4 text-sm leading-6 text-[#6f5a4b]"
              >
                {message}
              </motion.p>
            </div>

            <p className="mt-8 max-w-sm text-[11px] leading-5 text-[#9c8b7d]">
              We&apos;re warming up the catalog and preparing your furniture experience.
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
