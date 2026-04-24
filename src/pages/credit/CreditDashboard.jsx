import React, { useMemo, useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertCircle,
  TrendingUp, 
  Search,
  CheckCircle2,
  XCircle,
  FileSearch,
  BarChart3,
  ArrowRight,
  UserCheck,
  Zap,
  Activity
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';
import { useLoans, STATUSES, LIFECYCLE_STATUSES } from '../../context/LoanContext';

const CreditDashboard = () => {
    const navigate = useNavigate();
    const { applications } = useLoans();
    const [prioritySearch, setPrioritySearch] = useState('');

    const pendingCount = applications.filter(a => a.status === STATUSES.CREDIT_PENDING || a.status === STATUSES.HR_APPROVED).length;
    const highRiskCount = applications.filter(a => a.risk === 'High' && a.status === STATUSES.CREDIT_PENDING).length;
    const approvedToday = applications.filter(a => a.status === STATUSES.APPROVED && new Date(a.date).toDateString() === new Date().toDateString()).length || 12; 

    const stats = [
        { 
            title: 'In Queue', 
            value: pendingCount.toString(), 
            icon: FileSearch, 
            variant: 'primary',
            onClick: () => navigate('/credit/queue', { state: { status: 'All' }})
        },
        { 
            title: 'High Risk', 
            value: highRiskCount.toString(), 
            icon: AlertTriangle, 
            variant: 'danger',
            onClick: () => navigate('/credit/queue', { state: { risk: 'High' }}) 
        },
        { 
            title: 'Approved Today', 
            value: approvedToday.toString(), 
            icon: ShieldCheck, 
            variant: 'success',
            onClick: () => navigate('/credit/history')
        },
    ];

    const priorityAssessments = useMemo(() => {
        const legacyCreditQueue = [
            STATUSES.NEW,
            STATUSES.CREDIT_PENDING,
            STATUSES.HR_APPROVED,
            STATUSES.UNDER_REVIEW,
        ];
        
        const filtered = applications
            .filter(
                (a) =>
                    a.lifecycleStatus === LIFECYCLE_STATUSES.HR_VERIFIED ||
                    legacyCreditQueue.includes(a.status)
            )
            .filter((a) => {
                if (!prioritySearch.trim()) return true;
                const q = prioritySearch.toLowerCase();
                return (a.name || '').toLowerCase().includes(q) || (a.id || '').toLowerCase().includes(q);
            });

        // Fallback dummy data if no real priority cases exist
        if (filtered.length === 0 && !prioritySearch) {
            return [
                { id: 'APP-004', name: 'Elena Rodriguez', score: 720, risk: 'Low', status: STATUSES.CREDIT_PENDING },
                { id: 'APP-005', name: 'Lerato Molefe', score: 450, risk: 'High', status: STATUSES.CREDIT_PENDING }
            ];
        }

        return filtered.slice(0, 5);
    }, [applications, prioritySearch]);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <SectionHeader
                title="Credit Operations Dashboard"
                description="Analyze risk profiles and manage high-priority assessment velocity."
                actions={(
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/credit/queue')}
                            className="btn-primary flex items-center gap-2 group"
                        >
                            <Zap className="w-4 h-4 fill-white animate-pulse" />
                            Start Next Assessment
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-xl">
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/30">
                            <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-blue-500" />
                                <h2 className="text-xl font-display font-bold text-slate-100">Ready for Credit Decisions</h2>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative hidden md:block">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        className="input-field pl-9 py-1.5 text-xs w-48"
                                        placeholder="Search..."
                                        value={prioritySearch}
                                        onChange={(e) => setPrioritySearch(e.target.value)}
                                    />
                                </div>
                                <button 
                                    onClick={() => navigate('/credit/queue')}
                                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    View Full Queue
                                </button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Applicant</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Score</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Risk Level</th>
                                        <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {priorityAssessments.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500 max-w-xl mx-auto">
                                                <p className="font-bold text-slate-400 mb-2">No applications in this priority list right now</p>
                                                <p className="text-xs leading-relaxed">
                                                    Rows are driven by your browser&apos;s saved loan data (<span className="font-mono text-slate-400">localStorage</span>), not by Git.
                                                    If you already moved these cases past credit review, the table will be empty even though the code is the same.
                                                    Your teammate can clear site data for this app or remove the <span className="font-mono text-slate-400">lms_applications</span> key, then refresh, to reload demo applications.
                                                </p>
                                            </td>
                                        </tr>
                                    ) : (
                                        priorityAssessments.map((app, i) => (
                                            <tr key={app.id || i} className="hover:bg-slate-800/30 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 text-xs text-center">
                                                            {(app.name || 'A')[0]}
                                                        </div>
                                                        <span className="font-medium text-slate-200">{app.name || `No Name (ID: ${app.id})`}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-sm font-bold text-slate-300">{app.score || '612'}</span>
                                                        <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                            <div className="h-full bg-blue-500" style={{ width: `${(app.score / 850) * 100 || 65}%` }}></div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant={app.risk === 'High' ? 'danger' : app.risk === 'Medium' ? 'warning' : 'success'}>
                                                        {app.risk || 'Medium'}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => navigate(`/credit/profile/${app.id}`)}
                                                        className="px-4 py-2 rounded-xl bg-blue-600/10 text-blue-400 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg text-center"
                                                    >
                                                        Assess
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-6 bg-blue-600 rounded-[32px] text-white space-y-4 relative overflow-hidden group cursor-pointer shadow-xl shadow-blue-600/10">
                            <ShieldCheck className="absolute -right-4 -bottom-4 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-display font-bold text-white">Credit Policy</h3>
                            <p className="text-blue-100 text-sm opacity-80">98.4% of assessments today meet internal risk mitigation protocols.</p>
                            <button
                                onClick={() => navigate('/credit/reviews', { state: { tab: 'policy' } })}
                                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold hover:bg-white/30 transition-all text-center"
                            >
                                View Guidelines
                            </button>
                        </div>
                        <div className="p-6 bg-slate-900 border border-slate-800 rounded-[32px] space-y-4 relative overflow-hidden group cursor-pointer shadow-xl">
                            <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 text-slate-800 group-hover:scale-110 transition-transform" />
                            <h3 className="text-xl font-display font-bold text-slate-100">Efficiency Stats</h3>
                            <p className="text-slate-500 text-sm">Average turnaround time for credit decisions: <span className="text-blue-400 font-bold">4.2 hours</span></p>
                            <button
                                onClick={() => navigate('/credit/history')}
                                className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 transition-all text-center"
                            >
                                Performance Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="glass p-6 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl">
                        <h3 className="text-lg font-display font-bold text-slate-100">Credit Policy Stats</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <span>Avg. Credit Score</span>
                                    <span className="text-blue-400 text-base font-display">612</span>
                                </div>
                                <div className="w-full h-1 bg-slate-800 rounded-full">
                                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                                </div>
                            </div>
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50 flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Rejection Rate</p>
                                    <p className="text-xl font-display font-bold text-red-400">14.2%</p>
                                </div>
                                <div className="p-2 bg-red-400/10 rounded-lg text-red-400 text-center">
                                    <TrendingUp className="w-5 h-5 rotate-180" />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/credit/reviews')}
                            className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-bold text-sm hover:bg-slate-700 transition-all flex items-center justify-center gap-2 text-center"
                        >
                            <BarChart3 className="w-4 h-4" />
                            Detailed Risk Report
                        </button>
                    </div>

                    <div className="glass p-8 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl">
                        <h3 className="text-lg font-display font-bold flex items-center gap-2 text-slate-100">
                            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => navigate('/credit/queue', { state: { quickAction: 'approve' } })}
                                className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-blue-500 transition-all group text-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 text-center">
                                        <UserCheck className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">Quick Approve</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                            </button>
                            <button
                                onClick={() => navigate('/credit/queue', { state: { risk: 'High' } })}
                                className="w-full flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-red-500 transition-all group text-center"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400 text-center">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-300">Flag High Risk</span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-slate-700 group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                            </button>
                        </div>
                    </div>

                    <div className="glass p-6 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full -mr-16 -mt-16" />
                        <h3 className="text-lg font-display font-bold text-slate-100">Credit Policy Alerts</h3>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                                <div>
                                    <p className="text-sm font-bold text-slate-200">New Affordability Caps</p>
                                    <p className="text-xs text-slate-500 mt-1">DSR limits updated to 40% for Grade A employees.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="w-2 h-2 rounded-full bg-amber-500 mt-2" />
                                <div>
                                    <p className="text-sm font-bold text-slate-200">Sector Risk Warning</p>
                                    <p className="text-xs text-slate-500 mt-1">High volatility observed in Retail sector applicants.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditDashboard;
