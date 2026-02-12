// Stacking Integration Module
// Provides utilities for Stacks stacking operations

export interface StackingInfo {
  stacked: bigint;
  burnchainUnlockHeight: number;
}

export interface PoXAddress {
  version: Buffer;
  hashbytes: Buffer;
}

export interface StackingOptions {
  amountMicroStx: bigint;
  poxAddress: string;
  burnBlockHeight: number;
  cycles: number;
}
