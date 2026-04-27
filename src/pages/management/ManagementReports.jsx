import React, { useState, useMemo } from 'react';
import {
    BarChart3,
    AlertCircle,
    Building2,
    Users,
    DollarSign,
    PieChart as PieChartIcon,
    ArrowUpRight,
    Download,
    Search,
    TrendingUp,
    ShieldAlert,
    UserMinus,
    Target,
    Percent,
    Printer,
    FileText
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

const ManagementReports = () => {
    const { applications } = useLoans();
    const [activeTab, setActiveTab] = useState('portfolio'); // portfolio, bad-debt, social
    const [toast, setToast] = useState(null);

    const companyData = useMemo(() => {
        const counts = applications.reduce((acc, app) => {
            const co = app.company || 'Unknown';
            acc[co] = (acc[co] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(counts).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
    }, [applications]);

    const reasonData = [
        { name: 'Education', value: 35 },
        { name: 'Medical', value: 25 },
        { name: 'Home Imp.', value: 20 },
        { name: 'Emergency', value: 15 },
        { name: 'Other', value: 5 }
    ];

    const badDebtReasons = [
        { name: 'Refuse to pay', value: 45, color: '#ef4444' },
        { name: 'Cannot trace', value: 25, color: '#f59e0b' },
        { name: 'Death', value: 15, color: '#64748b' },
        { name: 'Other', value: 15, color: '#1e293b' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <SectionHeader
                    title="Portfolio Governance Reports"
                    description="Comprehensive forensic and social-impact reporting for internal and regulatory audit."
                />

                <div className="flex p-1 bg-slate-950 rounded-2xl border border-slate-800">
                    {[
                        { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
                        { id: 'bad-debt', label: 'Bad Debt', icon: ShieldAlert },
                        { id: 'social', label: 'Social/ESG', icon: Users }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'text-slate-500 hover:text-slate-300'
                                }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {activeTab === 'portfolio' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                    <ReportCard title="Loan Frequency per Company" icon={Building2}>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={companyData.slice(0, 8)} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                                    <XAxis type="number" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                    <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} width={100} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={20} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ReportCard>

                    <ReportCard title="Loan Reason Distribution" icon={PieChartIcon}>
                        <div className="flex flex-col sm:flex-row items-center gap-10 h-80">
                            <div className="flex-1 h-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={reasonData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={8} dataKey="value">
                                            {reasonData.map((e, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex-1 space-y-3">
                                {reasonData.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                                        <span className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                                            {item.name}
                                        </span>
                                        <span className="text-slate-200">{item.value}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </ReportCard>

                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <MiniMetric label="Total Fees Collected" value="R 842,500" icon={DollarSign} trend="+12.4%" />
                        <MiniMetric label="Company Penetration" value="64.2%" icon={Target} trend="+5.1%" />
                        <MiniMetric label="Avg. Loan Amount" value="R 18,400" icon={TrendingUp} trend="+2.2%" />
                    </div>
                </div>
            )}

            {activeTab === 'bad-debt' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                    <ReportCard title="Bad Debt Loss Reasons" icon={ShieldAlert}>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={badDebtReasons}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }} />
                                    <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50}>
                                        {badDebtReasons.map((e, i) => <Cell key={i} fill={e.color} />)}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </ReportCard>

                    <div className="glass p-10 rounded-[48px] border border-slate-800/50 space-y-8 shadow-2xl bg-slate-900/10">
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tight">Write-Off Summary</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Loss Mitigation Report</p>
                        </div>
                        <div className="space-y-6">
                            {badDebtReasons.map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-5 rounded-3xl bg-slate-950 border border-slate-800/50 group hover:border-rose-500/30 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${item.color}10`, color: item.color }}>
                                            <AlertCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-200">{item.name}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">{item.value}% of Losses</p>
                                        </div>
                                    </div>
                                    <span className="text-sm font-black text-slate-100">R {(item.value * 2500).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'social' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in zoom-in-95 duration-500">
                    <ReportCard title="PDI Participation Report" icon={Users}>
                        <div className="p-8 bg-blue-600/5 border border-blue-500/10 rounded-[32px] space-y-6">
                            <div className="flex justify-between items-end">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">Target Metric</p>
                                    <p className="text-4xl font-display font-black text-slate-900 italic tracking-tighter">84.2%</p>
                                </div>
                                <Badge variant="success">ESG High Performing</Badge>
                            </div>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                Proportion of loan portfolio deployed to <strong>Previously Disadvantaged Individuals (PDI)</strong>, exceeding the annual regulatory target of 75%.
                            </p>
                            <div className="pt-4 border-t border-slate-800/50 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest italic">Compliance: Reg 41A</span>
                                <button className="text-xs font-black text-blue-400 hover:text-white transition-colors flex items-center gap-2 uppercase tracking-widest">
                                    Audit PDF <ArrowUpRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </ReportCard>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <MiniMetric label="Staff Turnover %" value="4.2%" icon={UserMinus} trend="-1.2%" />
                        <MiniMetric label="PDI Loan Count" value="2,412" icon={Users} trend="+84" />
                        <MiniMetric label="Employer Penetration" value="14 / 22" icon={Target} sub="Eligible Entities" />
                        <MiniMetric label="Kickback Compliance" value="0% Flags" icon={ShieldAlert} variant="success" />
                    </div>
                </div>
            )}

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

const ReportCard = ({ title, icon: Icon, children }) => (
    <div className="glass p-10 rounded-[48px] border border-slate-200 space-y-8 shadow-2xl bg-white">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-white rounded-[24px] border border-slate-300 text-blue-600 shadow-sm">
                    <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-display font-black !text-black italic uppercase tracking-tight">{title}</h3>
            </div>
            <button className="p-3 bg-white border border-slate-300 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
                <Printer className="w-4 h-4" />
            </button>
        </div>
        {children}
    </div>
);

const MiniMetric = ({ label, value, icon: Icon, trend, sub, variant }) => (
    <div className={`glass p-8 rounded-[32px] border border-slate-200 space-y-4 bg-white shadow-md`}>
        <div className="flex items-center justify-between">
            <div className={`p-3 rounded-2xl bg-white border border-slate-300 text-blue-600 shadow-sm`}>
                <Icon className="w-5 h-5" />
            </div>
            {trend && (
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg bg-white border border-slate-300 !text-black shadow-sm`}>
                    {trend}
                </span>
            )}
            {sub && <span className="text-[10px] font-black !text-black uppercase tracking-widest">{sub}</span>}
        </div>
        <div>
            <p className="text-3xl font-display font-black !text-black italic tracking-tighter">{value}</p>
            <p className="text-[10px] font-black !text-black uppercase tracking-[0.2em] mt-1">{label}</p>
        </div>
    </div>
);

export default ManagementReports;
