import { Transfer, Burn } from "../../generated/LRC/LRC";
import { getOrCreateUser } from "../utils/helpers";
import { toDecimal } from "../utils/decimals";

// - event: Transfer(indexed address,indexed address,uint256)
//   handler: handleLRCTransfer

export function handleLRCTransfer(event: Transfer): void {
  let fromUser = getOrCreateUser(event.params.from.toHexString());
  let toUser = getOrCreateUser(event.params.to.toHexString());

  fromUser.lrcBalanceRaw = fromUser.lrcBalanceRaw - event.params.value;
  toUser.lrcBalanceRaw = toUser.lrcBalanceRaw + event.params.value;

  fromUser.lrcBalance = toDecimal(fromUser.lrcBalanceRaw);
  toUser.lrcBalance = toDecimal(toUser.lrcBalanceRaw);

  fromUser.save();
  toUser.save();
}

// - event: Burn(indexed address,uint256)
//   handler: handleLRCBurn

export function handleLRCBurn(event: Burn): void {
  let user = getOrCreateUser(event.params.burner.toHexString());

  user.lrcBalanceRaw = user.lrcBalanceRaw - event.params.value;
  user.lrcBurnedRaw = user.lrcBalanceRaw + event.params.value;

  user.lrcBalance = toDecimal(user.lrcBalanceRaw);
  user.lrcBurned = toDecimal(user.lrcBurnedRaw);

  user.save();
}
