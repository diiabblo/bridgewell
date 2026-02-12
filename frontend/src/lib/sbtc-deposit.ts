// sBTC Deposit Module
// Handles Bitcoin deposits to Stacks

export interface DepositRequest {
  amount: bigint;
  stacksAddress: string;
}
