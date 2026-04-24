import React, { useEffect } from 'react';
import { 
  CheckCircle2, FileText, ArrowRight, Download, 
  User, Building, Calendar, DollarSign, Activity,
  Clock, CheckCircle, HelpCircle, Lock, LogIn, Hash
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const DetailRow = ({ label, value, icon: Icon, badge }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
    <div className="flex items-center gap-3 text-gray-500">
      {Icon && <Icon className="w-4 h-4" />}
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-sm font-black text-gray-900 text-right">{value}</span>
      {badge && (
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
          {badge}
        </span>
      )}
    </div>
  </div>
);

const TimelineStep = ({ number, title, isLast }) => (
  <div className="flex items-start gap-5">
    <div className="flex flex-col items-center">
      <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 text-blue-600 font-black text-xs flex items-center justify-center shrink-0 shadow-sm z-10">
        {number}
      </div>
      {!isLast && <div className="w-0.5 h-10 bg-blue-100 my-1"></div>}
    </div>
    <div className="pt-1.5 pb-2">
      <p className="text-sm font-bold text-gray-900">{title}</p>
    </div>
  </div>
);

export default function EmployeeApplicationSuccessPage() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-8 relative font-sans text-gray-900 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 -left-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 -right-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-3xl relative z-10 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        
        {/* 1. Success Hero Card */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-xl shadow-gray-200/40 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500"></div>
          
          <div className="w-24 h-24 bg-emerald-100 rounded-[28px] flex items-center justify-center mx-auto shadow-inner shadow-emerald-200/50">
            <CheckCircle2 className="w-12 h-12 text-emerald-600" />
          </div>
          
          <div className="space-y-3 max-w-lg mx-auto">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 tracking-tight leading-tight">
              Application Submitted Successfully
            </h1>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">
              Thank you! Your loan application has been securely received and is now under review by our team.
            </p>
          </div>
          
          <div className="pt-4 flex justify-center w-full">
             <button type="button" className="w-full sm:w-auto h-12 px-8 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95">
                <Download className="w-4 h-4" />
                <span>Download Summary</span>
             </button>
          </div>
        </div>

        {/* 2. Reference Details Card */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 tracking-tight">Application Reference</h2>
                <p className="text-[11px] font-medium text-gray-500 mt-0.5">Please save these details for your records</p>
              </div>
            </div>
            <button type="button" className="hidden sm:flex h-10 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg font-bold text-xs transition-all items-center gap-2 shadow-sm active:scale-95">
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
          <div className="p-6 sm:p-8">
            <DetailRow label="Reference Number" value="APP-20260423-9X8M" icon={Hash} />
            <DetailRow label="Applicant Name" value="John Doe" icon={User} />
            <DetailRow label="Employer Name" value="Global Tech Solutions" icon={Building} />
            <DetailRow label="Loan Amount" value="R4,000.00" icon={DollarSign} />
            <DetailRow label="Date Submitted" value="23 April 2026" icon={Calendar} />
            <DetailRow label="Current Status" value="Submitted" icon={Activity} badge="Processing" />
            <div className="pt-6 mt-6 border-t border-gray-100 flex sm:hidden">
               <button type="button" className="w-full h-12 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95">
                  <Download className="w-4 h-4" />
                  <span>Download Summary</span>
               </button>
            </div>
          </div>
        </div>

        {/* 3. What Happens Next Timeline */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-4">
            <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 tracking-tight">What Happens Next</h2>
              <p className="text-[11px] font-medium text-gray-500 mt-0.5">Application processing timeline</p>
            </div>
          </div>
          <div className="p-8 pb-10">
            <TimelineStep number="1" title="HR Verification" />
            <TimelineStep number="2" title="Credit Review" />
            <TimelineStep number="3" title="Finance Approval & Payout" />
            <TimelineStep number="4" title="Active Loan" isLast />
          </div>
        </div>

        {/* 4. Portal Access Section */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[24px] border border-blue-500 shadow-2xl shadow-blue-600/30 overflow-hidden text-white relative">
          <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Lock className="w-48 h-48" />
          </div>
          <div className="p-8 sm:p-10 relative z-10 space-y-8">
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">Track Your Application Anytime</h2>
              <p className="text-white/90 font-medium text-sm mt-2 leading-relaxed max-w-md">
                Create your portal password or sign in later to monitor the status of your application and upload pending documents.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full">
              <button 
                type="button" 
                onClick={() => navigate('/register')} 
                className="w-full sm:w-auto h-14 px-8 bg-white text-blue-700 hover:bg-blue-50 rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10 active:scale-[0.98]"
              >
                <Lock className="w-4 h-4" />
                <span>Complete Registration</span>
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/login')} 
                className="w-full sm:w-auto h-14 px-8 bg-blue-700/50 hover:bg-blue-700 border border-blue-500 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" />
                <span>Go to Login</span>
              </button>
            </div>
          </div>
        </div>

        {/* 5. Support Section */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-xl shadow-gray-200/40 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gray-100 rounded-[16px] flex items-center justify-center text-gray-600 shrink-0">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 tracking-tight">Need help with your application?</h3>
              <p className="text-xs font-medium text-gray-500 mt-1">Our support team is available during business hours.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3 shrink-0">
            <button 
              type="button" 
              onClick={() => navigate('/apply-loan')} 
              className="h-12 px-6 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              Start New Application
            </button>
            <button 
              type="button" 
              className="h-12 px-6 bg-gray-900 hover:bg-black text-white rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-gray-900/20 active:scale-[0.98]"
            >
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
