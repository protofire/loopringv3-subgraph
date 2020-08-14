import { Exchange } from "../../../generated/schema";
import { UniversalRegistry } from "../../../generated/LoopringV3/UniversalRegistry";
import { LoopringV3 } from "../../../generated/LoopringV3/LoopringV3";
import {
  DEFAULT_REGISTRY_ADDRESS,
  LOOPRING_PROTOCOL_ADDRESS,
  BIGDECIMAL_ZERO,
  BIGINT_ZERO
} from "../constants";
import { Address } from "@graphprotocol/graph-ts";

export function getOrCreateExchange(
  id: String,
  createIfNotFound: boolean = true
): Exchange {
  let exchange = Exchange.load(id);

  if (exchange == null && createIfNotFound) {
    exchange = new Exchange(id);
    exchange.exchangeStake = BIGDECIMAL_ZERO;
    exchange.exchangeStakeRaw = BIGINT_ZERO;
    exchange.protocolStake = BIGDECIMAL_ZERO;
    exchange.protocolStakeRaw = BIGINT_ZERO;
    exchange.totalExchangeStakeBurned = BIGDECIMAL_ZERO;
    exchange.totalExchangeStakeBurnedRaw = BIGINT_ZERO;
    exchange.totalExchangeStakeDeposited = BIGDECIMAL_ZERO;
    exchange.totalExchangeStakeDepositedRaw = BIGINT_ZERO;
    exchange.totalExchangeStakeWithdrawn = BIGDECIMAL_ZERO;
    exchange.totalExchangeStakeWithdrawnRaw = BIGINT_ZERO;
    exchange.totalProtocolStakeDeposited = BIGDECIMAL_ZERO;
    exchange.totalProtocolStakeDepositedRaw = BIGINT_ZERO;
    exchange.totalProtocolStakeWithdrawn = BIGDECIMAL_ZERO;
    exchange.totalProtocolStakeWithdrawnRaw = BIGINT_ZERO;
  }

  return exchange as Exchange;
}

export function getUniversalRegistryContract(): UniversalRegistry {
  let protocol = LoopringV3.bind(Address.fromString(LOOPRING_PROTOCOL_ADDRESS));
  let registryAddress = protocol.try_universalRegistry();
  let registryContract = registryAddress.reverted
    ? UniversalRegistry.bind(Address.fromString(DEFAULT_REGISTRY_ADDRESS))
    : UniversalRegistry.bind(registryAddress.value);
  return registryContract;
}
