import {
  ClaimAdded as ClaimAddedEvent,
  Claimed as ClaimEvent,
} from "../generated/MultiDistributor2/MultiDistributor2";
import { ClaimAdded as ClaimAdded2, User as User2, Claim as Claim2 } from "../generated/schema";
import { BigDecimal } from "@graphprotocol/graph-ts";

const ZERO = BigDecimal.zero();

export function handleClaimAdded2(event: ClaimAddedEvent): void {
  let user = User2.load(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );

  let value = event.params.amount.toBigDecimal();

  if (user == null) {
    user = createUser(event);
  }

  user.totalAdded = user.totalAdded.plus(value);
  user.save();

  let claimer = event.params.claimer;
  let batchId = event.params.batchId;
  let claimAdded = new ClaimAdded2(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  claimAdded.txHash = event.transaction.hash;
  claimAdded.rewardToken = event.params.rewardToken
  claimAdded.tag = event.params.tag
  claimAdded.blockNumber = event.block.number.toI32();
  claimAdded.timestamp = event.block.timestamp.toI32();
  claimAdded.claimer = claimer;
  claimAdded.amount = value;
  claimAdded.batchId = batchId;
  claimAdded.epochTimestamp = event.params.epochTimestamp
  claimAdded.save();
}

export function handleClaim2(event: ClaimEvent): void {
  let user = User2.load(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );

  if (user == null) {
    return;
  }

  let claimer = event.params.claimer;
  let batchId = event.params.batchId;
  let value = event.params.amount.toBigDecimal();

  user.totalClaimed = user.totalClaimed.plus(value);
  user.save();

  let claim = new Claim2(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  claim.txHash = event.transaction.hash;
  claim.rewardToken = event.params.rewardToken
  claim.blockNumber = event.block.number.toI32();
  claim.timestamp = event.block.timestamp.toI32();
  claim.claimer = claimer;
  claim.amount = value;
  claim.batchId = batchId;
  claim.save();
}

export function createUser(event: ClaimAddedEvent): User2 {
  let user = new User2(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );
  user.address = event.params.claimer;
  user.rewardToken = event.params.rewardToken;
  user.totalAdded = ZERO;
  user.totalClaimed = ZERO;
  return user;
}
