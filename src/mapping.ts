import { BigDecimal, ethereum, Bytes, Address } from "@graphprotocol/graph-ts";

import {
  ERC20,
  Transfer,
} from "../generated/ERC20_0x8c6f28f2f1a3c87f0f938b96d27520d9751ec8d9/ERC20";
import { Token, TokenTransfer, User } from "../generated/schema";

export function loadOrCreateToken(address: Address): Token | null {
  let token = Token.load(address.toHex());
  if (!token) {
    let erc20 = ERC20.bind(address);

    let nameResult = erc20.try_name();
    if (nameResult.reverted) {
      return null;
    }

    let symbolResult = erc20.try_symbol();
    if (symbolResult.reverted) {
      return null;
    }

    let decimalsResult = erc20.try_decimals();
    if (decimalsResult.reverted) {
      return null;
    }

    token = new Token(address.toHex());
    token.name = nameResult.value;
    token.symbol = symbolResult.value;
    token.decimals = decimalsResult.value.toI32();
    token.save();
  }
  return token;
}

export function handleTransfer(event: Transfer): void {
  let token = loadOrCreateToken(event.address);
  if (!token) {
    return;
  }

  let from = event.params.from;
  let to = event.params.to;
  let value = event.params.value.toBigDecimal();

  let userFrom = User.load(from.toHex());
  let userTo = User.load(to.toHex());

  if (userFrom == null && userTo == null) {
    return;
  }

  let transfer = new TokenTransfer(
    event.transaction.hash.toHex() + event.logIndex.toString()
  );
  transfer.token = token.id;
  transfer.txHash = event.transaction.hash;
  transfer.blockNumber = event.block.number.toI32();
  transfer.timestamp = event.block.timestamp.toI32();
  transfer.to = to;
  transfer.from = from;
  transfer.amount = value;
  transfer.save();
}
