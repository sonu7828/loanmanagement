import React from 'react';
import { useLocation } from 'react-router-dom';
import {
    Construction,
    ArrowLeft,
    BarChart3,
    Settings,
    Lock,
    Layers
} from 'lucide-react';
import { SectionHeader } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const ModulePlaceholder = ({ title, description }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const moduleName = title || pathSegments[pathSegments.length - 1]?.replace(/-/g, ' ');

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-12 animate-in duration-700">
            <div className="relative">
                <div className="w-36 h-36 rounded-[48px] bg-blue-50 border-2 border-dashed border-blue-500/20 flex items-center justify-center text-blue-500 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                    <Construction className="w-16 h-16" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-16 h-16 rounded-[24px] bg-white border border-slate-800 flex items-center justify-center text-amber-500 shadow-2xl">
                    <Layers className="w-8 h-8" />
                </div>
            </div>

            <div className="text-center space-y-4 max-w-lg mx-auto px-6">
                <SectionHeader
                    title={`${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module`}
                    description={description || "this specialized module is currently being calibrated to meet lenni-grade workflow standards."}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl pt-8 px-6">
                <FeatureMetric icon={BarChart3} label="Data Tracking" status="Active" />
                <FeatureMetric icon={Settings} label="Configurations" status="Locked" />
                <FeatureMetric icon={Lock} label="Field Isolation" status="Secured" />
            </div>

            <button
                onClick={() => navigate(-1)}
                className="btn-primary flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                back to dashboard
            </button>
        </div>
    );
};

const FeatureMetric = ({ icon: Icon, label, status }) => (
    <div className="glass p-8 rounded-[32px] border-slate-800/50 flex flex-col items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-4 bg-slate-900 rounded-[20px] border border-slate-800 text-slate-500">
            <Icon className="w-6 h-6" />
        </div>
        <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label}</p>
            <p className={`text-[10px] font-black uppercase tracking-widest mt-2 ${status === 'Active' || status === 'Secured' ? 'text-emerald-500' : 'text-amber-500'}`}>
                {status}
            </p>
        </div>
    </div>
);

export default ModulePlaceholder;
