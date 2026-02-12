// Contract Call Utilities Module
// Provides helper functions for interacting with Stacks smart contracts

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: any[];
  network: 'mainnet' | 'testnet';
}

export type NetworkType = 'mainnet' | 'testnet';

export interface FunctionArg {
  type: string;
  value: any;
}

export interface PostCondition {
  type: 'stx' | 'ft' | 'nft';
  address: string;
  amount?: bigint;
}
