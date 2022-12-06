import { GlobalAddressUpdated, MarketUpdated } from "../generated/LyraRegistry/LyraRegistry";
import { ERC20, OptionMarketWrapper, LiquidityPool as LPTemplate } from "../generated/templates";
import { Token, LiquidityPool } from "../generated/schema";
import { loadOrCreateToken } from "./mapping";

//Initializes all datasources and entities for the new market
export function handleMarketUpdated(event: MarketUpdated): void {
  let token = Token.load(event.params.market.baseAsset.toHex());
  if (token == null) {
    ERC20.create(event.params.market.baseAsset);
    loadOrCreateToken(event.params.market.baseAsset);
  }

  let lp = LiquidityPool.load(event.params.market.liquidityPool.toHex())
  if (lp == null) {
    LPTemplate.create(event.params.market.liquidityPool);
  }
}

export function handleGlobalAddressUpdated(event: GlobalAddressUpdated): void {
  let changedAddress = event.params.name.toString()

  if (changedAddress == 'MARKET_WRAPPER') {
    OptionMarketWrapper.create(event.params.addr)
  }
}