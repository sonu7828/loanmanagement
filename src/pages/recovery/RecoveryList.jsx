import React, { useMemo, useState } from 'react';
import { 
  Users, 
  AlertTriangle, 
  PhoneCall, 
  Calendar, 
  DollarSign, 
  Search, 
  Filter,
  MessageCircle,
  Clock,
  ChevronRight,
  User,
  ExternalLink,
  FilterX,
  Activity,
  CheckCircle2,
  XCircle,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, RECOVERY_STATUSES, LIFECYCLE_STATUSES } from '../../context/LoanContext';
import { useAuth, ROLES } from '../../context/AuthContext';
import { SectionHeader, Badge, StatCard, Toast, Modal } from '../../components/ui/Shared';
import { useLocation } from 'react-router-dom';
import { Phone, DollarSign as Money, CalendarRange, MessageSquare, History } from 'lucide-react';

const RecoveryList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { applications, bulkAssignAgents, recordRecoveryPayment, logRecoveryInteraction, updatePTP } = useLoans();
    const { user, role } = useAuth();
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [dpdFilter, setDpdFilter] = useState('all');
    const [selectedCases, setSelectedCases] = useState([]);
    const [toast, setToast] = useState(null);
    const [showBulkAssign, setShowBulkAssign] = useState(false);

    // Modals state
    const [activeActionCase, setActiveActionCase] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showInteractionModal, setShowInteractionModal] = useState(false);
    const [showPtpModal, setShowPtpModal] = useState(false);

    // Form states
    const [paymentForm, setPaymentForm] = useState({ amount: '', ref: '' });
    const [interactionForm, setInteractionForm] = useState({ type: 'Call', outcome: 'Answered', notes: '' });
    const [ptpForm, setPtpForm] = useState({ date: '', amount: '' });

    // Handle dashboard filters
    React.useEffect(() => {
        if (location.state?.filter) {
            const f = location.state.filter;
            if (f === 'Arrears') setFilterStatus('In Arrears');
            else if (f === 'low') setDpdFilter('low');
            else if (f === 'mid') setDpdFilter('mid');
            else if (f === 'high') setDpdFilter('high');
        }
    }, [location.state]);

    const AGENTS = ["Sarah Collections", "John Recovery", "Mike Debtors"];

    const [dateRange, setDateRange] = useState('month');

    // Filter applications based on permissions and recovery status
    const recoveryCases = useMemo(() => {
        const allRecoveryCases = (applications || []).filter(app => {
            // Role-based visibility
            const isAssignedToMe = app.assignedAgent === user?.name;
            const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;

            const hasArrears = app.installments?.some(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
            const isInRecovery = app.recoveryStatus && 
                               app.recoveryStatus !== RECOVERY_STATUSES.RECOVERED && 
                               app.recoveryStatus !== RECOVERY_STATUSES.HEALTHY;

            const isRecoveryLifecycle =
                app.lifecycleStatus === LIFECYCLE_STATUSES.IN_ARREARS ||
                app.lifecycleStatus === LIFECYCLE_STATUSES.RECOVERY;

            if (!(isRecoveryLifecycle || (hasArrears && isInRecovery))) return false;
            if (isManager) return true;
            return isAssignedToMe;
        }).map(app => {
            const overdueInstallments = app.installments?.filter(i => 
                i.status !== 'PAID' && new Date(i.dueDate) < new Date()
            ) || [];
            
            const overdueAmount = overdueInstallments.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
            const outstanding = app.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
            
            let dpd = 0;
            if (overdueInstallments.length > 0) {
                const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
                dpd = Math.floor((new Date() - earliest) / (1000 * 60 * 60 * 24));
            }

            // Mock moved date if not present
            const movedDate = app.movedDate || new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString();

            return { ...app, overdueAmount, outstanding, dpd, movedDate };
        });
        
        const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;
        if (isManager || allRecoveryCases.length > 0) return allRecoveryCases;

        // Demo fallback
        return (applications || []).filter(app => {
            const hasArrears = app.installments?.some(i => i.status !== 'PAID' && new Date(i.dueDate) < new Date());
            const isRecoveryLifecycle =
                app.lifecycleStatus === LIFECYCLE_STATUSES.IN_ARREARS ||
                app.lifecycleStatus === LIFECYCLE_STATUSES.RECOVERY;
            return isRecoveryLifecycle || hasArrears;
        }).map(app => {
            const overdueInstallments = app.installments?.filter(i => 
                i.status !== 'PAID' && new Date(i.dueDate) < new Date()
            ) || [];
            const overdueAmount = overdueInstallments.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0);
            const outstanding = app.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
            let dpd = 0;
            if (overdueInstallments.length > 0) {
                const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
                dpd = Math.floor((new Date() - earliest) / (1000 * 60 * 60 * 24));
            }
            const movedDate = app.movedDate || new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString();
            return { ...app, overdueAmount, outstanding, dpd, movedDate };
        });
    }, [applications, user, role]);

    const isDemoFallback =
        role === ROLES.RECOVERY &&
        recoveryCases.length > 0 &&
        !recoveryCases.some((c) => c.assignedAgent === user?.name);

    const filteredCases = useMemo(() => {
        return recoveryCases.filter(c => {
            const matchesSearch = (c.name || '').toLowerCase().includes(search.toLowerCase()) || 
                                 (c.id || '').toLowerCase().includes(search.toLowerCase());
            const matchesStatus = filterStatus === 'All' || c.recoveryStatus === filterStatus;
            const matchesDpd =
                dpdFilter === 'all' ||
                (dpdFilter === 'low' && c.dpd > 0 && c.dpd <= 30) ||
                (dpdFilter === 'mid' && c.dpd > 30 && c.dpd <= 60) ||
                (dpdFilter === 'high' && c.dpd > 60);
            return matchesSearch && matchesStatus && matchesDpd;
        });
    }, [recoveryCases, search, filterStatus, dpdFilter]);

    const stats = useMemo(() => {
        const totalArrears = recoveryCases.reduce((acc, curr) => acc + curr.overdueAmount, 0);
        const highRisk = recoveryCases.filter(c => c.dpd > 30).length;
        return [
            { title: 'Total Portfolio Arrears', value: `R ${totalArrears.toLocaleString()}`, icon: DollarSign, variant: 'danger' },
            { title: 'Active Collections', value: recoveryCases.length.toString(), icon: Users, variant: 'primary' },
            { title: highRisk > 0 ? 'High Risk Items' : 'Accounts Healthy', value: highRisk.toString(), icon: AlertTriangle, variant: highRisk > 0 ? 'warning' : 'success' },
        ];
    }, [recoveryCases]);

    const toggleSelectAll = () => {
        if (selectedCases.length === filteredCases.length) {
            setSelectedCases([]);
        } else {
            setSelectedCases(filteredCases.map(c => c.id));
        }
    };

    const toggleSelect = (id) => {
        setSelectedCases(prev => 
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkAssign = (agent) => {
        bulkAssignAgents(selectedCases, agent);
        setToast({ message: `Successfully assigned ${selectedCases.length} cases to ${agent}`, type: 'success' });
        setSelectedCases([]);
        setShowBulkAssign(false);
    };

    const isManager = role === ROLES.ADMIN || role === ROLES.MANAGEMENT;

    return (
        <>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <SectionHeader 
                title={role === ROLES.RECOVERY ? "My Recovery Portfolio" : "Recoveries Case Management"} 
                description={role === ROLES.RECOVERY ? "Focus on your assigned accounts and record collection attempts." : "Monitor delinquency aging, manage PTP cycles, and record collection outcomes."}
            />
            {isDemoFallback && (
                <div className="glass p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-blue-400 text-sm font-medium">
                    Demo visibility enabled: showing recoveries outside your assignment so you can test actions.
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="glass rounded-[40px] overflow-hidden border border-slate-800/50 shadow-2xl relative shadow-blue-900/10">
                <div className="p-8 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-slate-900/10 no-print">
                    <div className="relative group flex-1 max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                        <input 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-field pl-12 py-3.5 text-sm bg-slate-900" 
                            placeholder="Search by Debtor Name or Case ID..." 
                        />
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer w-full sm:w-auto"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="quarter">This Quarter</option>
                            <option value="year">FY 2026</option>
                        </select>
                        <select
                            value={dpdFilter}
                            onChange={(e) => setDpdFilter(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer w-full sm:w-auto"
                        >
                            <option value="all">All DPD Bands</option>
                            <option value="low">DPD 1-30</option>
                            <option value="mid">DPD 31-60</option>
                            <option value="high">DPD 60+</option>
                        </select>
                        <select 
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-3.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer w-full sm:w-auto"
                        >
                            <option value="All">All Statuses</option>
                            {Object.values(RECOVERY_STATUSES).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {isManager && selectedCases.length > 0 && (
                            <button
                                onClick={() => setShowBulkAssign(true)}
                                className="px-6 py-3.5 rounded-2xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-all shadow-lg"
                            >
                                Assign {selectedCases.length}
                            </button>
                        )}
                    </div>
                </div>

                <div className="overflow-x-auto text-[13px]">
                    <table className="w-full text-left font-medium">
                        <thead>
                            <tr className="bg-slate-900 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800/50">
                                {isManager && (
                                    <th className="px-8 py-5 w-10">
                                        <input 
                                            type="checkbox" 
                                            checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                                            onChange={toggleSelectAll}
                                            className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                        />
                                    </th>
                                )}
                                <th className="px-8 py-5">Case & Borrower</th>
                                <th className="px-8 py-5">Outstanding</th>
                                <th className="px-8 py-5 text-center">DPD</th>
                                <th className="px-8 py-5">Moved Date</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {filteredCases.map((caseItem) => (
                                <tr key={caseItem.id} className={`hover:bg-slate-800/20 transition-all group ${selectedCases.includes(caseItem.id) ? 'bg-blue-600/5' : ''}`}>
                                    {isManager && (
                                        <td className="px-8 py-6">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedCases.includes(caseItem.id)}
                                                onChange={() => toggleSelect(caseItem.id)}
                                                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
                                            />
                                        </td>
                                    )}
                                    <td className="px-8 py-6">
                                        <div 
                                            className="flex items-center gap-4 cursor-pointer"
                                            onClick={() => navigate(`/recovery/case/${caseItem.id}`)}
                                        >
                                            <div className="w-10 h-10 rounded-[14px] bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:border-blue-500/50 transition-all">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                                                    {caseItem.name || 'Anonymous Debtor'}
                                                </p>
                                                <p className="text-[10px] text-slate-500 uppercase font-mono font-bold tracking-widest mt-0.5">
                                                    {caseItem.id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="space-y-1">
                                            <p className="font-bold text-slate-200 text-sm">R {caseItem.outstanding.toLocaleString()}</p>
                                            <p className="text-[10px] text-red-500 font-black uppercase tracking-tighter">
                                                Arrears: R {caseItem.overdueAmount.toLocaleString()}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <span className={`inline-flex items-center justify-center min-w-[5rem] whitespace-nowrap text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                                            caseItem.dpd > 60 ? "border-red-500/30 bg-red-500/10 text-red-500" : 
                                            caseItem.dpd > 30 ? "border-amber-500/30 bg-amber-500/10 text-amber-500" : "border-blue-500/30 bg-blue-500/10 text-blue-500"
                                        }`}>
                                            {caseItem.dpd} DPD
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-300">{new Date(caseItem.movedDate).toLocaleDateString()}</p>
                                            <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">To Recovery</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-2 max-w-[14rem]">
                                            <Badge variant={
                                                caseItem.recoveryStatus === RECOVERY_STATUSES.LEGAL ? 'danger' : 
                                                caseItem.recoveryStatus === RECOVERY_STATUSES.IN_ARREARS ? 'warning' : 'primary'
                                            }>
                                                {caseItem.recoveryStatus || 'Active Collection'}
                                            </Badge>
                                            {caseItem.dpd >= 90 && <Badge variant="danger">High Risk</Badge>}
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase">
                                                <Activity className="w-3 h-3" />
                                                {caseItem.assignedAgent || 'Unassigned'}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                onClick={() => { setActiveActionCase(caseItem); setShowInteractionModal(true); }}
                                                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-500 hover:border-blue-500/50 transition-all"
                                                title="Log Call"
                                            >
                                                <Phone className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => { setActiveActionCase(caseItem); setShowPaymentModal(true); }}
                                                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all"
                                                title="Record Payment"
                                            >
                                                <Money className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => { setActiveActionCase(caseItem); setShowPtpModal(true); }}
                                                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-amber-500 hover:border-amber-500/50 transition-all"
                                                title="Add PTP"
                                            >
                                                <CalendarRange className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/recovery/case/${caseItem.id}`)}
                                                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-all"
                                                title="Full View"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>




                {filteredCases.length === 0 && (
                    <div className="p-32 text-center flex flex-col items-center justify-center space-y-6 bg-slate-900/10">
                        <div className="w-24 h-24 rounded-[40px] bg-white border border-slate-800 flex items-center justify-center text-slate-700 shadow-inner">
                            <FilterX className="w-12 h-12" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-bold text-slate-300 tracking-tight">No match found</h3>
                            <p className="text-slate-500 max-w-sm mx-auto font-medium text-sm">No recoveries match the select criteria. Try adjusting your filters.</p>
                        </div>
                    </div>
                )}
            </div>

        </div>

        {/* Recovery Operational Modals */}
        {showPaymentModal && activeActionCase && (
            <Modal
                isOpen={showPaymentModal}
                title={`Record Payment: ${activeActionCase.name}`}
                onClose={() => {
                    setShowPaymentModal(false);
                    setActiveActionCase(null);
                }}
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const amount = parseFloat(paymentForm.amount);
                    if (!Number.isFinite(amount) || amount <= 0) {
                        setToast({ message: 'Enter a valid amount greater than zero.', type: 'danger' });
                        return;
                    }
                    if (amount > activeActionCase.outstanding + 1) {
                        setToast({ message: `Amount exceeds outstanding balance (R ${activeActionCase.outstanding.toLocaleString()}).`, type: 'danger' });
                        return;
                    }

                    recordRecoveryPayment(activeActionCase.id, amount, 'Bank Transfer', paymentForm.ref);
                    setToast({ message: "Repayment recorded successfully", type: 'success' });
                    setShowPaymentModal(false);
                    setActiveActionCase(null);
                    setPaymentForm({ amount: '', ref: '' });
                }} className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount (R)</label>
                        <input required type="number" step="0.01" value={paymentForm.amount} onChange={e => setPaymentForm({...paymentForm, amount: e.target.value})} className="input-field py-4 text-xl font-bold text-emerald-500" placeholder="0.00" />
                    </div>
                    <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference</label>
                        <input required value={paymentForm.ref} onChange={e => setPaymentForm({...paymentForm, ref: e.target.value})} className="input-field" placeholder="Transaction ID" />
                    </div>
                    <button className="w-full py-4 bg-emerald-600 rounded-2xl font-bold text-white uppercase tracking-widest text-xs">Confirm Payment</button>
                </form>
            </Modal>
        )}

        {showInteractionModal && activeActionCase && (
            <Modal
                isOpen={showInteractionModal}
                title="Log Collection Attempt"
                onClose={() => {
                    setShowInteractionModal(false);
                    setActiveActionCase(null);
                }}
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    logRecoveryInteraction(activeActionCase.id, {
                        ...interactionForm,
                        agent: user?.name || 'Recovery Agent'
                    });
                    setToast({ message: "Interaction logged", type: 'info' });
                    setShowInteractionModal(false);
                    setActiveActionCase(null);
                    setInteractionForm({ type: 'Call', outcome: 'Answered', notes: '' });
                }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <select className="input-field" value={interactionForm.type} onChange={e => setInteractionForm({...interactionForm, type: e.target.value})}><option>Call</option><option>Message</option></select>
                        <select className="input-field" value={interactionForm.outcome} onChange={e => setInteractionForm({...interactionForm, outcome: e.target.value})}><option>Answered</option><option>PTP Committed</option><option>Refusal</option></select>
                    </div>
                    <textarea required value={interactionForm.notes} onChange={e => setInteractionForm({...interactionForm, notes: e.target.value})} className="input-field min-h-[120px]" placeholder="Observations..." />
                    <button className="w-full py-4 bg-blue-600 rounded-2xl font-bold text-white uppercase tracking-widest text-xs">Save Log</button>
                </form>
            </Modal>
        )}

        {showPtpModal && activeActionCase && (
            <Modal
                isOpen={showPtpModal}
                title="Set Promise To Pay"
                onClose={() => {
                    setShowPtpModal(false);
                    setActiveActionCase(null);
                }}
            >
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const today = new Date().toISOString().split('T')[0];
                    if (ptpForm.date < today) {
                        setToast({ message: 'Promise date cannot be in the past.', type: 'danger' });
                        return;
                    }
                    updatePTP(activeActionCase.id, ptpForm);
                    setToast({ message: "PTP active", type: 'success' });
                    setShowPtpModal(false);
                    setActiveActionCase(null);
                    setPtpForm({ date: '', amount: '' });
                }} className="space-y-6">
                    <input required type="date" value={ptpForm.date} onChange={e => setPtpForm({...ptpForm, date: e.target.value})} className="input-field" />
                    <input required type="number" value={ptpForm.amount} onChange={e => setPtpForm({...ptpForm, amount: e.target.value})} className="input-field" placeholder="Amount Promised" />
                    <button className="w-full py-4 bg-amber-600 rounded-2xl font-bold text-white uppercase tracking-widest text-xs">Set Promise</button>
                </form>
            </Modal>
        )}

        {showBulkAssign && (
            <Modal
                isOpen={showBulkAssign}
                title="Bulk Assign Recovery Cases"
                onClose={() => setShowBulkAssign(false)}
            >
                <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                        Assign {selectedCases.length} selected cases to an agent.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {AGENTS.map((agent) => (
                            <button
                                key={agent}
                                onClick={() => handleBulkAssign(agent)}
                                className="py-3 px-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/40 transition-all text-sm font-bold"
                            >
                                {agent}
                            </button>
                        ))}
                    </div>
                </div>
            </Modal>
        )}
    </>
);
};

export default RecoveryList;
