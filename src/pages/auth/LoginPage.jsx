import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Mail, Lock, LogIn, ShieldCheck, Building2, AlertCircle, CheckCircle2, XCircle, ArrowRight, User, Phone } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState(ROLES.EMPLOYEE);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(false);

  // Eligibility states
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [eligibilityStatus, setEligibilityStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const MOCK_COMPANIES = ['Global Tech Solutions', 'LMS Financial', 'Acme Corp', 'Stark Industries'];
  const filteredCompanies = MOCK_COMPANIES.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()));

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || `/${selectedRole}/dashboard`;

  const handleLogin = (e, targetEmail, targetPass, targetRole) => {
    if (e) e.preventDefault();
    setLoginError(false);
    setIsLoggingIn(true);
    
    setTimeout(() => {
      // Demo logic: if email is 'error@lms.demo', show error
      const currentEmail = targetEmail || email;
      if (currentEmail.includes('error')) {
        setLoginError(true);
        setIsLoggingIn(false);
        return;
      }

      const finalRole = targetRole || selectedRole;
      login(targetEmail || email, targetPass || password, finalRole);
      
      // Enforce strict dashboard redirection for all roles to prevent cross-role permission errors
      const targetPath = `/${finalRole}/dashboard`;
      setTimeout(() => {
        navigate(targetPath, { replace: true });
        setIsLoggingIn(false);
      }, 100);
    }, 400);
  };

  const hasExactMatch = MOCK_COMPANIES.some(c => c.toLowerCase() === searchQuery.toLowerCase().trim());

  const handleCheckEligibility = (e) => {
    e.preventDefault();
    if (!hasExactMatch) return;
    setIsChecking(true);
    setEligibilityStatus(null);
    setTimeout(() => {
      setIsChecking(false);
      const input = searchQuery.toLowerCase();
      if (input.includes('error') || input.includes('stark')) {
        setEligibilityStatus('error');
      } else {
        setEligibilityStatus('success');
      }
    }, 800);
  };

  const handleCompanyRequest = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEligibilityStatus('request-success');
    }, 1000);
  };

  return (
    <div className="min-h-screen min-h-dvh bg-slate-50 flex items-center justify-center p-4 sm:p-8 relative overflow-x-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 -left-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 -right-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 space-y-8">

        {/* Branding */}
        <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-blue-600 rounded-[20px] flex items-center justify-center mx-auto shadow-xl shadow-blue-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <div className="space-y-0.5">
            <h1 className="text-4xl font-display font-black text-black tracking-tighter lowercase leading-none">
              lenni<span className="text-blue-600">.</span>
            </h1>
            <p className="text-[10px] font-black text-black uppercase tracking-[0.2em]">Secure Entry Portal</p>
          </div>
        </div>

        <div className="glass w-full p-8 sm:p-12 lg:p-16 rounded-[40px] border-slate-200 shadow-2xl animate-in duration-700 delay-100 flex flex-col space-y-12 bg-white/95">

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-0 items-stretch divide-y lg:divide-y-0 lg:divide-x divide-slate-200">

            {/* Left Column: Company Check Section */}
            <div className="space-y-8 lg:pr-16 pb-10 lg:pb-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-black">
                  <Building2 className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Company Check</h2>
                </div>
                <p className="text-black text-xs font-medium leading-relaxed">Verify your company before applying.</p>
              </div>

              {!eligibilityStatus && (
                <div className="space-y-2 relative">
                  <form onSubmit={handleCheckEligibility} className="space-y-5 relative">
                    <div className="space-y-4">
                      <div className="relative group">
                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors z-10" />
                        <input
                          type="text"
                          placeholder="Enter your company name"
                          required
                          className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all w-full relative z-10"
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowDropdown(true);
                          }}
                          onFocus={() => setShowDropdown(true)}
                          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        />
                        {/* Typeahead Dropdown */}
                        {showDropdown && searchQuery && (
                          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2">
                            {filteredCompanies.length > 0 ? (
                              filteredCompanies.map((company, idx) => (
                                <div
                                  key={idx}
                                  className="px-5 py-4 bg-white hover:bg-blue-50 cursor-pointer text-sm font-bold text-black hover:text-blue-700 transition-colors border-b border-slate-100 last:border-0"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setSearchQuery(company);
                                    setShowDropdown(false);
                                  }}
                                >
                                  {company}
                                </div>
                              ))
                            ) : (
                              <div className="px-5 py-4 bg-slate-50/80 flex flex-col items-start gap-3">
                                <span className="text-sm text-slate-500 italic">No matches found...</span>
                                <button
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => {
                                    setShowDropdown(false);
                                    setEligibilityStatus('not-registered');
                                  }}
                                  className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1"
                                >
                                  Submit Employer Request <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isChecking || !hasExactMatch}
                      className={cn(
                        "w-full h-16 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg",
                        (isChecking || !hasExactMatch)
                          ? "bg-slate-100 text-slate-400 shadow-none cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/20 active:scale-[0.98]"
                      )}
                    >
                      {isChecking ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Select Company</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                  <div className="pt-4 px-1">
                    <p className="text-[12px] font-black text-black mb-2">Try typing:</p>
                    <div className="space-y-1.5 pl-2">
                      <p className="text-[12px] font-black text-black">1. Global Tech Solutions</p>
                      <p className="text-[12px] font-black text-black">2. LMS Financial</p>
                      <p className="text-[12px] font-black text-black">3. Acme Corp</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Result State Cards */}
              {eligibilityStatus && (
                <div className="animate-in zoom-in-95 duration-300">
                  {eligibilityStatus === 'success' && (
                    <div className="space-y-6">
                      <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-start gap-4">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-emerald-800 text-sm font-black tracking-tight uppercase">Company Found</p>
                          <p className="text-emerald-700/80 text-xs font-medium leading-relaxed mt-1">Your company '{searchQuery}' is eligible for our lending protocol.</p>
                        </div>
                      </div>
                      <button onClick={() => navigate('/apply-loan')} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                        <span>Apply for Loan</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button onClick={() => setEligibilityStatus(null)} className="w-full text-center text-xs font-bold text-black opacity-60 hover:opacity-100 transition-all">
                        Search for a different company
                      </button>
                    </div>
                  )}

                  {eligibilityStatus === 'not-registered' && (
                    <form onSubmit={(e) => { e.preventDefault(); handleCompanyRequest(); }} className="space-y-6 animate-in slide-in-from-right-4 fade-in duration-500">
                      <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-amber-800 text-sm font-black tracking-tight uppercase">Company Not Found</p>
                          <p className="text-amber-700/80 text-xs font-medium leading-relaxed mt-1">Submit a request to add your company.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="relative group">
                          <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                          <input type="text" required placeholder="Company Name" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all w-full" />
                        </div>
                        <div className="relative group">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                          <input type="text" required placeholder="Contact Person" className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all w-full" />
                        </div>
                        <div className="relative group">
                          <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                          <input type="email" required placeholder="Email Address" className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all w-full" />
                        </div>
                        <div className="relative group">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                          <input type="tel" required placeholder="Phone Number" className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all w-full" />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-16 bg-black hover:bg-[#222222] text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <span>Submit Employer Request</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                      <button type="button" onClick={() => setEligibilityStatus(null)} className="w-full text-center text-xs font-bold text-black opacity-60 hover:opacity-100 transition-all uppercase tracking-widest pt-2">
                        Cancel & Go Back
                      </button>
                    </form>
                  )}

                  {eligibilityStatus === 'request-success' && (
                    <div className="space-y-6 animate-in zoom-in-95 duration-300">
                      <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-emerald-900 text-lg font-black tracking-tight">Request Submitted</p>
                          <p className="text-emerald-700 text-sm font-medium leading-relaxed mt-2">
                            We have received your registration request for "{searchQuery}". Our team will verify and notify you shortly.
                          </p>
                        </div>
                      </div>
                      <button onClick={() => setEligibilityStatus(null)} className="w-full h-16 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-[0.98]">
                        Back to Search
                      </button>
                    </div>
                  )}

                  {eligibilityStatus === 'error' && (
                    <div className="space-y-6">
                      <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-4">
                        <XCircle className="w-6 h-6 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-red-800 text-sm font-black tracking-tight uppercase">Unable to verify right now</p>
                          <p className="text-red-700/80 text-xs font-medium leading-relaxed mt-1">System is currently busy. Please try again later.</p>
                        </div>
                      </div>
                      <button onClick={() => setEligibilityStatus(null)} className="w-full h-16 bg-white border border-slate-200 hover:bg-slate-50 text-black rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
                        <span>Try Again</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right Column: Login Portal */}
            <div className="space-y-8 lg:pl-16 pt-10 lg:pt-0">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-black">
                  <LogIn className="w-5 h-5 text-blue-600" />
                  <h2 className="text-sm font-black uppercase tracking-widest">Login Portal</h2>
                </div>
                <p className="text-black text-xs font-medium leading-relaxed">Sign in to manage your corporate lending portfolio.</p>
              </div>

              <form onSubmit={(e) => handleLogin(e)} className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      required
                      className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-black group-focus-within:text-blue-600 transition-colors" />
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      className="input-field pl-14 h-16 text-sm bg-slate-50/50 placeholder:text-slate-400 text-black border-slate-200 focus:border-blue-600 transition-all"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button type="button" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                </div>
                {loginError && (
                  <div className="bg-red-50 border border-red-100 p-4 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <p className="text-[11px] font-bold text-red-600 text-center">Invalid email or password.</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-blue-600 hover:bg-blue-700 h-16 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] shadow-xl shadow-blue-600/20"
                >
                  {isLoggingIn ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <>
                      <span>Access Dashboard</span>
                      <LogIn className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

          </div>

          {/* Quick Login Section */}
          <div className="space-y-6 pt-10 border-t border-slate-200">
            <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] text-center">Development Quick Login Access</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {Object.entries(ROLES).map(([key, role]) => (
                <button
                  key={role}
                  type="button"
                  disabled={isLoggingIn}
                  onClick={() => {
                    setEmail(`${role}@lms.demo`);
                    setPassword('password123');
                    setSelectedRole(role);
                    setLoginError(false);
                  }}
                  className="min-w-[120px] px-4 py-4 text-[9px] font-black uppercase tracking-widest bg-slate-50 text-black rounded-xl border border-slate-200 transition-all hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:scale-105 text-center shadow-sm disabled:opacity-50"
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-slate-500 font-semibold uppercase tracking-[0.15em] animate-in fade-in duration-1000 delay-500">
          &copy; 2026 Lenni Financial Infrastructure. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default LoginPage;
