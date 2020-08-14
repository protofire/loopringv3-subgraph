import { User } from "../../../generated/schema";
import { BIGINT_ZERO, BIGDECIMAL_ZERO } from "../constants";

export function getOrCreateUser(
  id: String,
  createIfNotFound: boolean = true
): User {
  let user = User.load(id);

  if (user == null && createIfNotFound) {
    user = new User(id);
    user.lrcBalance = BIGDECIMAL_ZERO;
    user.lrcBalanceRaw = BIGINT_ZERO;
    user.lrcBurned = BIGDECIMAL_ZERO;
    user.lrcBurnedRaw = BIGINT_ZERO;
  }

  return user as User;
}
