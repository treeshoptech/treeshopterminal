'use client';

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
  DollarSign,
  Sparkles,
  Activity,
  Target,
  ChevronRight
} from 'lucide-react';
import '@/styles/design-system.css';

export default function HomePage() {
  const steps = [
    {
      step: '01',
      title: 'Equipment',
      description: 'Track fleet costs with precision',
      href: '/equipment',
      icon: Truck,
      color: 'var(--brand-500)',
      gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      metrics: 'Hourly cost tracking',
      bgGradient: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.1), transparent 70%)'
    },
    {
      step: '02',
      title: 'Employees',
      description: 'Calculate true labor burden',
      href: '/employees',
      icon: Users,
      color: 'var(--brand-500)',
      gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      metrics: 'Burden multipliers',
      bgGradient: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.1), transparent 70%)'
    },
    {
      step: '03',
      title: 'Loadouts',
      description: 'Build profitable crew configs',
      href: '/loadouts',
      icon: Wrench,
      color: 'var(--brand-500)',
      gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      metrics: 'Equipment + labor',
      bgGradient: 'radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.1), transparent 70%)'
    },
    {
      step: '04',
      title: 'Projects',
      description: 'Price with confidence',
      href: '/projects',
      icon: FileText,
      color: 'var(--brand-500)',
      gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
      metrics: 'Margin calculator',
      bgGradient: 'radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.1), transparent 70%)'
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
      {/* Ultra-Premium Hero Section with BOLD Gradients */}
      <div className="relative overflow-hidden">
        {/* BOLD Background Pattern - Much More Visible */}
        <div className="absolute inset-0">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 20% 50%, rgba(34, 197, 94, 0.25) 0%, transparent 50%),
                   radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 50%),
                   radial-gradient(circle at 40% 20%, rgba(34, 197, 94, 0.15) 0%, transparent 50%)
                 `
               }} />

          {/* BOLD Animated Gradient Orbs - Much More Prominent */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.4) 0%, rgba(34, 197, 94, 0.2) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 transform: 'translate3d(0, 0, 0)'
               }} />
          <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(34, 197, 94, 0.35) 0%, rgba(34, 197, 94, 0.15) 40%, transparent 70%)',
                 filter: 'blur(80px)',
                 animationDelay: '1s',
                 transform: 'translate3d(0, 0, 0)'
               }} />
          <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] rounded-full animate-pulse"
               style={{
                 background: 'radial-gradient(circle, rgba(5, 150, 105, 0.25) 0%, rgba(5, 150, 105, 0.1) 40%, transparent 70%)',
                 filter: 'blur(100px)',
                 animationDelay: '2s',
                 transform: 'translate3d(-50%, -50%, 0)'
               }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32">
          {/* ULTRA-Premium Status Badge with VISIBLE Glass */}
          <div className="flex justify-center mb-10 animate-fadeInUp"
               style={{ animationDelay: '100ms' }}>
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full glass"
                 style={{
                   background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(34, 197, 94, 0.15) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.4)',
                   backdropFilter: 'blur(30px)',
                   WebkitBackdropFilter: 'blur(30px)',
                   boxShadow: '0 8px 32px rgba(34, 197, 94, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.15)'
                 }}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: 'var(--brand-400)' }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3"
                      style={{ background: 'var(--brand-400)', boxShadow: '0 0 10px rgba(34, 197, 94, 0.8)' }}></span>
              </span>
              <span className="text-sm font-bold uppercase tracking-wider"
                    style={{
                      color: 'var(--brand-400)',
                      letterSpacing: '0.1em',
                      textShadow: '0 0 20px rgba(34, 197, 94, 0.5)'
                    }}>
                Enterprise Ready
              </span>
              <Sparkles className="w-4 h-4" style={{ color: 'var(--brand-400)', filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }} />
            </div>
          </div>

          {/* IMPACTFUL Heading with BOLD Gradients */}
          <div className="text-center mb-8 space-y-6">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight animate-fadeInUp"
                style={{
                  animationDelay: '200ms',
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em',
                  lineHeight: '0.95',
                  textShadow: '0 0 80px rgba(255, 255, 255, 0.1)'
                }}>
              TreeShop
              <span className="block text-5xl sm:text-6xl lg:text-7xl mt-4"
                    style={{
                      background: 'linear-gradient(135deg, #22C55E 0%, #4ADE80 30%, #22C55E 60%, #16A34A 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      filter: 'drop-shadow(0 0 40px rgba(34, 197, 94, 0.5))'
                    }}>
                Pricing System
              </span>
            </h1>
            <p className="text-xl sm:text-2xl lg:text-3xl max-w-4xl mx-auto animate-fadeInUp"
               style={{
                 color: 'var(--text-secondary)',
                 animationDelay: '300ms',
                 lineHeight: '1.4'
               }}>
              Professional cost calculations for tree service operations.
              <span className="block mt-2 text-lg sm:text-xl" style={{ color: 'var(--text-tertiary)' }}>
                From equipment to projects in four simple steps.
              </span>
            </p>
          </div>

          {/* BOLD CTA Buttons with Enhanced Glass */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mt-12 animate-fadeInUp"
               style={{ animationDelay: '400ms' }}>
            <Link href="/equipment"
                  className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 hardware-accelerated"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #047857 100%)',
                    color: 'white',
                    boxShadow: `
                      0 8px 24px 0 rgba(34, 197, 94, 0.5),
                      0 0 40px rgba(34, 197, 94, 0.3),
                      inset 0 2px 4px rgba(255, 255, 255, 0.2),
                      inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                    `,
                    transform: 'translateZ(0)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
              <span>Get Started</span>
              <ArrowRight className="ml-2 w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <button className="group inline-flex items-center justify-center px-10 py-5 text-lg font-bold rounded-2xl transition-all duration-300 glass hardware-accelerated"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)',
                      color: 'var(--text-primary)',
                      border: '2px solid rgba(255,255,255,0.15)',
                      backdropFilter: 'blur(30px)',
                      WebkitBackdropFilter: 'blur(30px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                    }}>
              <Activity className="mr-2 w-5 h-5" />
              View Demo
            </button>
          </div>

          {/* BOLD Feature Pills with Enhanced Glass */}
          <div className="flex flex-wrap gap-4 justify-center mt-16 animate-fadeInUp"
               style={{ animationDelay: '500ms' }}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index}
                     className="group inline-flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 glass hover:scale-105"
                     style={{
                       background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 100%)',
                       border: '2px solid rgba(255,255,255,0.12)',
                       backdropFilter: 'blur(30px)',
                       WebkitBackdropFilter: 'blur(30px)',
                       cursor: 'default',
                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.1)'
                     }}>
                  <div className="p-2.5 rounded-xl"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)',
                         boxShadow: '0 4px 16px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2)'
                       }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--brand-400)', filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.8))' }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                      {feature.title}
                    </div>
                    <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Process Steps Section */}
      <div className="relative">
        {/* Section Background */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(180deg, transparent 0%, rgba(34, 197, 94, 0.02) 50%, transparent 100%)'
             }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          {/* Section Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4"
                 style={{
                   background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
                   border: '1px solid rgba(34, 197, 94, 0.2)'
                 }}>
              <Target className="w-3.5 h-3.5" style={{ color: 'var(--brand-400)' }} />
              <span className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: 'var(--brand-400)' }}>
                Workflow
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(180deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}>
              Your Complete Pricing Workflow
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-tertiary)' }}>
              Build accurate quotes in minutes with our streamlined four-step process
            </p>
          </div>

          {/* Premium Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((item, index) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animation: 'fadeInUp 0.5s ease-out forwards',
                    opacity: 0
                  }}
                >
                  <div className="relative h-full p-7 rounded-3xl transition-all duration-500 hardware-accelerated"
                       style={{
                         background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.8) 0%, rgba(10, 10, 10, 0.9) 100%)',
                         border: '2px solid rgba(255, 255, 255, 0.1)',
                         backdropFilter: 'blur(60px)',
                         WebkitBackdropFilter: 'blur(60px)',
                         boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.08)',
                         transform: 'translateZ(0)'
                       }}>
                    {/* BOLD Background Gradient for Each Card */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                         style={{
                           background: item.bgGradient,
                           boxShadow: `inset 0 0 80px ${item.color}40`
                         }} />

                    {/* BOLD Step Number Badge */}
                    <div className="absolute -top-3 -right-3 w-14 h-14 rounded-2xl flex items-center justify-center"
                         style={{
                           background: 'linear-gradient(135deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.6) 100%)',
                           backdropFilter: 'blur(20px)',
                           WebkitBackdropFilter: 'blur(20px)',
                           border: '2px solid rgba(255,255,255,0.15)',
                           boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                         }}>
                      <span className="text-sm font-black" style={{
                        color: item.color,
                        textShadow: `0 0 20px ${item.color}80`
                      }}>
                        {item.step}
                      </span>
                    </div>

                    {/* BOLD Icon Container with Glow */}
                    <div className="mb-6">
                      <div className="w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                           style={{
                             background: item.gradient,
                             boxShadow: `
                               0 12px 32px ${item.color}60,
                               0 0 40px ${item.color}40,
                               inset 0 2px 4px rgba(255, 255, 255, 0.3),
                               inset 0 -2px 4px rgba(0, 0, 0, 0.2)
                             `,
                             transform: 'translateZ(0)',
                             border: '2px solid rgba(255, 255, 255, 0.15)'
                           }}>
                        <Icon className="w-10 h-10 text-white" style={{
                          filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))'
                        }} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-3 relative">
                      <h3 className="text-2xl font-bold"
                          style={{
                            color: 'var(--text-primary)',
                            letterSpacing: '-0.01em'
                          }}>
                        {item.title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {item.description}
                      </p>

                      {/* Metric Badge */}
                      <div className="pt-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                              style={{
                                background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                                color: item.color,
                                border: `1px solid ${item.color}30`
                              }}>
                          <Activity className="w-3 h-3" />
                          {item.metrics}
                        </span>
                      </div>

                      {/* Premium Hover Indicator */}
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t transition-all duration-300 group-hover:gap-3"
                           style={{ borderColor: 'var(--border-default)' }}>
                        <span className="text-sm font-semibold" style={{ color: item.color }}>
                          Get Started
                        </span>
                        <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                      style={{ color: item.color }} />
                      </div>
                    </div>

                    {/* Premium Glow Effect on Hover */}
                    <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                         style={{
                           boxShadow: `0 0 40px ${item.color}25`
                         }} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Premium Stats Section */}
      <div className="relative" style={{ borderTop: '1px solid var(--border-default)', borderBottom: '1px solid var(--border-default)' }}>
        {/* Gradient Background */}
        <div className="absolute inset-0"
             style={{
               background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.03) 0%, transparent 50%, rgba(59, 130, 246, 0.03) 100%)'
             }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="inline-block p-6 rounded-3xl transition-all duration-300 group-hover:scale-105"
                   style={{
                     background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, transparent 100%)',
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)'
                   }}>
                <div className="text-5xl font-black mb-3 flex items-center justify-center"
                     style={{
                       background: 'var(--gradient-brand)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text',
                       letterSpacing: '-0.02em'
                     }}>
                  <DollarSign className="inline w-10 h-10" />
                  492.86
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Average hourly rate
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-block p-6 rounded-3xl transition-all duration-300 group-hover:scale-105"
                   style={{
                     background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, transparent 100%)',
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)'
                   }}>
                <div className="text-5xl font-black mb-3"
                     style={{
                       background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text',
                       letterSpacing: '-0.02em'
                     }}>
                  1.7x
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Labor burden multiplier
                </div>
              </div>
            </div>

            <div className="text-center group">
              <div className="inline-block p-6 rounded-3xl transition-all duration-300 group-hover:scale-105"
                   style={{
                     background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, transparent 100%)',
                     backdropFilter: 'blur(10px)',
                     WebkitBackdropFilter: 'blur(10px)'
                   }}>
                <div className="text-5xl font-black mb-3"
                     style={{
                       background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
                       WebkitBackgroundClip: 'text',
                       WebkitTextFillColor: 'transparent',
                       backgroundClip: 'text',
                       letterSpacing: '-0.02em'
                     }}>
                  50%
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
                  Target profit margin
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bottom CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl glass animate-glow"
             style={{
               background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, transparent 100%)',
               border: '1px solid var(--border-default)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)'
             }}>
          <TrendingUp className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
            Complete 4-Step System
            <span className="mx-2" style={{ color: 'var(--text-quaternary)' }}>•</span>
            Equipment → Employees → Loadouts → Projects
          </p>
        </div>
      </div>

      {/* Add fadeInUp animation to the page styles */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}