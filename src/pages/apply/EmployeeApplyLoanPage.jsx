import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, MapPin, Briefcase, Calendar, DollarSign, Building, 
  CreditCard, Upload, ArrowRight, FileText,
  ShieldCheck, Activity, Users, FileSignature, Check, ChevronDown,
  Smartphone, X, ArrowLeft
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const FormGroup = ({ label, icon: Icon, type = "text", placeholder, options, value, onChange, readOnly, helperText, extraAction }) => (
  <div className="space-y-1.5 w-full flex flex-col justify-start">
    <div className="flex justify-between items-center h-4">
      <label className="text-xs font-bold text-gray-900 uppercase tracking-wider">{label}</label>
      {extraAction}
    </div>
    <div className={cn("relative group", readOnly && "opacity-90")}>
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-600 transition-colors pointer-events-none z-10" />}
      {type === 'select' ? (
        <>
          <select 
            {...(value !== undefined ? { value, onChange } : { defaultValue: "" })}
            disabled={readOnly}
            className={cn(
              "w-full h-14 text-sm bg-gray-50/50 text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none appearance-none cursor-pointer relative z-0",
              Icon ? "pl-11 pr-10" : "px-4",
              readOnly && "bg-gray-100 cursor-not-allowed border-gray-200 text-gray-600"
            )}
          >
            <option value="" disabled hidden className="text-gray-500">{placeholder || `Select`}</option>
            {options?.map(opt => <option key={opt} value={opt} className="py-2 text-gray-900">{opt}</option>)}
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
            "w-full h-14 text-sm bg-gray-50/50 placeholder:text-gray-500 text-gray-900 border border-gray-300 rounded-xl focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition-all outline-none",
            Icon ? "pl-11 pr-4" : "px-4",
            readOnly && "bg-gray-100 cursor-not-allowed border-gray-200 focus:ring-0 focus:border-gray-200 text-gray-600"
          )}
        />
      )}
    </div>
    {helperText && <p className="text-[10px] font-bold text-gray-500 leading-tight tracking-wide">{helperText}</p>}
  </div>
);

const SectionCard = ({ title, icon: Icon, description, children }) => (
  <div className="bg-white rounded-[24px] border border-gray-200 shadow-xl shadow-gray-200/40 overflow-hidden">
    <div className="p-6 sm:p-8 border-b border-gray-200 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center shrink-0 shadow-sm">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div>
        <h2 className="text-lg font-black text-gray-900 tracking-tight">{title}</h2>
        {description && <p className="text-xs font-medium text-gray-500 mt-0.5">{description}</p>}
      </div>
    </div>
    <div className="p-6 sm:p-8">
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

const CheckboxItem = ({ id, label }) => (
  <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
    <div className="relative flex items-center mt-0.5">
      <input type="checkbox" id={id} className="peer sr-only" />
      <div className="w-5 h-5 border-2 border-gray-300 rounded peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-colors flex items-center justify-center shrink-0">
        <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 stroke-[3]" />
      </div>
    </div>
    <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 leading-relaxed select-none">{label}</span>
  </label>
);

export default function EmployeeApplyLoanPage() {
  const navigate = useNavigate();
  const [employmentType, setEmploymentType] = useState('Permanent');
  const [salaryFrequency, setSalaryFrequency] = useState('Monthly');
  const [signatureMethod, setSignatureMethod] = useState('draw');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const getTermOptions = () => {
    if (salaryFrequency === 'Monthly') return ['1 Month', '2 Months', '3 Months', '4 Months', '5 Months', '6 Months'];
    if (salaryFrequency === 'Weekly') return ['4 Weeks', '8 Weeks', '12 Weeks', '16 Weeks', '20 Weeks', '24 Weeks'];
    if (salaryFrequency === 'Fortnightly') return ['2 Fortnights', '4 Fortnights', '6 Fortnights', '8 Fortnights', '10 Fortnights', '12 Fortnights'];
    return [];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4 sm:p-8 relative font-sans text-gray-900 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 -left-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-blue-500/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-0 -right-20 w-[min(800px,120vw)] h-[min(800px,120vw)] max-w-none bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-4xl relative z-10 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
        
        {/* Header */}
        <div className="relative">
          {/* Back Button */}
          <button 
            onClick={() => navigate(-1)} 
            className="absolute left-0 top-1/2 -translate-y-1/2 group hidden md:flex items-center gap-3 px-6 py-3 text-base font-black text-gray-600 hover:text-blue-600 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-2xl transition-all shadow-md hover:shadow-xl"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back</span>
          </button>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-blue-600 rounded-[24px] flex items-center justify-center mx-auto shadow-2xl shadow-blue-600/30">
              <FileText className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl font-display font-black text-gray-900 tracking-tight leading-none">
                Loan Application
              </h1>
              <p className="text-xs font-black text-gray-500 uppercase tracking-[0.2em]">Lenni Lending Protocol</p>
            </div>
          </div>
        </div>

        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
          
          {/* 1. Personal Information */}
          <SectionCard title="1. Personal Information" icon={User} description="Tell us about yourself.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <FormGroup label="Name" icon={User} />
              <FormGroup label="Surname" icon={User} />
              <div className="md:col-span-2">
                <FormGroup label="Postal Address" icon={MapPin} />
              </div>
              <FormGroup label="Previously Disadvantaged" type="select" icon={Activity} options={['Yes', 'No']} />
              <FormGroup label="Ethnic Group" type="select" icon={Users} options={['Black', 'Coloured', 'Indian']} />
              <FormGroup label="Female" type="select" icon={User} options={['Yes', 'No']} />
              <FormGroup label="Disability" type="select" icon={Activity} options={['Yes', 'No']} />
            </div>
          </SectionCard>

          {/* 2. Employment Information */}
          <SectionCard title="2. Employment Information" icon={Briefcase} description="Your current work details.">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-7">
              <FormGroup label="Employer Name" icon={Building} />
              <FormGroup label="Employer Division" icon={Building} />
              <div className="md:col-span-2">
                <FormGroup 
                  label="Employment Type" 
                  type="select" 
                  icon={Briefcase} 
                  options={['Permanent', 'Contract', 'Seasonal', 'Part-time']} 
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                />
              </div>
              {employmentType === 'Contract' && (
                <FormGroup label="Contract End Date" type="date" icon={Calendar} />
              )}
              {employmentType === 'Seasonal' && (
                <FormGroup label="Season End Date" type="date" icon={Calendar} />
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
                options={['Monthly', 'Weekly', 'Fortnightly']} 
                value={salaryFrequency}
                onChange={(e) => setSalaryFrequency(e.target.value)}
              />
              <div className="hidden md:block"></div>
              <FormGroup label="Gross Income" icon={DollarSign} type="number" placeholder="0.00" />
              <FormGroup label="Total Expenses" icon={DollarSign} type="number" placeholder="0.00" />
              <div className="md:col-span-2">
                <div className="h-px w-full bg-gray-200 my-1"></div>
              </div>
              <FormGroup label="Net Income" icon={DollarSign} type="number" placeholder="0.00" />
              <div className="hidden md:block"></div>
              <FormGroup label="Bank Name" icon={Building} />
              <FormGroup 
                label="Branch Code" 
                icon={Activity} 
                readOnly={true}
                value="Universal (250655)"
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
              />
              <FormGroup 
                label="Loan Term" 
                icon={Calendar} 
                type="select" 
                options={getTermOptions()} 
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
                <CheckboxItem id="chk1" label="I have read and agree to the Terms and Conditions." />
                <CheckboxItem id="chk2" label="I consent to a credit check being performed." />
                <CheckboxItem id="chk3" label="I confirm that I am not currently under debt review." />
                <CheckboxItem id="chk4" label="I consent to my employer confirming my employment details." />
                <CheckboxItem id="chk5" label="I agree to receive communications regarding this application." />
                <CheckboxItem id="chk6" label="I certify that I can afford the proposed loan repayments." />
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
                    {/* Removed Type Name option for strict client-only mode */}
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* 7. Final Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-5 pt-8">
            <button type="button" onClick={() => setShowSummaryModal(true)} className="w-full sm:w-1/3 h-14 sm:h-16 bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-900 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2">
              Review Application
            </button>
            <button type="button" onClick={() => navigate('/apply-success')} className="w-full sm:w-2/3 h-14 sm:h-16 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-[0.98]">
              <span>Submit Application</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
          
        </form>
      </div>

      {/* Summary Modal */}
      {showSummaryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900 tracking-tight">Application Summary</h3>
                  <p className="text-[11px] font-medium text-gray-500 mt-0.5">Please review your details before submitting</p>
                </div>
              </div>
              <button onClick={() => setShowSummaryModal(false)} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-200 text-gray-500 transition-colors shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 flex-1">
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 pb-2">Personal Details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-sm font-black text-gray-900">John Doe</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ID Number</p>
                    <p className="text-sm font-black text-gray-900">8501015009087</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                    <p className="text-sm font-black text-gray-900">john.doe@example.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-black text-gray-900">082 123 4567</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 pb-2">Loan Details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Loan Amount</p>
                    <p className="text-lg font-black text-blue-600">R 4,000</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Repayment Term</p>
                    <p className="text-sm font-black text-gray-900">6 Months</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Purpose of Loan</p>
                    <p className="text-sm font-black text-gray-900">Education</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 border-b border-gray-100 pb-2">Employment Details</h4>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Employer</p>
                    <p className="text-sm font-black text-gray-900">Global Tech Solutions</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Net Salary</p>
                    <p className="text-sm font-black text-gray-900">R 25,000</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row items-center gap-3 justify-end shrink-0">
              <button onClick={() => setShowSummaryModal(false)} className="w-full sm:w-auto px-6 h-12 rounded-xl font-bold text-sm text-gray-600 hover:bg-gray-200 transition-colors">
                Edit Details
              </button>
              <button onClick={() => { setShowSummaryModal(false); navigate('/apply-success'); }} className="w-full sm:w-auto px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-sm shadow-lg shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                <span>Confirm & Submit</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
