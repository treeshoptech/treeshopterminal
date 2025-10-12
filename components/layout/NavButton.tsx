'use client';

import { Menu } from 'lucide-react';

interface NavButtonProps {
  onClick: () => void;
}

export function NavButton({ onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className="nav-menu-button"
      style={{
        position: 'fixed',
        top: '24px',
        right: '24px',
        zIndex: 9999,
        padding: '16px',
        borderRadius: '12px',
        background: '#00FF41',
        border: '2px solid #00D938',
        boxShadow: '0 4px 12px rgba(0, 255, 65, 0.4)',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <Menu style={{ width: '28px', height: '28px', color: '#000' }} />
    </button>
  );
}
