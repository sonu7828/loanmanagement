import React, { useEffect, useRef, useState } from 'react';
import {
    UserCircle,
    Mail,
    Phone,
    Building2,
    ShieldCheck,
    ShieldAlert,
    Settings,
    Bell,
    Lock,
    Edit2,
    Camera,
    BadgeCheck
} from 'lucide-react';
import { SectionHeader, Badge } from '../../components/ui/Shared';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Toast } from '../../components/ui/Shared';
import Modal from '../../components/ui/Modal';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

const Profile = () => {
    const { user, role, logout } = useAuth();
    const navigate = useNavigate();
    const [editing, setEditing] = useState(false);
    const avatarInputRef = useRef(null);
    const [toast, setToast] = useState(null);
    const [profileFields, setProfileFields] = useState({
        email: user?.email || '',
        phone: '+27 (0) 82 123 4567',
        employerName: 'TechFlow South Africa',
        employeeReference: 'TF-90412',
    });
    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: true,
        pushNotifications: true,
    });
    const [removalModalOpen, setRemovalModalOpen] = useState(false);
    const [requestPending, setRequestPending] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem(`lms_profile_${user?.id || 'default'}`);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setProfileFields((prev) => ({ ...prev, ...(parsed.profileFields || {}) }));
                setSecuritySettings((prev) => ({ ...prev, ...(parsed.securitySettings || {}) }));
            } catch {
                // ignore invalid profile storage
            }
        }
    }, [user?.id]);

    const persistProfile = (nextFields = profileFields, nextSecurity = securitySettings) => {
        localStorage.setItem(
            `lms_profile_${user?.id || 'default'}`,
            JSON.stringify({ profileFields: nextFields, securitySettings: nextSecurity })
        );
    };

    const handleEditToggle = () => {
        if (editing) {
            persistProfile();
            setToast({ type: 'success', message: 'Profile updates saved successfully.' });
        }
        setEditing((prev) => !prev);
    };

    const handleFieldChange = (key, value) => {
        setProfileFields((prev) => ({ ...prev, [key]: value }));
    };

    const handleToggleSecurity = (key) => {
        const next = { ...securitySettings, [key]: !securitySettings[key] };
        setSecuritySettings(next);
        persistProfile(profileFields, next);
        setToast({
            type: 'info',
            message: `${key === 'twoFactorAuth' ? 'Two-Factor Auth' : 'Push Notifications'} ${next[key] ? 'enabled' : 'disabled'}.`,
        });
    };

    const handleAvatarSelect = (event) => {
        const selectedFile = event.target.files?.[0];
        if (!selectedFile) return;
        setToast({ type: 'success', message: `Profile photo selected: ${selectedFile.name}` });
    };

    const handleRemovalRequest = () => {
        setRequestPending(true);
        setTimeout(() => {
            setRequestPending(false);
            setRemovalModalOpen(false);
            setToast({ 
                type: 'info', 
                message: 'Data removal request submitted to compliance for review.' 
            });
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-in duration-700 pb-20">
            {toast && <Toast {...toast} onClose={() => setToast(null)} />}
            <SectionHeader
                title="Account Settings"
                description="Manage your personal information, security preferences, and notification settings."
            />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-10">
                {/* Profile Card */}
                <div className="xl:col-span-1 space-y-8">
                    <div className="glass p-6 lg:p-10 rounded-[40px] lg:rounded-[48px] border-slate-800 flex flex-col items-center text-center space-y-6 lg:space-y-8 relative overflow-hidden group shadow-sm transition-all hover:shadow-xl">
                        {/* Background Decor */}
                        <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 blur-[80px]"></div>

                        <div className="relative">
                            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-[32px] lg:rounded-[40px] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-3xl lg:text-4xl font-bold text-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
                                {user?.name?.[0]}
                            </div>
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                className="absolute -bottom-3 -right-3 p-3 bg-white border border-slate-800 rounded-2xl text-blue-600 hover:text-blue-500 transition-all shadow-xl hover:scale-110"
                            >
                                <Camera className="w-5 h-5" />
                            </button>
                            <input
                                ref={avatarInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleAvatarSelect}
                            />
                        </div>

                        <div className="space-y-2 relative z-10">
                            <h2 className="text-3xl font-display font-bold text-slate-200 flex items-center justify-center gap-3">
                                {user?.name}
                                <BadgeCheck className="w-6 h-6 text-blue-500" />
                            </h2>
                            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{role} Account</p>
                        </div>

                        <div className="w-full pt-8 border-t border-slate-800 space-y-5 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Member Since</span>
                                <span className="text-sm font-bold text-slate-200">April 2026</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Level</span>
                                <Badge variant="success">High (2FA Active)</Badge>
                            </div>
                        </div>

                        <button
                            onClick={handleEditToggle}
                            className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 border border-slate-800 rounded-2xl text-sm font-bold text-slate-400 hover:text-slate-200 transition-all hover:bg-white hover:border-blue-500 group relative z-10"
                        >
                            <Edit2 className="w-4 h-4 transition-transform group-hover:rotate-12" />
                            {editing ? 'Confirm Changes' : 'Modify Profile'}
                        </button>
                    </div>

                    <div className="glass p-10 rounded-[48px] border-slate-800 space-y-8 shadow-sm">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Trust & Verification</h3>
                        <div className="space-y-8">
                            <TrustItem icon={ShieldCheck} label="KYC Identification" status="Verified" color="text-emerald-500" />
                            <TrustItem icon={ShieldCheck} label="Employer Confirmation" status="Confirmed" color="text-emerald-500" />
                            <TrustItem icon={BadgeCheck} label="Consolidated Score" status="742 (Good)" color="text-blue-500" />
                        </div>
                    </div>
                </div>

                {/* Details Area */}
                <div className="xl:col-span-2 space-y-8 lg:space-y-10">
                    <div className="glass p-6 lg:p-12 rounded-[40px] lg:rounded-[60px] border-slate-800 space-y-10 lg:space-y-12 shadow-sm">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
                            <div className="space-y-6 lg:space-y-8">
                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] border-b border-white/5 pb-4">Personal Association</h3>
                                <div className="space-y-10">
                                    <ProfileField
                                        icon={Mail}
                                        label="Email Address"
                                        value={profileFields.email}
                                        editable={editing}
                                        onChange={(value) => handleFieldChange('email', value)}
                                    />
                                    <ProfileField
                                        icon={Phone}
                                        label="Mobile Contact"
                                        value={profileFields.phone}
                                        editable={editing}
                                        onChange={(value) => handleFieldChange('phone', value)}
                                    />
                                </div>
                            </div>
                            <div className="space-y-8">
                                <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em] border-b border-slate-800 pb-4">Entity Information</h3>
                                <div className="space-y-10">
                                    <ProfileField icon={Building2} label="Employer Name" value={profileFields.employerName} editable={false} />
                                    <ProfileField icon={Lock} label="Employee Reference" value={profileFields.employeeReference} editable={false} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-slate-800 space-y-8">
                            <h3 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.25em]">Account Security Controls</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <SecuritySetting
                                    icon={Settings}
                                    title="Two-Factor Auth"
                                    desc="Multi-layer protocol active"
                                    enabled={securitySettings.twoFactorAuth}
                                    onToggle={() => handleToggleSecurity('twoFactorAuth')}
                                />
                                <SecuritySetting
                                    icon={Bell}
                                    title="Push Notifications"
                                    desc="Live loan status alerts"
                                    enabled={securitySettings.pushNotifications}
                                    onToggle={() => handleToggleSecurity('pushNotifications')}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="glass p-6 lg:p-10 rounded-[32px] lg:rounded-[48px] border-slate-700 bg-slate-900/40 flex flex-col items-center justify-between gap-8 group hover:border-blue-500/30 transition-all duration-500 shadow-sm overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
                        
                        <div className="flex flex-col md:flex-row items-center gap-8 w-full relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                <ShieldAlert className="w-8 h-8" />
                            </div>
                            <div className="space-y-2 text-center md:text-left flex-1">
                                <h4 className="text-xl font-black text-slate-200 uppercase tracking-tight">Request Data Removal</h4>
                                <p className="text-sm text-slate-400 font-bold leading-relaxed max-w-xl">
                                    Submit a request for personal data removal. Requests are reviewed subject to active loans, legal retention periods, and compliance policies.
                                </p>
                            </div>
                            <button
                                onClick={() => setRemovalModalOpen(true)}
                                className="w-full md:w-auto px-10 py-5 bg-white text-black hover:bg-slate-50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-black/10"
                            >
                                Request Removal
                            </button>
                        </div>

                        <div className="w-full pt-8 border-t border-slate-800/50 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                            <PolicyNote text="Requests may be approved or declined" />
                            <PolicyNote text="Active loans cannot be removed" />
                            <PolicyNote text="Records retained up to 5 years after settlement" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Data Removal Confirmation Modal */}
            <Modal
                isOpen={removalModalOpen}
                onClose={() => !requestPending && setRemovalModalOpen(false)}
                title="Formal Removal Request"
                maxWidth="max-w-xl"
            >
                <div className="space-y-8 py-4">
                    <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
                        <p className="text-sm text-black font-bold leading-relaxed">
                            You are initiating a formal request for the removal of your personal and financial data from the Lenni Protocol.
                        </p>
                        <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-slate-600 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                Our compliance team will review your account status.
                            </li>
                            <li className="flex gap-3 text-xs text-slate-600 font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                                You will be notified of the decision via your registered email.
                            </li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleRemovalRequest}
                            disabled={requestPending}
                            className="w-full py-5 bg-slate-100 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl"
                        >
                            {requestPending && <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                            Confirm Request Submission
                        </button>
                        <button
                            onClick={() => setRemovalModalOpen(false)}
                            disabled={requestPending}
                            className="w-full py-5 bg-white border border-slate-200 text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

const ProfileField = ({ icon: Icon, label, value, editable, onChange }) => (
    <div className="flex gap-6 group/field">
        <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 text-slate-500 h-fit group-hover/field:border-blue-500/50 transition-all">
            <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">{label}</p>
            {editable ? (
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange?.(e.target.value)}
                    className="bg-transparent border-none p-0 text-lg font-bold text-blue-600 focus:ring-0 w-full tracking-tight"
                />
            ) : (
                <p className="text-lg font-bold text-slate-200 tracking-tight">{value}</p>
            )}
        </div>
    </div>
);

const SecuritySetting = ({ icon: Icon, title, desc, enabled, onToggle }) => (
    <div className="p-5 lg:p-8 bg-slate-900/40 rounded-[28px] lg:rounded-[32px] border border-slate-800 flex items-center justify-between group hover:border-blue-500 transition-all shadow-sm">
        <div className="flex items-center gap-4 lg:gap-5 min-w-0 flex-1">
            <div className="p-3 lg:p-4 bg-slate-950 rounded-[16px] lg:rounded-[20px] border border-slate-800 text-slate-500 group-hover:text-blue-500 transition-colors shrink-0">
                <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
            </div>
            <div className="min-w-0">
                <p className="text-sm lg:text-lg font-bold text-slate-200 truncate">{title}</p>
                <p className="text-[9px] lg:text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1 truncate">{desc}</p>
            </div>
        </div>
        <button
            onClick={onToggle}
            className={cn("w-12 lg:w-14 h-6 lg:h-7 rounded-full p-1 lg:p-1.5 transition-all cursor-pointer shadow-inner shrink-0 ml-4",
                enabled ? 'bg-blue-600' : 'bg-slate-700'
            )}
            aria-label={`Toggle ${title}`}
        >
            <div className={cn("w-4 h-4 rounded-full transition-all shadow-md", 
                enabled ? 'translate-x-6 lg:translate-x-7 bg-white' : 'translate-x-0 bg-slate-400'
            )} />
        </button>
    </div>
);

const TrustItem = ({ icon: Icon, label, status, color }) => (
    <div className="flex items-center justify-between p-1">
        <div className="flex items-center gap-4">
            <div className={cn("p-1.5 rounded-lg bg-slate-900 border border-slate-800", color)}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-slate-300">{label}</span>
        </div>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{status}</span>
    </div>
);

const PolicyNote = ({ text }) => (
    <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{text}</span>
    </div>
);

export default Profile;
