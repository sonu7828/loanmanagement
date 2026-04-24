import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import GlobalSearch from './GlobalSearch';
import { useAuth, ROLES } from '../../context/AuthContext';
import { Bell, Search, Menu, X } from 'lucide-react';

const Layout = ({ children }) => {
  const { user, role } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mounted, setMounted] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on mobile when location changes
  useEffect(() => {
    if (isMobile) setIsSidebarOpen(false);
  }, [location, isMobile]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect to individual role dashboards if at root of module
  const pathSegments = location.pathname.split('/').filter(Boolean);
  if (pathSegments.length === 1 && Object.values(ROLES).includes(pathSegments[0])) {
    return <Navigate to={`/${pathSegments[0]}/dashboard`} replace />;
  }

  if (!mounted) return null;

  return (
    <div className="flex min-h-screen min-h-dvh bg-white text-white overflow-x-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggle={() => setIsSidebarOpen(!isSidebarOpen)} 
        isMobile={isMobile}
        closeMobile={() => setIsSidebarOpen(false)}
      />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen h-[100dvh] h-[100svh] min-h-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 sm:h-20 flex items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-700 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
             {/* Mobile Hamburger Menu */}
             <div className="lg:hidden flex-shrink-0">
                <button 
                  onClick={() => setIsSidebarOpen(true)}
                  className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-500 hover:text-blue-500 transition-all shadow-lg active:scale-95"
                >
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
             </div>
             <GlobalSearch />

          </div>

          <div className="flex items-center gap-2 sm:gap-6 flex-shrink-0 ml-auto">
            <button className="relative p-2 sm:p-2.5 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-blue-500 hover:border-blue-500/30 transition-all">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-white shadow-[0_0_10px_rgba(47,128,237,0.4)]"></span>
            </button>
            <div className="flex items-center gap-3 sm:gap-4 pl-2 sm:pl-6 border-l border-slate-700 min-w-0">
                <div className="text-right min-w-0 hidden sm:block">
                    <p className="text-sm font-bold text-slate-200 lowercase leading-none truncate">{user?.name}</p>
                    <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mt-1.5 truncate">{role}</p>
                </div>
                <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20 text-sm sm:text-base">
                    {user?.name?.[0]}
                </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 min-h-0 p-4 sm:p-5 lg:p-6 pb-6 sm:pb-8 overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth">
          <div className="max-w-[1600px] mx-auto w-full min-w-0">
            {children || <Outlet />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
