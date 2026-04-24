import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, FileText, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LetterPreviewModal from '../../components/shared/LetterPreviewModal';
import { getRejectionLetter } from '../../utils/letterTemplates';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const MyStatus = () => {
    const { applications } = useLoans();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const actualApp = applications[0]; // For demo, show the latest

    // Developer testing state
    const [devStatus, setDevStatus] = useState('');

    const [letterModal, setLetterModal] = useState({
        isOpen: false,
        type: '',
        content: '',
        title: ''
    });

    const latestApp = actualApp ? {
        ...actualApp,
        status: devStatus || actualApp.status
    } : null;

    const currentStatus = latestApp?.status;

    const isDeclined = currentStatus === STATUSES.DECLINED || currentStatus === STATUSES.REJECTED;
    const isApproved = currentStatus === STATUSES.APPROVED || currentStatus === STATUSES.ADMIN_APPROVAL;
    const isPaid = currentStatus === STATUSES.DISBURSED || currentStatus === STATUSES.ACTIVE || currentStatus === STATUSES.PAID;

    const steps = [
        { key: 'SUBMITTED', label: 'Application Submitted', icon: FileText },
        { key: 'HR', label: 'Employer Verification', icon: Clock },
        { key: 'CREDIT', label: 'Credit Assessment', icon: ShieldCheck },
        { key: 'ADMIN', label: 'Approved', icon: CheckCircle2 },
        { key: 'PAID', label: 'Funds Disbursed', icon: CreditCard },
    ];

    const getStepStatus = (stepKey) => {
        if (!latestApp) return 'pending';
        
        const keyOrder = ['SUBMITTED', 'HR', 'CREDIT', 'ADMIN', 'PAID'];
        const currentKeyIndex = (() => {
            switch(currentStatus) {
                case STATUSES.SUBMITTED: 
                case STATUSES.HR_PENDING: return 0;
                case STATUSES.HR_APPROVED: 
                case STATUSES.CREDIT_PENDING: 
                case STATUSES.UNDER_REVIEW: return 1;
                case STATUSES.CREDIT_APPROVED: 
                case STATUSES.ADMIN_APPROVAL: return 2;
                case STATUSES.APPROVED: return 3;
                case STATUSES.DISBURSED: 
                case STATUSES.ACTIVE: 
                case STATUSES.PAID: return 4;
                default: return 0;
            }
        })();

        const stepIndex = keyOrder.indexOf(stepKey);

        if (isDeclined) {
            if (stepIndex < currentKeyIndex) return 'completed';
            if (stepIndex === currentKeyIndex) return 'failed';
            return 'locked';
        }

        if (currentKeyIndex > stepIndex) return 'completed';
        if (currentKeyIndex === stepIndex) return 'current';
        return 'pending';
    };

    const getBadgeVariant = () => {
        if (isDeclined) return 'danger';
        if (isPaid) return 'success';
        if (isApproved) return 'success';
        return 'primary';
    };

    if (!latestApp) {
        return (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <FileText className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-display font-bold">No Active Applications</h2>
                <p className="text-slate-500">You haven't applied for a loan yet.</p>
                <button className="btn-primary px-8 mt-4">Apply Now</button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
            
            {/* DEV TOOL - Status Switcher */}
            {latestApp && (
                <div className="fixed top-4 right-4 lg:right-8 z-[9999] p-3 bg-white border-2 border-slate-300 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col gap-2">
                    <p className="text-[11px] text-black font-mono uppercase tracking-wider font-black">🛠 Dev Mode: Test Status</p>
                    <select 
                        value={devStatus} 
                        onChange={(e) => setDevStatus(e.target.value)}
                        className="bg-white text-sm text-black border-2 border-slate-700 rounded px-3 py-2 outline-none font-mono font-bold cursor-pointer"
                    >
                        <option value="" className="text-black bg-white">-- Actual Status --</option>
                        <option value={STATUSES.SUBMITTED} className="text-black bg-white">Submitted</option>
                        <option value={STATUSES.HR_PENDING} className="text-black bg-white">HR Verification</option>
                        <option value={STATUSES.CREDIT_PENDING} className="text-black bg-white">Credit Review</option>
                        <option value={STATUSES.APPROVED} className="text-black bg-white">Approved</option>
                        <option value={STATUSES.DISBURSED} className="text-black bg-white">Paid Out</option>
                        <option value={STATUSES.DECLINED} className="text-black bg-white">Declined</option>
                    </select>
                </div>
            )}

            <SectionHeader
                title="Application Status"
                description="Track the progress of your loan application in real-time."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Status Timeline */}
                <div className="lg:col-span-2 glass p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] space-y-8 lg:space-y-12">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl lg:text-2xl font-display font-black text-black tracking-tight">Tracking Timeline</h2>
                        <Badge variant={getBadgeVariant()}>
                            <span className="font-black tracking-widest text-[10px]">{isDeclined ? 'DECLINED' : isApproved ? 'APPROVED' : isPaid ? 'PAID OUT' : latestApp.status.toUpperCase()}</span>
                        </Badge>
                    </div>

                    <div className="relative space-y-6 lg:space-y-8">
                        {/* Vertical Line */}
                        <div className="absolute left-[23.5px] lg:left-[27.5px] top-2 bottom-2 w-[3px] bg-slate-700/60 rounded-full"></div>

                        {steps.map((step, i) => {
                            const stepStatus = getStepStatus(step.key);
                            return (
                                <div key={i} className={cn("relative flex items-center gap-4 lg:gap-6 group", stepStatus === 'locked' && "opacity-50 grayscale")}>
                                    <div className={cn(
                                        "w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 z-10 shrink-0",
                                        stepStatus === 'completed' ? "bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]" :
                                            stepStatus === 'current' ? "bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] ring-4 ring-blue-500/20" :
                                                stepStatus === 'failed' ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]" :
                                                    stepStatus === 'locked' ? "bg-red-950 border border-red-900 text-red-800" :
                                                    "bg-slate-900 border border-slate-700 text-slate-500"
                                    )}>
                                        <step.icon className={cn("w-5 h-5 lg:w-6 lg:h-6", stepStatus === 'current' && "animate-pulse")} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={cn(
                                            "font-display text-base lg:text-lg truncate tracking-wide",
                                            stepStatus === 'completed' ? "text-black font-bold" :
                                                stepStatus === 'current' ? "text-blue-600 font-black" :
                                                    stepStatus === 'failed' ? "text-red-600 font-bold" :
                                                        "text-slate-500 font-semibold"
                                        )}>
                                            {step.label}
                                        </h3>
                                        <p className={cn(
                                            "text-xs lg:text-sm mt-1 leading-relaxed",
                                            stepStatus === 'completed' ? "text-slate-600" :
                                                stepStatus === 'current' ? "text-slate-800 font-medium" :
                                                    stepStatus === 'failed' ? "text-red-600/80" :
                                                        "text-slate-400 font-medium"
                                        )}>
                                            {stepStatus === 'completed' ? 'Successfully processed' :
                                                stepStatus === 'current' ? (isApproved ? 'Funds Disbursement Pending' : 'Under review by our team') :
                                                    stepStatus === 'failed' ? 'Application halted at this stage' :
                                                        stepStatus === 'locked' ? 'Locked due to decline' :
                                                            'Awaiting previous steps'}
                                        </p>
                                    </div>
                                    {stepStatus === 'completed' && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                                    )}
                                    {stepStatus === 'failed' && (
                                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {isDeclined && (
                        <div className="p-5 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mt-8">
                            <div className="flex gap-4 items-start">
                                <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-bold text-red-400 uppercase tracking-wider">Application Declined</p>
                                    <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                                        Reason: <span className="font-semibold text-slate-200">{latestApp.declineReason || 'Did not meet current lending criteria or affordability requirements.'}</span>
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setLetterModal({
                                    isOpen: true,
                                    type: 'rejection',
                                    title: 'Application Decline Letter',
                                    content: getRejectionLetter(latestApp, currentUser)
                                })}
                                className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap"
                            >
                                View Letter
                            </button>
                        </div>
                    )}

                    {isPaid && (
                        <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex gap-4 items-start mt-8">
                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-emerald-400 uppercase tracking-wider">Funds Disbursed</p>
                                <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                                    Your loan of <span className="font-bold text-white">R {latestApp.amount?.toLocaleString()}</span> was successfully paid out on <span className="font-bold text-white">{latestApp.disbursementDate ? new Date(latestApp.disbursementDate).toLocaleDateString() : new Date().toLocaleDateString()}</span>.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Summary Card */}
                <div className="space-y-6">
                    <div className="glass p-6 lg:p-8 rounded-[32px] lg:rounded-[40px] bg-blue-600/5 border-blue-500/10 space-y-6">
                        <h3 className="text-lg font-display font-bold">Summary</h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                <span className="text-slate-500 text-sm font-medium">Loan ID</span>
                                <span className="font-mono text-black font-bold text-sm truncate">{latestApp.id}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                <span className="text-slate-500 text-sm font-medium">Requested Amount</span>
                                <span className="text-xl lg:text-2xl font-black text-black tracking-tight">R {latestApp.amount?.toLocaleString()}</span>
                            </div>
                            {(isApproved || isPaid) && (
                                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                    <span className="text-slate-500 text-sm font-medium">Approved Amount</span>
                                    <span className="text-base font-bold text-emerald-600">R {latestApp.amount?.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                <span className="text-slate-500 text-sm font-medium">Submitted Date</span>
                                <span className="text-black text-sm font-bold">{new Date(latestApp.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                <span className="text-slate-500 text-sm font-medium">Current Status</span>
                                <span className={cn("text-sm font-bold", isDeclined ? "text-red-600" : isPaid ? "text-emerald-600" : "text-blue-600")}>
                                    {isDeclined ? 'Declined' : isPaid ? 'Paid Out' : isApproved ? 'Approved' : latestApp.status}
                                </span>
                            </div>
                            {isApproved && !isPaid && (
                                <div className="flex justify-between items-center py-3 border-b border-slate-200/50 gap-4">
                                    <span className="text-slate-500 text-sm font-medium">Expected Payout</span>
                                    <span className="text-black text-sm font-bold">Within 24 hours</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex gap-4 items-start">
                            <Clock className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                                Our standard processing time is 1-2 business days. You will receive an email notification once your status changes.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-2 py-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-widest">Last updated: Just now</span>
                        </div>
                        <button
                            onClick={() => navigate(`/employee/application/${latestApp.id}`)}
                            className="w-full glass p-6 rounded-[32px] hover:bg-slate-50 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5 ring-1 ring-slate-200/50 hover:ring-blue-600/30 transition-all duration-300 group flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-all duration-300 border border-slate-100">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-black group-hover:text-blue-600 transition-colors">View Full Application</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                        </button>
                    </div>
                </div>
            </div>

            {latestApp && (
                <LetterPreviewModal
                    isOpen={letterModal.isOpen}
                    onClose={() => setLetterModal((prev) => ({ ...prev, isOpen: false }))}
                    htmlContent={letterModal.content}
                    loanId={latestApp.id}
                    recipientEmail={latestApp.email || currentUser?.email}
                    title={letterModal.title}
                />
            )}
        </div>
    );
};

export default MyStatus;
