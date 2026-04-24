import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileEdit, 
  FileText, 
  Clock, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  BarChart3, 
  Receipt, 
  Bell
} from 'lucide-react';
import { useAuth, ROLES } from '../../context/AuthContext';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const menuItems = {
  [ROLES.Employee]: [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
    { title: 'Apply Loan', icon: FileEdit, path: '/employee/apply' },
    { title: 'My Status', icon: Clock, path: '/employee/status' },
    { title: 'Statements', icon: FileText, path: '/employee/statements' },
  ],
  [ROLES.HR]: [
    { title: 'Verification List', icon: Users, path: '/hr/verifications' },
    { title: 'Verification History', icon: Clock, path: '/hr/history' },
  ],
  [ROLES.ADMIN]: [
    { title: 'Overview', icon: LayoutDashboard, path: '/admin/dashboard' },
    { title: 'Applications', icon: FileText, path: '/admin/applications' },
    { title: 'User Management', icon: Users, path: '/admin/users' },
    { title: 'Reconciliation', icon: Receipt, path: '/admin/reconciliation' },
  ],
  [ROLES.CREDIT]: [
    { title: 'Credit Queue', icon: ShieldCheck, path: '/credit/queue' },
    { title: 'Assessment History', icon: FileText, path: '/credit/reviews' },
  ],
  [ROLES.FINANCE]: [
    { title: 'Payout Queue', icon: CreditCard, path: '/finance/payouts' },
    { title: 'Payout History', icon: Clock, path: '/finance/history' },
    { title: 'Reconciliation', icon: Receipt, path: '/finance/reconciliation' },
  ],
  [ROLES.MANAGEMENT]: [
    { title: 'KPI Reports', icon: BarChart3, path: '/management/reports' },
    { title: 'Global Analytics', icon: FileText, path: '/management/analytics' },
  ],
  [ROLES.RECOVERY]: [
    { title: 'Recoveries Queue', icon: Users, path: '/recovery/list' },
    { title: 'Collection History', icon: Receipt, path: '/recovery/collections' },
  ],
};

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const currentMenuItems = menuItems[role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen min-h-dvh bg-slate-950 text-slate-100 flex overflow-x-hidden overflow-y-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "glass border-r border-slate-800/50 transition-all duration-300 z-50 fixed inset-y-0 lg:static",
        isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg">L</div>
            {isSidebarOpen && <span className="font-display font-bold text-xl tracking-tight">Corporate LMS</span>}
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {currentMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
                  location.pathname === item.path 
                    ? "bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                )}
              >
                <item.icon className={cn("w-5 h-5", location.pathname === item.path ? "text-blue-400" : "group-hover:text-slate-200")} />
                {isSidebarOpen && <span className="font-medium">{item.title}</span>}
              </Link>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-slate-800/50 space-y-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="font-medium">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="h-16 glass border-b border-slate-800/50 px-6 flex items-center justify-between sticky top-0 z-40">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-6">
            <button className="relative p-2 rounded-lg hover:bg-slate-800/50 transition-colors text-slate-400">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-900"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider">{role}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-blue-400">
                {user?.name?.[0]}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
