import React from 'react';
import { Sidebar } from './Sidebar';
import { X } from 'lucide-react';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({
  isOpen,
  onClose,
  currentPath,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-drawer-backdrop">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-black shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white z-20"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
        <Sidebar
          currentPath={currentPath}
          onNavigate={onNavigate}
          onCloseMobile={onClose}
        />
      </div>
    </div>
  );
};
