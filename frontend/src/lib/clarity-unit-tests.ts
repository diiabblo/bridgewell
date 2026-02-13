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

export class TestRunner {
  private tests: ContractTest[] = [];
  
  addTest(contract: string, testCase: TestCase): void {
    const existing = this.tests.find(t => t.contractName === contract);
    if (existing) {
      existing.testCases.push(testCase);
    } else {
      this.tests.push({ contractName: contract, testCases: [testCase] });
    }
  }
}
