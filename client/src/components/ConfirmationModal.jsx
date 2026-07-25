import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmButtonText = 'Delete', isLoading = false }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={isLoading ? undefined : onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-[#fffaf4] shadow-[0_30px_80px_rgba(63,39,17,0.22)]">
              <div className="bg-gradient-to-b from-[#fffdf9] to-[#f6ede2] px-6 py-5 sm:px-7">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-semibold text-text sm:text-2xl">{title}</h3>
                    <p className="mt-1 text-sm text-text/60">This action is permanent.</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6 pt-5 sm:px-7">
                <p className="text-sm leading-7 text-text/75 sm:text-[15px]">{message}</p>
                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="ghost"
                    className="w-full sm:w-auto"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full sm:w-auto"
                    onClick={onConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Deleting...' : confirmButtonText}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
