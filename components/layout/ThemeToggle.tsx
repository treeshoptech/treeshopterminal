'use client';

import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 left-6 z-[100] p-3 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95"
      style={{
        background: theme === 'dark' ? '#1A1A1A' : '#FFFFFF',
        border: theme === 'dark' ? '1px solid rgba(255,255,255,0.2)' : '1px solid #E5E7EB',
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6" style={{ color: '#FFE500' }} />
      ) : (
        <Moon className="w-6 h-6" style={{ color: '#6B7280' }} />
      )}
    </button>
  );
}
