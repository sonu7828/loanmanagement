import React from 'react';
import {
  Wallet,
  Calendar,
  CheckCircle2,
  ArrowUpRight,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import { StatCard, SectionHeader, Badge } from '../../components/ui/Shared';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      <SectionHeader
        title="Dashboard Overview"
        description="Welcome back! Here's what's happening with your loans."
        actions={
          <button
            onClick={() => navigate('/employee/apply')}
            className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <ArrowUpRight className="w-4 h-4" />
            Apply New Loan
          </button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Loan Status"
          value="Active"
          subValue="Monthly Installments"
          icon={CheckCircle2}
          variant="success"
        />
        <StatCard
          title="Current Balance"
          value="R 4,250.00"
          subValue="Total Outstanding"
          icon={Wallet}
        />
        <StatCard
          title="Next Deduction"
          value="25 Apr 2026"
          subValue="Payroll Deduction"
          icon={Calendar}
          variant="warning"
        />
        <StatCard
          title="Eligibility"
          value="R 9,000.00"
          subValue="Available to borrow"
          icon={ArrowUpRight}
          variant="primary"
          trend={{ type: 'up', value: 15 }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-display font-bold">Recent Activity</h2>
            <button className="text-sm text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="glass rounded-[32px] overflow-hidden border border-slate-800/50 shadow-xl">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Reference</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[
                    { ref: 'LMS-9021', date: '12 Apr 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                    { ref: 'LMS-8842', date: '25 Mar 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                    { ref: 'LMS-1029', date: '10 Mar 2026', amount: 'R 4,500.00', status: 'Disbursed', sVar: 'primary' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-800/30 transition-colors cursor-pointer group">
                      <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 group-hover:text-blue-400 transition-colors uppercase">{row.ref}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{row.date}</td>
                      <td className="px-6 py-4 text-sm font-black text-slate-200">{row.amount}</td>
                      <td className="px-6 py-4">
                        <Badge variant={row.sVar}>{row.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View */}
            <div className="md:hidden divide-y divide-slate-800/40">
              {[
                  { ref: 'LMS-9021', date: '12 Apr 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                  { ref: 'LMS-8842', date: '25 Mar 2026', amount: 'R 500.00', status: 'Paid', sVar: 'success' },
                  { ref: 'LMS-1029', date: '10 Mar 2026', amount: 'R 4,500.00', status: 'Disbursed', sVar: 'primary' },
              ].map((row, i) => (
                  <div key={i} className="p-6 space-y-4 hover:bg-slate-800/20 active:bg-slate-800/40 transition-colors">
                      <div className="flex justify-between items-start">
                          <div>
                              <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight mb-1">{row.ref}</p>
                              <p className="text-xs font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                                  <Calendar className="w-3 h-3" />
                                  {row.date}
                              </p>
                          </div>
                          <Badge variant={row.sVar}>{row.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between pt-2">
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.2em]">Transaction Amount</p>
                          <p className="text-lg font-black text-white">{row.amount}</p>
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Requests — explicit text color: Layout uses text-white; glass cards are light */}
        <div className="space-y-4 text-slate-200">
          <h2 className="text-xl font-display font-bold px-2 text-slate-200">Requests & Letters</h2>
          <div className="glass p-6 rounded-3xl space-y-4 text-slate-200">
            <button
              type="button"
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group text-left text-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200 truncate">Settlement Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group text-left text-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200 truncate">Paid-Up Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/employee/documents')}
              className="w-full flex items-center justify-between p-4 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 transition-all group text-left text-slate-200"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-semibold text-slate-200 truncate">Confirmation Letter</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
