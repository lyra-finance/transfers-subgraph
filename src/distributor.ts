import {
  ClaimAdded as ClaimAddedEvent,
  ClaimRemoved as ClaimRemovedEvent,
  Claimed as ClaimEvent,
} from "../generated/MultiDistributor/MultiDistributor";
import { ClaimAdded, User, Claim, ClaimRemoved } from "../generated/schema";
import { BigInt, BigDecimal } from "@graphprotocol/graph-ts";

const ZERO = BigDecimal.zero();

export function handleClaimAdded(event: ClaimAddedEvent): void {
  let user = User.load(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );

  let value = event.params.amount.toBigDecimal();

  if (user == null) {
    user = createUser(event);
  }

  user.totalAdded = user.totalAdded.plus(value);
  user.save();

  let claimer = event.params.claimer;

  let claimAdded = new ClaimAdded(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  claimAdded.txHash = event.transaction.hash;
  claimAdded.rewardToken = event.params.rewardToken
  claimAdded.tag = event.params.tag
  claimAdded.blockNumber = event.block.number.toI32();
  claimAdded.timestamp = event.block.timestamp.toI32();
  claimAdded.claimer = claimer;
  claimAdded.amount = value;
  claimAdded.epochTimestamp = event.params.epochTimestamp
  claimAdded.save();
}

export function handleClaimRemoved(event: ClaimRemovedEvent): void {
  let user = User.load(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );

  if (user == null) {
    return;
  }

  let claimer = event.params.claimer;
  let value = event.params.amount.toBigDecimal();

  user.totalAdded = user.totalAdded.minus(value);
  user.save();

  let claimRemoved = new ClaimRemoved(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  claimRemoved.txHash = event.transaction.hash;
  claimRemoved.rewardToken = event.params.rewardToken
  claimRemoved.blockNumber = event.block.number.toI32();
  claimRemoved.timestamp = event.block.timestamp.toI32();
  claimRemoved.claimer = claimer;
  claimRemoved.amount = value;
  claimRemoved.save();
}

export function handleClaim(event: ClaimEvent): void {
  let user = User.load(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );

  if (user == null) {
    return;
  }

  let claimer = event.params.claimer;
  let value = event.params.amount.toBigDecimal();

  user.totalClaimed = user.totalClaimed.plus(value);
  user.save();

  let claim = new Claim(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  claim.txHash = event.transaction.hash;
  claim.rewardToken = event.params.rewardToken
  claim.blockNumber = event.block.number.toI32();
  claim.timestamp = event.block.timestamp.toI32();
  claim.claimer = claimer;
  claim.amount = value;
  claim.save();
}

export function createUser(event: ClaimAddedEvent): User {
  let user = new User(
    event.params.claimer.toHex() + "-" + event.params.rewardToken.toHex()
  );
  user.address = event.params.claimer;
  user.rewardToken = event.params.rewardToken;
  user.totalAdded = ZERO;
  user.totalClaimed = ZERO;
  return user;
}
