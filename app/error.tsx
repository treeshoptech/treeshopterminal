'use client';

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1rem' }}>Error</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Something went wrong</p>
      <button
        onClick={reset}
        style={{
          padding: '12px 24px',
          background: 'var(--brand-primary)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Try again
      </button>
    </div>
  );
}
