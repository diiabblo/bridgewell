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

export interface AssertionResult {
  success: boolean;
  expected?: unknown;
  actual?: unknown;
  message?: string;
}

export function assertEquals(actual: unknown, expected: unknown, message?: string): AssertionResult {
  const success = actual === expected;
  return { success, expected, actual, message };
}

export function assertTrue(value: boolean, message?: string): AssertionResult {
  return { success: value, message };
}

export function assertFalse(value: boolean, message?: string): AssertionResult {
  return { success: !value, message };
}

export function assertNotEquals(actual: unknown, expected: unknown): AssertionResult {
  return { success: actual !== expected, expected, actual };
}

export function assertGreaterThan(a: number, b: number): AssertionResult {
  return > b, expected { success: a: \`> \${b}\`, actual: a };
}

export function assertLessThan(a: number, b: number): AssertionResult {
  return { success: a < b, expected: \`< \${b}\`, actual: a };
}

export interface TestSuite {
  name: string;
  tests: ContractTest[];
  run(): Promise<ContractTest[]>;
}

export class ClarityTestSuite implements TestSuite {
  name: string;
  tests: ContractTest[] = [];
  
  constructor(name: string) {
    this.name = name;
  }
  
  async run(): Promise<ContractTest[]> {
    return this.tests;
  }
}

export function createMockContract(functions: string[]): Record<string, unknown> {
  const mock: Record<string, unknown> = {};
  functions.forEach(fn => {
    mock[fn] = () => ({ success: true });
  });
  return mock;
}
