import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#000000' }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
               filter: 'blur(80px)',
               animationDuration: '4s'
             }} />
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full animate-pulse"
             style={{
               background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.15) 40%, transparent 70%)',
               filter: 'blur(80px)',
               animationDuration: '6s',
               animationDelay: '2s'
             }} />
      </div>

      <div className="relative w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 flex justify-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
                 style={{
                   background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                   boxShadow: '0 20px 60px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                 }}>
              <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          </div>
          <h1
            className="text-5xl font-black mb-3"
            style={{
              background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.02em',
              textShadow: '0 0 40px rgba(34, 197, 94, 0.3)'
            }}
          >
            TreeShop Terminal
          </h1>
          <p className="text-lg text-gray-400">
            Professional pricing for tree service operations
          </p>
        </div>

        {/* Sign In Component */}
        <SignIn
          appearance={{
            elements: {
              rootBox: 'mx-auto',
              card: {
                background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                backdropFilter: 'blur(40px)',
                border: '2px solid rgba(34, 197, 94, 0.2)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(34, 197, 94, 0.15)',
                borderRadius: '24px',
                padding: '48px 40px'
              },
              headerTitle: {
                color: '#ffffff',
                fontSize: '28px',
                fontWeight: '800',
                letterSpacing: '-0.02em'
              },
              headerSubtitle: {
                color: '#9ca3af',
                fontSize: '15px'
              },
              socialButtonsBlockButton: {
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                padding: '14px',
                borderRadius: '12px',
                transition: 'all 0.3s',
                '&:hover': {
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)',
                  border: '2px solid rgba(34, 197, 94, 0.3)',
                  transform: 'translateY(-2px)'
                }
              },
              formFieldLabel: {
                color: '#e5e7eb',
                fontSize: '14px',
                fontWeight: '600',
                marginBottom: '8px'
              },
              formFieldInput: {
                background: 'rgba(0, 0, 0, 0.4)',
                border: '2px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '15px',
                padding: '14px 16px',
                borderRadius: '12px',
                transition: 'all 0.3s',
                '&:focus': {
                  border: '2px solid #22C55E',
                  boxShadow: '0 0 0 4px rgba(34, 197, 94, 0.1)',
                  background: 'rgba(0, 0, 0, 0.6)'
                }
              },
              formButtonPrimary: {
                background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '700',
                padding: '16px',
                borderRadius: '12px',
                border: 'none',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 32px rgba(34, 197, 94, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.2)'
                }
              },
              footerActionLink: {
                color: '#22C55E',
                fontWeight: '600',
                '&:hover': {
                  color: '#4ADE80'
                }
              },
              dividerLine: {
                background: 'rgba(255, 255, 255, 0.1)'
              },
              dividerText: {
                color: '#9ca3af',
                fontSize: '13px',
                fontWeight: '500'
              },
              identityPreviewText: {
                color: '#ffffff'
              },
              formFieldErrorText: {
                color: '#ef4444',
                fontSize: '13px'
              }
            },
            variables: {
              colorPrimary: '#22C55E',
              colorBackground: 'transparent',
              colorInputBackground: 'rgba(0, 0, 0, 0.4)',
              colorInputText: '#ffffff',
              colorText: '#ffffff',
              colorTextSecondary: '#9ca3af',
              borderRadius: '12px',
              fontFamily: 'system-ui, -apple-system, sans-serif'
            },
          }}
          redirectUrl="/"
          signUpUrl="/sign-up"
        />

        {/* Footer */}
        <p className="text-center mt-8 text-sm text-gray-500">
          Protected by enterprise-grade security
        </p>
      </div>
    </div>
  );
}
