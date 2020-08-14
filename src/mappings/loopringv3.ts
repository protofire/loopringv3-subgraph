import {
  ExchangeInitialized,
  ExchangeStakeBurned,
  ExchangeStakeDeposited,
  ExchangeStakeWithdrawn,
  ProtocolFeeStakeDeposited,
  ProtocolFeeStakeWithdrawn
} from "../../generated/LoopringV3/LoopringV3";
import { ExchangeProxy } from "../../generated/LoopringV3/ExchangeProxy";
import { ExchangeV3 } from "../../generated/templates";
import {
  getOrCreateExchange,
  getUniversalRegistryContract
} from "../utils/helpers";
import { BIGINT_ONE } from "../utils/constants";
import { toDecimal } from "../utils/decimals";
import { log } from "@graphprotocol/graph-ts";

// - event: ExchangeInitialized(indexed uint256,indexed address,indexed address,address,bool)
//   handler: handleExchangeInitialized

export function handleExchangeInitialized(event: ExchangeInitialized): void {
  let exchange = getOrCreateExchange(
    event.params.exchangeAddress.toHexString()
  );

  exchange.onChainDataAvailability = event.params.onchainDataAvailability;
  exchange.owner = event.params.owner;
  exchange.operator = event.params.operator;
  exchange.proxyAddress = event.params.exchangeAddress;
  exchange.internalId = event.params.exchangeId;

  let proxy = ExchangeProxy.bind(event.params.exchangeAddress);
  let implementation = proxy.try_implementation();

  exchange.implementationAddress = implementation.reverted
    ? null
    : implementation.value;

  exchange.save();

  ExchangeV3.create(event.params.exchangeAddress);
}

// - event: ExchangeStakeBurned(indexed uint256,uint256)
//   handler: handleExchangeStakeBurned

export function handleExchangeStakeBurned(event: ExchangeStakeBurned): void {
  let registryContract = getUniversalRegistryContract();
  let exchangeAddress = registryContract.try_exchanges(
    event.params.exchangeId - BIGINT_ONE
  );
  if (exchangeAddress.reverted) {
    log.error(
      "Exchange address couldn't be queried for ExchangeStakeBurned",
      []
    );
  } else {
    let exchange = getOrCreateExchange(exchangeAddress.value.toHexString());

    exchange.exchangeStakeRaw = exchange.exchangeStakeRaw - event.params.amount;
    exchange.exchangeStake = toDecimal(exchange.exchangeStakeRaw);

    exchange.totalExchangeStakeBurnedRaw =
      exchange.totalExchangeStakeBurnedRaw + event.params.amount;
    exchange.totalExchangeStakeBurned = toDecimal(
      exchange.totalExchangeStakeBurnedRaw
    );

    exchange.save();
  }
}

// - event: ExchangeStakeDeposited(indexed uint256,uint256)
//   handler: handleExchangeStakeDeposited

export function handleExchangeStakeDeposited(
  event: ExchangeStakeDeposited
): void {
  let registryContract = getUniversalRegistryContract();
  let exchangeAddress = registryContract.try_exchanges(
    event.params.exchangeId - BIGINT_ONE
  );
  if (exchangeAddress.reverted) {
    log.error(
      "Exchange address couldn't be queried for ExchangeStakeDeposited",
      []
    );
  } else {
    let exchange = getOrCreateExchange(exchangeAddress.value.toHexString());

    exchange.exchangeStakeRaw = exchange.exchangeStakeRaw + event.params.amount;
    exchange.exchangeStake = toDecimal(exchange.exchangeStakeRaw);

    exchange.totalExchangeStakeDepositedRaw =
      exchange.totalExchangeStakeDepositedRaw + event.params.amount;
    exchange.totalExchangeStakeDeposited = toDecimal(
      exchange.totalExchangeStakeDepositedRaw
    );

    exchange.save();
  }
}

// - event: ExchangeStakeWithdrawn(indexed uint256,uint256)
//   handler: handleExchangeStakeWithdrawn

export function handleExchangeStakeWithdrawn(
  event: ExchangeStakeWithdrawn
): void {
  let registryContract = getUniversalRegistryContract();
  let exchangeAddress = registryContract.try_exchanges(
    event.params.exchangeId - BIGINT_ONE
  );
  if (exchangeAddress.reverted) {
    log.error(
      "Exchange address couldn't be queried for ExchangeStakeWithdrawn",
      []
    );
  } else {
    let exchange = getOrCreateExchange(exchangeAddress.value.toHexString());

    exchange.exchangeStakeRaw = exchange.exchangeStakeRaw - event.params.amount;
    exchange.exchangeStake = toDecimal(exchange.exchangeStakeRaw);

    exchange.totalExchangeStakeWithdrawnRaw =
      exchange.totalExchangeStakeWithdrawnRaw + event.params.amount;
    exchange.totalExchangeStakeWithdrawn = toDecimal(
      exchange.totalExchangeStakeWithdrawnRaw
    );

    exchange.save();
  }
}

// - event: ProtocolFeeStakeDeposited(indexed uint256,uint256)
//   handler: handleProtocolFeeStakeDeposited

export function handleProtocolFeeStakeDeposited(
  event: ProtocolFeeStakeDeposited
): void {
  let registryContract = getUniversalRegistryContract();
  let exchangeAddress = registryContract.try_exchanges(
    event.params.exchangeId - BIGINT_ONE
  );
  if (exchangeAddress.reverted) {
    log.error(
      "Exchange address couldn't be queried for ProtocolFeeStakeDeposited",
      []
    );
  } else {
    let exchange = getOrCreateExchange(exchangeAddress.value.toHexString());

    exchange.protocolStakeRaw = exchange.protocolStakeRaw + event.params.amount;
    exchange.protocolStake = toDecimal(exchange.protocolStakeRaw);

    exchange.totalProtocolStakeDepositedRaw =
      exchange.totalProtocolStakeDepositedRaw + event.params.amount;
    exchange.totalProtocolStakeDeposited = toDecimal(
      exchange.totalProtocolStakeDepositedRaw
    );

    exchange.save();
  }
}

// - event: ProtocolFeeStakeWithdrawn(indexed uint256,uint256)
//   handler: handleProtocolFeeStakeWithdrawn

export function handleProtocolFeeStakeWithdrawn(
  event: ProtocolFeeStakeWithdrawn
): void {
  let registryContract = getUniversalRegistryContract();
  let exchangeAddress = registryContract.try_exchanges(
    event.params.exchangeId - BIGINT_ONE
  );
  if (exchangeAddress.reverted) {
    log.error(
      "Exchange address couldn't be queried for ProtocolFeeStakeWithdrawn",
      []
    );
  } else {
    let exchange = getOrCreateExchange(exchangeAddress.value.toHexString());

    exchange.protocolStakeRaw = exchange.protocolStakeRaw - event.params.amount;
    exchange.protocolStake = toDecimal(exchange.protocolStakeRaw);

    exchange.totalProtocolStakeWithdrawnRaw =
      exchange.totalProtocolStakeWithdrawnRaw + event.params.amount;
    exchange.totalProtocolStakeWithdrawn = toDecimal(
      exchange.totalProtocolStakeWithdrawnRaw
    );

    exchange.save();
  }
}
