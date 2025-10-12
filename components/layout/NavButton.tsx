'use client';

import { Menu } from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
}

export function NavButton({ onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-30 p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        background: 'rgba(0, 255, 65, 0.1)',
        border: '1px solid rgba(0, 255, 65, 0.3)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      }}
    >
      <Menu className="w-6 h-6" style={{ color: '#00FF41' }} />
    </button>
  );
}
