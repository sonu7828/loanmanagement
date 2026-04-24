import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  FileText,
  User,
  AlertCircle,
  FileCheck,
  ShieldCheck,
  Zap,
  Loader2
} from 'lucide-react';
import { useLoans, STATUSES, LIFECYCLE_STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import Modal from '../../components/ui/Modal';

const STATUS_CONFIG = {
  [STATUSES.CREDIT_PENDING]: { color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock },
  [STATUSES.UNDER_REVIEW]: { color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: ShieldAlert },
  [STATUSES.APPROVED]: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle2 },
};

const RISK_CONFIG = {
  'Low': { color: 'text-emerald-400', bg: 'bg-emerald-400/10', icon: TrendingDown },
  'Medium': { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: Zap },
  'High': { color: 'text-rose-400', bg: 'bg-rose-400/10', icon: TrendingUp },
};

const CreditQueue = () => {
  const { applications, transitionLoanLifecycle } = useLoans();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [decision, setDecision] = useState(null); // 'APPROVE' or 'REJECT'
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter applications for the Credit Queue (HR verified only)
  const filteredApps = useMemo(() => {
    return applications.filter(app => {
      const isCreditModule = app.lifecycleStatus === LIFECYCLE_STATUSES.HR_VERIFIED;
      const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.id.toLowerCase().includes(searchTerm.toLowerCase());
      return isCreditModule && matchesSearch;
    });
  }, [applications, searchTerm]);

  const handleRowClick = (app) => {
    setSelectedApp(app);
    setShowDetail(true);
  };

  const initiateDecision = (type) => {
    setDecision(type);
    setShowConfirm(true);
  };

  const handleFinalAction = async () => {
    setIsProcessing(true);
    // Simulate API delay for polish
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const action = decision === 'APPROVE' ? LIFECYCLE_ACTIONS.CREDIT_APPROVE : LIFECYCLE_ACTIONS.CREDIT_REJECT;
    transitionLoanLifecycle(selectedApp.id, action, 'Credit Officer', `Credit Decision: ${decision}${notes ? ' - ' + notes : ''}`);
    
    setIsProcessing(false);
    setShowConfirm(false);
    setShowDetail(false);
    setSelectedApp(null);
    setDecision(null);
    setNotes('');
  };

  const getRiskScoreWidth = (score) => {
    if (!score) return '0%';
    return `${((score - 300) / 550) * 100}%`;
  };

  const calculateDSR = (app) => {
    if (!app.amount || !app.salary) return 'N/A';
    // Simplified DSR: (Loan / 12) / Monthly Salary
    const monthlyPayment = (app.amount * 1.25) / 12; // Assuming 25% total interest/fees for demo
    const dsr = (monthlyPayment / app.salary) * 100;
    return dsr.toFixed(1) + '%';
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-100 tracking-tight">Ready for Credit Decisions</h1>
          <p className="text-slate-500 text-sm mt-1 uppercase font-black tracking-widest">Decision Support & Risk Assessment</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="Search by ID or applicant name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 w-full md:w-80 transition-all font-medium"
            />
          </div>
          <button className="p-2.5 bg-slate-900/50 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Pending Reviews', value: filteredApps.length, icon: Clock, color: 'text-blue-400' },
          { label: 'High Risk Alert', value: filteredApps.filter(a => a.risk === 'High').length, icon: ShieldAlert, color: 'text-rose-400' },
          { label: 'Avg Credit Score', value: '640', icon: Zap, color: 'text-amber-400' },
          { label: 'Today\'s Decisions', value: '0', icon: CheckCircle2, color: 'text-emerald-400' },
        ].map((stat, i) => (
          <div key={i} className="glass p-5 rounded-[24px] border border-slate-800/50 flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{stat.label}</p>
              <p className="text-xl font-display font-bold text-white mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Queue Display */}
      <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-2xl">
        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-950/50 border-b border-slate-800/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Application ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Applicant Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Requested</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Credit Score</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Risk Level</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/30">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => handleRowClick(app)}
                    className="hover:bg-blue-600/5 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase tracking-tight">{app.id}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-200">{app.name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{app.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-white">R {app.amount?.toLocaleString()}</span>
                        <span className="text-[10px] text-slate-500 font-medium uppercase tracking-tighter">Gross: R {app.salary?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className={`text-sm font-bold ${app.score > 700 ? 'text-emerald-400' : app.score > 600 ? 'text-amber-400' : 'text-rose-400'}`}>
                          {app.score || 'N/A'}
                        </span>
                        {app.score && (
                          <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${app.score > 700 ? 'bg-emerald-500' : app.score > 600 ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: `${(app.score / 850) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${RISK_CONFIG[app.risk]?.bg} ${RISK_CONFIG[app.risk]?.color}`}>
                        {React.createElement(RISK_CONFIG[app.risk]?.icon || AlertCircle, { className: "w-3 h-3" })}
                        {app.risk || 'Unknown'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.color} ${STATUS_CONFIG[app.status]?.border}`}>
                        {React.createElement(STATUS_CONFIG[app.status]?.icon || Clock, { className: "w-3 h-3" })}
                        {app.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-slate-500 hover:text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-50">
                      <FileCheck className="w-12 h-12 text-slate-600 mb-2" />
                      <p className="text-slate-400 font-bold">No applications requiring credit review</p>
                      <p className="text-xs text-slate-600 uppercase tracking-widest">Queue is currently clear</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-800/40">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <div 
                key={app.id} 
                onClick={() => handleRowClick(app)}
                className="p-6 space-y-4 hover:bg-blue-600/5 transition-colors active:bg-blue-600/10"
              >
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight">{app.id}</span>
                        <p className="text-sm font-bold text-slate-200">{app.name}</p>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${STATUS_CONFIG[app.status]?.bg} ${STATUS_CONFIG[app.status]?.color} ${STATUS_CONFIG[app.status]?.border}`}>
                        {app.status}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50">
                    <div>
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Requested</p>
                        <p className="text-sm font-black text-white">R {app.amount?.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Risk Level</p>
                        <div className={`inline-flex items-center gap-1 font-bold ${RISK_CONFIG[app.risk]?.color} text-xs uppercase`}>
                            {app.risk}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Credit Score</span>
                            <span className={`font-display font-black ${app.score > 700 ? 'text-emerald-400' : app.score > 600 ? 'text-amber-400' : 'text-rose-400'}`}>
                                {app.score || 'N/A'}
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600/10 text-blue-400 font-bold text-[10px] uppercase tracking-widest border border-blue-600/20">
                        Review Case
                    </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-16 text-center space-y-4">
              <FileCheck className="w-12 h-12 text-slate-800 mx-auto" />
              <div>
                <p className="text-slate-400 font-bold">Queue Clear</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-[0.2em] mt-1">Ready for next batch</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <Modal 
        isOpen={showDetail} 
        onClose={() => setShowDetail(false)} 
        title="Credit Assessment Profile"
        maxWidth="max-w-5xl"
      >
        {selectedApp && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column: Basic Info */}
              <div className="md:col-span-2 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="w-20 h-20 rounded-3xl bg-blue-600/10 flex items-center justify-center border border-blue-500/20 shadow-xl shadow-blue-600/10">
                    <User className="w-10 h-10 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-bold text-white tracking-tight">{selectedApp.name}</h2>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">{selectedApp.id}</span>
                      <div className="w-1 h-1 bg-slate-700 rounded-full" />
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-widest text-blue-400">{selectedApp.company}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800/50 shadow-inner">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Requested Capital</p>
                    <p className="text-xl font-display font-black text-white">R {selectedApp.amount?.toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-500 font-bold mt-1 uppercase tracking-tighter">Approved for HR Limit</p>
                  </div>
                  <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800/50 shadow-inner">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Monthly Salary</p>
                    <p className="text-xl font-display font-black text-white">R {selectedApp.salary?.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Verified Gross</p>
                  </div>
                  <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800/50 shadow-inner">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">DSR Ratio</p>
                    <p className="text-xl font-display font-black text-blue-400">{calculateDSR(selectedApp)}</p>
                    <p className="text-[10px] text-slate-500 font-bold mt-1 uppercase tracking-tighter">Affordability Index</p>
                  </div>
                </div>

                {/* Score Area */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    Bureau Credit Score
                  </h3>
                  <div className="bg-slate-950/50 border border-slate-800/50 rounded-3xl p-8 space-y-6 shadow-inner">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Internal Risk Ranking</p>
                        <p className={decision === 'APPROVE' ? 'text-emerald-400' : 'text-slate-200'}>
                           <span className="text-4xl font-display font-black">{selectedApp.score || '640'}</span>
                           <span className="text-lg text-slate-500 font-bold ml-2">/ 850</span>
                        </p>
                      </div>
                      <div className={`px-4 py-2 rounded-2xl border ${RISK_CONFIG[selectedApp.risk]?.bg} ${RISK_CONFIG[selectedApp.risk]?.color} ${RISK_CONFIG[selectedApp.risk]?.color.replace('text', 'border')}/20`}>
                        <span className="text-xs font-black uppercase tracking-[0.2em]">{selectedApp.risk} Risk</span>
                      </div>
                    </div>
                    
                    <div className="relative h-3 bg-slate-900 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className={`absolute h-full rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.3)] ${
                          selectedApp.score > 700 ? 'bg-emerald-500' : selectedApp.score > 600 ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                        style={{ width: getRiskScoreWidth(selectedApp.score) }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] px-1">
                      <span>300</span>
                      <span>500</span>
                      <span>700</span>
                      <span>850</span>
                    </div>
                  </div>
                </div>

                {/* Document Verification */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-blue-400" />
                    Verified Documents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {['Recent Payslip', '3-Month Bank Statement', 'Proof of ID', 'Employment Contract'].map((doc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-800/50 rounded-2xl hover:bg-slate-800/50 transition-all cursor-pointer group shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center border border-slate-800 group-hover:bg-blue-600/10 group-hover:border-blue-500/20 transition-all">
                            <FileText className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                          </div>
                          <span className="text-xs font-bold text-slate-400 group-hover:text-slate-100 transition-colors">{doc}</span>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Decision Panel */}
              <div className="space-y-6">
                <div className="glass p-8 rounded-[40px] border border-slate-700/50 space-y-8 sticky top-0 shadow-2xl relative overflow-hidden bg-slate-900/60 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl -z-1" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
                       <h3 className="text-lg font-display font-bold text-white tracking-tight">Executive Decision</h3>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest border-l border-slate-700 pl-4 py-1 leading-relaxed">
                      Final authorization moves flow to Finance. Ensure all risk mitigations are documented.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between ml-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Decision Rationale</label>
                      <span className="text-[10px] text-slate-600 font-bold uppercase tracking-widest italic">Optional</span>
                    </div>
                    <textarea 
                      className="w-full h-40 bg-slate-950/80 border border-slate-800 rounded-[28px] p-5 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/30 transition-all font-medium resize-none shadow-inner custom-scrollbar"
                      placeholder="Enter specific risk assessment notes or conditions for approval..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  <div className="space-y-4 pt-4">
                    <button 
                      onClick={() => initiateDecision('APPROVE')}
                      className="group w-full py-5 bg-emerald-600 text-white rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Approve Disbursement
                    </button>
                    <button 
                      onClick={() => initiateDecision('REJECT')}
                      className="group w-full py-5 bg-slate-950 border border-slate-800 text-rose-400 rounded-[24px] font-black uppercase text-xs tracking-[0.2em] hover:bg-rose-950/20 hover:border-rose-900 transition-all shadow-inner active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                      <XCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      Reject Application
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-800/50">
                    <div className="flex items-center gap-2 text-[9px] text-slate-600 font-black uppercase tracking-widest">
                       <ShieldCheck className="w-3 h-3" />
                       Secure Auditor Logging Enabled
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Confirmation Modal */}
      <Modal 
        isOpen={showConfirm} 
        onClose={() => !isProcessing && setShowConfirm(false)} 
        title="Verification Lock"
        maxWidth="max-w-md"
      >
        <div className="text-center space-y-6 py-4">
          <div className={`w-24 h-24 rounded-[36px] mx-auto flex items-center justify-center border-2 animate-in zoom-in-75 duration-500 shadow-2xl ${
            decision === 'APPROVE' 
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/10" 
              : "bg-rose-500/10 border-rose-500/20 text-rose-500 shadow-rose-500/10"
          }`}>
            {decision === 'APPROVE' ? <ShieldCheck className="w-12 h-12" /> : <ShieldAlert className="w-12 h-12" />}
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-display font-bold text-white tracking-tight">Confirm Policy Action?</h3>
            <p className="text-slate-400 text-sm font-medium px-4">
              Authorized User: <span className="text-slate-200">Credit Officer</span><br/>
              Target State: <span className={decision === 'APPROVE' ? 'text-emerald-400' : 'text-rose-400'}>{decision === 'APPROVE' ? 'APPROVED' : 'REJECTED'}</span>
            </p>
          </div>
          
          <div className="flex gap-4 pt-4 px-2">
            <button 
              disabled={isProcessing}
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-4 bg-slate-950 border border-slate-800 text-slate-500 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              disabled={isProcessing}
              onClick={handleFinalAction}
              className={`flex-1 py-4 rounded-[20px] font-black uppercase text-xs tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 ${
                decision === 'APPROVE' ? "bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20" : "bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20"
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Confirm
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreditQueue;
