# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Payroll Deduction Loan Management System (LMS)

---

# 1. 🧾 PRODUCT OVERVIEW

## 1.1 Product Name

Payroll Deduction Loan Management System (LMS)

## 1.2 Objective

To build a **secure, scalable fintech system** that enables employees to apply for loans and repay them via **automatic payroll deductions**, while giving full control to admin, credit, finance, and management teams.

---

## 1.3 Problem Statement

Current challenges:

* Manual loan processing
* No centralized tracking
* Payment mismatches
* Poor communication with employers
* High risk of fraud and defaults

---

## 1.4 Solution

A centralized system that:

* Automates loan lifecycle
* Integrates employer verification
* Tracks repayments via payroll
* Provides real-time insights
* Handles recoveries

---

# 2. 👥 USER ROLES

| Role               | Description          |
| ------------------ | -------------------- |
| Employee           | Applies for loan     |
| HR / Employer      | Verifies employee    |
| Admin / Operations | Manages applications |
| Credit Controller  | Risk assessment      |
| Finance Team       | Disbursement         |
| Management         | Analytics            |
| Recoveries Team    | Handles defaults     |

---

# 3. 🎯 CORE FEATURES

## 3.1 Loan Application

* Multi-step form
* Document upload
* E-signature
* Consent capture

## 3.2 Employer Verification

* Email-based approval/rejection
* Reason selection

## 3.3 Credit Assessment

* Credit report upload
* Affordability calculation
* Risk classification

## 3.4 Loan Disbursement

* Batch payments
* Instant payouts
* Bank file generation

## 3.5 Repayment Tracking

* Payroll deduction uploads
* Auto matching engine
* Exception handling

## 3.6 Document Generation

* Settlement letter
* Paid-up letter
* Loan confirmation
* Statements

## 3.7 Reporting & Analytics

* KPI dashboards
* Profit tracking
* Risk insights

## 3.8 Recoveries

* Default tracking
* Payment plans
* Manual collection

---

# 4. 🧩 SYSTEM MODULES

---

## 4.1 Authentication Module

**Purpose:** User access control
**Features:**

* Login / Register
* OTP verification
* Password reset

---

## 4.2 Applicant Module

**Purpose:** Loan application & tracking
**Features:**

* Dashboard
* Loan application wizard
* Document uploads
* Loan status tracking

---

## 4.3 HR Module

**Purpose:** Employer verification
**Features:**

* Email approval/rejection
* Employee validation

---

## 4.4 Admin Module

**Purpose:** Central control
**Features:**

* Application pipeline
* Client profile
* Status management

---

## 4.5 Credit Module

**Purpose:** Risk assessment
**Features:**

* Credit report upload
* Risk notes
* Approval recommendation

---

## 4.6 Finance Module

**Purpose:** Disbursement
**Features:**

* Batch payouts
* Immediate payments
* Payment logs

---

## 4.7 Reconciliation Module

**Purpose:** Payment matching
**Features:**

* Upload employer files
* Match repayments
* Exception handling

---

## 4.8 Remittance Module

**Purpose:** Employer reporting
**Features:**

* Deduction reports
* Scheduled emails

---

## 4.9 Letter Module

**Purpose:** Document generation
**Features:**

* Auto PDF generation
* Email sharing

---

## 4.10 Management Module

**Purpose:** Analytics
**Features:**

* KPIs
* Trends
* Business insights

---

## 4.11 Recoveries Module

**Purpose:** Default handling
**Features:**

* Case tracking
* Payment plans
* Call logs

---

# 5. 🔄 SYSTEM WORKFLOW

---

## 5.1 Primary Flow

1. User registers
2. User logs in
3. User submits loan application
4. System sends to HR
5. HR approves/rejects
6. If approved → Credit review
7. Credit approves/rejects
8. Admin final review
9. Finance disburses funds
10. Loan becomes active
11. Payroll deductions begin
12. Employer uploads deduction file
13. System matches payments
14. Loan closes OR moves to recoveries

---

## 5.2 Edge Cases

* HR not responding → reminders
* Incorrect payroll data → unmatched payments
* Underpayment → carry forward
* Employee exit → move to recoveries
* Duplicate loan → enforce one-loan rule

---

# 6. 🗃 DATABASE OVERVIEW

---

## Core Tables

* users
* roles
* applicants
* applications
* loans
* repayments
* disbursements
* payment_imports
* documents
* letters
* recoveries
* notifications
* audit_logs

---

## Relationships

* User → Applications
* Application → Loan
* Loan → Repayments
* Loan → Disbursement
* Loan → Recoveries

---

# 7. 🔐 SECURITY REQUIREMENTS

* Role-based access control (RBAC)
* Data encryption
* Audit logging
* Daily backups
* POPIA compliance
* Secure file storage

---

# 8. ⚙️ BUSINESS RULES

---

## Loan Rules

* First loan limited
* Higher limits based on history
* Only one active loan per user

---

## Deduction Rules

* Weekly / Fortnightly / Monthly logic
* Salary cycle-based deduction

---

## Payment Rules

* Auto-match repayments
* Flag mismatches
* Manual override allowed

---

# 9. 📊 SUCCESS METRICS

* Loan approval rate
* Default rate
* Collection efficiency
* Processing time
* Profit per loan
* Employer participation rate

---

# 10. 🚀 DEVELOPMENT PLAN

---

## Phase 1: Foundation

* Authentication
* Applicant flow
* Basic database

---

## Phase 2: Core Engine

* Admin pipeline
* Credit module
* Loan creation

---

## Phase 3: Financial Operations

* Disbursement
* Repayment tracking
* Reconciliation

---

## Phase 4: Advanced Features

* Document generation
* Reporting
* Recoveries

---

## Phase 5: Optimization

* Performance tuning
* Security enhancements
* UX improvements

---

# 11. ⚠️ RISKS & DEPENDENCIES

---

## Risks

* Incorrect payroll data
* HR delays
* Payment mismatches
* Regulatory compliance issues

---

## Dependencies

* Employer cooperation
* Banking integration
* Credit bureau access

---

# 12. 🔮 FUTURE ENHANCEMENTS

* Mobile app
* WhatsApp notifications
* AI-based credit scoring
* Fraud detection engine
* API integrations with payroll systems

---

# 13. 📌 FINAL NOTE

This system is a **complex fintech platform**, not a simple CRUD app.

Success depends on:

* Clean workflows
* Strong validation
* Accurate financial logic
* Proper role management

---

**End of PRD**
