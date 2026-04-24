import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  ArrowRightLeft,
  Banknote,
  ShieldCheck,
  Clock,
  Activity
} from 'lucide-react';
import { useLoans, STATUSES, EVENT_TYPES } from '../../context/LoanContext';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useAuth } from '../../context/AuthContext';

const HistoryPage = ({ title }) => {
    const { auditLogs, applications } = useLoans();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const historyRows = useMemo(() => {
        return auditLogs.map(log => {
            const app = applications.find(a => a.id === log.appId);
            return {
                ...log,
                EmployeeName: app?.name || 'Unknown',
                idNumber: app?.idNumber || 'N/A'
            };
        }).filter(row => {
            const matchesSearch = row.EmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                row.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                row.type.toLowerCase().includes(searchQuery.toLowerCase());
            
            if (user?.role === 'finance' || user?.role === 'management') {
                const financeEventTypes = [EVENT_TYPES.DISBURSED, EVENT_TYPES.PAID, EVENT_TYPES.FAILED, EVENT_TYPES.PAYMENT_RECORDED];
                return matchesSearch && financeEventTypes.includes(row.type);
            }
            return matchesSearch;
        });
    }, [auditLogs, applications, searchQuery, user]);

    return (
        <div className="space-y-8 animate-in duration-700 pb-20">
            <SectionHeader 
                title={title || "Portfolio Transparency Logs"} 
                description="Verifiable history of all loan lifecycle events, disbursements, and settlement actions."
            />

            <div className="glass p-10 rounded-[48px] border-slate-800 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full group-hover:bg-blue-600/10 transition-colors"></div>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10 relative z-10">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12 h-12 bg-slate-900 focus:bg-white" 
                            placeholder="Search history reference..." 
                        />
                    </div>
                </div>

                <div className="overflow-x-auto relative z-10">
                    <table className="w-full text-left font-display">
                        <thead>
                            <tr className="bg-slate-900 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Timestamp</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Identity</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Event Sequence</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-left">Execution Status</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">System Integrity ID</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {historyRows.length > 0 ? historyRows.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-900/50 transition-all group">
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2.5 bg-slate-900 rounded-xl text-slate-500 border border-slate-800 group-hover:text-blue-500 transition-colors">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-200">{new Date(log.timestamp).toLocaleDateString()}</p>
                                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">
                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-bold text-slate-500 group-hover:scale-110 transition-transform">
                                                {log.EmployeeName[0]}
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-slate-200">{log.EmployeeName}</span>
                                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mt-1">ID: {log.idNumber.slice(0, 8)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                            <span className="text-sm font-bold text-slate-400">
                                                {String(log.type || '').replaceAll('_', ' ')}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-7">
                                        <Badge 
                                            variant={
                                                log.status === STATUSES.ACTIVE ? 'primary' : 
                                                log.status === STATUSES.PAID ? 'success' : 
                                                log.status === STATUSES.REJECTED ? 'danger' : 'warning'
                                            }
                                        >
                                            {log.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-7 text-right">
                                        <span className="text-xs font-mono font-bold text-slate-500 tracking-tight group-hover:text-blue-500 transition-colors">
                                            {log.transactionId || log.appId}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-32 text-center">
                                        <div className="flex flex-col items-center justify-center space-y-4">
                                            <Clock className="w-12 h-12 text-slate-700" />
                                            <p className="text-slate-500 font-medium">No history items found matched your search.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
