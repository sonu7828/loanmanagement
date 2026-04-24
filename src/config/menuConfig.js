import { 
  LayoutDashboard, 
  FileEdit, 
  FileText, 
  Clock, 
  Mail, 
  Users, 
  ClipboardCheck, 
  BarChart3, 
  ShieldCheck, 
  ShieldAlert, 
  DollarSign, 
  Layers, 
  History, 
  PieChart, 
  AlertCircle, 
  Receipt,
  Building2,
  FolderOpen,
  UserCircle,
  LogOut,
  Settings,
  RefreshCw,
  Database
} from 'lucide-react';
import { ROLES } from '../context/AuthContext';

export const menuConfig = {
  [ROLES.EMPLOYEE]: [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/employee/dashboard' },
    { title: 'Apply Loan', icon: FileEdit, path: '/employee/apply' },
    { title: 'My Status', icon: Clock, path: '/employee/status' },
    { title: 'Statements', icon: FileText, path: '/employee/statements' },
    { title: 'Letters & Documents', icon: Mail, path: '/employee/documents' },
    { title: 'Profile', icon: UserCircle, path: '/employee/profile' },
    { title: 'Logout', icon: LogOut, path: '/logout', action: 'logout' },
  ],
  [ROLES.HR]: [
    {
      group: 'MANAGEMENT',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
        { title: 'Verifications', icon: ClipboardCheck, path: '/hr/verifications' },
        { title: 'Employees', icon: Users, path: '/hr/employees' },
      ]
    },
    {
      group: 'REPORTS',
      items: [
        { title: 'Remittance Advices', icon: FileText, path: '/hr/remittances' },
        { title: 'New Loans Report', icon: BarChart3, path: '/hr/new-loans' },
        { title: 'Overdue Report', icon: AlertCircle, path: '/hr/overdue' },
        { title: 'Activity Reports', icon: PieChart, path: '/hr/reports' },
      ]
    }
  ],
  [ROLES.ADMIN]: [
    {
      group: 'OVERVIEW',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { title: 'Application Status', icon: FileText, path: '/admin/applications' },
        { title: 'Payment Processing', icon: Receipt, path: '/admin/payments' },
      ]
    },
    {
      group: 'ENTITY MANAGEMENT',
      items: [
        { title: 'Employees', icon: Users, path: '/admin/users' },
        // { title: 'Employers', icon: Building2, path: '/admin/companies' },
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { title: 'System Admin', icon: Settings, path: '/admin/controls' },
        { title: 'Documents', icon: FolderOpen, path: '/admin/documents' },
        { title: 'Audit Logs', icon: History, path: '/admin/audit-logs' },
      ]
    }
  ],

  [ROLES.CREDIT]: [
    {
      group: 'ASSESSMENT',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/credit/dashboard' },
        { title: 'Credit Queue', icon: ShieldCheck, path: '/credit/queue' },
        { title: 'Risk Reviews', icon: ShieldAlert, path: '/credit/reviews' },
      ]
    }
  ],
  [ROLES.FINANCE]: [
    {
      group: 'PAYMENTS',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/finance/dashboard' },
        { title: 'Payouts', icon: DollarSign, path: '/finance/payouts' },
        { title: 'Batch Processing', icon: Layers, path: '/finance/reconciliation' },
        { title: 'Settlement', icon: RefreshCw, path: '/finance/settlement' },
      ]
    },
    {
      group: 'ACCOUNTING',
      items: [
        { title: 'Journal Write Offs', icon: Receipt, path: '/finance/write-offs' },
        { title: 'Reports', icon: BarChart3, path: '/finance/reports' },
        { title: 'History', icon: History, path: '/finance/history' },
      ]
    }
  ],
  [ROLES.MANAGEMENT]: [
    {
      group: 'INSIGHTS',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/management/dashboard' },
        { title: 'Investor Center', icon: BarChart3, path: '/management/investor' },
        { title: 'Age Analysis', icon: Clock, path: '/management/age-analysis' },
        { title: 'Portfolio Reports', icon: PieChart, path: '/management/reports' },
      ]
    },
    {
      group: 'GOVERNANCE',
      items: [
        { title: 'System Backups', icon: Database, path: '/management/backups' },
        { title: 'Audit Trail', icon: ShieldCheck, path: '/management/audit' },
      ]
    }
  ],
  [ROLES.RECOVERY]: [
    {
      group: 'COLLECTIONS',
      items: [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/recovery/dashboard' },
        { title: 'Recovery Cases', icon: AlertCircle, path: '/recovery/list' },
        { title: 'Payment Tracking', icon: Receipt, path: '/recovery/collections' },
      ]
    }
  ],
};
