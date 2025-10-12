'use client';

import { Menu } from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
}

export function NavButton({ onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-[100] p-4 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        background: '#00FF41',
        border: '2px solid #00D938',
        boxShadow: '0 4px 12px rgba(0, 255, 65, 0.4)',
      }}
    >
      <Menu className="w-7 h-7" style={{ color: '#000' }} />
    </button>
  );
}
