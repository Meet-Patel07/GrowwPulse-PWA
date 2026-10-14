import { Stock, MarketIndex, PriceAlert } from '../types/market';
import { INITIAL_STOCKS, INITIAL_INDICES } from '../data/mockStocks';
import { soundEffects } from './soundEffects';
import { fetchAllLiveMarketQuotes, RealQuote } from './realMarketApi';

type MarketListener = (data: { stocks: Stock[]; indices: MarketIndex[]; isRealApiConnected: boolean }) => void;
type AlertTriggerListener = (alert: PriceAlert, currentPrice: number) => void;

class MarketSimulationEngine {
  private stocks: Stock[] = JSON.parse(JSON.stringify(INITIAL_STOCKS));
  private indices: MarketIndex[] = JSON.parse(JSON.stringify(INITIAL_INDICES));
  private listeners: Set<MarketListener> = new Set();
  private alertListeners: Set<AlertTriggerListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private realApiIntervalId: ReturnType<typeof setInterval> | null = null;
  private isLive: boolean = true;
  private isRealApiConnected: boolean = false;
  private activeAlerts: PriceAlert[] = [];

  constructor() {
    this.startEngine();
    this.syncRealMarketQuotes();
  }

  public setAlerts(alerts: PriceAlert[]) {
    this.activeAlerts = alerts;
  }

  public subscribe(listener: MarketListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener({ stocks: this.stocks, indices: this.indices, isRealApiConnected: this.isRealApiConnected });
    return () => {
      this.listeners.delete(listener);
    };
  }

  public onAlertTrigger(listener: AlertTriggerListener): () => void {
    this.alertListeners.add(listener);
    return () => {
      this.alertListeners.delete(listener);
    };
  }

  public toggleLive(): boolean {
    this.isLive = !this.isLive;
    if (this.isLive) {
      this.startEngine();
    } else {
      this.stopEngine();
    }
    return this.isLive;
  }

  public getIsLive(): boolean {
    return this.isLive;
  }

  public getIsRealApiConnected(): boolean {
    return this.isRealApiConnected;
  }

  public getCurrentState() {
    return { stocks: this.stocks, indices: this.indices, isRealApiConnected: this.isRealApiConnected };
  }

  private startEngine() {
    if (this.intervalId) clearInterval(this.intervalId);
    // High-speed sub-second tick heartbeat (750ms)
    this.intervalId = setInterval(() => {
      if (!this.isLive) return;
      this.tick();
    }, 750);

    // Fast Real API sync every 10 seconds
    if (this.realApiIntervalId) clearInterval(this.realApiIntervalId);
    this.realApiIntervalId = setInterval(() => {
      if (!this.isLive) return;
      this.syncRealMarketQuotes();
    }, 10000);
  }

  private stopEngine() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.realApiIntervalId) {
      clearInterval(this.realApiIntervalId);
      this.realApiIntervalId = null;
    }
  }

  // Fetch real market quotes from live NSE / BSE exchange API
  public async syncRealMarketQuotes() {
    try {
      const liveQuotes = await fetchAllLiveMarketQuotes();
      const keys = Object.keys(liveQuotes);
      if (keys.length === 0) return;

      this.isRealApiConnected = true;

      // Update Stocks with Real Market Data
      this.stocks = this.stocks.map(stock => {
        const quote = liveQuotes[stock.id];
        if (!quote || quote.price <= 0) return stock;

        const prevPrice = stock.currentPrice;
        const newPrice = quote.price;
        const direction: 'up' | 'down' | 'neutral' = newPrice > prevPrice ? 'up' : newPrice < prevPrice ? 'down' : 'neutral';

        // Update 1D candles with real high/low/close
        const dayCandles = stock.candles['1D'];
        if (dayCandles && dayCandles.length > 0) {
          const lastCandle = { ...dayCandles[dayCandles.length - 1] };
          lastCandle.close = newPrice;
          lastCandle.high = Math.max(lastCandle.high, quote.high, newPrice);
          lastCandle.low = Math.min(lastCandle.low, quote.low, newPrice);
          dayCandles[dayCandles.length - 1] = lastCandle;
        }

        this.checkAlerts(stock.id, newPrice);

        return {
          ...stock,
          currentPrice: newPrice,
          change: quote.change,
          percentChange: quote.percentChange,
          lastTickDirection: direction,
          fundamentals: {
            ...stock.fundamentals,
            todayHigh: Math.max(stock.fundamentals.todayHigh, quote.high),
            todayLow: Math.min(stock.fundamentals.todayLow, quote.low),
            prevClose: quote.prevClose,
            volume: Math.max(stock.fundamentals.volume, quote.volume),
          },
        };
      });

      // Update Indices with Real Market Data
      this.indices = this.indices.map(idx => {
        const quote = liveQuotes[idx.symbol];
        if (!quote || quote.price <= 0) return idx;

        const sparkline = [...idx.sparkline.slice(1), quote.price];
        return {
          ...idx,
          currentPrice: quote.price,
          change: quote.change,
          percentChange: quote.percentChange,
          sparkline,
        };
      });

      this.notifyListeners();
    } catch {
      // Continue running
    }
  }

  private tick() {
    // Pick 12 to 20 stocks to tick simultaneously on every sub-second pulse
    const countToUpdate = Math.floor(Math.random() * 9) + 12;
    const indicesToPick = new Set<number>();
    while (indicesToPick.size < countToUpdate && indicesToPick.size < this.stocks.length) {
      indicesToPick.add(Math.floor(Math.random() * this.stocks.length));
    }

    indicesToPick.forEach(idx => {
      const stock = this.stocks[idx];
      const prevPrice = stock.currentPrice;

      // Realistic stochastic high-frequency micro-movement (-0.12% to +0.13%)
      const deltaPercent = (Math.random() - 0.492) * 0.0025;
      const rawNewPrice = stock.currentPrice * (1 + deltaPercent);
      const newPrice = Number(rawNewPrice.toFixed(2));

      if (newPrice === prevPrice) return;

      const direction: 'up' | 'down' = newPrice > prevPrice ? 'up' : 'down';
      const change = Number((newPrice - stock.fundamentals.prevClose).toFixed(2));
      const percentChange = Number(((change / stock.fundamentals.prevClose) * 100).toFixed(2));

      const todayHigh = Math.max(stock.fundamentals.todayHigh, newPrice);
      const todayLow = Math.min(stock.fundamentals.todayLow, newPrice);
      const volume = stock.fundamentals.volume + Math.floor(Math.random() * 200 + 15);

      // Update last candle in 1D timeframe
      const dayCandles = stock.candles['1D'];
      if (dayCandles && dayCandles.length > 0) {
        const lastCandle = { ...dayCandles[dayCandles.length - 1] };
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.volume += Math.floor(Math.random() * 25);
        dayCandles[dayCandles.length - 1] = lastCandle;
      }

      this.stocks[idx] = {
        ...stock,
        currentPrice: newPrice,
        change,
        percentChange,
        lastTickDirection: direction,
        fundamentals: {
          ...stock.fundamentals,
          todayHigh,
          todayLow,
          volume,
        },
      };

      this.checkAlerts(stock.id, newPrice);
    });

    // Also micro-tick benchmark indices every cycle
    this.indices = this.indices.map(idx => {
      const delta = (Math.random() - 0.495) * 0.0008;
      const newPrice = Number((idx.currentPrice * (1 + delta)).toFixed(2));
      const change = Number((idx.change + (newPrice - idx.currentPrice)).toFixed(2));
      const percentChange = Number(((change / (newPrice - change)) * 100).toFixed(2));
      const sparkline = [...idx.sparkline.slice(1), newPrice];

      return {
        ...idx,
        currentPrice: newPrice,
        change,
        percentChange,
        sparkline,
      };
    });

    this.notifyListeners();
  }

  private notifyListeners() {
    const payload = {
      stocks: [...this.stocks],
      indices: [...this.indices],
      isRealApiConnected: this.isRealApiConnected,
    };
    this.listeners.forEach(fn => fn(payload));
  }

  private checkAlerts(stockId: string, currentPrice: number) {
    if (!this.activeAlerts || this.activeAlerts.length === 0) return;

    this.activeAlerts.forEach(alert => {
      if (alert.stockId === stockId && !alert.triggered) {
        let isHit = false;
        if (alert.condition === 'ABOVE' && currentPrice >= alert.targetPrice) {
          isHit = true;
        } else if (alert.condition === 'BELOW' && currentPrice <= alert.targetPrice) {
          isHit = true;
        }

        if (isHit) {
          alert.triggered = true;
          soundEffects.playAlert();
          this.alertListeners.forEach(listener => listener(alert, currentPrice));
        }
      }
    });
  }
}

export const marketEngine = new MarketSimulationEngine();
