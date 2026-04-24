import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  User, 
  FileText, 
  BarChart3, 
  History,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Download,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  BadgePercent,
  Calendar,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import { useLoans, STATUSES, LIFECYCLE_ACTIONS } from '../../context/LoanContext';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import Modal from '../../components/ui/Modal';
import DocumentPreviewModal from '../../components/ui/DocumentPreviewModal';
import html2pdf from 'html2pdf.js';
import { cleanupHtml2PdfArtifacts } from '../../utils/pdfCleanup';

const CreditProfilePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { applications, updateStatus, transitionLoanLifecycle } = useLoans();
    const [app, setApp] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [toast, setToast] = useState(null);
    
    // Modals
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [isRequestInfoModalOpen, setIsRequestInfoModalOpen] = useState(false);
    
    // Form States for Decision Bar
    const [approveData, setApproveData] = useState({ amount: '', term: '12', interest: '15' });
    const [rejectReason, setRejectReason] = useState('');
    const [holdReason, setHoldReason] = useState('');
    const [requestMsg, setRequestMsg] = useState('');
    const [newNote, setNewNote] = useState('');
    const [previewDoc, setPreviewDoc] = useState(null);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        const normalizedId = id != null ? String(id).trim() : '';
        const foundApp = applications.find(
            (a) => String(a.id).trim().toLowerCase() === normalizedId.toLowerCase()
        );
        if (foundApp) {
            setApp(foundApp);
            setApproveData((prev) => ({ ...prev, amount: foundApp.amount || '' }));
            setNotFound(false);
            return;
        }
        setApp(null);
        if (applications.length > 0) {
            setNotFound(true);
        } else {
            setNotFound(false);
        }
    }, [id, applications]);

    if (!app) {
        if (notFound) {
            return (
                <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 px-6 text-center">
                    <AlertTriangle className="w-14 h-14 text-amber-500" />
                    <h2 className="text-xl font-display font-bold text-slate-200">Application not found</h2>
                    <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                        No loan with ID <span className="font-mono text-slate-400">{id}</span> exists in this browser&apos;s saved data.
                        Open <span className="font-mono text-slate-400">/credit/dashboard</span> and use <strong>Assess</strong> from the list you actually have, or clear{' '}
                        <span className="font-mono text-slate-400">lms_applications</span> in localStorage and refresh to reload demo applications.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate('/credit/dashboard')}
                        className="btn-primary"
                    >
                        Back to credit dashboard
                    </button>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-slate-400 font-medium">Loading applicant information...</p>
            </div>
        );
    }

    const displayName = app.name || `No Name (ID: ${app.id})`;

    const closeDecisionModals = () => {
        // Close all modals
        setIsApproveModalOpen(false);
        setIsRejectModalOpen(false);
        setIsHoldModalOpen(false);
        setIsRequestInfoModalOpen(false);
    };

    const handleLifecycleAction = (lifecycleAction, successLabel, notes = '') => {
        try {
            transitionLoanLifecycle(app.id, lifecycleAction, 'Credit Officer', notes);
            setToast({ message: `Action successful: ${successLabel}`, type: 'success' });
            closeDecisionModals();
            setTimeout(() => navigate('/credit/queue'), 1200);
        } catch (error) {
            setToast({ message: error.message || 'Lifecycle action failed.', type: 'danger' });
        }
    };

    const handleStatusAction = (newStatus, notes = '') => {
        updateStatus(app.id, newStatus, 'Credit Officer', notes);
        setToast({ message: `Action successful: Status moved to ${newStatus}`, type: 'success' });
        closeDecisionModals();
        // Navigate back to queue after a delay
        setTimeout(() => navigate('/credit/queue'), 1200);
    };

    const tabs = [
        { id: 'overview', label: 'Overview', icon: User },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'analysis', label: 'Credit Analysis', icon: BarChart3 },
        { id: 'notes', label: 'Notes', icon: History },
    ];

    // Simulated Financial Data for Analysis Tab
    const salary = app.salary || 25000;
    const emi = app.amount ? (app.amount / 12) * 1.15 : 1500;
    const dti = ((emi / salary) * 100).toFixed(1);

    const documentItems = [
        { title: 'Latest Payslip', icon: FileText, date: '2 hours ago' },
        { title: 'Bank Statement (3mo)', icon: TrendingUp, date: 'Yesterday' },
        { title: 'ID Document', icon: User, date: '3 days ago' },
        { title: 'Employment Contract', icon: Briefcase, date: '4 days ago' }
    ];

    const buildDocumentHtml = (title) => `
      <section style="font-family: Arial, sans-serif; color: #0f172a; line-height: 1.6; padding: 24px;">
        <h1 style="margin:0 0 16px; font-size: 22px;">${title}</h1>
        <p><strong>Applicant:</strong> ${displayName}</p>
        <p><strong>Application ID:</strong> ${app.id}</p>
        <p><strong>Email:</strong> ${app.email || 'N/A'}</p>
        <p><strong>Company:</strong> ${app.company || 'Not Specified'}</p>
        <p><strong>Requested Amount:</strong> R ${(app.amount || 0).toLocaleString()}</p>
        <p style="margin-top:16px;">Generated by Credit Operations for assessment workflow.</p>
      </section>
    `;

    const resolveHtml2Pdf = () => {
        if (typeof html2pdf === 'function') return html2pdf;
        if (html2pdf && typeof html2pdf.default === 'function') return html2pdf.default;
        return null;
    };

    const handlePrintAssessment = () => {
        window.print();
    };

    const handleDownloadApprovalLetter = async () => {
        const html = `
            <div style="padding: 40px; font-family: sans-serif; color: #333;">
                <div style="text-align: center; margin-bottom: 40px;">
                    <h1 style="color: #2563eb; margin: 0;">LENNI LOAN MANAGEMENT</h1>
                    <p style="text-transform: uppercase; letter-spacing: 2px; font-size: 10px; margin-top: 5px;">Credit Approval Certificate</p>
                </div>
                <div style="margin-bottom: 30px;">
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Ref:</strong> ${app.id}</p>
                </div>
                <p>Dear ${displayName},</p>
                <p>We are pleased to inform you that your loan application for <strong>R ${(app.amount || 0).toLocaleString()}</strong> has been <strong>CONDITIONALLY APPROVED</strong> by our Credit Committee.</p>
                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <h3 style="margin-top: 0; font-size: 14px;">Approval Terms:</h3>
                    <ul style="font-size: 13px;">
                        <li>Approved Amount: R ${(app.amount || 0).toLocaleString()}</li>
                        <li>Repayment Term: 12 Months</li>
                        <li>Interest Rate: 15% P.A.</li>
                    </ul>
                </div>
                <p>Our finance department will proceed with the final disbursement verification.</p>
                <div style="margin-top: 60px; border-top: 1px solid #ddd; pt-20; width: 200px;">
                    <p style="font-size: 12px; font-weight: bold; margin: 0;">Authorized Credit Officer</p>
                    <p style="font-size: 10px; color: #666; margin: 0;">Lenni LMS System</p>
                </div>
            </div>
        `;
        await exportHtmlToPdf(html, `Approval_Letter_${app.id}.pdf`);
    };

    const exportHtmlToPdf = async (html, filename) => {
        const mount = document.createElement('div');
        mount.style.position = 'fixed';
        mount.style.left = '-99999px';
        mount.style.top = '0';
        mount.style.width = '210mm';
        mount.style.background = '#ffffff';
        mount.innerHTML = html;
        document.body.appendChild(mount);

        try {
            cleanupHtml2PdfArtifacts();
            const html2pdfFn = resolveHtml2Pdf();
            if (!html2pdfFn) {
                throw new Error('PDF engine unavailable');
            }
            await html2pdfFn()
                .set({
                    margin: 8,
                    filename,
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        onclone: (clonedDoc) => {
                            clonedDoc.querySelectorAll('style,link[rel="stylesheet"]').forEach((el) => el.remove());
                            const safeStyle = clonedDoc.createElement('style');
                            safeStyle.textContent = `
                              * { font-family: Arial, sans-serif !important; }
                              html, body { background: #ffffff !important; color: #0f172a !important; }
                            `;
                            clonedDoc.head.appendChild(safeStyle);
                        },
                    },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                })
                .from(mount)
                .save();
            setToast({ message: `${filename} downloaded successfully.`, type: 'success' });
        } catch (error) {
            setToast({
                message: `Failed to generate document PDF${error?.message ? `: ${error.message}` : ''}.`,
                type: 'danger'
            });
        } finally {
            cleanupHtml2PdfArtifacts();
            if (mount.parentNode) mount.parentNode.removeChild(mount);
        }
    };

    const handleViewDocument = (doc) => {
        setPreviewDoc({
            title: doc.title,
            filename: `${doc.title.replaceAll(' ', '_')}_${app.id}.pdf`,
            html: buildDocumentHtml(doc.title),
        });
    };

    const handleDownloadDocument = async (doc) => {
        await exportHtmlToPdf(
            buildDocumentHtml(doc.title),
            `${doc.title.replaceAll(' ', '_')}_${app.id}.pdf`
        );
    };

    return (
        <>
            <div className="pb-48 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                    <button 
                        onClick={() => navigate('/credit/queue')}
                        className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all shadow-lg flex-shrink-0"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            <h1 className="text-xl sm:text-3xl font-display font-bold truncate">{displayName}</h1>
                            <Badge variant={
                                app.status === STATUSES.APPROVED ? 'success' : 
                                app.status === STATUSES.DECLINED ? 'danger' : 
                                app.status === STATUSES.UNDER_REVIEW ? 'primary' : 'warning'
                            }>
                                {app.status || 'NEW'}
                            </Badge>
                        </div>
                        <p className="text-[10px] sm:text-sm text-slate-400 font-mono mt-1 truncate">{app.id} • {app.email || 'No Email'}</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 p-4 glass rounded-2xl border-slate-800/50 w-full lg:w-auto overflow-hidden">
                    <div className="flex-1 lg:text-right min-w-0">
                        <p className="text-[10px] text-slate-500 uppercase font-black">Assigned To</p>
                        <p className="text-sm font-bold text-blue-400 truncate">{app.assignedTo || 'Unassigned'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Main Content Tabs */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 p-1 bg-slate-900/50 rounded-2xl border border-slate-800/50 w-full overflow-x-auto no-scrollbar">
                    <div className="flex items-center gap-2 min-w-max">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all ${
                                activeTab === tab.id 
                                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20" 
                                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                    </div>
                </div>

                <div className="glass p-4 sm:p-8 rounded-[24px] sm:rounded-[40px] border-slate-800/50 shadow-2xl relative overflow-hidden min-h-[min(500px,70vh)] sm:min-h-[500px]">
                    {/* Tab Views */}
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">General Information</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/50 p-4 sm:p-6 rounded-3xl border border-slate-800/50">
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Full Identity</p>
                                            <p className="text-lg font-bold text-slate-200 break-words">{displayName}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Company</p>
                                            <p className="text-lg font-bold text-slate-200 break-words">{app.company || 'Not Specified'}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loan Request</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-blue-600/5 p-4 sm:p-6 rounded-3xl border border-blue-500/10">
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-blue-500 uppercase font-bold mb-1">Amount Requested</p>
                                            <p className="text-2xl font-display font-black text-blue-400 break-words">R {app.amount?.toLocaleString()}</p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-blue-500 uppercase font-bold mb-1">Requested Term</p>
                                            <p className="text-2xl font-display font-black text-blue-400">12 Months</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Risk & Score</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-950/50 p-4 sm:p-6 rounded-3xl border border-slate-800/50">
                                        <div className="min-w-0">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Credit Score</p>
                                            <p className={`text-3xl sm:text-4xl font-display font-black ${app.score >= 700 ? 'text-emerald-400' : 'text-amber-400'}`}>{app.score || '612'}</p>
                                        </div>
                                        <div className="min-w-0 flex flex-col justify-center">
                                            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Risk Level</p>
                                            <Badge variant={app.risk === 'High' ? 'danger' : 'success'}>{app.risk || 'Medium'}</Badge>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verification Status</h3>
                                    <div className="p-4 sm:p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between min-w-0">
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-emerald-400">HR Certified</p>
                                            <p className="text-xs text-slate-500 break-words">Verified by Sarah Miller on 12/04/2026</p>
                                        </div>
                                        <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-6 animate-in fade-in duration-500">
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {documentItems.map((doc, i) => (
                                    <div key={i} className="p-6 bg-slate-950 border border-slate-800 rounded-3xl group hover:border-blue-500/50 transition-all">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors mb-4">
                                            <doc.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="font-bold text-slate-200">{doc.title}</h4>
                                        <p className="text-[10px] text-slate-500 uppercase mt-1">Uploaded {doc.date}</p>
                                        <div className="flex gap-2 mt-6">
                                            <button
                                                onClick={() => handleViewDocument(doc)}
                                                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-400 hover:text-white transition-all"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleDownloadDocument(doc)}
                                                className="flex-1 py-2 rounded-xl bg-blue-600/10 text-blue-400 text-[10px] font-bold hover:bg-blue-600 hover:text-white transition-all"
                                            >
                                                Download
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="space-y-10 animate-in fade-in duration-500">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                                <h3 className="text-xl font-display font-bold text-slate-100">Decision Analysis Matrix</h3>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handlePrintAssessment}
                                        className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all"
                                    >
                                        <History className="w-4 h-4" /> Print Assessment
                                    </button>
                                    <button 
                                        onClick={handleDownloadApprovalLetter}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all"
                                    >
                                        <Download className="w-4 h-4" /> Approval Letter
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <AssessmentCard title="Affordability" value={`${100 - dti}%`} sub="Free Income" icon={BadgePercent} variant="success" />
                                <AssessmentCard title="Risk Score" value={app.score || '612'} sub="High Tier" icon={TrendingUp} variant="primary" />
                                <AssessmentCard title="Existing Debt" value="R 4,200" sub="Verified" icon={History} variant="warning" />
                                <AssessmentCard title="Income Strength" value="R 25,000" sub="Verified" icon={ShieldCheck} variant="success" />
                                <AssessmentCard title="Recommendation" value="APPROVE" sub="Policy Met" icon={CheckCircle2} variant="primary" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-6">
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <BadgePercent className="w-5 h-5 text-blue-500" />
                                        Expenses vs Income Breakdown
                                    </h3>
                                    <div className="space-y-6 bg-slate-950 p-8 rounded-[32px] border border-slate-800">
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>Household & Rent</span>
                                                <span className="text-slate-300">R 8,500</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-700" style={{ width: '35%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-slate-500">
                                                <span>Debt Obligations</span>
                                                <span className="text-slate-300">R 4,200</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-slate-700" style={{ width: '18%' }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs font-bold text-blue-500">
                                                <span>New Loan Installment</span>
                                                <span className="text-blue-400">R {emi.toLocaleString()}</span>
                                            </div>
                                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: `${dti}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        Risk Indicators
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                                                <CheckCircle2 className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-emerald-400">Stable Employment</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Applicant has been with the same employer for 3+ years.</p>
                                            </div>
                                        </div>
                                        <div className="p-5 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-amber-400">Recent Credit Enquiries</p>
                                                <p className="text-xs text-slate-500 mt-0.5">3 Enquiries in the last 6 months detected in report.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="space-y-8 animate-in fade-in duration-500">
                            <div className="flex gap-4">
                                <input 
                                    className="flex-1 input-field py-4" 
                                    placeholder="Add a private note about this application..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                />
                                <button 
                                    onClick={() => {
                                        if (newNote) {
                                            updateStatus(app.id, app.status, 'Credit Officer', newNote);
                                            setNewNote('');
                                            setToast({ message: 'Note added successfully', type: 'info' });
                                        }
                                    }}
                                    className="px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" /> Add Note
                                </button>
                            </div>

                            <div className="relative pl-8 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
                                {(app.auditHistory || []).slice().reverse().map((log, i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[30px] top-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center z-10">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                        </div>
                                        <div className="p-6 bg-slate-950 border border-slate-800 rounded-3xl space-y-3">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-bold text-slate-200">
                                                        {log.status === app.status ? "Internal Note" : `Status changed to ${log.status}`}
                                                    </p>
                                                    <p className="text-xs text-slate-500 font-bold uppercase mt-0.5 tracking-tighter">By {log.user}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[10px] text-slate-600 font-mono font-bold">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(log.date).toLocaleString()}
                                                </div>
                                            </div>
                                            {log.notes && (
                                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm italic text-slate-400">
                                                    "{log.notes}"
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            </div>
            
            {/* Decision Action Bar (FIXED BOTTOM) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 pt-4 pb-12 px-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] sm:pb-8 sm:px-6 bg-slate-950/80 backdrop-blur-2xl border-t border-slate-800">
                <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full xl:w-auto">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[8px] sm:text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Final Outcome</p>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-100 italic truncate">Ready for Final Decision</h4>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 lg:flex lg:items-center gap-3 w-full xl:w-auto">
                        <button 
                            onClick={() => setIsRejectModalOpen(true)}
                            className="px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-red-600 text-white font-black uppercase text-[10px] tracking-wider hover:bg-red-500 transition-all shadow-xl shadow-red-600/10 truncate"
                        >
                            Reject
                        </button>
                        <button 
                            onClick={() => handleLifecycleAction(LIFECYCLE_ACTIONS.REOPEN, 'Forwarded Back', 'Returned for data correction')}
                            className="px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-orange-600 text-white font-black uppercase text-[10px] tracking-wider hover:bg-orange-500 transition-all shadow-xl shadow-orange-600/10 truncate"
                        >
                            Forward Back
                        </button>
                        <button 
                            onClick={() => setIsRequestInfoModalOpen(true)}
                            className="px-4 sm:px-6 py-3 sm:py-4 rounded-2xl bg-slate-800 text-slate-200 font-black uppercase text-[10px] tracking-wider hover:bg-slate-700 transition-all shadow-xl truncate"
                        >
                            Need More Info
                        </button>
                        <button 
                            onClick={() => setIsApproveModalOpen(true)}
                            className="px-4 sm:px-10 py-3 sm:py-4 rounded-2xl bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.1em] sm:tracking-[0.2em] hover:bg-blue-500 transition-all shadow-2xl shadow-blue-600/20 flex items-center justify-center gap-2 sm:gap-3 truncate"
                        >
                            Approve
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                    </div>
                </div>
            </div>
            {/* Decision Modals */}
            <Modal
                isOpen={isApproveModalOpen}
                onClose={() => setIsApproveModalOpen(false)}
                title="Loan Final Approval"
                footer={(
                    <div className="flex gap-4">
                        <button onClick={() => setIsApproveModalOpen(false)} className="flex-1 py-4 px-6 border border-slate-800 rounded-2xl text-slate-500 font-bold hover:text-white">Cancel</button>
                        <button 
                            onClick={() =>
                                handleLifecycleAction(
                                    LIFECYCLE_ACTIONS.CREDIT_APPROVE,
                                    'Moved to CREDIT_APPROVED',
                                    `Approved: R ${approveData.amount} for ${approveData.term} mo @ ${approveData.interest}%`
                                )
                            }
                            className="flex-1 py-4 px-6 bg-blue-600 rounded-2xl text-white font-bold hover:bg-blue-500 shadow-xl shadow-blue-600/10"
                        >
                            Confirm Approval
                        </button>
                    </div>
                )}
            >
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black">Approved Amount (R)</label>
                            <input 
                                type="number"
                                value={approveData.amount}
                                onChange={(e) => setApproveData({...approveData, amount: e.target.value})}
                                className="input-field"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black">Term (Months)</label>
                            <select 
                                value={approveData.term}
                                onChange={(e) => setApproveData({...approveData, term: e.target.value})}
                                className="input-field"
                            >
                                <option value="6">6 Months</option>
                                <option value="12">12 Months</option>
                                <option value="18">18 Months</option>
                                <option value="24">24 Months</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 uppercase font-black">Interest Rate (%)</label>
                            <input 
                                type="number"
                                value={approveData.interest}
                                onChange={(e) => setApproveData({...approveData, interest: e.target.value})}
                                className="input-field"
                            />
                        </div>
                    </div>
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-start gap-4">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-emerald-400">Compliance Verified</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter font-bold">Funds will be moved to Finance Payout Queue upon confirmation.</p>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                title="Decline Credit Application"
                footer={(
                    <div className="flex gap-4">
                        <button onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 px-6 border border-slate-800 rounded-2xl text-slate-500 font-bold hover:text-white">Cancel</button>
                        <button 
                            disabled={!rejectReason}
                            onClick={() =>
                                handleLifecycleAction(
                                    LIFECYCLE_ACTIONS.CREDIT_REJECT,
                                    'Application rejected',
                                    rejectReason
                                )
                            }
                            className="flex-1 py-4 px-6 bg-red-600 rounded-2xl text-white font-bold hover:bg-red-500 disabled:opacity-50 transition-all font-display uppercase tracking-widest text-xs"
                        >
                            Reject Application
                        </button>
                    </div>
                )}
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Primary Reason for Rejection</label>
                        <select 
                             value={rejectReason}
                             onChange={(e) => setRejectReason(e.target.value)}
                             className="input-field py-4"
                        >
                            <option value="">Select a reason...</option>
                            <option value="Inadequate Income">Inadequate Income</option>
                            <option value="Poor Credit History">Poor Credit History</option>
                            <option value="DTI Too High">DTI Too High</option>
                            <option value="Incomplete Documentation">Incomplete Documentation</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl flex items-start gap-4">
                        <XCircle className="w-5 h-5 text-red-500 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-red-400">Final Decision Warning</p>
                            <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">Declined applicants are archived. This action is recorded in the immutable audit log.</p>
                        </div>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={isRequestInfoModalOpen}
                onClose={() => setIsRequestInfoModalOpen(false)}
                title="Request Applicant Information"
                footer={(
                    <div className="flex gap-4">
                        <button onClick={() => setIsRequestInfoModalOpen(false)} className="flex-1 py-4 px-6 border border-slate-800 rounded-2xl text-slate-500 font-bold hover:text-white">Cancel</button>
                        <button 
                            disabled={!requestMsg}
                            onClick={() =>
                                handleLifecycleAction(
                                    LIFECYCLE_ACTIONS.CREDIT_REQUEST_INFO,
                                    'Moved back to SUBMITTED for additional info',
                                    requestMsg
                                )
                            }
                            className="flex-1 py-4 px-6 bg-slate-100 text-slate-900 rounded-2xl font-bold hover:bg-white disabled:opacity-50"
                        >
                            Send Request
                        </button>
                    </div>
                )}
            >
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] text-slate-500 uppercase font-black">Information Requested</label>
                        <textarea 
                            value={requestMsg}
                            onChange={(e) => setRequestMsg(e.target.value)}
                            className="input-field min-h-[120px] py-4" 
                            placeholder="Detail what documents or information are missing..."
                        />
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl text-blue-400">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-bold">The applicant will be notified to upload the requested information.</p>
                    </div>
                </div>
            </Modal>

            <DocumentPreviewModal
                isOpen={!!previewDoc}
                onClose={() => setPreviewDoc(null)}
                documentTitle={previewDoc?.title}
                htmlContent={previewDoc?.html}
                borrowerEmail={app.email || ''}
                defaultFilename={previewDoc?.filename}
                onDownloadPdf={async (element, filename) => {
                    try {
                        cleanupHtml2PdfArtifacts();
                        const html2pdfFn = resolveHtml2Pdf();
                        if (!html2pdfFn) {
                            throw new Error('PDF engine unavailable');
                        }
                        await html2pdfFn()
                            .set({
                                margin: 8,
                                filename,
                                image: { type: 'jpeg', quality: 0.98 },
                                html2canvas: {
                                    scale: 2,
                                    useCORS: true,
                                    onclone: (clonedDoc) => {
                                        clonedDoc.querySelectorAll('style,link[rel="stylesheet"]').forEach((el) => el.remove());
                                        const safeStyle = clonedDoc.createElement('style');
                                        safeStyle.textContent = `
                                          * { font-family: Arial, sans-serif !important; }
                                          html, body { background: #ffffff !important; color: #0f172a !important; }
                                        `;
                                        clonedDoc.head.appendChild(safeStyle);
                                    },
                                },
                                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                            })
                            .from(element)
                            .save();
                        setToast({ message: `${filename} downloaded successfully.`, type: 'success' });
                    } catch (error) {
                        setToast({
                            message: `Failed to generate document PDF${error?.message ? `: ${error.message}` : ''}.`,
                            type: 'danger'
                        });
                    } finally {
                        cleanupHtml2PdfArtifacts();
                    }
                }}
                onSendEmail={({ borrowerEmail, bankEmail, documentTitle }) => {
                    if (!borrowerEmail || !bankEmail || !bankEmail.includes('@')) {
                        setToast({ message: 'Enter valid borrower and bank/compliance email.', type: 'danger' });
                        return;
                    }
                    setToast({
                        message: `${documentTitle} queued for email to ${borrowerEmail} and ${bankEmail}.`,
                        type: 'success'
                    });
                }}
            />
        </>
    );
};

const AssessmentCard = ({ title, value, sub, icon: Icon, variant }) => {
    const variants = {
        primary: 'text-blue-400 bg-blue-600/10 border-blue-500/20',
        success: 'text-emerald-400 bg-emerald-600/10 border-emerald-500/20',
        warning: 'text-amber-400 bg-amber-600/10 border-amber-500/20',
        danger: 'text-red-400 bg-red-600/10 border-red-500/20'
    };

    return (
        <div className={`p-5 rounded-3xl border ${variants[variant] || variants.primary} space-y-3 group hover:scale-[1.02] transition-all`}>
            <div className="flex items-center justify-between">
                <div className="p-2 bg-slate-950 rounded-xl border border-slate-800">
                    <Icon className="w-4 h-4" />
                </div>
            </div>
            <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{title}</p>
                <p className="text-xl font-display font-black truncate">{value}</p>
                <p className="text-[9px] font-bold uppercase tracking-tighter opacity-40 mt-1">{sub}</p>
            </div>
        </div>
    );
};

export default CreditProfilePage;
