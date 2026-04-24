import React, { useState, useRef } from 'react';
import { X, Download, Mail, CheckCircle2, Loader2, FileText, Send } from 'lucide-react';
import html2pdf from 'html2pdf.js';

const LetterPreviewModal = ({ 
    isOpen, 
    onClose, 
    htmlContent, 
    loanId, 
    recipientEmail,
    title = "Letter Preview"
}) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [emailStatus, setEmailStatus] = useState('idle'); // idle, sending, success
    const [additionalEmail, setAdditionalEmail] = useState('');
    const contentRef = useRef(null);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!contentRef.current) return;
        setIsGenerating(true);
        
        try {
            const opt = {
                margin: 10,
                filename: `Lenni_Letter_${loanId}_${new Date().getTime()}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            await html2pdf().set(opt).from(contentRef.current).save();
        } catch (error) {
            console.error('PDF Generation Error:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleEmail = () => {
        setEmailStatus('sending');
        // Simulate API call
        setTimeout(() => {
            setEmailStatus('success');
            setTimeout(() => {
                setEmailStatus('idle');
                setAdditionalEmail('');
            }, 3000);
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative w-full max-w-4xl max-h-[90vh] glass rounded-[32px] md:rounded-[48px] border border-slate-800/50 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/40">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500">
                            <FileText className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-display font-bold text-slate-200">{title}</h3>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none mt-1">Ref: {loanId}</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 hover:bg-slate-800 rounded-2xl transition-all text-slate-500 hover:text-white"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-10 bg-slate-950/20 custom-scrollbar">
                    {/* The actual letter container for PDF generation */}
                    <div className="bg-white rounded-xl shadow-lg transform transition-transform duration-500 hover:scale-[1.01] origin-top">
                        <div 
                            ref={contentRef}
                            className="p-0 m-0"
                            dangerouslySetInnerHTML={{ __html: htmlContent }}
                        />
                    </div>
                </div>

                {/* Footer / Actions */}
                <div className="p-6 md:p-8 border-t border-slate-800/50 bg-slate-900/60">
                    <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
                        
                        {/* Email Simulation Section */}
                        <div className="flex-1 space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Send to Email</label>
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input 
                                        type="email"
                                        placeholder="Add CC email (optional)..."
                                        value={additionalEmail}
                                        onChange={(e) => setAdditionalEmail(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-sm text-slate-200 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>
                                <button 
                                    onClick={handleEmail}
                                    disabled={emailStatus !== 'idle'}
                                    className={`px-6 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg ${
                                        emailStatus === 'success' 
                                            ? "bg-emerald-600/10 text-emerald-400 border border-emerald-500/20" 
                                            : "bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500"
                                    }`}
                                >
                                    {emailStatus === 'sending' ? <Loader2 className="w-4 h-4 animate-spin" /> : 
                                     emailStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : 
                                     <Send className="w-4 h-4" />}
                                    {emailStatus === 'sending' ? 'Sending...' : 
                                     emailStatus === 'success' ? 'Dispatched' : 'Email Letter'}
                                </button>
                            </div>
                            <p className="text-[10px] text-slate-500 italic pl-1">Primary: {recipientEmail}</p>
                        </div>

                        {/* Download Button */}
                        <button 
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Download className="w-5 h-5" />
                            )}
                            {isGenerating ? 'Rendering PDF...' : 'Download File'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LetterPreviewModal;
