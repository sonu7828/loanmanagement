import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileSearch } from 'lucide-react';
import { Toast, Badge } from '../../components/ui/Shared';
import { useLoans, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import VerificationDetailsView from '../../components/hr/VerificationDetailsView';

const HRVerificationDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications, transitionLoanLifecycle } = useLoans();
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const SAMPLE_DATA = [
        {
            id: 'APP-001',
            name: 'Sarah Jenkins',
            company: 'TechFlow SA',
            amount: 5000,
            date: '2024-04-20',
            status: 'Submitted',
            lifecycleStatus: 'SUBMITTED',
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
            status: 'HR Pending',
            lifecycleStatus: 'SUBMITTED',
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
            status: 'Need More Info',
            lifecycleStatus: 'SUBMITTED',
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
            status: 'Approved',
            lifecycleStatus: 'SUBMITTED',
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
            lifecycleStatus: 'SUBMITTED',
            email: 'j.doe@logistics.ltd',
            purpose: 'Vehicle Repair',
            isSample: true
        }
    ];

    const application = applications.find(app => app.id === id) || SAMPLE_DATA.find(app => app.id === id);

    const handleApprove = () => {
        if (!application) return;
        setIsLoading(true);
        // Simulate network delay
        setTimeout(() => {
            transitionLoanLifecycle(application.id, LIFECYCLE_ACTIONS.HR_VERIFY, 'HR Manager', 'Verified from HR detail');
            setIsLoading(false);
            setToast({ message: 'HR Verification Successful! Moving to Credit Assessment.', type: 'success' });
            setTimeout(() => navigate('/hr/verifications'), 1500);
        }, 1200);
    };

    const handleReject = (reason) => {
        setIsLoading(true);
        setTimeout(() => {
            transitionLoanLifecycle(application.id, LIFECYCLE_ACTIONS.HR_REJECT, 'HR Manager', reason);
            setIsLoading(false);
            setToast({ message: `Application ${application.id} rejected. Redirecting...`, type: 'danger' });

            // Redirect back to queue after showing toast
            setTimeout(() => navigate('/hr/verifications'), 1500);
        }, 1200);
    };

    return (
        <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Minimal Header */}
            <div className="flex items-center gap-5 glass p-4 sm:p-5 rounded-[24px] border-slate-800/50 bg-slate-900/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-10 -mt-10"></div>
                <button
                    onClick={() => navigate('/hr/verifications')}
                    className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-600 transition-all shadow-xl active:scale-95 relative z-10"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative z-10">
                    <h1 className="text-2xl font-display font-bold text-white tracking-tight">
                        {application ? `Verify: ${application.name}` : 'Verification Portal'}
                    </h1>
                    <div className="flex items-center gap-3 mt-1">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                            Secure Loan Processing Database • v1.0.4
                        </p>
                        {application && <Badge variant="neutral" className="text-[8px] py-0">{application.id}</Badge>}
                    </div>
                </div>
            </div>

            <VerificationDetailsView
                application={application}
                onApprove={handleApprove}
                onReject={handleReject}
                isLoading={isLoading}
            />

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default HRVerificationDetail;
