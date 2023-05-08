import {
  Transfer,
} from "../generated/stkLyra/ERC20";
import { TokenTransfer } from "../generated/schema";
import { BigInt } from "@graphprotocol/graph-ts";

export function handleTransfer(event: Transfer): void {
  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value.toBigDecimal();

  let transfer = new TokenTransfer(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  transfer.txHash = event.transaction.hash;
  transfer.blockNumber = event.block.number.toI32();
  transfer.timestamp = event.block.timestamp.toI32();
  transfer.to = to;
  transfer.from = from;
  transfer.amount = value;
  transfer.save();
}
