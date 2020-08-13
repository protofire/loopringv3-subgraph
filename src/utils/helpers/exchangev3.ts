import { Account, Token } from "../../../generated/schema";
import { ERC20 } from "../../../generated/templates/ERC20/ERC20";
import { Address } from "@graphprotocol/graph-ts";
import { DEFAULT_DECIMALS } from "../../utils/decimals";

export function getOrCreateAccount(
  id: String,
  createIfNotFound: boolean = true
): Account {
  let account = Account.load(id);

  if (account == null && createIfNotFound) {
    account = new Account(id);
  }

  return account as Account;
}

export function getOrCreateToken(
  tokenId: String,
  tokenAddress: Address
): Token {
  let token = Token.load(tokenId);

  if (token == null) {
    token = new Token(tokenId);
    token.address = tokenAddress;

    let erc20Token = ERC20.bind(tokenAddress);

    let tokenDecimals = erc20Token.try_decimals();
    let tokenName = erc20Token.try_name();
    let tokenSymbol = erc20Token.try_symbol();

    token.decimals = !tokenDecimals.reverted
      ? tokenDecimals.value
      : DEFAULT_DECIMALS;
    token.name = !tokenName.reverted ? tokenName.value : "";
    token.symbol = !tokenSymbol.reverted ? tokenSymbol.value : "";
  }

  return token as Token;
}
