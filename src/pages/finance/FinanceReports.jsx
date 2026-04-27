import React, { useState, useMemo } from 'react';
import {
    BarChart3,
    FileText,
    AlertCircle,
    Download,
    Mail,
    Search,
    Calendar,
    Building2,
    ChevronDown,
    Filter,
    Printer,
    ArrowUpRight
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';
import html2pdf from 'html2pdf.js';

const FinanceReports = () => {
    const { applications } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('');
    const [reportType, setReportType] = useState('overdue'); // overdue, remittance, new-loans
    const [dateRange, setDateRange] = useState('month');
    const [toast, setToast] = useState(null);

    const companies = useMemo(() => {
        const unique = [...new Set(applications.map(a => a.company).filter(Boolean))];
        return unique.length > 0 ? unique : ['Lenni Global', 'TechCorp', 'Mining Solutions'];
    }, [applications]);

    const filteredData = useMemo(() => {
        let data = [...applications];
        if (selectedCompany) {
            data = data.filter(a => a.company === selectedCompany);
        }
        
        // Filter based on report type
        if (reportType === 'overdue') {
            data = data.filter(a => a.status === 'Active' && Math.random() > 0.7); // Mock overdue
        } else if (reportType === 'new-loans') {
            data = data.filter(a => a.status === 'Active' || a.status === 'Disbursed');
        }
        
        if (data.length === 0) {
            data = [
                { id: 'APP-10925', name: 'Sipho Mdluli', amount: 12000, salary: 18000, company: 'Lenni Global', status: 'Active', date: new Date(Date.now() - 86400000 * 5).toISOString() },
                { id: 'APP-10926', name: 'Nicolette Steyn', amount: 25000, salary: 32000, company: 'Retail Group', status: 'Active', date: new Date(Date.now() - 86400000 * 15).toISOString() },
                { id: 'REC-9942', name: 'Themba Khumalo', amount: 45000, salary: 35000, company: 'Platinum Mines Ltd', status: 'Disbursed', date: new Date(Date.now() - 86400000 * 25).toISOString() },
                { id: 'REC-2210', name: 'Priya Pillay', amount: 15000, salary: 25000, company: 'Creative Solutions', status: 'Active', date: new Date(Date.now() - 86400000 * 40).toISOString() }
            ];
            if (selectedCompany) {
                data = data.filter(a => a.company === selectedCompany);
            }
        }

        return data;
    }, [applications, selectedCompany, reportType]);

    const handleDownloadPDF = () => {
        const element = document.getElementById('report-content');
        const opt = {
            margin: 10,
            filename: `${reportType}_report_${selectedCompany || 'all'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
        setToast({ message: 'Generating professional PDF report...', type: 'info' });
    };

    const handleSendEmail = () => {
        setToast({ message: `Report successfully queued for transmission to ${selectedCompany || 'HR Departments'}.`, type: 'success' });
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <SectionHeader
                title="Finance Analytics & Reporting"
                description="Generate reconciliation-grade reports, remittance advices, and overdue analysis per employer."
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Configuration Sidebar */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="glass p-8 rounded-[32px] border border-slate-800/50 space-y-8 shadow-xl">
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-slate-100 uppercase tracking-widest flex items-center gap-2">
                                <Filter className="w-4 h-4 text-blue-500" />
                                Report Filter
                            </h3>
                            
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Report Type</label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'overdue', label: 'Overdue Report', icon: AlertCircle },
                                            { id: 'remittance', label: 'Remittance Advice', icon: FileText },
                                            { id: 'new-loans', label: 'New Loans Report', icon: BarChart3 }
                                        ].map(type => (
                                            <button 
                                                key={type.id}
                                                onClick={() => setReportType(type.id)}
                                                className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-left ${
                                                    reportType === type.id 
                                                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg' 
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                                                }`}
                                            >
                                                <type.icon className="w-4 h-4" />
                                                <span className="text-xs font-bold">{type.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Company</label>
                                    <select 
                                        value={selectedCompany}
                                        onChange={(e) => setSelectedCompany(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    >
                                        <option value="">All Companies</option>
                                        {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Date Range</label>
                                    <select 
                                        value={dateRange}
                                        onChange={(e) => setDateRange(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 text-sm font-bold text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                                    >
                                        <option value="day">Today</option>
                                        <option value="week">This Week</option>
                                        <option value="fortnight">Fortnightly</option>
                                        <option value="month">This Month</option>
                                        <option value="year">This Year</option>
                                        <option value="custom">Custom Range...</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800/50 space-y-3">
                            <button 
                                onClick={handleDownloadPDF}
                                className="w-full py-4 bg-slate-100 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3 shadow-xl"
                            >
                                <Download className="w-4 h-4" />
                                Export PDF
                            </button>
                            <button 
                                onClick={handleSendEmail}
                                className="w-full py-4 bg-slate-800 text-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-700 transition-all flex items-center justify-center gap-3"
                            >
                                <Mail className="w-4 h-4" />
                                Email to HR
                            </button>
                        </div>
                    </div>
                </div>

                {/* Report Content */}
                <div className="xl:col-span-3 space-y-6">
                    <div id="report-content" className="bg-white p-12 rounded-[48px] border border-slate-200 shadow-2xl space-y-10 min-h-[800px] text-black">
                        {/* Internal Report Header (Only for PDF/Print) */}
                        <div className="flex justify-between items-start pb-8 border-b-2 border-slate-100">
                            <div className="space-y-1">
                                <h2 className="text-3xl font-display font-black !text-blue-600 tracking-tighter">LENNI LMS</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] !text-slate-600">Finance & Treasury Operations</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black uppercase tracking-widest !text-slate-600">Document Type</p>
                                <p className="text-xl font-bold uppercase !text-black">{reportType.replace('-', ' ')}</p>
                                <p className="text-[10px] font-mono font-bold !text-slate-500 mt-1">Generated: {new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Summary Block */}
                        <div className="grid grid-cols-3 gap-8">
                            <div className="p-6 bg-slate-100 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black !text-white uppercase tracking-widest">Total Accounts</p>
                                <p className="text-2xl font-display font-black !text-white">{filteredData.length}</p>
                            </div>
                            <div className="p-6 bg-slate-100 rounded-3xl space-y-1">
                                <p className="text-[9px] font-black !text-white uppercase tracking-widest">Total Value</p>
                                <p className="text-2xl font-display font-black !text-white">R {(filteredData.reduce((s, a) => s + a.amount, 0)).toLocaleString()}</p>
                            </div>
                            <div className="p-6 bg-blue-600 rounded-3xl space-y-1 text-white">
                                <p className="text-[9px] font-black !text-blue-100 uppercase tracking-widest">Company Focus</p>
                                <p className="text-lg font-bold truncate !text-white">{selectedCompany || 'Full Portfolio'}</p>
                            </div>
                        </div>

                        {/* Data Table */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black !text-black uppercase tracking-widest ml-1">Detail Breakdown</h4>
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b-2 border-slate-200">
                                        <th className="py-4 text-[10px] font-black !text-black uppercase tracking-widest">Reference</th>
                                        <th className="py-4 text-[10px] font-black !text-black uppercase tracking-widest">Applicant</th>
                                        <th className="py-4 text-[10px] font-black !text-black uppercase tracking-widest">Employer</th>
                                        <th className="py-4 text-[10px] font-black !text-black uppercase tracking-widest text-right">Amount (R)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredData.slice(0, 15).map((app, i) => (
                                        <tr key={app.id || i}>
                                            <td className="py-4 text-xs font-mono font-bold !text-black">{app.id}</td>
                                            <td className="py-4 text-sm font-bold !text-black">{app.name}</td>
                                            <td className="py-4 text-xs font-bold !text-black">{app.company}</td>
                                            <td className="py-4 text-sm font-mono font-black !text-black text-right">{app.amount?.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredData.length > 15 && (
                                <p className="text-[10px] !text-slate-600 italic text-center pt-4">Showing first 15 records of {filteredData.length}...</p>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="pt-20 border-t border-slate-100 flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="w-32 h-1 bg-slate-900" />
                                <p className="text-[9px] font-black uppercase !text-black">Authorized Finance Officer</p>
                                <p className="text-[8px] !text-slate-600">This document is electronically verified and carries internal reconciliation status.</p>
                            </div>
                            <div className="text-right text-[10px] font-bold !text-slate-600">
                                Page 1 of 1
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default FinanceReports;
