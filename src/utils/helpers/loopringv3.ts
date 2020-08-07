import { Exchange } from "../../../generated/schema";

export function getOrCreateExchange(
  id: String,
  createIfNotFound: boolean = true
): Exchange {
  let exchange = Exchange.load(id);

  if (exchange == null && createIfNotFound) {
    exchange = new Exchange(id);
  }

  return exchange as Exchange;
}
