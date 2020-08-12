import { log, BigInt } from "@graphprotocol/graph-ts";
import {
  Cloned,
  AccountCreated,
  BlockVerified
} from "../../generated/templates/ExchangeV3/ExchangeV3";
import { getOrCreateExchange, getOrCreateAccount } from "../utils/helpers";

// - event: AccountCreated(indexed address,indexed uint24,uint256,uint256)
//   handler: handleAccountCreated
// address indexed owner,
// uint24  indexed id,
// uint            pubKeyX,
// uint            pubKeyY

export function handleAccountCreated(event: AccountCreated): void {
  let accountId = event.address.toHexString().concat(BigInt.fromI32(event.params.id).toString());
  let account = getOrCreateAccount(accountId);

  account.exchange = event.address.toHexString();
  account.internalId = event.params.id;
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
