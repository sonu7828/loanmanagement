import React, { useState, useMemo } from 'react';
import { 
    BarChart3, 
    Download, 
    Mail, 
    Search, 
    Filter, 
    Calendar,
    ArrowRight,
    Loader2,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast, StatCard } from '../../components/ui/Shared';
import { cn } from '../../lib/utils';

const NewLoansReport = () => {
    const { applications } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('ALL');
    // Default to current week (Mon-Fri) dynamically
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday
    
    const [startDate, setStartDate] = useState(startOfWeek.toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(endOfWeek.toISOString().split('T')[0]);
    
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter companies
    const companies = useMemo(() => {
        const unique = [...new Set(applications.map(app => app.company))];
        return unique.sort();
    }, [applications]);

    // Filter for new loans (Disbursed in selected range)
    const newLoans = useMemo(() => {
        return applications.filter(app => {
            const matchesCompany = selectedCompany === 'ALL' || app.company === selectedCompany;
            // For demo, we consider anything disbursed as "New" in this report if matches period
            const isDisbursed = app.status === STATUSES.DISBURSED || app.status === STATUSES.ACTIVE;
            
            // Check date match (Weekly Range)
            const appDateObj = new Date(app.disbursedAt || app.date);
            const appTimestamp = appDateObj.getTime();
            
            const startTimestamp = startDate ? new Date(startDate).getTime() : 0;
            // Add 24 hours to include the entire end day
            const endTimestamp = endDate ? new Date(endDate).getTime() + 86400000 : Infinity;

            const matchesDate = appTimestamp >= startTimestamp && appTimestamp <= endTimestamp;

            return matchesCompany && isDisbursed && matchesDate;
        });
    }, [applications, selectedCompany, startDate, endDate]);

    const totalPayout = newLoans.reduce((sum, loan) => sum + loan.amount, 0);

    const stats = [
        { title: 'New Loans', value: newLoans.length.toString(), icon: TrendingUp, variant: 'primary' },
        { title: 'Total Principal', value: `R ${totalPayout.toLocaleString()}`, icon: BarChart3, variant: 'success' },
        { title: 'Avg. Loan Size', value: `R ${(totalPayout / (newLoans.length || 1)).toLocaleString()}`, icon: Briefcase, variant: 'warning' },
    ];

    const handleExport = (type) => {
        setIsExporting(true);
        setTimeout(() => {
            setIsExporting(false);
            setToast({ message: `New Loans Report ${type} exported!`, type: 'success' });
        }, 1200);
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <SectionHeader
                    title="New Loans Report"
                    description="Audit and monitor all newly disbursed loan agreements and principal payout values for the selected period."
                />
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <button 
                        onClick={() => handleExport('PDF')}
                        disabled={isExporting}
                        className="px-5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-blue-600 transition-all shadow-lg active:scale-95 disabled:opacity-50 flex items-center gap-2"
                        title="Download detailed disbursement ledger"
                    >
                        {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Filters */}
            <div className="glass p-4 sm:p-5 rounded-[24px] border border-slate-700 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                    <div className="flex-1 space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Filter by Company</label>
                        <select 
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                        >
                            <option value="ALL">All Partner Companies</option>
                            {companies.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="md:w-auto flex flex-col sm:flex-row gap-4">
                        <div className="space-y-1.5 flex-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Start Date (Week)</label>
                            <input 
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1.5 flex-1">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">End Date (Week)</label>
                            <input 
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Report Table */}
            <div className="glass rounded-[24px] overflow-hidden border border-slate-700 shadow-xl bg-slate-900/10">
                <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
                    <h3 className="text-xl font-display font-black text-slate-100">Disbursement Ledger</h3>
                    <Badge variant="primary" className="px-3 py-1 uppercase tracking-widest text-[9px]">{newLoans.length} Loans Total</Badge>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-700">
                            <tr>
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Employee</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Payout Date</th>
                                <th className="px-6 py-4 text-right">Principal</th>
                                <th className="px-6 py-4 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {newLoans.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Search className="w-12 h-12 text-slate-800" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No disbursements found for this period</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : newLoans.map((loan) => (
                                <tr key={loan.id} className="hover:bg-slate-900/60 transition-all group">
                                    <td className="px-6 py-3.5">
                                        <span className="text-xs font-mono font-black text-blue-500 bg-blue-500/5 px-2.5 py-1 rounded-lg border border-blue-500/20">{loan.id}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <p className="font-bold text-slate-200 text-sm">{loan.name}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">ID: {loan.idNumber || 'N/A'}</p>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="text-xs font-bold text-slate-400">{loan.company}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <p className="text-xs font-bold text-slate-300">{loan.disbursedAt ? new Date(loan.disbursedAt).toLocaleDateString() : new Date(loan.date).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <p className="text-sm font-black text-slate-200">R {loan.amount?.toLocaleString()}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <Badge variant="success" className="px-2.5 py-0.5 uppercase text-[8px] tracking-widest">{loan.status}</Badge>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-slate-900/50">
                            <tr className="border-t border-slate-700">
                                <td colSpan="4" className="px-6 py-4 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">Grand Total Payout</td>
                                <td className="px-6 py-4 text-right text-2xl font-black text-white">R {totalPayout.toLocaleString()}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default NewLoansReport;
