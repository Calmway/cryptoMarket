export interface CurrencyPair {
  primary: string;
  secondary: string;
}

export interface PriceInfo {
  last: string;
  bestBid: string;
  bestOffer: string;
  change: ChangeInfo;
}

export interface ChangeInfo {
  direction: "Up" | "Down" | string;
  percent: string;
  amount: string;
}

export interface VolumeInfo {
  primary: string;
  secondary: string;
}

export class MarketDataData {
  pair: CurrencyPair | null = null;
  price: PriceInfo | null = null;
  change: ChangeInfo | null = null;
  priceHistory: string[] | null = null;
  volume: VolumeInfo | null = null;
}
