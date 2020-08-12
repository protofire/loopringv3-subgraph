import { ExchangeInitialized } from "../../generated/LoopringV3/LoopringV3";
import { ExchangeProxy } from "../../generated/LoopringV3/ExchangeProxy";
import { ExchangeV3 } from "../../generated/templates";
import { getOrCreateExchange } from "../utils/helpers";

// - event: ExchangeInitialized(indexed uint256,indexed address,indexed address,address,bool)
//   handler: handleExchangeInitialized

export function handleExchangeInitialized(event: ExchangeInitialized): void {
  let exchange = getOrCreateExchange(event.params.exchangeAddress.toHexString());

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
