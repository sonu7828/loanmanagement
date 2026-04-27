import React, { createContext, useContext, useState, useEffect } from 'react';

const LoanContext = createContext(null);

export const STATUSES = {
  NEW: 'New',
  SUBMITTED: 'Submitted',
  HR_PENDING: 'HR Pending',
  HR_APPROVED: 'HR Approved',
  CREDIT_PENDING: 'Credit Pending',
  UNDER_REVIEW: 'Under Review',
  ON_HOLD: 'On Hold',
  NEED_MORE_INFO: 'Need More Info',
  ADMIN_APPROVAL: 'Admin Approval',
  APPROVED: 'Approved',
  ACTIVE: 'Active',
  PAID: 'Paid',
  DECLINED: 'Declined',
  REJECTED: 'Rejected',
  ESCALATED: 'Escalated',
  NEED_REVIEW: 'Need Review',
  DISBURSED: 'Disbursed',
};

export const RECOVERY_STATUSES = {
  HEALTHY: 'Healthy',
  IN_ARREARS: 'In Arrears',
  PTP: 'PTP Active',
  PTP_FAILED: 'PTP Failed',
  CONTACTED: 'Contacted',
  LEGAL: 'Legal Escalation',
  SUSPENDED: 'Suspended',
  RECOVERED: 'Recovered',
};

export const EVENT_TYPES = {
  APPLICATION_SUBMITTED: 'APPLICATION_SUBMITTED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  DISBURSED: 'DISBURSED',
  PAID: 'PAID',
  FAILED: 'FAILED',
  ASSIGNMENT: 'ASSIGNMENT',
  RECOVERY_INTERACTION: 'RECOVERY_INTERACTION',
  PTP_CREATED: 'PTP_CREATED',
  PAYMENT_RECORDED: 'PAYMENT_RECORDED',
};

export const LIFECYCLE_STATUSES = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  HR_VERIFIED: 'HR_VERIFIED',
  CREDIT_APPROVED: 'CREDIT_APPROVED',
  ADMIN_APPROVED: 'ADMIN_APPROVED',
  DISBURSED: 'DISBURSED',
  ACTIVE: 'ACTIVE',
  IN_ARREARS: 'IN_ARREARS',
  RECOVERY: 'RECOVERY',
  CLOSED: 'CLOSED',
  REJECTED: 'REJECTED',
};

export const LIFECYCLE_ACTIONS = {
  SUBMIT: 'SUBMIT',
  HR_VERIFY: 'HR_VERIFY',
  HR_REJECT: 'HR_REJECT',
  CREDIT_APPROVE: 'CREDIT_APPROVE',
  CREDIT_REJECT: 'CREDIT_REJECT',
  CREDIT_REQUEST_INFO: 'CREDIT_REQUEST_INFO',
  ADMIN_APPROVE: 'ADMIN_APPROVE',
  ADMIN_REJECT: 'ADMIN_REJECT',
  DISBURSE: 'DISBURSE',
  ACTIVATE: 'ACTIVATE',
  MARK_IN_ARREARS: 'MARK_IN_ARREARS',
  START_RECOVERY: 'START_RECOVERY',
  CATCH_UP: 'CATCH_UP',
  SETTLE: 'SETTLE',
  REOPEN: 'REOPEN',
};

const LEGACY_STATUS_TO_LIFECYCLE = {
  [STATUSES.NEW]: LIFECYCLE_STATUSES.DRAFT,
  [STATUSES.SUBMITTED]: LIFECYCLE_STATUSES.SUBMITTED,
  [STATUSES.HR_PENDING]: LIFECYCLE_STATUSES.SUBMITTED,
  [STATUSES.HR_APPROVED]: LIFECYCLE_STATUSES.HR_VERIFIED,
  [STATUSES.CREDIT_PENDING]: LIFECYCLE_STATUSES.HR_VERIFIED,
  [STATUSES.UNDER_REVIEW]: LIFECYCLE_STATUSES.HR_VERIFIED,
  [STATUSES.ON_HOLD]: LIFECYCLE_STATUSES.HR_VERIFIED,
  [STATUSES.NEED_MORE_INFO]: LIFECYCLE_STATUSES.SUBMITTED,
  [STATUSES.ADMIN_APPROVAL]: LIFECYCLE_STATUSES.CREDIT_APPROVED,
  [STATUSES.APPROVED]: LIFECYCLE_STATUSES.ADMIN_APPROVED,
  [STATUSES.DISBURSED]: LIFECYCLE_STATUSES.DISBURSED,
  [STATUSES.ACTIVE]: LIFECYCLE_STATUSES.ACTIVE,
  [STATUSES.PAID]: LIFECYCLE_STATUSES.CLOSED,
  [STATUSES.REJECTED]: LIFECYCLE_STATUSES.REJECTED,
  [STATUSES.DECLINED]: LIFECYCLE_STATUSES.REJECTED,
};

const ACTIVE_RECOVERY_STATES = new Set([
  RECOVERY_STATUSES.CONTACTED,
  RECOVERY_STATUSES.PTP,
  RECOVERY_STATUSES.PTP_FAILED,
  RECOVERY_STATUSES.LEGAL,
  RECOVERY_STATUSES.SUSPENDED,
]);

const LIFECYCLE_TRANSITIONS = {
  [LIFECYCLE_STATUSES.DRAFT]: [LIFECYCLE_ACTIONS.SUBMIT],
  [LIFECYCLE_STATUSES.SUBMITTED]: [LIFECYCLE_ACTIONS.HR_VERIFY, LIFECYCLE_ACTIONS.HR_REJECT],
  [LIFECYCLE_STATUSES.HR_VERIFIED]: [
    LIFECYCLE_ACTIONS.CREDIT_APPROVE,
    LIFECYCLE_ACTIONS.CREDIT_REJECT,
    LIFECYCLE_ACTIONS.CREDIT_REQUEST_INFO,
  ],
  [LIFECYCLE_STATUSES.CREDIT_APPROVED]: [LIFECYCLE_ACTIONS.ADMIN_APPROVE, LIFECYCLE_ACTIONS.ADMIN_REJECT],
  [LIFECYCLE_STATUSES.ADMIN_APPROVED]: [LIFECYCLE_ACTIONS.DISBURSE],
  [LIFECYCLE_STATUSES.DISBURSED]: [LIFECYCLE_ACTIONS.ACTIVATE],
  [LIFECYCLE_STATUSES.ACTIVE]: [LIFECYCLE_ACTIONS.MARK_IN_ARREARS],
  [LIFECYCLE_STATUSES.IN_ARREARS]: [LIFECYCLE_ACTIONS.START_RECOVERY, LIFECYCLE_ACTIONS.CATCH_UP],
  [LIFECYCLE_STATUSES.RECOVERY]: [LIFECYCLE_ACTIONS.CATCH_UP, LIFECYCLE_ACTIONS.SETTLE],
  [LIFECYCLE_STATUSES.CLOSED]: [LIFECYCLE_ACTIONS.REOPEN],
  [LIFECYCLE_STATUSES.REJECTED]: [LIFECYCLE_ACTIONS.REOPEN],
};

const ACTION_TO_TARGET_STATUS = {
  [LIFECYCLE_ACTIONS.SUBMIT]: LIFECYCLE_STATUSES.SUBMITTED,
  [LIFECYCLE_ACTIONS.HR_VERIFY]: LIFECYCLE_STATUSES.HR_VERIFIED,
  [LIFECYCLE_ACTIONS.HR_REJECT]: LIFECYCLE_STATUSES.REJECTED,
  [LIFECYCLE_ACTIONS.CREDIT_APPROVE]: LIFECYCLE_STATUSES.CREDIT_APPROVED,
  [LIFECYCLE_ACTIONS.CREDIT_REJECT]: LIFECYCLE_STATUSES.REJECTED,
  [LIFECYCLE_ACTIONS.CREDIT_REQUEST_INFO]: LIFECYCLE_STATUSES.SUBMITTED,
  [LIFECYCLE_ACTIONS.ADMIN_APPROVE]: LIFECYCLE_STATUSES.ADMIN_APPROVED,
  [LIFECYCLE_ACTIONS.ADMIN_REJECT]: LIFECYCLE_STATUSES.REJECTED,
  [LIFECYCLE_ACTIONS.DISBURSE]: LIFECYCLE_STATUSES.DISBURSED,
  [LIFECYCLE_ACTIONS.ACTIVATE]: LIFECYCLE_STATUSES.ACTIVE,
  [LIFECYCLE_ACTIONS.MARK_IN_ARREARS]: LIFECYCLE_STATUSES.IN_ARREARS,
  [LIFECYCLE_ACTIONS.START_RECOVERY]: LIFECYCLE_STATUSES.RECOVERY,
  [LIFECYCLE_ACTIONS.CATCH_UP]: LIFECYCLE_STATUSES.ACTIVE,
  [LIFECYCLE_ACTIONS.SETTLE]: LIFECYCLE_STATUSES.CLOSED,
  [LIFECYCLE_ACTIONS.REOPEN]: LIFECYCLE_STATUSES.SUBMITTED,
};

const LIFECYCLE_TO_LEGACY_STATUS = {
  [LIFECYCLE_STATUSES.DRAFT]: STATUSES.NEW,
  [LIFECYCLE_STATUSES.SUBMITTED]: STATUSES.HR_PENDING,
  [LIFECYCLE_STATUSES.HR_VERIFIED]: STATUSES.HR_APPROVED,
  [LIFECYCLE_STATUSES.CREDIT_APPROVED]: STATUSES.ADMIN_APPROVAL,
  [LIFECYCLE_STATUSES.ADMIN_APPROVED]: STATUSES.APPROVED,
  [LIFECYCLE_STATUSES.DISBURSED]: STATUSES.DISBURSED,
  [LIFECYCLE_STATUSES.ACTIVE]: STATUSES.ACTIVE,
  [LIFECYCLE_STATUSES.IN_ARREARS]: STATUSES.ACTIVE,
  [LIFECYCLE_STATUSES.RECOVERY]: STATUSES.ACTIVE,
  [LIFECYCLE_STATUSES.CLOSED]: STATUSES.PAID,
  [LIFECYCLE_STATUSES.REJECTED]: STATUSES.REJECTED,
};

const mapLegacyToLifecycle = (legacyStatus) => LEGACY_STATUS_TO_LIFECYCLE[legacyStatus] || LIFECYCLE_STATUSES.SUBMITTED;
const mapLifecycleToLegacy = (lifecycleStatus) => LIFECYCLE_TO_LEGACY_STATUS[lifecycleStatus] || STATUSES.SUBMITTED;

const calculateOutstandingAmount = (app) =>
  (app.installments || []).reduce((sum, inst) => sum + Math.max(0, (inst.amount || 0) - (inst.paidAmount || 0)), 0);

const getUnpaidInstallments = (app) =>
  (app.installments || []).filter((inst) => (inst.amount || 0) - (inst.paidAmount || 0) > 0);

const getNextDueDate = (app) => {
  if (app.nextDueDate) return app.nextDueDate;
  const unpaid = getUnpaidInstallments(app);
  if (unpaid.length === 0) return null;
  const earliest = unpaid.reduce((acc, inst) => (new Date(inst.dueDate) < new Date(acc.dueDate) ? inst : acc));
  return earliest.dueDate;
};

const hasOverdueInstallment = (app, now = new Date()) =>
  getUnpaidInstallments(app).some((inst) => new Date(inst.dueDate) < now);

const deriveLifecycleStatus = (app) => {
  let lifecycleStatus = app.lifecycleStatus || mapLegacyToLifecycle(app.status);
  const recoveryStatus = app.recoveryStatus;
  const outstandingAmount =
    app.outstandingAmount !== undefined && app.outstandingAmount !== null
      ? Number(app.outstandingAmount)
      : calculateOutstandingAmount(app);
  const nextDueDate = getNextDueDate(app);
  const isOverdueByDate = Boolean(nextDueDate && new Date(nextDueDate) < new Date());
  const hasOverdue = hasOverdueInstallment(app);

  if (app.status === STATUSES.CREDIT_PENDING || app.status === STATUSES.UNDER_REVIEW || app.status === STATUSES.ON_HOLD) {
    lifecycleStatus = LIFECYCLE_STATUSES.HR_VERIFIED;
  } else if (recoveryStatus === RECOVERY_STATUSES.RECOVERED || (outstandingAmount === 0 && app.status === STATUSES.PAID)) {
    lifecycleStatus = LIFECYCLE_STATUSES.CLOSED;
  } else if ((isOverdueByDate || hasOverdue) && lifecycleStatus === LIFECYCLE_STATUSES.ACTIVE) {
    lifecycleStatus = LIFECYCLE_STATUSES.IN_ARREARS;
  } else if (recoveryStatus === RECOVERY_STATUSES.IN_ARREARS) {
    lifecycleStatus = LIFECYCLE_STATUSES.IN_ARREARS;
  } else if (ACTIVE_RECOVERY_STATES.has(recoveryStatus)) {
    lifecycleStatus = LIFECYCLE_STATUSES.RECOVERY;
  }

  return lifecycleStatus;
};

const normalizeApplication = (app) => {
  const outstandingAmount =
    app.outstandingAmount !== undefined && app.outstandingAmount !== null
      ? Number(app.outstandingAmount)
      : calculateOutstandingAmount(app);
  const nextDueDate = getNextDueDate(app);
  const isOverdue = Boolean(nextDueDate && new Date(nextDueDate) < new Date()) || hasOverdueInstallment(app);
  const normalizedRecoveryStatus = (() => {
    if (outstandingAmount <= 0) return RECOVERY_STATUSES.RECOVERED;
    if (isOverdue && (!app.recoveryStatus || app.recoveryStatus === RECOVERY_STATUSES.HEALTHY)) {
      return RECOVERY_STATUSES.IN_ARREARS;
    }
    if (!isOverdue && app.recoveryStatus === RECOVERY_STATUSES.IN_ARREARS) {
      return RECOVERY_STATUSES.HEALTHY;
    }
    return app.recoveryStatus;
  })();

  return {
    ...app,
    outstandingAmount,
    nextDueDate,
    recoveryStatus: normalizedRecoveryStatus,
    lifecycleStatus: deriveLifecycleStatus({ ...app, outstandingAmount, nextDueDate, recoveryStatus: normalizedRecoveryStatus }),
  };
};

export const isLifecycleTransitionAllowed = (fromStatus, action) =>
  (LIFECYCLE_TRANSITIONS[fromStatus] || []).includes(action);


export const WORKFLOW_SEQUENCE = [
  STATUSES.SUBMITTED,
  STATUSES.HR_PENDING,
  STATUSES.HR_APPROVED,
  STATUSES.CREDIT_PENDING,
  STATUSES.UNDER_REVIEW,
  STATUSES.ADMIN_APPROVAL,
  STATUSES.APPROVED,
  STATUSES.ACTIVE,
  STATUSES.PAID
];

export const LoanProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);

  useEffect(() => {
    const storedApps = localStorage.getItem('lms_applications');
    const storedLogs = localStorage.getItem('lms_audit_logs');
    
    if (storedApps) {
      const parsed = JSON.parse(storedApps);
      
      // Auto-Detection Logic: Missed PTPs and Escalations
      const today = new Date();
      const processedApps = parsed.map(app => {
          let updatedApp = { ...app };
          let changed = false;

          // 1. Detect Missed PTPs
          if (updatedApp.ptpHistory) {
              const newPtpHistory = updatedApp.ptpHistory.map(ptp => {
                  if (ptp.status === 'ACTIVE' && new Date(ptp.date) < today) {
                      changed = true;
                      return { ...ptp, status: 'FAILED' };
                  }
                  return ptp;
              });
              if (changed) {
                  updatedApp.ptpHistory = newPtpHistory;
                  updatedApp.recoveryStatus = RECOVERY_STATUSES.PTP_FAILED;
              }
          }

          // 2. Automated Escalation (DPD > 90)
          const overdueInstallments = updatedApp.installments?.filter(i => 
              i.status !== 'PAID' && new Date(i.dueDate) < today
          ) || [];
          
          if (overdueInstallments.length > 0) {
              const earliest = new Date(Math.min(...overdueInstallments.map(i => new Date(i.dueDate))));
              const dpd = Math.floor((today - earliest) / (1000 * 60 * 60 * 24));
              if (dpd > 90 && updatedApp.recoveryStatus !== RECOVERY_STATUSES.LEGAL) {
                  updatedApp.recoveryStatus = RECOVERY_STATUSES.LEGAL;
                  changed = true;
              }
          }

          return updatedApp;
      });
      
      // Inject missing test cases for the user to check the recovery features
      const newSamples = [
        {
            id: "REC-9942",
            name: "Themba Khumalo",
            email: "themba.k@mining.co.za",
            company: "Platinum Mines Ltd",
            amount: 45000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.PTP_FAILED,
            date: new Date(Date.now() - 86400000 * 120).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 115).toISOString(),
            assignedAgent: "Agent Smith",
            tenure: 18,
            salary: 35000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 90).toISOString(), amount: 3500, paidAmount: 3500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 3500, paidAmount: 1500, status: 'PARTIAL' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 3500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Agent Smith', date: new Date(Date.now() - 86400000 * 15).toISOString(), notes: 'Debtor claims temporary cash flow issue.' },
              { id: 2, type: 'Visit', outcome: 'Answered', agent: 'Field Agent Zoe', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Site visit confirmed residency. Debtor signed a new PTP.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 5000, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 15).toISOString() },
              { id: 2, date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 3500, status: 'ACTIVE', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.ACTIVE, date: new Date(Date.now() - 86400000 * 115).toISOString(), user: 'Finance', notes: 'Loan activated' },
              { status: RECOVERY_STATUSES.IN_ARREARS, date: new Date(Date.now() - 86400000 * 59).toISOString(), user: 'System', notes: 'Default detected' }
            ]
        },
        {
            id: "REC-2210",
            name: "Priya Pillay",
            email: "p.pillay@consult.co",
            company: "Creative Solutions",
            amount: 15000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.LEGAL,
            date: new Date(Date.now() - 86400000 * 180).toISOString(),
            salary: 42000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 150).toISOString(), amount: 1500, paidAmount: 1500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 120).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 95).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Refusal', agent: 'Legal Clerk', date: new Date(Date.now() - 86400000 * 40).toISOString(), notes: 'Debtor refused to discuss payment. Escalating to legal.' }
            ],
            ptpHistory: [],
            auditHistory: [
              { status: RECOVERY_STATUSES.LEGAL, date: new Date(Date.now() - 86400000 * 35).toISOString(), user: 'Legal Dept', notes: 'Letter of Demand issued' }
            ]
        },
        {
          id: "APP-004",
          name: "Elena Rodriguez",
          email: "elena.r@agency.com",
          company: "Creative Studio",
          amount: 12000,
          status: STATUSES.CREDIT_PENDING,
          date: "2025-01-15T12:00:00.000Z",
          idNumber: "900415 5001 083",
          salary: 28000,
          purpose: "Education",
          score: 720,
          risk: "Low",
          auditHistory: []
        },
        {
          id: "APP-005",
          name: "Lerato Molefe",
          email: "lerato.m@gmail.com",
          company: "Retail Group",
          amount: 8000,
          status: STATUSES.CREDIT_PENDING,
          date: "2025-01-14T12:00:00.000Z",
          idNumber: "820712 5001 085",
          salary: 19500,
          purpose: "Emergency",
          score: 450,
          risk: "High",
          auditHistory: []
        },
        {
          id: "APP-999",
          name: "Siphesihle Ndlovu",
          email: "siphe.ndlovu@mining.co.za",
          company: "Platinum Mines Ltd",
          amount: 15000,
          status: STATUSES.DISBURSED,
          recoveryStatus: RECOVERY_STATUSES.HEALTHY,
          date: new Date(Date.now() - 86400000 * 3).toISOString(),
          disbursementDate: new Date(Date.now() - 86400000 * 2).toISOString(),
          disbursedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          idNumber: "950812 5001 089",
          salary: 28000,
          purpose: "Renovation",
          score: 750,
          risk: "Low",
          assignedAgent: "System",
          tenure: 12,
          installments: [
            { id: 1, dueDate: new Date(Date.now() + 86400000 * 28).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' }
          ],
          interactionLogs: [],
          ptpHistory: [],
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'Applicant' },
            { status: STATUSES.DISBURSED, date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'Finance' }
          ]
        }
      ];

      const finalApps = [...processedApps];
      newSamples.forEach(sample => {
          if (!finalApps.find(a => a.id === sample.id)) {
              finalApps.push(sample);
          }
      });

      setApplications(finalApps.map(normalizeApplication));
    } else {
      // Seed initial data (Merged version)
      const sampleData = [
        {
          id: 'APP-001',
          name: 'Sarah Jenkins',
          email: 'sarah.j@gmail.com',
          company: 'TechFlow SA',
          amount: 5000,
          status: STATUSES.SUBMITTED,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          idNumber: '920101 5001 081',
          salary: 22500,
          purpose: 'Medical',
          score: 680,
          risk: 'Medium',
          bankDetails: { name: 'Standard Bank', account: '123456789', type: 'Savings' },
          auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 3).toISOString(), user: 'Applicant' }]
        },
        {
          id: 'APP-002',
          name: 'Michael Chen',
          email: 'm.chen@outlook.com',
          company: 'Global Logistics',
          amount: 15000,
          status: STATUSES.HR_PENDING,
          date: new Date(Date.now() - 3600000 * 5).toISOString(),
          idNumber: '880512 5123 084',
          salary: 32000,
          purpose: 'Accounts',
          score: 720,
          risk: 'Low',
          bankDetails: { name: 'First National', account: '442199281', type: 'Current' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 10).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 3600000 * 6).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-003',
          name: 'David Smith',
          email: 'david.s@comp.co',
          company: 'Standard Bank',
          amount: 9000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 86400000).toISOString(),
          idNumber: '850325 5001 082',
          salary: 45000,
          purpose: 'Housing',
          score: 790,
          risk: 'Low',
          bankDetails: { name: 'Absa', account: '992100234', type: 'Savings' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 3).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 86400000 * 2).toISOString(), user: 'HR Manager' },
            { status: STATUSES.CREDIT_PENDING, date: new Date(Date.now() - 86400000 * 1.5).toISOString(), user: 'Credit Officer' }
          ]
        },
        {
          id: 'APP-004',
          name: 'Elena Rodriguez',
          email: 'elena.r@agency.com',
          company: 'Creative Studio',
          amount: 12000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 172800000).toISOString(),
          idNumber: '900415 5001 083',
          salary: 28000,
          purpose: 'Education',
          score: 720,
          risk: 'Low',
          bankDetails: { name: 'Capitec', account: '772188291', type: 'Savings' },
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 172800000 * 2).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_PENDING, date: new Date(Date.now() - 172800000).toISOString(), user: 'HR Manager' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 86400000).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-005',
          name: 'Lerato Molefe',
          email: 'lerato.m@gmail.com',
          company: 'Retail Group',
          amount: 8000,
          status: STATUSES.CREDIT_PENDING,
          date: new Date(Date.now() - 3600000 * 24).toISOString(),
          idNumber: '820712 5001 085',
          salary: 19500,
          purpose: 'Emergency',
          score: 450,
          risk: 'High',
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 48).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 3600000 * 30).toISOString(), user: 'HR Manager' }
          ]
        },
        {
          id: 'APP-006',
          name: 'John Doe',
          email: 'john.doe@corp.co',
          company: 'Tech Solutions',
          amount: 25000,
          status: STATUSES.UNDER_REVIEW,
          date: new Date(Date.now() - 3600000 * 2).toISOString(),
          idNumber: '750302 5001 086',
          salary: 55000,
          purpose: 'Investment',
          score: 610,
          risk: 'Medium',
          assignedTo: 'Credit Officer',
          auditHistory: [
            { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 3600000 * 10).toISOString(), user: 'Applicant' },
            { status: STATUSES.HR_APPROVED, date: new Date(Date.now() - 3600000 * 8).toISOString(), user: 'HR Manager' },
            { status: STATUSES.UNDER_REVIEW, date: new Date(Date.now() - 3600000 * 2).toISOString(), user: 'Credit Officer' }
          ]
        },
        {
            id: "APP-10925",
            name: "Sipho Mdluli",
            email: "sipho.m@global.co.za",
            company: "General Logistics",
            amount: 12000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.HEALTHY,
            date: new Date(Date.now() - 86400000 * 60).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 55).toISOString(),
            disbursedAt: new Date(Date.now() - 86400000 * 55).toISOString(),
            transactionId: 'TXN-DISB-10925',
            tenure: 6,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 25).toISOString(), amount: 2200, paidAmount: 2200, status: 'PAID', lastPaymentDate: new Date(Date.now() - 86400000 * 27).toISOString() },
              { id: 2, dueDate: new Date(Date.now() + 86400000 * 5).toISOString(), amount: 2200, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [],
            ptpHistory: [],
            auditHistory: [
              { status: STATUSES.SUBMITTED, date: new Date(Date.now() - 86400000 * 60).toISOString(), user: 'Applicant' },
              { status: STATUSES.DISBURSED, date: new Date(Date.now() - 86400000 * 55).toISOString(), user: 'Finance' }
            ]
        },
        {
            id: "APP-10926",
            name: "Nicolette Steyn",
            email: "n.steyn@retail.co.za",
            company: "Retail Group",
            amount: 25000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.IN_ARREARS,
            date: new Date(Date.now() - 86400000 * 95).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 90).toISOString(),
            disbursedAt: new Date(Date.now() - 86400000 * 90).toISOString(),
            transactionId: 'TXN-DISB-10926',
            assignedAgent: "Sarah Collections",
            tenure: 12,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 2500, paidAmount: 2500, status: 'PAID', lastPaymentDate: new Date(Date.now() - 86400000 * 62).toISOString() },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 2500, paidAmount: 1000, status: 'PARTIAL', lastPaymentDate: new Date(Date.now() - 86400000 * 25).toISOString() },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 0).toISOString(), amount: 2500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Sarah Collections', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Debtor promised to pay by Friday.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 2).toISOString(), amount: 1500, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.DISBURSED, date: new Date(Date.now() - 86400000 * 90).toISOString(), user: 'Finance' }
            ]
        },
        {
            id: "REC-9942",
            name: "Themba Khumalo",
            email: "themba.k@mining.co.za",
            company: "Platinum Mines Ltd",
            amount: 45000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.PTP_FAILED,
            date: new Date(Date.now() - 86400000 * 120).toISOString(),
            disbursementDate: new Date(Date.now() - 86400000 * 115).toISOString(),
            assignedAgent: "Agent Smith",
            tenure: 18,
            salary: 35000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 90).toISOString(), amount: 3500, paidAmount: 3500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 60).toISOString(), amount: 3500, paidAmount: 1500, status: 'PARTIAL' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 30).toISOString(), amount: 3500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Answered', agent: 'Agent Smith', date: new Date(Date.now() - 86400000 * 15).toISOString(), notes: 'Debtor claims temporary cash flow issue.' },
              { id: 2, type: 'Visit', outcome: 'Answered', agent: 'Field Agent Zoe', date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Site visit confirmed residency. Debtor signed a new PTP.' }
            ],
            ptpHistory: [
              { id: 1, date: new Date(Date.now() - 86400000 * 10).toISOString(), amount: 5000, status: 'FAILED', createdDate: new Date(Date.now() - 86400000 * 15).toISOString() },
              { id: 2, date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 3500, status: 'ACTIVE', createdDate: new Date(Date.now() - 86400000 * 5).toISOString() }
            ],
            auditHistory: [
              { status: STATUSES.ACTIVE, date: new Date(Date.now() - 86400000 * 115).toISOString(), user: 'Finance', notes: 'Loan activated' },
              { status: RECOVERY_STATUSES.IN_ARREARS, date: new Date(Date.now() - 86400000 * 59).toISOString(), user: 'System', notes: 'Default detected' }
            ]
        },
        {
            id: 'APP-007',
            name: 'Lerato Molefe',
            idNumber: '820712 5001 085',
            email: 'lerato.m@retail.co',
            company: 'Retail Group',
            amount: 8000,
            status: STATUSES.APPROVED,
            lifecycleStatus: LIFECYCLE_STATUSES.ADMIN_APPROVED,
            date: new Date().toISOString(),
            bankDetails: { name: 'Capitec', account: '789123456', type: 'Savings' },
            installments: [],
            interactionLogs: [],
            ptpHistory: [],
            auditHistory: [{ status: STATUSES.APPROVED, date: new Date().toISOString(), user: 'Admin', note: 'Ready for disbursement' }]
        },
        {
            id: 'APP-008',
            name: 'David Smith',
            idNumber: '850325 5001 082',
            email: 'david.s@standard.co',
            company: 'Standard Bank',
            amount: 12000,
            status: STATUSES.APPROVED,
            lifecycleStatus: LIFECYCLE_STATUSES.ADMIN_APPROVED,
            date: new Date().toISOString(),
            bankDetails: { name: 'FNB', account: '112233445', type: 'Cheque' },
            installments: [],
            interactionLogs: [],
            ptpHistory: [],
            auditHistory: [{ status: STATUSES.APPROVED, date: new Date().toISOString(), user: 'Admin', note: 'Ready for disbursement' }]
        },
        {
            id: "REC-2210",
            name: "Priya Pillay",
            email: "p.pillay@consult.co",
            company: "Creative Solutions",
            amount: 15000,
            status: STATUSES.DISBURSED,
            recoveryStatus: RECOVERY_STATUSES.LEGAL,
            date: new Date(Date.now() - 86400000 * 180).toISOString(),
            salary: 42000,
            installments: [
              { id: 1, dueDate: new Date(Date.now() - 86400000 * 150).toISOString(), amount: 1500, paidAmount: 1500, status: 'PAID' },
              { id: 2, dueDate: new Date(Date.now() - 86400000 * 120).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' },
              { id: 3, dueDate: new Date(Date.now() - 86400000 * 95).toISOString(), amount: 1500, paidAmount: 0, status: 'UNPAID' }
            ],
            interactionLogs: [
              { id: 1, type: 'Call', outcome: 'Refusal', agent: 'Legal Clerk', date: new Date(Date.now() - 86400000 * 40).toISOString(), notes: 'Debtor refused to discuss payment. Escalating to legal.' }
            ],
            ptpHistory: [],
            auditHistory: [
              { status: RECOVERY_STATUSES.LEGAL, date: new Date(Date.now() - 86400000 * 35).toISOString(), user: 'Legal Dept', notes: 'Letter of Demand issued' }
            ]
        }
      ];
      const normalizedSamples = sampleData.map(normalizeApplication);
      setApplications(normalizedSamples);
      localStorage.setItem('lms_applications', JSON.stringify(normalizedSamples));
    }

    const parsedLogs = storedLogs ? JSON.parse(storedLogs) : [];
    if (parsedLogs.length > 0) {
      setAuditLogs(parsedLogs);
    } else {
      const dummyLogs = [
        { id: 1, appId: 'APP-004', type: 'STATUS_CHANGED', status: 'CREDIT_PENDING', timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), user: 'HR Manager' },
        { id: 2, appId: 'APP-005', type: 'STATUS_CHANGED', status: 'CREDIT_PENDING', timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), user: 'HR Manager' },
        { id: 3, appId: 'APP-006', type: 'STATUS_CHANGED', status: 'UNDER_REVIEW', timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), user: 'Credit Officer' },
        { id: 4, appId: 'APP-10925', type: 'DISBURSED', status: 'Active', timestamp: new Date(Date.now() - 86400000 * 55).toISOString(), user: 'Finance', transactionId: 'TXN-DISB-10925' },
        { id: 5, appId: 'APP-10926', type: 'DISBURSED', status: 'Active', timestamp: new Date(Date.now() - 86400000 * 90).toISOString(), user: 'Finance', transactionId: 'TXN-DISB-10926' },
      ];
      setAuditLogs(dummyLogs);
      localStorage.setItem('lms_audit_logs', JSON.stringify(dummyLogs));
    }

    // Cross-Tab Synchronization
    const handleStorageChange = (e) => {
      if (e.key === 'lms_applications') {
        setApplications(JSON.parse(e.newValue || '[]').map(normalizeApplication));
      }
      if (e.key === 'lms_audit_logs') {
        setAuditLogs(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveApplications = (newApps) => {
    const normalizedApps = newApps.map(normalizeApplication);
    setApplications(normalizedApps);
    localStorage.setItem('lms_applications', JSON.stringify(normalizedApps));
  };

  const logAction = (action) => {
    const newLog = { ...action, id: Date.now(), timestamp: new Date().toISOString() };
    setAuditLogs(prev => {
      const updated = [newLog, ...prev];
      localStorage.setItem('lms_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  const disburseLoan = (id, userName = 'Finance Office') => {
    const transactionId = `TXN-${Math.floor(Math.random() * 1000000)}`;
    const disbursedAt = new Date().toISOString();
    
    setApplications(prev => {
      let found = false;
      const updated = prev.map(app => {
        if (String(app.id) === String(id)) {
          found = true;
          return { 
            ...app, 
            status: STATUSES.ACTIVE,
            lifecycleStatus: LIFECYCLE_STATUSES.ACTIVE,
            disbursedAt,
            transactionId,
            outstandingAmount: app.outstandingAmount ?? calculateOutstandingAmount(app),
            nextDueDate: getNextDueDate(app),
            auditHistory: [...(app.auditHistory || []), { status: STATUSES.ACTIVE, date: disbursedAt, user: userName, note: `Funds Disbursed: ${transactionId}` }]
          };
        }
        return app;
      });

      if (!found) {
        const mockFallback = [
          { id: 'APP-007', name: 'Lerato Molefe', idNumber: '820712 5001 085', email: 'lerato.m@retail.co', company: 'Retail Group', amount: 8000, bankDetails: { name: 'Capitec', account: '789123456', type: 'Savings' } },
          { id: 'APP-008', name: 'David Smith', idNumber: '850325 5001 082', email: 'david.s@standard.co', company: 'Standard Bank', amount: 12000, bankDetails: { name: 'FNB', account: '112233445', type: 'Cheque' } }
        ].find(m => String(m.id) === String(id));

        if (mockFallback) {
          updated.push({
            ...mockFallback,
            status: STATUSES.ACTIVE,
            lifecycleStatus: LIFECYCLE_STATUSES.ACTIVE,
            disbursedAt,
            transactionId,
            outstandingAmount: mockFallback.amount,
            nextDueDate: new Date(Date.now() + 30 * 86400000).toISOString(),
            installments: [],
            interactionLogs: [],
            ptpHistory: [],
            auditHistory: [{ status: STATUSES.ACTIVE, date: disbursedAt, user: userName, note: `Funds Disbursed: ${transactionId}` }]
          });
        }
      }

      localStorage.setItem('lms_applications', JSON.stringify(updated));
      return updated;
    });
    
    logAction({
      type: EVENT_TYPES.DISBURSED,
      appId: id,
      user: userName,
      status: STATUSES.ACTIVE,
      lifecycleStatus: LIFECYCLE_STATUSES.ACTIVE,
      transactionId,
    });
  };

  const batchMarkAsPaid = (appIds, userName = 'Payroll System') => {
    const paidAt = new Date().toISOString();
    const results = { success: [], failed: [] };

    setApplications(prev => {
      const updated = prev.map(app => {
        if (appIds.includes(app.id)) {
          // Simulation: IDs ending in '3' or '7' fail
          if (app.id.endsWith('3') || app.id.endsWith('7')) {
              results.failed.push({ id: app.id, name: app.name, reason: 'Insufficient Funds' });
              return app;
          }
          results.success.push(app.id);
          return { 
            ...app, 
            status: STATUSES.PAID,
            lifecycleStatus: LIFECYCLE_STATUSES.CLOSED,
            outstandingAmount: 0,
            paidAt,
            auditHistory: [...(app.auditHistory || []), { status: STATUSES.PAID, date: paidAt, user: userName, note: 'Repayment Received' }]
          };
        }
        return app;
      });
      localStorage.setItem('lms_applications', JSON.stringify(updated));
      return updated;
    });

    results.success.forEach(id => {
      logAction({ type: EVENT_TYPES.PAID, appId: id, user: userName, status: STATUSES.PAID });
    });
    
    results.failed.forEach(f => {
      logAction({ type: EVENT_TYPES.FAILED, appId: f.id, user: userName, status: STATUSES.ACTIVE, note: f.reason });
    });

    return results;
  };

  const canApply = (email) => {
    const activeLoanStatuses = [
      STATUSES.SUBMITTED, 
      STATUSES.HR_PENDING, 
      STATUSES.CREDIT_PENDING, 
      STATUSES.ADMIN_APPROVAL, 
      STATUSES.APPROVED,
      STATUSES.ACTIVE
    ];
    
    return !applications.some(app => 
      app.email === email && activeLoanStatuses.includes(app.status)
    );
  };

  const addApplication = (app) => {
    if (!canApply(app.email)) {
      throw new Error('User already has an active loan or application.');
    }

    const newApp = {
      ...app,
      id: `APP-00${applications.length + 1}`,
      status: STATUSES.HR_PENDING,
      lifecycleStatus: LIFECYCLE_STATUSES.SUBMITTED,
      date: new Date().toISOString(),
      auditHistory: [{ status: STATUSES.SUBMITTED, date: new Date().toISOString(), user: 'Employee' }]
    };

    saveApplications([newApp, ...applications]);
    logAction({
      type: EVENT_TYPES.APPLICATION_SUBMITTED,
      appId: newApp.id,
      user: 'Employee',
      status: newApp.status,
      lifecycleStatus: newApp.lifecycleStatus,
    });
    return newApp;
  };

  const updateStatus = (id, newStatus, userName = 'System', notes = '') => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const historyEntry = { 
            status: newStatus, 
            date: new Date().toISOString(), 
            user: userName,
            notes: notes 
        };
        return { 
          ...app, 
          status: newStatus,
          auditHistory: [...(app.auditHistory || []), historyEntry]
        };
      }
      return app;
    });
    
    saveApplications(updatedApps);
    logAction({ type: EVENT_TYPES.STATUS_CHANGED, appId: id, user: userName, status: newStatus, notes });
  };

  const transitionLoanLifecycle = (id, action, userName = 'System', notes = '') => {
    const currentApp = applications.find((app) => app.id === id);
    if (!currentApp) {
      throw new Error('Application not found.');
    }

    const currentLifecycle = deriveLifecycleStatus(currentApp);
    if (!isLifecycleTransitionAllowed(currentLifecycle, action)) {
      throw new Error(`Invalid transition: ${currentLifecycle} -> ${action}`);
    }

    const targetLifecycle = ACTION_TO_TARGET_STATUS[action];
    const targetStatus = mapLifecycleToLegacy(targetLifecycle);
    const updatedApps = applications.map((app) => {
      if (app.id !== id) return app;
      return {
        ...app,
        status: targetStatus,
        lifecycleStatus: targetLifecycle,
        auditHistory: [
          ...(app.auditHistory || []),
          {
            status: targetStatus,
            lifecycleStatus: targetLifecycle,
            action,
            date: new Date().toISOString(),
            user: userName,
            notes,
          },
        ],
      };
    });

    saveApplications(updatedApps);
    logAction({
      type: EVENT_TYPES.STATUS_CHANGED,
      appId: id,
      user: userName,
      action,
      status: targetStatus,
      lifecycleStatus: targetLifecycle,
      notes,
    });
  };

  const assignApplication = (id, officerName) => {
    const updatedApps = applications.map(app => {
        if (app.id === id) {
            return {
                ...app,
                assignedTo: officerName,
                status: STATUSES.UNDER_REVIEW,
                auditHistory: [
                    ...(app.auditHistory || []), 
                    { status: STATUSES.UNDER_REVIEW, date: new Date().toISOString(), user: officerName, notes: `Assigned to ${officerName}` }
                ]
            };
        }
        return app;
    });
    saveApplications(updatedApps);
    logAction({ type: EVENT_TYPES.ASSIGNMENT, appId: id, user: officerName, status: STATUSES.UNDER_REVIEW });
  };

  const penaltyInterestRate = 0.02; // 2% monthly penalty

  const assignRecoveryAgent = (id, agentName) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return {
          ...app,
          assignedAgent: agentName,
          auditHistory: [
            ...(app.auditHistory || []),
            { 
              status: 'AGENT_ASSIGNMENT', 
              date: new Date().toISOString(), 
              user: 'Manager', 
              notes: `Assigned to ${agentName}` 
            }
          ]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
    logAction({
      type: EVENT_TYPES.ASSIGNMENT,
      appId: id,
      user: 'Manager',
      assignedAgent: agentName,
      notes: `Assigned recovery case to ${agentName}`,
    });
  };

  const bulkAssignAgents = (ids, agentName) => {
    const updatedApps = applications.map(app => {
      if (ids.includes(app.id)) {
        return {
          ...app,
          assignedAgent: agentName,
          auditHistory: [
            ...(app.auditHistory || []),
            { status: 'BULK_ASSIGNMENT', date: new Date().toISOString(), user: 'Manager', notes: `Bulk assigned to ${agentName}` }
          ]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
    ids.forEach((appId) => {
      logAction({
        type: EVENT_TYPES.ASSIGNMENT,
        appId,
        user: 'Manager',
        assignedAgent: agentName,
        notes: `Bulk assigned recovery case to ${agentName}`,
      });
    });
  };

  const recordRecoveryPayment = (id, amount, method = 'Bank Transfer', reference = '') => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        // Validation: Prevent overpayment
        const currentOutstanding = app.installments?.reduce((acc, curr) => acc + (curr.amount - curr.paidAmount), 0) || 0;
        if (amount > currentOutstanding + 1) { // +1 for rounding grace
          return app;
        }

        let remaining = amount;
        const newInstallments = app.installments?.map(inst => {
          if (remaining <= 0 || inst.status === 'PAID') return inst;
          
          const needed = inst.amount - inst.paidAmount;
          const payment = Math.min(remaining, needed);
          remaining -= payment;
          
          const newPaid = inst.paidAmount + payment;
          return {
            ...inst,
            paidAmount: newPaid,
            status: newPaid >= inst.amount ? 'PAID' : 'PARTIAL',
            lastPaymentDate: new Date().toISOString()
          };
        }) || [];

        const totalOutstanding = newInstallments.reduce((acc, curr) => acc + Math.max(0, curr.amount - curr.paidAmount), 0);
        const isFullyPaid = totalOutstanding <= 0;
        const overdueAfterPayment = newInstallments.some(
          (inst) => (inst.amount - inst.paidAmount) > 0 && new Date(inst.dueDate) < new Date()
        );
        const nextDueDate = (() => {
          const unpaid = newInstallments.filter((inst) => (inst.amount - inst.paidAmount) > 0);
          if (unpaid.length === 0) return null;
          const earliest = unpaid.reduce((acc, inst) => (new Date(inst.dueDate) < new Date(acc.dueDate) ? inst : acc));
          return earliest.dueDate;
        })();
        const now = new Date().toISOString();
        const hasActiveRecovery =
          app.recoveryStatus &&
          app.recoveryStatus !== RECOVERY_STATUSES.HEALTHY &&
          app.recoveryStatus !== RECOVERY_STATUSES.RECOVERED &&
          app.recoveryStatus !== RECOVERY_STATUSES.IN_ARREARS;

        return {
          ...app,
          installments: newInstallments,
          lastActionDate: now,
          status: isFullyPaid ? STATUSES.PAID : STATUSES.ACTIVE,
          lifecycleStatus: isFullyPaid
            ? LIFECYCLE_STATUSES.CLOSED
            : overdueAfterPayment
              ? (hasActiveRecovery ? LIFECYCLE_STATUSES.RECOVERY : LIFECYCLE_STATUSES.IN_ARREARS)
              : LIFECYCLE_STATUSES.ACTIVE,
          recoveryStatus: isFullyPaid
            ? RECOVERY_STATUSES.RECOVERED
            : overdueAfterPayment
              ? (hasActiveRecovery ? app.recoveryStatus : RECOVERY_STATUSES.IN_ARREARS)
              : RECOVERY_STATUSES.HEALTHY,
          outstandingAmount: totalOutstanding,
          nextDueDate,
          auditHistory: [
            ...(app.auditHistory || []),
            { 
              status: 'RECOVERY_PAYMENT', 
              date: now, 
              user: 'System', 
              notes: `Payment of R ${amount} recorded. Ref: ${reference}` 
            }
          ]
        };
      }
      return app;
    });

    saveApplications(updatedApps);
    const updatedApp = updatedApps.find((app) => app.id === id);
    if (updatedApp) {
      logAction({
        type: EVENT_TYPES.PAYMENT_RECORDED,
        appId: id,
        user: 'Recovery Agent',
        status: updatedApp.status,
        lifecycleStatus: updatedApp.lifecycleStatus,
        recoveryStatus: updatedApp.recoveryStatus,
        amount,
        method,
        reference,
        outstandingAmount: updatedApp.outstandingAmount,
      });
    }
  };

  const logRecoveryInteraction = (id, interaction) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const now = new Date().toISOString();
        let newStatus = app.recoveryStatus || RECOVERY_STATUSES.IN_ARREARS;
        
        // Auto-update status based on interaction
        if (interaction.type === 'Call' || interaction.type === 'Visit') {
            newStatus = RECOVERY_STATUSES.CONTACTED || 'Contacted'; // Fallback if CONTACTED not in enum
        }

        return {
          ...app,
          status: STATUSES.ACTIVE,
          lifecycleStatus: LIFECYCLE_STATUSES.RECOVERY,
          lastActionDate: now,
          recoveryStatus: newStatus,
          nextDueDate: getNextDueDate(app),
          interactionLogs: [{ ...interaction, id: Date.now(), date: now }, ...(app.interactionLogs || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
    const updatedApp = updatedApps.find((app) => app.id === id);
    if (updatedApp) {
      logAction({
        type: EVENT_TYPES.RECOVERY_INTERACTION,
        appId: id,
        user: interaction.agent || 'Recovery Agent',
        status: updatedApp.status,
        lifecycleStatus: updatedApp.lifecycleStatus,
        recoveryStatus: updatedApp.recoveryStatus,
        interactionType: interaction.type,
        outcome: interaction.outcome,
        notes: interaction.notes,
      });
    }
  };

  const updatePTP = (id, ptpData) => {
    const updatedApps = applications.map(app => {
      if (app.id === id) {
        const now = new Date().toISOString();
        return {
          ...app,
          status: STATUSES.ACTIVE,
          lifecycleStatus: LIFECYCLE_STATUSES.RECOVERY,
          lastActionDate: now,
          recoveryStatus: RECOVERY_STATUSES.PTP,
          nextDueDate: getNextDueDate(app),
          ptpHistory: [{ ...ptpData, id: Date.now(), createdDate: now, status: 'ACTIVE' }, ...(app.ptpHistory || [])]
        };
      }
      return app;
    });
    saveApplications(updatedApps);
    const updatedApp = updatedApps.find((app) => app.id === id);
    if (updatedApp) {
      logAction({
        type: EVENT_TYPES.PTP_CREATED,
        appId: id,
        user: 'Recovery Agent',
        status: updatedApp.status,
        lifecycleStatus: updatedApp.lifecycleStatus,
        recoveryStatus: updatedApp.recoveryStatus,
        amount: Number(ptpData.amount),
        promiseDate: ptpData.date,
      });
    }
  };

  // --- MANAGEMENT AGGREGATION UTILITIES ---
  
  const getExecutiveStats = () => {
    // Total Revenue = sum of interest (10%) from PAID loans
    const paidLoans = applications.filter(app => app.status === STATUSES.PAID);
    const totalRevenue = paidLoans.reduce((sum, app) => sum + (Number(app.amount) * 0.1), 0);
    
    // Active Clients = unique Employees with ACTIVE loans
    const activeClients = applications.filter(app => app.status === STATUSES.ACTIVE).length;
    
    // Portfolio Yield = (Total Interest / Total Principal) * 100
    const totalPrincipal = applications.reduce((sum, app) => sum + Number(app.amount), 0);
    const totalPotentialInterest = totalPrincipal * 0.1;
    const yieldRate = totalPrincipal > 0 ? (totalPotentialInterest / totalPrincipal) * 100 : 0;

    return {
      totalRevenue,
      activeClients,
      yieldRate: yieldRate.toFixed(1)
    };
  };

  const getDisbursementTrends = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const lastSixMonths = [];
    
    for (let i = 5; i >= 0; i--) {
      const m = (currentMonth - i + 12) % 12;
      lastSixMonths.push({ name: months[m], amount: 0, index: m });
    }

    applications.forEach(app => {
      if (app.disbursedAt) {
        const d = new Date(app.disbursedAt);
        const m = d.getMonth();
        const trend = lastSixMonths.find(t => t.index === m);
        if (trend) trend.amount += Number(app.amount);
      }
    });

    return lastSixMonths;
  };

  const getStatusDistribution = () => {
    const counts = {};
    Object.values(STATUSES).forEach(s => counts[s] = 0);
    applications.forEach(app => counts[app.status]++);
    
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const getAnalyticsData = () => {
    // Default Rate = FAILED audit logs / Total active
    const failedCount = auditLogs.filter(l => l.type === EVENT_TYPES.FAILED).length;
    const activeCount = applications.filter(app => app.status === STATUSES.ACTIVE).length;
    const defaultRate = activeCount > 0 ? (failedCount / activeCount) * 100 : 0;

    // Average Loan Size
    const avgLoanSize = applications.length > 0 
      ? applications.reduce((sum, app) => sum + Number(app.amount), 0) / applications.length 
      : 0;

    // Risk Segmentation (Fake mapping for demo)
    const riskData = [
      { name: 'Low Risk', value: applications.filter(app => Number(app.salary) > 30000).length },
      { name: 'Medium Risk', value: applications.filter(app => Number(app.salary) <= 30000 && Number(app.salary) > 15000).length },
      { name: 'High Risk', value: applications.filter(app => Number(app.salary) <= 15000).length },
    ];

    // Top Employers
    const employers = {};
    applications.forEach(app => {
      const co = app.company || 'Unknown';
      employers[co] = (employers[co] || 0) + 1;
    });
    const topEmployers = Object.entries(employers)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return { 
      defaultRate: defaultRate.toFixed(1), 
      avgLoanSize, 
      riskData, 
      topEmployers 
    };
  };

  const addNote = (id, note, user = 'HR Manager') => {
    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        const auditHistory = app.auditHistory || [];
        return {
          ...app,
          auditHistory: [
            ...auditHistory,
            { status: app.status, date: new Date().toISOString(), user, notes: note }
          ]
        };
      }
      return app;
    }));
  };

  const mockExport = (fileName, type = 'CSV') => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock Export: ${fileName}.${type.toLowerCase()} generated.`);
        resolve(true);
      }, 1000);
    });
  };

  const mockSendEmail = (to, subject) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Mock Email sent to ${to}: ${subject}`);
        resolve(true);
      }, 1200);
    });
  };

  return (
    <LoanContext.Provider value={{ 
      applications, 
      addApplication, 
      updateStatus, 
      transitionLoanLifecycle,
      disburseLoan,
      batchMarkAsPaid,
      assignApplication,
      recordRecoveryPayment,
      logRecoveryInteraction,
      updatePTP,
      assignRecoveryAgent,
      bulkAssignAgents,
      penaltyInterestRate,
      canApply, 
      auditLogs,
      getExecutiveStats,
      getDisbursementTrends,
      getStatusDistribution,
      getAnalyticsData,
      addNote,
      mockExport,
      mockSendEmail
    }}>
      {children}
    </LoanContext.Provider>
  );
};




export const useLoans = () => {
  const context = useContext(LoanContext);
  if (!context) throw new Error('useLoans must be used within a LoanProvider');
  return context;
};
