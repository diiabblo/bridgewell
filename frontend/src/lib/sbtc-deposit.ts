// sBTC Deposit Module
// Handles Bitcoin deposits to Stacks

export interface DepositRequest {
  amount: bigint;
  stacksAddress: string;
}

export const DEPOSIT_STEP_2 = 'step_2';

export const DEPOSIT_STEP_3 = 'step_3';
