import { Clarinet, Tx, Chain, Account, types } from 'https://deno.land/x/clarinet@v1.0.0/index.ts';

Clarinet.test({
  name: "Can initiate bridge transfer",
  async fn(chain: Chain, accounts: Map<string, Account>) {
    const deployer = accounts.get('deployer')!;
    let block = chain.mineBlock([
      Tx.contractCall('bridge-core', 'initiate-bridge-transfer', 
        [types.uint(10000), types.buff('0x1234567890123456789012345678901234567890')], 
        deployer.address)
    ]);
    block.receipts[0].result.expectOk().expectUint(0);
  },
});
