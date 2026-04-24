import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Briefcase, Calendar, DollarSign, Building, 
  CreditCard, Upload, ArrowRight, FileText,
  ShieldCheck, Activity, Users, FileSignature, Check, ChevronDown,
  Smartphone, AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { SectionHeader } from '../../components/ui/Shared';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FormGroup = ({ label, icon: Icon, type = "text", placeholder, options, value, onChange, readOnly, helperText, extraAction, error, ...rest }) => (
  <div className="space-y-1.5 w-full flex flex-col justify-start">
    <div className="flex justify-between items-center h-4">
      <label className={cn("text-xs font-bold uppercase tracking-wider", error ? "text-red-600" : "text-gray-900")}>{label}</label>
      {extraAction}
    </div>
    <div className={cn("relative group", readOnly && "opacity-90")}>
      {Icon && <Icon className={cn("absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors pointer-events-none z-10", error ? "text-red-500" : "text-gray-500 group-focus-within:text-blue-600")} />}
      {type === 'select' ? (
        <>
          <select 
            {...(value !== undefined ? { value, onChange } : { defaultValue: "" })}
            disabled={readOnly}
            className={cn(
              "w-full h-14 text-sm bg-gray-50/50 text-gray-900 border rounded-xl focus:bg-white transition-all outline-none appearance-none cursor-pointer relative z-0",
              Icon ? "pl-11 pr-10" : "px-4",
              readOnly && "bg-gray-100 cursor-not-allowed border-gray-200 text-gray-600",
              error ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20" : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
            )}
            {...rest}
          >
            <option value="" disabled hidden className="text-gray-500">{placeholder || `Select`}</option>
            {options?.map(opt => <option key={opt} value={opt} className="py-2 text-gray-900 bg-white">{opt}</option>)}
          </select>
          {!readOnly && <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />}
        </>
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          placeholder={placeholder || `Enter ${label.toLowerCase()}`}
          className={cn(
            "w-full h-14 text-sm bg-gray-50/50 placeholder:text-gray-500 text-gray-900 border rounded-xl focus:bg-white transition-all outline-none",
            Icon ? "pl-11 pr-4" : "px-4",
            readOnly && "bg-gray-100 cursor-not-allowed border-gray-200 focus:ring-0 focus:border-gray-200 text-gray-600",
            error ? "border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-600/20" : "border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20"
          )}
          {...rest}
        />
      )}
    </div>
    {helperText && <p className={cn("text-[10px] font-bold leading-tight tracking-wide", error ? "text-red-500" : "text-gray-500")}>{helperText}</p>}
  </div>
);

const SectionCard = ({ title, icon: Icon, description, children }) => (
  <div className="bg-white rounded-[24px] sm:rounded-[32px] border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
    <div className="p-5 sm:p-8 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
      </div>
      <div>
        <h2 className="text-base sm:text-lg font-black text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="text-[11px] sm:text-xs font-medium text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-5 sm:p-8">
      {children}
    </div>
  </div>
);

const FileUpload = ({ label }) => (
  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 hover:border-blue-400 transition-colors cursor-pointer group h-full min-h-[140px]">
    <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
      <Upload className="w-5 h-5" />
    </div>
    <p className="text-sm font-bold text-gray-900">{label}</p>
    <p className="text-xs text-gray-700 mt-1">Click to upload or drag and drop</p>
    <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-wider">PDF, JPG, PNG (Max 5MB)</p>
  </div>
);

const CheckboxItem = ({ id, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
    <div className="relative flex items-center mt-0.5">
      <input type="checkbox" id={id} className="peer sr-only" checked={checked} onChange={onChange} />
      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3]" />
      </div>
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-relaxed select-none">{label}</span>
  </label>
);

const LoanApplication = () => {
  const navigate = useNavigate();
  const { addApplication, canApply } = useLoans();
  const { user } = useAuth();
  const [error, setError] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: user?.name?.split(' ')[0] || '',
    surname: user?.name?.split(' ').slice(1).join(' ') || '',
    postalAddress: '',
    previouslyDisadvantaged: '',
    ethnicGroup: '',
    female: '',
    disability: '',
    employerName: '',
    employerDivision: '',
    employmentType: 'Permanent',
    contractEndDate: '',
    seasonEndDate: '',
    salaryFrequency: 'Monthly',
    grossIncome: '',
    expenses: '',
    bankName: '',
    loanAmount: 400,
    loanTerm: '',
    chk1: false,
    chk2: false,
    chk3: false,
    chk4: false,
    chk5: false,
    chk6: false,
  });

  const [signatureMethod, setSignatureMethod] = useState('draw');

  const isEligible = user ? canApply(user.email) : true;

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }));
  };

  const getTermOptions = () => {
    if (formData.salaryFrequency === 'Monthly') return ['1 Month', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'];
    if (formData.salaryFrequency === 'Weekly') return ['4 Weeks', '8 Weeks', '12 Weeks', '16 Weeks', '20 Weeks', '24 Weeks'];
    if (formData.salaryFrequency === 'Fortnightly') return ['2 Fortnights', '4 Fortnights', '6 Fortnights', '8 Fortnights', '10 Fortnights', '12 Fortnights'];
    return [];
  };

  const calculateNetIncome = () => {
    const gross = parseFloat(formData.grossIncome) || 0;
    const exp = parseFloat(formData.expenses) || 0;
    return Math.max(0, gross - exp).toFixed(2);
  };

  const allCheckboxesChecked = formData.chk1 && formData.chk2 && formData.chk3 && formData.chk4 && formData.chk5 && formData.chk6;

  const handleSubmit = () => {
    if (!isEligible) {
      setError('You already have an active loan or application and are currently not eligible for a new request.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (!allCheckboxesChecked) {
      setError('Please agree to all terms and conditions before submitting.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      addApplication({
        name: `${formData.name} ${formData.surname}`,
        email: user?.email || '',
        company: formData.employerName,
        amount: formData.loanAmount,
        idNumber: '', // Handled by backend/document upload
        salary: calculateNetIncome(),
        purpose: 'Personal'
      });
      navigate('/employee/status');
    } catch (err) {
      setError(err.message);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in duration-700 pb-20">
      <SectionHeader
        title="Loan Application"
        description="Please complete all sections to submit your application for processing."
      />

      {error && (
        <div className="bg-red-50 border border-red-200 p-6 rounded-[24px] flex items-center gap-4 text-red-600 animate-in">
          <AlertCircle className="w-6 h-6" />
          <p className="font-bold text-sm tracking-tight">{error}</p>
        </div>
      )}

      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        
        {/* 1. Personal Information */}
        <SectionCard title="1. Personal Information" icon={User} description="Tell us about yourself.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <FormGroup label="Name" icon={User} value={formData.name} onChange={e => updateFormData({name: e.target.value})} />
            <FormGroup label="Surname" icon={User} value={formData.surname} onChange={e => updateFormData({surname: e.target.value})} />
            <div className="md:col-span-2">
              <FormGroup label="Postal Address" icon={MapPin} value={formData.postalAddress} onChange={e => updateFormData({postalAddress: e.target.value})} />
            </div>
            <FormGroup label="Previously Disadvantaged" type="select" icon={Activity} options={['Yes', 'No']} value={formData.previouslyDisadvantaged} onChange={e => updateFormData({previouslyDisadvantaged: e.target.value})} />
            <FormGroup label="Ethnic Group" type="select" icon={Users} options={['Black', 'Coloured', 'Indian']} value={formData.ethnicGroup} onChange={e => updateFormData({ethnicGroup: e.target.value})} />
            <FormGroup label="Female" type="select" icon={User} options={['Yes', 'No']} value={formData.female} onChange={e => updateFormData({female: e.target.value})} />
            <FormGroup label="Disability" type="select" icon={Activity} options={['Yes', 'No']} value={formData.disability} onChange={e => updateFormData({disability: e.target.value})} />
          </div>
        </SectionCard>

        {/* 2. Employment Information */}
        <SectionCard title="2. Employment Information" icon={Briefcase} description="Your current work details.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <FormGroup label="Employer Name" icon={Building} value={formData.employerName} onChange={e => updateFormData({employerName: e.target.value})} />
            <FormGroup label="Employer Division" icon={Building} value={formData.employerDivision} onChange={e => updateFormData({employerDivision: e.target.value})} />
            <div className="md:col-span-2">
              <FormGroup 
                label="Employment Type" 
                type="select" 
                icon={Briefcase} 
                options={['Permanent', 'Contract', 'Seasonal']} 
                value={formData.employmentType}
                onChange={e => updateFormData({employmentType: e.target.value})}
              />
            </div>
            {formData.employmentType === 'Contract' && (
              <FormGroup label="Contract End Date" type="date" icon={Calendar} value={formData.contractEndDate} onChange={e => updateFormData({contractEndDate: e.target.value})} />
            )}
            {formData.employmentType === 'Seasonal' && (
              <FormGroup label="Season End Date" type="date" icon={Calendar} value={formData.seasonEndDate} onChange={e => updateFormData({seasonEndDate: e.target.value})} />
            )}
          </div>
        </SectionCard>

        {/* 3. Financial Information */}
        <SectionCard title="3. Financial Information" icon={DollarSign} description="Income, expenses, and banking details.">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <FormGroup 
              label="Salary Frequency" 
              icon={Calendar} 
              type="select" 
              options={['Monthly', 'Fortnightly', 'Weekly']} 
              value={formData.salaryFrequency}
              onChange={e => {
                updateFormData({salaryFrequency: e.target.value, loanTerm: ''});
              }}
            />
            <div className="hidden md:block"></div>
            <FormGroup label="Gross Income" icon={DollarSign} type="number" placeholder="0.00" value={formData.grossIncome} onChange={e => updateFormData({grossIncome: e.target.value})} />
            <FormGroup label="Total Expenses" icon={DollarSign} type="number" placeholder="0.00" value={formData.expenses} onChange={e => updateFormData({expenses: e.target.value})} />
            <div className="md:col-span-2">
              <div className="h-px w-full bg-gray-200 my-1"></div>
            </div>
            <FormGroup label="Net Income" icon={DollarSign} type="number" placeholder="0.00" value={calculateNetIncome()} readOnly={true} />
            <div className="hidden md:block"></div>
            <FormGroup label="Bank Name" icon={Building} value={formData.bankName} onChange={e => updateFormData({bankName: e.target.value})} />
            <FormGroup 
              label="Branch Code" 
              icon={Activity} 
              readOnly={true}
              value={formData.bankName ? "Universal (250655)" : ""}
              extraAction={<span className="text-[9px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Auto-filled</span>}
            />
          </div>
        </SectionCard>

        {/* 4. Loan Request */}
        <SectionCard title="4. Loan Request" icon={CreditCard} description="How much do you need?">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
            <FormGroup 
              label="Loan Amount" 
              icon={DollarSign} 
              type="number" 
              placeholder="0.00" 
              helperText="Minimum R400 • Increments of R400 • Maximum R8000"
              value={formData.loanAmount}
              onChange={e => updateFormData({loanAmount: e.target.value})}
              min="400"
              max="8000"
              step="400"
              error={
                formData.loanAmount !== '' && 
                (parseFloat(formData.loanAmount) < 400 || 
                 parseFloat(formData.loanAmount) > 8000 || 
                 parseFloat(formData.loanAmount) % 400 !== 0)
              }
            />
            <FormGroup 
              label="Loan Term" 
              icon={Calendar} 
              type="select" 
              options={getTermOptions()} 
              value={formData.loanTerm}
              onChange={e => updateFormData({loanTerm: e.target.value})}
            />
          </div>
        </SectionCard>

        {/* 5. Documents Upload */}
        <SectionCard title="5. Documents Upload" icon={Upload} description="Provide supporting documents.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FileUpload label="ID Document" />
            <FileUpload label="Latest Payslip" />
            <FileUpload label="Bank Statement" />
            <FileUpload label="Other Document" />
          </div>
        </SectionCard>

        {/* 6. Agreement */}
        <SectionCard title="6. Agreement" icon={ShieldCheck} description="Please review and agree to our terms.">
          <div className="space-y-8">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 h-56 overflow-y-auto text-sm text-gray-700 space-y-4">
              <p className="font-black text-gray-900 uppercase tracking-tight">Terms and Conditions of Loan Application</p>
              <p className="leading-relaxed">1. By submitting this application, I confirm that all information provided is true and correct to the best of my knowledge.</p>
              <p className="leading-relaxed">2. I authorize the lender to perform necessary credit checks, background checks, and employment verification to assess affordability.</p>
              <p className="leading-relaxed">3. I understand that the loan approval is subject to the lender's credit policies and affordability assessments as required by the NCA.</p>
              <p className="leading-relaxed">4. I agree to provide any additional documentation that may be required to process this application efficiently.</p>
              <p className="leading-relaxed">5. The lender reserves the right to decline this application based on internal risk protocols without providing detailed reasons.</p>
              <p className="leading-relaxed">6. I consent to the processing, sharing, and storage of my personal information in accordance with applicable privacy laws.</p>
            </div>

            <div className="space-y-5 p-2">
              <CheckboxItem id="chk1" label="I have read and agree to the Terms and Conditions." checked={formData.chk1} onChange={e => updateFormData({chk1: e.target.checked})} />
              <CheckboxItem id="chk2" label="I consent to a credit check being performed." checked={formData.chk2} onChange={e => updateFormData({chk2: e.target.checked})} />
              <CheckboxItem id="chk3" label="I confirm that I am not currently under debt review." checked={formData.chk3} onChange={e => updateFormData({chk3: e.target.checked})} />
              <CheckboxItem id="chk4" label="I consent to my employer confirming my employment details." checked={formData.chk4} onChange={e => updateFormData({chk4: e.target.checked})} />
              <CheckboxItem id="chk5" label="I agree to receive communications regarding this application." checked={formData.chk5} onChange={e => updateFormData({chk5: e.target.checked})} />
              <CheckboxItem id="chk6" label="I certify that I can afford the proposed loan repayments." checked={formData.chk6} onChange={e => updateFormData({chk6: e.target.checked})} />
            </div>

            <div className="pt-8 border-t border-gray-200 space-y-5">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Digital Signature</h3>
                <p className="text-xs text-gray-500 mt-1">Please provide your signature to finalize the application agreement.</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100 rounded-xl w-fit border border-gray-200">
                  {[
                    { id: 'draw', label: 'Draw Signature' },
                    { id: 'upload', label: 'Upload Signature' },
                    { id: 'link', label: 'Create Signature Link' },
                  ].map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSignatureMethod(method.id)}
                      className={cn(
                        "px-5 py-2.5 text-xs font-bold rounded-lg transition-all",
                        signatureMethod === method.id ? "bg-white text-blue-600 shadow-sm border border-gray-200/50" : "text-gray-500 hover:text-gray-900 hover:bg-gray-200/50"
                      )}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 min-h-[220px] flex items-center justify-center transition-all">
                  {signatureMethod === 'draw' && (
                    <div className="w-full max-w-lg flex flex-col items-center gap-4 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-full h-40 bg-white border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/30 transition-colors cursor-crosshair">
                        <span className="text-sm font-medium">Draw your signature here</span>
                      </div>
                      <button type="button" className="text-[10px] font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors">Clear Canvas</button>
                    </div>
                  )}
                  {signatureMethod === 'upload' && (
                    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-300">
                      <FileUpload label="Upload Signature Image" />
                    </div>
                  )}
                  {signatureMethod === 'link' && (
                    <div className="text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
                      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Smartphone className="w-7 h-7" />
                      </div>
                      <div>
                        <p className="text-base font-black text-gray-900">Sign on your mobile device</p>
                        <p className="text-sm font-medium text-gray-600 mt-1 max-w-xs mx-auto leading-relaxed">We will send a secure signing link to your registered phone number.</p>
                      </div>
                      <button type="button" className="h-12 px-8 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98] transition-all">
                        Create Signature Link
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-5 pt-8">
          <button type="button" className="w-full sm:w-1/3 h-14 sm:h-16 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
            Review Application
          </button>
          <button type="button" onClick={handleSubmit} className="w-full sm:w-2/3 h-14 sm:h-16 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]">
            <span>Submit Application</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default LoanApplication;
