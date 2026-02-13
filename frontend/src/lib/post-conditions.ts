// Transaction Post-Conditions
// Provides post-condition builders for Stacks transactions

export type PostConditionType = 'stx' | 'ft' | 'nft';

export type PostConditionMode = 'allow' | 'deny';

export type PostConditionComparator = 
  | 'eq' 
  | 'gt' 
  | 'gte' 
  | 'lt' 
  | 'lte';

export interface PostConditionBase {
  type: PostConditionType;
  comparator: PostConditionComparator;
  mode: PostConditionMode;
}

export interface STXPostCondition extends PostConditionBase {
  type: 'stx';
  amount: bigint;
  sender?: string;
}

export interface FTPostCondition extends PostConditionBase {
  type: 'ft';
  amount: bigint;
  assetId: string;
  sender?: string;
}

export interface NFTPostCondition extends PostConditionBase {
  type: 'nft';
  tokenId: bigint;
  assetId: string;
  sender?: string;
}

export type AnyPostCondition = STXPostCondition | FTPostCondition | NFTPostCondition;

export class PostConditionBuilder {
  private conditions: AnyPostCondition[] = [];
  
  addSTX(
    amount: bigint,
    comparator: PostConditionComparator,
    sender?: string
  ): this {
    this.conditions.push({ type: 'stx', amount, comparator, mode: 'allow', sender });
    return this;
  }
}

  addFT(
    assetId: string,
    amount: bigint,
    comparator: PostConditionComparator,
    sender?: string
  ): this {
    this.conditions.push({ type: 'ft', assetId, amount, comparator, mode: 'allow', sender });
    return this;
  }

  addNFT(
    assetId: string,
    tokenId: bigint,
    sender?: string
  ): this {
    this.conditions.push({ type: 'nft', assetId, tokenId, comparator: 'eq', mode: 'allow', sender });
    return this;
  }

  build(): AnyPostCondition[] {
    return this.conditions;
  }
}

export function createPostCondition(
  type: PostConditionType,
  comparator: PostConditionComparator,
  amount: bigint
): AnyPostCondition {
  return { type, comparator, amount, mode: 'allow' };
}

export function serializePostConditions(conditions: AnyPostCondition[]): string {
  return JSON.stringify(conditions);
}

export function deserializePostConditions(data: string): AnyPostCondition[] {
  return JSON.parse(data);
}

export function validatePostCondition(condition: AnyPostCondition): boolean {
  if (!condition.type) return false;
  if (!condition.comparator) return false;
  return true;
}

export function getPostConditionSummary(condition: AnyPostCondition): string {
  return \`\${condition.type}: \${condition.comparator} \${condition.amount}\`;
}

export interface PostConditionGroup {
  conditions: AnyPostCondition[];
  message?: string;
}

export function createPostConditionGroup(conditions: AnyPostCondition[]): PostConditionGroup {
  return { conditions };
}

export function filterConditionsByType(
  conditions: AnyPostCondition[],
  type: PostConditionType
): AnyPostCondition[] {
  return conditions.filter(c => c.type === type);
}

export const POST_CONDITION_ERRORS = {
  INVALID_TYPE: 'Invalid post-condition type',
  INVALID_COMPARATOR: 'Invalid comparator',
  MISSING_AMOUNT: 'Amount is required',
} as const;

export class PostConditionManager {
  private conditions: AnyPostCondition[] = [];
  
  add(condition: AnyPostCondition): void {
    this.conditions.push(condition);
  }
  
  getAll(): AnyPostCondition[] {
    return this.conditions;
  }
  
  clear(): void {
    this.conditions = [];
  }
}

export function combinePostConditions(
  groups: PostConditionGroup[]
): AnyPostCondition[] {
  return groups.flatMap(g => g.conditions);
}
