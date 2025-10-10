import Link from 'next/link';
import {
  Truck,
  Wrench,
  FileText,
  ArrowRight,
  Users,
  TrendingUp,
  Calculator,
  Zap,
  Shield,
  DollarSign
} from 'lucide-react';
import '@/styles/design-system.css';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const steps = [
    {
      step: '01',
      title: 'Equipment',
      description: 'Track fleet costs with precision',
      href: '/equipment',
      icon: Truck,
      color: 'var(--brand-500)',
      gradient: 'linear-gradient(135deg, #10B981, #059669)',
      metrics: 'Hourly cost tracking'
    },
    {
      step: '02',
      title: 'Employees',
      description: 'Calculate true labor burden',
      href: '/employees',
      icon: Users,
      color: '#3B82F6',
      gradient: 'linear-gradient(135deg, #3B82F6, #2563EB)',
      metrics: 'Burden multipliers'
    },
    {
      step: '03',
      title: 'Loadouts',
      description: 'Build profitable crew configs',
      href: '/loadouts',
      icon: Wrench,
      color: '#F59E0B',
      gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
      metrics: 'Equipment + labor'
    },
    {
      step: '04',
      title: 'Projects',
      description: 'Price with confidence',
      href: '/projects',
      icon: FileText,
      color: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
      metrics: 'Margin calculator'
    },
  ];

  const features = [
    {
      icon: Calculator,
      title: 'Formula-Driven',
      description: 'Precise calculations based on industry best practices'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Instant cost calculations and project estimates'
    },
    {
      icon: Shield,
      title: 'Bulletproof Pricing',
      description: 'Never underbid or leave money on the table'
    }
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-blue-900/20" />

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                 style={{
                   background: 'rgba(16, 185, 129, 0.1)',
                   border: '1px solid rgba(16, 185, 129, 0.2)'
                 }}>
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--brand-400)' }}>
                Production Ready
              </span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center mb-6">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
                style={{
                  background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--brand-400) 50%, var(--text-primary) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
              TreeShop Pricing System
            </h1>
            <p className="text-xl sm:text-2xl max-w-3xl mx-auto"
               style={{ color: 'var(--text-secondary)' }}>
              Professional cost calculations for tree service operations.
              From equipment to projects in four simple steps.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/equipment"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200"
                  style={{
                    background: 'linear-gradient(135deg, var(--brand-500), var(--brand-600))',
                    color: 'white',
                    boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.3)'
                  }}>
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--bg-elevated)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border-default)'
                    }}>
              View Demo
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center mt-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index}
                     className="inline-flex items-center gap-2 px-4 py-2 rounded-lg"
                     style={{
                       background: 'var(--bg-surface)',
                       border: '1px solid var(--border-default)'
                     }}>
                  <Icon className="w-4 h-4" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {feature.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Process Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Your Complete Pricing Workflow
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
            Build accurate quotes in minutes, not hours
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group relative"
              >
                <div className="card h-full transition-all duration-300 group-hover:scale-105"
                     style={{
                       background: 'var(--bg-surface)',
                       borderColor: 'var(--border-default)'
                     }}>
                  {/* Step Number */}
                  <div className="absolute top-4 right-4">
                    <span className="text-4xl font-bold opacity-10">{item.step}</span>
                  </div>

                  {/* Icon Container */}
                  <div className="mb-4">
                    <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300"
                         style={{
                           background: item.gradient,
                           boxShadow: `0 8px 16px ${item.color}33`
                         }}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                    <div className="pt-2">
                      <span className="text-xs font-medium uppercase tracking-wider"
                            style={{ color: item.color }}>
                        {item.metrics}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Indicator */}
                  <div className="flex items-center gap-2 mt-4 text-sm font-medium transition-all duration-300 group-hover:gap-3"
                       style={{ color: item.color }}>
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Connection Line (except last item) */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-6 w-12"
                         style={{ transform: 'translateY(-50%)' }}>
                      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gray-700 to-transparent" />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Stats Section */}
      <div className="border-y" style={{ borderColor: 'var(--border-default)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"
                   style={{
                     background: 'linear-gradient(135deg, var(--brand-400), var(--brand-600))',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>
                <DollarSign className="inline w-8 h-8" />
                492.86
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Average hourly rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"
                   style={{
                     background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>
                1.7x
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Labor burden multiplier
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2"
                   style={{
                     background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                     WebkitBackgroundClip: 'text',
                     WebkitTextFillColor: 'transparent',
                     backgroundClip: 'text'
                   }}>
                50%
              </div>
              <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                Target profit margin
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl"
             style={{
               background: 'var(--bg-elevated)',
               border: '1px solid var(--border-default)'
             }}>
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            Complete 4-Step System  •  Equipment → Employees → Loadouts → Projects
          </p>
        </div>
      </div>
    </div>
  );
}