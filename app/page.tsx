import Link from 'next/link';
import { Calculator, DollarSign, Users, Truck, TrendingUp, FileText } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full mb-4">
            PRODUCTION READY
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">TreeShop Pricing Calculators</h1>
          <p className="text-xl text-gray-400">
            Scientific formula-driven cost calculations for tree service operations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-gray-800 border border-gray-700 rounded-xl p-6 hover:bg-gray-750 hover:border-gray-600 transition-all hover:shadow-2xl"
              >
                <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{tool.title}</h3>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block bg-gray-800 border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-2">TreeShop Pricing System</h2>
            <p className="text-gray-400">
              Complete 6-Step Formula System | From Equipment Costs to Final Project Price
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
