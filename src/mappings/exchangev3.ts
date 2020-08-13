import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  AccountCreated,
  AccountUpdated,
  BlockVerified,
  TokenRegistered
} from "../../generated/templates/ExchangeV3/ExchangeV3";
import {
  getOrCreateExchange,
  getOrCreateAccount,
  getOrCreateToken
} from "../utils/helpers";

// - event: AccountCreated(indexed address,indexed uint24,uint256,uint256)
//   handler: handleAccountCreated
// address indexed owner,
// uint24  indexed id,
// uint            pubKeyX,
// uint            pubKeyY

export function handleAccountCreated(event: AccountCreated): void {
  let accountId = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(event.params.id).toString());
  let account = getOrCreateAccount(accountId);

  account.exchange = event.address.toHexString();
  account.internalId = event.params.id;
  account.owner = event.params.owner;
  account.pubKeyX = event.params.pubKeyX;
  account.pubKeyY = event.params.pubKeyY;

  account.save();
}

// - event: AccountUpdated(indexed address,indexed uint24,uint256,uint256)
//   handler: handleAccountUpdated

export function handleAccountUpdated(event: AccountUpdated): void {
  let accountId = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(event.params.id).toString());
  let account = getOrCreateAccount(accountId);

  account.exchange = event.address.toHexString();
  account.owner = event.params.owner;
  account.pubKeyX = event.params.pubKeyX;
  account.pubKeyY = event.params.pubKeyY;

  account.save();
}

// - event: BlockVerified(indexed uint256)
//   handler: handleBlockVerified

export function handleBlockVerified(event: BlockVerified): void {
  log.warning("Handle Block Verified", []);
}

// - event: TokenRegistered(indexed address,indexed uint16)
//   handler: handleTokenRegistered

export function handleTokenRegistered(event: TokenRegistered): void {
  let tokenId = event.address
    .toHexString()
    .concat('-')
    .concat(BigInt.fromI32(event.params.tokenId).toString());
  let token = getOrCreateToken(tokenId, event.params.token);

  token.internalId = event.params.tokenId;
  token.exchange = event.address.toHexString();

  token.save();
}
