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

export const WITHDRAWAL_STEP_8 = 'step_8';

export const WITHDRAWAL_STEP_9 = 'step_9';

export const WITHDRAWAL_STEP_10 = 'step_10';

export const WITHDRAWAL_STEP_11 = 'step_11';

export const WITHDRAWAL_STEP_12 = 'step_12';

export const WITHDRAWAL_STEP_13 = 'step_13';

export const WITHDRAWAL_STEP_14 = 'step_14';

export const WITHDRAWAL_STEP_15 = 'step_15';
