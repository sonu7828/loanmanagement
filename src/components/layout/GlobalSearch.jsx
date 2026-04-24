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
        const employeeApps = applications.filter(app => app.email === user?.email);
        
        // 1. Applications
        const apps = employeeApps.map(app => ({
            id: app.id,
            title: `Loan Application ${app.id}`,
            subtitle: `${app.company} • ${app.purpose}`,
            status: app.status,
            amount: `R ${app.amount?.toLocaleString()}`,
            date: new Date(app.date).toLocaleDateString(),
            category: 'Applications',
            path: `/employee/status`, // Navigate to status page or specific view
            searchable: `${app.id} ${app.status} ${app.amount} ${app.date} ${app.purpose} ${app.company}`.toLowerCase()
        }));

        // 2. Statements / Transactions
        const txs = employeeApps.flatMap(app => {
            const t = [];
            if (app.transactionId) {
                t.push({
                    id: app.transactionId,
                    title: `Disbursement: ${app.transactionId}`,
                    subtitle: `Reference: ${app.id}`,
                    status: 'Completed',
                    amount: `+ R ${app.amount?.toLocaleString()}`,
                    date: new Date(app.disbursedAt || app.date).toLocaleDateString(),
                    category: 'Statements',
                    path: '/employee/statements',
                    searchable: `${app.transactionId} Disbursement ${app.amount} ${app.id}`.toLowerCase()
                });
            }
            (app.installments || []).forEach(inst => {
                t.push({
                    id: `TX-${inst.id}-${app.id}`,
                    title: `Repayment: ${app.id}`,
                    subtitle: `Installment #${inst.id}`,
                    status: inst.status,
                    amount: `- R ${inst.amount?.toLocaleString()}`,
                    date: new Date(inst.dueDate).toLocaleDateString(),
                    category: 'Statements',
                    path: '/employee/statements',
                    searchable: `${app.id} Repayment ${inst.amount} ${inst.status} Installment`.toLowerCase()
                });
            });
            return t;
        });

        // 3. Documents
        const docs = [];
        // Mock user docs as seen in DocumentsCenter.jsx
        const userDocuments = [
            { id: 'doc-1', name: 'ID Document.pdf', type: 'Identification', date: '2024-04-10', status: 'Verified' },
            { id: 'doc-2', name: 'Latest_Payslip.pdf', type: 'Income Proof', date: '2024-04-12', status: 'Verified' },
            { id: 'doc-3', name: 'Bank_Statement_3mo.pdf', type: 'Financial Proof', date: '2024-04-13', status: 'Pending' },
        ];
        
        userDocuments.forEach(doc => {
            docs.push({
                id: doc.id,
                title: doc.name,
                subtitle: doc.type,
                status: doc.status,
                date: doc.date,
                category: 'Documents',
                path: '/employee/documents',
                searchable: `${doc.name} ${doc.type} ${doc.status} ${doc.date}`.toLowerCase()
            });
        });

        const letters = [
            { title: 'Settlement Letter', type: 'Settlement' },
            { title: 'Paid-Up Letter', type: 'Paid-Up' },
            { title: 'Loan Confirmation', type: 'Confirmation' },
        ];
        letters.forEach((l, idx) => {
            docs.push({
                id: `letter-${idx}`,
                title: l.title,
                subtitle: 'Official Generated Letter',
                status: 'Available',
                date: new Date().toLocaleDateString(),
                category: 'Documents',
                path: '/employee/documents',
                searchable: `${l.title} Official Letter`.toLowerCase()
            });
        });

        return [...apps, ...txs, ...docs];
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
            ['Applications', 'Statements', 'Documents'].forEach(cat => {
                if (grouped[cat]) flattened.push(...grouped[cat]);
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
                "hidden lg:flex items-center gap-2 px-6 py-2.5 bg-slate-900 border border-slate-800 rounded-full text-slate-500 group transition-all",
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
                                    {recentSearches.map((item) => (
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
                                {['Applications', 'Statements', 'Documents'].map(category => {
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
                                                                category === 'Applications' ? "bg-amber-50 text-amber-600" :
                                                                category === 'Statements' ? "bg-emerald-50 text-emerald-600" :
                                                                "bg-blue-50 text-blue-600",
                                                                isSelected && "scale-110 shadow-md"
                                                            )}>
                                                                {category === 'Applications' ? <FileText className="w-5 h-5" /> :
                                                                 category === 'Statements' ? <Receipt className="w-5 h-5" /> :
                                                                 <FileText className="w-5 h-5" />}
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
