import { LIFECYCLE_STATUSES, STATUSES } from '../../context/LoanContext';

export const LETTER_TYPES = {
  SETTLEMENT: 'SETTLEMENT',
  PAID_UP: 'PAID_UP',
  CONFIRMATION: 'CONFIRMATION',
  REJECTION: 'REJECTION',
};

export const getOutstandingAmount = (loan) => {
  const directOutstanding = Number(loan?.outstandingAmount);
  if (Number.isFinite(directOutstanding)) return Math.max(0, directOutstanding);

  const installmentOutstanding =
    loan?.installments?.reduce(
      (sum, installment) =>
        sum + Math.max(0, Number(installment.amount || 0) - Number(installment.paidAmount || 0)),
      0
    ) || 0;

  return Math.max(0, installmentOutstanding);
};

export const isPaidUpEligible = (loan) => {
  const outstanding = getOutstandingAmount(loan);
  return (
    outstanding <= 0 &&
    (loan?.lifecycleStatus === LIFECYCLE_STATUSES.CLOSED || 
     loan?.status === STATUSES.PAID || 
     loan?.status === STATUSES.CLOSED)
  );
};

export const isConfirmationEligible = (loan) => {
  return (
    loan?.lifecycleStatus === LIFECYCLE_STATUSES.ACTIVE ||
    loan?.lifecycleStatus === LIFECYCLE_STATUSES.DISBURSED ||
    loan?.lifecycleStatus === LIFECYCLE_STATUSES.ADMIN_APPROVED ||
    loan?.status === STATUSES.ACTIVE ||
    loan?.status === STATUSES.DISBURSED ||
    loan?.status === STATUSES.APPROVED
  );
};

export const isRejectionEligible = (loan) => {
  return (
    loan?.status === STATUSES.DECLINED ||
    loan?.status === STATUSES.REJECTED ||
    loan?.lifecycleStatus === 'Declined' ||
    loan?.lifecycleStatus === 'Rejected'
  );
};

export const getLetterEligibility = (type, loan) => {
  if (!loan) {
    return { allowed: false, reason: 'No loan found for this user.' };
  }

  if (type === LETTER_TYPES.SETTLEMENT) {
    return { allowed: true };
  }

  if (type === LETTER_TYPES.PAID_UP) {
    return isPaidUpEligible(loan)
      ? { allowed: true }
      : { allowed: false, reason: 'Paid-up letter is available only after full repayment.' };
  }

  if (type === LETTER_TYPES.CONFIRMATION) {
    return isConfirmationEligible(loan)
      ? { allowed: true }
      : { allowed: false, reason: 'Confirmation letter is available only for active loans.' };
  }

  if (type === LETTER_TYPES.REJECTION) {
    return isRejectionEligible(loan)
      ? { allowed: true }
      : { allowed: false, reason: 'Rejection letter is available only for declined applications.' };
  }

  return { allowed: false, reason: 'Unsupported letter type.' };
};

