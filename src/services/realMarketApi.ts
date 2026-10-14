// Real Market API Service for Live NSE / BSE Quotes

export interface RealQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  prevClose: number;
  volume: number;
}

export const TICKER_MAP: { [key: string]: { yahooSymbol: string; name: string } } = {
  // Benchmark Indices
  'NIFTY 50': { yahooSymbol: '^NSEI', name: 'NIFTY 50' },
  'SENSEX': { yahooSymbol: '^BSESN', name: 'SENSEX' },
  'BANK NIFTY': { yahooSymbol: '^NSEBANK', name: 'BANK NIFTY' },
  'NIFTY IT': { yahooSymbol: '^CNXIT', name: 'NIFTY IT' },

  // Equities
  'reliance': { yahooSymbol: 'RELIANCE.NS', name: 'RELIANCE' },
  'tcs': { yahooSymbol: 'TCS.NS', name: 'TCS' },
  'hdfcbank': { yahooSymbol: 'HDFCBANK.NS', name: 'HDFCBANK' },
  'tatamotors': { yahooSymbol: 'TMPV.NS', name: 'TATAMOTORS' },
  'infy': { yahooSymbol: 'INFY.NS', name: 'INFY' },
  'zomato': { yahooSymbol: 'ETERNAL.NS', name: 'ZOMATO' },
  'itc': { yahooSymbol: 'ITC.NS', name: 'ITC' },
  'sbin': { yahooSymbol: 'SBIN.NS', name: 'SBIN' },
  'adanient': { yahooSymbol: 'ADANIENT.NS', name: 'ADANIENT' },
  'bhartiartl': { yahooSymbol: 'BHARTIARTL.NS', name: 'BHARTIARTL' },
  'tatasteel': { yahooSymbol: 'TATASTEEL.NS', name: 'TATASTEEL' },
  'bajfinance': { yahooSymbol: 'BAJFINANCE.NS', name: 'BAJFINANCE' },
};

export async function fetchLiveQuote(yahooSymbol: string): Promise<RealQuote | null> {
  const targetUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1d&range=1d`;
  
  // Try 3 sources: Local / Netlify Proxy -> AllOrigins Proxy -> Direct
  const endpoints = [
    `/api/market?symbol=${encodeURIComponent(yahooSymbol)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    targetUrl,
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers: { Accept: 'application/json' } });
      if (!res.ok) continue;
      const data = await res.json();
      
      const result = data?.chart?.result?.[0];
      if (!result?.meta) continue;

      const meta = result.meta;
      const price = Number(meta.regularMarketPrice?.toFixed(2)) || 0;
      const prevClose = Number(meta.chartPreviousClose?.toFixed(2)) || price;
      const change = Number((price - prevClose).toFixed(2));
      const percentChange = prevClose > 0 ? Number(((change / prevClose) * 100).toFixed(2)) : 0;
      const high = Number(meta.regularMarketDayHigh?.toFixed(2)) || price;
      const low = Number(meta.regularMarketDayLow?.toFixed(2)) || price;
      const volume = meta.regularMarketVolume || 100000;

      return {
        symbol: yahooSymbol,
        name: meta.shortName || yahooSymbol,
        price,
        change,
        percentChange,
        high,
        low,
        prevClose,
        volume,
      };
    } catch {
      // Continue to next endpoint
    }
  }

  return null;
}

export async function fetchAllLiveMarketQuotes(): Promise<{ [id: string]: RealQuote }> {
  const results: { [id: string]: RealQuote } = {};
  const entries = Object.entries(TICKER_MAP);

  await Promise.all(
    entries.map(async ([id, item]) => {
      const quote = await fetchLiveQuote(item.yahooSymbol);
      if (quote) {
        results[id] = quote;
      }
    })
  );

  return results;
}
