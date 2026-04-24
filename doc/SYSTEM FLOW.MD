# 🔄 SYSTEM FLOW DOCUMENT (flow.md)

## Payroll Deduction Loan Management System (LMS)

---

# 1. 📌 PURPOSE OF THIS DOCUMENT

This document explains:

* How data moves in the system
* How modules are connected
* How different users interact
* Important business flows (Loan, Payment, Recovery)

👉 Written in **simple beginner-friendly language**

---

# 2. 🧩 HIGH LEVEL SYSTEM FLOW

```
Employee → Application → HR → Credit → Admin → Finance → Loan Active → Payroll Deduction → Reconciliation → Closure / Recovery
```

---

# 3. 🔗 MODULE RELATIONSHIP (VERY IMPORTANT)

## Core Relationship

```
User
 └── Applicant Profile
       └── Application
             └── Loan
                   ├── Disbursement
                   ├── Repayments
                   └── Recovery (if default)
```

---

## Module Interaction

```
Applicant Module → Creates Application
HR Module → Verifies Application
Credit Module → Assesses Risk
Admin Module → Controls Flow
Finance Module → Sends Money
Reconciliation Module → Tracks Payments
Reports Module → Reads Data
Recoveries Module → Handles Defaults
```

---

# 4. 👥 USER INTERACTION FLOW

---

## 4.1 Employee Flow

```
Register → Login → Apply Loan → Upload Docs → Sign Agreement → Wait for Approval → Receive Money → Salary Deduction → Loan Closed
```

---

## 4.2 HR Flow

```
Receive Email → Review Employee → Approve / Reject → System Updates Status
```

---

## 4.3 Admin Flow

```
View Application → Assign → Move Status → Final Review → Send to Finance
```

---

## 4.4 Credit Flow

```
View Queue → Check Risk → Add Notes → Recommend Decision
```

---

## 4.5 Finance Flow

```
View Approved Loans → Select → Generate Batch → Disburse → Mark Paid
```

---

## 4.6 Recoveries Flow

```
Employee Leaves → Loan Moves to Recovery → Contact → Payment Plan → Close Case
```

---

# 5. 💰 CORE FLOW 1 — LOAN APPLICATION FLOW (DETAILED)

---

## Step-by-Step Flow

```
1. Employee registers
2. Employee logs in
3. Employee fills loan form
4. Employee uploads documents
5. Employee accepts agreement
```

➡️ System Action:

```
6. Application status = "Submitted"
7. System sends to HR
```

➡️ HR Decision:

```
8. HR approves → status = "HR Approved"
OR
8. HR rejects → status = "Declined"
```

➡️ If Approved:

```
9. Move to Credit Queue
10. Credit checks affordability + risk
11. Credit approves → status = "Credit Approved"
```

➡️ Final Stage:

```
12. Admin final review
13. Send to Finance
14. Finance disburses money
15. Loan created
16. Status = "Active"
```

---

# 6. 💳 CORE FLOW 2 — DISBURSEMENT FLOW

```
Approved Loans → Finance Dashboard → Select Loans → Generate Bank File → Send to Bank → Mark as Paid
```

---

## Important Logic

* Batch processing (daily)
* Immediate transfer option
* Avoid duplicate payments

---

# 7. 📥 CORE FLOW 3 — PAYMENT / RECONCILIATION FLOW

---

## Input

Employer uploads Excel file:

```
Employee ID | Name | Deduction | Date
```

---

## Flow

```
1. Upload file
2. System reads data
3. Match Employee ID with Loan
```

---

## Matching Results

```
Matched → Payment recorded
Underpaid → Remaining balance
Overpaid → Extra amount tracked
Unmatched → Flag error
Missing → No payment received
```

---

## Output

```
Loan balance updated
Reports generated
Exceptions flagged
```

---

# 8. 📄 CORE FLOW 4 — LETTER GENERATION FLOW

---

```
User/Admin requests letter → System fetches loan data → Generate PDF → Store → Send Email
```

---

## Types

* Settlement Letter
* Paid-Up Letter
* Loan Confirmation
* Statement

---

# 9. ⚠️ CORE FLOW 5 — ONE LOAN RULE

---

## Logic

```
If user has active loan:
    Calculate settlement amount
    Deduct old loan
    Create new loan with remaining amount
```

---

## Example

```
Old Loan Balance = 2000
New Loan Approved = 5000

→ Pay 2000 to close old loan
→ Give 3000 to user
```

---

# 10. 🚨 CORE FLOW 6 — RECOVERY FLOW

---

## Trigger

```
Employee leaves company OR stops payment
```

---

## Flow

```
1. Loan marked default
2. Move to Recoveries module
3. Assign agent
4. Contact customer
5. Create payment plan
6. Track payments
7. Close when paid
```

---

# 11. 🔄 STATUS FLOW (IMPORTANT)

---

## Application Status

```
Submitted
→ Waiting HR
→ HR Approved
→ Credit Pending
→ Credit Approved
→ Final Review
→ Approved
→ Declined
→ Paid
```

---

## Loan Status

```
Active
→ Ongoing
→ Completed
→ Defaulted
→ In Recovery
→ Closed
```

---

# 12. ⚠️ EDGE CASE FLOWS

---

## 1. HR Not Responding

```
System → Send Reminder → Escalate to Admin
```

---

## 2. Payment Not Matching

```
Mark as Unmatched → Manual Review → Adjust
```

---

## 3. Underpayment

```
Carry forward balance → Add next cycle
```

---

## 4. Failed Disbursement

```
Retry → Manual fix → Notify admin
```

---

## 5. Duplicate Application

```
Check active loan → Block OR Apply One Loan Rule
```

---

# 13. 🔗 DATA FLOW SUMMARY

---

```
Frontend (UI)
   ↓
Form Input
   ↓
State Management
   ↓
API (Mock/Backend)
   ↓
Database
   ↓
Processing Logic
   ↓
Response
   ↓
UI Update
```

---

# 14. 🧠 IMPORTANT CONNECTIONS

---

## Critical Dependencies

* Application → HR approval required
* HR → Credit cannot proceed without it
* Credit → Finance depends on approval
* Finance → Loan creation depends on disbursement
* Reconciliation → Depends on employer file

---

# 15. 📌 FINAL NOTES

---

This system is **flow-driven**, not just UI-based.

👉 If flow breaks:

* Money errors happen ❗
* Reports become wrong ❗
* Business risk increases ❗

---

## 🔥 Golden Rule

👉 Always track:

* Status
* Ownership
* Data flow
* Edge cases

---

## 💡 Developer Mindset

Think like:

> “Where is this data coming from and where is it going next?”

---

**End of Flow Document**
