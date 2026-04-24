import React, { useState } from 'react';
import {
    Receipt,
    Search,
    Filter,
    Download,
    CheckCircle2,
    Clock,
    History as HistoryIcon,
    ArrowRight,
    ArrowLeftRight,
    Info,
    Calendar,
    Building2,
    DollarSign,
    MoreVertical
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import Modal from '../../components/ui/Modal';

const mockPayments = [
    { id: 'PAY-8821', employee: 'Sarah Jenkins', company: 'TechFlow SA', amount: 1500, deductedDate: '2026-04-15', status: 'PENDING', cycle: 'April 2026' },
    { id: 'PAY-8822', employee: 'Michael Chen', company: 'Retail Group', amount: 1200, deductedDate: '2026-04-15', status: 'PENDING', cycle: 'April 2026' },
    { id: 'PAY-8823', employee: 'David Smith', company: 'Finance Corp', amount: 2500, deductedDate: '2026-04-12', status: 'RECEIVED', cycle: 'April 2026' },
    { id: 'PAY-8824', employee: 'Emily Brown', company: 'Global Tech', amount: 800, deductedDate: '2026-04-10', status: 'PENDING', cycle: 'April 2026' },
    { id: 'PAY-8825', employee: 'John Doe', company: 'Logistics Ltd', amount: 1800, deductedDate: '2026-04-18', status: 'PENDING', cycle: 'April 2026' },
];

const PaymentManagement = () => {
    const [payments, setPayments] = useState(mockPayments);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([
        { id: 1, action: 'Marked as Received', user: 'Admin User', date: '2026-04-20 10:30 AM', note: 'Bulk upload verification' },
        { id: 2, action: 'Pending Status', user: 'System', date: '2026-04-15 08:00 AM', note: 'Auto-generated from payroll' }
    ]);
    const [toast, setToast] = useState(null);

    const handleUpdateStatus = (id, newStatus) => {
        setPayments(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        setHistory(prev => [{
            id: Date.now(),
            action: `Status updated to ${newStatus}`,
            user: 'Admin User',
            date: new Date().toLocaleString(),
            note: 'Manual status adjustment'
        }, ...prev]);
        setToast({ message: `Payment ${id} marked as ${newStatus}`, type: 'success' });
    };

    const handleApplyPrevious = (payment) => {
        setToast({ message: `Payment ${payment.id} applied to previous loan balance for ${payment.employee}`, type: 'success' });
        handleUpdateStatus(payment.id, 'APPLIED_PREVIOUS');
    };

    const handleCarryNext = (payment) => {
        setToast({ message: `Payment ${payment.id} carried forward to May 2026 cycle`, type: 'success' });
        handleUpdateStatus(payment.id, 'CARRIED_FORWARD');
    };

    const filteredPayments = payments.filter(p => 
        p.employee.toLowerCase().includes(searchTerm.toLowerCase()) || 
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SectionHeader
                    title="Payment Processing"
                    description="Manage installments deducted by employers but in-transit to the system."
                />
                <div className="flex gap-2">
                    <button 
                        onClick={() => setShowHistory(true)}
                        className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all"
                    >
                        <HistoryIcon className="w-4 h-4" />
                        History
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-sm font-bold text-white hover:bg-blue-500 transition-all">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass p-6 rounded-[32px] border-slate-800/50 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">In-Transit</p>
                        <p className="text-2xl font-display font-black text-slate-200">R 5,300</p>
                        <p className="text-[10px] text-amber-500 font-bold">4 Payments Pending</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-[32px] border-slate-800/50 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Received</p>
                        <p className="text-2xl font-display font-black text-slate-200">R 2,500</p>
                        <p className="text-[10px] text-emerald-500 font-bold">Today's Settlements</p>
                    </div>
                </div>
                <div className="glass p-6 rounded-[32px] border-slate-800/50 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                        <ArrowLeftRight className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Reconciliation</p>
                        <p className="text-2xl font-display font-black text-slate-200">98.2%</p>
                        <p className="text-[10px] text-blue-500 font-bold">Cycle Health</p>
                    </div>
                </div>
            </div>

            <div className="glass p-8 rounded-[40px] space-y-8">
                {/* Search & Tooltip */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 w-full max-w-md">
                        <Search className="w-5 h-5 text-slate-500 ml-2" />
                        <input
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200"
                            placeholder="Search by Employee or Pay ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-blue-600/5 border border-blue-500/20 rounded-2xl max-w-sm">
                        <Info className="w-5 h-5 text-blue-400 shrink-0" />
                        <p className="text-[10px] text-slate-400 leading-tight">
                            <strong className="text-blue-400">Payment Logic:</strong> These are installments deducted by payroll but not yet settled in the bank. Mark as received once bank statement matches.
                        </p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Transaction Details</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Amount</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                                <th className="px-8 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {filteredPayments.map((pay) => (
                                <tr key={pay.id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-blue-400">
                                                <Receipt className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200">{pay.employee}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-[10px] text-slate-500 font-mono">{pay.id}</span>
                                                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{pay.cycle}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <Building2 className="w-4 h-4 text-slate-600" />
                                            <span className="text-sm text-slate-400">{pay.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <p className="font-bold text-slate-200">R {pay.amount.toLocaleString()}</p>
                                        <div className="flex items-center justify-center gap-1 text-[9px] text-slate-500 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {pay.deductedDate}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <Badge variant={
                                            pay.status === 'RECEIVED' ? 'success' : 
                                            pay.status === 'PENDING' ? 'warning' : 'primary'
                                        }>
                                            {pay.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            {pay.status === 'PENDING' ? (
                                                <>
                                                    <button 
                                                        onClick={() => handleUpdateStatus(pay.id, 'RECEIVED')}
                                                        className="p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all"
                                                        title="Mark as Received"
                                                    >
                                                        <CheckCircle2 className="w-5 h-5" />
                                                    </button>
                                                    <div className="relative group/menu">
                                                        <button className="p-2 text-slate-500 hover:text-white glass rounded-xl">
                                                            <MoreVertical className="w-5 h-5" />
                                                        </button>
                                                        <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl shadow-2xl border border-slate-800 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50 overflow-hidden">
                                                            <button 
                                                                onClick={() => handleApplyPrevious(pay)}
                                                                className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-slate-900 hover:text-blue-400 border-b border-slate-800 uppercase tracking-widest"
                                                            >
                                                                Apply to Previous
                                                            </button>
                                                            <button 
                                                                onClick={() => handleCarryNext(pay)}
                                                                className="w-full text-left px-4 py-3 text-[10px] font-bold text-slate-300 hover:bg-slate-900 hover:text-blue-400 uppercase tracking-widest"
                                                            >
                                                                Carry to Next Cycle
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <button 
                                                    onClick={() => handleUpdateStatus(pay.id, 'PENDING')}
                                                    className="p-2 text-slate-500 hover:text-amber-500 rounded-xl transition-all"
                                                    title="Mark as Pending"
                                                >
                                                    <Clock className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* History Modal */}
            <Modal
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                title="Transaction Audit"
                maxWidth="max-w-2xl"
            >
                <div className="space-y-6">
                    {history.map((item) => (
                        <div key={item.id} className="flex gap-4 p-4 glass rounded-2xl border-slate-800/50">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center shrink-0">
                                <HistoryIcon className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <p className="font-bold text-slate-200">{item.action}</p>
                                    <span className="text-[10px] text-slate-500 uppercase font-black">{item.date}</span>
                                </div>
                                <p className="text-sm text-slate-400">{item.note}</p>
                                <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">BY: {item.user}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Modal>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default PaymentManagement;
