import React, { useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import {
    ShieldAlert,
    Target,
    Building2,
    TrendingDown,
    Activity,
    ChevronRight
} from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { SectionHeader, StatCard, Badge } from '../../components/ui/Shared';

const COLORS = ['#10b981', '#3b82f6', '#ef4444', '#f59e0b', '#8b5cf6'];

const ManagementAnalytics = () => {
    const { getAnalyticsData } = useLoans();
    const analytics = useMemo(() => getAnalyticsData(), [getAnalyticsData]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <SectionHeader
                title="Advanced Portfolio Analytics"
                description="Deep-dive into risk segmentation, employer exposure, and loan quality metrics."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Portfolio Default Rate"
                    value={`${analytics.defaultRate}%`}
                    icon={ShieldAlert}
                    variant={Number(analytics.defaultRate) > 5 ? 'danger' : 'success'}
                />
                <StatCard
                    title="Avg Loan Principal"
                    value={`R ${Math.round(analytics.avgLoanSize).toLocaleString()}`}
                    icon={Target}
                    variant="primary"
                />
                <StatCard
                    title="Employer Groups"
                    value={analytics.topEmployers.length.toString()}
                    icon={Building2}
                    variant="warning"
                />
                <StatCard
                    title="Risk Efficiency"
                    value="94.2%"
                    icon={Activity}
                    variant="success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Risk Segmentation */}
                <div className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-8 flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-bold text-white tracking-tight">Credit Risk Segmentation</h3>
                            <p className="text-xs text-slate-500 font-medium font-mono uppercase tracking-widest italic">Based on verifyed income brackets</p>
                        </div>
                        <Badge variant="primary">LIVE AUDIT</Badge>
                    </div>

                    <div className="flex-grow flex flex-col sm:flex-row items-center gap-10 py-10">
                        <div className="w-full h-64 max-w-[280px] min-h-[256px]">
                            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                <PieChart>
                                    <Pie
                                        data={analytics.riskData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={8}
                                        dataKey="value"
                                    >
                                        {analytics.riskData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px', color: '#fff' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="space-y-6 w-full sm:w-64">
                            {analytics.riskData.map((item, i) => (
                                <div key={item.name} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="text-slate-400 font-bold">{item.name}</span>
                                        </div>
                                        <span className="text-white font-black">{item.value} Apps</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                                        <div
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{
                                                width: `${(item.value / analytics.riskData.reduce((s, d) => s + d.value, 0)) * 100}%`,
                                                backgroundColor: COLORS[i]
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Employer Exposure */}
                <div className="glass p-8 rounded-[40px] border border-slate-800/50 space-y-8 flex flex-col">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <h3 className="text-xl font-display font-bold text-white tracking-tight">Top Employer Exposure</h3>
                            <p className="text-xs text-slate-500 font-medium font-mono uppercase tracking-widest italic">Concentration by loan count</p>
                        </div>
                        <button className="p-2 bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>

                    <div className="flex-grow h-80 py-4 min-h-[320px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                            <BarChart data={analytics.topEmployers} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    stroke="#64748b"
                                    fontSize={10}
                                    width={120}
                                    tickLine={false}
                                    axisLine={false}
                                    className="font-bold uppercase tracking-tighter"
                                />
                                <Tooltip
                                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '16px' }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="#3b82f6"
                                    radius={[0, 8, 8, 0]}
                                    barSize={20}
                                    className="animate-pulse-slow"
                                >
                                    {analytics.topEmployers.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Quality Summary */}
            <div className="glass p-10 rounded-[40px] border border-slate-800/50 bg-slate-900/20">
                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-blue-600/10 rounded-2xl text-blue-400">
                        <TrendingDown className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-white tracking-tight">Portfolio Quality Assessment</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    <QualityIndicator
                        label="Recovery Velocity"
                        value="Fast"
                        percentage={88}
                        description="Loans converted from ACTIVE to PAID within expected timeframe."
                    />
                    <QualityIndicator
                        label="Verification Accuracy"
                        value="High"
                        percentage={96}
                        description="Data consistency across HR and Credit verification modules."
                    />
                    <QualityIndicator
                        label="System Sync Latency"
                        value="Zero"
                        percentage={100}
                        description="Real-time data synchronization across all administrative modules."
                    />
                </div>
            </div>
        </div>
    );
};

const QualityIndicator = ({ label, value, percentage, description }) => (
    <div className="space-y-4">
        <div className="flex justify-between items-end">
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
                <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">{value}</span>
                    <Badge variant="success">+{percentage}%</Badge>
                </div>
            </div>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
        <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: `${percentage}%` }} />
        </div>
    </div>
);

export default ManagementAnalytics;
