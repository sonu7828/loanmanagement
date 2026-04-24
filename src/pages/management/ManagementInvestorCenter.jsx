import React, { useState, useMemo } from 'react';
import {
    TrendingUp,
    BarChart3,
    ArrowUpRight,
    Download,
    Building2,
    Calendar,
    Globe,
    Layers,
    PieChart as PieChartIcon,
    FileText,
    ChevronRight,
    Zap
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

const ManagementInvestorCenter = () => {
    const { getExecutiveStats, getDisbursementTrends } = useLoans();
    const stats = getExecutiveStats();
    const trendData = getDisbursementTrends();

    const [toast, setToast] = useState(null);

    const investorMetrics = [
        { title: 'Capital Deployed', value: 'R 12.4M', trend: '+18%', icon: Globe, variant: 'primary' },
        { title: 'Portfolio ROI', value: '24.2%', trend: '+2.1%', icon: Zap, variant: 'success' },
        { title: 'Default Rate', value: '1.8%', trend: '-0.4%', icon: Layers, variant: 'warning' },
        { title: 'Market Reach', value: '14 Companies', trend: '+2', icon: Building2, variant: 'neutral' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <SectionHeader
                title="Investor Intelligence Center"
                description="Consolidated portfolio performance and equity growth analytics for board-level reporting."
                actions={
                    <button 
                        onClick={() => setToast({ message: 'Generating investor presentation PDF...', type: 'info' })}
                        className="px-8 py-4 bg-white text-slate-900 rounded-[24px] text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
                    >
                        <FileText className="w-4 h-4" />
                        Investor Presentation
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {investorMetrics.map((m, i) => (
                    <div key={i} className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-4 group hover:border-blue-500/30 transition-all shadow-xl">
                        <div className="flex items-center justify-between">
                            <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 text-blue-400`}>
                                <m.icon className="w-5 h-5" />
                            </div>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${m.trend.startsWith('+') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                {m.trend}
                            </span>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-black text-white italic tracking-tighter">{m.value}</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{m.title}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Growth Chart */}
                <div className="lg:col-span-2 glass p-10 rounded-[56px] border border-slate-800/50 space-y-10 shadow-2xl relative overflow-hidden bg-slate-900/10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[120px] -mr-40 -mt-40" />
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tight">Equitized Portfolio Growth</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">12-Month Performance Index</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Growth Rate</p>
                                <p className="text-lg font-black text-emerald-400">18.4% YoY</p>
                            </div>
                            <div className="p-4 bg-slate-950 rounded-[20px] border border-slate-800">
                                <TrendingUp className="w-5 h-5 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="h-96 w-full relative z-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorInvestor" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `R${(v/1000000).toFixed(1)}M`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '32px', border: '1px solid rgba(59,130,246,0.3)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}
                                    formatter={(v) => [`R ${(v/1000).toFixed(0)}k`, 'Portfolio Value']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#3b82f6" fillOpacity={1} fill="url(#colorInvestor)" strokeWidth={5} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Portfolio Summary Card */}
                <div className="glass p-10 rounded-[56px] border border-slate-800/50 space-y-10 shadow-2xl bg-blue-600/5 flex flex-col">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tight">Board Summary</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Q2 2026 Executive Brief</p>
                    </div>

                    <div className="space-y-8 flex-grow">
                        {[
                            { label: 'Risk Adjusted Yield', value: '21.5%', sub: 'Target met' },
                            { label: 'Portfolio Health', value: '98.2%', sub: 'In Good Standing' },
                            { label: 'Operational Margin', value: '42.1%', sub: 'Lean efficiency' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-6 rounded-[32px] bg-slate-950 border border-slate-800/50 group hover:border-blue-500/50 transition-all">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</p>
                                    <p className="text-xl font-black text-white">{item.value}</p>
                                </div>
                                <div className="text-right">
                                    <Badge variant="success">{item.sub}</Badge>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8">
                        <button className="w-full py-5 rounded-[28px] bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 group">
                            Full Portfolio Review
                            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ManagementInvestorCenter;
