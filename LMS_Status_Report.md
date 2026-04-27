# Lenni LMS - Implementation Status Report (Change Request Document 1)

This report details the implementation status of each point raised in the change request document. Every status mentioned here is based on the current live codebase.

## 1. EMPLOYEE - APPLY LOAN
- **Full Name Separation:** IMPLEMENTED. The application form now has separate fields for "Name" and "Surname".
- **Postal Address:** IMPLEMENTED. A specific "Postal Address" field has been added to the personal information section.
- **BEE Disclosures:** IMPLEMENTED. Added "Previously Disadvantaged" toggle and dropdowns for "Ethnic Group" (Black/Coloured/Indian), "Female", and "Disability".
- **Employer Division:** IMPLEMENTED. The "Employer Division" field is now available directly after the Employer Name.
- **Employment Type Logic:** IMPLEMENTED. The form now dynamically asks for "Contract End Date" or "Season End Date" based on the selection.
- **Financial Details:** IMPLEMENTED. Gross Income, Expenses, and Net Income fields are added. Net Income is automatically calculated from Gross minus Expenses.
- **Bank Branch Code:** IMPLEMENTED. The system now automatically provides the South African universal branch code (250655) when a bank is selected.
- **Loan Amount Criteria:** IMPLEMENTED. Minimum R400, increments of R400, and a maximum of R8000 are enforced with validation.
- **Loan Term Scale:** IMPLEMENTED. Terms now adjust based on salary frequency (1-6 months for monthly, 4-24 weeks for weekly, etc.).
- **Other Documents:** IMPLEMENTED. A "Other Document" upload slot has been added for school statements or settlement letters.
- **Agreements:** IMPLEMENTED. The 6 mandatory NCR checkboxes have been added and are required for submission.
- **Digital Signatures:** IMPLEMENTED. Applicants can now Draw their signature, Upload an image, or use a Mobile Link to sign.

## 2. MY STATUS (EMPLOYEE DASHBOARD)
- **Visibility:** FIXED. The requested loan amount text and other summary fields have been changed from white to bold black for clear visibility.
- **Processing Time Note:** IMPLEMENTED. Added a notification that processing takes 1-2 business days.
- **Declined Reasons:** IMPLEMENTED. If an application is rejected, the reason is now clearly displayed in a red warning box.
- **PDF Statements:** FIXED. Replaced the browser print function with a professional PDF generator that downloads a clean statement document.
- **Settlement Letter:** UPDATED. The label has been changed to "Final Settlement Amount" as requested.
- **Decline Letter:** IMPLEMENTED. A formal rejection letter is now generated and available for download if the case is declined.

## 3. HR MODULE
- **Dashboard Visibility:** FIXED. Audited and fixed all "white/light" fonts on the HR dashboard. Headings and priority queue texts are now dark and legible.
- **Left Panel Reports:** IMPLEMENTED. Added "Remittance Advices", "New Loans Report", and "Overdue Report" to the HR sidebar navigation.
- **Report Filtering:** IMPLEMENTED. These reports now support company-specific generation and tracking.

## 4. ADMIN MODULE
- **Wording Changes:** IMPLEMENTED. "Pipeline" has been renamed to "Application Status" across the entire module.
- **Pipeline Health/Manage:** UPDATED. Now displays "Application Process", "Manage Status", and "View Status" as requested.

## 5. CREDIT MODULE
- **Dashboard Visibility:** FIXED. All white headings (Credit Policy, Alerts, Stats) have been changed to high-contrast dark colors.
- **Terminology:** UPDATED. "Deployment Pipeline" has been renamed to "Final Outcome".

## 6. FINANCE MODULE
- **Batch Processing:** IMPLEMENTED. Now supports per-company processing with manual input functions for figure adjustments.
- **Settlement Module:** IMPLEMENTED. "Settlement" has been added to the left panel as a dedicated function for capturing payments against previous loans.
- **Reports & Date Ranges:** IMPLEMENTED. All reports (Overdue, Remittance, New Loans) now include a date range picker (Day, Week, Month, etc.).
- **Journal Write Offs:** IMPLEMENTED. The system can now calculate interest/fee write-offs with an additional manual override option.

## 7. MANAGEMENT MODULE
- **Date Range Choice:** IMPLEMENTED. Added a global date range selector for all management insights.
- **Age Analysis:** IMPLEMENTED. Added a report for 30, 60, 90, and 120+ days (Available per company or all).
- **Investor Center:** IMPLEMENTED. A new module with graphs, percentages, and charts specifically for potential investor reporting.
- **Loan Reason Reports:** IMPLEMENTED. Added percentage-based charts for loan purposes (Education, Medical, Funeral, etc.).
- **BEE/Disadvantaged Reports:** IMPLEMENTED. Added reports for previously disadvantaged applicants with per-company filtering.
- **System Backups:** IMPLEMENTED. Added a "System Backups" section for downloading data or copying to cloud/external drives.

## 8. RECOVERY MODULE
- **Monthly Movement:** IMPLEMENTED. The dashboard now shows new clients moved to recovery within specific date ranges.
- **Write Off Controls:** IMPLEMENTED. Logic added to identify and write off loans with no payments for 3 months.
- **Reinstatement:** IMPLEMENTED. Added the "Move Back (Original)" and "Move to New Entity" options to reinstate payroll deductions.

---
**Summary Note on Text Visibility:**
Across the entire platform, we have eliminated the "White Text on Light Background" issue. All critical headings, labels, and financial figures are now rendered in bold black or high-contrast slate to ensure 100% legibility on all screens.
