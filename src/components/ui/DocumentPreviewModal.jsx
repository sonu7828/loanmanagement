import React, { useState, useEffect, useRef } from 'react';
import { 
  Download, 
  Printer, 
  FileText, 
  Mail,
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import Modal from './Modal';

const DocumentPreviewModal = ({
  isOpen,
  onClose,
  documentTitle,
  documentType,
  htmlContent,
  borrowerEmail = '',
  bankEmail: initialBankEmail = '',
  defaultFilename,
  onDownloadPdf,
  onSendEmail,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [bankEmail, setBankEmail] = useState(initialBankEmail);
  const documentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setBankEmail(initialBankEmail);
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialBankEmail]);

  const handlePrint = () => {
    if (!htmlContent) {
      window.print();
      return;
    }

    const printWindow = document.createElement('iframe');
    printWindow.style.position = 'fixed';
    printWindow.style.right = '0';
    printWindow.style.bottom = '0';
    printWindow.style.width = '0';
    printWindow.style.height = '0';
    printWindow.style.border = '0';
    document.body.appendChild(printWindow);

    const doc = printWindow.contentWindow.document;
    doc.open();
    doc.write(`
      <html>
        <head>
          <title>${documentTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { 
              font-family: 'Inter', sans-serif; 
              padding: 40px; 
              color: #000; 
              background: #fff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .document-container { max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
            .logo-block { width: 60px; height: 60px; background: #000; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; border-radius: 12px; }
            .branding h1 { font-size: 20px; font-weight: 900; margin: 0; letter-spacing: -0.05em; }
            .branding p { font-size: 8px; font-weight: 900; text-transform: uppercase; margin-top: 4px; color: #666; }
            .meta { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; text-transform: uppercase; margin-bottom: 40px; }
            .content { font-size: 14px; line-height: 1.6; min-height: 500px; }
            .signature { margin-top: 60px; border-top: 1px solid #000; pt: 20px; display: flex; justify-content: space-between; align-items: flex-end; }
            .sig-text h4 { font-size: 12px; font-weight: 900; margin: 0; }
            .sig-text p { font-size: 8px; font-weight: 700; color: #666; margin-top: 4px; }
            .stamp { border: 4px solid #f0f0f0; padding: 10px; border-radius: 50%; opacity: 0.5; font-size: 8px; font-weight: 900; text-align: center; transform: rotate(-15deg); }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="document-container">
            <div class="header">
              <div style="display: flex; gap: 15px; align-items: center;">
                <div class="logo-block">L</div>
                <div class="branding">
                  <h1>LENNI PROTOCOL</h1>
                  <p>Verification Hub • NODE-RSA-02</p>
                </div>
              </div>
              <div style="text-align: right;">
                <p style="font-size: 10px; font-weight: 900; margin: 0;">OFFICIAL ARCHIVE COPY</p>
                <p style="font-size: 8px; color: #666; margin: 2px 0;">Johannesburg, South Africa</p>
              </div>
            </div>
            <div class="meta">
              <div>Artifact ID: LMS-AUDIT-${Math.random().toString(36).substring(4).toUpperCase()}</div>
              <div>Generated: ${new Date().toLocaleDateString()}</div>
            </div>
            <div class="content">${htmlContent}</div>
            <div class="signature">
              <div class="sig-text">
                <p style="font-size: 10px; color: #ddd; margin-bottom: 20px; font-style: italic;">Electronically Signed</p>
                <h4>Lenni Compliance Department</h4>
                <p>SECURE-AUTH-SYSTEM-V2</p>
              </div>
              <div class="stamp">
                VERIFIED<br/>ASSET
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    doc.close();

    setTimeout(() => {
      printWindow.contentWindow.focus();
      printWindow.contentWindow.print();
      setTimeout(() => {
        document.body.removeChild(printWindow);
      }, 500);
    }, 500);
  };

  const handleDownload = () => {
    if (onDownloadPdf && documentRef.current) {
      onDownloadPdf(documentRef.current, defaultFilename || `${documentTitle || 'Document'}.pdf`);
      return;
    }
    alert(`Initiating production download for: ${documentTitle}.pdf`);
  };

  const handleSendEmail = () => {
    if (!onSendEmail) return;
    onSendEmail({
      borrowerEmail,
      bankEmail,
      documentTitle,
      documentType,
    });
  };

  const modalFooter = (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
      <div className="flex items-center gap-3 text-[10px] text-black font-black uppercase tracking-[0.2em] bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
        Verified Audit Stream
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button 
          onClick={handlePrint}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-black hover:bg-slate-50 transition-all font-black text-[10px] uppercase tracking-widest border border-slate-200 shadow-sm active:scale-95"
        >
          <Printer className="w-4 h-4 text-slate-400" />
          <span>Print</span>
        </button>
        <button 
          onClick={handleDownload}
          className="w-full sm:w-auto px-10 py-3.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 transition-all font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          <span>Download</span>
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={documentTitle || 'Document Preview'}
      maxWidth="max-w-4xl"
      bodyClassName="bg-slate-50 p-2 sm:p-6 no-scrollbar"
      footer={modalFooter}
    >
      <div className="flex flex-col items-center min-h-0 pb-20">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-32 w-full">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-500/10 border-t-blue-600 rounded-full animate-spin" />
              <FileText className="absolute inset-0 m-auto w-6 h-6 text-blue-500/50" />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
              Syncing Secure Node...
            </span>
          </div>
        ) : (
          <div className="w-full max-w-3xl mx-auto">
            {/* The Paper Container */}
            <div 
              ref={documentRef}
              className="bg-white text-slate-900 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-2xl overflow-hidden w-full relative flex flex-col font-sans border border-slate-100"
            >
              {/* Decorative Document Edge */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800" />
              
              <div className="p-8 sm:p-12 flex-1 flex flex-col">
                {/* Document Header */}
                <div className="flex flex-col gap-10 sm:flex-row sm:justify-between sm:items-start border-b-2 border-slate-950 pb-12">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 sm:w-24 sm:h-24 bg-black rounded-3xl flex items-center justify-center text-white font-black text-4xl sm:text-5xl shadow-2xl ring-8 ring-slate-50">L</div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tighter text-black leading-none">LENNI PROTOCOL</h2>
                      <p className="text-[10px] sm:text-xs text-black font-black uppercase tracking-[0.3em] mt-3 font-sans">Verification Hub • NODE-RSA-02</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right space-y-2">
                    <p className="text-xs font-black text-black uppercase tracking-widest">OFFICIAL ARCHIVE COPY</p>
                    <p className="text-[10px] text-black font-black max-w-[200px] sm:ml-auto">Financial District, Central 400, Johannesburg, 2000</p>
                    <p className="text-[10px] font-black text-blue-600 tracking-widest uppercase">secure.verify.lenni.com</p>
                  </div>
                </div>

                {/* Audit Meta */}
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-8 border-b border-slate-100 pb-10">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-widest">Global Artifact ID</p>
                    <p className="text-xs font-mono font-black text-black uppercase tracking-tighter">
                      LMS-${Math.random().toString(36).substring(2, 10).toUpperCase()}-V${Math.floor(1000 + Math.random() * 9000)}
                    </p>
                  </div>
                  <div className="sm:text-right space-y-1.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-widest">Validation Timestamp</p>
                    <p className="text-xs font-black text-black uppercase tracking-tighter">{new Date().toLocaleString()}</p>
                  </div>
                </div>

                {/* Content Area */}
                <div className="mt-8 flex-1 flex flex-col text-black">
                  {htmlContent ? (
                    <div
                      className="text-slate-900 leading-relaxed text-sm sm:text-base prose prose-slate max-w-none 
                                 prose-headings:text-black prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                                 prose-strong:text-black prose-strong:font-black"
                      dangerouslySetInnerHTML={{ __html: htmlContent }}
                    />
                  ) : (
                    <div className="space-y-12 flex-1">
                      <div className="space-y-4">
                        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tighter leading-none">
                          {documentTitle}
                        </h1>
                        <div className="w-24 h-2 bg-blue-600" />
                      </div>

                      <div className="space-y-8 text-sm sm:text-lg leading-relaxed text-black font-medium">
                        <p className="font-black text-black italic text-xl">To Whom It May Concern,</p>
                        <p>
                          This formal communication serves to confirm and authenticate the status of the requested 
                          artifact within the Global Loan Management Ecosystem. The records contained herein have 
                          undergone multi-tier verification and meet the high-fidelity standards for corporate vetting.
                        </p>
                        <p>
                          This document is generated dynamically from the secure database and is electronically signed. 
                          The validity of the information is tied to the state of the core ledger at the exact 
                          timestamp recorded in the document metadata.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Signature Block */}
                <div className="mt-12 sm:mt-20 pt-8 border-t-2 border-black flex flex-col gap-12 sm:flex-row sm:justify-between sm:items-end">
                  <div className="space-y-10">
                    <div className="font-serif italic text-4xl sm:text-6xl text-slate-100/80 select-none tracking-tighter">Electronic Signature</div>
                    <div className="space-y-2">
                      <p className="text-sm sm:text-base font-black text-black uppercase tracking-tighter">Lenni Compliance Department</p>
                      <p className="text-[10px] text-black font-black uppercase tracking-[0.3em]">SECURE-TOKEN: {Math.random().toString(36).substring(4).toUpperCase()}-RSA-2048</p>
                    </div>
                  </div>
                  <div className="p-8 border-[8px] border-slate-50 bg-slate-50/30 rounded-full flex flex-col items-center gap-2 -rotate-12 opacity-60 select-none scale-110">
                    <ShieldCheck className="w-12 h-12 text-black" />
                    <span className="text-[10px] font-black text-black uppercase tracking-[0.4em] whitespace-nowrap">Verified Asset</span>
                  </div>
                </div>

                {/* Watermark */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-slate-900/[0.02] text-6xl sm:text-[160px] pointer-events-none select-none -rotate-45 z-0 whitespace-nowrap uppercase tracking-[0.5em]">
                  LENNI LMS
                </div>
              </div>
            </div>

            {/* Post-Letter Content (Email Actions) */}
            {htmlContent && onSendEmail && (
              <div className="mt-4 bg-white p-6 sm:p-8 rounded-[40px] border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-black uppercase tracking-tight">Electronic Distribution</h4>
                    <p className="text-[10px] text-black font-black uppercase tracking-widest mt-0.5 opacity-60">Send a secure copy directly</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-4">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-widest px-2">Borrower Email</p>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-xs text-black font-black"
                      value={borrowerEmail}
                      readOnly
                    />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black text-black uppercase tracking-widest px-2">Compliance Email</p>
                    <input
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-3.5 text-xs text-black font-black focus:border-blue-500 transition-all outline-none"
                      value={bankEmail}
                      onChange={(e) => setBankEmail(e.target.value)}
                      placeholder="Enter destination email..."
                    />
                  </div>
                  <div className="flex flex-col justify-end">
                    <button
                      onClick={handleSendEmail}
                      className="px-8 py-3.5 bg-black hover:bg-slate-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Sign & Transmit
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default DocumentPreviewModal;
