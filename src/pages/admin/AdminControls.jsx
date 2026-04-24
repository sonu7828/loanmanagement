import React, { useState } from 'react';
import {
    Settings,
    Building2,
    Shield,
    GitBranch,
    History,
    Plus,
    Edit2,
    Trash2,
    Save,
    Search,
    ChevronRight,
    Lock,
    CheckCircle2
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';


const AdminControls = () => {
    const [activeTab, setActiveTab] = useState('companies');

    const tabs = [
        { id: 'companies', label: 'Companies', icon: Building2 },
        { id: 'roles', label: 'User Roles', icon: Shield },
        { id: 'status', label: 'Status Mapping', icon: GitBranch },
        { id: 'settings', label: 'System Settings', icon: Settings },
        { id: 'audit', label: 'Audit Logs', icon: History },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'companies': return <CompanyManagement />;
            case 'roles': return <RoleManagement />;
            case 'status': return <StatusMapping />;
            case 'settings': return <SystemSettings />;
            case 'audit': return <AuditLogs />;
            default: return null;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12">
            <SectionHeader
                title="System Administration"
                description="Advanced controls for managing companies, roles, and global system parameters."
            />

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-2 p-1.5 glass rounded-[24px] border-slate-800/50">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
                            activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="glass p-8 rounded-[40px] border-slate-800/50">
                {renderContent()}
            </div>
        </div>
    );
};

// --- Subcomponents ---

const CompanyManagement = () => {
    const companies = [
        { id: 1, name: 'TechFlow SA', employees: 1250, status: 'ACTIVE', creditLimit: 'R 5M' },
        { id: 2, name: 'Retail Group', employees: 4800, status: 'ACTIVE', creditLimit: 'R 12M' },
        { id: 3, name: 'Finance Corp', employees: 850, status: 'ACTIVE', creditLimit: 'R 10M' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-slate-200">Employer Network</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-xl text-xs font-bold text-white hover:bg-blue-500 transition-all">
                    <Plus className="w-4 h-4" /> Add Company
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {companies.map(c => (
                    <div key={c.id} className="p-6 bg-slate-950 rounded-3xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-blue-500 border border-slate-800">
                                <Building2 className="w-6 h-6" />
                            </div>
                            <Badge variant="success">{c.status}</Badge>
                        </div>
                        <h4 className="font-bold text-slate-200 text-lg mb-1">{c.name}</h4>
                        <p className="text-xs text-slate-500 mb-4">{c.employees} Enrolled Employees</p>
                        <div className="pt-4 border-t border-slate-800/50 flex items-center justify-between">
                            <p className="text-[10px] text-slate-400 font-bold uppercase">Limit: {c.creditLimit}</p>
                            <button className="text-blue-500 hover:text-blue-400">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const RoleManagement = () => {
    const roles = [
        { name: 'Administrator', permissions: 'ALL_ACCESS', users: 3 },
        { name: 'Credit Manager', permissions: 'ASSESSMENT_ONLY', users: 8 },
        { name: 'HR Officer', permissions: 'VERIFICATION_ONLY', users: 15 },
        { name: 'Finance Admin', permissions: 'PAYMENTS_ONLY', users: 5 },
    ];

    return (
        <div className="space-y-6">
            <h3 className="text-xl font-display font-black text-slate-200">Role Permissions</h3>
            <div className="overflow-hidden rounded-3xl border border-slate-800">
                <table className="w-full text-left">
                    <thead className="bg-slate-900/50">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Role Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Scope</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">Active Users</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {roles.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-900/30">
                                <td className="px-6 py-5 flex items-center gap-3">
                                    <Shield className="w-4 h-4 text-blue-500" />
                                    <span className="font-bold text-slate-200">{r.name}</span>
                                </td>
                                <td className="px-6 py-5 text-sm text-slate-400 font-mono">{r.permissions}</td>
                                <td className="px-6 py-5 text-center font-bold text-slate-200">{r.users}</td>
                                <td className="px-6 py-5 text-right">
                                    <button className="text-slate-500 hover:text-white"><Settings className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const StatusMapping = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-slate-200">Workflow Transitions</h3>
                <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-all">
                    <History className="w-4 h-4" /> Reset Defaults
                </button>
            </div>
            <div className="space-y-4">
                {[
                    { from: 'HR Approved', to: 'Credit Assessment', type: 'auto' },
                    { from: 'Credit Approved', to: 'Admin Final Review', type: 'manual' },
                    { from: 'Admin Approved', to: 'Finance Payout Queue', type: 'auto' },
                    { from: 'Payout Success', to: 'Active Loan', type: 'auto' },
                ].map((m, i) => (
                    <div key={i} className="flex items-center gap-6 p-4 bg-slate-950 rounded-2xl border border-slate-800">
                        <div className="flex-1 text-center py-2 px-4 bg-slate-900 rounded-xl font-bold text-xs text-slate-300">{m.from}</div>
                        <ChevronRight className="w-5 h-5 text-slate-700" />
                        <div className="flex-1 text-center py-2 px-4 bg-blue-600/10 rounded-xl font-bold text-xs text-blue-400 border border-blue-500/20">{m.to}</div>
                        <div className="w-32 flex justify-center">
                            <Badge variant={m.type === 'auto' ? 'success' : 'primary'}>{m.type}</Badge>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const SystemSettings = () => {
    return (
        <div className="space-y-8">
            <h3 className="text-xl font-display font-black text-slate-200">Global Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Maximum Global Loan (R)</label>
                    <input className="input-field py-4" defaultValue="50000" />
                </div>
                <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Default Interest Rate (%)</label>
                    <input className="input-field py-4" defaultValue="15.5" />
                </div>
                <div className="space-y-4">
                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest px-1">Email Notifications</label>
                    <div className="flex items-center gap-4 py-2">
                        <button className="w-12 h-6 bg-blue-600 rounded-full relative shadow-inner">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </button>
                        <span className="text-sm text-slate-400">Send alerts for all stage transitions</span>
                    </div>
                </div>
                <div className="flex items-end">
                    <button className="btn-primary w-full flex items-center justify-center gap-2">
                        <Save className="w-4 h-4" /> Save System State
                    </button>
                </div>
            </div>
        </div>
    );
};

const AuditLogs = () => {
    const logs = [
        { time: '10:45 AM', user: 'admin.lenni', action: 'Modified Credit Limit', target: 'TechFlow SA', ip: '192.168.1.1' },
        { time: '09:20 AM', user: 'system.bot', action: 'Auto-Triggered Payout', target: 'Michael Chen', ip: 'internal' },
        { time: '08:15 AM', user: 'hr.manager', action: 'User Role Update', target: 'sarah.officer', ip: '192.168.1.45' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 bg-slate-950 p-2 rounded-2xl border border-slate-800 max-w-md">
                <Search className="w-5 h-5 text-slate-500 ml-2" />
                <input className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200" placeholder="Search audit trail..." />
            </div>
            <div className="space-y-3">
                {logs.map((l, i) => (
                    <div key={i} className="p-4 glass rounded-2xl border-slate-800/50 flex items-center justify-between group hover:border-blue-500/20 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="text-[10px] text-slate-500 font-mono font-bold">{l.time}</div>
                            <div className="w-px h-6 bg-slate-800"></div>
                            <div>
                                <p className="text-sm font-bold text-slate-200">{l.action}</p>
                                <p className="text-[10px] text-slate-500">Target: {l.target} • User: {l.user}</p>
                            </div>
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono uppercase bg-slate-900 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">IP: {l.ip}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminControls;
