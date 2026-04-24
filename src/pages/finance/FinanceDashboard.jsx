import React, { useState } from 'react';
import {
    CreditCard,
    Receipt,
    ArrowDownCircle,
    Download,
    Filter,
    CheckCircle2,
    AlertCircle,
    Send,
    History as HistoryIcon
} from 'lucide-react';
import { StatCard, SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useNavigate } from 'react-router-dom';

const FinanceDashboard = () => {
    const navigate = useNavigate();
    const { applications, disburseLoan } = useLoans();
    const [processing, setProcessing] = useState(null);
    const [toast, setToast] = useState(null);

    // 1. SINGLE SOURCE OF TRUTH: All data derived from useLoans() context
    // 2. DASHBOARD SYNC: Dynamic calculations (Strictly sum of amount)
    const pendingPayouts = applications.filter(app => app.status === STATUSES.APPROVED);
    const activeAndPaid = applications.filter(app => [STATUSES.ACTIVE, STATUSES.PAID].includes(app.status));

    const pendingAmount = pendingPayouts.reduce((sum, app) => sum + Number(app.amount || 0), 0);
    const totalDisbursed = activeAndPaid.reduce((sum, app) => sum + Number(app.amount || 0), 0);

    // 3. REAL-TIME DATA SYNC: State automatically updates via LoanContext

    const stats = [
        {
            title: 'Pending Payout Amount',
            value: `R ${pendingAmount.toLocaleString()}`,
            icon: CreditCard,
            variant: 'warning',
            description: `${pendingPayouts.length} approved loans awaiting funds`
        },
        {
            title: 'Total Disbursed',
            value: `R ${totalDisbursed.toLocaleString()}`,
            icon: CheckCircle2,
            variant: 'success',
            description: 'Funds released to active accounts'
        },
        {
            title: 'Failed Payments',
            value: '0',
            icon: AlertCircle,
            variant: 'neutral',
            description: 'Communication errors detected'
        },
    ];

    const handleDisburse = async (id) => {
        try {
            setProcessing(id);
            // Simulate bank communication delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            disburseLoan(id);
            setToast({ message: 'Disbursement Successful: Loan is now ACTIVE', type: 'success' });
        } catch (error) {
            setToast({ message: error.message || 'Disbursement Failed', type: 'danger' });
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SectionHeader
                title="Finance Executive Dashboard"
                description="Monitor liquidity, manage approved disbursements, and oversee loan capitalization."
                actions={
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/finance/history')}
                            className="px-6 py-3 glass rounded-2xl text-sm font-bold text-slate-300 hover:text-white transition-all flex items-center gap-2"
                        >
                            <HistoryIcon className="w-4 h-4" />
                            Audit History
                        </button>
                        <button
                            onClick={() => navigate('/finance/payouts')}
                            className="btn-primary flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Launch Payout Queue
                        </button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50">
                <div className="p-8 border-b border-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/20">
                    <div>
                        <h2 className="text-xl font-display font-bold text-white tracking-tight">Priority Payout Queue</h2>
                        <p className="text-sm text-slate-500 mt-1 font-medium">Verify bank details before initiating disbursement.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate('/finance/payouts')}
                            className="px-6 py-3 glass rounded-2xl text-blue-400 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-lg"
                        >
                            View All Pending
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Employee Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Bank Beneficiary</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Capital Amount</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Approval Date</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Gatekeeper Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {pendingPayouts.length > 0 ? pendingPayouts.slice(0, 5).map((app) => (
                                <tr key={app.id} className="hover:bg-slate-900/40 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-slate-400">
                                                {app.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{app.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">ID: {app.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-slate-300">{app.bankDetails?.name || 'Bank Not Linked'}</p>
                                            <p className="text-[10px] font-mono text-slate-500 tracking-wider">
                                                {app.bankDetails?.account ? `****${app.bankDetails.account.slice(-4)}` : 'N/A'} • {app.bankDetails?.type || 'N/A'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-lg font-display font-black text-emerald-400">
                                            R {app.amount?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-sm font-medium text-slate-400">
                                            {new Date(app.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button
                                            disabled={processing === app.id}
                                            onClick={() => handleDisburse(app.id)}
                                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${processing === app.id
                                                    ? 'bg-slate-800 text-slate-500'
                                                    : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-500/20 active:scale-95'
                                                }`}
                                        >
                                            {processing === app.id ? 'Capitalizing...' : 'Disburse'}
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 text-slate-600">
                                            <div className="p-4 bg-slate-900/50 rounded-full">
                                                <ArrowDownCircle className="w-10 h-10 opacity-20" />
                                            </div>
                                            <p className="font-bold uppercase tracking-widest text-[10px]">No pending disbursements detected</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default FinanceDashboard;
