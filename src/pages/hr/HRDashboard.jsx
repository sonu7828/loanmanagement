import React from 'react';
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    FileText,
    TrendingUp,
    ExternalLink,
    ClipboardCheck,
    ChevronRight
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
    const { applications } = useLoans();
    const navigate = useNavigate();

    // Derived stats
    const pendingCount = (applications || []).filter(app => app.status === STATUSES.HR_PENDING || app.status === STATUSES.SUBMITTED).length;
    const approvedThisWeek = (applications || []).filter(app => app.status?.includes('Approved')).length; 
    const rejectedCount = (applications || []).filter(app => app.status === STATUSES.DECLINED).length;

    const stats = [
        { title: 'Total Pending Verifications', value: pendingCount.toString(), icon: Clock, variant: 'warning' },
        { title: 'Approved This Week', value: approvedThisWeek.toString(), icon: CheckCircle2, variant: 'success' },
        { title: 'Rejected Applications', value: rejectedCount.toString(), icon: XCircle, variant: 'danger' },
    ];

    const recentVerifications = (applications || [])
        .filter(app => [STATUSES.SUBMITTED, STATUSES.HR_PENDING, STATUSES.HR_APPROVED].includes(app.status))
        .slice(0, 5);

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="HR Verification Hub"
                description="Monitor verification queue, verify employee eligibility, and manage loan approvals."
                actions={
                    <div className="flex gap-2">
                        <button onClick={() => navigate('/hr/verifications')} className="flex items-center gap-2 px-5 py-2 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-sm">
                            <ClipboardCheck className="w-4 h-4" />
                            Open Queue
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Priority Queue Card */}
                <div className="glass rounded-[20px] sm:rounded-[24px] overflow-hidden border border-slate-800/50 shadow-xl">
                    <div className="px-5 py-3.5 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
                        <h2 className="text-xl font-display font-bold text-slate-100">Priority Queue</h2>
                        <button onClick={() => navigate('/hr/verifications')} className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-blue-600 transition-all flex items-center gap-1">
                            View Full <ChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="divide-y divide-slate-800/50">
                        {recentVerifications.length > 0 ? (
                            recentVerifications.map((row, i) => (
                                <div key={i} className="px-5 py-3 flex items-center justify-between hover:bg-slate-800/30 transition-colors group cursor-pointer" onClick={() => navigate(`/hr/verifications/${row.id}`)}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-blue-400 group-hover:scale-110 transition-transform">
                                            {(row.name || 'U')[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-200">{row.name || 'Anonymous'}</p>
                                            <p className="text-[10px] text-slate-500 font-mono tracking-tight">{row.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Badge variant={row.status?.includes('Approved') ? 'success' : 'warning'} className="text-[9px]">
                                            {row.status || 'Pending'}
                                        </Badge>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/hr/verifications/${row.id}`); }}
                                            className="p-2 text-slate-500 hover:text-blue-600 transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-500 italic bg-slate-900/10 text-sm">No applications found in queue.</div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Shortcutes */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="glass p-5 lg:p-6 rounded-[24px] border border-slate-800/50 bg-gradient-to-br from-blue-600/5 to-transparent space-y-4 shadow-xl">
                        <h3 className="text-xl font-display font-bold text-slate-100 px-1">Quick Access</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <ShortcutCard
                                title="Employee List"
                                description="Browse directory"
                                icon={Users}
                                onClick={() => navigate('/hr/employees')}
                            />
                            <ShortcutCard
                                title="Reports"
                                description="System analytics"
                                icon={TrendingUp}
                                onClick={() => navigate('/hr/reports')}
                            />
                        </div>
                    </div>

                    <div className="glass p-5 lg:p-6 rounded-[24px] border border-slate-800/50 bg-slate-900/40 space-y-3 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
                        <div className="flex items-center gap-3 text-emerald-400 relative z-10">
                            <TrendingUp className="w-5 h-5" />
                            <span className="font-bold">Efficiency Report</span>
                        </div>
                        <p className="text-sm text-slate-500 leading-relaxed relative z-10">
                            Verification processing time is down by <span className="text-emerald-400 font-bold">14%</span> this month. Great job keep it up!
                        </p>
                        <div className="pt-1 relative z-10">
                            <button onClick={() => navigate('/hr/reports')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-400 transition-all flex items-center gap-1">
                                Analyze Productivity <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ShortcutCard = ({ title, description, icon: Icon, onClick }) => (
    <button
        onClick={onClick}
        className="p-5 lg:p-6 glass rounded-[20px] sm:rounded-[24px] border border-slate-800/50 hover:border-blue-500/30 transition-all group lg:text-left shadow-lg active:scale-[0.98]"
    >
        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:scale-110 transition-all mb-4">
            <Icon className="w-5 h-5" />
        </div>
        <h4 className="font-bold text-slate-200">{title}</h4>
        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-1">{description}</p>
    </button>
);

export default HRDashboard;
