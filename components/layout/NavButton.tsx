'use client';

import { Menu } from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
}

export function NavButton({ onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 right-6 z-30 p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg"
      style={{
        background: 'white',
        border: '1px solid #E5E7EB',
      }}
    >
      <Menu className="w-6 h-6" style={{ color: '#111827' }} />
    </button>
  );
}
