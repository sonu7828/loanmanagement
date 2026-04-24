import React, { useState } from 'react';
import {
    Users,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    Eye,
    FileText,
    Briefcase,
    TrendingUp,
    AlertCircle,
    AlertTriangle,
    ArrowUpDown,
    FilterX,
    ArrowRight,
    Loader2,
    MoreVertical,
    Check
} from 'lucide-react';
import { useLoans, STATUSES, LIFECYCLE_STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import { StatCard, SectionHeader, Badge, Toast, Modal } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const SAMPLE_DATA = [
    {
        id: 'APP-001',
        name: 'Sarah Jenkins',
        company: 'TechFlow SA',
        amount: 5000,
        date: '2024-04-20',
        status: STATUSES.SUBMITTED,
        lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
        email: 's.jenkins@techflow.sa',
        purpose: 'Education Fees',
        isSample: true
    },
    {
        id: 'APP-002',
        name: 'Michael Chen',
        company: 'Retail Group',
        amount: 4000,
        date: '2024-04-21',
        status: STATUSES.HR_PENDING,
        lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
        email: 'm.chen@retailgroup.io',
        purpose: 'Home Improvement',
        isSample: true
    },
    {
        id: 'APP-003',
        name: 'David Smith',
        company: 'Finance Corp',
        amount: 8000,
        date: '2024-04-19',
        status: STATUSES.NEED_MORE_INFO,
        lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
        email: 'd.smith@financecorp.co',
        purpose: 'Medical Emergency',
        isSample: true
    },
    {
        id: 'APP-004',
        name: 'Emily Brown',
        company: 'Global Tech',
        amount: 3200,
        date: '2024-04-22',
        status: STATUSES.APPROVED,
        lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
        email: 'e.brown@globaltech.io',
        purpose: 'Debt Consolidation',
        isSample: true
    },
    {
        id: 'APP-005',
        name: 'John Doe',
        company: 'Logistics Ltd',
        amount: 6000,
        date: '2024-04-23',
        status: 'Forwarded to Credit',
        lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
        email: 'j.doe@logistics.ltd',
        purpose: 'Vehicle Repair',
        isSample: true
    }
];

const VerificationQueue = () => {
    const { applications, transitionLoanLifecycle } = useLoans();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showNoteModal, setShowNoteModal] = useState(false);
    const [noteType, setNoteType] = useState('INFO');
    const [notes, setNotes] = useState('');
    const [selectedAppId, setSelectedAppId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Filter logic
    const hasRealVerifications = (applications || []).some(app => app.lifecycleStatus === LIFECYCLE_STATUSES.SUBMITTED);
    const sourceData = hasRealVerifications ? applications : SAMPLE_DATA;

    const queue = sourceData.filter(app => {
        const name = app.name || '';
        const id = app.id || '';
        const company = app.company || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             company.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesStatus = true;
        if (statusFilter !== 'ALL') {
            matchesStatus = app.status === statusFilter || app.lifecycleStatus === statusFilter;
        } else if (!app.isSample) {
            matchesStatus = app.lifecycleStatus === LIFECYCLE_STATUSES.SUBMITTED;
        }

        return matchesSearch && matchesStatus;
    });


    const getStatusVariant = (status) => {
        switch (status) {
            case STATUSES.SUBMITTED:
            case STATUSES.HR_PENDING: return 'warning';
            case STATUSES.HR_APPROVED:
            case STATUSES.CREDIT_APPROVED:
            case STATUSES.ADMIN_APPROVED:
            case STATUSES.DISBURSED: return 'success';
            case STATUSES.HR_REJECTED:
            case STATUSES.DECLINED: return 'danger';
            case STATUSES.CREDIT_PENDING:
            case STATUSES.FINAL_REVIEW:
            case STATUSES.ADMIN_PENDING: return 'primary';
            default: return 'neutral';
        }
    };

    const stats = [
        { title: 'To Verify', value: queue.length.toString(), icon: Clock, variant: 'warning' },
        { title: 'HR Approved', value: (applications || []).filter(a => a.status === STATUSES.HR_APPROVED || a.status === STATUSES.CREDIT_PENDING).length.toString(), icon: CheckCircle2, variant: 'success' },
        { title: 'HR Rejected', value: (applications || []).filter(a => a.status === STATUSES.HR_REJECTED).length.toString(), icon: XCircle, variant: 'danger' },
    ];

    const handleVerify = (id) => {
        if (window.confirm('Confirm HR Verification Approval?')) {
            setIsLoading(true);
            setTimeout(() => {
                transitionLoanLifecycle(id, LIFECYCLE_ACTIONS.HR_VERIFY, 'HR Manager', 'HR verification approved');
                setIsLoading(false);
                setToast({ message: `Application ${id} approved successfully!`, type: 'success' });
            }, 800);
        }
    };

    const handleRejectClick = (id) => {
        setSelectedAppId(id);
        setShowRejectModal(true);
    };

    const confirmNoteAction = () => {
        if (!notes.trim()) return;
        setIsLoading(true);
        setTimeout(() => {
            const isForward = noteType === 'FORWARD';
            const isInfo = noteType === 'INFO';
            
            if (isForward) {
                transitionLoanLifecycle(selectedAppId, LIFECYCLE_ACTIONS.HR_VERIFY, 'HR Manager', notes);
            } else {
                addNote(selectedAppId, notes, 'HR Manager');
            }
            
            setShowNoteModal(false);
            setNotes('');
            setIsLoading(false);
            setToast({ 
                message: isForward ? 'Forwarded to Credit department.' : 'Information request/note recorded.', 
                type: 'success' 
            });
            setSelectedAppId(null);
        }, 800);
    };

    const confirmReject = () => {
        setIsLoading(true);
        setTimeout(() => {
            transitionLoanLifecycle(selectedAppId, LIFECYCLE_ACTIONS.HR_REJECT, 'HR Manager', 'Rejected during HR verification');
            setShowRejectModal(false);
            setSelectedAppId(null);
            setIsLoading(false);
            setToast({ message: `Application ${selectedAppId} has been rejected.`, type: 'danger' });
        }, 800);
    };

    return (
        <>
            <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
                <SectionHeader
                    title="Verifications"
                    description="Perform multi-stage employee verification. Confirm corporate eligibility, salary stability, and escalate for credit assessment."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
                    {stats.map((stat, i) => (
                        <StatCard key={i} {...stat} />
                    ))}
                </div>

                <div className="glass rounded-[24px] overflow-hidden border border-slate-800/50 shadow-xl">
                    <div className="p-4 sm:p-5 border-b border-slate-800/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/10">
                        <div className="flex flex-col md:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md space-y-1.5">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        className="input-field pl-10 py-2.5 text-sm w-full"
                                        placeholder="Search by name or APP ID..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <p className="text-[10px] text-slate-500 px-1 italic">Search by applicant name or unique loan ID</p>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2">
                                    <Filter className="w-4 h-4 text-slate-500 ml-2" />
                                    <select
                                        className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <option value="ALL">All Active</option>
                                        <option value={LIFECYCLE_STATUSES.SUBMITTED}>Submitted</option>
                                    </select>
                                </div>
                                <p className="text-[10px] text-slate-500 px-2 italic">Filter by verification stage</p>
                            </div>
                        </div>
                        {(statusFilter !== 'ALL' || searchTerm) && (
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-blue-600 transition-all underline underline-offset-4"
                            >
                                <FilterX className="w-4 h-4" />
                                Clear Filters
                            </button>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="py-16 flex flex-col items-center justify-center space-y-4">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                            <p className="text-slate-400 font-medium animate-pulse text-[10px] font-black uppercase tracking-widest text-center">Processing update...</p>
                        </div>
                    ) : queue.length === 0 ? (
                        <div className="py-16 text-center flex flex-col items-center justify-center space-y-6">
                            <div className="w-16 h-16 rounded-[24px] bg-slate-900 flex items-center justify-center text-slate-800 border border-slate-800/50 shadow-inner">
                                <FilterX className="w-8 h-8" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-display font-bold text-slate-300">No matching applications</h3>
                                <p className="text-slate-500 max-w-[280px] mx-auto text-xs leading-relaxed">Try a different term or clear filters.</p>
                            </div>
                            <button
                                onClick={() => { setSearchTerm(''); setStatusFilter('ALL'); }}
                                className="px-6 py-2.5 bg-slate-800 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-slate-700 hover:text-blue-600 transition-all active:scale-95"
                            >
                                Reset Results
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-900/50 border-b border-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Applicant</th>
                                        <th className="px-6 py-4">Reference / Company</th>
                                        <th className="px-6 py-4">Amount / Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {queue.map((app) => (
                                        <tr key={app.id} className="hover:bg-slate-800/30 transition-all group">
                                            <td className="px-6 py-3.5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:border-blue-500/50 transition-all">
                                                        {(app.name || 'U')[0]}
                                                    </div>
                                                    <p className="font-bold text-slate-200 text-sm">{app.name || 'Anonymous'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="space-y-0.5">
                                                    <p className="text-xs font-mono font-bold text-slate-400 tracking-tight">{app.id}</p>
                                                    <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">{app.company}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-bold text-slate-200">R {app.amount?.toLocaleString()}</p>
                                                    <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest">{app.date ? new Date(app.date).toLocaleDateString() : 'N/A'}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-3.5">
                                                <Badge variant={getStatusVariant(app.status)} className="px-3 py-1 text-[9px] uppercase tracking-widest font-black">
                                                    {app.status || 'Unknown'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-3.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        onClick={() => navigate(`/hr/verifications/${app.id}`)}
                                                        className="p-2 bg-slate-900 border border-slate-800 text-slate-500 hover:text-blue-400 hover:border-blue-500/30 rounded-lg transition-all"
                                                        title="View Details"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleVerify(app.id)}
                                                        className="px-3 py-1.5 bg-emerald-600/10 text-emerald-500 hover:bg-emerald-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-emerald-500/10"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleRejectClick(app.id)}
                                                        className="px-3 py-1.5 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border border-red-500/10"
                                                    >
                                                        Reject
                                                    </button>
                                                    
                                                    {/* Secondary Actions Trigger */}
                                                    <div className="relative group/menu">
                                                        <button
                                                            className="p-2 text-slate-600 hover:text-slate-300 transition-all rounded-lg hover:bg-slate-800"
                                                            title="More Actions"
                                                        >
                                                            <MoreVertical className="w-4 h-4" />
                                                        </button>
                                                        <div className="absolute right-0 top-full mt-1 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-50">
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedAppId(app.id);
                                                                    setNoteType('FORWARD');
                                                                    setShowNoteModal(true);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center gap-2"
                                                            >
                                                                <ArrowRight className="w-3 h-3" />
                                                                Forward to Credit
                                                            </button>
                                                            <button 
                                                                onClick={() => {
                                                                    setSelectedAppId(app.id);
                                                                    setNoteType('INFO');
                                                                    setShowNoteModal(true);
                                                                }}
                                                                className="w-full text-left px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-amber-600 hover:text-white transition-all flex items-center gap-2"
                                                            >
                                                                <AlertCircle className="w-3 h-3" />
                                                                Need More Info
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Rejection Modal */}
            <Modal
                isOpen={showRejectModal}
                onClose={() => setShowRejectModal(false)}
                title="Priority Rejection"
                maxWidth="max-w-md"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => setShowRejectModal(false)}
                            className="flex-1 py-4 bg-slate-800 rounded-2xl text-sm font-bold text-slate-100 hover:text-blue-600 transition-all border border-slate-700/50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmReject}
                            className="flex-1 py-4 bg-red-600 rounded-2xl text-sm font-bold text-white hover:bg-red-500 transition-all font-display shadow-lg shadow-red-600/20 active:scale-95"
                        >
                            Confirm Rejection
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="flex items-center gap-4 text-red-400">
                        <div className="w-12 h-12 rounded-2xl bg-red-600/20 flex items-center justify-center shrink-0">
                            <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Application: {selectedAppId}</p>
                        </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 p-6 rounded-3xl space-y-3 shadow-inner">
                        <p className="text-slate-300 text-sm leading-relaxed">
                            You are about to decline this verification request. This action will notify the Employee and stop further processing.
                        </p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Note: For detailed reasons, use the full verification page.</p>
                    </div>
                </div>
            </Modal>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Workflow Note Modal */}
            <Modal
                isOpen={showNoteModal}
                onClose={() => setShowNoteModal(false)}
                title={noteType === 'INFO' ? 'Request Information' : 'Forward to Credit'}
                maxWidth="max-w-md"
                footer={
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <button
                            onClick={() => setShowNoteModal(false)}
                            className="flex-1 py-4 bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-100 hover:text-blue-600 transition-all border border-slate-700/50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmNoteAction}
                            className="flex-1 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                            Confirm Action
                        </button>
                    </div>
                }
            >
                <div className="space-y-6">
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-4">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Internal Notes</label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder={noteType === 'INFO' ? "Specify what documents or info are missing..." : "Add any specific instructions for the Credit team..."}
                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-all min-h-[120px] placeholder:text-slate-700"
                        />
                    </div>
                    <div className="px-2 space-y-2">
                        <div className="flex items-center gap-2 text-blue-400">
                            <div className="w-1 h-1 bg-blue-500 rounded-full" />
                            <p className="text-[10px] font-bold uppercase tracking-wider">Audit trail will be updated</p>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default VerificationQueue;
