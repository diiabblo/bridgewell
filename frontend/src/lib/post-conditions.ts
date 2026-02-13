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
