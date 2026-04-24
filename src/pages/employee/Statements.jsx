import React, { useState } from 'react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { Receipt, Calendar, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { cn } from '../../lib/utils';

const Statements = () => {
    const { applications } = useLoans();
    const activeLoan = applications.find(app => app.status === STATUSES.DISBURSED);
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState(null);

    const mockTransactions = [
        { id: 'TX-9021', date: '2024-03-31', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-8842', date: '2024-02-28', description: 'Salary Deduction Repayment', amount: 1250, type: 'repayment' },
        { id: 'TX-1029', date: '2024-01-31', description: 'Initial Loan Disbursement', amount: 5000, type: 'disbursement' },
    ];

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            setToast({ type: 'info', message: 'Preparing statement PDF...' });
            
            const { generateStatementPDF } = await import('../../utils/statementPdfGenerator');
            const { useAuth } = await import('../../context/AuthContext');
            // Assuming we don't have direct access to user here, but we can pass null or a dummy for now
            // The template handles missing user data gracefully
            
            await generateStatementPDF(activeLoan, null, mockTransactions);
            
            setToast({ type: 'success', message: 'Statement PDF downloaded successfully.' });
        } catch (error) {
            console.error('PDF Export Error:', error);
            setToast({
                type: 'danger',
                message: `Failed to generate PDF: ${error?.message || 'Check console'}.`,
            });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <SectionHeader
                title="Repayment Statements"
                description="View your active loan balance and transaction history."
            />

            {!activeLoan ? (
                <div className="bg-white p-6 sm:p-12 rounded-[40px] border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center space-y-4 min-w-0">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <Receipt className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-display font-black text-black">No Active Statements</h3>
                    <p className="text-slate-600 max-w-md font-medium">Statements are only generated once your loan has been approved and disbursed.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
                            <p className="text-[10px] text-black uppercase font-black tracking-[0.2em] mb-2">Total Balance</p>
                            <p className="text-3xl lg:text-4xl font-display font-black text-black tracking-tight">R 2,500.00</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-slate-200"></div>
                            <p className="text-[10px] text-black uppercase font-black tracking-[0.2em] mb-2">Next Payment</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-display font-black text-black tracking-tight">R 1,250.00</p>
                            </div>
                            <p className="text-[10px] text-emerald-800 mt-2 font-black uppercase tracking-widest bg-emerald-50 w-fit px-2 py-0.5 rounded-md border border-emerald-300">DUE: 30 APR 2024</p>
                        </div>
                        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                            <p className="text-[10px] text-black uppercase font-black tracking-[0.2em] mb-2">Total Repaid</p>
                            <p className="text-3xl font-display font-black text-emerald-700 tracking-tight">R 2,500.00</p>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div className="bg-white rounded-[40px] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/40">
                        <div className="p-6 md:p-10 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-slate-50/50">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-display font-black text-black tracking-tight">Transaction History</h2>
                                <p className="text-xs font-bold text-black">A detailed record of your loan activity.</p>
                            </div>
                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="flex items-center gap-2 px-8 py-4 bg-black border border-black rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed shadow-xl shadow-black/20"
                            >
                                <Download className="w-4 h-4 text-white" />
                                {isDownloading ? (
                                    'Generating PDF...'
                                ) : (
                                    <span className="text-white">
                                        <span className="hidden sm:inline">Download PDF Statement</span>
                                        <span className="sm:hidden">Download</span>
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:block">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 text-[10px] font-black text-black uppercase tracking-[0.2em] border-b border-slate-100">
                                        <th className="px-10 py-5">Transaction Details</th>
                                        <th className="px-10 py-5 text-center">Status</th>
                                        <th className="px-10 py-5 text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockTransactions.map((tx, i) => (
                                        <tr key={tx.id} className="hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-10 py-7">
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${tx.type === 'repayment' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                                        {tx.type === 'repayment' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-black text-base tracking-tight">{tx.description}</p>
                                                        <div className="flex items-center gap-2 text-[10px] text-black font-black uppercase mt-1.5 tracking-wider">
                                                            <Calendar className="w-3.5 h-3.5 text-black" />
                                                            {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                                            <span className="mx-2 opacity-50 text-black">|</span>
                                                            <span className="font-mono text-black">{tx.id}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-7">
                                                <Badge variant="success">Completed</Badge>
                                            </td>
                                            <td className={cn(
                                                "px-10 py-7 text-right font-display font-black text-xl tracking-tight",
                                                tx.type === 'repayment' ? "text-emerald-700" : "text-blue-700"
                                            )}>
                                                {tx.type === 'repayment' ? '-' : '+'} R {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-slate-100">
                            {mockTransactions.map((tx) => (
                                <div key={tx.id} className="p-6 space-y-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${tx.type === 'repayment' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-blue-50 border-blue-200 text-blue-600'}`}>
                                                {tx.type === 'repayment' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-black">{tx.description}</p>
                                                <p className="text-[10px] text-black font-mono font-black uppercase mt-0.5 tracking-wider">{tx.id}</p>
                                            </div>
                                        </div>
                                        <Badge variant="success">Completed</Badge>
                                    </div>
                                    <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-black uppercase tracking-widest">
                                            <Calendar className="w-3.5 h-3.5 text-black" />
                                            {new Date(tx.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                                        </div>
                                        <p className={`font-display font-black text-xl ${tx.type === 'repayment' ? "text-emerald-700" : "text-blue-700"}`}>
                                            {tx.type === 'repayment' ? '-' : '+'} R {tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Statements;
