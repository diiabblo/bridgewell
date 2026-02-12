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

// Stacks network configurations
export const STACKS_NETWORKS: Record<NetworkEnvironment, StacksNetworkConfig> = {
  mainnet: {
    name: 'Stacks Mainnet',
    chainId: 1,
    apiUrl: 'https://api.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
  },
  testnet: {
    name: 'Stacks Testnet',
    chainId: 2147483648,
    apiUrl: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so/?chain=testnet',
  },
};
