// Network Configuration Module - Step 1: Basic types

export type NetworkEnvironment = 'mainnet' | 'testnet';

export interface StacksNetworkConfig {
  name: string;
  chainId: number;
  apiUrl: string;
  explorerUrl: string;
}

export interface EthereumNetworkConfig {
  name: string;
  chainId: number;
  explorerUrl: string;
  rpcUrl?: string;
}
