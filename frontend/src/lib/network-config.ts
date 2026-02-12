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

// Ethereum network configurations
export const ETHEREUM_NETWORKS: Record<NetworkEnvironment, EthereumNetworkConfig> = {
  mainnet: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    explorerUrl: 'https://etherscan.io',
    rpcUrl: 'https://eth.llamarpc.com',
  },
  testnet: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    explorerUrl: 'https://sepolia.etherscan.io',
    rpcUrl: 'https://rpc.sepolia.org',
  },
};

// Current network state management
let currentNetwork: NetworkEnvironment = 'testnet';

/**
 * Get the current active network environment
 */
export function getCurrentNetwork(): NetworkEnvironment {
  return currentNetwork;
}

/**
 * Set the current active network environment
 */
export function setCurrentNetwork(network: NetworkEnvironment): void {
  const previousNetwork = currentNetwork;
  currentNetwork = network;
  
  // Persist to localStorage for next session
  if (typeof window !== 'undefined') {
    localStorage.setItem('bridgewell_network', network);
  }
  
  // Notify listeners of network change
  if (previousNetwork !== network) {
    networkListeners.forEach(listener => listener(network));
  }
}

/**
 * Initialize network from localStorage or default to testnet
 */
export function initializeNetwork(): void {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('bridgewell_network');
    if (saved === 'mainnet' || saved === 'testnet') {
      currentNetwork = saved;
    }
  }
}

/**
 * Get Stacks network configuration for current environment
 */
export function getStacksConfig(): StacksNetworkConfig {
  return STACKS_NETWORKS[currentNetwork];
}

/**
 * Get Ethereum network configuration for current environment
 */
export function getEthereumConfig(): EthereumNetworkConfig {
  return ETHEREUM_NETWORKS[currentNetwork];
}

/**
 * Detect network based on Ethereum chain ID
 */
export function detectNetworkFromChainId(chainId: number): NetworkEnvironment | null {
  if (chainId === 1) return 'mainnet';
  if (chainId === 11155111) return 'testnet';
  return null;
}

/**
 * Network change event listeners
 */
type NetworkChangeListener = (network: NetworkEnvironment) => void;
const networkListeners: Set<NetworkChangeListener> = new Set();

/**
 * Subscribe to network changes
 */
export function onNetworkChange(listener: NetworkChangeListener): () => void {
  networkListeners.add(listener);
  return () => networkListeners.delete(listener);
}

/**
 * Validate if a network environment is supported
 */
export function isValidNetwork(network: string): network is NetworkEnvironment {
  return network === 'mainnet' || network === 'testnet';
}

/**
 * Get network explorer URL for a transaction
 */
export function getTransactionUrl(txId: string, chain: 'stacks' | 'ethereum'): string {
  if (chain === 'stacks') {
    const config = getStacksConfig();
    return `${config.explorerUrl}/txid/${txId}`;
  } else {
    const config = getEthereumConfig();
    return `${config.explorerUrl}/tx/${txId}`;
  }
}

/**
 * Get network explorer URL for an address
 */
export function getAddressUrl(address: string, chain: 'stacks' | 'ethereum'): string {
  if (chain === 'stacks') {
    const config = getStacksConfig();
    return `${config.explorerUrl}/address/${address}`;
  } else {
    const config = getEthereumConfig();
    return `${config.explorerUrl}/address/${address}`;
  }
}
