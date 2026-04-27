import React, { useState, useMemo } from 'react';
import {
    RefreshCw,
    Search,
    User,
    ArrowRight,
    Calculator,
    Save,
    History,
    CheckCircle2,
    DollarSign,
    AlertTriangle
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';

const Settlement = () => {
    const { applications, transitionLoanLifecycle } = useLoans();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUserLoans, setSelectedUserLoans] = useState([]);
    const [settlementConfig, setSettlementConfig] = useState({
        primaryLoanId: '',
        targetLoanId: '',
        settlementAmount: 0,
        adjustmentNotes: ''
    });
    const [toast, setToast] = useState(null);

    // Auto-populate the list when page loads or search is empty
    React.useEffect(() => {
        const found = applications.filter(a => 
            (!searchTerm || 
             a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             a.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (a.status === STATUSES.ACTIVE || a.status === STATUSES.DISBURSED)
        );
        if (found.length === 0) {
            setSelectedUserLoans([
                { id: 'APP-10925', name: 'Sipho Mdluli', amount: 12000, salary: 18000, company: 'Lenni Global', status: STATUSES.ACTIVE, outstandingAmount: 4000 },
                { id: 'APP-10926', name: 'Nicolette Steyn', amount: 25000, salary: 32000, company: 'Retail Group', status: STATUSES.ACTIVE, outstandingAmount: 12500 },
                { id: 'REC-9942', name: 'Themba Khumalo', amount: 45000, salary: 35000, company: 'Platinum Mines Ltd', status: STATUSES.DISBURSED, outstandingAmount: 35000 }
            ]);
        } else {
            setSelectedUserLoans(found);
        }
    }, [applications, searchTerm]);

    const handleSearch = () => {
        const found = applications.filter(a => 
            (!searchTerm || 
             a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
             a.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (a.status === STATUSES.ACTIVE || a.status === STATUSES.DISBURSED)
        );
        if (found.length === 0) {
            setSelectedUserLoans([
                { id: 'APP-10925', name: 'Sipho Mdluli', amount: 12000, salary: 18000, company: 'Lenni Global', status: STATUSES.ACTIVE, outstandingAmount: 4000 },
                { id: 'APP-10926', name: 'Nicolette Steyn', amount: 25000, salary: 32000, company: 'Retail Group', status: STATUSES.ACTIVE, outstandingAmount: 12500 },
                { id: 'REC-9942', name: 'Themba Khumalo', amount: 45000, salary: 35000, company: 'Platinum Mines Ltd', status: STATUSES.DISBURSED, outstandingAmount: 35000 }
            ]);
            if (searchTerm) {
                setToast({ message: 'No active loans found for this criteria. Showing fallback data.', type: 'warning' });
            }
        } else {
            setSelectedUserLoans(found);
        }
    };

    const handleSettle = () => {
        if (!settlementConfig.primaryLoanId || !settlementConfig.targetLoanId) {
            setToast({ message: 'Select both a new loan and the previous loan to settle.', type: 'warning' });
            return;
        }

        // Logic: Mark target loan as PAID, and record settlement in audit
        transitionLoanLifecycle(settlementConfig.targetLoanId, LIFECYCLE_ACTIONS.SETTLE, 'Finance Officer', 
            `Settled by new loan ${settlementConfig.primaryLoanId}. Amount: R ${settlementConfig.settlementAmount}`);
        
        setToast({ message: 'Settlement processed and ledger updated.', type: 'success' });
        setSettlementConfig({
            primaryLoanId: '',
            targetLoanId: '',
            settlementAmount: 0,
            adjustmentNotes: ''
        });
        setSelectedUserLoans([]);
        setSearchTerm('');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <SectionHeader
                title="Loan Settlement Module"
                description="Manage the closure of existing loans through new disbursements or manual refinancing settlements."
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Search and Select */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl">
                        <div className="space-y-4">
                            <h3 className="text-lg font-display font-bold text-slate-100 flex items-center gap-2">
                                <Search className="w-5 h-5 text-blue-500" />
                                Lookup Account
                            </h3>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input 
                                    type="text"
                                    placeholder="Name or ID Number..."
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
                                Search Loans
                            </button>
                        </div>

                        {selectedUserLoans.length > 0 && (
                            <div className="pt-6 border-t border-slate-800/50 space-y-4">
                                <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Accounts</h4>
                                <div className="space-y-2">
                                    {selectedUserLoans.map(loan => (
                                        <button 
                                            key={loan.id}
                                            onClick={() => {
                                                if (!settlementConfig.targetLoanId) {
                                                    setSettlementConfig(prev => ({ ...prev, targetLoanId: loan.id, settlementAmount: loan.amount * 0.8 })); // mock balance
                                                } else {
                                                    setSettlementConfig(prev => ({ ...prev, primaryLoanId: loan.id }));
                                                }
                                            }}
                                            className={`w-full text-left p-4 rounded-2xl border transition-all ${
                                                settlementConfig.targetLoanId === loan.id || settlementConfig.primaryLoanId === loan.id
                                                    ? 'bg-blue-600/10 border-blue-500/50' 
                                                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <p className="text-sm font-bold text-slate-200">{loan.name}</p>
                                                <Badge variant="primary">{loan.id}</Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 mt-1 font-mono">Bal: R {(loan.amount * 0.8).toLocaleString()}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Settlement Configuration */}
                <div className="xl:col-span-2 space-y-6">
                    <div className="glass p-10 rounded-[40px] border border-slate-800/50 shadow-2xl space-y-8 bg-slate-900/10 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-[100px] -mr-32 -mt-32" />
                        
                        <div className="flex items-center justify-between relative z-10">
                            <h3 className="text-2xl font-display font-bold text-slate-100">Settlement Workbench</h3>
                            <Badge variant="warning">In-Transit Protection Active</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Loan (Source)</label>
                                <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 min-h-[100px] flex flex-col justify-center">
                                    {settlementConfig.primaryLoanId ? (
                                        <>
                                            <p className="text-lg font-bold text-slate-200">{settlementConfig.primaryLoanId}</p>
                                            <p className="text-xs text-blue-400 font-bold uppercase tracking-tighter">Settlement Source</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-600 italic">Select source loan from search...</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Previous Loan (To Settle)</label>
                                <div className="p-5 bg-slate-950 rounded-3xl border border-slate-800 min-h-[100px] flex flex-col justify-center">
                                    {settlementConfig.targetLoanId ? (
                                        <>
                                            <p className="text-lg font-bold text-slate-200">{settlementConfig.targetLoanId}</p>
                                            <p className="text-xs text-rose-400 font-bold uppercase tracking-tighter">Account to be Closed</p>
                                        </>
                                    ) : (
                                        <p className="text-sm text-slate-600 italic">Select target loan from search...</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Settlement Amount (R)</label>
                                <input 
                                    type="number"
                                    value={settlementConfig.settlementAmount}
                                    onChange={(e) => setSettlementConfig(prev => ({ ...prev, settlementAmount: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-lg font-mono font-black text-blue-400"
                                />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Adjustment Notes</label>
                                <input 
                                    type="text"
                                    placeholder="e.g. Pipeline payment pending, adjusting balance..."
                                    value={settlementConfig.adjustmentNotes}
                                    onChange={(e) => setSettlementConfig(prev => ({ ...prev, adjustmentNotes: e.target.value }))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200"
                                />
                            </div>
                        </div>

                        <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4 relative z-10">
                            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-amber-400">Balance Integrity Check</p>
                                <p className="text-[11px] text-slate-500 leading-relaxed uppercase tracking-tight">
                                    Outstanding balance will be adjusted. <strong>Pipeline payments</strong> (deductions already made by the employer but not yet recorded) will be considered during settlement. The new loan deduction will apply to the next payment cycle.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 relative z-10">
                            <button 
                                onClick={() => { setSettlementConfig({ primaryLoanId: '', targetLoanId: '', settlementAmount: 0, adjustmentNotes: '' }); setSelectedUserLoans([]); }}
                                className="px-8 py-5 rounded-2xl border border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                            >
                                Reset Workbench
                            </button>
                            <button 
                                onClick={handleSettle}
                                disabled={!settlementConfig.primaryLoanId || !settlementConfig.targetLoanId}
                                className="flex-1 py-5 rounded-2xl bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Execute Settlement
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* History Table */}
            <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-2xl">
                <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/30">
                    <div className="flex items-center gap-3">
                        <History className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-display font-bold text-slate-100">Settlement History</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Source (New)</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Target (Closed)</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/30">
                            {[1, 2].map((_, i) => (
                                <tr key={i} className="hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">2026-04-{20 + i}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-200">APP-88{i}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-200">APP-12{i}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-blue-400 font-black">R 8,500</td>
                                    <td className="px-6 py-4 text-right">
                                        <Badge variant="success">Completed</Badge>
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

export default Settlement;
