import React, { useMemo, useState } from 'react';
import { useLoans } from '../../context/LoanContext';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Filter,
  ArrowUpRight,
  Download,
  Building2,
  ChevronDown
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const ManagementDashboard = () => {
  const { getExecutiveStats, getDisbursementTrends, getStatusDistribution, applications } = useLoans();
  const [dateRange, setDateRange] = useState('month');
  const [selectedCompany, setSelectedCompany] = useState('All Companies');

  const statsData = useMemo(() => getExecutiveStats(), [getExecutiveStats]);
  const trendData = useMemo(() => getDisbursementTrends(), [getDisbursementTrends]);
  const statusData = useMemo(() => getStatusDistribution(), [getStatusDistribution]);

  const companies = useMemo(() => {
    return ['All Companies', ...new Set(applications.map(a => a.company).filter(Boolean))];
  }, [applications]);

  const stats = [
    {
      title: 'Gross Portfolio Value',
      value: `R ${Math.round(statsData.totalRevenue * 5).toLocaleString()}`, // Mocking portfolio value
      icon: DollarSign,
      variant: 'success',
      trend: { type: 'up', value: 12.4 }
    },
    {
      title: 'Active Portfolio Clients',
      value: statsData.activeClients.toString(),
      icon: Users,
      variant: 'primary',
      trend: { type: 'up', value: 5.2 }
    },
    {
      title: 'Annualized Yield',
      value: `${statsData.yieldRate}%`,
      icon: TrendingUp,
      variant: 'warning',
      trend: { type: 'up', value: 1.1 }
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Global Executive Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 glass p-6 rounded-[32px] border border-slate-200 shadow-xl bg-white">
        <div className="space-y-1">
          <h1 className="text-2xl font-display font-black !text-black tracking-tight italic uppercase">Executive Overview</h1>
          <p className="text-xs !text-black font-bold uppercase tracking-widest">Global Portfolio Intelligence & Real-time Metrics</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm relative">
                <div className="p-2 bg-blue-600/10 rounded-xl text-blue-600">
                    <Building2 className="w-4 h-4" />
                </div>
                <select 
                    value={selectedCompany}
                    onChange={(e) => setSelectedCompany(e.target.value)}
                    className="bg-transparent border-none text-xs font-black !text-black focus:ring-0 appearance-none pr-10 uppercase tracking-widest cursor-pointer"
                >
                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 !text-black absolute right-3 pointer-events-none" />
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm relative">
                <div className="p-2 bg-amber-600/10 rounded-xl text-amber-600">
                    <Calendar className="w-4 h-4" />
                </div>
                <select 
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="bg-transparent border-none text-xs font-black !text-black focus:ring-0 appearance-none pr-10 uppercase tracking-widest cursor-pointer"
                >
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">FY 2026</option>
                    <option value="custom">Custom Range</option>
                </select>
                <ChevronDown className="w-4 h-4 !text-black absolute right-3 pointer-events-none" />
            </div>

            <button className="p-4 bg-white border border-slate-200 text-slate-900 rounded-2xl hover:scale-105 transition-all shadow-md flex items-center justify-center">
                <Download className="w-4 h-4 !text-black" />
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Expenditure Chart */}
        <div className="glass p-10 rounded-[48px] border border-slate-200 space-y-8 shadow-2xl relative overflow-hidden group bg-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-blue-600/10" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
                <h3 className="text-xl font-display font-black !text-black italic uppercase tracking-tight">Disbursement Velocity</h3>
                <p className="text-[10px] font-black !text-black uppercase tracking-[0.2em]">Monthly Growth Index</p>
            </div>
            <Badge variant="primary">Target: +15%</Badge>
          </div>
          
          <div className="h-80 w-full relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                  itemStyle={{ color: '#000000', fontWeight: 'bold' }}
                  formatter={(value) => [`R ${value.toLocaleString()}`, 'Growth']}
                />
                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorAmount)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Portfolio Diversification */}
        <div className="glass p-10 rounded-[48px] border border-slate-200 space-y-8 shadow-2xl relative overflow-hidden group bg-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[100px] -mr-32 -mt-32 transition-all group-hover:bg-emerald-600/10" />
          
          <div className="flex items-center justify-between relative z-10">
            <div className="space-y-1">
                <h3 className="text-xl font-display font-black !text-black italic uppercase tracking-tight">Portfolio Allocation</h3>
                <p className="text-[10px] font-black !text-black uppercase tracking-[0.2em]">Risk Segment Distribution</p>
            </div>
            <Badge variant="success">Optimized</Badge>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-10 relative z-10 min-h-[320px]">
            <div className="w-56 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={90}
                    paddingAngle={10}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 w-full sm:w-48">
              {statusData.slice(0, 5).map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between group/legend">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                    <span className="text-[10px] !text-black font-black uppercase tracking-wider group-hover/legend:text-slate-800 transition-colors">{entry.name}</span>
                  </div>
                  <span className="text-xs font-black !text-black">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagementDashboard;
