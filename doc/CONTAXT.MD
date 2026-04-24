# 🧠 PROJECT CONTEXT FILE (context.md)

## Payroll Deduction Loan Management System (LMS)

---

# 1. 📌 PURPOSE OF THIS FILE

This file is **VERY IMPORTANT**.

It ensures that any AI tool (Cursor / Antigravity / Developer) will:

✅ First understand the system
✅ Follow proper structure
✅ Not break existing logic
✅ Maintain consistency

---

# 2. 📂 REQUIRED FILES (MUST READ FIRST)

Before doing ANY work, you MUST read:

1. `prd.md` → Product requirements
2. `architecture.md` → Frontend structure
3. `flow.md` → System flow
4. `RBAC.md` → Roles & permissions
5. `style.md` → UI consistency rules

---

## 🚨 STRICT RULE

```id="rule1"
DO NOT write or change code before reading all 5 files
```

---

# 3. 🧩 SYSTEM UNDERSTANDING (SUMMARY)

This is a:

👉 **Fintech Loan Management System**

Main flow:

```id="flow1"
Employee → Apply → HR → Credit → Admin → Finance → Disbursement → Payroll Deduction → Reconciliation → Reports → Recovery
```

---

# 4. ⚠️ CRITICAL BUSINESS RULES

You MUST follow these rules:

---

## 4.1 One Loan Rule

```id="rule2"
User can have ONLY ONE active loan
```

---

## 4.2 Status-Based Flow

```id="rule3"
Application must follow defined statuses
No skipping steps allowed
```

---

## 4.3 Role-Based Access

```id="rule4"
User actions MUST follow RBAC.md
```

---

## 4.4 Financial Accuracy

```id="rule5"
Never break payment, repayment, or calculation logic
```

---

# 5. 🏗️ DEVELOPMENT RULES

---

## 5.1 Follow Architecture

* Use folder structure from `architecture.md`
* Use modular approach
* Do NOT mix modules

---

## 5.2 UI Consistency

* Follow `style.md`
* Do NOT use random colors or fonts
* Reuse components

---

## 5.3 Flow First, Code Later

```id="rule6"
Understand flow.md before building anything
```

---

## 5.4 No Hardcoding

❌ Hardcoded values
❌ Fake logic inside UI

✅ Use services / mock APIs

---

# 6. 🔄 HOW TO EXECUTE TASKS

---

## Step-by-Step Process

```id="exec1"
1. Read context.md
2. Read all 5 files
3. Understand feature request
4. Map feature to module
5. Check RBAC rules
6. Check flow impact
7. Implement UI
8. Connect to mock API
9. Test flow
```

---

# 7. 📌 WHEN MODIFYING EXISTING CODE

---

Before changing anything:

```id="modify1"
- Identify module
- Check related flow
- Check role permissions
- Ensure no breaking changes
```

---

## After changes:

```id="modify2"
- Test full flow
- Verify UI consistency
- Validate role restrictions
```

---

# 8. 🚫 STRICTLY AVOID

---

❌ Breaking flow logic
❌ Ignoring RBAC
❌ Changing design system
❌ Mixing unrelated modules
❌ Writing messy code

---

# 9. 🧠 THINK LIKE THIS

---

Before coding, always think:

```id="think1"
Where does this data come from?
Where does it go next?
Who can access it?
What happens if it fails?
```

---

# 10. 📦 EXPECTED OUTPUT STYLE

---

When implementing features:

* Clean code
* Modular structure
* Reusable components
* Proper naming
* Comments where needed

---

# 11. 🔮 FUTURE READY

---

Write code in a way that:

* Backend can be connected easily
* APIs can be replaced later
* System can scale

---

# 12. 📌 FINAL COMMAND

---

```id="finalrule"
READ → UNDERSTAND → THEN IMPLEMENT
```

---

## 🚨 IF ANYTHING IS UNCLEAR

* Refer back to:

  * PRD
  * Flow
  * RBAC
  * Architecture

---
@
## 🔥 GOLDEN RULE

> Never build blindly. Always follow system logic.

---

**End of Context File**