import Link from 'next/link';
import { Truck, Wrench, FileText, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const steps = [
    {
      step: 'Step 1',
      title: 'Equipment Library',
      description: 'Add your equipment and auto-calculate hourly costs',
      href: '/equipment',
      icon: Truck,
      color: 'bg-green-600',
    },
    {
      step: 'Step 2',
      title: 'Loadouts',
      description: 'Build crew loadouts from your saved equipment',
      href: '/loadouts',
      icon: Wrench,
      color: 'bg-blue-600',
    },
    {
      step: 'Step 3',
      title: 'Price Projects',
      description: 'Calculate project pricing using your saved loadouts',
      href: '/pricing',
      icon: FileText,
      color: 'bg-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-8">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-green-600 text-white text-sm font-semibold rounded-full mb-4">
            PRODUCTION READY
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">TreeShop Pricing System</h1>
          <p className="text-xl text-gray-400">
            Formula-driven cost calculations for tree service operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group bg-gray-800 border border-gray-700 rounded-xl p-8 hover:border-green-500 transition-all hover:shadow-2xl"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${item.color} w-14 h-14 rounded-xl flex items-center justify-center`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-500">{item.step}</span>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{item.title}</h2>
                <p className="text-gray-400 mb-4">{item.description}</p>
                <div className="flex items-center gap-2 text-green-500 font-medium">
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-800 border border-gray-700 rounded-xl p-8">
            <p className="text-gray-400">
              Complete 3-Step System | Equipment → Loadouts → Projects
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
