import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footer, 
  maxWidth = 'max-w-xl',
  preventBackdropClick = false,
  bodyClassName = "",
  isCompact = false
}) => {
  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  // Handle Escape Key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-10 pointer-events-none"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-0 bg-slate-900/50 backdrop-blur-sm pointer-events-auto"
            onClick={preventBackdropClick ? undefined : onClose}
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={cn(
              'relative z-10 w-full pointer-events-auto',
              isCompact ? 'h-auto' : 'max-h-[85dvh] flex flex-col',
              'bg-white rounded-[24px] sm:rounded-[32px] border border-slate-200 shadow-2xl',
              maxWidth
            )}
            onClick={(e) => e.stopPropagation()}
          >
              {/* Header */}
              <div className="px-5 py-3 sm:px-8 sm:py-5 border-b border-slate-100 flex items-center justify-between gap-4 bg-white rounded-t-[24px] sm:rounded-t-[32px] flex-shrink-0">
                <div className="min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-display font-black !text-black truncate tracking-tight uppercase tracking-wider">{title}</h3>
                </div>
                <button 
                  onClick={onClose}
                  className="p-1.5 sm:p-2 -mr-1 sm:-mr-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-90 flex-shrink-0"
                  aria-label="Close Modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* Body */}
              <div className={cn(
                !isCompact && "flex-1 min-h-0 overflow-y-auto overflow-x-hidden custom-scrollbar overscroll-contain",
                "p-4 sm:p-8",
                bodyClassName
              )}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-5 py-3 sm:px-8 sm:py-6 border-t border-slate-100 bg-slate-50/50 rounded-b-[24px] sm:rounded-b-[32px] flex-shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default Modal;
