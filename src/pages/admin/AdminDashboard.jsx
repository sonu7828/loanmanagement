import React from 'react';
import {
    Users,
    FileText,
    Clock,
    CheckCircle2,
    Search,
    Filter,
    Eye,
    ChevronRight,
    BarChart3,
    TrendingUp,
    AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';

const AdminDashboard = () => {
    const { applications } = useLoans();
    const navigate = useNavigate();

    const stats = [
        {
            title: 'Total Applications',
            value: applications.length.toString(),
            icon: FileText,
            variant: 'primary',
            trend: { type: 'up', value: 12 }
        },
        {
            title: 'Pending Review',
            value: applications.filter(a => [STATUSES.HR_PENDING, STATUSES.CREDIT_PENDING, STATUSES.ADMIN_APPROVAL].includes(a.status)).length.toString(),
            icon: Clock,
            variant: 'warning',
            trend: { type: 'down', value: 5 }
        },
        {
            title: 'Approved',
            value: applications.filter(a => a.status === STATUSES.APPROVED || a.status === STATUSES.PAID).length.toString(),
            icon: CheckCircle2,
            variant: 'success',
            trend: { type: 'up', value: 8 }
        },
        {
            title: 'Rejected',
            value: applications.filter(a => a.status === STATUSES.REJECTED).length.toString(),
            icon: AlertCircle,
            variant: 'danger',
            trend: { type: 'up', value: 2 }
        },
    ];

    const getStatusVariant = (status) => {
        switch (status) {
            case STATUSES.APPROVED:
            case STATUSES.PAID: return 'success';
            case STATUSES.REJECTED: return 'danger';
            case STATUSES.SUBMITTED:
            case STATUSES.HR_PENDING:
            case STATUSES.CREDIT_PENDING:
            case STATUSES.ADMIN_APPROVAL: return 'warning';
            default: return 'primary';
        }
    };


    const recentApps = applications.slice(0, 5);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <SectionHeader
                title="Application Status"
                description="Monitor and manage all loan applications across the status cycle."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Applications List */}
                <div className="xl:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-2">
                        <h2 className="text-xl font-display font-bold">Recent Activity</h2>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input className="input-field pl-9 py-1.5 text-sm w-48 md:w-64" placeholder="Search Employee..." />
                            </div>
                            <button className="p-2 glass rounded-xl text-slate-400 hover:text-blue-600 transition-colors">
                                <Filter className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Mobile Card List (Hidden on LG+) */}
                    <div className="grid grid-cols-1 gap-4 lg:hidden">
                        {recentApps.map((row) => (
                            <div 
                                key={row.id} 
                                onClick={() => navigate(`/admin/applications/${row.id}`)}
                                className="glass p-5 rounded-[28px] border-slate-800/50 space-y-4 group active:scale-[0.98] transition-all"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-sm text-blue-400 shrink-0">
                                            {row.name[0]}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-bold text-slate-200 truncate">{row.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest truncate">{row.company}</p>
                                        </div>
                                    </div>
                                    <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                                </div>
                                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                                    <p className="text-lg font-display font-bold text-slate-200">R {row.amount?.toLocaleString()}</p>
                                    <div className="flex items-center gap-1 text-blue-400 font-black text-[10px] uppercase tracking-widest">
                                        Details <ChevronRight className="w-3 h-3" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View (Visible on LG+) */}
                    <div className="hidden lg:block glass rounded-3xl overflow-hidden border border-slate-800/50">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Stage</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {recentApps.map((row) => (
                                    <tr key={row.id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400">
                                                    {row.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-slate-200">{row.name}</p>
                                                    <p className="text-xs text-slate-500">{row.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{row.company}</td>
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-200">R {row.amount?.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => navigate(`/admin/applications/${row.id}`)}
                                                className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all group-hover:scale-110"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="bg-slate-900/50 px-6 py-4 flex items-center justify-between border-t border-slate-800/50">
                            <span className="text-sm text-slate-500">Showing {recentApps.length} of {applications.length} applications</span>
                            <button
                                onClick={() => navigate('/admin/applications')}
                                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                            >
                                View Status <ChevronRight className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Analytics */}
                <div className="space-y-6">
                    <h2 className="text-xl font-display font-bold px-2">Application Process</h2>
                    <div className="glass p-6 rounded-[32px] space-y-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl"></div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-slate-400">Approval Rate</span>
                                <span className="text-emerald-400 font-bold">
                                    {Math.round((applications.filter(a => a.status === STATUSES.APPROVED).length / (applications.length || 1)) * 100)}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${(applications.filter(a => a.status === STATUSES.APPROVED).length / (applications.length || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                                <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Success</p>
                                <p className="text-xl font-display font-bold">High</p>
                            </div>
                            <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                                <BarChart3 className="w-5 h-5 text-purple-400 mb-2" />
                                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">Velocity</p>
                                <p className="text-xl font-display font-bold">2.4d</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-800/50">
                            <button
                                onClick={() => navigate('/admin/applications')}
                                className="w-full py-4 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-500 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-blue-600/20 active:scale-95"
                            >
                                Manage Status
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;

