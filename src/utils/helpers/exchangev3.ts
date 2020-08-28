import {
  Account,
  Token,
  Block,
  DepositRequestedEvent,
  WithdrawalCompletedEvent,
  WithdrawalFailedEvent,
  WithdrawalRequestedEvent,
  AccountTokenBalance
} from "../../../generated/schema";
import { ERC20 } from "../../../generated/templates/ERC20/ERC20";
import { Address } from "@graphprotocol/graph-ts";
import { DEFAULT_DECIMALS } from "../../utils/decimals";
import { BIGINT_ZERO } from "../../utils/constants";

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

export function getOrCreateAccountTokenBalance(
  id: String,
  createIfNotFound: boolean = true
): AccountTokenBalance {
  let balance = AccountTokenBalance.load(id);

  if (balance == null && createIfNotFound) {
    balance = new AccountTokenBalance(id);
    balance.balanceRaw = BIGINT_ZERO;
    balance.totalDepositedRaw = BIGINT_ZERO;
    balance.totalWithdrawnRaw = BIGINT_ZERO;
  }

  return balance as AccountTokenBalance;
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

export function getOrCreateBlock(
  id: String,
  createIfNotFound: boolean = true
): Block {
  let block = Block.load(id);

  if (block == null && createIfNotFound) {
    block = new Block(id);
  }

  return block as Block;
}

export function getOrCreateDepositRequestedEvent(
  id: String,
  createIfNotFound: boolean = true
): DepositRequestedEvent {
  let event = DepositRequestedEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new DepositRequestedEvent(id);
  }

  return event as DepositRequestedEvent;
}

export function getOrCreateWithdrawalRequestedEvent(
  id: String,
  createIfNotFound: boolean = true
): WithdrawalRequestedEvent {
  let event = WithdrawalRequestedEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new WithdrawalRequestedEvent(id);
  }

  return event as WithdrawalRequestedEvent;
}

export function getOrCreateWithdrawalFailedEvent(
  id: String,
  createIfNotFound: boolean = true
): WithdrawalFailedEvent {
  let event = WithdrawalFailedEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new WithdrawalFailedEvent(id);
  }

  return event as WithdrawalFailedEvent;
}

export function getOrCreateWithdrawalCompletedEvent(
  id: String,
  createIfNotFound: boolean = true
): WithdrawalCompletedEvent {
  let event = WithdrawalCompletedEvent.load(id);

  if (event == null && createIfNotFound) {
    event = new WithdrawalCompletedEvent(id);
  }

  return event as WithdrawalCompletedEvent;
}
