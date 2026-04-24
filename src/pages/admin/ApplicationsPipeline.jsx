import React, { useState } from 'react';
import {
    FileText,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    CheckCircle2,
    XCircle,
    RotateCcw,
    Clock,
    Download
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, STATUSES, LIFECYCLE_STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';

const ApplicationsPipeline = () => {
    const { applications, transitionLoanLifecycle } = useLoans();
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [minAmount, setMinAmount] = useState('');
    const [maxAmount, setMaxAmount] = useState('');
    const navigate = useNavigate();


    const filteredApps = applications.filter(app => {
        const isAdminQueue = app.lifecycleStatus === LIFECYCLE_STATUSES.CREDIT_APPROVED;
        if (!isAdminQueue) return false;
        const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.status.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
        const appAmount = Number(app.amount) || 0;
        const minOk = minAmount === '' || appAmount >= Number(minAmount);
        const maxOk = maxAmount === '' || appAmount <= Number(maxAmount);
        return matchesSearch && matchesStatus && minOk && maxOk;
    });

    const handleExportCsv = () => {
        const headers = ['Application ID', 'Employee', 'Email', 'Amount', 'Status', 'Lifecycle', 'Date'];
        const rows = filteredApps.map((app) => [
            app.id,
            app.name,
            app.email || 'N/A',
            Number(app.amount || 0).toFixed(2),
            app.status,
            app.lifecycleStatus || 'N/A',
            app.date ? new Date(app.date).toLocaleDateString() : 'N/A',
        ]);

        const csv = [headers, ...rows]
            .map((row) =>
                row.map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`).join(',')
            )
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `admin_status_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case STATUSES.PAID: return 'success';
            case STATUSES.ACTIVE: return 'primary';
            case STATUSES.APPROVED:
            case STATUSES.SUBMITTED:
            case STATUSES.HR_PENDING:
            case STATUSES.CREDIT_PENDING:
            case STATUSES.ADMIN_APPROVAL: return 'warning';
            case STATUSES.REJECTED: return 'danger';
            default: return 'neutral';
        }
    };

    const handleApprove = (id) => {
        transitionLoanLifecycle(id, LIFECYCLE_ACTIONS.ADMIN_APPROVE, 'System Admin', 'Final admin approval');
    };

    const handleSendBack = (id) => {
        transitionLoanLifecycle(id, LIFECYCLE_ACTIONS.REOPEN, 'System Admin', 'Returned for rework');
    };


    const handleReject = (id) => {
        transitionLoanLifecycle(id, LIFECYCLE_ACTIONS.ADMIN_REJECT, 'System Admin', 'Rejected at admin approval');
    };


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <SectionHeader
                title="Application Status"
                description="Monitor and manage all loan applications through their full status cycle."
            />

            <div className="glass p-8 rounded-[40px] space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 w-full max-w-md">
                        <Search className="w-5 h-5 text-slate-500 ml-2" />
                        <input
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200"
                            placeholder="Search by name, ID or status..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-sm font-bold text-slate-400 hover:text-blue-600 transition-all"
                        >
                            <Filter className="w-4 h-4" />
                            Filters
                        </button>
                        <button
                            onClick={handleExportCsv}
                            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20"
                        >
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-2xl border border-slate-800 bg-slate-900/40">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="input-field py-3"
                        >
                            <option value="ALL">All Statuses</option>
                            {Object.values(STATUSES).map((status) => (
                                <option key={status} value={status}>
                                    {status}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            value={minAmount}
                            onChange={(e) => setMinAmount(e.target.value)}
                            placeholder="Min amount"
                            className="input-field py-3"
                        />
                        <input
                            type="number"
                            value={maxAmount}
                            onChange={(e) => setMaxAmount(e.target.value)}
                            placeholder="Max amount"
                            className="input-field py-3"
                        />
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Employee</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Activity</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-blue-400">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{app.name}</p>
                                                <p className="text-xs text-slate-500">{app.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="font-bold text-slate-200">R {app.amount?.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Term: 12 Months</p>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <Badge variant={getStatusVariant(app.status)}>{app.status}</Badge>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                            <Clock className="w-4 h-4 text-slate-600" />
                                            {new Date(app.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {app.status !== STATUSES.PAID && app.status !== STATUSES.REJECTED && (
                                                <div className="flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-2xl border border-slate-800">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleApprove(app.id); }}
                                                        className="p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                        title="Approve (Next Stage)"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleReject(app.id); }}
                                                        className="p-2 text-red-500 hover:bg-red-500/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    {(
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleSendBack(app.id); }}
                                                            className="p-2 text-orange-500 hover:bg-orange-500/20 rounded-xl transition-all hover:scale-110 active:scale-90"
                                                            title="Send Back"
                                                        >
                                                            <RotateCcw className="w-5 h-5" />
                                                        </button>
                                                    )}

                                                </div>
                                            )}

                                            <button
                                                onClick={() => navigate(`/admin/applications/${app.id}`)}
                                                className="p-2 text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-500 hover:text-slate-100 rounded-lg transition-all">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                            {filteredApps.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-8 py-20 text-center text-slate-500">
                                        No applications found matching your search criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ApplicationsPipeline;

