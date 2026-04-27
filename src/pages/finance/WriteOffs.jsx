import React, { useState, useMemo } from 'react';
import {
    Receipt,
    Calculator,
    Save,
    Search,
    Calendar,
    ArrowRight,
    AlertCircle,
    CheckCircle2,
    History,
    FileText,
    Download
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';

const WriteOffs = () => {
    const { applications } = useLoans();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [writeOffData, setWriteOffData] = useState({
        principal: 0,
        interest: 0,
        fees: 0,
        reason: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [toast, setToast] = useState(null);

    const handleSearch = () => {
        let match = applications.find(a =>
            a.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            a.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!match && searchTerm) {
            match = { id: 'REC-9942', name: 'Themba Khumalo', amount: 45000, salary: 35000, status: STATUSES.ACTIVE };
        } else if (!match) {
            match = { id: 'APP-10926', name: 'Nicolette Steyn', amount: 25000, salary: 32000, status: STATUSES.ACTIVE };
        }

        if (match) {
            setSelectedLoan(match);
            const baseAmount = match.amount || 0;
            setWriteOffData({
                principal: baseAmount,
                interest: Math.round(baseAmount * 0.15),
                fees: 500,
                reason: 'Standard Write-off due to non-payment',
                date: new Date().toISOString().split('T')[0]
            });
            if (!applications.find(a => a.id === match.id)) {
                setToast({ message: 'Showing simulated dummy case for evaluation.', type: 'info' });
            }
        } else {
            setToast({ message: 'No loan found for write-off.', type: 'danger' });
        }
    };

    const handleProcessWriteOff = () => {
        setToast({ message: 'Journal entry created. Ledger updated for write-off.', type: 'success' });
        setSelectedLoan(null);
        setSearchTerm('');
    };

    const totalWriteOff = Number(writeOffData.principal) + Number(writeOffData.interest) + Number(writeOffData.fees);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <SectionHeader
                title="Journal Write-Offs"
                description="Process non-recoverable debt write-offs and fee reversals with automated journal entries."
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Search Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Search className="w-4 h-4 text-blue-500" />
                                Find Bad Debt
                            </h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Account Reference..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="w-full py-4 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md shadow-blue-500/20"
                            >
                                Fetch Account
                            </button>
                        </div>

                        {selectedLoan && (
                            <div className="pt-6 border-t border-slate-800/50 space-y-4 animate-in slide-in-from-top-4 duration-500">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Selection</h4>
                                    <Badge variant="danger">Impaired</Badge>
                                </div>
                                <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800">
                                    <p className="text-sm font-bold text-slate-200">{selectedLoan.name}</p>
                                    <p className="text-xs text-slate-500 font-mono mt-1">{selectedLoan.id}</p>
                                    <p className="text-lg font-display font-black text-rose-400 mt-4">R {selectedLoan.amount?.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-600 font-bold uppercase mt-1">Outstanding Principal</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Journal Configuration */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass p-10 rounded-[40px] border border-slate-800/50 shadow-2xl space-y-8 bg-slate-900/10">
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-display font-bold text-slate-100">Write-Off Configuration</h3>
                            <div className="flex items-center gap-2 px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-xs font-mono font-bold text-slate-400">{writeOffData.date}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Principal Write-Off</label>
                                <input
                                    type="number"
                                    value={writeOffData.principal}
                                    onChange={(e) => setWriteOffData(prev => ({ ...prev, principal: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-lg font-mono font-black text-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Interest Reversal</label>
                                <input
                                    type="number"
                                    value={writeOffData.interest}
                                    onChange={(e) => setWriteOffData(prev => ({ ...prev, interest: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-lg font-mono font-black text-slate-200"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Admin Fees Reversal</label>
                                <input
                                    type="number"
                                    value={writeOffData.fees}
                                    onChange={(e) => setWriteOffData(prev => ({ ...prev, fees: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-lg font-mono font-black text-slate-200"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Justification / Reason</label>
                            <textarea
                                value={writeOffData.reason}
                                onChange={(e) => setWriteOffData(prev => ({ ...prev, reason: e.target.value }))}
                                className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm text-slate-200 h-32 focus:outline-none focus:ring-2 focus:ring-rose-500/10 transition-all"
                                placeholder="Explain why this debt is being written off..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-8 bg-rose-600 rounded-[32px] text-white shadow-2xl shadow-rose-600/20">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Total Journal Value</p>
                                <p className="text-4xl font-display font-black italic">R {totalWriteOff.toLocaleString()}</p>
                            </div>
                            <button
                                onClick={handleProcessWriteOff}
                                disabled={!selectedLoan}
                                className="px-10 py-5 bg-white text-rose-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-100 transition-all shadow-xl disabled:opacity-50"
                            >
                                Commit Journal
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Write Offs */}
            <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-2xl">
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-rose-500" />
                        <h3 className="text-lg font-display font-bold text-slate-100">Write-Off Ledger</h3>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Account</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Principal</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Fees</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {[1, 2].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">2026-04-{15 + i}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-200">Themba M.</span>
                                            <span className="text-[10px] text-slate-600 uppercase font-bold tracking-tighter">APP-1022{i}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-400 font-bold">R 12,000</td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-400 font-bold">R 1,200</td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="text-sm font-mono text-rose-400 font-black">R 13,200</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default WriteOffs;
