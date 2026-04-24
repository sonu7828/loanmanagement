import React, { useState } from 'react';
import {
    Database,
    Download,
    Cloud,
    HardDrive,
    ShieldCheck,
    History,
    RefreshCw,
    Server,
    ExternalLink,
    Clock,
    Lock
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';

const ManagementSystemBackups = () => {
    const [processing, setProcessing] = useState(null);
    const [toast, setToast] = useState(null);

    const handleAction = (action) => {
        setProcessing(action);
        setTimeout(() => {
            setProcessing(null);
            setToast({ message: `${action} completed successfully. System state persistent.`, type: 'success' });
        }, 2000);
    };

    const backupHistory = [
        { date: '2026-04-24 02:00 AM', size: '1.2 GB', type: 'Full Cloud', status: 'Success' },
        { date: '2026-04-23 02:00 AM', size: '1.18 GB', type: 'Full Cloud', status: 'Success' },
        { date: '2026-04-22 02:00 AM', size: '1.15 GB', type: 'Differential', status: 'Success' },
        { date: '2026-04-21 02:00 AM', size: '1.12 GB', type: 'Full Local', status: 'Success' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-20">
            <SectionHeader
                title="System Governance & Backups"
                description="Manage global system persistence, encrypted cloud synchronization, and local archival recovery."
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Primary Backup Controls */}
                <div className="lg:col-span-2 glass p-10 rounded-[56px] border border-slate-800/50 space-y-10 shadow-2xl relative overflow-hidden bg-slate-900/10">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 blur-[120px] -mr-40 -mt-40" />
                    
                    <div className="flex items-center justify-between relative z-10">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tight">Persistence Management</h3>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Encrypted Data Archival Control</p>
                        </div>
                        <Badge variant="success">System Healthy</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                        <div className="p-8 bg-slate-950 border border-slate-800 rounded-[40px] space-y-6 group hover:border-blue-500/30 transition-all shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-blue-600/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                                    <Download className="w-6 h-6" />
                                </div>
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">Local Archive</span>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-white">Download Local Copy</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Extract full SQL database and document attachments in encrypted ZIP format.</p>
                            </div>
                            <button 
                                onClick={() => handleAction('Local Backup')}
                                disabled={processing}
                                className="w-full py-4 bg-slate-800 hover:bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3"
                            >
                                {processing === 'Local Backup' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HardDrive className="w-4 h-4" />}
                                Generate Backup
                            </button>
                        </div>

                        <div className="p-8 bg-slate-950 border border-slate-800 rounded-[40px] space-y-6 group hover:border-emerald-500/30 transition-all shadow-xl">
                            <div className="flex items-center justify-between">
                                <div className="p-4 bg-emerald-600/10 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                                    <Cloud className="w-6 h-6" />
                                </div>
                                <Badge variant="success">Live Sync</Badge>
                            </div>
                            <div className="space-y-2">
                                <h4 className="text-lg font-bold text-white">Cloud Synchronization</h4>
                                <p className="text-xs text-slate-500 leading-relaxed">Trigger manual synchronization with off-site Azure Blob encrypted storage.</p>
                            </div>
                            <button 
                                onClick={() => handleAction('Cloud Sync')}
                                disabled={processing}
                                className="w-full py-4 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3"
                            >
                                {processing === 'Cloud Sync' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                Sync to Cloud
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-blue-600/5 border border-blue-500/10 rounded-[32px] flex items-center justify-between relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-blue-500">
                                <ShieldCheck className="w-5 h-5" />
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-xs font-bold text-slate-200 uppercase tracking-tight italic">256-Bit AES Encryption</p>
                                <p className="text-[10px] text-slate-600 font-bold uppercase">Compliance: SOC2 / ISO 27001 Ready</p>
                            </div>
                        </div>
                        <button className="text-[10px] font-black text-blue-400 uppercase tracking-widest hover:text-white transition-colors flex items-center gap-2">
                            Security Audit <ExternalLink className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Backup History Sidebar */}
                <div className="glass p-10 rounded-[56px] border border-slate-800/50 space-y-10 shadow-2xl bg-slate-950/40 flex flex-col">
                    <div className="space-y-1">
                        <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tight">Audit History</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Recent Persistence Events</p>
                    </div>

                    <div className="space-y-4 flex-grow overflow-y-auto pr-2 custom-scrollbar max-h-[500px]">
                        {backupHistory.map((item, i) => (
                            <div key={i} className="p-6 bg-slate-950 rounded-[32px] border border-slate-900 group hover:border-slate-800 transition-all flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-tight italic">{item.date}</p>
                                        <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">{item.type} • {item.size}</p>
                                    </div>
                                </div>
                                <Badge variant="success">OK</Badge>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-900 text-slate-500">
                            <Lock className="w-4 h-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Auto-Backup: Every 24h</p>
                        </div>
                        <button className="w-full py-5 rounded-[28px] border border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] hover:text-white hover:border-slate-700 transition-all flex items-center justify-center gap-3">
                            View Full History Log
                        </button>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default ManagementSystemBackups;
