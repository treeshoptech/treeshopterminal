'use client';

import { useState } from 'react';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import {
  Plus,
  FileText,
  ChevronLeft,
  DollarSign,
  TrendingUp,
  Activity,
  Sparkles,
  BarChart3,
  Calculator,
  Target,
  Zap,
  Settings,
  Package,
  Minus,
  Download,
  Printer,
  Mail,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import '@/styles/design-system.css';


export default function ProjectsPage() {
  const orgId = "org_demo";

  const loadouts = useQuery(api.loadouts.list, { organizationId: orgId }) || [];
  const projects = useQuery(api.projects.list, { organizationId: orgId }) || [];
  const customers = useQuery(api.customers.list, { organizationId: orgId }) || [];

  const createProject = useMutation(api.projects.create);
  const updateProject = useMutation(api.projects.update);
  const removeProject = useMutation(api.projects.remove);

  const createCustomer = useMutation(api.customers.create);

  const [selectedLoadout, setSelectedLoadout] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState<Id<"customers"> | ''>('');
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    company: '',
  });
  const [projectData, setProjectData] = useState({
    acres: 0,
    dbhPackage: 8,
    profitMargin: 40,
  });
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState<Id<"projects"> | null>(null);

  // Analytics calculations
  const wonProjects = projects.filter(p => p.status === 'won');
  const lostProjects = projects.filter(p => p.status === 'lost');
  const quotedProjects = projects.filter(p => p.status === 'quoted' || !p.status);
  const totalRevenue = wonProjects.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const winRate = projects.length > 0 ? (wonProjects.length / projects.length * 100) : 0;
  const avgProjectSize = projects.length > 0 ? projects.reduce((sum, p) => sum + (p.projectSize || 0), 0) / projects.length : 0;

  const loadout = loadouts.find((l) => l._id === selectedLoadout);
  const loadoutCost = loadout?.totalLoadoutCostPerHour || 0;
  const billingRate = loadoutCost / (1 - projectData.profitMargin / 100);
  const inchAcres = projectData.acres * projectData.dbhPackage;
  const productionRate = loadout?.productionRate || 1.3;
  const hours = inchAcres / productionRate;
  const totalPrice = hours * billingRate;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleCreateCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) {
      alert('Please enter customer name and phone number');
      return;
    }

    try {
      const customerId = await createCustomer({
        organizationId: orgId,
        name: newCustomer.name,
        phone: newCustomer.phone,
        email: newCustomer.email,
        company: newCustomer.company,
        address: newCustomer.address,
        city: newCustomer.city,
        state: newCustomer.state,
        zipCode: newCustomer.zipCode,
        status: 'lead',
      });

      setSelectedCustomerId(customerId);
      setShowCustomerModal(false);
      setNewCustomer({ name: '', phone: '', email: '', address: '', city: '', state: '', zipCode: '', company: '' });
    } catch (error) {
      console.error('Error creating customer:', error);
      alert('Failed to create customer');
    }
  };

  const handleSaveQuote = async () => {
    if (!selectedLoadout || !selectedCustomerId) {
      alert('Please select a customer and loadout');
      return;
    }

    const customer = customers.find(c => c._id === selectedCustomerId);
    if (!customer) {
      alert('Customer not found');
      return;
    }

    setSaving(true);
    try {
      const projectUID = `Q${Date.now().toString().slice(-6)}`;
      const projectName = `${customer.name}-${projectUID}`;

      await createProject({
        organizationId: orgId,
        projectName,
        customerId: selectedCustomerId as Id<"customers">,
        serviceType: 'Forestry Mulching',
        loadoutId: selectedLoadout as Id<"loadouts">,
        loadoutName: loadout?.loadoutName,
        loadoutCostPerHour: loadoutCost,
        profitMargin: projectData.profitMargin,
        billingRatePerHour: billingRate,
        projectSize: projectData.acres,
        sizeUnit: 'acres',
        dbhPackage: projectData.dbhPackage,
        workHours: hours,
        totalHours: hours,
        totalCost: hours * loadoutCost,
        totalPrice: totalPrice,
        totalProfit: totalPrice - (hours * loadoutCost),
        inchAcres: inchAcres,
        productionRate: productionRate,
      });

      // Reset form
      setProjectData({ acres: 0, dbhPackage: 8, profitMargin: 40 });
      alert(`Quote ${projectName} saved successfully!`);
    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote');
    } finally {
      setSaving(false);
    }
  };

  const handleDuplicateLastQuote = () => {
    if (projects.length === 0) return;

    const lastProject = projects[0];
    setProjectData({
      acres: lastProject.projectSize || 0,
      dbhPackage: lastProject.dbhPackage || 8,
      profitMargin: lastProject.profitMargin || 40,
    });
    setSelectedLoadout(lastProject.loadoutId || '');
    setSelectedCustomerId(lastProject.customerId || '');
  };

  const handleLoadSimilar = () => {
    if (!projectData.acres || projects.length === 0) return;

    // Find project with closest acreage
    const similar = projects.reduce((closest, project) => {
      const currentDiff = Math.abs((project.projectSize || 0) - projectData.acres);
      const closestDiff = Math.abs((closest.projectSize || 0) - projectData.acres);
      return currentDiff < closestDiff ? project : closest;
    });

    handleLoadQuote(similar);
  };

  const handleLoadQuote = (project: any) => {
    setLoadingProject(project._id);
    setProjectData({
      acres: project.projectSize || 0,
      dbhPackage: project.dbhPackage || 8,
      profitMargin: project.profitMargin || 40,
    });
    setSelectedLoadout(project.loadoutId || '');
    setSelectedCustomerId(project.customerId || '');
    setLoadingProject(null);
  };

  const handleUpdateStatus = async (projectId: Id<"projects">, status: string) => {
    try {
      await updateProject({ id: projectId, status });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDeleteQuote = async (projectId: Id<"projects">) => {
    if (!confirm('Are you sure you want to delete this quote?')) return;

    try {
      await removeProject({ id: projectId });
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote');
    }
  };

  return (
    
    <>
      <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
        {/* Premium Background Pattern */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0"
               style={{
                 backgroundImage: `
                   radial-gradient(circle at 30% 20%, rgba(34, 197, 94, 0.3) 0%, transparent 50%),
                   radial-gradient(circle at 70% 80%, rgba(34, 197, 94, 0.25) 0%, transparent 50%)
                 `
               }} />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Premium Header Section */}
          <div className="mb-10">
            <div className="flex items-start gap-4 mb-8">
              <Link
                href="/"
                className="group mt-1 p-2.5 rounded-xl transition-all duration-300 hover:scale-110"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                  border: '1px solid var(--border-default)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <ChevronLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1"
                             style={{ color: 'var(--text-secondary)' }} />
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl sm:text-5xl font-black"
                      style={{
                        background: 'linear-gradient(180deg, var(--text-primary) 0%, rgba(255,255,255,0.8) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        letterSpacing: '-0.02em'
                      }}>
                    Price Projects
                  </h1>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                       style={{
                         background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)',
                         border: '2px solid rgba(34, 197, 94, 0.5)',
                         backdropFilter: 'blur(30px)',
                         WebkitBackdropFilter: 'blur(30px)',
                         boxShadow: '0 8px 32px rgba(34, 197, 94, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.15)'
                       }}>
                    <Sparkles className="w-3.5 h-3.5" style={{ color: '#22C55E', filter: '' }} />
                    <span className="text-xs font-semibold uppercase tracking-wider"
                          style={{ color: '#22C55E', letterSpacing: '0.1em', textShadow: 'none' }}>
                      Step 04
                    </span>
                  </div>
                </div>
                <p className="text-lg" style={{ color: 'var(--text-tertiary)' }}>
                  Calculate project pricing with confidence using your configured loadouts
                </p>
              </div>
            </div>
          </div>

          {/* Analytics Dashboard */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-8">
            {/* Win Rate Card */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-6"
                 style={{
                   background: 'rgba(0, 255, 65, 0.05)',
                   border: '1px solid rgba(0, 255, 65, 0.2)',
                 }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#00FF41' }} />
                <span className="text-xs uppercase tracking-wider font-semibold"
                      style={{ color: 'var(--text-tertiary)' }}>
                  Win Rate
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-bold"
                   style={{ color: '#00FF41', letterSpacing: '-0.02em' }}>
                {winRate.toFixed(0)}%
              </div>
              <div className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                {wonProjects.length} won / {projects.length} total
              </div>
            </div>

            {/* Revenue Card */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-6"
                 style={{
                   background: 'rgba(0, 255, 65, 0.05)',
                   border: '1px solid rgba(0, 255, 65, 0.2)',
                 }}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#00FF41' }} />
                <span className="text-xs uppercase tracking-wider font-semibold"
                      style={{ color: 'var(--text-tertiary)' }}>
                  Revenue
                </span>
              </div>
              <div className="text-2xl md:text-4xl font-bold"
                   style={{ color: '#00FF41', letterSpacing: '-0.02em' }}>
                {formatCurrency(totalRevenue).replace('.00', '').replace('$0', '$0')}
              </div>
              <div className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Won projects
              </div>
            </div>

            {/* Pipeline Card */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-6"
                 style={{
                   background: 'rgba(0, 191, 255, 0.05)',
                   border: '1px solid rgba(0, 191, 255, 0.2)',
                 }}>
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="w-4 h-4 md:w-5 md:h-5" style={{ color: '#00BFFF' }} />
                <span className="text-xs uppercase tracking-wider font-semibold"
                      style={{ color: 'var(--text-tertiary)' }}>
                  Pipeline
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-bold"
                   style={{ color: '#00BFFF', letterSpacing: '-0.02em' }}>
                {quotedProjects.length}
              </div>
              <div className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Pending quotes
              </div>
            </div>

            {/* Avg Size Card */}
            <div className="rounded-xl md:rounded-2xl p-4 md:p-6"
                 style={{
                   background: 'rgba(255, 255, 255, 0.03)',
                   border: '1px solid rgba(255, 255, 255, 0.1)',
                 }}>
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 md:w-5 md:h-5" style={{ color: 'var(--text-secondary)' }} />
                <span className="text-xs uppercase tracking-wider font-semibold"
                      style={{ color: 'var(--text-tertiary)' }}>
                  Avg Size
                </span>
              </div>
              <div className="text-3xl md:text-4xl font-bold"
                   style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {avgProjectSize.toFixed(1)}
              </div>
              <div className="text-xs md:text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
                Acres/project
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {projects.length > 0 && (
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2 md:gap-3 mb-8">
              <button
                onClick={handleDuplicateLastQuote}
                className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: 'rgba(0, 255, 65, 0.1)',
                  border: '1px solid rgba(0, 255, 65, 0.3)',
                  color: '#00FF41'
                }}
              >
                <Copy className="w-4 h-4" />
                <span className="hidden md:inline">Duplicate Last</span>
                <span className="md:hidden">Duplicate</span>
              </button>

              {projectData.acres > 0 && (
                <button
                  onClick={handleLoadSimilar}
                  className="inline-flex items-center justify-center gap-2 px-3 md:px-4 py-2.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'rgba(0, 191, 255, 0.1)',
                    border: '1px solid rgba(0, 191, 255, 0.3)',
                    color: '#00BFFF'
                  }}
                >
                  <Target className="w-4 h-4" />
                  <span className="hidden md:inline">Load Similar</span>
                  <span className="md:hidden">Similar</span>
                </button>
              )}
            </div>
          )}

          {/* ULTRA-Premium Stats Cards with BOLD Glassmorphism */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.15), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top left, rgba(34, 197, 94, 0.3), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Package className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Loadouts
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {loadouts.length}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <TrendingUp className="w-4 h-4" style={{ color: '#22C55E' }} />
                  <span style={{ color: '#22C55E' }}>Available configs</span>
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at top right, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Calculator className="w-5 h-5" style={{ color: '#22C55E' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Margin
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {projectData.profitMargin}%
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Target profit
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom left, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <Activity className="w-5 h-5" style={{ color: '#16A34A' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Acres
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {projectData.acres}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Project size
                </div>
              </div>
            </div>

            <div className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:scale-105 hardware-accelerated"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 16px 48px rgba(0, 0, 0, 0.4), 0 0 40px rgba(34, 197, 94, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                   style={{
                     background: 'radial-gradient(circle at bottom right, rgba(34, 197, 94, 0.25), transparent 70%)',
                     boxShadow: 'inset 0 0 60px rgba(34, 197, 94, 0.2)'
                   }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <DollarSign className="w-5 h-5" style={{ color: 'var(--brand-400)' }} />
                  <span className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-quaternary)' }}>
                    Price
                  </span>
                </div>
                <div className="text-4xl font-bold mb-1"
                     style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {selectedLoadout && !isNaN(totalPrice) ? formatCurrency(totalPrice) : '$0'}
                </div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                  Total estimate
                </div>
              </div>
            </div>
          </div>

          {/* Main Calculator */}
          {loadouts.length === 0 ? (
            <div className="empty-state glass rounded-3xl p-12"
                 style={{
                   background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.6) 0%, rgba(10, 10, 10, 0.4) 100%)',
                   border: '1px solid var(--border-default)',
                   backdropFilter: 'blur(20px)',
                   WebkitBackdropFilter: 'blur(20px)'
                 }}>
              <FileText className="empty-icon mx-auto mb-6" style={{ opacity: 0.3 }} />
              <h3 className="empty-title">No loadouts available</h3>
              <p className="empty-description">
                Create a loadout first to start pricing projects
              </p>
              <Link href="/loadouts">
                <button
                  className="btn btn-lg mt-4"
                  style={{
                    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
                    color: 'white',
                    boxShadow: '0 4px 14px 0 rgba(34, 197, 94, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Go to Loadouts
                </button>
              </Link>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(34, 197, 94, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 60px rgba(34, 197, 94, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              {/* Premium Glow Effect */}
              <div className="absolute inset-0"
                   style={{
                     background: 'radial-gradient(circle at top center, rgba(34, 197, 94, 0.15), transparent 60%)',
                     pointerEvents: 'none'
                   }} />

              <div className="relative p-6 md:p-8 space-y-8 md:space-y-10">
                {/* Project Details Section */}
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.3) 0%, rgba(34, 197, 94, 0.2) 100%)',
                           border: '2px solid rgba(34, 197, 94, 0.5)',
                           boxShadow: '0 8px 24px rgba(34, 197, 94, 0.3)'
                         }}>
                      <Settings className="w-5 h-5" style={{ color: '#22C55E' }} />
                    </div>
                    <h3 className="text-lg font-semibold uppercase tracking-wider"
                        style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                      Project Details
                    </h3>
                  </div>
                  <div className="space-y-6">
                    <div className="input-group">
                      <label className="input-label">Customer</label>
                      <div className="flex gap-3">
                        <select
                          className="input-field select-field flex-1"
                          value={selectedCustomerId}
                          onChange={(e) => setSelectedCustomerId(e.target.value as Id<"customers"> | '')}
                        >
                          <option value="">Select customer...</option>
                          {customers.map((c) => (
                            <option key={c._id} value={c._id}>
                              {c.name} {c.company ? `(${c.company})` : ''}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => setShowCustomerModal(true)}
                          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                          style={{
                            background: 'rgba(0, 255, 65, 0.1)',
                            border: '1px solid rgba(0, 255, 65, 0.3)',
                            color: '#00FF41',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          <Plus className="w-5 h-5 inline mr-1" />
                          New
                        </button>
                      </div>
                      {selectedCustomerId && customers.find(c => c._id === selectedCustomerId) && (
                        <div className="mt-2 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                          {(() => {
                            const customer = customers.find(c => c._id === selectedCustomerId);
                            return customer ? (
                              <div className="flex flex-col gap-1">
                                {customer.phone && <span>{customer.phone}</span>}
                                {customer.address && <span>{customer.address}, {customer.city}, {customer.state} {customer.zipCode}</span>}
                              </div>
                            ) : null;
                          })()}
                        </div>
                      )}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Select Loadout</label>
                      <select
                        className="input-field select-field"
                        value={selectedLoadout}
                        onChange={(e) => setSelectedLoadout(e.target.value)}
                      >
                        <option value="">Choose a loadout...</option>
                        {loadouts.map((l) => (
                          <option key={l._id} value={l._id}>
                            {l.loadoutName} - {formatCurrency(l.totalLoadoutCostPerHour)}/hr
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {selectedLoadout && (
                  <>
                    {/* Project Parameters Section */}
                    <div className="space-y-6">
                      {/* LARGE Acreage Input */}
                      <div>
                        <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                               style={{ color: 'var(--text-secondary)' }}>
                          Project Acreage
                        </label>

                        {/* Acre Presets */}
                        <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                          {[2, 5, 10, 15, 20, 30].map((acres) => (
                            <button
                              key={acres}
                              type="button"
                              onClick={() => setProjectData({ ...projectData, acres })}
                              className="px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
                              style={{
                                background: projectData.acres === acres ? 'rgba(0, 255, 65, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                border: projectData.acres === acres ? '2px solid rgba(0, 255, 65, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                                color: projectData.acres === acres ? '#00FF41' : 'var(--text-secondary)'
                              }}
                            >
                              {acres}
                            </button>
                          ))}
                        </div>

                        <input
                          className="w-full text-center px-4 md:px-6 py-6 md:py-8 rounded-2xl font-mono text-4xl md:text-6xl font-black"
                          style={{
                            background: 'linear-gradient(135deg, rgba(0, 255, 65, 0.15) 0%, rgba(0, 255, 65, 0.08) 100%)',
                            border: '2px solid rgba(0, 255, 65, 0.4)',
                            color: '#00FF41',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                          }}
                          type="number"
                          step="0.1"
                          value={projectData.acres || ''}
                          onChange={(e) => setProjectData({ ...projectData, acres: Number(e.target.value) || 0 })}
                          onFocus={(e) => e.target.select()}
                          placeholder="0"
                        />
                      </div>

                      {/* DBH Package */}
                      <div>
                        <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                               style={{ color: 'var(--text-secondary)' }}>
                          DBH Package
                        </label>
                        <select
                          className="w-full px-6 py-5 rounded-xl font-semibold text-xl text-center"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 100%)',
                            border: '2px solid var(--border-default)',
                            color: 'var(--text-primary)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)'
                          }}
                          value={projectData.dbhPackage}
                          onChange={(e) => setProjectData({ ...projectData, dbhPackage: Number(e.target.value) })}
                        >
                          <option value={4}>Small (4")</option>
                          <option value={6}>Medium (6")</option>
                          <option value={8}>Large (8")</option>
                          <option value={10}>XLarge (10")</option>
                          <option value={12}>Max (12")</option>
                        </select>
                      </div>
                    </div>

                    {/* Profit Margin Section */}
                    <div>
                      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider"
                             style={{ color: 'var(--text-secondary)' }}>
                        Profit Margin (%)
                      </label>

                      {/* Margin Presets */}
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[30, 40, 50, 60].map((margin) => (
                          <button
                            key={margin}
                            type="button"
                            onClick={() => setProjectData({ ...projectData, profitMargin: margin })}
                            className="px-3 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:scale-105"
                            style={{
                              background: projectData.profitMargin === margin ? 'rgba(0, 255, 65, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                              border: projectData.profitMargin === margin ? '2px solid rgba(0, 255, 65, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                              color: projectData.profitMargin === margin ? '#00FF41' : 'var(--text-secondary)'
                            }}
                          >
                            {margin}%
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setProjectData({ ...projectData, profitMargin: Math.max(0, projectData.profitMargin - 5) })}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-xl transition-all duration-200 active:scale-95"
                          style={{
                            background: 'rgba(0, 255, 65, 0.1)',
                            border: '2px solid rgba(0, 255, 65, 0.3)',
                            color: '#00FF41'
                          }}
                        >
                          <Minus className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
                        </button>
                        <input
                          type="number"
                          className="flex-1 text-center px-4 py-4 md:py-6 rounded-xl font-mono text-3xl md:text-4xl font-bold"
                          style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '2px solid var(--border-default)',
                            color: '#00FF41'
                          }}
                          value={projectData.profitMargin}
                          onChange={(e) => setProjectData({ ...projectData, profitMargin: Number(e.target.value) })}
                        />
                        <button
                          type="button"
                          onClick={() => setProjectData({ ...projectData, profitMargin: Math.min(100, projectData.profitMargin + 5) })}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-xl transition-all duration-200 active:scale-95"
                          style={{
                            background: 'rgba(0, 255, 65, 0.1)',
                            border: '2px solid rgba(0, 255, 65, 0.3)',
                            color: '#00FF41'
                          }}
                        >
                          <Plus className="w-5 h-5 md:w-6 md:h-6 mx-auto" />
                        </button>
                      </div>
                    </div>

                    {/* Calculation Breakdown */}
                    <div className="p-5 md:p-6 rounded-2xl"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(34, 197, 94, 0.08) 100%)',
                           border: '1px solid rgba(34, 197, 94, 0.3)',
                           backdropFilter: 'blur(30px)',
                           WebkitBackdropFilter: 'blur(30px)'
                         }}>
                      <div className="flex items-center gap-2 mb-4">
                        <Calculator className="w-5 h-5" style={{ color: '#22C55E' }} />
                        <h3 className="text-sm font-semibold uppercase tracking-wider"
                            style={{ color: '#22C55E', letterSpacing: '0.1em' }}>
                          Calculation Breakdown
                        </h3>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Inch-Acres</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {inchAcres.toFixed(2)} IA
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Production Hours</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {hours.toFixed(2)} hrs
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Loadout Cost</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(loadoutCost)}/hr
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 rounded-xl"
                             style={{
                               background: 'rgba(0, 0, 0, 0.2)',
                               border: '1px solid var(--border-default)'
                             }}>
                          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Billing Rate</span>
                          <span className="font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {formatCurrency(billingRate)}/hr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Clean Final Price Display */}
                    <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-center"
                         style={{
                           background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.15) 100%)',
                           border: '2px solid rgba(34, 197, 94, 0.4)',
                           backdropFilter: 'blur(40px)',
                           WebkitBackdropFilter: 'blur(40px)',
                           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                         }}>

                      <div className="relative">
                        <div className="text-sm uppercase tracking-wider font-semibold mb-4"
                             style={{
                               color: 'rgba(255,255,255,0.7)',
                               letterSpacing: '0.15em'
                             }}>
                          Total Project Price
                        </div>
                        <div className="text-6xl md:text-7xl font-black font-mono mb-3"
                             style={{
                               color: 'white',
                               letterSpacing: '-0.02em'
                             }}>
                          {formatCurrency(totalPrice)}
                        </div>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                             style={{
                               background: 'rgba(0, 0, 0, 0.3)',
                               backdropFilter: 'blur(10px)',
                               WebkitBackdropFilter: 'blur(10px)',
                               border: '1px solid rgba(255, 255, 255, 0.2)'
                             }}>
                          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>
                            {projectData.profitMargin}% profit margin • {hours.toFixed(1)} hours • {inchAcres.toFixed(1)} IA
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button
                        onClick={handleSaveQuote}
                        disabled={saving || !selectedCustomerId || !selectedLoadout}
                        className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105"
                        style={{
                          background: saving ? 'rgba(255,255,255,0.1)' : 'var(--gradient-brand)',
                          color: 'white',
                          boxShadow: '0 4px 14px 0 rgba(0, 255, 65, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
                          opacity: (!selectedCustomerId || !selectedLoadout) ? 0.5 : 1,
                          cursor: (!selectedCustomerId || !selectedLoadout || saving) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {saving ? (
                          <>
                            <div className="spinner" />
                            <span className="hidden md:inline">Saving...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            <span className="hidden md:inline">Save Quote</span>
                            <span className="md:hidden">Save</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => window.print()}
                        disabled={!selectedLoadout || !selectedCustomerId}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 hover:scale-105"
                        style={{
                          background: 'rgba(0, 191, 255, 0.1)',
                          border: '1px solid rgba(0, 191, 255, 0.3)',
                          color: '#00BFFF',
                          opacity: (!selectedLoadout || !selectedCustomerId) ? 0.5 : 1,
                          cursor: (!selectedLoadout || !selectedCustomerId) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Printer className="w-5 h-5" />
                        <span className="hidden md:inline">Print</span>
                      </button>

                      <button
                        onClick={() => {
                          const customer = customers.find(c => c._id === selectedCustomerId);
                          if (customer && customer.email) {
                            const subject = `Quote for ${customer.name}`;
                            const body = `Project: ${customer.name}-Q\nAcreage: ${projectData.acres}\nPrice: ${formatCurrency(totalPrice)}`;
                            window.location.href = `mailto:${customer.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                          } else {
                            alert('Customer has no email address');
                          }
                        }}
                        disabled={!selectedLoadout || !selectedCustomerId}
                        className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-semibold text-base md:text-lg transition-all duration-200 hover:scale-105"
                        style={{
                          background: 'rgba(255, 229, 0, 0.1)',
                          border: '1px solid rgba(255, 229, 0, 0.3)',
                          color: '#FFE500',
                          opacity: (!selectedLoadout || !selectedCustomerId) ? 0.5 : 1,
                          cursor: (!selectedLoadout || !selectedCustomerId) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        <Mail className="w-5 h-5" />
                        <span className="hidden md:inline">Email</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Recent Quotes Section */}
          {projects.length > 0 && (
            <div className="mt-10 relative rounded-3xl overflow-hidden"
                 style={{
                   background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.85) 0%, rgba(10, 10, 10, 0.9) 100%)',
                   border: '2px solid rgba(0, 255, 65, 0.2)',
                   backdropFilter: 'blur(60px)',
                   WebkitBackdropFilter: 'blur(60px)',
                   boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 65, 0.2), inset 0 2px 4px rgba(255, 255, 255, 0.08)'
                 }}>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-2 mb-6">
                  <FileText className="w-5 h-5" style={{ color: '#00FF41' }} />
                  <h3 className="text-lg font-semibold uppercase tracking-wider"
                      style={{ color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
                    Recent Quotes
                  </h3>
                  <span className="ml-auto text-sm" style={{ color: 'var(--text-tertiary)' }}>
                    {projects.length} total
                  </span>
                </div>

                <div className="space-y-4">
                  {projects.slice(0, 10).map((project) => (
                    <div key={project._id}
                         className="group rounded-xl p-4 transition-all duration-300"
                         style={{
                           background: 'rgba(255, 255, 255, 0.02)',
                           border: '1px solid rgba(255, 255, 255, 0.08)',
                         }}>
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold text-lg truncate" style={{ color: 'var(--text-primary)' }}>
                              {project.projectName}
                            </h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider`}
                                  style={{
                                    background: project.status === 'won' ? 'rgba(0, 255, 65, 0.15)' :
                                               project.status === 'lost' ? 'rgba(255, 0, 64, 0.15)' :
                                               'rgba(0, 191, 255, 0.15)',
                                    color: project.status === 'won' ? '#00FF41' :
                                           project.status === 'lost' ? '#FF0040' :
                                           '#00BFFF',
                                    border: `1px solid ${project.status === 'won' ? 'rgba(0, 255, 65, 0.3)' :
                                           project.status === 'lost' ? 'rgba(255, 0, 64, 0.3)' :
                                           'rgba(0, 191, 255, 0.3)'}`
                                  }}>
                              {project.status || 'quoted'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>
                            <span>{project.projectSize} acres</span>
                            <span>•</span>
                            <span>{formatCurrency(project.totalPrice || 0)}</span>
                            <span>•</span>
                            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                          <button
                            onClick={() => handleLoadQuote(project)}
                            className="px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:scale-105 whitespace-nowrap"
                            style={{
                              background: 'rgba(0, 255, 65, 0.1)',
                              border: '1px solid rgba(0, 255, 65, 0.3)',
                              color: '#00FF41'
                            }}
                          >
                            Load
                          </button>

                          <select
                            value={project.status || 'quoted'}
                            onChange={(e) => handleUpdateStatus(project._id, e.target.value)}
                            className="px-3 py-2 rounded-lg font-medium text-sm transition-all"
                            style={{
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(255, 255, 255, 0.1)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <option value="quoted">Quoted</option>
                            <option value="won">Won</option>
                            <option value="lost">Lost</option>
                          </select>

                          <button
                            onClick={() => handleDeleteQuote(project._id)}
                            className="px-3 py-2 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                            style={{
                              background: 'rgba(255, 0, 64, 0.1)',
                              border: '1px solid rgba(255, 0, 64, 0.3)',
                              color: '#FF0040'
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Customer Modal */}
      {showCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
             style={{
               background: 'rgba(0, 0, 0, 0.85)',
               backdropFilter: 'blur(20px)',
               WebkitBackdropFilter: 'blur(20px)'
             }}
             onClick={() => setShowCustomerModal(false)}>
          <div className="relative max-w-2xl w-full rounded-3xl overflow-hidden"
               style={{
                 background: 'linear-gradient(135deg, rgba(15, 15, 15, 0.95) 0%, rgba(10, 10, 10, 0.98) 100%)',
                 border: '2px solid rgba(0, 255, 65, 0.3)',
                 boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 0 60px rgba(0, 255, 65, 0.3)',
                 backdropFilter: 'blur(40px)',
                 WebkitBackdropFilter: 'blur(40px)'
               }}
               onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-3xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
                New Customer
              </h2>

              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="input-group">
                    <label className="input-label">Name *</label>
                    <input
                      className="input-field"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                      placeholder="John Smith"
                      autoFocus
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Phone *</label>
                    <input
                      className="input-field"
                      type="tel"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                      className="input-field"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Company</label>
                    <input
                      className="input-field"
                      value={newCustomer.company}
                      onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })}
                      placeholder="ABC Properties LLC"
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label className="input-label">Street Address</label>
                  <input
                    className="input-field"
                    value={newCustomer.address}
                    onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                    placeholder="123 Main Street"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  <div className="input-group">
                    <label className="input-label">City</label>
                    <input
                      className="input-field"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                      placeholder="New Smyrna Beach"
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">State</label>
                    <input
                      className="input-field"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
                      placeholder="FL"
                      maxLength={2}
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label">Zip Code</label>
                    <input
                      className="input-field"
                      value={newCustomer.zipCode}
                      onChange={(e) => setNewCustomer({ ...newCustomer, zipCode: e.target.value })}
                      placeholder="32168"
                      maxLength={5}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => {
                    setShowCustomerModal(false);
                    setNewCustomer({ name: '', phone: '', email: '', address: '', city: '', state: '', zipCode: '', company: '' });
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: 'var(--text-primary)'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustomer}
                  disabled={!newCustomer.name || !newCustomer.phone}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: (!newCustomer.name || !newCustomer.phone) ? 'rgba(255,255,255,0.1)' : 'var(--gradient-brand)',
                    color: 'white',
                    boxShadow: '0 4px 14px 0 rgba(0, 255, 65, 0.35)',
                    opacity: (!newCustomer.name || !newCustomer.phone) ? 0.5 : 1,
                    cursor: (!newCustomer.name || !newCustomer.phone) ? 'not-allowed' : 'pointer'
                  }}
                >
                  Create Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>

  );
}
