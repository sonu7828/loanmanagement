import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Receipt, Clock, X, ChevronRight, Loader2, ArrowRight } from 'lucide-react';
import { useLoans } from '../../context/LoanContext';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

const Highlight = ({ text, highlight }) => {
    if (!highlight || !highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.trim()})`, 'gi');
    const parts = text.toString().split(regex);
    return (
        <span>
            {parts.map((part, i) => 
                regex.test(part) ? (
                    <mark key={i} className="bg-blue-100 text-blue-600 rounded-sm px-0.5 font-bold">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </span>
    );
};

const GlobalSearch = () => {
    const { applications } = useLoans();
    const { user } = useAuth();
    const navigate = useNavigate();
    
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState(() => {
        const saved = localStorage.getItem('lms_recent_searches');
        return saved ? JSON.parse(saved) : [];
    });

    const searchRef = useRef(null);
    const inputRef = useRef(null);

    // Prepare searchable data
    const allSearchableData = useMemo(() => {
        const data = [];
        const role = user?.role?.toLowerCase() || 'employee';

        if (role === 'employee') {
            // Pages
            data.push(
                { id: 'emp-apply', title: 'Apply Loan', subtitle: 'Initiate a new loan request', category: 'Pages', path: '/employee/apply', searchable: 'apply loan initiate request' },
                { id: 'emp-status', title: 'My Status', subtitle: 'Check application updates', category: 'Pages', path: '/employee/status', searchable: 'my status check application updates' },
                { id: 'emp-statements', title: 'Statements', subtitle: 'Review payout & repayments', category: 'Pages', path: '/employee/statements', searchable: 'statements payout repayment transaction history' },
                { id: 'emp-docs', title: 'Letters & Documents', subtitle: 'Access official certificates', category: 'Pages', path: '/employee/documents', searchable: 'letters documents official certificates payslip id' },
                { id: 'emp-profile', title: 'Profile', subtitle: 'Personal credentials', category: 'Pages', path: '/employee/profile', searchable: 'profile personal credentials details account' }
            );

            // Applications
            const employeeApps = applications.filter(app => app.email === user?.email);
            employeeApps.forEach(app => {
                data.push({
                    id: app.id,
                    title: `Loan Application ${app.id}`,
                    subtitle: `${app.company} • ${app.purpose}`,
                    status: app.status,
                    amount: `R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.date).toLocaleDateString(),
                    category: 'Applications',
                    path: `/employee/status`,
                    searchable: `${app.id} ${app.status} ${app.amount} ${app.date} ${app.purpose} ${app.company}`.toLowerCase()
                });

                if (app.transactionId) {
                    data.push({
                        id: `tx-${app.transactionId}`,
                        title: `Disbursement: ${app.transactionId}`,
                        subtitle: `Reference: ${app.id}`,
                        status: 'Completed',
                        amount: `+ R ${app.amount?.toLocaleString()}`,
                        date: new Date(app.disbursedAt || app.date).toLocaleDateString(),
                        category: 'Statements',
                        path: '/employee/statements',
                        searchable: `${app.transactionId} disbursement ${app.amount} ${app.id}`.toLowerCase()
                    });
                }
            });
        } 
        else if (role === 'hr') {
            data.push(
                { id: 'hr-verifications', title: 'Verifications Queue', subtitle: 'Process employer confirmations', category: 'Pages', path: '/hr/verifications', searchable: 'verifications queue process employer confirmations' },
                { id: 'hr-employees', title: 'Employees Directory', subtitle: 'View staff payroll records', category: 'Pages', path: '/hr/employees', searchable: 'employees directory staff payroll records names' },
                { id: 'hr-new-loans', title: 'New Loans Report', subtitle: 'Payroll extraction lists', category: 'Pages', path: '/hr/new-loans', searchable: 'new loans report extraction list payroll' },
                { id: 'hr-overdue', title: 'Overdue Report', subtitle: 'Track payment gaps', category: 'Pages', path: '/hr/overdue', searchable: 'overdue report track payment gaps arrears' },
                { id: 'hr-remittances', title: 'Remittance Advice', subtitle: 'Upload verified deduction schedules', category: 'Pages', path: '/hr/remittances', searchable: 'remittance advice upload deduction schedule' },
                { id: 'hr-reports', title: 'HR Reports', subtitle: 'Performance updates', category: 'Pages', path: '/hr/reports', searchable: 'hr reports updates' }
            );

            applications.forEach(app => {
                data.push({
                    id: `hr-app-${app.id}`,
                    title: `Verification: ${app.name || 'Applicant'}`,
                    subtitle: `App ID: ${app.id} • Company: ${app.company}`,
                    status: app.status,
                    amount: `R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.date).toLocaleDateString(),
                    category: 'Verifications',
                    path: `/hr/verifications/${app.id}`,
                    searchable: `${app.id} ${app.name} ${app.company} ${app.status}`.toLowerCase()
                });
            });
        }
        else if (role === 'admin') {
            data.push(
                { id: 'adm-dash', title: 'Admin Dashboard', subtitle: 'System overview parameters', category: 'Pages', path: '/admin/dashboard', searchable: 'dashboard overview parameters system' },
                { id: 'adm-apps', title: 'Applications Status', subtitle: 'Track application pathways', category: 'Pages', path: '/admin/applications', searchable: 'applications status process pathways' },
                { id: 'adm-users', title: 'User Management', subtitle: 'Role assignments controls', category: 'Pages', path: '/admin/users', searchable: 'users management role assignments controls permissions' },
                { id: 'adm-companies', title: 'Company Records', subtitle: 'Affiliate setups management', category: 'Pages', path: '/admin/companies', searchable: 'companies records affiliates setups management' },
                { id: 'adm-recon', title: 'Reconciliation', subtitle: 'Balance clearing updates', category: 'Pages', path: '/admin/reconciliation', searchable: 'reconciliation balance clearing updates' }
            );

            applications.forEach(app => {
                data.push({
                    id: `adm-app-${app.id}`,
                    title: `Application ${app.id} (${app.name || 'Applicant'})`,
                    subtitle: `${app.company} • Amount: R ${app.amount?.toLocaleString()}`,
                    status: app.status,
                    amount: `R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.date).toLocaleDateString(),
                    category: 'Applications',
                    path: `/admin/applications/${app.id}`,
                    searchable: `${app.id} ${app.name} ${app.status} ${app.company} ${app.purpose} process stages`.toLowerCase()
                });
            });
        }
        else if (role === 'credit') {
            data.push(
                { id: 'cred-queue', title: 'Credit Queue', subtitle: 'Pending review assessments', category: 'Pages', path: '/credit/queue', searchable: 'credit queue pending assessment reviews' },
                { id: 'cred-reviews', title: 'Risk Reviews', subtitle: 'Scoring checks thresholds', category: 'Pages', path: '/credit/reviews', searchable: 'risk reviews scoring checks thresholds outcomes' },
                { id: 'cred-hist', title: 'Assessment History', subtitle: 'Audited score outputs', category: 'Pages', path: '/credit/history', searchable: 'assessment history audited score outcomes logs' }
            );

            applications.forEach(app => {
                data.push({
                    id: `cred-app-${app.id}`,
                    title: `Credit Assessment: ${app.name || 'Applicant'}`,
                    subtitle: `Loan ID: ${app.id} • Risk Tier: ${app.riskTier || 'B'}`,
                    status: app.status,
                    amount: `R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.date).toLocaleDateString(),
                    category: 'Credit Queue',
                    path: `/credit/profile/${app.id}`,
                    searchable: `${app.id} ${app.name} ${app.status} high risk credit score records applicant`.toLowerCase()
                });
            });
        }
        else if (role === 'finance') {
            data.push(
                { id: 'fin-payouts', title: 'Payouts Queue', subtitle: 'EFT disbursement checks', category: 'Pages', path: '/finance/payouts', searchable: 'payouts queue eft disbursement checks release' },
                { id: 'fin-batch', title: 'Batch Processing', subtitle: 'Payroll remittance allocations', category: 'Pages', path: '/finance/reconciliation', searchable: 'batch processing payroll remittance allocations reconciliation manual figures' },
                { id: 'fin-settle', title: 'Settlements', subtitle: 'Outstanding pipeline offsets', category: 'Pages', path: '/finance/settlement', searchable: 'settlements pipeline offsets outstanding' },
                { id: 'fin-reports', title: 'Finance Reports', subtitle: 'Audited balances outputs', category: 'Pages', path: '/finance/reports', searchable: 'finance reports audited balances yields' },
                { id: 'fin-write', title: 'Write-Offs', subtitle: 'Loss coverage assessments', category: 'Pages', path: '/finance/write-offs', searchable: 'write offs loss coverage assessments bad debts' }
            );

            applications.forEach(app => {
                data.push({
                    id: `fin-app-${app.id}`,
                    title: `Payment Ref: ${app.paymentRef || app.id}`,
                    subtitle: `EFT ID: ${app.transactionId || 'N/A'} • Status: ${app.status}`,
                    status: app.status,
                    amount: `R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.disbursedAt || app.date).toLocaleDateString(),
                    category: 'Transactions',
                    path: `/finance/payouts`,
                    searchable: `${app.id} ${app.transactionId} ${app.paymentRef} payout transaction references`.toLowerCase()
                });
            });
        }
        else if (role === 'management') {
            data.push(
                { id: 'mgmt-invest', title: 'Investor Center', subtitle: 'Governance ROI analytics', category: 'Pages', path: '/management/investor', searchable: 'investor center governance roi analytics metrics presentation' },
                { id: 'mgmt-age', title: 'Age Analysis', subtitle: 'Arrears thresholds distributions', category: 'Pages', path: '/management/age-analysis', searchable: 'age analysis arrears thresholds distributions 30 60 90 120' },
                { id: 'mgmt-rep', title: 'Portfolio Reports', subtitle: 'Yield breakdowns exports', category: 'Pages', path: '/management/reports', searchable: 'portfolio reports yield breakdowns exports kpi metrics' },
                { id: 'mgmt-back', title: 'Backup Logs', subtitle: 'System preservation checkpoints', category: 'Pages', path: '/management/backups', searchable: 'backup logs preservation checkpoints system' }
            );

            data.push({
                id: 'mgmt-kpi',
                title: 'Executive Performance KPI',
                subtitle: 'Real-time analytics yields',
                status: 'Active',
                category: 'KPI Metrics',
                path: '/management/investor',
                searchable: 'revenue reports metrics analytics kpi yield graphs charts'.toLowerCase()
            });
        }
        else if (role === 'recovery') {
            data.push(
                { id: 'rec-list', title: 'Recovery Cases', subtitle: 'Active delinquency queues', category: 'Pages', path: '/recovery/list', searchable: 'recovery cases active delinquency queues accounts' },
                { id: 'rec-col', title: 'Collections History', subtitle: 'PTP enforcement milestones', category: 'Pages', path: '/recovery/collections', searchable: 'collections history ptp enforcement milestones tracking' },
                { id: 'rec-track', title: 'Payment Tracking', subtitle: 'Pipeline debt collections', category: 'Pages', path: '/recovery/tracking', searchable: 'payment tracking pipeline debt collections arrears cases' }
            );

            applications.forEach(app => {
                data.push({
                    id: `rec-app-${app.id}`,
                    title: `Delinquent: ${app.name || 'Borrower'}`,
                    subtitle: `Loan ID: ${app.id} • Arrears: ${app.recoveryStatus}`,
                    status: app.status,
                    amount: `R ${app.outstandingAmount?.toLocaleString()}`,
                    date: new Date(app.date).toLocaleDateString(),
                    category: 'Arrears Accounts',
                    path: `/recovery/case/${app.id}`,
                    searchable: `${app.id} ${app.name} arrears write off transfer borrower tracking`.toLowerCase()
                });
            });
        }

        return data;
    }, [applications, user]);

    // Handle Search Logic with Debounce
    useEffect(() => {
        const trimmedQuery = query.trim().toLowerCase();
        if (!trimmedQuery) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            const filtered = allSearchableData.filter(item => 
                item.searchable.includes(trimmedQuery)
            );
            
            // Group by category
            const grouped = filtered.reduce((acc, item) => {
                if (!acc[item.category]) acc[item.category] = [];
                acc[item.category].push(item);
                return acc;
            }, {});

            // Flatten for easier index management
            const flattened = [];
            Object.keys(grouped).forEach(cat => {
                flattened.push(...grouped[cat]);
            });

            setResults(flattened);
            setSelectedIndex(0);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [query, allSearchableData]);

    // Keyboard support
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isOpen) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % (results.length || 1));
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
            } else if (e.key === 'Enter' && results.length > 0) {
                e.preventDefault();
                handleSelect(results[selectedIndex]);
            } else if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (item) => {
        // Save to recent searches
        const newRecent = [
            { id: item.id, title: item.title, category: item.category, path: item.path },
            ...recentSearches.filter(r => r.id !== item.id)
        ].slice(0, 5);
        setRecentSearches(newRecent);
        localStorage.setItem('lms_recent_searches', JSON.stringify(newRecent));

        setQuery('');
        setIsOpen(false);
        navigate(item.path);
        
        // If it's a specific record on a page, we might want to highlight it.
        // For now, we just navigate.
    };

    return (
        <div className="relative flex-1 max-w-md min-w-0" ref={searchRef}>
            {/* Search Input Area (Matches existing UI) */}
            <div className={cn(
                "flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-500 group transition-all",
                isOpen && "border-blue-500/50 shadow-lg shadow-blue-500/5"
            )}>
                {loading ? (
                    <Loader2 className="w-4 h-4 flex-shrink-0 text-blue-500 animate-spin" />
                ) : (
                    <Search className={cn("w-4 h-4 flex-shrink-0 transition-colors", isOpen || query ? "text-blue-500" : "group-hover:text-blue-500")} />
                )}
                <input 
                    ref={inputRef}
                    type="text" 
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="search anything..." 
                    className="bg-transparent border-none outline-none text-sm w-full min-w-0 placeholder:text-slate-500 lowercase font-medium text-slate-200" 
                />
                {query && (
                    <button 
                        onClick={() => { setQuery(''); inputRef.current?.focus(); }}
                        className="p-0.5 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>

            {/* Results Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-slate-200 rounded-[32px] shadow-2xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 max-h-[80vh] flex flex-col">
                    <div className="overflow-y-auto p-2 no-scrollbar">
                        {!query && recentSearches.length > 0 && (
                            <div className="p-4">
                                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">Recent Searches</h3>
                                <div className="space-y-1">
                                    {recentSearches.filter(r => r.path.startsWith(`/${user?.role?.toLowerCase() || 'employee'}`)).map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => handleSelect(item)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl transition-all group text-left"
                                        >
                                            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-200 truncate">{item.title}</p>
                                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.category}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {query && results.length === 0 && !loading && (
                            <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                    <Search className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-slate-200">No results found</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-1">Try searching for loan IDs, status, or document names.</p>
                                </div>
                            </div>
                        )}

                        {query && results.length > 0 && (
                            <div className="space-y-6 p-2">
                                {Array.from(new Set(results.map(r => r.category))).map(category => {
                                    const categoryResults = results.filter(r => r.category === category);
                                    if (categoryResults.length === 0) return null;

                                    return (
                                        <div key={category} className="space-y-2">
                                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] px-4 pt-2">{category}</h3>
                                            <div className="space-y-1">
                                                {categoryResults.map((item) => {
                                                    const isSelected = results[selectedIndex]?.id === item.id;
                                                    return (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => handleSelect(item)}
                                                            onMouseEnter={() => setSelectedIndex(results.indexOf(item))}
                                                            className={cn(
                                                                "w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left",
                                                                isSelected ? "bg-blue-50 shadow-sm border border-blue-100" : "hover:bg-slate-50 border border-transparent"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                                                                category === 'Pages' ? "bg-blue-50 text-blue-600" :
                                                                category === 'Applications' ? "bg-amber-50 text-amber-600" :
                                                                "bg-emerald-50 text-emerald-600",
                                                                isSelected && "scale-110 shadow-md"
                                                            )}>
                                                                {category === 'Pages' ? <ChevronRight className="w-5 h-5" /> :
                                                                 category === 'Applications' ? <FileText className="w-5 h-5" /> :
                                                                 <Receipt className="w-5 h-5" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <p className="text-sm font-black text-slate-200 truncate">
                                                                        <Highlight text={item.title} highlight={query} />
                                                                    </p>
                                                                    <span className="text-[10px] font-mono font-black text-slate-400 group-hover:text-slate-500">{item.date}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <p className="text-[10px] font-bold text-slate-500 truncate">
                                                                        <Highlight text={item.subtitle} highlight={query} />
                                                                    </p>
                                                                    <span className="text-slate-300">•</span>
                                                                    <span className={cn(
                                                                        "text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
                                                                        item.status === 'Approved' || item.status === 'Verified' || item.status === 'Completed' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                                                                        item.status === 'Pending' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                                                                        "bg-slate-100 text-slate-500 border border-slate-200"
                                                                    )}>
                                                                        {item.status}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <ArrowRight className="w-4 h-4 text-blue-500 animate-in slide-in-from-left-2 duration-300" />
                                                            )}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                    
                    {/* Footer Info */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[9px] font-black text-slate-400 uppercase tracking-widest">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1"><span className="p-1 bg-white border border-slate-200 rounded shadow-sm">↑↓</span> to navigate</span>
                            <span className="flex items-center gap-1"><span className="p-1 bg-white border border-slate-200 rounded shadow-sm">Enter</span> to select</span>
                        </div>
                        <span className="flex items-center gap-1"><span className="p-1 bg-white border border-slate-200 rounded shadow-sm">Esc</span> to close</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
