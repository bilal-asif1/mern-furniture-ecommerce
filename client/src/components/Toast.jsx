import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ message, type = 'success', onClose }) {
  const isError = type === 'error';
  const palette = isError
    ? 'border-red-200/80 bg-[#fff8f7]/95 text-red-900'
    : 'border-black/5 bg-white/95 text-text';
  const iconStroke = isError ? '#b42318' : '#8b5e3c';

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -12, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          className={`fixed right-4 top-4 z-[120] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-xl border shadow-[0_18px_40px_rgba(63,39,17,0.16)] backdrop-blur-md sm:right-6 sm:top-6 sm:w-[24rem] ${palette}`}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3 px-4 py-3 sm:px-4.5 sm:py-3.5">
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isError ? 'bg-red-100 text-red-700' : 'bg-[#f7efe3] text-primary'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={iconStroke} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                {isError ? (
                  <>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </>
                ) : (
                  <>
                    <path d="M20 6 9 17l-5-5" />
                  </>
                )}
              </svg>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold leading-5 sm:text-[15px]">{message}</p>
              <p className="mt-0.5 text-[11px] font-medium uppercase tracking-[0.2em] text-text/45">
                {isError ? 'Action failed' : 'Completed'}
              </p>
            </div>
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-1 text-text/35 transition hover:bg-black/5 hover:text-text/60"
                aria-label="Dismiss notification"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
