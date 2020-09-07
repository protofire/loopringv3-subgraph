## Loopring 3.1 Subgraph

### Entities

#### Exchange

The Exchange entity gathers all data related to specific Exchanges. It's created by events triggered on the LoopringV3 contract, which in turn start to dynamically index the events of said Exchange.

This is the most extensive entity in the subgraph because it holds all relationships and metadata for a given exchange. The exchange internal ID within the LoopringV3 contract, linked ethereum addresses (such as the proxy, implementation and whitelisting contracts), owner address, operator address, fee settings, as well as exchange and protocol stakes, and aggregated data regarding those fields. It also has links to all entities related to the Exchange, such as Accounts, Blocks and Tokens.

```graphql
type Exchange @entity {
  "Address of the exchange"
  id: ID!

  "Internal ID of the exchange in the loopring protocol"
  internalId: BigInt!

  "Address of the proxy. It matches with the ID since exchanges use a proxy structure for upgrades"
  proxyAddress: Bytes!

  "Address of the implementation contract"
  implementationAddress: Bytes

  "AddressWhitelist contract address"
  addressWhitelist: Bytes

  "Ethereum address of the owner"
  owner: Bytes!

  "Ethereum address of the operator"
  operator: Bytes!

  "Whether or not this exchange has on chain data"
  onChainDataAvailability: Boolean!

  takerFeeBips: Int!

  makerFeeBips: Int!

  accountCreationFee: BigInt!

  accountUpdateFee: BigInt!

  depositFee: BigInt!

  withdrawalFee: BigInt!

  exchangeStake: BigDecimal!

  exchangeStakeRaw: BigInt!

  protocolStake: BigDecimal!

  protocolStakeRaw: BigInt!

  totalExchangeStakeBurned: BigDecimal!

  totalExchangeStakeBurnedRaw: BigInt!

  totalExchangeStakeDeposited: BigDecimal!

  totalExchangeStakeDepositedRaw: BigInt!

  totalExchangeStakeWithdrawn: BigDecimal!

  totalExchangeStakeWithdrawnRaw: BigInt!

  totalProtocolStakeDeposited: BigDecimal!

  totalProtocolStakeDepositedRaw: BigInt!

  totalProtocolStakeWithdrawn: BigDecimal!

  totalProtocolStakeWithdrawnRaw: BigInt!

  accounts: [Account!]! @derivedFrom(field: "exchange")

  tokens: [Token!]! @derivedFrom(field: "exchange")

  blocks: [Block!]! @derivedFrom(field: "exchange")

  transactionEvents: [OnChainTransactionEvent!]! @derivedFrom(field: "exchange")
}
```

#### User

The User entity holds the current LRC balance for an Ethereum address, as well as the account that the user owns (if any), and the total LRC that it has burned.

```graphql
type User @entity {
  "Ethereum address"
  id: ID!

  "Related Loopring account. Might not exist if the user only traded LRC but never used loopring."
  account: Account @derivedFrom(field: "owner")

  lrcBalanceRaw: BigInt!

  lrcBalance: BigDecimal!

  lrcBurnedRaw: BigInt!

  lrcBurned: BigDecimal!
}
```

#### Account

The Account entity holds some metadata from the account (such as the Exchange and the internal ID within that Exchange), as well as the different token balances of said account, all the transactionEvents where this account appears, the user that owns said account, and the public key values.

```graphql
type Account @entity {
  "Exchange address + internal ID"
  id: ID!

  exchange: Exchange!

  "Internal ID of the account within the Exchange scope"
  internalId: Int!

  "X Value of the public key"
  pubKeyX: BigInt!

  "Y Value of the public key"
  pubKeyY: BigInt!

  "User that owns the account"
  owner: User!

  "List of balances for this account within the exchange"
  balances: [AccountTokenBalance!]! @derivedFrom(field: "account")

  transactionEvents: [OnChainTransactionEvent!]! @derivedFrom(field: "account")
}
```

#### Token

The Token entity holds metadata for a token (address, decimals, name and symbol), as well as scope data, like the exchange and internal ID within the exchange, while also tracking all the transactionEvents that are related to that token.

```graphql
type Token @entity {
  "Exchange Address + internal ID"
  id: ID!

  exchange: Exchange!

  "Internal ID of the token within the exchange"
  internalId: Int!

  address: Bytes!

  decimals: Int!

  name: String!

  symbol: String!

  transactionEvents: [OnChainTransactionEvent!]! @derivedFrom(field: "token")
}
```

#### AccountTokenBalance

Auxiliary entity to track the total deposited and withdrawn amounts of a specific token on a specific account.
The Account "balance" can't be properly tracked by comparing the deposited amount and the withdrawn amount, since within an Exchange trades can happen, and since trades happen directly on the sidechain, there's no exact data from then within the L1 blockchain.

```graphql
type AccountTokenBalance @entity {
  "Exchange address + Account internal ID + token internal ID. Withdrawn amounts can be greater than deposits since tokens will be exchanged. We can't track trades as they are not part of the L1."
  id: ID!

  exchange: Exchange!

  account: Account!

  token: Token!

  "Total amount of this token deposited to the account"
  totalDeposited: BigDecimal!

  totalDepositedRaw: BigInt!

  "Total amount of this token withdrawn from the account"
  totalWithdrawn: BigDecimal!

  totalWithdrawnRaw: BigInt!
}
```

#### Block

The Block entity holds all data available for a given block committed to the sidechain. Most of the fields reflect directly the fields on the blockchain.

```graphql
type Block @entity {
  "Exchange ID + Block number"
  id: ID!

  exchange: Exchange!

  status: BlockStatus!

  publicDataHash: Bytes!

  feesWithdrawn: BigInt!

  merkleRoot: Bytes

  blockType: BlockType

  blockTypeRaw: Int

  blockSize: Int

  timestamp: BigInt

  numDepositRequestsCommitted: BigInt

  numWithdrawalRequestsCommitted: BigInt

  blockFeeWithdrawn: Boolean

  numWithdrawalsDistributed: Int
}
```

#### Circuit

The Circuit entity holds the data of any registered or disabled Circuit for the BlockVerifier contract.

```graphql
type Circuit @entity {
  id: ID!

  blockType: BlockType!

  blockTypeRaw: Int!

  onchainDataAvailability: Boolean!

  blockSize: Int!

  blockVersion: Int!

  enabled: Boolean!
}
```
