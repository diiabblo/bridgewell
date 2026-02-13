// Clarity Contract Unit Tests
// Provides testing utilities for Clarity smart contracts

export interface TestCase {
  name: string;
  passed: boolean;
  error?: string;
}

export interface ContractTest {
  contractName: string;
  testCases: TestCase[];
}
