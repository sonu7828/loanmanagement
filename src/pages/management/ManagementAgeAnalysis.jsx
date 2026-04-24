import React, { useState, useMemo } from 'react';
import {
    Clock,
    Filter,
    Building2,
    Download,
    TrendingUp,
    AlertCircle,
    ArrowUpRight,
    PieChart as PieChartIcon
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';

const COLORS = ['#10b981', '#f59e0b', '#f97316', '#ef4444'];

const ManagementAgeAnalysis = () => {
    const { applications } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('All Companies');
    const [toast, setToast] = useState(null);

    const companies = useMemo(() => {
        return ['All Companies', ...new Set(applications.map(a => a.company).filter(Boolean))];
    }, [applications]);

    const agingData = [
        { name: 'Current (0-30)', value: 1250000, count: 420, color: COLORS[0] },
        { name: '30-60 Days', value: 340000, count: 85, color: COLORS[1] },
        { name: '60-90 Days', value: 125000, count: 32, color: COLORS[2] },
        { name: '90-120+ Days', value: 85000, count: 18, color: COLORS[3] }
    ];

    const totalPortfolio = agingData.reduce((sum, d) => sum + d.value, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <SectionHeader
                title="Arrears Age Analysis"
                description="Executive view of portfolio aging segments and risk concentration."
                actions={
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                            <Building2 className="w-4 h-4 text-slate-500 ml-2" />
                            <select 
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="bg-transparent border-none text-xs font-black text-slate-300 focus:ring-0 appearance-none pr-8 uppercase tracking-widest cursor-pointer"
                            >
                                {companies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <button className="p-4 bg-white text-slate-900 rounded-2xl hover:scale-105 transition-all shadow-xl">
                            <Download className="w-4 h-4" />
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {agingData.map((segment, i) => (
                    <div key={i} className="glass p-8 rounded-[32px] border border-slate-800/50 space-y-4 group hover:border-slate-700 transition-all">
                        <div className="flex items-center justify-between">
                            <div className="p-3 rounded-2xl" style={{ backgroundColor: `${segment.color}10`, color: segment.color }}>
                                <Clock className="w-5 h-5" />
                            </div>
                            <Badge variant={i === 0 ? 'success' : i < 2 ? 'warning' : 'danger'}>
                                {Math.round((segment.value / totalPortfolio) * 100)}%
                            </Badge>
                        </div>
                        <div>
                            <p className="text-3xl font-display font-black text-white italic tracking-tighter">R {(segment.value / 1000).toFixed(0)}k</p>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">{segment.name}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-600 uppercase">Count</span>
                            <span className="text-sm font-black text-slate-300">{segment.count}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 glass p-10 rounded-[48px] border border-slate-800/50 space-y-8 shadow-2xl">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">Portfolio Aging Chart</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Risk migration tracking</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <span className="text-xs font-black text-emerald-500">92% Recovery Rate</span>
                        </div>
                    </div>
                    
                    <div className="h-96 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={agingData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(v) => `R${(v / 1000).toFixed(0)}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '24px' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                />
                                <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={60}>
                                    {agingData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="glass p-10 rounded-[48px] border border-slate-800/50 space-y-8 shadow-2xl bg-slate-900/10">
                    <div className="space-y-1">
                        <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">Segment Summary</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Concentration Analysis</p>
                    </div>

                    <div className="space-y-6">
                        {agingData.map((item, i) => (
                            <div key={i} className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-300">{item.name}</span>
                                    <span className="text-xs font-black text-slate-100">{Math.round((item.value / totalPortfolio) * 100)}%</span>
                                </div>
                                <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000 shadow-lg"
                                        style={{ 
                                            width: `${(item.value / totalPortfolio) * 100}%`,
                                            backgroundColor: item.color,
                                            boxShadow: `0 0 10px ${item.color}40`
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-6 border-t border-slate-800/50 space-y-4">
                        <div className="flex items-start gap-4 p-5 bg-rose-600/5 border border-rose-500/10 rounded-3xl">
                            <AlertCircle className="w-5 h-5 text-rose-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-xs font-black text-rose-500 uppercase tracking-widest">At Risk Portfolio</p>
                                <p className="text-sm font-bold text-slate-300">R 210,000</p>
                                <p className="text-[10px] text-slate-600 font-bold leading-tight">Total non-current debt requiring immediate recovery action.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ManagementAgeAnalysis;
