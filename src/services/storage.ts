import { Holding, Order, PriceAlert } from '../types/market';

const KEYS = {
  BALANCE: 'growwpulse_wallet_balance',
  HOLDINGS: 'growwpulse_holdings',
  ORDERS: 'growwpulse_orders',
  WATCHLIST: 'growwpulse_watchlist',
  ALERTS: 'growwpulse_alerts',
  SETTINGS: 'growwpulse_settings',
};

const DEFAULT_INITIAL_BALANCE = 500000; // ₹ 5,00,000 Virtual Capital

export const storage = {
  getBalance(): number {
    const val = localStorage.getItem(KEYS.BALANCE);
    return val !== null ? Number(val) : DEFAULT_INITIAL_BALANCE;
  },

  setBalance(bal: number) {
    localStorage.setItem(KEYS.BALANCE, bal.toString());
  },

  getHoldings(): Holding[] {
    try {
      const val = localStorage.getItem(KEYS.HOLDINGS);
      if (val) return JSON.parse(val);
    } catch {
      // fallback
    }
    // Initial starter portfolio for realistic look
    return [
      {
        stockId: 'tatamotors',
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Passenger Vehicles',
        quantity: 50,
        averageBuyPrice: 910.00,
        currentPrice: 948.70,
        investedValue: 45500.00,
        currentValue: 47435.00,
        totalPnL: 1935.00,
        percentPnL: 4.25,
        dayPnL: 1115.00,
        sector: 'Automobiles',
      },
      {
        stockId: 'zomato',
        symbol: 'ZOMATO',
        name: 'Zomato & Blinkit Commerce',
        quantity: 200,
        averageBuyPrice: 252.00,
        currentPrice: 274.85,
        investedValue: 50400.00,
        currentValue: 54970.00,
        totalPnL: 4570.00,
        percentPnL: 9.07,
        dayPnL: 1690.00,
        sector: 'Consumer Internet',
      },
    ];
  },

  setHoldings(holdings: Holding[]) {
    localStorage.setItem(KEYS.HOLDINGS, JSON.stringify(holdings));
  },

  getOrders(): Order[] {
    try {
      const val = localStorage.getItem(KEYS.ORDERS);
      if (val) return JSON.parse(val);
    } catch {
      // fallback
    }
    const now = Date.now();
    return [
      {
        id: 'ord-101',
        stockId: 'tatamotors',
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Passenger Vehicles',
        side: 'BUY',
        orderType: 'MARKET',
        productType: 'DELIVERY',
        quantity: 50,
        price: 910.00,
        executedPrice: 910.00,
        status: 'EXECUTED',
        timestamp: now - 3600000 * 24,
      },
      {
        id: 'ord-102',
        stockId: 'zomato',
        symbol: 'ZOMATO',
        name: 'Zomato & Blinkit Commerce',
        side: 'BUY',
        orderType: 'MARKET',
        productType: 'DELIVERY',
        quantity: 200,
        price: 252.00,
        executedPrice: 252.00,
        status: 'EXECUTED',
        timestamp: now - 3600000 * 48,
      },
    ];
  },

  setOrders(orders: Order[]) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
  },

  getWatchlist(): string[] {
    try {
      const val = localStorage.getItem(KEYS.WATCHLIST);
      if (val) return JSON.parse(val);
    } catch {
      // fallback
    }
    return ['reliance', 'tatamotors', 'zomato', 'tcs', 'sbin'];
  },

  setWatchlist(list: string[]) {
    localStorage.setItem(KEYS.WATCHLIST, JSON.stringify(list));
  },

  getAlerts(): PriceAlert[] {
    try {
      const val = localStorage.getItem(KEYS.ALERTS);
      if (val) return JSON.parse(val);
    } catch {
      // fallback
    }
    return [
      {
        id: 'alt-1',
        stockId: 'reliance',
        symbol: 'RELIANCE',
        name: 'Reliance Industries Ltd.',
        targetPrice: 3000.00,
        condition: 'ABOVE',
        triggered: false,
        createdAt: Date.now() - 3600000 * 5,
      },
      {
        id: 'alt-2',
        stockId: 'tatamotors',
        symbol: 'TATAMOTORS',
        name: 'Tata Motors Passenger Vehicles',
        targetPrice: 960.00,
        condition: 'ABOVE',
        triggered: false,
        createdAt: Date.now() - 3600000 * 2,
      },
    ];
  },

  setAlerts(alerts: PriceAlert[]) {
    localStorage.setItem(KEYS.ALERTS, JSON.stringify(alerts));
  },

  resetAllData() {
    localStorage.removeItem(KEYS.BALANCE);
    localStorage.removeItem(KEYS.HOLDINGS);
    localStorage.removeItem(KEYS.ORDERS);
    localStorage.removeItem(KEYS.WATCHLIST);
    localStorage.removeItem(KEYS.ALERTS);
  },
};
