import Link from 'next/link';
import { Calculator, DollarSign, Users, Truck, TrendingUp, FileText, Wrench, ArrowRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  const tools = [
    {
      title: 'Equipment Cost Calculator',
      description: 'Calculate true hourly equipment costs with ownership and operating expenses',
      href: '/tools/equipment-cost',
      icon: Truck,
      color: 'bg-green-600',
    },
    {
      title: 'Employee Cost Calculator',
      description: 'Determine actual labor costs with burden multipliers',
      href: '/tools/employee-cost',
      icon: Users,
      color: 'bg-blue-600',
    },
    {
      title: 'Loadout Cost Calculator',
      description: 'Combine equipment and labor for total loadout operating cost',
      href: '/tools/loadout-cost',
      icon: Calculator,
      color: 'bg-yellow-600',
    },
    {
      title: 'Profit Margin Converter',
      description: 'Convert target profit margins to hourly billing rates',
      href: '/tools/profit-margin',
      icon: DollarSign,
      color: 'bg-purple-600',
    },
    {
      title: 'Project Pricing Calculator',
      description: 'Calculate complete project pricing with inch-acres and production rates',
      href: '/tools/project-pricing',
      icon: FileText,
      color: 'bg-indigo-600',
    },
    {
      title: 'Complete Pricing System',
      description: 'All 6 steps in one interface - from equipment to final project price',
      href: '/pricing',
      icon: TrendingUp,
      color: 'bg-green-800',
    },
  ];

  const quickActions = [
    { name: 'Equipment Library', href: '/equipment', icon: Truck, description: 'Manage your equipment inventory' },
    { name: 'Loadouts', href: '/loadouts', icon: Wrench, description: 'Configure crew loadouts' },
    { name: 'Projects', href: '/projects', icon: FileText, description: 'Create and price projects' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-8">
        {/* Hero Section */}
        <div className="mb-12">
          <div className="inline-block px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full mb-3">
            PRODUCTION READY
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            TreeShop Pricing System
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Formula-driven cost calculations for tree service operations
          </p>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="group bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-green-500 dark:hover:border-green-500 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-500 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{action.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pricing Tools */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Pricing Calculators
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:border-gray-300 dark:hover:border-gray-700 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`${tool.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-300 dark:text-gray-700 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{tool.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{tool.description}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
