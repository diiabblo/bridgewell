// sBTC Deposit Module
// Handles Bitcoin deposits to Stacks

export interface DepositRequest {
  amount: bigint;
  stacksAddress: string;
}

export const DEPOSIT_STEP_2 = 'step_2';

export const DEPOSIT_STEP_3 = 'step_3';

export const DEPOSIT_STEP_4 = 'step_4';

export const DEPOSIT_STEP_5 = 'step_5';

export const DEPOSIT_STEP_6 = 'step_6';

export const DEPOSIT_STEP_7 = 'step_7';
