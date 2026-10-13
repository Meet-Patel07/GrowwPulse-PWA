export type TimeFrame = '1D' | '1W' | '1M' | '1Y' | '5Y' | 'ALL';
export type ChartType = 'area' | 'candle';
export type OrderType = 'MARKET' | 'LIMIT';
export type ProductType = 'DELIVERY' | 'INTRADAY';
export type OrderSide = 'BUY' | 'SELL';

export interface CandleData {
  time: string;
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketIndex {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  sparkline: number[];
}

export interface StockFundamentals {
  marketCap: string; // e.g., "₹ 20,45,200 Cr"
  peRatio: number;
  pbRatio: number;
  industryPE: number;
  debtToEquity: number;
  roe: number;
  divYield: number;
  todayLow: number;
  todayHigh: number;
  yearLow: number;
  yearHigh: number;
  openPrice: number;
  prevClose: number;
  volume: number;
}

export interface OrderBookLevel {
  price: number;
  orders: number;
  quantity: number;
}

export interface MarketDepth {
  buyTotal: number;
  sellTotal: number;
  buyPercentage: number;
  sellPercentage: number;
  bids: OrderBookLevel[];
  asks: OrderBookLevel[];
}

export interface Stock {
  id: string;
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  sparkline: number[];
  candles: {
    [key in TimeFrame]: CandleData[];
  };
  fundamentals: StockFundamentals;
  marketDepth: MarketDepth;
  description: string;
  lastTickDirection?: 'up' | 'down' | 'neutral';
}

export interface Holding {
  stockId: string;
  symbol: string;
  name: string;
  quantity: number;
  averageBuyPrice: number;
  currentPrice: number;
  investedValue: number;
  currentValue: number;
  totalPnL: number;
  percentPnL: number;
  dayPnL: number;
  sector: string;
}

export interface Order {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  side: OrderSide;
  orderType: OrderType;
  productType: ProductType;
  quantity: number;
  price: number;
  executedPrice: number;
  status: 'EXECUTED' | 'CANCELLED' | 'PENDING';
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  stockId: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
  triggered: boolean;
  createdAt: number;
}

export interface MarketNews {
  id: string;
  headline: string;
  source: string;
  timeAgo: string;
  category: 'MARKET' | 'STOCKS' | 'ECONOMY' | 'EARNINGS';
  relatedSymbol?: string;
}
