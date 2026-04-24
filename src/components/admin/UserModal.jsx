import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Building2,
  CheckCircle2
} from 'lucide-react';
import { ROLES } from '../../context/AuthContext';
import Modal from '../ui/Modal';

const UserModal = ({ isOpen, onClose, onSave, userToEdit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: ROLES.Employee,
        company: '',
        status: 'Active'
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({
                name: '',
                email: '',
                role: ROLES.Employee,
                company: '',
                status: 'Active'
            });
        }
        setErrors({});
    }, [userToEdit, isOpen]);

    const validate = () => {
        let newErrors = {};
        if (!formData.name) newErrors.name = 'Full identity name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.company) newErrors.company = 'Organization/Employer is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSave(formData);
        }
    };

    const modalFooter = (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 no-print w-full">
            <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-950 border border-slate-800 text-slate-400 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-slate-800 hover:text-white transition-all shadow-inner order-2 sm:order-1"
            >
                Abort
            </button>
            <button 
                onClick={handleSubmit}
                className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2 order-1 sm:order-2"
            >
                <CheckCircle2 className="w-4 h-4" />
                {userToEdit ? 'Commit Changes' : 'Confirm Access'}
            </button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={userToEdit ? 'Update User Identity' : 'Enroll New User'}
            footer={modalFooter}
            maxWidth="max-w-xl"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-blue-600/5 border border-blue-500/10 p-4 rounded-2xl mb-6">
                    <p className="text-[10px] text-blue-400 uppercase font-black tracking-widest leading-relaxed">
                        Secure Identity Access Management System. Ensure all details are verified against payroll records before committing.
                    </p>
                </div>

                {/* Name */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Identity Name</label>
                    <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.name ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50 shadow-inner'}`}>
                        <User className="w-5 h-5 text-slate-500" />
                        <input 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold outline-none" 
                            placeholder="e.g. Sarah Jenkins"
                        />
                    </div>
                    {errors.name && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Secure Contact Email</label>
                    <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.email ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50 shadow-inner'}`}>
                        <Mail className="w-5 h-5 text-slate-500" />
                        <input 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold outline-none" 
                            placeholder="name@domain.com"
                            type="email"
                        />
                    </div>
                    {errors.email && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">System Privilege</label>
                        <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all shadow-inner">
                            <Shield className="w-5 h-5 text-slate-500" />
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 font-bold appearance-none cursor-pointer outline-none"
                            >
                                {Object.entries(ROLES).map(([key, value]) => (
                                    <option key={value} value={value} className="bg-slate-900">{key}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Initial Status</label>
                        <div className="flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 focus-within:border-blue-500/50 transition-all shadow-inner">
                            <div className={`w-2 h-2 rounded-full ${formData.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500'}`} />
                            <select 
                                value={formData.status}
                                onChange={(e) => setFormData({...formData, status: e.target.value})}
                                className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 font-bold appearance-none cursor-pointer outline-none"
                            >
                                <option value="Active" className="bg-slate-900 text-emerald-400">Active</option>
                                <option value="Inactive" className="bg-slate-900 text-red-400">Inactive</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Company */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Employer / Organization</label>
                    <div className={`flex items-center gap-3 bg-slate-950 p-3.5 rounded-2xl border transition-all ${errors.company ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 focus-within:border-blue-500/50 shadow-inner'}`}>
                        <Building2 className="w-5 h-5 text-slate-500" />
                        <input 
                            value={formData.company}
                            onChange={(e) => setFormData({...formData, company: e.target.value})}
                            className="bg-transparent border-none text-sm focus:ring-0 w-full text-slate-200 placeholder:text-slate-700 font-bold outline-none" 
                            placeholder="e.g. TechFlow SA"
                        />
                    </div>
                    {errors.company && <p className="text-[10px] text-red-400 font-bold tracking-tight italic ml-1">{errors.company}</p>}
                </div>
            </form>
        </Modal>
    );
};

export default UserModal;
