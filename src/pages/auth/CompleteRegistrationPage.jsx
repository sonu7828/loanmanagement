import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, Mail, Eye, EyeOff, ArrowLeft, ShieldCheck,
  CheckCircle2, Building2, Shield, KeyRound
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function CompleteRegistrationPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative font-sans text-gray-900 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 -left-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 -right-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-4xl flex flex-col lg:flex-row bg-white rounded-[24px] sm:rounded-[32px] shadow-2xl shadow-gray-200/50 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500 max-h-[95vh] lg:max-h-[800px]">
        
        {/* Left Side: Context / Branding */}
        <div className="lg:w-5/12 bg-gradient-to-br from-blue-600 to-blue-900 p-8 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between hidden sm:flex">
          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <ShieldCheck className="w-56 h-56" />
          </div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 shadow-sm">
               <Building2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-display font-black tracking-tight leading-tight">
              Lenni Secure<br/>Portal Activation
            </h1>
            <p className="text-blue-100 font-medium text-xs lg:text-sm mt-3 leading-relaxed">
              Complete your registration to access your personalized employee dashboard, track loan statuses, and manage your documents securely.
            </p>
          </div>

          <div className="relative z-10 mt-8 space-y-5">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-sm">
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-200 mb-1">Application Reference</p>
              <p className="text-base font-black tracking-widest text-white">APP-20260423-9X8M</p>
            </div>
            
            <div className="flex items-center gap-3 text-blue-100">
              <Shield className="w-5 h-5 text-emerald-400 shrink-0" />
              <p className="text-[11px] font-medium leading-relaxed">Bank-grade encryption applied to all personal data.</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:w-7/12 p-6 lg:p-10 relative flex flex-col justify-center overflow-y-auto">
          <button 
            onClick={() => navigate('/login')}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-10 h-10 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-500 rounded-full flex items-center justify-center transition-all z-20"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="w-full max-w-sm mx-auto space-y-6">
            <div>
              <h2 className="text-xl lg:text-2xl font-black text-gray-900 tracking-tight">Complete Registration</h2>
              <p className="text-xs lg:text-sm font-medium text-gray-500 mt-1">Setup your secure login credentials.</p>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              
              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your registered email"
                    className="w-full h-11 pl-10 pr-4 text-xs bg-gray-50/50 placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                </div>
              </div>

              {/* OTP */}
              <div className="space-y-1">
                <div className="flex justify-between items-center h-4">
                  <label className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Verification OTP</label>
                  {!otpSent && (
                    <button type="button" onClick={() => setOtpSent(true)} className="text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700">
                      Send OTP
                    </button>
                  )}
                  {otpSent && (
                    <span className="text-[9px] font-black uppercase tracking-widest text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Sent
                    </span>
                  )}
                </div>
                <div className="relative group">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    className="w-full h-11 pl-10 pr-4 text-xs tracking-[0.2em] font-bold bg-gray-50/50 placeholder:text-gray-400 placeholder:font-normal placeholder:tracking-normal text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-gray-100 my-2"></div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Create Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    className="w-full h-11 pl-10 pr-10 text-xs bg-gray-50/50 placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                <div className="flex gap-1.5 pt-1">
                  <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                  <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                  <div className="h-1 flex-1 bg-gray-200 rounded-full"></div>
                </div>
                <p className="text-[9px] font-bold text-gray-500 mt-0.5 uppercase tracking-widest">Strength: Fair</p>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-900 uppercase tracking-wider">Confirm Password</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors pointer-events-none" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Repeat your password"
                    className="w-full h-11 pl-10 pr-10 text-xs bg-gray-50/50 placeholder:text-gray-400 text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-4">
                <button type="button" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-[0.98]">
                  <Lock className="w-4 h-4" />
                  <span>Complete Registration</span>
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
