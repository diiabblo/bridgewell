// sBTC Withdrawal Module
// Handles Bitcoin withdrawals from Stacks

export interface WithdrawalRequest {
  amount: bigint;
  btcAddress: string;
  fee: bigint;
}

export const WITHDRAWAL_STEP_2 = 'step_2';

export const WITHDRAWAL_STEP_3 = 'step_3';

export const WITHDRAWAL_STEP_4 = 'step_4';

export const WITHDRAWAL_STEP_5 = 'step_5';

export const WITHDRAWAL_STEP_6 = 'step_6';

export const WITHDRAWAL_STEP_7 = 'step_7';
