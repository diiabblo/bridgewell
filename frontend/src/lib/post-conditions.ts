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
