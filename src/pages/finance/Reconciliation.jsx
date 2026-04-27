import React, { useState, useMemo } from 'react';
import {
    Layers,
    CheckCircle2,
    AlertCircle,
    ArrowRight,
    Search,
    RefreshCw,
    Building2,
    Save,
    Calculator,
    Download,
    ChevronDown,
    X
} from 'lucide-react';
import { SectionHeader, Badge, Toast } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';

const Reconciliation = () => {
    const { applications, batchMarkAsPaid } = useLoans();
    const [selectedCompany, setSelectedCompany] = useState('Lenni Global');
    const [batchData, setBatchData] = useState([
        { id: 'APP-10925', name: 'Sipho Mdluli', expected: 1200, received: 1200, status: 'Matched' },
        { id: 'APP-10926', name: 'Nicolette Steyn', expected: 2500, received: 2500, status: 'Matched' },
        { id: 'REC-9942', name: 'Themba Khumalo', expected: 4500, received: 4500, status: 'Matched' },
        { id: 'REC-2210', name: 'Priya Pillay', expected: 1500, received: 1500, status: 'Matched' }
    ]);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState(null);

    const companies = useMemo(() => {
        const unique = [...new Set(applications.map(a => a.company).filter(Boolean))];
        return unique.length > 0 ? unique : ['Lenni Global', 'TechCorp', 'Mining Solutions'];
    }, [applications]);

    const activeLoansForCompany = useMemo(() => {
        if (!selectedCompany) return [];
        const filtered = applications.filter(app => 
            app.company === selectedCompany && 
            app.status === STATUSES.ACTIVE
        );
        
        if (filtered.length === 0) {
            return [
                { id: 'APP-10925', name: 'Sipho Mdluli', amount: 12000, salary: 18000, company: selectedCompany, status: STATUSES.ACTIVE },
                { id: 'APP-10926', name: 'Nicolette Steyn', amount: 25000, salary: 32000, company: selectedCompany, status: STATUSES.ACTIVE },
                { id: 'REC-9942', name: 'Themba Khumalo', amount: 45000, salary: 35000, company: selectedCompany, status: STATUSES.ACTIVE },
                { id: 'REC-2210', name: 'Priya Pillay', amount: 15000, salary: 25000, company: selectedCompany, status: STATUSES.ACTIVE }
            ];
        }
        return filtered;
    }, [selectedCompany, applications]);

    const handleLoadExpected = () => {
        if (!selectedCompany) {
            setToast({ message: 'Please select a company first.', type: 'warning' });
            return;
        }
        
        const data = activeLoansForCompany.map(loan => {
            const expectedAmount = Math.round((loan.amount * 0.1) * 100) / 100; // 10% EMI simulation
            return {
                id: loan.id,
                name: loan.name,
                expected: expectedAmount,
                received: expectedAmount,
                status: 'Matched'
            };
        });
        
        setBatchData(data);
        setToast({ message: `Loaded ${data.length} expected installments for ${selectedCompany}.`, type: 'info' });
    };

    const handleLoadDefaultRemittance = () => {
        if (batchData.length === 0) {
            handleLoadExpected();
        } else {
            setBatchData(prev => prev.map(item => ({
                ...item,
                received: item.expected,
                status: 'Matched'
            })));
            setToast({ message: 'Reset all installments to expected defaults.', type: 'success' });
        }
    };

    const handleValueChange = (id, value) => {
        setBatchData(prev => prev.map(item => {
            if (item.id === id) {
                const received = parseFloat(value) || 0;
                return {
                    ...item,
                    received,
                    status: received === item.expected ? 'Matched' : received === 0 ? 'Missing' : 'Mismatch'
                };
            }
            return item;
        }));
    };

    const handleSaveBatch = () => {
        if (batchData.length === 0) return;
        setProcessing(true);
        
        setTimeout(() => {
            const idsToPay = batchData.filter(d => d.received > 0).map(d => d.id);
            batchMarkAsPaid(idsToPay, `Batch Processing: ${selectedCompany}`);
            
            setProcessing(false);
            setToast({ message: `Successfully processed batch for ${selectedCompany}.`, type: 'success' });
            setBatchData([]);
            setSelectedCompany('');
        }, 1500);
    };

    const totalExpected = batchData.reduce((sum, item) => sum + item.expected, 0);
    const totalReceived = batchData.reduce((sum, item) => sum + item.received, 0);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <SectionHeader
                title="Batch Payroll Processing"
                description="Process employer deductions in bulk with manual override and automated reconciliation."
            />

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                {/* Sidebar Controls */}
                <div className="xl:col-span-1 space-y-6">
                    <div className="glass p-6 rounded-[32px] border border-slate-800/50 space-y-6 shadow-xl">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Select Company</label>
                            <div className="relative group">
                                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <select 
                                    value={selectedCompany}
                                    onChange={(e) => {
                                        setSelectedCompany(e.target.value);
                                        setBatchData([]);
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-sm text-slate-200 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold"
                                >
                                    <option value="">Choose Company...</option>
                                    {companies.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none" />
                            </div>
                        </div>

                        <button 
                            onClick={handleLoadExpected}
                            disabled={!selectedCompany || processing}
                            className="w-full py-4 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <RefreshCw className={`w-4 h-4 ${processing ? 'animate-spin' : ''}`} />
                            Load Expected
                        </button>

                        <button 
                            onClick={handleLoadDefaultRemittance}
                            disabled={!selectedCompany || processing || batchData.length === 0}
                            className="w-full py-4 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs font-black uppercase tracking-widest hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <Calculator className="w-4 h-4" />
                            Default Remittance
                        </button>

                        <div className="pt-4 border-t border-slate-800/50 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Expected</span>
                                <span className="text-sm font-mono font-bold text-slate-300">R {totalExpected.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-bold text-slate-500 uppercase">Received</span>
                                <span className={`text-sm font-mono font-bold ${totalReceived < totalExpected ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    R {totalReceived.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button 
                            onClick={handleSaveBatch}
                            disabled={batchData.length === 0 || processing}
                            className="w-full py-5 rounded-2xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-600/20 disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            <Save className="w-4 h-4" />
                            Process Batch
                        </button>
                    </div>

                    <div className="glass p-6 rounded-[32px] border border-slate-800/50 bg-blue-600/5 space-y-3">
                        <h4 className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                            <Calculator className="w-4 h-4" />
                            Pro Tip
                        </h4>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                            Mismatches are flagged automatically. You can manually adjust the "Received" column if payroll figures differ from system expectations.
                        </p>
                    </div>
                </div>

                {/* Main Table Area */}
                <div className="xl:col-span-3">
                    <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-2xl">
                        <div className="p-6 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/30">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-blue-500" />
                                <h3 className="text-lg font-display font-bold text-slate-100">Batch Processing Ledger</h3>
                            </div>
                            {batchData.length > 0 && (
                                <button className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors flex items-center gap-2">
                                    <Download className="w-4 h-4" /> Export Draft
                                </button>
                            )}
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-950/50 border-b border-slate-800/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Loan Ref</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Expected (R)</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Received (R)</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Match Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/30">
                                    {batchData.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-20 text-center">
                                                <div className="max-w-xs mx-auto space-y-4 opacity-40">
                                                    <Building2 className="w-12 h-12 mx-auto text-slate-600" />
                                                    <p className="text-sm font-bold text-slate-400">Select a company and load expected installments to begin.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        batchData.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-800/20 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-bold text-slate-200">{item.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs font-mono text-slate-500 uppercase font-bold">{item.id}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm font-mono text-slate-400 font-bold">{item.expected.toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="relative group">
                                                        <input 
                                                            type="number"
                                                            value={item.received}
                                                            onChange={(e) => handleValueChange(item.id, e.target.value)}
                                                            className={`bg-slate-950 border w-32 px-3 py-1.5 rounded-xl text-sm font-mono font-bold focus:outline-none transition-all ${
                                                                item.status === 'Matched' ? 'border-slate-800 focus:border-blue-500' : 'border-amber-500/50 bg-amber-500/5'
                                                            }`}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Badge variant={
                                                        item.status === 'Matched' ? 'success' : 
                                                        item.status === 'Missing' ? 'danger' : 'warning'
                                                    }>
                                                        {item.status}
                                                    </Badge>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default Reconciliation;
