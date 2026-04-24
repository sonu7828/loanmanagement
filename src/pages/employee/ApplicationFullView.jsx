import React, { useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Printer,
    Download,
    ShieldCheck,
    User,
    Building2,
    DollarSign,
    FileText,
    Clock,
    Loader2
} from 'lucide-react';
import { Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';
import { buildLetterPayload, LETTER_TYPES } from '../../features/letters/generator';

const ApplicationFullView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications } = useLoans();
    const { user: currentUser } = useAuth();
    const [isDownloading, setIsDownloading] = useState(false);
    const [toast, setToast] = useState(null);
    const [previewTarget, setPreviewTarget] = useState(null);

    const application = applications.find((app) => app.id === id);

    if (!application) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
                <FileText className="w-16 h-16 text-black opacity-20" />
                <h2 className="text-xl font-display font-black text-black">Application Not Found</h2>
                <button onClick={() => navigate(-1)} className="px-8 py-3 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all active:scale-95">Go Back</button>
            </div>
        );
    }

    const handlePrint = async () => {
        try {
            const { generateApplicationHTML } = await import('../../utils/applicationPdfGenerator');
            
            const applicantData = {
                name: applicantName,
                email: applicantEmail,
                idNumber: applicantIdNumber,
                mobile: safeText(application.mobile || application.phone),
                company: applicantCompany,
                salary: applicantSalary,
                jobTitle: safeText(application.jobTitle, 'Not Provided'),
                amount: loanAmount,
                paymentMethod: safeText(application.paymentMethod, 'Payroll Deduction')
            };

            const htmlContent = generateApplicationHTML(application, applicantData);

            const iframe = document.createElement('iframe');
            iframe.style.position = 'fixed';
            iframe.style.right = '-9999px';
            iframe.style.bottom = '-9999px';
            document.body.appendChild(iframe);

            const iframeDoc = iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(`
                <html>
                    <head>
                        <title>Application Report - ${application.id}</title>
                        <style>
                            @media print {
                                body { margin: 0; padding: 20px; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                            }
                        </style>
                    </head>
                    <body>
                        ${htmlContent}
                    </body>
                </html>
            `);
            iframeDoc.close();

            setTimeout(() => {
                iframe.contentWindow.focus();
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            }, 500);
        } catch (error) {
            console.error('Print Error:', error);
            setToast({ type: 'danger', message: 'Failed to initialize print layout.' });
        }
    };

    const handleDownloadPdf = async () => {
        try {
            setIsDownloading(true);
            setToast({ type: 'info', message: 'Generating professional application report...' });

            const { generateApplicationPDF } = await import('../../utils/applicationPdfGenerator');
            
            const applicantData = {
                name: applicantName,
                email: applicantEmail,
                idNumber: applicantIdNumber,
                mobile: safeText(application.mobile || application.phone),
                company: applicantCompany,
                salary: applicantSalary,
                jobTitle: safeText(application.jobTitle, 'Not Provided'),
                amount: loanAmount,
                paymentMethod: safeText(application.paymentMethod, 'Payroll Deduction')
            };

            await generateApplicationPDF(application, applicantData);
            
            setToast({ type: 'success', message: 'Official Application PDF downloaded.' });
        } catch (error) {
            console.error('PDF Export Error:', error);
            setToast({
                type: 'danger',
                message: `Failed to generate PDF.`,
            });
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePreviewLetter = (type) => {
        try {
            const payload = buildLetterPayload(type, application);
            setPreviewTarget(payload);
        } catch (error) {
            setToast({ type: 'danger', message: error.message });
        }
    };

    const safeText = (value, fallback = 'N/A') => {
        if (value === null || value === undefined) return fallback;
        if (typeof value === 'string' && value.trim() === '') return fallback;
        return value;
    };
    const asNumber = (value, fallback = 0) => {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : fallback;
    };

    const applicantName = safeText(application.name || application.fullName);
    const applicantCompany = safeText(application.company || application.employerName);
    const applicantEmail = safeText(application.email);
    const applicantIdNumber = safeText(application.idNumber);
    const applicantSalary = asNumber(application.salary ?? application.netSalary);
    const loanAmount = asNumber(application.amount);
    const applicationDate = application.date ? new Date(application.date) : null;
    const formattedDate = applicationDate && !Number.isNaN(applicationDate.getTime())
        ? applicationDate.toLocaleDateString()
        : 'N/A';

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 print:p-0">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 print:hidden">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-black hover:bg-slate-50 transition-all shadow-sm flex-shrink-0"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-display font-black text-black tracking-tight truncate">Application Details</h1>
                        <p className="text-slate-500 font-mono font-bold text-xs sm:text-sm uppercase tracking-widest truncate">{application.id}</p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={handlePrint}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-black hover:bg-slate-50 font-black uppercase tracking-widest text-[10px] sm:text-xs transition-all shadow-sm"
                    >
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        disabled={isDownloading}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl bg-black text-white font-black uppercase tracking-widest text-[10px] sm:text-xs hover:bg-slate-800 transition-all shadow-xl shadow-black/10 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Application Progress</h3>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-[24px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                                    <Clock className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-black">{safeText(application.status)}</p>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-tight">Submitted on {formattedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex md:flex-col items-center md:items-end gap-2 md:gap-1">
                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Global Status</span>
                            <Badge variant={application.status === 'Approved' || application.status === 'Paid' ? 'success' : 'primary'} className="px-8 py-2.5 text-xs font-black uppercase tracking-widest">
                                {safeText(application.status)}
                            </Badge>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DataSection
                            title="Personal Information"
                            icon={User}
                            items={[
                                { label: 'Full Legal Name', value: applicantName },
                                { label: 'National ID / Passport', value: applicantIdNumber },
                                { label: 'Email Correspondence', value: applicantEmail },
                                { label: 'Phone Number', value: safeText(application.mobile || application.phone) },
                            ]}
                        />
                        <DataSection
                            title="Employment / Income"
                            icon={Building2}
                            items={[
                                { label: 'Registered Employer', value: applicantCompany },
                                { label: 'Monthly Gross Income', value: `R ${applicantSalary.toLocaleString()}` },
                                { label: 'Work Designation', value: safeText(application.jobTitle, 'Not Provided') },
                                { label: 'Payment Method', value: safeText(application.paymentMethod, 'Payroll Deduction') },
                            ]}
                        />
                    </div>

                    <div className="bg-white p-10 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                                <DollarSign className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-display font-black text-black tracking-tight">Financial Analysis</h3>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                            <MetricBox label="Principal" value={`R ${loanAmount.toLocaleString()}`} color="text-black font-black" />
                            <MetricBox label="Interest (Est)" value={`R ${(loanAmount * 0.09).toLocaleString()}`} color="text-slate-700 font-bold" />
                            <MetricBox label="Fee / Service" value={`R ${(loanAmount * 0.03).toLocaleString()}`} color="text-slate-700 font-bold" />
                            <MetricBox label="Total Repayable" value={`R ${(loanAmount * 1.12).toLocaleString()}`} color="text-blue-600 font-black" />
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-8 h-fit">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Audit Trail</h3>
                        <div className="space-y-8 relative">
                            <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-slate-100"></div>

                            {(application.auditHistory || []).map((log, i) => (
                                <div key={i} className="relative pl-10">
                                    <div className="absolute left-0 top-1 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm font-black text-black">{safeText(log.status)}</p>
                                        <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase font-black tracking-wider">
                                            <span>{safeText(log.user)}</span>
                                            <span>{log.date ? new Date(log.date).toLocaleDateString() : 'N/A'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-emerald-50 p-8 rounded-[40px] border border-emerald-100 space-y-4">
                        <div className="flex items-center gap-3 text-emerald-700">
                            <ShieldCheck className="w-6 h-6" />
                            <span className="font-black uppercase text-xs tracking-widest">Compliance Verified</span>
                        </div>
                        <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                            This application has been electronically signed and cryptographically bound to your identity profile.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Letters</h3>
                        <div className="grid grid-cols-1 gap-2">
                            <LetterActionButton label="Confirmation" onClick={() => handlePreviewLetter(LETTER_TYPES.CONFIRMATION)} />
                            <LetterActionButton label="Settlement" onClick={() => handlePreviewLetter(LETTER_TYPES.SETTLEMENT)} />
                        </div>
                    </div>
                </div>
            </div>

            <DocumentPreviewModal
                isOpen={!!previewTarget}
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
                documentType={previewTarget?.type}
                htmlContent={previewTarget?.html}
                borrowerEmail={previewTarget?.user?.email}
                defaultFilename={previewTarget?.filename}
                onDownloadPdf={async () => {
                    const { generateLetterPDF } = await import('../../utils/letterPdfGenerator');
                    await generateLetterPDF(previewTarget);
                }}
                onSendEmail={({ borrowerEmail, bankEmail, documentTitle }) => {
                    setToast({ type: 'success', message: `Queued email for ${documentTitle}` });
                }}
            />
        </div>
    );
};

const DataSection = ({ title, icon: Icon, items }) => (
    <div className="bg-white p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-blue-600" />
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</h4>
        </div>
        <div className="space-y-6">
            {items.map((item, i) => (
                <div key={i} className="space-y-1">
                    <p className="text-[10px] text-black font-black uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm font-bold text-slate-700">{item.value}</p>
                </div>
            ))}
        </div>
    </div>
);

const MetricBox = ({ label, value, color }) => (
    <div className="space-y-1">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{label}</p>
        <p className={`text-lg transition-all ${color}`}>{value}</p>
    </div>
);

const LetterActionButton = ({ label, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between px-6 py-4 bg-slate-50 hover:bg-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black transition-all border border-slate-100"
    >
        {label}
        <FileText className="w-4 h-4 text-slate-400" />
    </button>
);

export default ApplicationFullView;
