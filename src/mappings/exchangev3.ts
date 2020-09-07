import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  AccountCreated,
  AccountUpdated,
  BlockCommitted,
  BlockVerified,
  Revert,
  BlockFeeWithdrawn,
  BlockFinalized,
  TokenRegistered,
  OperatorChanged,
  ProtocolFeesUpdated,
  AddressWhitelistChanged,
  FeesUpdated,
  WithdrawalFailed,
  WithdrawalCompleted,
  WithdrawalRequested,
  DepositRequested,
  ExchangeV3
} from "../../generated/templates/ExchangeV3/ExchangeV3";
import {
  getOrCreateExchange,
  getOrCreateAccount,
  getOrCreateToken,
  getOrCreateUser,
  getOrCreateBlock,
  getOrCreateDepositRequestedEvent,
  getOrCreateWithdrawalFailedEvent,
  getOrCreateWithdrawalCompletedEvent,
  getOrCreateWithdrawalRequestedEvent,
  getOrCreateAccountTokenBalance,
  getBlockType,
  getToken
} from "../utils/helpers";
import {
  BLOCK_STATUS_REVERTED,
  BLOCK_STATUS_VERIFIED,
  BLOCK_STATUS_COMMITTED,
  BIGINT_ZERO
} from "../utils/constants";
import { DEFAULT_DECIMALS, toDecimal } from "../utils/decimals";

// - event: AccountCreated(indexed address,indexed uint24,uint256,uint256)
//   handler: handleAccountCreated
// address indexed owner,
// uint24  indexed id,
// uint            pubKeyX,
// uint            pubKeyY

export function handleAccountCreated(event: AccountCreated): void {
  let accountId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.id).toString());
  let account = getOrCreateAccount(accountId);
  let user = getOrCreateUser(event.params.owner.toHexString());

  account.exchange = event.address.toHexString();
  account.internalId = event.params.id;
  account.owner = user.id;
  account.pubKeyX = event.params.pubKeyX;
  account.pubKeyY = event.params.pubKeyY;

  account.save();
  user.save();
}

// - event: AccountUpdated(indexed address,indexed uint24,uint256,uint256)
//   handler: handleAccountUpdated

export function handleAccountUpdated(event: AccountUpdated): void {
  let accountId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.id).toString());
  let account = getOrCreateAccount(accountId);
  let user = getOrCreateUser(event.params.owner.toHexString());

  account.exchange = event.address.toHexString();
  account.owner = user.id;
  account.pubKeyX = event.params.pubKeyX;
  account.pubKeyY = event.params.pubKeyY;

  account.save();
  user.save();
}

// - event: BlockVerified(indexed uint256)
//   handler: handleBlockVerified

// - event: TokenRegistered(indexed address,indexed uint16)
//   handler: handleTokenRegistered

export function handleTokenRegistered(event: TokenRegistered): void {
  let tokenId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenId).toString());
  let token = getOrCreateToken(tokenId, event.params.token);

  token.internalId = event.params.tokenId;
  token.exchange = event.address.toHexString();

  token.save();
}

// - event: BlockCommitted(indexed uint256,indexed bytes32)
//   handler: handleBlockCommitted

export function handleBlockCommitted(event: BlockCommitted): void {
  let blockId = event.address
    .toHexString()
    .concat("-")
    .concat(event.params.blockIdx.toString());
  let block = getOrCreateBlock(blockId);
  let exchangeContract = ExchangeV3.bind(event.address);
  let blockData = exchangeContract.try_getBlock(event.params.blockIdx);

  if (!blockData.reverted) {
    block.merkleRoot = blockData.value.value0;
    block.blockTypeRaw = blockData.value.value3;
    block.blockType = getBlockType(block.blockTypeRaw);
    block.blockSize = blockData.value.value4;
    block.timestamp = blockData.value.value5;
    block.numDepositRequestsCommitted = blockData.value.value6;
    block.numWithdrawalRequestsCommitted = blockData.value.value7;
    block.blockFeeWithdrawn = blockData.value.value8;
    block.numWithdrawalsDistributed = blockData.value.value9;
  }

  block.exchange = event.address.toHexString();
  block.status = BLOCK_STATUS_COMMITTED;
  block.publicDataHash = event.params.publicDataHash;
  block.feesWithdrawn = BIGINT_ZERO;

  block.save();
}

// - event: BlockVerified(indexed uint256)
//   handler: handleBlockVerified

export function handleBlockVerified(event: BlockVerified): void {
  let blockId = event.address
    .toHexString()
    .concat("-")
    .concat(event.params.blockIdx.toString());
  let block = getOrCreateBlock(blockId);

  block.status = BLOCK_STATUS_VERIFIED;

  block.save();
}

// - event: Revert(indexed uint256)
//   handler: handleRevert

export function handleRevert(event: Revert): void {
  let blockId = event.address
    .toHexString()
    .concat("-")
    .concat(event.params.blockIdx.toString());
  let block = getOrCreateBlock(blockId);

  block.status = BLOCK_STATUS_REVERTED;

  block.save();
}

// - event: BlockFinalized(indexed uint256)
//   handler: handleBlockFinalized

export function handleBlockFinalized(event: BlockFinalized): void {
  let blockId = event.address
    .toHexString()
    .concat("-")
    .concat(event.params.blockIdx.toString());
  let block = getOrCreateBlock(blockId);
  let exchangeContract = ExchangeV3.bind(event.address);
  let blockData = exchangeContract.try_getBlock(event.params.blockIdx);

  if (!blockData.reverted) {
    block.merkleRoot = blockData.value.value0;
    block.blockTypeRaw = blockData.value.value3;
    block.blockType = getBlockType(block.blockTypeRaw);
    block.blockSize = blockData.value.value4;
    block.timestamp = blockData.value.value5;
    block.numDepositRequestsCommitted = blockData.value.value6;
    block.numWithdrawalRequestsCommitted = blockData.value.value7;
    block.blockFeeWithdrawn = blockData.value.value8;
    block.numWithdrawalsDistributed = blockData.value.value9;
  }

  block.save();
}

// - event: BlockFeeWithdrawn(indexed uint256,uint256)
//   handler: handleBlockFeeWithdrawn

export function handleBlockFeeWithdrawn(event: BlockFeeWithdrawn): void {
  let blockId = event.address
    .toHexString()
    .concat("-")
    .concat(event.params.blockIdx.toString());
  let block = getOrCreateBlock(blockId);

  block.feesWithdrawn = block.feesWithdrawn + event.params.amount;

  block.save();
}

// - event: OperatorChanged(indexed uint256,address,address)
//   handler: handleOperatorChanged

export function handleOperatorChanged(event: OperatorChanged): void {
  let exchange = getOrCreateExchange(event.address.toHexString());

  exchange.operator = event.params.newOperator;

  exchange.save();
}

// - event: ProtocolFeesUpdated(uint8,uint8,uint8,uint8)
//   handler: handleProtocolFeesUpdated

export function handleProtocolFeesUpdated(event: ProtocolFeesUpdated): void {
  let exchange = getOrCreateExchange(event.address.toHexString());

  exchange.makerFeeBips = event.params.makerFeeBips;
  exchange.takerFeeBips = event.params.takerFeeBips;

  exchange.save();
}

// - event: FeesUpdated(indexed uint256,uint256,uint256,uint256,uint256)
//   handler: handleFeesUpdated

export function handleFeesUpdated(event: FeesUpdated): void {
  let exchange = getOrCreateExchange(event.address.toHexString());

  exchange.accountCreationFee = event.params.accountCreationFeeETH;
  exchange.accountUpdateFee = event.params.accountUpdateFeeETH;
  exchange.depositFee = event.params.depositFeeETH;
  exchange.withdrawalFee = event.params.withdrawalFeeETH;

  exchange.save();
}

// - event: AddressWhitelistChanged(indexed uint256,address,address)
//   handler: handleAddressWhitelistChanged

export function handleAddressWhitelistChanged(
  event: AddressWhitelistChanged
): void {
  let exchange = getOrCreateExchange(event.address.toHexString());

  exchange.addressWhitelist = event.params.newAddressWhitelist;

  exchange.save();
}

// - event: DepositRequested(indexed uint256,indexed uint24,indexed uint16,uint96,uint256,uint256)
//   handler: handleDepositRequested

export function handleDepositRequested(event: DepositRequested): void {
  let eventId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(event.params.depositIdx.toString())
    .concat("-DEPOSIT-REQUEST");
  let transactionEvent = getOrCreateDepositRequestedEvent(eventId);
  let balanceId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  let accountBalance = getOrCreateAccountTokenBalance(balanceId);

  transactionEvent.exchange = event.address.toHexString();
  transactionEvent.account = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString());
  transactionEvent.token = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  transactionEvent.amount = event.params.amount;
  transactionEvent.pubKeyX = event.params.pubKeyX;
  transactionEvent.pubKeyY = event.params.pubKeyY;

  let token = getToken(transactionEvent.token);
  let decimals = token != null ? token.decimals : DEFAULT_DECIMALS;

  accountBalance.account = transactionEvent.account;
  accountBalance.token = transactionEvent.token;
  accountBalance.exchange = transactionEvent.exchange;
  accountBalance.totalDepositedRaw =
    accountBalance.totalDepositedRaw + transactionEvent.amount;
  accountBalance.totalDeposited = toDecimal(
    accountBalance.totalDepositedRaw,
    decimals
  );

  transactionEvent.save();
  accountBalance.save();
}

// - event: WithdrawalCompleted(indexed uint24,indexed uint16,address,uint96)
//   handler: handleWithdrawalCompleted

export function handleWithdrawalCompleted(event: WithdrawalCompleted): void {
  let eventId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(event.params.to.toHexString())
    .concat("-WITHDRAW-COMPLETED");
  let transactionEvent = getOrCreateWithdrawalCompletedEvent(eventId);
  let balanceId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  let accountBalance = getOrCreateAccountTokenBalance(balanceId);

  transactionEvent.exchange = event.address.toHexString();
  transactionEvent.account = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString());
  transactionEvent.token = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  transactionEvent.amount = event.params.amount;
  transactionEvent.to = event.params.to;

  let token = getToken(transactionEvent.token);
  let decimals = token != null ? token.decimals : DEFAULT_DECIMALS;

  accountBalance.account = transactionEvent.account;
  accountBalance.token = transactionEvent.token;
  accountBalance.exchange = transactionEvent.exchange;
  accountBalance.totalWithdrawnRaw =
    accountBalance.totalWithdrawnRaw + transactionEvent.amount;
  accountBalance.totalWithdrawn = toDecimal(
    accountBalance.totalWithdrawnRaw,
    decimals
  );

  transactionEvent.save();
  accountBalance.save();
}

// - event: WithdrawalFailed(indexed uint24,indexed uint16,address,uint96)
//   handler: handleWithdrawalFailed

export function handleWithdrawalFailed(event: WithdrawalFailed): void {
  let eventId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(event.params.to.toHexString())
    .concat("-WITHDRAW-FAILED");
  let transactionEvent = getOrCreateWithdrawalFailedEvent(eventId);

  transactionEvent.exchange = event.address.toHexString();
  transactionEvent.account = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString());
  transactionEvent.token = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  transactionEvent.amount = event.params.amount;
  transactionEvent.to = event.params.to;

  transactionEvent.save();
}

// - event: WithdrawalRequested(indexed uint256,indexed uint24,indexed uint16,uint96)
//   handler: handleWithdrawalRequested

export function handleWithdrawalRequested(event: WithdrawalRequested): void {
  let eventId = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString())
    .concat("-")
    .concat(event.params.withdrawalIdx.toString())
    .concat("-WITHDRAW-REQUEST");
  let transactionEvent = getOrCreateWithdrawalRequestedEvent(eventId);

  transactionEvent.exchange = event.address.toHexString();
  transactionEvent.account = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.accountID).toString());
  transactionEvent.token = event.address
    .toHexString()
    .concat("-")
    .concat(BigInt.fromI32(event.params.tokenID).toString());
  transactionEvent.amount = event.params.amount;

  transactionEvent.save();
}
