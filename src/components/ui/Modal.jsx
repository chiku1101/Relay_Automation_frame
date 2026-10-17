import React, { useEffect } from 'react';
import { X } from 'lucide-react';

/**
 * Origin UI inspired Modal / Dialog
 * 100% Tailwind CSS with icon badge header, backdrop blur, ESC key dismiss, and tactile footer
 */
export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  iconColor = '#38bdf8',
  children,
  footer,
  maxWidth = 'max-w-lg'
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className={`w-full ${maxWidth.startsWith('max-w-') ? maxWidth : 'max-w-lg'} bg-[#0c1220] border border-slate-800 rounded-2xl flex flex-col shadow-2xl max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-start justify-between gap-3 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="flex items-center gap-3">
            {Icon && (
              <div 
                className="size-9 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center shrink-0"
                style={{ color: iconColor }}
              >
                <Icon className="size-4.5" />
              </div>
            )}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
                {title}
              </h3>
              {description && (
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            title="Close dialog (Esc)"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto text-xs sm:text-sm text-slate-300 leading-relaxed flex-1">
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div className="px-5 py-3.5 border-t border-slate-800 flex items-center justify-end gap-2.5 bg-[#090e18]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
