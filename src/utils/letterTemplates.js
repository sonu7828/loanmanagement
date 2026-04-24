/**
 * Loan Letter Templates Utility
 * Generates professional HTML strings for different loan-related letters.
 */

const getCommonHeader = (title) => `
    <div style="font-family: 'Helvetica', 'Arial', sans-serif; color: #1e293b; padding: 40px; border: 1px solid #e2e8f0; border-radius: 8px; line-height: 1.6;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 4px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px;">
            <div style="font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: -0.025em;">
                Lenni Loan <span style="color: #2563eb;">Management</span>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 14px; font-weight: 700;">${title}</div>
                <div style="font-size: 11px; color: #64748b; margin-top: 4px;">DATE: ${new Date().toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 30px;">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">TO:</div>
            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">{{NAME}}</div>
            <div style="font-size: 13px; color: #475569; margin-top: 2px;">{{EMAIL}}</div>
            <div style="font-size: 13px; color: #475569;">ID: {{ID_NUMBER}}</div>
        </div>
`;

const getCommonFooter = () => `
        <div style="margin-top: 60px; padding-top: 30px; border-top: 1px solid #e2e8f0;">
            <div style="margin-bottom: 40px;">
                <div style="font-size: 14px; font-weight: 700; color: #1e293b;">Authorized Signature</div>
                <div style="font-family: 'Brush Script MT', cursive; font-size: 24px; color: #2563eb; margin: 10px 0;">Lenni Management Team</div>
                <div style="font-size: 12px; color: #64748b;">Credit Committee Representative</div>
            </div>
            
            <div style="font-size: 10px; color: #94a3b8; text-align: center; font-style: italic;">
                Lenni Loan Management is a registered credit provider. Terms and conditions apply. 
                This document is electronically generated and is valid without a physical signature.
            </div>
        </div>
    </div>
`;

export const getLoanConfirmationLetter = (loan, user) => {
    let html = getCommonHeader('LOAN CONFIRMATION LETTER');
    html += `
        <div style="font-size: 15px; color: #334155; margin-bottom: 25px;">
            Dear <span style="font-weight: 700;">{{NAME}}</span>,
        </div>
        
        <p style="margin-bottom: 20px;">We are pleased to confirm that your loan application with reference <span style="font-weight: 700;">{{LOAN_ID}}</span> has been successfully processed and activated.</p>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 12px; border: 1px solid #f1f5f9; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Principal Amount:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-align: right;">R {{AMOUNT}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Loan Commencement:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-align: right;">{{DATE}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #64748b;">Current Status:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #2563eb; text-align: right;">{{STATUS}}</td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                    <td style="padding: 12px 0 0 0; font-size: 13px; color: #64748b;">Employer / Source:</td>
                    <td style="padding: 12px 0 0 0; font-size: 14px; font-weight: 700; color: #1e293b; text-align: right;">{{COMPANY}}</td>
                </tr>
            </table>
        </div>
        
        <p>This letter serves as formal proof of your credit agreement with Lenni Loan Management. Please keep this document for your records.</p>
    `;
    html += getCommonFooter();
    
    return fillTemplate(html, loan, user);
};

export const getSettlementLetter = (loan, user, outstanding) => {
    let html = getCommonHeader('FINAL SETTLEMENT QUOTATION');
    html += `
        <div style="font-size: 15px; color: #334155; margin-bottom: 25px;">
            Dear <span style="font-weight: 700;">{{NAME}}</span>,
        </div>
        
        <p style="margin-bottom: 20px;">As per your request, we hereby provide the final settlement amount required to close your loan account <span style="font-weight: 700;">{{LOAN_ID}}</span> as of today's date.</p>
        
        <div style="background-color: #fef2f2; padding: 25px; border-radius: 12px; border: 1px solid #fee2e2; margin-bottom: 25px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #991b1b;">Current Principal Balance:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-align: right;">R {{PRINCIPAL}}</td>
                </tr>
                <tr>
                    <td style="padding: 8px 0; font-size: 13px; color: #991b1b;">Accrued Interest / Fees:</td>
                    <td style="padding: 8px 0; font-size: 14px; font-weight: 700; color: #1e293b; text-align: right;">R {{FEES}}</td>
                </tr>
                <tr style="border-top: 2px solid #ef4444;">
                    <td style="padding: 12px 0 0 0; font-size: 14px; font-weight: 800; color: #991b1b; text-transform: uppercase;">Final Settlement Amount:</td>
                    <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: 900; color: #b91c1c; text-align: right;">R {{SETTLEMENT_TOTAL}}</td>
                </tr>
            </table>
        </div>
        
        <p style="font-size: 12px; color: #64748b; margin-bottom: 20px;">* This quotation is valid for <span style="font-weight: 700; color: #1e293b;">48 hours</span> from the date of issue. Please use your Loan ID as the payment reference.</p>
        
        <p>Upon receipt of the full settlement amount, your account will be marked as "Recovered" and a final Paid-up letter will be issued within 7 business days.</p>
    `;
    html += getCommonFooter();

    const fees = Math.max(0, outstanding - (loan.amount || 0));
    return fillTemplate(html, loan, user, { 
        PRINCIPAL: loan.amount?.toLocaleString() || '0',
        FEES: fees.toLocaleString() || '0',
        SETTLEMENT_TOTAL: outstanding.toLocaleString() || '0'
    });
};

export const getPaidUpLetter = (loan, user) => {
    let html = getCommonHeader('PAID-UP LETTER / CLOSURE CERTIFICATE');
    html += `
        <div style="font-size: 15px; color: #334155; margin-bottom: 25px;">
            TO WHOM IT MAY CONCERN,
        </div>
        
        <p style="margin-top: 20px; margin-bottom: 25px;">This letter serves to confirm that the loan account for <span style="font-weight: 700; color: #1e293b;">{{NAME}}</span> (ID: {{ID_NUMBER}}) with reference <span style="font-weight: 700;">{{LOAN_ID}}</span> has been <span style="font-weight: 700; color: #059669;">SETTLED IN FULL</span>.</p>
        
        <div style="background-color: #f0fdf4; padding: 30px; border-radius: 12px; border: 1px solid #dcfce7; margin-bottom: 30px; text-align: center;">
            <div style="font-size: 12px; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.2em; margin-bottom: 10px;">Account Status</div>
            <div style="font-size: 32px; font-weight: 900; color: #15803d; letter-spacing: -0.025em;">CLOSED / PAID-UP</div>
            <div style="font-size: 13px; color: #166534; margin-top: 10px; font-weight: 600;">Balance: R 0.00</div>
        </div>
        
        <p style="line-height: 1.8;">Lenni Loan Management hereby releases the applicant from any further financial obligations related to this specific credit agreement. All credit bureau records will be updated to reflect the "Paid-in-Full" status during the next reporting cycle.</p>
        
        <p style="margin-top: 20px;">We thank you for your valued patronage and look forward to assisting you with any future credit requirements.</p>
    `;
    html += getCommonFooter();
    
    return fillTemplate(html, loan, user);
};

export const getRejectionLetter = (loan, user) => {
    let html = getCommonHeader('APPLICATION OUTCOME: DECLINED');
    html += `
        <div style="font-size: 15px; color: #334155; margin-bottom: 25px;">
            Dear <span style="font-weight: 700;">{{NAME}}</span>,
        </div>
        
        <p style="margin-bottom: 20px;">We refer to your recent loan application with reference <span style="font-weight: 700;">{{LOAN_ID}}</span> submitted on <span style="font-weight: 700;">{{DATE}}</span>.</p>
        
        <p style="margin-bottom: 20px;">After careful consideration and thorough review by our credit assessment team, we regret to inform you that we are unable to approve your application at this time.</p>
        
        <div style="background-color: #fef2f2; padding: 25px; border-radius: 12px; border: 1px solid #fee2e2; margin-bottom: 25px;">
            <div style="font-size: 12px; font-weight: 800; color: #991b1b; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">Reason for Decline</div>
            <div style="font-size: 15px; font-weight: 700; color: #b91c1c;">{{REASON}}</div>
        </div>
        
        <p style="line-height: 1.6; margin-bottom: 15px;">We understand this may be disappointing news. Our decision was based on our current lending criteria and the information available to us during the assessment process, which may include affordability checks and credit bureau data.</p>
        
        <div style="background-color: #f8fafc; padding: 15px; border-left: 4px solid #3b82f6; margin-bottom: 20px;">
            <div style="font-weight: 700; color: #1e293b; margin-bottom: 5px;">Next Steps</div>
            <p style="font-size: 13px; color: #475569; margin: 0;">You are welcome to reapply in the future if your financial circumstances change. Should you require further clarification regarding this outcome, please contact our support team referencing your Application ID.</p>
        </div>
    `;
    html += getCommonFooter();
    
    return fillTemplate(html, loan, user, {
        REASON: loan.declineReason || 'Did not meet current lending criteria or affordability requirements.'
    });
};

// Private Helper to replace placeholders
const fillTemplate = (html, loan, user, extra = {}) => {
    const data = {
        NAME: loan.name || user?.name || 'Valued Client',
        EMAIL: loan.email || user?.email || 'N/A',
        ID_NUMBER: loan.idNumber || 'N/A',
        LOAN_ID: loan.id || 'N/A',
        AMOUNT: loan.amount?.toLocaleString() || '0',
        DATE: new Date(loan.date || Date.now()).toLocaleDateString(),
        STATUS: loan.status || 'Active',
        COMPANY: loan.company || 'N/A',
        ...extra
    };
    
    let result = html;
    Object.keys(data).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        result = result.replace(regex, data[key]);
    });
    
    return result;
};
