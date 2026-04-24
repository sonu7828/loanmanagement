import React, { useState, useMemo } from 'react';
import { 
    AlertCircle, 
    Download, 
    Search, 
    Filter, 
    MessageSquare,
    AlertTriangle,
    Save,
    X,
    CheckCircle2,
    Calendar,
    ChevronRight,
    Loader2
} from 'lucide-react';
import { useLoans, STATUSES, RECOVERY_STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast, Modal } from '../../components/ui/Shared';
import { cn } from '../../lib/utils';

const OverdueReport = () => {
    const { applications, updateStatus } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [reasonNote, setReasonNote] = useState('');
    const [statusUpdate, setStatusUpdate] = useState('');
    const [toast, setToast] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const companies = useMemo(() => {
        const unique = [...new Set(applications.map(app => app.company))];
        return unique.sort();
    }, [applications]);

    // Mock overdue logic - loans in arrears or specific recovery statuses
    const overdueLoans = useMemo(() => {
        return applications.filter(app => {
            const matchesCompany = selectedCompany === 'ALL' || app.company === selectedCompany;
            const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 app.id.toLowerCase().includes(searchTerm.toLowerCase());
            
            // Overdue criteria: Status is active/disbursed but recovery status is not healthy
            const isOverdue = app.recoveryStatus === RECOVERY_STATUSES.IN_ARREARS || 
                             app.recoveryStatus === RECOVERY_STATUSES.PTP_FAILED ||
                             app.recoveryStatus === RECOVERY_STATUSES.LEGAL;
            
            return matchesCompany && matchesSearch && isOverdue;
        });
    }, [applications, selectedCompany, searchTerm]);

    const handleAddNote = (loan) => {
        setSelectedLoan(loan);
        setReasonNote(loan.overdueNote || '');
        setStatusUpdate(loan.recoveryStatus || '');
        setShowNoteModal(true);
    };

    const saveNote = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Update logic here - we'll simulate it by updating the application state if possible
            // In a real app, this would be a specific API call
            // transitionLoanLifecycle or similar
            
            setToast({ message: `Note saved for ${selectedLoan.id}`, type: 'success' });
            setShowNoteModal(false);
            setIsLoading(false);
        }, 800);
    };

    const reasons = [
        'Salary issue',
        'Employee left',
        'Payroll delay',
        'Bank issue',
        'Other'
    ];

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <SectionHeader
                    title="Overdue Report"
                    description="Identify and manage arrears in loan repayments. Log resolution reasons and track recovery progress for overdue accounts."
                />
                <button 
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-blue-600 transition-all shadow-lg active:scale-95 mb-4 sm:mb-6"
                >
                    <Download className="w-4 h-4" />
                    Download CSV
                </button>
            </div>

            {/* Quick Stats Summary */}
            <div className="p-5 sm:p-6 lg:p-8 bg-slate-900 rounded-[24px] border border-slate-800 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full -mr-48 -mt-48 blur-3xl animate-pulse" />
                <div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-600/10">
                            <AlertTriangle className="w-7 h-7 lg:w-8 lg:h-8" />
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="text-3xl lg:text-4xl font-display font-black text-slate-100 tracking-tight">{overdueLoans.length}</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Total Overdue Accounts</p>
                        </div>
                    </div>
                    <div className="h-px w-full md:h-16 md:w-px bg-slate-800" />
                    <div className="grid grid-cols-2 gap-6 lg:gap-8 w-full md:w-auto">
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Total Exposure</p>
                            <p className="text-xl lg:text-2xl font-black text-red-400">R {overdueLoans.reduce((sum, loan) => sum + (loan.outstandingAmount || 0), 0).toLocaleString()}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">At Risk Percentage</p>
                            <p className="text-xl lg:text-2xl font-black text-amber-500">{( (overdueLoans.length / applications.length) * 100 ).toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                <div className="flex-1 space-y-1.5">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            type="text"
                            placeholder="Search employee or loan reference..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input-field pl-12 py-3 text-sm w-full"
                        />
                    </div>
                </div>
                <div className="lg:w-72 space-y-1.5">
                    <select 
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none"
                    >
                        <option value="ALL">All Partner Companies</option>
                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-[24px] overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Due Date</th>
                                <th className="px-6 py-4 text-right">Expected</th>
                                <th className="px-6 py-4 text-right">Outstanding</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {overdueLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <CheckCircle2 className="w-12 h-12 text-emerald-500/20" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No overdue loans found. Great job!</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : overdueLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-900/60 transition-all group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/10 flex items-center justify-center font-bold text-red-500 text-lg">
                                                {loan.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 text-sm leading-tight">{loan.name}</p>
                                                <p className="text-[10px] text-blue-500 font-mono font-bold mt-0.5 uppercase tracking-widest">{loan.id} • {loan.company}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                            <Calendar className="w-3.5 h-3.5 text-slate-600" />
                                            {loan.nextDueDate ? new Date(loan.nextDueDate).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5 text-right font-bold text-slate-200 text-sm">
                                        R {(loan.amount / 12).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3.5 text-right font-black text-red-400 text-sm">
                                        R {loan.outstandingAmount?.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Badge variant="danger" className="px-2.5 py-0.5 uppercase text-[8px] tracking-[0.2em]">{loan.recoveryStatus}</Badge>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <button 
                                            onClick={() => handleAddNote(loan)}
                                            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest group-hover:border-slate-600"
                                        >
                                            <MessageSquare className="w-3.5 h-3.5" />
                                            Add Note
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Note Modal */}
            <Modal
                isOpen={showNoteModal}
                onClose={() => setShowNoteModal(false)}
                title="Repayment Resolution"
                maxWidth="max-w-lg"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button 
                            onClick={() => setShowNoteModal(false)}
                            className="flex-1 py-4 bg-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-all"
                        >
                            Dismiss
                        </button>
                        <button 
                            onClick={saveNote}
                            disabled={isLoading}
                            className="flex-1 py-4 bg-blue-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Commit Changes
                        </button>
                    </div>
                }
            >
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500 shadow-inner">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xl font-display font-black text-slate-200">{selectedLoan?.name}</p>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Ref: {selectedLoan?.id}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Resolution Reason</label>
                        <div className="grid grid-cols-2 gap-3">
                            {reasons.map((r) => (
                                <button
                                    key={r}
                                    onClick={() => setReasonNote(r)}
                                    className={cn(
                                        "px-4 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all text-left",
                                        reasonNote === r 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20" 
                                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-600"
                                    )}
                                >
                                    {r}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Detailed Remarks</label>
                        <textarea 
                            value={reasonNote && !reasons.includes(reasonNote) ? reasonNote : ''}
                            onChange={(e) => setReasonNote(e.target.value)}
                            placeholder="Enter specific details about the repayment delay..."
                            className="w-full bg-slate-950 border border-slate-800 rounded-3xl p-6 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all min-h-[120px] placeholder:text-slate-700"
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default OverdueReport;
