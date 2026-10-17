import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

/**
 * Unlumen UI - Motion Slide Menu
 * High-performance multi-level drilldown sliding navigation menu.
 */
export const MotionSlideMenu = ({
  items = [],
  activeId: controlledActiveId,
  onSelect,
  className = '',
  title = 'Settings'
}) => {
  const [navStack, setNavStack] = useState([{ title, items }]);
  const [direction, setDirection] = useState(1);
  const [internalActiveId, setInternalActiveId] = useState(items[0]?.id || null);

  const activeId = controlledActiveId !== undefined ? controlledActiveId : internalActiveId;
  const currentLevel = navStack[navStack.length - 1];
  const canGoBack = navStack.length > 1;

  const handleItemClick = (item) => {
    setInternalActiveId(item.id);
    if (item.children && item.children.length > 0) {
      setDirection(1);
      setNavStack((prev) => [...prev, { title: item.label, items: item.children }]);
    }
    if (onSelect) {
      onSelect(item);
    }
  };

  const handleBack = () => {
    if (!canGoBack) return;
    setDirection(-1);
    setNavStack((prev) => prev.slice(0, prev.length - 1));
  };

  const renderIcon = (icon) => {
    if (!icon) return null;
    if (React.isValidElement(icon)) {
      return React.cloneElement(icon, {
        className: `size-4 shrink-0 ${icon.props.className || ''}`
      });
    }
    const IconComp = icon;
    return <IconComp className="size-4 shrink-0" />;
  };

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 36 : -36,
      opacity: 0,
      filter: 'blur(2px)'
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (dir) => ({
      x: dir > 0 ? -36 : 36,
      opacity: 0,
      filter: 'blur(2px)',
      transition: {
        duration: 0.15,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <div className={`w-full max-w-[280px] bg-[#0c1019] border border-slate-800/80 rounded-2xl p-2 select-none overflow-hidden shadow-2xl text-slate-100 font-sans ${className}`}>
      {/* Back button header */}
      {canGoBack ? (
        <div className="flex items-center px-1.5 py-1.5 mb-1 border-b border-slate-800/60">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors py-1 px-1.5 -ml-1 rounded-lg hover:bg-slate-800/60 group"
          >
            <ChevronLeft className="size-4 text-slate-400 group-hover:text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
            <span className="truncate">{currentLevel.title}</span>
          </button>
        </div>
      ) : (
        <div className="px-3 py-2 mb-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono flex items-center justify-between border-b border-slate-800/60">
          <span>{title}</span>
          <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
        </div>
      )}

      {/* Sliding list */}
      <div className="relative overflow-hidden p-0.5 min-h-[120px]">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentLevel.title + navStack.length}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="space-y-1 w-full"
          >
            {currentLevel.items.map((item) => {
              const isSelected = activeId === item.id;
              const hasChildren = Boolean(item.children && item.children.length > 0);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                    isSelected
                      ? 'bg-blue-600/15 text-blue-300 border border-blue-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.icon && (
                      <span className={`shrink-0 ${isSelected ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                        {renderIcon(item.icon)}
                      </span>
                    )}
                    <span className="truncate">{item.label}</span>
                  </div>

                  {hasChildren && (
                    <ChevronRight className="size-4 text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
                  )}
                </button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MotionSlideMenu;
