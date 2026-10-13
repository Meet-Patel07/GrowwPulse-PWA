import { Stock, MarketIndex, PriceAlert } from '../types/market';
import { INITIAL_STOCKS, INITIAL_INDICES } from '../data/mockStocks';
import { soundEffects } from './soundEffects';

type MarketListener = (data: { stocks: Stock[]; indices: MarketIndex[] }) => void;
type AlertTriggerListener = (alert: PriceAlert, currentPrice: number) => void;

class MarketSimulationEngine {
  private stocks: Stock[] = JSON.parse(JSON.stringify(INITIAL_STOCKS));
  private indices: MarketIndex[] = JSON.parse(JSON.stringify(INITIAL_INDICES));
  private listeners: Set<MarketListener> = new Set();
  private alertListeners: Set<AlertTriggerListener> = new Set();
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private isLive: boolean = true;
  private activeAlerts: PriceAlert[] = [];

  constructor() {
    this.startEngine();
  }

  public setAlerts(alerts: PriceAlert[]) {
    this.activeAlerts = alerts;
  }

  public subscribe(listener: MarketListener): () => void {
    this.listeners.add(listener);
    // Emit immediate current state
    listener({ stocks: this.stocks, indices: this.indices });
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

  public getCurrentState() {
    return { stocks: this.stocks, indices: this.indices };
  }

  private startEngine() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (!this.isLive) return;
      this.tick();
    }, 1600);
  }

  private stopEngine() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private tick() {
    // 1. Pick 3 to 6 random stocks to tick this cycle (simulating real exchange traffic)
    const countToUpdate = Math.floor(Math.random() * 4) + 3;
    const indicesToPick = new Set<number>();
    while (indicesToPick.size < countToUpdate && indicesToPick.size < this.stocks.length) {
      indicesToPick.add(Math.floor(Math.random() * this.stocks.length));
    }

    indicesToPick.forEach(idx => {
      const stock = this.stocks[idx];
      const prevPrice = stock.currentPrice;

      // Realistic stochastic micro-movement (-0.35% to +0.38%)
      const deltaPercent = (Math.random() - 0.485) * 0.005;
      const rawNewPrice = stock.currentPrice * (1 + deltaPercent);
      const newPrice = Number(rawNewPrice.toFixed(2));

      if (newPrice === prevPrice) return;

      const direction: 'up' | 'down' = newPrice > prevPrice ? 'up' : 'down';
      const change = Number((newPrice - stock.fundamentals.prevClose).toFixed(2));
      const percentChange = Number(((change / stock.fundamentals.prevClose) * 100).toFixed(2));

      // Update High/Low
      const todayHigh = Math.max(stock.fundamentals.todayHigh, newPrice);
      const todayLow = Math.min(stock.fundamentals.todayLow, newPrice);
      const volume = stock.fundamentals.volume + Math.floor(Math.random() * 350 + 50);

      // Update last candle in 1D timeframe
      const dayCandles = stock.candles['1D'];
      if (dayCandles && dayCandles.length > 0) {
        const lastCandle = { ...dayCandles[dayCandles.length - 1] };
        lastCandle.close = newPrice;
        lastCandle.high = Math.max(lastCandle.high, newPrice);
        lastCandle.low = Math.min(lastCandle.low, newPrice);
        lastCandle.volume += Math.floor(Math.random() * 50);
        dayCandles[dayCandles.length - 1] = lastCandle;
      }

      // Update Order Book Depth
      const bidDiff = direction === 'up' ? 0.15 : -0.15;
      const bids = stock.marketDepth.bids.map(b => ({
        ...b,
        price: Number((b.price + bidDiff * 0.1).toFixed(2)),
        quantity: Math.max(500, b.quantity + Math.floor((Math.random() - 0.48) * 200)),
      }));
      const asks = stock.marketDepth.asks.map(a => ({
        ...a,
        price: Number((a.price + bidDiff * 0.1).toFixed(2)),
        quantity: Math.max(500, a.quantity + Math.floor((Math.random() - 0.48) * 200)),
      }));

      const buyTotal = bids.reduce((acc, curr) => acc + curr.quantity, 0);
      const sellTotal = asks.reduce((acc, curr) => acc + curr.quantity, 0);
      const totalDepth = buyTotal + sellTotal;

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
        marketDepth: {
          buyTotal,
          sellTotal,
          buyPercentage: Math.round((buyTotal / totalDepth) * 100),
          sellPercentage: Math.round((sellTotal / totalDepth) * 100),
          bids,
          asks,
        },
      };

      // Check Alerts for this stock
      this.checkAlerts(stock.id, newPrice);
    });

    // 2. Micro-tick Indices based on aggregate trend
    this.indices = this.indices.map(idx => {
      const idxDelta = (Math.random() - 0.48) * 0.0015;
      const newPrice = Number((idx.currentPrice * (1 + idxDelta)).toFixed(2));
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

    // 3. Notify subscribers
    const payload = { stocks: [...this.stocks], indices: [...this.indices] };
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
