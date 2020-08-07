import {
  ExchangeInitialized
} from "../../generated/LoopringV3/LoopringV3";
import { getOrCreateExchange } from "../utils/helpers";

// - event: ExchangeInitialized(indexed uint256,indexed address,indexed address,address,bool)
//   handler: handleExchangeInitialized

export function handleExchangeInitialized(
  event: ExchangeInitialized
): void {
  let exchange = getOrCreateExchange(event.params.exchangeId.toString())

  exchange.address = event.params.exchangeAddress;
  exchange.onChainDataAvailability = event.params.onchainDataAvailability;
  exchange.owner = event.params.owner;
  exchange.operator = event.params.operator;

  exchange.save();
}
