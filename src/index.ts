export {
  handleExchangeInitialized,
  handleExchangeStakeBurned,
  handleExchangeStakeDeposited,
  handleExchangeStakeWithdrawn,
  handleProtocolFeeStakeDeposited,
  handleProtocolFeeStakeWithdrawn
} from "./mappings/loopringv3";

export {
  handleAccountCreated,
  handleAccountUpdated,
  handleBlockCommitted,
  handleBlockVerified,
  handleRevert,
  handleBlockFinalized,
  handleBlockFeeWithdrawn,
  handleTokenRegistered,
  handleOperatorChanged,
  handleProtocolFeesUpdated
} from "./mappings/exchangev3";

export {
  handleLRCTransfer,
  handleLRCBurn
} from "./mappings/lrcv2";
