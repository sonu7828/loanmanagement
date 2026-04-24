import React, { useState } from 'react';
import {
    Users,
    Search,
    Filter,
    Eye,
    Briefcase,
    DollarSign,
    ShieldCheck,
    XCircle,
    AlertCircle,
} from 'lucide-react';
import { SectionHeader, Badge, StatCard, Toast, Modal } from '../../components/ui/Shared';
import { useLoans, STATUSES } from '../../context/LoanContext';
import VerificationDetailsView from '../../components/hr/VerificationDetailsView';

const HREmployees = () => {
    const { applications, updateStatus } = useLoans();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    const employees = [
        { id: 'EMP-9021', name: 'Sarah Jenkins', dept: 'Engineering', role: 'Senior Developer', salary: 22500, joinDate: '2022-05-15', status: 'Active', email: 's.jenkins@techflow.io' },
        { id: 'EMP-8842', name: 'Michael Chen', dept: 'Marketing', role: 'Growth Lead', salary: 18000, joinDate: '2021-11-20', status: 'Active', email: 'm.chen@techflow.io' },
        { id: 'EMP-1029', name: 'Lerato Molefe', dept: 'Operations', role: 'HR Specialist', salary: 24000, joinDate: '2020-03-10', status: 'Active', email: 'l.molefe@techflow.io' },
        { id: 'EMP-5521', name: 'David Smith', dept: 'Finance', role: 'Senior Accountant', salary: 45000, joinDate: '2019-08-01', status: 'On Leave', email: 'd.smith@techflow.io' },
        { id: 'EMP-4432', name: 'John Doe', dept: 'Sales', role: 'Account Executive', salary: 15600, joinDate: '2023-01-15', status: 'Active', email: 'j.doe@techflow.io' },
        { id: 'EMP-3211', name: 'Emily Brown', dept: 'Engineering', role: 'QA Engineer', salary: 19500, joinDate: '2022-10-12', status: 'Active', email: 'e.brown@techflow.io' },
    ];

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.dept.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getActiveApplication = (name) => {
        return (applications || []).find(app => 
            (app.name === name || app.email === name) &&
            (app.status === STATUSES.HR_PENDING || app.status === STATUSES.SUBMITTED)
        );
    };

    const activeApp = selectedEmployee ? getActiveApplication(selectedEmployee.name) : null;

    const handleApprove = () => {
        setIsLoading(true);
        setTimeout(() => {
            if (activeApp) {
                updateStatus(activeApp.id, STATUSES.HR_APPROVED, 'HR Manager');
                setTimeout(() => {
                    updateStatus(activeApp.id, STATUSES.CREDIT_PENDING, 'System');
                    setIsLoading(false);
                    setToast({ message: 'HR Verification Successful!', type: 'success' });
                    setSelectedEmployee(null);
                }, 500);
            } else {
                setIsLoading(false);
                setToast({ message: 'No active application found for this employee.', type: 'danger' });
            }
        }, 800);
    };

    const handleReject = (reason) => {
        setIsLoading(true);
        setTimeout(() => {
            if (activeApp) {
                updateStatus(activeApp.id, STATUSES.HR_REJECTED, 'HR Manager');
                setIsLoading(false);
                setToast({ message: `Application rejected: ${reason}`, type: 'danger' });
                setSelectedEmployee(null);
            } else {
                setIsLoading(false);
                setToast({ message: 'No active application found.', type: 'danger' });
            }
        }, 800);
    };

    return (
        <>
            <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-700 pb-20">
                <SectionHeader
                    title="Employees"
                    description="Manage the corporate employee directory. Review personnel records and active loan verification status."
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-5">
                    <StatCard title="Total Staff" value={employees.length.toString()} icon={Users} variant="primary" />
                    <StatCard title="Active Applications" value={(applications || []).length.toString()} icon={DollarSign} variant="success" />
                    <StatCard title="Dept. Coverage" value="8" icon={Briefcase} variant="warning" />
                    <StatCard title="Compliance Rate" value="98%" icon={ShieldCheck} variant="primary" />
                </div>

                <div className="glass rounded-[24px] overflow-hidden border-slate-800 relative shadow-sm">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl -mr-32 -mt-32"></div>
                    <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/40 relative z-10">
                        <div className="relative space-y-1.5">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                <input
                                    className="input-field pl-10 py-2.5 text-sm w-full md:w-96 bg-slate-950/50"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 px-1 italic">Search by name, department, or employee ID</p>
                        </div>
                        <button 
                            className="flex items-center gap-2 px-5 py-2.5 glass rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-500/30 transition-all text-[10px] font-black uppercase tracking-widest border-slate-800"
                            title="Apply advanced filters to personnel list"
                        >
                            <Filter className="w-4 h-4" />
                            Directory Filters
                        </button>
                    </div>

                    <div className="relative z-10">
                        {/* Desktop View */}
                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left font-display">
                                <thead>
                                    <tr className="bg-slate-900/50 border-b border-slate-800/50">
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Employee</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID / Dept</th>
                                        <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Verification</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {filteredEmployees.map((emp) => {
                                        const hasActive = getActiveApplication(emp.name);
                                        return (
                                            <tr key={emp.id} className="hover:bg-slate-800/30 transition-all group cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                                                <td className="px-6 py-3.5">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-slate-400 group-hover:border-blue-500/50 transition-all">
                                                            {emp.name[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-slate-200">{emp.name}</p>
                                                            <p className="text-xs text-slate-500 font-medium">{emp.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5">
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm text-slate-300 font-mono font-bold">{emp.id}</p>
                                                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{emp.dept}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3.5 text-right">
                                                    {hasActive ? (
                                                        <Badge variant="warning" className="animate-pulse">Needs Verification</Badge>
                                                    ) : (
                                                        <div className="p-2 text-slate-500 group-hover:text-blue-400 bg-slate-900 border border-slate-800 rounded-xl transition-all inline-block">
                                                            <Eye className="w-5 h-5" />
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile View */}
                        <div className="md:hidden divide-y divide-slate-800/40">
                            {filteredEmployees.map((emp) => {
                                const hasActive = getActiveApplication(emp.name);
                                return (
                                    <div 
                                        key={emp.id} 
                                        className="p-5 space-y-4 hover:bg-slate-800/20 active:bg-slate-800/40 transition-colors cursor-pointer"
                                        onClick={() => setSelectedEmployee(emp)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-500">
                                                    {emp.name[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-slate-200">{emp.name}</p>
                                                    <p className="text-[9px] font-mono text-slate-500 uppercase tracking-tight">{emp.id}</p>
                                                </div>
                                            </div>
                                            {hasActive ? (
                                                <Badge variant="warning">Action Needed</Badge>
                                            ) : (
                                                <div className="p-2 text-slate-600 bg-slate-900 rounded-lg">
                                                    <Eye className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/30 font-black uppercase tracking-widest text-[9px]">
                                            <div className="flex items-center gap-2">
                                                <Briefcase className="w-3 h-3 text-slate-600" />
                                                <span className="text-slate-500">{emp.dept}</span>
                                            </div>
                                            <p className="text-slate-400">{emp.role}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shared Verification Modal */}
            <Modal
                isOpen={!!selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
                title="Application Verification"
                maxWidth="max-w-6xl"
            >
                <VerificationDetailsView
                    application={activeApp}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isLoading={isLoading}
                />
            </Modal>

            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        </>
    );
};

export default HREmployees;
