import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'success', title?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastItem = { id, message, type, title };
    setToasts((prev) => [...prev.slice(-3), newToast]); // keep max 4 on screen

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = {
    toast: addToast,
    success: (msg: string, title?: string) => addToast(msg, 'success', title),
    error: (msg: string, title?: string) => addToast(msg, 'error', title),
    info: (msg: string, title?: string) => addToast(msg, 'info', title),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        id="luxury-toast-container"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`pointer-events-auto flex items-start gap-3.5 p-4 rounded-xl shadow-2xl backdrop-blur-md border ${
                t.type === 'success'
                  ? 'bg-[#1E1B18]/95 text-[#FAF8F5] border-[#6D212F]/40'
                  : t.type === 'error'
                  ? 'bg-[#3A181C]/95 text-[#FAF8F5] border-[#9E3342]/50'
                  : 'bg-[#1E1B18]/95 text-[#FAF8F5] border-white/10'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#C8A97E]" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#E68A8A]" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-[#C8A97E]" />}
              </div>
              <div className="flex-1 text-sm">
                {t.title && <p className="font-semibold text-white tracking-wide">{t.title}</p>}
                <p className="text-[#E7DFD5] leading-relaxed font-light">{t.message}</p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-white/50 hover:text-white transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
