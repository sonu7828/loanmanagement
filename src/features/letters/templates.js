const escapeHtml = (value) =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return `R ${amount.toLocaleString()}`;
};

const formatDate = (value = new Date()) => {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString();
};

const baseLetterTemplate = ({ title, letterRef, bodyHtml }) => `
  <div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; color: #111; line-height: 1.6;">
    <div style="margin-bottom: 40px; display: flex; justify-content: space-between; align-items: baseline;">
      <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #000; text-transform: uppercase; tracking: -0.05em;">${escapeHtml(title)}</h1>
      <div style="text-align: right; font-size: 11px; font-weight: 800; color: #666; text-transform: uppercase; letter-spacing: 0.1em;">
        REF: ${escapeHtml(letterRef)}
      </div>
    </div>
    <div style="font-size: 15px; color: #333;">
      ${bodyHtml}
    </div>
  </div>
`;

export const buildSettlementLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Settlement Letter',
    letterRef: `SET-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        This letter serves to confirm the <strong>settlement amount</strong> required to close your loan account
        <strong>${escapeHtml(loan.loanId)}</strong> in full.
      </p>
      <div style="margin: 30px 0; background: #f9f9f9; padding: 25px; border: 1px solid #eee; border-radius: 4px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #666;">Borrower Name</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right;">${escapeHtml(user.name)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; color: #666;">Loan Account Number</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right; font-family: monospace;">${escapeHtml(loan.loanId)}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: 700;">Settlement Amount</td>
            <td style="padding: 12px 0; font-weight: 900; text-align: right; font-size: 18px; color: #dc2626;">${escapeHtml(formatCurrency(loan.outstandingAmount))}</td>
          </tr>
        </table>
      </div>
      <p style="font-size: 12px; color: #666;">
        Please note that this settlement figure is valid for a period of 7 calendar days from the date of this letter. 
        Failure to settle within this period may result in additional interest charges.
      </p>
    `,
  });

export const buildPaidUpLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Paid-Up Letter',
    letterRef: `PUP-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        We are pleased to confirm that your loan account <strong>${escapeHtml(loan.loanId)}</strong> has been settled in full and is now closed.
      </p>
      <div style="margin: 30px 0; background: #f0fdf4; padding: 25px; border: 1px solid #dcfce7; border-radius: 4px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #dcfce7;">
            <td style="padding: 12px 0; color: #166534;">Loan Account Number</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right; font-family: monospace;">${escapeHtml(loan.loanId)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #dcfce7;">
            <td style="padding: 12px 0; color: #166534;">Original Principal</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right;">${escapeHtml(formatCurrency(loan.amount))}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; font-weight: 700; color: #166534;">Outstanding Balance</td>
            <td style="padding: 12px 0; font-weight: 900; text-align: right; font-size: 18px; color: #16a34a;">R 0.00</td>
          </tr>
        </table>
      </div>
      <p>
        We thank you for your patronage and look forward to assisting you with your future financial needs.
      </p>
    `,
  });

export const buildConfirmationLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Loan Confirmation Letter',
    letterRef: `CNF-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        This letter serves to confirm that you have an active loan agreement with Lenni Lending Protocol.
      </p>
      <div style="margin: 30px 0; background: #f8fafc; padding: 25px; border: 1px solid #e2e8f0; border-radius: 4px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #475569;">Loan Status</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right; color: #2563eb;">${escapeHtml(loan.statusLabel)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #e2e8f0;">
            <td style="padding: 12px 0; color: #475569;">Principal Amount</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right;">${escapeHtml(formatCurrency(loan.amount))}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #475569;">Loan Account Number</td>
            <td style="padding: 12px 0; font-weight: 700; text-align: right; font-family: monospace;">${escapeHtml(loan.loanId)}</td>
          </tr>
        </table>
      </div>
      <p>
        This confirmation is issued for any official verification requirements.
      </p>
    `,
  });

export const buildRejectionLetter = ({ user, loan }) =>
  baseLetterTemplate({
    title: 'Application Rejection Letter',
    letterRef: `REJ-${loan.loanId}`,
    bodyHtml: `
      <p>Dear ${escapeHtml(user.name)},</p>
      <p>
        Thank you for your recent loan application with Lenni Lending Protocol.
      </p>
      <p>
        After careful review of your application <strong>${escapeHtml(loan.loanId)}</strong>, we regret to inform you that we are unable to approve your request at this time.
      </p>
      <div style="margin: 30px 0; background: #fff1f2; padding: 25px; border: 1px solid #ffe4e6; border-radius: 4px;">
        <p style="margin: 0; font-size: 11px; font-weight: 700; color: #9f1239; text-transform: uppercase;">Reason for Rejection</p>
        <p style="margin: 10px 0 0; font-size: 14px; font-weight: 700; color: #be123c;">${escapeHtml(loan.rejectionReason || 'Does not meet internal credit criteria')}</p>
      </div>
      <p>
        We encourage you to review your financial standing and apply again in the future once your circumstances have improved.
      </p>
    `,
  });

