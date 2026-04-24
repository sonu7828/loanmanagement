# 🔐 ROLE-BASED ACCESS CONTROL (RBAC.md)

## Payroll Deduction Loan Management System (LMS)

---

# 1. 📌 PURPOSE

This document defines:

* User roles in the system
* What each role can **SEE**
* What each role can **DO**
* What each role **CANNOT DO**

👉 Goal: Ensure **security + proper workflow control**

---

# 2. 🧑‍🤝‍🧑 ROLES OVERVIEW

| Role                 | Description           |
| -------------------- | --------------------- |
| Employee / Applicant | Applies for loan      |
| HR / Employer        | Verifies employee     |
| Admin / Operations   | Controls applications |
| Credit Controller    | Risk assessment       |
| Finance Team         | Disbursement          |
| Management           | Analytics only        |
| Recoveries Team      | Handles defaults      |

---

# 3. 🔑 PERMISSION TYPES

We define permissions as:

* VIEW → Can see data
* CREATE → Can add data
* EDIT → Can modify data
* DELETE → Can remove data
* APPROVE → Can approve/reject decisions
* PROCESS → Can execute financial/system actions

---

# 4. 📊 ROLE PERMISSION MATRIX

---

## 4.1 EMPLOYEE / APPLICANT

### Can SEE

* Own dashboard
* Loan status
* Statements
* Letters

### Can DO

* Register / Login
* Apply for loan
* Upload documents
* Sign agreements
* Request letters

### CANNOT DO

* Approve loans ❌
* View other users ❌
* Access admin panels ❌

---

## 4.2 HR / EMPLOYER

### Can SEE

* Employee applications (their company)
* Verification requests
* Basic loan info

### Can DO

* Approve application
* Reject application (with reason)

### CANNOT DO

* Access credit reports ❌
* Disburse money ❌
* Modify loan data ❌

---

## 4.3 ADMIN / OPERATIONS

### Can SEE

* All applications
* All users
* All loan data
* System dashboards

### Can DO

* Manage application pipeline
* Assign applications
* Move status forward
* View full client profile
* Add internal notes

### CANNOT DO

* Disburse money directly ❌ (finance only)
* Override audit logs ❌

---

## 4.4 CREDIT CONTROLLER

### Can SEE

* Credit queue
* Applicant financial data
* Uploaded documents

### Can DO

* Upload credit report
* Evaluate affordability
* Add risk notes
* Approve / decline recommendation

### CANNOT DO

* Disburse money ❌
* Change HR decisions ❌

---

## 4.5 FINANCE TEAM

### Can SEE

* Approved loans
* Disbursement records
* Payment history

### Can DO

* Process payouts
* Generate bank files
* Mark payments as completed

### CANNOT DO

* Approve applications ❌
* Modify credit decisions ❌

---

## 4.6 MANAGEMENT

### Can SEE

* KPIs
* Reports
* Analytics
* Profit data

### Can DO

* View dashboards
* Export reports

### CANNOT DO

* Edit applications ❌
* Approve loans ❌
* Access operational tools ❌

---

## 4.7 RECOVERIES TEAM

### Can SEE

* Defaulted loans
* Customer contact details
* Payment history

### Can DO

* Add call notes
* Create payment plans
* Track recovery payments
* Close recovery cases

### CANNOT DO

* Approve new loans ❌
* Disburse funds ❌

---

# 5. 🔄 ROLE-BASED DATA ACCESS RULES

---

## 5.1 Data Isolation

* Employee → Only own data
* HR → Only company employees
* Admin → Full access
* Finance → Only approved loans
* Recoveries → Only defaulted loans

---

## 5.2 Example

```id="xgq8xr"
Employee A cannot see Employee B data
HR of Company X cannot see Company Y data
Finance cannot see rejected applications
```

---

# 6. 🔐 MODULE ACCESS CONTROL

| Module              | Employee | HR | Admin | Credit | Finance | Mgmt | Recovery |
| ------------------- | -------- | -- | ----- | ------ | ------- | ---- | -------- |
| Auth                | ✅        | ✅  | ✅     | ✅      | ✅       | ✅    | ✅        |
| Applicant Dashboard | ✅        | ❌  | ❌     | ❌      | ❌       | ❌    | ❌        |
| HR Verification     | ❌        | ✅  | ✅     | ❌      | ❌       | ❌    | ❌        |
| Admin Panel         | ❌        | ❌  | ✅     | ❌      | ❌       | ❌    | ❌        |
| Credit Module       | ❌        | ❌  | ❌     | ✅      | ❌       | ❌    | ❌        |
| Finance Module      | ❌        | ❌  | ❌     | ❌      | ✅       | ❌    | ❌        |
| Reports             | ❌        | ❌  | ✅     | ❌      | ❌       | ✅    | ❌        |
| Reconciliation      | ❌        | ❌  | ✅     | ❌      | ✅       | ❌    | ❌        |
| Recoveries          | ❌        | ❌  | ❌     | ❌      | ❌       | ❌    | ✅        |

---

# 7. ⚙️ PERMISSION LOGIC (HOW IT WORKS)

---

## 7.1 Basic Rule

```id="q12kqv"
User → Role → Permissions → Allowed Actions
```

---

## 7.2 Example Logic

```javascript id="y9pq21"
if (user.role === "finance") {
  allow("disburse_payment");
}

if (user.role !== "admin") {
  deny("access_admin_panel");
}
```

---

# 8. 🧾 AUDIT & TRACKING (IMPORTANT)

---

## What to track

* Who approved loan
* Who changed status
* Who uploaded file
* Who processed payment

---

## Example

```id="kk1m6v"
User: Admin1
Action: Approved Loan
Time: 10:45 AM
```

---

# 9. ⚠️ SECURITY RULES

---

* No direct access without role check
* All sensitive actions must be logged
* Financial actions require strict control
* Role escalation not allowed

---

# 10. 🚨 COMMON MISTAKES

---

❌ Giving too many permissions
❌ Not restricting data by company
❌ No audit logs
❌ Hardcoding roles in UI only
❌ Not validating on backend

---

# 11. 🔮 FUTURE IMPROVEMENTS

---

* Permission-level control (not just role-based)
* Multi-role users
* Approval hierarchy (multi-level approvals)
* Temporary access (time-based roles)

---

# 12. 📌 FINAL NOTE

RBAC is **critical in fintech systems**.

👉 If RBAC fails:

* Data leaks ❗
* Fraud risk ❗
* Compliance issues ❗

---

## 🔥 Golden Rule

> “Right user, right access, right time”

---

**End of RBAC Document**
