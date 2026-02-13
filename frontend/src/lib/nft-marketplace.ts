// SIP-009 NFT Marketplace Integration
// Provides marketplace functionality for SIP-009 NFTs

export interface NFTListing {
  id: string;
  nftContract: string;
  tokenId: bigint;
  seller: string;
  price: bigint;
  listed: boolean;
}

export interface NFTOffer {
  id: string;
  nftContract: string;
  tokenId: bigint;
  buyer: string;
  price: bigint;
  accepted: boolean;
}

export interface MarketplaceConfig {
  marketplaceContract: string;
  royaltyPercent: number;
}

export class NFTMarketplace {
  private config: MarketplaceConfig;
  
  constructor(config: MarketplaceConfig) {
    this.config = config;
  }
  
  getRoyalty(): number {
    return this.config.royaltyPercent;
  }
}

export interface ListingRequest {
  nftContract: string;
  tokenId: bigint;
  price: bigint;
}

export interface OfferRequest {
  nftContract: string;
  tokenId: bigint;
  price: bigint;
}

export function calculateRoyalty(price: bigint, percent: number): bigint {
  return (price * BigInt(percent)) / 100n;
}

export function calculateSellerProceeds(price: bigint, percent: number): bigint {
  return price - calculateRoyalty(price, percent);
}

export class ListingManager {
  private listings: Map<string, NFTListing> = new Map();
  
  add(listing: NFTListing): void {
    this.listings.set(listing.id, listing);
  }
  
  get(id: string): NFTListing | undefined {
    return this.listings.get(id);
  }
}

export function validateListing(listing: ListingRequest): boolean {
  if (!listing.nftContract) return false;
  if (listing.price <= 0n) return false;
  return true;
}

export interface MarketplaceFilters {
  contract?: string;
  minPrice?: bigint;
  maxPrice?: bigint;
  seller?: string;
}

export function filterListings(
  listings: NFTListing[],
  filters: MarketplaceFilters
): NFTListing[] {
  return listings.filter(l => {
    if (filters.contract && l.nftContract !== filters.contract) return false;
    if (filters.minPrice && l.price < filters.minPrice) return false;
    if (filters.maxPrice && l.price > filters.maxPrice) return false;
    if (filters.seller && l.seller !== filters.seller) return false;
    return true;
  });
}

export interface SaleEvent {
  listingId: string;
  buyer: string;
  seller: string;
  price: bigint;
  timestamp: Date;
}

export class MarketplaceEvents {
  private listeners: Array<(event: SaleEvent) => void> = [];
  
  onSale(fn: (event: SaleEvent) => void): void {
    this.listeners.push(fn);
  }
  
  emit(event: SaleEvent): void {
    this.listeners.forEach(fn => fn(event));
  }
}
