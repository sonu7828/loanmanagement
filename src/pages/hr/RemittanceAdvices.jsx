import React, { useState, useMemo } from 'react';
import { 
    FileText, 
    Download, 
    Mail, 
    Search, 
    Filter, 
    Building2, 
    Calendar,
    ArrowDownToLine,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { cn } from '../../lib/utils';

const RemittanceAdvices = () => {
    const { applications } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('ALL');
    const [frequency, setFrequency] = useState('Monthly');
    const [dateRange, setDateRange] = useState('2024-04');
    const [isExporting, setIsExporting] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter companies
    const companies = useMemo(() => {
        const unique = [...new Set(applications.map(app => app.company))];
        return unique.sort();
    }, [applications]);

    // Mock filtering for demo - showing disbursed loans that need deductions
    const filteredEmployees = useMemo(() => {
        return applications.filter(app => {
            const matchesCompany = selectedCompany === 'ALL' || app.company === selectedCompany;
            const isDisbursed = app.status === STATUSES.DISBURSED || app.status === STATUSES.ACTIVE;
            return matchesCompany && isDisbursed;
        });
    }, [applications, selectedCompany]);

    const totalDeductions = filteredEmployees.reduce((sum, emp) => {
        // Mock deduction: 10% of amount / 12 as a sample
        const deduction = (emp.amount / 12);
        return sum + deduction;
    }, 0);

    const handleSendEmail = async () => {
        setIsSending(true);
        const success = await mockSendEmail(
            selectedCompany === 'ALL' ? 'Payroll Departments' : selectedCompany,
            `Remittance Advice - ${dateRange}`
        );
        if (success) {
            setIsSending(false);
            setToast({ message: `Remittance Advice sent to ${selectedCompany === 'ALL' ? 'all companies' : selectedCompany} payroll department.`, type: 'success' });
        }
    };

    const handleExport = async (type) => {
        setIsExporting(true);
        const success = await mockExport(`Remittance_${selectedCompany}_${dateRange}`, type);
        if (success) {
            setIsExporting(false);
            setToast({ message: `Remittance Advice ${type} generated successfully!`, type: 'success' });
        }
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <SectionHeader
                    title="Remittance Advices"
                    description="Consolidate and dispatch payroll deduction schedules to corporate partners for upcoming salary processing."
                />
                <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-slate-700 shadow-sm mb-4 sm:mb-6">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">Payroll Sync Active</span>
                </div>
            </div>

            {/* Controls */}
            <div className="glass p-5 lg:p-6 rounded-[24px] border border-slate-700 shadow-xl space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Corporate Partner</label>
                        <div className="relative">
                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select 
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none"
                            >
                                <option value="ALL">All Companies</option>
                                {companies.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Frequency</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <select 
                                value={frequency}
                                onChange={(e) => setFrequency(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all cursor-pointer appearance-none"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Fortnightly">Fortnightly</option>
                                <option value="Weekly">Weekly</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Period</label>
                        <input 
                            type="month"
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-5 py-3 text-sm text-slate-200 font-bold focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>

                    <div className="flex items-end gap-3">
                        <button 
                            onClick={handleSendEmail}
                            disabled={isSending}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                        >
                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                            Send Email
                        </button>
                        <button 
                            onClick={() => handleExport('PDF')}
                            disabled={isExporting}
                            className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-500 transition-all disabled:opacity-50"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Banner */}
            <div className="p-5 sm:p-6 lg:p-8 bg-blue-600 rounded-[24px] shadow-2xl shadow-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                        <FileText className="w-7 h-7 lg:w-8 lg:h-8" />
                    </div>
                    <div className="space-y-0.5">
                        <h3 className="text-2xl lg:text-3xl font-display font-black text-white tracking-tight">R {totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                        <p className="text-[10px] font-black text-blue-100 uppercase tracking-[0.2em]">Total Expected Deductions for Period</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 relative z-10 w-full md:w-auto">
                    <div className="flex-1 md:flex-none px-5 py-2.5 bg-white/10 rounded-xl border border-white/20 text-center">
                        <p className="text-[9px] font-black text-blue-100 uppercase tracking-widest mb-0.5">Employees</p>
                        <p className="text-lg font-black text-white">{filteredEmployees.length}</p>
                    </div>
                    <div className="flex-1 md:flex-none px-5 py-2.5 bg-white text-blue-600 rounded-xl text-center shadow-xl">
                        <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest mb-0.5">Status</p>
                        <p className="text-lg font-black">Draft</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-[24px] overflow-hidden border border-slate-700 shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-900/50 border-b border-slate-700 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-4">Employee Details</th>
                                <th className="px-6 py-4">Company</th>
                                <th className="px-6 py-4">Loan Reference</th>
                                <th className="px-6 py-4 text-right">Deduction</th>
                                <th className="px-6 py-4 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                            {filteredEmployees.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Search className="w-12 h-12 text-slate-800" />
                                            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No records found for selection</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredEmployees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-slate-900/40 transition-all group">
                                    <td className="px-6 py-3.5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                                                {emp.name[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 text-sm leading-tight">{emp.name}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{emp.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="text-xs font-bold text-slate-400">{emp.company}</span>
                                    </td>
                                    <td className="px-6 py-3.5">
                                        <span className="text-xs font-mono font-bold text-blue-500">{emp.id}</span>
                                    </td>
                                    <td className="px-6 py-3.5 text-right">
                                        <p className="text-sm font-black text-slate-200">R {(emp.amount / 12).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </td>
                                    <td className="px-6 py-3.5 text-center">
                                        <button className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 hover:text-blue-500 transition-all active:scale-95">
                                            <ArrowDownToLine className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RemittanceAdvices;
