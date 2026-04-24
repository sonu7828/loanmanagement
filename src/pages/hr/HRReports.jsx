import React from 'react';
import {
    BarChart3,
    Download,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Clock,
    Calendar,
    FileText,
    PieChart,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { SectionHeader, StatCard, Badge } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const HRReports = () => {
    const navigate = useNavigate();
    const { applications } = useLoans();

    // Derived stats
    const totalVerifications = (applications || []).length;
    const approved = (applications || []).filter(a => a.status?.includes('Approved') || a.status === 'Paid').length;
    const rejected = (applications || []).filter(a => a.status?.includes('Rejected') || a.status === 'Declined').length;
    const pending = (applications || []).filter(a => a.status === STATUSES.HR_PENDING || a.status === STATUSES.SUBMITTED).length;

    const approvalRate = totalVerifications > 0 ? ((approved / totalVerifications) * 100).toFixed(1) : 0;

    const exportToCSV = () => {
        const headers = ['Application ID', 'Employee', 'Company', 'Salary', 'Date', 'Status'];
        const csvContent = [
            headers.join(','),
            ...(applications || []).map(app => [
                app.id,
                app.name,
                app.company,
                app.salary,
                app.date ? new Date(app.date).toLocaleDateString() : 'N/A',
                app.status || 'Pending'
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `HR_Verification_Report_${new Date().toLocaleDateString()}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success feedback
        setToast({ message: 'Export successful! Downloading CSV...', type: 'success' });
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Activity Reports"
                description="Review comprehensive HR activity data, including verification performance, approval trends, and organizational compliance metrics."
                actions={
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-white font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 text-sm"
                        title="Download complete application history in CSV format"
                    >
                        <Download className="w-5 h-5" />
                        Export Full CSV
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-5">
                <StatCard title="Total Requests" value={totalVerifications.toString()} icon={FileText} variant="primary" />
                <StatCard title="Approved" value={approved.toString()} icon={CheckCircle2} variant="success" trend={{ type: 'up', value: 12 }} />
                <StatCard title="Rejected" value={rejected.toString()} icon={XCircle} variant="danger" trend={{ type: 'down', value: 5 }} />
                <StatCard title="Approval Rate" value={`${approvalRate}%`} icon={TrendingUp} variant="warning" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                {/* Visual Stats */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 space-y-6 bg-slate-900/20 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-display font-bold text-slate-100">Monthly Activity</h3>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-2 text-xs text-slate-500 font-bold"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Requests</span>
                                <span className="flex items-center gap-2 text-xs text-slate-500 font-bold"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Approved</span>
                            </div>
                        </div>

                        {/* Dummy Histogram */}
                        <div className="h-56 flex items-end gap-3 pt-4">
                            {[45, 60, 30, 80, 50, 95, 70, 40, 65, 85, 30, 55].map((h, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full relative flex items-end justify-center">
                                        <div
                                            className="w-full bg-blue-600/20 rounded-t-lg transition-all border-x border-t border-blue-500/20 group-hover:bg-blue-600/40"
                                            style={{ height: `${h}%` }}
                                        ></div>
                                        <div
                                            className="absolute bottom-0 w-2/3 bg-emerald-500/60 rounded-t-sm transition-all border-x border-t border-emerald-400 group-hover:bg-emerald-500"
                                            style={{ height: `${h * 0.7}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-tighter">M{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 bg-slate-900/40 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Metrics</h4>
                                <Clock className="w-4 h-4 text-orange-400" />
                            </div>
                            <div className="space-y-6">
                                <MetricProgress label="Avg. Verification Time" value="4.2 hours" percentage={75} color="bg-orange-500" />
                                <MetricProgress label="First Pass Accuracy" value="92.4%" percentage={92} color="bg-blue-500" />
                                <MetricProgress label="User Engagement" value="88%" percentage={88} color="bg-emerald-500" />
                            </div>
                        </div>

                        <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 bg-slate-900/40 space-y-6 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volume Trends</h4>
                                <TrendingUp className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div className="space-y-4">
                                <TrendRow label="New Applications" value="+15.2%" isUp={true} />
                                <TrendRow label="Rejection Rate" value="-2.1%" isUp={false} />
                                <TrendRow label="Support Queries" value="+0.4%" isUp={true} />
                                <TrendRow label="Completion Rate" value="+5.8%" isUp={true} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Logs Sidebar */}
                <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 bg-slate-900/40 space-y-6 shadow-sm">
                    <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Recent Log Activity</h3>
                    <div className="space-y-5">
                        {(applications || []).slice(0, 8).map((app, i) => (
                            <div key={i} className="flex gap-4 items-start border-b border-slate-800/50 pb-4 last:border-0">
                                <div className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${
                                    app.status?.includes('Approved') ? 'bg-emerald-500' : 
                                    app.status?.includes('Rejected') ? 'bg-red-500' : 'bg-blue-500'
                                }`}></div>

                                <div>
                                    <p className="text-sm font-bold text-slate-200">{app.status || 'Pending'} - {app.name || 'Anonymous'}</p>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Ref: {app.id}</p>
                                    <p className="text-[10px] text-slate-500 mt-0.5">{app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/hr/history')}
                        className="w-full py-4 bg-slate-800 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-700 hover:text-white transition-all shadow-sm"
                    >
                        View Full Audit Trail
                    </button>
                </div>
            </div>
        </div>
    );
};

const MetricProgress = ({ label, value, percentage, color }) => (
    <div className="space-y-2">
        <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400">{label}</span>
            <span className="text-sm font-black text-slate-200">{value}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    </div>
);

const TrendRow = ({ label, value, isUp }) => (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950 border border-slate-800/50">
        <span className="text-xs font-bold text-slate-400">{label}</span>
        <div className={`flex items-center gap-1 text-xs font-black ${isUp ? 'text-emerald-400' : 'text-red-400'}`}>
            {isUp ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
            {value}
        </div>
    </div>
);

export default HRReports;
