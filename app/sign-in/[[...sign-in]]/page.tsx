import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--bg-canvas)' }}
    >
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-8">
          <h1
            className="text-5xl font-black mb-3"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            TreeShop Terminal
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            Sign in to manage your tree service operations
          </p>
        </div>

        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: 'shadow-2xl',
            },
            variables: {
              colorPrimary: '#22C55E',
              colorBackground: '#0a0a0a',
              colorInputBackground: '#0f0f0f',
              colorInputText: '#ffffff',
              colorText: '#ffffff',
            },
          }}
        />
      </div>
    </div>
  );
}
