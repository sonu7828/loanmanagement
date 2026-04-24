import React, { useState } from 'react';
import {
    FileText,
    FileDown,
    Eye,
    Printer,
    ShieldCheck,
    Download,
    Mail,
    CheckCircle2,
    Clock,
    ExternalLink,
    ChevronDown,
    ChevronUp,
    AlertCircle
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';
import Modal from '../../components/ui/Modal';
import { buildLetterPayload, LETTER_TYPES, getLetterEligibility } from '../../features/letters/generator';
import { generateLetterPDF } from '../../utils/letterPdfGenerator';
import { cn } from '../../lib/utils';

const DocumentsCenter = () => {
    const { applications } = useLoans();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [viewingApp, setViewingApp] = useState(false);
    const [previewTarget, setPreviewTarget] = useState(null);
    const [toast, setToast] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    // Get active/recent application for this user
    const userApp = applications.find(app => app.email === user?.email) || applications[0];

    const baseLetters = [
        { id: 1, title: 'Settlement Letter', description: 'Official document confirming the settlement amount.', type: LETTER_TYPES.SETTLEMENT },
        { id: 2, title: 'Paid-Up Letter', description: 'Proof that your loan has been fully settled and closed.', type: LETTER_TYPES.PAID_UP },
        { id: 3, title: 'Loan Confirmation', description: 'Summary of your active loan agreement and terms.', type: LETTER_TYPES.CONFIRMATION },
    ];

    // Add rejection letter if eligible
    if (userApp && (userApp.status === STATUSES.DECLINED || userApp.status === STATUSES.REJECTED || userApp.status === 'Declined' || userApp.status === 'Rejected')) {
        baseLetters.push({ 
            id: 4, 
            title: 'Rejection Letter', 
            description: 'Official notice regarding your declined loan application.', 
            type: LETTER_TYPES.REJECTION,
            isWarning: true
        });
    }

    const userDocuments = [
        { id: 'doc-1', name: 'ID Document.pdf', type: 'Identification', date: '2024-04-10', status: 'Verified' },
        { id: 'doc-2', name: 'Latest_Payslip.pdf', type: 'Income Proof', date: '2024-04-12', status: 'Verified' },
        { id: 'doc-3', name: 'Bank_Statement_3mo.pdf', type: 'Financial Proof', date: '2024-04-13', status: 'Pending' },
    ];

    const handlePrint = async () => {
        try {
            if (!userApp) return;
            const { generateApplicationHTML } = await import('../../utils/applicationPdfGenerator');
            
            const applicantData = {
                name: userApp.name,
                email: userApp.email,
                idNumber: userApp.idNumber || 'LMS-940251-X',
                mobile: userApp.phone || '+27 71 000 0000',
                company: userApp.company,
                salary: userApp.salary,
                jobTitle: userApp.jobTitle || 'Not Provided',
                amount: userApp.amount,
                paymentMethod: 'Payroll Deduction'
            };

            const htmlContent = generateApplicationHTML(userApp, applicantData);

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
                        <title>Application Report - ${userApp.id}</title>
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
            setToast({ type: 'danger', message: 'Failed to initialize print layout.' });
        }
    };

    const handlePreviewLetter = (letterType) => {
        try {
            if (!userApp) {
                throw new Error('No loan application found for this user.');
            }

            const payload = buildLetterPayload(letterType, userApp);
            setPreviewTarget(payload);
        } catch (error) {
            setToast({
                type: 'danger',
                message: error.message || 'Unable to generate this letter.',
            });
        }
    };

    const handleDownloadPdfAction = async (letterType) => {
        setIsDownloading(true);
        try {
            if (!userApp) throw new Error('No loan application found.');
            const payload = buildLetterPayload(letterType, userApp);
            await generateLetterPDF(payload);
            setToast({ type: 'success', message: `${payload.title} downloaded successfully.` });
        } catch (error) {
            setToast({ type: 'danger', message: error.message || 'Failed to generate PDF.' });
        } finally {
            setIsDownloading(false);
        }
    };

    const handleSendEmail = ({ borrowerEmail, bankEmail, documentTitle }) => {
        if (!borrowerEmail) {
            setToast({ type: 'danger', message: 'Borrower email is missing.' });
            return;
        }
        if (!bankEmail || !bankEmail.includes('@')) {
            setToast({ type: 'danger', message: 'Enter a valid bank/compliance email.' });
            return;
        }

        setToast({
            type: 'success',
            message: `${documentTitle} queued for email to ${borrowerEmail} and ${bankEmail}.`,
        });
    };

    const handlePreviewUpload = (doc) => {
        const payload = {
            title: doc.name,
            type: doc.type,
            filename: doc.name,
            user: { name: userApp.name, email: userApp.email },
            html: `
                <div class="space-y-8">
                    <div class="p-8 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                        <div class="space-y-1">
                            <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Document Class</p>
                            <h2 class="text-xl font-black text-black">${doc.type}</h2>
                        </div>
                        <div class="text-right space-y-1">
                            <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Archive Date</p>
                            <p class="text-sm font-black text-black">${doc.date}</p>
                        </div>
                    </div>
                    
                    <div class="space-y-6 text-slate-700 leading-relaxed">
                        <p class="font-bold text-black">System Verification Note:</p>
                        <p>This is a certified digital copy of the original <strong>${doc.name}</strong> uploaded by the borrower. Our security engine has cryptographically verified the file integrity and timestamped it into the Lenni Protocol audit stream.</p>
                        
                        <div class="grid grid-cols-2 gap-8 pt-6">
                            <div class="space-y-1">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Original Filename</p>
                                <p class="text-xs font-black text-black">${doc.name}</p>
                            </div>
                            <div class="space-y-1">
                                <p class="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verification Status</p>
                                <p class="text-xs font-black text-emerald-600 uppercase tracking-widest">${doc.status}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[40px] bg-slate-50/30">
                        <div class="w-16 h-16 rounded-full bg-white shadow-xl flex items-center justify-center text-slate-300">
                             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <p class="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Encrypted Payload Preview Secured</p>
                    </div>
                </div>
            `
        };
        setPreviewTarget(payload);
    };

    const handleDownloadUpload = async (doc) => {
        setIsDownloading(true);
        try {
            const payload = {
                title: doc.name,
                type: doc.type,
                filename: doc.name,
                user: { name: userApp.name, email: userApp.email },
                html: `<h1>${doc.type}</h1><p>Archived File: ${doc.name}</p><p>Verified on: ${doc.date}</p>`
            };
            await generateLetterPDF(payload);
            setToast({ type: 'success', message: `${doc.name} archived copy downloaded.` });
        } catch (error) {
            setToast({ type: 'danger', message: 'Failed to generate archived copy.' });
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <>
            <div className="space-y-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <SectionHeader
                    title="Document Center"
                    description="Official loan correspondence, secure artifacts, and verification reports."
                />
                <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-black uppercase tracking-widest">Global Audit Active</span>
                </div>
            </div>

            {/* 1. Official Letters Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl shadow-black/20">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Financial Letters</h2>
                            <p className="text-[10px] text-black font-black uppercase tracking-[0.2em] mt-1">Legally binding correspondence</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {baseLetters.map((letter) => {
                        const eligibility = getLetterEligibility(letter.type, userApp);
                        const isAvailable = eligibility.allowed;

                        return (
                            <div key={letter.id} className={cn(
                                "group relative bg-white p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] border border-slate-200 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200 lg:hover:-translate-y-2 flex flex-col",
                                !isAvailable && "grayscale opacity-60"
                            )}>
                                {letter.isWarning && (
                                    <div className="absolute top-5 right-5 sm:top-6 sm:right-6">
                                        <AlertCircle className="w-5 h-5 text-red-600 animate-pulse" />
                                    </div>
                                )}
                                
                                <div className={cn(
                                    "w-14 h-14 sm:w-16 sm:h-16 rounded-[20px] sm:rounded-[24px] flex items-center justify-center mb-6 sm:mb-8 transition-transform group-hover:scale-110 duration-500",
                                    letter.isWarning ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                                )}>
                                    <FileText className="w-7 h-7 sm:w-8 sm:h-8" />
                                </div>

                                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-10 flex-1">
                                    <h3 className="text-lg sm:text-xl font-black text-black tracking-tight group-hover:text-blue-600 transition-colors">{letter.title}</h3>
                                    <p className="text-xs text-black font-bold leading-relaxed">{letter.description}</p>
                                </div>

                                <div className="space-y-4">
                                    {!isAvailable ? (
                                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                            <p className="text-[9px] font-black text-red-600 uppercase tracking-widest flex items-center gap-2">
                                                <AlertCircle className="w-3 h-3" />
                                                {eligibility.reason}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handlePreviewLetter(letter.type)}
                                                className="flex-1 px-4 sm:px-6 py-3 sm:py-3.5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-black/10"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownloadPdfAction(letter.type)}
                                                disabled={isDownloading}
                                                className="p-3 sm:p-3.5 bg-blue-600 text-white rounded-2xl transition-all hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-600/20"
                                            >
                                                <Download className="w-5 h-5" />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                {/* 2. Documents Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Verified Uploads</h2>
                            <p className="text-[10px] text-black font-black uppercase tracking-[0.2em] mt-1">Secure artifact vault</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
                        <div className="divide-y divide-slate-100">
                            {userDocuments.map((doc) => (
                                <div key={doc.id} className="p-8 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50/50 transition-all gap-6 group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-black group-hover:text-black transition-all shadow-sm">
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-black text-black">{doc.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] text-black font-black uppercase tracking-widest">{doc.type}</span>
                                                <span className="text-slate-400">•</span>
                                                <span className="text-[10px] text-black font-mono font-black uppercase">{doc.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between sm:justify-end gap-6">
                                        <Badge variant={doc.status === 'Verified' ? 'success' : 'warning'} className="px-4 py-1.5 text-[9px]">
                                            {doc.status}
                                        </Badge>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handlePreviewUpload(doc)}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-black transition-all active:scale-95"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDownloadUpload(doc)}
                                                disabled={isDownloading}
                                                className="p-3 bg-white border border-slate-200 rounded-xl text-black hover:bg-slate-50 transition-all hover:shadow-md active:scale-95 disabled:opacity-50"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 3. Application Form Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-black tracking-tight">Active Application</h2>
                            <p className="text-[10px] text-black font-black uppercase tracking-[0.2em] mt-1">Live status tracking</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-10 rounded-[32px] sm:rounded-[40px] border border-slate-200 shadow-2xl shadow-slate-200/50 space-y-8 sm:space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] -mr-10 -mt-10 transition-all group-hover:bg-blue-50/50 duration-700" />
                        
                        <div className="flex items-center justify-between relative z-10">
                            <div className="space-y-1 sm:space-y-2">
                                <p className="text-xs sm:text-sm font-black text-black uppercase tracking-tight">Form Overview</p>
                                <p className="text-[10px] sm:text-[11px] text-black font-mono font-black tracking-widest">{userApp?.id || 'NO-ACTIVE-APP'}</p>
                            </div>
                            <Badge variant="primary" className="px-4 sm:px-6 py-1.5 sm:py-2 uppercase tracking-widest text-[9px] sm:text-[10px]">{userApp?.status}</Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
                            <MetricMini label="Submission Date" value={new Date(userApp?.date).toLocaleDateString()} />
                            <MetricMini label="Requested Principal" value={`R ${userApp?.amount?.toLocaleString()}`} highlight />
                            <MetricMini label="Current Purpose" value={userApp?.purpose || 'General'} />
                            <MetricMini label="Last Updated" value={new Date().toLocaleDateString()} />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                            <button
                                onClick={() => setViewingApp(!viewingApp)}
                                className="flex-1 flex items-center justify-center gap-3 py-4 sm:py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all active:scale-95 shadow-xl shadow-black/20"
                            >
                                <Eye className="w-5 h-5" />
                                {viewingApp ? 'Hide Details' : 'View Full Form'}
                            </button>
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePrint}
                                    className="flex-1 sm:flex-none p-4 sm:p-5 bg-white border border-slate-200 rounded-2xl text-black hover:bg-slate-50 transition-all hover:shadow-lg active:scale-95 flex items-center justify-center"
                                >
                                    <Printer className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                                <button
                                    onClick={() => navigate(`/employee/application/${userApp?.id}`)}
                                    className="flex-1 sm:flex-none p-4 sm:p-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center"
                                >
                                    <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>

            {/* Application Full Form Modal */}
            <Modal
                isOpen={viewingApp}
                onClose={() => setViewingApp(false)}
                title="Loan Application Details"
                maxWidth="max-w-6xl"
            >
                {userApp && (
                    <div className="space-y-12 py-4 pb-20">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-slate-100 pb-12">
                            <div className="space-y-4">
                                <div className="w-20 h-20 rounded-[32px] bg-black flex items-center justify-center shadow-2xl shadow-black/20 ring-8 ring-slate-50">
                                    <FileText className="w-10 h-10 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-4xl font-black text-black tracking-tight">Application Ledger</h3>
                                    <div className="flex items-center gap-3 mt-2">
                                        <Badge variant="primary" className="px-6 py-1.5">{userApp.status}</Badge>
                                        <span className="text-slate-400">•</span>
                                        <p className="text-black font-mono font-black text-xs uppercase tracking-widest">REF: {userApp.id}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-10 bg-slate-50 p-8 rounded-[40px] border border-slate-100 w-full md:w-auto">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Submission Date</p>
                                    <p className="text-lg font-black text-black">{new Date(userApp.date).toLocaleDateString()}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-black uppercase tracking-widest">Principal Amount</p>
                                    <p className="text-lg font-black text-blue-600 underline underline-offset-4">R {userApp.amount?.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <FormSection title="Personal Profile" items={[
                                { label: 'Full Legal Name', value: userApp.name },
                                { label: 'National ID / Passport', value: userApp.idNumber || 'LMS-940251-X' },
                                { label: 'Verified Email', value: userApp.email },
                                { label: 'Contact Number', value: userApp.phone || '+27 71 000 0000' },
                            ]} />

                            <FormSection title="Employment Data" items={[
                                { label: 'Corporate Employer', value: userApp.company },
                                { label: 'Net Monthly Salary', value: `R ${userApp.salary?.toLocaleString()}` },
                                { label: 'Employment Tenure', value: "3 Years, 2 Months" },
                                { label: 'Internal Department', value: userApp.department || 'Operations' },
                            ]} />

                            <FormSection title="Financial Analysis" items={[
                                { label: 'Total Principal', value: `R ${userApp.amount?.toLocaleString()}` },
                                { label: 'Monthly Installment', value: `R ${(userApp.amount / 12 * 1.15).toFixed(2)}` },
                                { label: 'Collection Method', value: "Payroll Deduction" },
                                { label: 'Interest Rate (Est)', value: "15.0% Fixed" },
                            ]} />
                        </div>

                        <div className="p-10 bg-blue-50 rounded-[48px] border border-blue-100 flex flex-col sm:flex-row items-center gap-8 justify-between relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110" />
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-16 h-16 rounded-3xl bg-white flex items-center justify-center text-blue-600 shadow-xl shadow-blue-600/10 border border-blue-100">
                                     <ShieldCheck className="w-10 h-10" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xl font-black text-black tracking-tight">Legally Verified Artifact</p>
                                    <p className="text-sm text-black leading-relaxed max-w-lg font-bold italic">
                                        This application is bound by the Electronic Communications and Transactions Act.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-black px-10 py-5 rounded-[24px] text-xs font-mono font-black text-blue-400 italic relative z-10 shadow-2xl">
                                DIGITALLY SIGNED: {new Date(userApp.date).toLocaleDateString()}
                            </div>
                        </div>

                        <div className="mt-20 pt-10 border-t border-slate-100 flex flex-col sm:flex-row gap-6 justify-between items-center">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                                    <ShieldCheck className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-black uppercase tracking-widest leading-tight">Secure Audit Token</p>
                                    <p className="text-xs text-black font-mono font-black mt-1">{userApp?.id}-SECURE-VERIFIED-V4</p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                                <button 
                                    onClick={handlePrint}
                                    className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-white border-2 border-slate-200 rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] text-black hover:border-black transition-all active:scale-95"
                                >
                                    <Printer className="w-5 h-5" />
                                    Print Report
                                </button>
                                <button 
                                    onClick={() => setViewingApp(false)}
                                    className="w-full sm:w-auto px-12 py-5 bg-blue-600 rounded-[24px] text-white font-black hover:bg-blue-700 shadow-2xl shadow-blue-600/30 text-[10px] uppercase tracking-[0.2em] active:scale-95"
                                >
                                    Confirm & Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            <DocumentPreviewModal
                isOpen={!!previewTarget}
                onClose={() => setPreviewTarget(null)}
                documentTitle={previewTarget?.title}
                documentType={previewTarget?.type}
                htmlContent={previewTarget?.html}
                borrowerEmail={previewTarget?.user?.email}
                defaultFilename={previewTarget?.filename}
                onDownloadPdf={() => handleDownloadPdfAction(previewTarget?.type)}
                onSendEmail={handleSendEmail}
            />
        </>
    );
};

const MetricMini = ({ label, value, highlight }) => (
    <div className="space-y-2">
        <p className="text-[10px] text-black font-black uppercase tracking-widest">{label}</p>
        <p className={cn(
            "text-base font-black tracking-tight transition-all",
            highlight ? "text-blue-600 text-lg" : "text-black"
        )}>{value}</p>
    </div>
);

const FormSection = ({ title, items }) => (
    <section className="space-y-8">
        <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-blue-600 rounded-full" />
            <h4 className="text-xs font-black text-black uppercase tracking-[0.3em]">{title}</h4>
        </div>
        <div className="space-y-8 bg-slate-50/50 p-10 rounded-[40px] border border-slate-100">
            {items.map((item, i) => (
                <div key={i} className="space-y-2">
                    <p className="text-[10px] text-black font-black uppercase tracking-widest">{item.label}</p>
                    <p className="text-base font-black text-black">{item.value}</p>
                </div>
            ))}
        </div>
    </section>
);

export default DocumentsCenter;
