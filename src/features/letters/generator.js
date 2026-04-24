import { LIFECYCLE_STATUSES } from '../../context/LoanContext';
import {
  buildConfirmationLetter,
  buildPaidUpLetter,
  buildSettlementLetter,
} from './templates';
import { getLetterEligibility, getOutstandingAmount, LETTER_TYPES } from './rules';

const normalizeUser = (loan) => ({
  name: loan?.name || 'N/A',
  idNumber: loan?.idNumber || 'N/A',
  email: loan?.email || '',
});

const toStatusLabel = (loan) => loan?.lifecycleStatus || loan?.status || LIFECYCLE_STATUSES.DRAFT;

const normalizeLoan = (loan) => ({
  loanId: loan?.id || 'N/A',
  amount: Number(loan?.amount) || 0,
  outstandingAmount: getOutstandingAmount(loan),
  statusLabel: toStatusLabel(loan),
});

export const buildLetterPayload = (type, loan) => {
  const eligibility = getLetterEligibility(type, loan);
  if (!eligibility.allowed) {
    throw new Error(eligibility.reason || 'Letter cannot be generated.');
  }

  const user = normalizeUser(loan);
  const loanData = normalizeLoan(loan);
  const generatedAt = new Date().toISOString();

  if (type === LETTER_TYPES.SETTLEMENT) {
    return {
      type,
      title: 'Settlement Letter',
      filename: `Settlement-${loanData.loanId}.pdf`,
      html: buildSettlementLetter({ user, loan: loanData }),
      generatedAt,
      user,
      loan: loanData,
    };
  }

  if (type === LETTER_TYPES.PAID_UP) {
    return {
      type,
      title: 'Paid-up Letter',
      filename: `PaidUp-${loanData.loanId}.pdf`,
      html: buildPaidUpLetter({ user, loan: loanData }),
      generatedAt,
      user,
      loan: loanData,
    };
  }

  if (type === LETTER_TYPES.CONFIRMATION) {
    return {
      type,
      title: 'Loan Confirmation Letter',
      filename: `LoanConfirmation-${loanData.loanId}.pdf`,
      html: buildConfirmationLetter({ user, loan: loanData }),
      generatedAt,
      user,
      loan: loanData,
    };
  }

  if (type === LETTER_TYPES.REJECTION) {
    return {
      type,
      title: 'Rejection Letter',
      filename: `Rejection-${loanData.loanId}.pdf`,
      html: buildRejectionLetter({ user, loan: loanData }),
      generatedAt,
      user,
      loan: loanData,
    };
  }

  throw new Error('Unsupported letter type.');
};

export { LETTER_TYPES, getLetterEligibility };

