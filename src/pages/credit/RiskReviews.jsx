import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShieldAlert, 
  Clock, 
  RotateCcw, 
  AlertTriangle,
  Search,
  Filter,
  Users,
  ChevronRight,
  MoreVertical,
  ArrowUpRight,
  XCircle,
  FileSearch
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLoans, STATUSES } from '../../context/LoanContext';
import { SectionHeader, Badge, StatCard, Toast } from '../../components/ui/Shared';

const RiskReviews = () => {
    const navigate = useNavigate();
    const { applications, updateStatus } = useLoans();
    
    // States
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [riskFilter, setRiskFilter] = useState('HIGH');
    const [statusFilter, setStatusFilter] = useState('All');
    const [assignedToMe, setAssignedToMe] = useState(false);
    const [toast, setToast] = useState(null);
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    // Initial Loading Simulation
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 600);
        return () => clearTimeout(timer);
    }, []);

    // Close menu on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Derived Stats (Filtering for Risk-relevant cases)
    const riskApps = useMemo(() => {
        return applications.filter(app => 
            app.risk === 'HIGH' || 
            app.risk === 'High' || 
            app.status === STATUSES.ESCALATED || 
            app.status === STATUSES.ON_HOLD ||
            app.status === STATUSES.NEED_REVIEW
        );
    }, [applications]);

    const stats = useMemo(() => [
        { 
            title: 'High Risk Cases', 
            value: riskApps.filter(a => (a.risk === 'HIGH' || a.risk === 'High')).length.toString(), 
            icon: ShieldAlert, 
            variant: 'danger' 
        },
        { 
            title: 'On Hold Cases', 
            value: riskApps.filter(a => a.status === STATUSES.ON_HOLD).length.toString(), 
            icon: Clock, 
            variant: 'warning' 
        },
        { 
            title: 'Re-review Required', 
            value: riskApps.filter(a => a.status === STATUSES.NEED_REVIEW).length.toString(), 
            icon: RotateCcw, 
            variant: 'primary' 
        },
    ], [riskApps]);

    // Filter Logic
    const filteredApps = useMemo(() => {
        return riskApps.filter(app => {
            const displayName = app.name || `No Name (ID: ${app.id})`;
            const matchesSearch = displayName.toLowerCase().includes(search.toLowerCase()) || 
                                 app.id.toLowerCase().includes(search.toLowerCase());
            
            const currentRisk = (app.risk || '').toUpperCase();
            const matchesRisk = riskFilter === 'All' || currentRisk === riskFilter;
            const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
            const matchesAssigned = !assignedToMe || app.assignedTo === 'Credit Officer';
            
            return matchesSearch && matchesRisk && matchesStatus && matchesAssigned;
        });
    }, [riskApps, search, riskFilter, statusFilter, assignedToMe]);

    // Simplified Actions via Context
    const handleAction = (id, newStatus, notes) => {
        updateStatus(id, newStatus, 'Credit Officer', notes);
        setToast({ message: `Status updated to ${newStatus}`, type: 'success' });
        setActiveMenu(null);
    };

    const handleReevaluate = (app) => {
        const newRisk = app.score > 500 ? "Medium" : "High";
        // Here we'd ideally have an updateRisk function, but we'll use notes for now
        updateStatus(app.id, STATUSES.UNDER_REVIEW, 'Credit Officer', `Re-evaluated Risk: ${newRisk}`);
        setToast({ message: `Risk re-evaluated as ${newRisk}`, type: 'info' });
        setActiveMenu(null);
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}

            <SectionHeader 
                title="Risk Verification Center" 
                description="Consolidated overview of high-risk applications and escalation protocols."
            />

            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-6 p-6 glass rounded-[32px] border-slate-800/50 items-center justify-between">
                <div className="flex-1 relative group w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="input-field pl-12 py-4" 
                        placeholder="Search IDs or names..." 
                    />
                </div>
                
                <div className="flex flex-wrap gap-4 items-center w-full lg:w-auto">
                    <FilterGroup 
                        label="Risk"
                        options={['All', 'HIGH', 'MEDIUM', 'LOW']}
                        value={riskFilter}
                        onChange={setRiskFilter}
                    />
                    
                    <button 
                        onClick={() => setAssignedToMe(!assignedToMe)}
                        className={`flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                            assignedToMe ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                        }`}
                    >
                        <Users className="w-3 h-3" />
                        My Assignments
                    </button>
                </div>
            </div>

            {/* Applications Display */}
            <div className="glass rounded-[32px] md:rounded-[40px] overflow-hidden border border-slate-800/50 shadow-2xl">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Applicant</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Primary Risk Factor</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Score</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Current Status</th>
                                <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/40">
                            {filteredApps.map((app) => (
                                <tr key={app.id} className="hover:bg-slate-800/30 transition-all group">
                                    <td className="px-8 py-6">
                                        <div>
                                            <p className="font-bold text-slate-200">{app.name || `No Name (ID: ${app.id.split('-')[1]})`}</p>
                                            <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">{app.id}</p>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 max-w-sm">
                                        <div className="flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                                            <span className="text-sm text-slate-400 font-medium leading-relaxed">{app.reason || 'DTI calculation requires manual verification.'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center">
                                        <div className="inline-flex flex-col items-center gap-1">
                                            <span className={`text-lg font-display font-black ${
                                                app.score >= 500 ? "text-blue-400" : "text-amber-400"
                                            }`}>{app.score || 'N/A'}</span>
                                            <div className="w-10 h-1 bg-slate-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full ${app.score >= 500 ? "bg-blue-500" : "bg-amber-500"}`} 
                                                    style={{ width: `${((app.score || 0) / 850) * 100}%` }} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <Badge variant={
                                            app.status === STATUSES.ESCALATED ? 'danger' : 
                                            app.status === STATUSES.ON_HOLD ? 'warning' : 'primary'
                                        }>
                                            {app.status}
                                        </Badge>
                                    </td>
                                    <td className="px-10 py-6 text-right relative">
                                        <div className="flex items-center justify-end gap-3">
                                            <button 
                                                onClick={() => navigate(`/credit/profile/${app.id}`)}
                                                className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center gap-2"
                                            >
                                                Review Case
                                                <ChevronRight className="w-3 h-3" />
                                            </button>
                                            
                                            <div className="relative">
                                                <button 
                                                    onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                                                    className={`p-2.5 rounded-xl border transition-all ${
                                                        activeMenu === app.id ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-200"
                                                    }`}
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>

                                                {activeMenu === app.id && (
                                                    <div 
                                                        ref={menuRef}
                                                        className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 p-2 animate-in fade-in zoom-in-95 duration-200"
                                                    >
                                                        <MenuButton 
                                                            icon={ArrowUpRight} 
                                                            label="Escalate" 
                                                            onClick={() => handleAction(app.id, STATUSES.ESCALATED, 'Escalated from Risk Reviews')} 
                                                        />
                                                        <MenuButton 
                                                            icon={RotateCcw} 
                                                            label="Re-evaluate" 
                                                            onClick={() => handleReevaluate(app)} 
                                                        />
                                                        <div className="h-px bg-slate-800 my-1 mx-2" />
                                                        <MenuButton 
                                                            icon={XCircle} 
                                                            label="Reject" 
                                                            variant="danger"
                                                            onClick={() => handleAction(app.id, STATUSES.DECLINED, 'Rejected during Risk Review')} 
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-slate-800/40">
                    {filteredApps.map((app) => (
                        <div key={app.id} className="p-6 space-y-4 hover:bg-slate-800/20 transition-all">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-slate-200">{app.name || `No Name (ID: ${app.id.split('-')[1]})`}</p>
                                    <p className="text-[10px] text-slate-500 font-mono mt-1 font-bold">{app.id}</p>
                                </div>
                                <Badge variant={
                                    app.status === STATUSES.ESCALATED ? 'danger' : 
                                    app.status === STATUSES.ON_HOLD ? 'warning' : 'primary'
                                }>
                                    {app.status}
                                </Badge>
                            </div>

                            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/50">
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2">Primary Risk Factor</p>
                                <p className="text-sm text-slate-400 font-medium leading-relaxed">{app.reason || 'DTI calculation requires manual verification.'}</p>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Risk Score</span>
                                    <span className={`text-lg font-display font-black ${app.score >= 500 ? "text-blue-400" : "text-amber-400"}`}>
                                        {app.score || 'N/A'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => navigate(`/credit/profile/${app.id}`)}
                                        className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all"
                                    >
                                        Review
                                    </button>
                                    <button 
                                        onClick={() => setActiveMenu(activeMenu === app.id ? null : app.id)}
                                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-500"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            
                            {/* Mobile Action Menu (Overlay logic simplified for mobile) */}
                            {activeMenu === app.id && (
                                <div className="p-2 space-y-1 bg-slate-900 border border-slate-800 rounded-2xl animate-in fade-in slide-in-from-top-2">
                                    <MenuButton icon={ArrowUpRight} label="Escalate" onClick={() => handleAction(app.id, STATUSES.ESCALATED, 'Escalated from Risk Reviews')} />
                                    <MenuButton icon={RotateCcw} label="Re-evaluate" onClick={() => handleReevaluate(app)} />
                                    <MenuButton icon={XCircle} label="Reject" variant="danger" onClick={() => handleAction(app.id, STATUSES.DECLINED, 'Rejected during Risk Review')} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {filteredApps.length === 0 && (
                    <div className="p-12 md:p-24 text-center space-y-4">
                        <FileSearch className="w-12 h-12 md:w-16 md:h-16 text-slate-800 mx-auto" />
                        <div>
                            <h3 className="text-xl font-display font-bold text-slate-300">Queue Clear</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2 font-medium">No applications currently match your risk filtering criteria.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const FilterGroup = ({ label, options, value, onChange }) => (
    <div className="flex flex-wrap items-center gap-1 sm:gap-2 p-1 bg-slate-900/50 border border-slate-800/50 rounded-2xl w-full sm:w-auto">
        <span className="px-2 sm:px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
        <div className="flex flex-wrap gap-1">
            {options.map(opt => (
                <button 
                    key={opt}
                    onClick={() => onChange(opt)}
                    className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-tighter transition-all ${
                        value === opt ? "bg-slate-800 text-white" : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                    }`}
                >
                    {opt}
                </button>
            ))}
        </div>
    </div>
);

const MenuButton = ({ icon: Icon, label, onClick, variant = 'neutral' }) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
            variant === 'danger' ? "text-red-400 hover:bg-red-500/10" : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }`}
    >
        <Icon className="w-4 h-4" />
        {label}
    </button>
);

export default RiskReviews;
