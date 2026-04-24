import React, { useState, useMemo } from 'react';
import {
    CreditCard,
    Search,
    Filter,
    Download,
    CheckCircle2,
    AlertCircle,
    Banknote,
    Send,
    History,
    FileText,
    FileDown,
    ChevronRight
} from 'lucide-react';
import { useLoans, STATUSES, LIFECYCLE_STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const PayoutQueue = () => {
    const { applications, disburseLoan } = useLoans();
    const [processing, setProcessing] = useState(null);
    const [toast, setToast] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState([]);

    // STRICT FILTER: Only admin-approved loans awaiting disbursement
    const queue = useMemo(() => {
        return applications.filter(app =>
            app.lifecycleStatus === LIFECYCLE_STATUSES.ADMIN_APPROVED &&
            (app.name.toLowerCase().includes(searchQuery.toLowerCase()) || app.id.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [applications, searchQuery]);

    const totalInQueue = queue.reduce((sum, app) => sum + (app.amount || 0), 0);

    const stats = [
        { title: 'Pending Payouts', value: queue.length.toString(), icon: Banknote, variant: 'warning' },
        { title: 'Liquidity Required', value: `R ${totalInQueue.toLocaleString()}`, icon: CreditCard, variant: 'primary' },
        { title: 'Selected for Export', value: selectedIds.length.toString(), icon: FileText, variant: 'neutral' },
    ];

    const toggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === queue.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(queue.map(q => q.id));
        }
    };

    const handleDisburse = async (id) => {
        try {
            setProcessing(id);
            await new Promise(resolve => setTimeout(resolve, 1000));
            disburseLoan(id);
            setToast({ message: 'Funds disbursed. Loan transferred to ACTIVE status.', type: 'success' });
            setSelectedIds(prev => prev.filter(i => i !== id));
        } catch (error) {
            setToast({ message: error.message, type: 'danger' });
        } finally {
            setProcessing(null);
        }
    };

    const handleExportCSV = () => {
        if (selectedIds.length === 0) return;

        const selectedApps = queue.filter(app => selectedIds.includes(app.id));
        const headers = ['Employee Name', 'ID Number', 'Bank Name', 'Account Number', 'Amount', 'Reference'];
        const rows = selectedApps.map(app => [
            app.name,
            app.idNumber,
            app.bankDetails?.name || 'N/A',
            app.bankDetails?.account || 'N/A',
            app.amount,
            `LOAN-${app.id}`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `payout_batch_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setToast({ message: `Exported ${selectedIds.length} payout instructions successfully.`, type: 'info' });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Strict Payout Queue"
                description="Process disbursements for verified and approved loan applications only."
                actions={
                    <button
                        disabled={selectedIds.length === 0}
                        onClick={handleExportCSV}
                        className={`flex items-center gap-2 px-8 py-4 rounded-[24px] text-sm font-black uppercase tracking-widest transition-all shadow-xl ${selectedIds.length > 0
                                ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/30'
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                            }`}
                    >
                        <FileDown className="w-5 h-5" />
                        Generate Payout File ({selectedIds.length})
                    </button>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50 shadow-2xl">
                <div className="p-8 border-b border-slate-800/50 space-y-6 bg-slate-900/20">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1">
                            <h2 className="text-xl font-display font-bold text-white tracking-tight">Approved Disbursements</h2>
                            <p className="text-sm text-slate-500 font-medium">Verify beneficiary ID Numbers before initiating bank transfers.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-slate-950 px-6 py-3 rounded-2xl border border-slate-800 w-full max-w-sm group focus-within:border-blue-600/50 transition-all">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                            <input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold"
                                placeholder="Search by name or ID..."
                            />
                        </div>
                    </div>
                </div>

                {queue.length === 0 ? (
                    <div className="py-32 text-center flex flex-col items-center justify-center space-y-6 animate-in fade-in zoom-in duration-500">
                        <div className="w-24 h-24 rounded-[32px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-800 shadow-inner">
                            <CheckCircle2 className="w-12 h-12 opacity-20" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-2xl font-display font-bold text-slate-400">Payout Queue is Clear</h3>
                            <p className="text-slate-600 max-w-sm mx-auto font-medium">No pending disbursements detected for processing at this time.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-950 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                    <th className="px-8 py-6 w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === queue.length}
                                            onChange={toggleSelectAll}
                                            className="w-5 h-5 rounded-lg bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
                                        />
                                    </th>
                                    <th className="px-8 py-6">Beneficiary & Account</th>
                                    <th className="px-8 py-6">Capital Sum</th>
                                    <th className="px-8 py-6">Audit Reference</th>
                                    <th className="px-8 py-6 text-right">Disbursement Control</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/30">
                                {queue.map((app) => (
                                    <tr
                                        key={app.id}
                                        className={`hover:bg-slate-900/40 transition-all group ${selectedIds.includes(app.id) ? 'bg-blue-600/5' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(app.id)}
                                                onChange={() => toggleSelect(app.id)}
                                                className="w-5 h-5 rounded-lg bg-slate-900 border-slate-800 text-blue-600 focus:ring-blue-600 focus:ring-offset-slate-950"
                                            />
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-5">
                                                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-xl text-slate-400 group-hover:border-blue-500/50 transition-all shadow-inner">
                                                    {app.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200 text-lg tracking-tight">{app.name}</p>
                                                    <p className="text-xs text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                        {app.bankDetails?.name} • {app.bankDetails?.account}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <p className="text-lg lg:text-xl font-display font-black text-emerald-400">R {app.amount?.toLocaleString()}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-tighter mt-1 italic">Approved Value</p>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1.5">
                                                <Badge variant="primary">{app.id}</Badge>
                                                <span className="text-[10px] font-mono text-slate-600">ID: {app.idNumber}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button
                                                disabled={processing === app.id}
                                                onClick={() => handleDisburse(app.id)}
                                                className={`flex items-center justify-center gap-3 ml-auto px-6 lg:px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-[0.15em] transition-all shadow-lg active:scale-95 whitespace-nowrap ${processing === app.id
                                                        ? 'bg-slate-800 text-slate-500'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20'
                                                    }`}
                                            >
                                                {processing === app.id ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-slate-600 border-t-white rounded-full animate-spin" />
                                                        Processing
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 hidden sm:block" />
                                                        Disburse
                                                    </>
                                                )}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default PayoutQueue;
