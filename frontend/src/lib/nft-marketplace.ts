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
