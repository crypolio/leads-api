"use strict";

const ORDERBOOK_ASKS = "asks";

const ORDERBOOK_BIDS = "bids";

const ORDERBOOK_AGGREGATED_TYPES = {
  ask: ORDERBOOK_ASKS,
  bid: ORDERBOOK_BIDS,
};

const SUPPORTED_MARKET_EVENT_TYPES = {
  TRADES: "trades",
  MARKETS: "markets",
  TICKERS: "tickers",
  ORDERBOOKS: "orderbooks",
};

const SUPPORTED_MARKETS_EVENTS = [
  SUPPORTED_MARKET_EVENT_TYPES.TRADES,
  SUPPORTED_MARKET_EVENT_TYPES.MARKETS,
  SUPPORTED_MARKET_EVENT_TYPES.TICKERS,
  SUPPORTED_MARKET_EVENT_TYPES.ORDERBOOKS,
];

const constants = {
  DEFAULT_BASE_PAGE: 1,
  DEFAULT_PAGE_SIZE: 50,
  SUPPORTED_MARKETS_EVENTS,
  ORDERBOOK_AGGREGATED_TYPES,
  SUPPORTED_MARKET_EVENT_TYPES,
  DEFAULT_ASSET_TYPE: "crypto",
  DEFAULT_CURRENCY_PRECISION: 8,
  DEFAULT_MINOR_CURRENCY: 100000000,
  SUPPORTED_PAGE_SIZES: [50, 100, 200, 500],
  DEFAULT_MIN_IMPORTS: ["tickers", "trades", "orderbooks"],
  SUPPORTED_ASSET_TYPES: ["fiat", "crypto", "equity", "bond", "etf"], // TODO: Fetch from database & set on init.
  SUPPORTED_ASSET_INDICES: [
    "fiat_idx",
    "crypto_idx",
    "equity_idx",
    "bond_idx",
    "etf_idx",
  ],
};

export default constants;
