import React, { useState } from 'react';
import {
  User,
  Briefcase,
  Wallet,
  ShieldQuestion,
  FileText,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Info,
  Clock,
  ArrowRight,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { Badge, Toast } from '../ui/Shared';
import { STATUSES, LIFECYCLE_STATUSES } from '../../context/LoanContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import DocumentPreviewModal from '../ui/DocumentPreviewModal';
import Modal from '../ui/Modal';

const VerificationDetailsView = ({ application, onApprove, onReject, isLoading }) => {
  const [previewTarget, setPreviewTarget] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [verificationState, setVerificationState] = useState({});

  const allVerified = ['id_verified', 'bank_verified', 'docs_verified', 'salary_verified', 'type_verified', 'contract_verified'].every(key => verificationState[key]);

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center py-10 sm:py-16 space-y-6 text-center animate-in duration-700">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-[24px] bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-700 shadow-inner">
          <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <div className="space-y-2 px-6">
          <h3 className="text-2xl font-display font-black text-slate-200 lowercase tracking-tighter">No Active Loan Request</h3>
          <p className="text-slate-400 max-w-sm mx-auto text-base font-medium leading-relaxed lowercase italic">
            this employee does not have any pending requests requiring verification.
          </p>
        </div>
      </div>
    );
  }

  const isProcessed = application.lifecycleStatus === LIFECYCLE_STATUSES.HR_VERIFIED ||
    application.lifecycleStatus === LIFECYCLE_STATUSES.REJECTED;

  const handleApprove = () => {
    onApprove();
    setShowApproveModal(false);
  };

  const handleReject = () => {
    const finalReason = rejectReason === 'Other' ? otherReason : rejectReason;
    if (!finalReason) return;
    onReject(finalReason);
    setShowRejectModal(false);
  };

  const rejectionReasons = [
    'Discipline issue',
    'Absenteeism',
    'Final warning',
    'Incomplete employment history',
    'Other'
  ];

  const steps = [
    { label: 'Submitted', active: true, done: true },
    {
      label: 'HR Verified',
      active: application.status === STATUSES.HR_APPROVED || application.status === STATUSES.CREDIT_PENDING,
      done: application.status === STATUSES.HR_APPROVED || application.status === STATUSES.CREDIT_PENDING
    },
    {
      label: 'Credit Assessment',
      active: application.status === STATUSES.CREDIT_PENDING,
      done: false
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in duration-700">
      {/* Status Flow Stepper */}
      <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 bg-slate-900/40 shadow-xl min-w-0">
        <div className="overflow-x-auto overscroll-x-contain pb-2 -mx-1 px-1 sm:overflow-visible sm:mx-0 sm:px-0">
        <div className="flex items-center justify-between min-w-[min(100%,20rem)] sm:min-w-0 max-w-2xl mx-auto relative px-4">
          <div className="absolute top-1/2 left-0 w-full h-[2px] bg-slate-800 -translate-y-1/2 -z-10 hidden sm:block"></div>
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-transparent p-2 rounded-xl relative z-10 transition-all duration-500">
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all", 
                  step.done ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                  step.active ? 'bg-blue-600 border-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/20' :
                  'bg-slate-900 border-slate-700 text-slate-500'
                )}>
                {step.done ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <span className={cn("text-[8px] font-black uppercase tracking-[0.15em]", 
                  step.active || step.done ? 'text-slate-200' : 'text-slate-500'
                )}>{step.label}</span>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-w-0">
        <div className="space-y-6 sm:space-y-8">
          <DetailCard
            title="Employee Identity"
            icon={User}
            items={[
              { label: 'Full Legal Name', value: application.name },
              { label: 'National ID / Passport', value: application.idNumber || '920101 5001 081' },
              { label: 'Contact Phone', value: '+27 82 123 4567' },
              { label: 'Email Address', value: application.email },
            ]}
          />
          <DetailCard
            title="Employment Context"
            icon={Briefcase}
            items={[
              { label: 'Current Employer', value: application.company || 'TechFlow SA' },
              { label: 'Designation', value: 'Senior Associate' },
              { label: 'Monthly Gross Salary', value: `R ${application.salary?.toLocaleString() || '0'}` },
              { label: 'Employment Status', value: 'Permanent / Full-Time', variant: 'success' },
            ]}
          />

          {/* Documents Section */}
          <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 space-y-6 bg-slate-900/40 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-200 tracking-tight lowercase">documents gallery.</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'Payslip Archive', type: 'payslip' },
                { name: 'Identity Copy', type: 'id_copy' },
                { name: 'Bank Statement', type: 'bank_statement' }
              ].map((doc) => (
                <div key={doc.name} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-blue-500/30 transition-all shadow-sm min-w-0">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:rotate-6 transition-all border border-slate-800 flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-bold text-slate-200 lowercase truncate text-sm">{doc.name}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">PDF format • verified</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setPreviewTarget({ title: `${doc.name}.pdf`, type: doc.type })}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-500/20 transition-all w-full sm:w-auto flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <DetailCard
            title="Loan Financials"
            icon={Wallet}
            variant="blue"
            items={[
              { label: 'Requested Principal', value: `R ${application.amount?.toLocaleString()}`, highlight: 'text-blue-600' },
              { label: 'Agreed Repayment Term', value: '12 Months' },
              { label: 'Collection Method', value: 'Payroll Deduction' },
            ]}
          />

          <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 space-y-6 bg-slate-900/40 border-l-4 border-l-amber-500/30 shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl p-1"></div>
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
                  <ShieldQuestion className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-display font-black text-slate-200 tracking-tight lowercase">legal disclosure.</h3>
              </div>
              <Badge variant="warning" className="text-[8px]">Compliance</Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 relative z-10">
              {[
                { question: 'Under Administration?', value: application.nca?.isUnderAdministration ? 'Yes' : 'No', type: application.nca?.isUnderAdministration ? 'danger' : 'success' },
                { question: 'Under Debt Review?', value: application.nca?.isUnderDebtReview ? 'Yes' : 'No', type: application.nca?.isUnderDebtReview ? 'danger' : 'success' },
                { question: 'Emergency Loan?', value: application.nca?.isEmergencyLoan ? 'Yes' : 'No', type: 'primary' },
              ].map((q, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all">
                  <span className="text-sm font-bold text-slate-400 tracking-tight">{q.question}</span>
                  <Badge variant={q.type} className="px-4 py-1">{q.value}</Badge>
                </div>
              ))}
            <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Purpose of Credit:</span>
                <p className="text-sm text-slate-200 font-bold leading-relaxed italic border-l-4 border-blue-500/20 pl-4 lowercase">
                  "{application.nca?.loanPurpose || application.purpose || 'not specified'}"
                </p>
              </div>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="glass p-5 sm:p-8 rounded-[32px] border-slate-800/50 space-y-6 bg-slate-900/40 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-display font-black text-slate-200 tracking-tight lowercase">hr verification checklist.</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { id: 'id_verified', label: 'ID / Passport Verified' },
                { id: 'bank_verified', label: 'Bank Details Verified' },
                { id: 'docs_verified', label: 'Documents Uploaded Correctly' },
                { id: 'salary_verified', label: 'Salary Verified (Payslip Match)' },
                { id: 'type_verified', label: 'Employment Type Verified' },
                { id: 'contract_verified', label: 'Permanent Contract Verified' },
              ].map((item) => (
                <label key={item.id} className="flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox"
                      checked={verificationState[item.id] || false}
                      onChange={(e) => setVerificationState(prev => ({ ...prev, [item.id]: e.target.checked }))}
                      className="w-5 h-5 rounded-lg border-slate-700 bg-slate-800 text-emerald-600 focus:ring-emerald-500 transition-all cursor-pointer appearance-none checked:bg-emerald-600 border-2"
                    />
                    {verificationState[item.id] && (
                      <CheckCircle2 className="absolute inset-0 w-5 h-5 text-white p-1 pointer-events-none" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors lowercase">{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowRejectModal(true)}
              disabled={isLoading || isProcessed}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 hover:bg-red-600 hover:text-white font-black uppercase text-[10px] tracking-widest transition-all shadow-sm active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <XCircle className="w-4 h-4" />
              Reject
            </button>
            <button
              onClick={() => setShowApproveModal(true)}
              disabled={isLoading || isProcessed || !allVerified}
              className="flex-1 cursor-pointer flex items-center justify-center gap-2 py-4 bg-blue-600 rounded-2xl text-white font-black uppercase text-[10px] tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve
            </button>
          </div>

          {isProcessed && (
            <div className="p-8 bg-blue-50 border border-blue-100 rounded-[32px] text-center space-y-2 animate-in slide-in-from-top-4">
              <p className="text-sm font-bold text-blue-600">This application has been finalized</p>
              <p className="text-[10px] text-blue-500 uppercase font-black tracking-widest opacity-60">Status: {application.status.toLowerCase()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Approval Confirmation Modal */}
      <Modal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        title="verify."
        maxWidth="max-w-md"
        isCompact={true}
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full">
            <button
              onClick={() => setShowApproveModal(false)}
              className="flex-1 py-4 bg-white border border-slate-200 rounded-[20px] text-[10px] font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              onClick={handleApprove}
              disabled={isLoading}
              className="flex-1 py-4 bg-blue-600 rounded-[20px] text-[10px] font-black text-white hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Confirm'}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-emerald-600 min-w-0">
            <div className="w-16 h-16 rounded-[24px] bg-emerald-50 flex items-center justify-center border border-emerald-100 shadow-sm flex-shrink-0">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-100 tracking-tighter lowercase leading-none">confirm.</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] font-mono mt-2 break-all">REFERENCE: {application.id}</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-4 sm:p-6 rounded-[24px]">
            <p className="text-slate-600 text-sm sm:text-base font-medium leading-relaxed lowercase italic">
              are you certain you want to verify this request? this will escalate it to <strong className="text-slate-100">credit assessment</strong>.
            </p>
          </div>
        </div>
      </Modal>

      {/* Rejection Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        title="reject."
        maxWidth="max-w-xl"
        isCompact={true}
        footer={
          <div className="flex flex-col-reverse sm:flex-row gap-3 sm:gap-4 w-full">
            <button
              onClick={() => setShowRejectModal(false)}
              className="flex-1 py-4 bg-white border border-slate-200 rounded-[20px] text-[10px] font-black text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all uppercase tracking-widest"
            >
              Back
            </button>
            <button
              onClick={handleReject}
              disabled={!rejectReason || (rejectReason === 'Other' && !otherReason) || isLoading}
              className="flex-1 py-4 bg-red-600 rounded-[20px] text-[10px] font-black text-white hover:bg-red-500 transition-all shadow-xl shadow-red-600/30 flex items-center justify-center gap-3 uppercase tracking-widest"
            >
              {isLoading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'Confirm'}
            </button>
          </div>
        }
      >
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-red-600 min-w-0">
            <div className="w-16 h-16 rounded-[24px] bg-red-50 flex items-center justify-center border border-red-100 shadow-sm flex-shrink-0">
              <AlertCircle className="w-8 h-8" />
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-2xl sm:text-3xl font-display font-black text-slate-100 tracking-tighter lowercase leading-none">reject.</h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] font-mono mt-2 break-all">REFERENCE: {application.id}</p>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Select Primary Reason</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {rejectionReasons.map((reason) => (
                <button
                  key={reason}
                  onClick={() => setRejectReason(reason)}
                  className={cn(
                      "text-left px-4 sm:px-6 py-3 sm:py-4 rounded-[20px] border transition-all text-xs font-bold flex items-center justify-between gap-3 shadow-sm min-w-0",
                      rejectReason === reason
                      ? "bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-500/20"
                      : "bg-white border-slate-200 text-slate-600 hover:border-blue-500/50"
                  )}
                >
                  <span className="text-left break-words">{reason}</span>
                  {rejectReason === reason && <div className="w-3 h-3 rounded-full bg-white shadow-lg flex-shrink-0"></div>}
                </button>
              ))}
            </div>

            {rejectReason === 'Other' && (
              <textarea
                className="input-field w-full h-32 p-4 sm:p-8 text-sm focus:border-red-500/50 rounded-[32px] mt-4 shadow-inner bg-slate-50"
                placeholder="provide specific audit-trail justification..."
                value={otherReason}
                onChange={(e) => setOtherReason(e.target.value)}
              />
            )}
          </div>
        </div>
      </Modal>

      <DocumentPreviewModal
        isOpen={!!previewTarget}
        onClose={() => setPreviewTarget(null)}
        documentTitle={previewTarget?.title}
        documentType={previewTarget?.type}
      />
    </div>
  );
};

const DetailCard = ({ title, icon: Icon, items, variant = 'slate' }) => {
  const iconColors = {
    slate: 'bg-slate-900 text-blue-600 border-slate-800',
    blue: 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 border-blue-500'
  };

  return (
    <div className="glass p-5 sm:p-6 rounded-[24px] border-slate-800/50 space-y-6 hover:shadow-xl transition-all duration-500 bg-slate-900/40 group overflow-hidden relative shadow-xl">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full translate-x-12 -translate-y-12 transition-all group-hover:bg-blue-600/10"></div>
      <div className="flex items-center gap-3 relative z-10">
        <div className={cn("p-2.5 rounded-xl border transition-all duration-500 group-hover:scale-110", iconColors[variant])}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-display font-black text-slate-200 lowercase tracking-tight">{title}</h3>
      </div>
      <div className="space-y-4 relative z-10">
        {items.map((item, i) => (
          <div key={i} className={cn("space-y-0.5 border-l-2 border-slate-800 pl-5 py-1 group-hover:border-blue-500/30 transition-all", item.highlight ? "border-blue-600/40" : "")}>
            <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">{item.label}</p>
            <p className={cn("text-base font-bold transition-all lowercase leading-tight", 
                item.variant === 'success' ? 'text-emerald-600' : 
                item.highlight ? 'text-blue-600 text-xl font-black' : 'text-slate-300'
            )}>{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default VerificationDetailsView;
