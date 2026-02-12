// sBTC Withdrawal Module
// Handles Bitcoin withdrawals from Stacks

export interface WithdrawalRequest {
  amount: bigint;
  btcAddress: string;
  fee: bigint;
}
