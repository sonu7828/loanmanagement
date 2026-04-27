import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    RotateCcw,
    User,
    Briefcase,
    Wallet,
    FileText,
    ShieldCheck,
    AlertCircle,
    Clock,
    Printer,
    Download
} from 'lucide-react';
import html2pdf from 'html2pdf.js';

import { useLoans, STATUSES, LIFECYCLE_STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import { Badge, SectionHeader, Toast } from '../../components/ui/Shared';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';

const AdminApplicationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications, transitionLoanLifecycle } = useLoans();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);

    const stages = [
        STATUSES.SUBMITTED,
        STATUSES.HR_PENDING,
        STATUSES.CREDIT_PENDING,
        STATUSES.ADMIN_APPROVAL,
        STATUSES.APPROVED,
        STATUSES.ACTIVE,
        STATUSES.PAID
    ];

    const application = (applications || []).find(app => app.id === id);

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <AlertCircle className="w-12 h-12 text-slate-500 mb-4" />
                <h2 className="text-xl font-bold text-slate-300">Application Not Found</h2>
                <button onClick={() => navigate('/admin/applications')} className="mt-4 text-blue-400 hover:underline">
                    Back to Application Status
                </button>
            </div>
        );
    }

    const currentStageIndex = stages.indexOf(application.status);
    const prevStage = stages[currentStageIndex - 1];

    const handleApprove = () => {
        setIsLoading(true);
        setTimeout(() => {
            transitionLoanLifecycle(application.id, LIFECYCLE_ACTIONS.ADMIN_APPROVE, 'System Admin', 'Final admin approval from detail page');
            setIsLoading(false);
            setToast({ message: 'Successfully approved for disbursement queue.', type: 'success' });
        }, 800);
    };

    const handleSendBack = () => {
        if (prevStage) {
            setIsLoading(true);
            setTimeout(() => {
            transitionLoanLifecycle(application.id, LIFECYCLE_ACTIONS.REOPEN, 'System Admin', 'Sent back for rework');
                setIsLoading(false);
                setToast({ message: `Reverted back to ${prevStage}`, type: 'info' });
            }, 800);
        }
    };

    const handleReject = () => {
        setIsLoading(true);
        setTimeout(() => {
            transitionLoanLifecycle(application.id, LIFECYCLE_ACTIONS.ADMIN_REJECT, 'System Admin', 'Rejected at admin stage');
            setIsLoading(false);
            setToast({ message: 'Application Rejected & Archived', type: 'danger' });
            setTimeout(() => navigate('/admin/applications'), 1500);
        }, 800);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPdf = () => {
        const element = document.getElementById('printable-application-content');
        const opt = {
            margin: 0.5,
            filename: `LMS_Application_${application.id}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().from(element).set(opt).save();
    };

    const isCompleted = application.lifecycleStatus === LIFECYCLE_STATUSES.CLOSED;
    const isRejected = application.lifecycleStatus === LIFECYCLE_STATUSES.REJECTED;
    const isProcessed = isCompleted || isRejected;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center gap-6 glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-10 -mt-10"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <button
                        onClick={() => navigate('/admin/applications')}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-xl active:scale-95 no-print"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold !text-black tracking-tight">
                            {application.name}'s Profile
                        </h1>
                        <div className="flex items-center gap-3 mt-1">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                Ref: {application.id} • {application.date ? new Date(application.date).toLocaleDateString() : 'N/A'}
                            </p>
                            <Badge variant={isCompleted ? 'success' : isRejected ? 'danger' : 'warning'}>
                                {application.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 ml-auto relative z-10 no-print">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-all"
                    >
                        <Printer className="w-4 h-4" /> Print
                    </button>
                    <button 
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all"
                    >
                        <Download className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>

            <div id="printable-application-content" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left & Middle Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Lifecycle Stepper */}
                    <div className="glass p-4 sm:p-8 rounded-[40px] border-slate-800/50 bg-slate-900/20 min-w-0">
                        <div className="overflow-x-auto overscroll-x-contain pb-2 -mx-1 px-1 sm:overflow-visible sm:mx-0 sm:px-0">
                        <div className="flex items-center justify-between min-w-[min(100%,18rem)] sm:min-w-0 max-w-2xl mx-auto relative px-2 sm:px-4">
                            <div className="absolute top-[20px] left-0 w-full h-0.5 bg-slate-800 -z-10 hidden sm:block"></div>
                            {stages.map((stage, i) => {
                                const isDone = currentStageIndex > i || isCompleted;
                                const isActive = application.status === stage;
                                return (
                                    <div key={stage} className="flex flex-col items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                            isDone ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 
                                            isActive ? 'bg-blue-600 border-blue-400 text-white animate-pulse shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 
                                            'bg-slate-950 border-slate-800 text-slate-600'
                                        }`}>
                                            {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div className="flex flex-col items-center text-center">
                                            <span className={`text-[8px] font-black uppercase tracking-tighter leading-tight max-w-[60px] ${
                                                isActive || isDone ? 'text-slate-200' : 'text-slate-600'
                                            }`}>
                                                {stage.replace(/_/g, ' ')}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DetailSection
                            title="Employee Profile"
                            icon={User}
                            items={[
                                { label: 'Full Name', value: application.name },
                                { label: 'ID Number', value: application.idNumber || '920101 5001 081' },
                                { label: 'Contact Email', value: application.email },
                                { label: 'Verified Income', value: `R ${application.salary?.toLocaleString() || '25,000'}` },
                            ]}
                        />
                        <DetailSection
                            title="Financing Goals"
                            icon={Wallet}
                            items={[
                                { label: 'Request Amount', value: `R ${application.amount?.toLocaleString()}`, highlight: true },
                                { label: 'Repayment Term', value: '12 Months' },
                                { label: 'Loan Objective', value: application.purpose || 'Education / Skills Development' },
                                { label: 'Employer Group', value: application.company || 'TechFlow SA' },
                            ]}
                        />
                    </div>

                    {/* Documents */}
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <FileText className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-display font-bold text-white tracking-tight">Digital Vault</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {['Certified ID', 'Proof of Income', 'Bank Statements'].map((doc) => (
                                <div key={doc} className="p-5 bg-slate-950 border border-slate-800 rounded-3xl flex flex-col items-center gap-3 group hover:border-blue-500/50 transition-all cursor-pointer">
                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc}</span>
                                    <button
                                        onClick={() => setPreviewTarget({ title: `${doc}.pdf` })}
                                        className="w-full py-2.5 bg-slate-900 rounded-xl text-[9px] font-black uppercase hover:bg-slate-800 transition-all tracking-tighter"
                                    >
                                        Inspect File
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions */}
                <div className="space-y-8">
                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-950/50 space-y-6 shadow-2xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">Authority</h3>
                        </div>

                        {!isProcessed ? (
                            <div className="space-y-4">
                                <button
                                    onClick={handleApprove}
                                    disabled={isLoading || !nextStage}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-600/30 active:scale-95"
                                >
                                    {isLoading ? <Clock className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                                    Finalize & Approve
                                </button>

                                <button
                                    onClick={handleReject}
                                    disabled={isLoading}
                                    className="w-full py-4 bg-slate-900 border border-slate-800 hover:bg-red-600/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 disabled:opacity-50 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <XCircle className="w-5 h-5" />
                                    Reject Request
                                </button>

                                {prevStage && (
                                    <div className="pt-4 border-t border-slate-800/50 space-y-3">
                                        <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest text-center">Lifecycle Management</p>
                                        <button
                                            onClick={handleSendBack}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-slate-900 border border-slate-800 border-dashed rounded-2xl text-[10px] font-black uppercase text-slate-400 hover:text-white transition-all flex items-center justify-center gap-2 group active:scale-95"
                                        >
                                            <RotateCcw className="w-4 h-4 group-hover:-rotate-45 transition-transform" />
                                            Return to {prevStage?.replace(/_/g, ' ')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={`p-8 rounded-[32px] border flex flex-col items-center text-center gap-6 ${
                                isCompleted ? 'bg-emerald-600/10 border-emerald-500/30' : 'bg-red-600/10 border-red-500/30'
                            }`}>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl ${
                                    isCompleted ? 'bg-emerald-500 shadow-emerald-500/40' : 'bg-red-50 shadow-red-500/40'
                                }`}>
                                    {isCompleted ? <CheckCircle2 className="w-10 h-10" /> : <XCircle className="w-10 h-10 text-red-500" />}
                                </div>
                                <div>
                                    <h4 className={`text-xl font-bold font-display ${isCompleted ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {isCompleted ? 'Case Finalized' : 'Case Declined'}
                                    </h4>
                                    <p className="text-xs text-slate-500 mt-2 leading-relaxed font-medium">
                                        {isCompleted
                                            ? 'This application has successfully passed all verification gates and is now active.'
                                            : 'The application request has been formally declined and the case is closed.'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/20 max-h-[400px] flex flex-col shadow-xl">
                        <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-6 border-b border-slate-800 pb-4 flex-shrink-0">Audit Trail</h3>
                        <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                            {(application.auditHistory || []).slice().reverse().map((log, i) => (
                                <div key={i} className="flex gap-4 relative">
                                    {i < (application.auditHistory || []).length - 1 && (
                                        <div className="absolute left-[7px] top-6 w-0.5 h-10 bg-slate-800"></div>
                                    )}
                                    <div className="w-4 h-4 rounded-full bg-slate-800 border-2 border-slate-700 shrink-0 mt-1"></div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-slate-200">{log.status?.replace(/_/g, ' ')}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">
                                            {log.user} • {new Date(log.date).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {(application.auditHistory || []).length === 0 && (
                                <p className="text-[10px] text-slate-600 font-bold italic text-center py-4">No audit logs recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DocumentPreviewModal
                isOpen={!!previewTarget}
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
            />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

const DetailSection = ({ title, icon: Icon, items }) => (
    <div className="glass p-8 rounded-[40px] border-slate-800/50 bg-slate-900/40 space-y-6 relative overflow-hidden group shadow-xl">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-display font-bold text-white uppercase tracking-tight">{title}</h3>
        </div>
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex flex-col border-l-2 border-slate-800 pl-4 py-1 hover:border-blue-500/50 transition-colors">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</span>
                    <span className={`text-sm font-bold ${item.highlight ? 'text-blue-400' : 'text-slate-300'}`}>{item.value}</span>
                </div>
            ))}
        </div>
    </div>
);

export default AdminApplicationDetail;
